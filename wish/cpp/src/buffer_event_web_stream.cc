// Copyright 2026 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#include "buffer_event_web_stream.h"

#include <absl/base/optimization.h>
#include <absl/log/log.h>
#include <event2/buffer.h>
#include <event2/bufferevent.h>
#include <event2/event.h>
#include <wslay/wslay.h>

#include <algorithm>
#include <cstring>
#include <random>
#include <sstream>
#include <vector>

BufferEventWebStream::BufferEventWebStream(bufferevent* bev,
                                           bool is_server)
    : bev_(bev),
      is_server_(is_server),
      ctx_(nullptr),
      state_(OPEN) {}

bool BufferEventWebStream::Init() {
  wslay_event_callbacks callbacks = {
      WslayRecvCallback,
      WslaySendCallback,
      WslayGenmaskCallback,
      WslayOnFrameRecvStartCallback,
      nullptr,  // on_frame_recv_chunk_callback
      nullptr,  // on_frame_recv_end_callback
      WslayOnMsgRecvCallback};

  int rv;
  if (is_server_) {
    rv = wslay_event_context_server_init(&ctx_,
                                         &callbacks,
                                         this);
  } else {
    rv = wslay_event_context_client_init(&ctx_,
                                         &callbacks,
                                         this);
  }
  return rv == 0;
}

BufferEventWebStream::~BufferEventWebStream() {
  wslay_event_context_free(ctx_);

  if (bev_) {
    bufferevent_setcb(bev_,
                      nullptr,
                      nullptr,
                      nullptr,
                      nullptr);
    bufferevent_free(bev_);
  }
}

void BufferEventWebStream::SetCleanupCallback(CleanupCallback cb) {
  cleanup_cb_ = std::move(cb);
}

void BufferEventWebStream::Start() {
  bufferevent_setcb(bev_,
                    ReadCallback,
                    nullptr,
                    EventCallback,
                    this);

  int enable_rv = bufferevent_enable(bev_, EV_READ | EV_WRITE);
  if (enable_rv != 0) {
    VLOG(1) << "bufferevent_enable() failed";
  }

  // If there is already data in the input buffer, process it immediately.
  size_t input_len = evbuffer_get_length(bufferevent_get_input(bev_));
  if (input_len > 0) {
    ReadCallback(bev_, this);
  }
}

void BufferEventWebStream::SetOnMessage(MessageCallback cb) { on_message_ = cb; }

void BufferEventWebStream::SetOnClose(CloseCallback cb) { on_close_ = cb; }

void BufferEventWebStream::SetOnError(ErrorCallback cb) { on_error_ = cb; }

// ---- Public send methods ----

int BufferEventWebStream::SendText(const std::string& msg) {
  return SendMessage(WEB_STREAM_OPCODE_TEXT, msg);
}

int BufferEventWebStream::SendBinary(const std::string& msg) {
  return SendMessage(WEB_STREAM_OPCODE_BINARY, msg);
}

int BufferEventWebStream::SendMetadata(const std::string& msg) {
  return SendMessage(WEB_STREAM_OPCODE_METADATA, msg);
}

int BufferEventWebStream::Close() {
  if (close_pending_) {
    return -1;
  }
  close_pending_ = true;

  // Write the terminal zero-length chunk that signals end-of-body to the peer.
  static constexpr char kTerminalChunk[] = "0\r\n\r\n";
  int rv = bufferevent_write(bev_, kTerminalChunk, sizeof(kTerminalChunk) - 1);
  if (rv != 0) {
    VLOG(3) << "bufferevent_write() failed";

    return -1;
  }

  return 0;
}

// ---- libevent callbacks ----

void BufferEventWebStream::ReadCallback(bufferevent* bev, void* ctx) {
  BufferEventWebStream* stream = static_cast<BufferEventWebStream*>(ctx);

  for (;;) {
    switch (stream->state_) {
      case OPEN: {
        int rv = wslay_event_recv(stream->ctx_);
        if (rv != 0) {
          VLOG(2) << "wslay_event_recv() failed: " << rv;
          return;
        }

        // The inbound terminal chunk was fully consumed by ReadChunkedBytes().
        if (stream->receive_closed_) {
          // Check for any extra data received after the terminal chunk
          evbuffer* input = bufferevent_get_input(stream->bev_);
          size_t extra_len = evbuffer_get_length(input);
          if (extra_len > 0) {
            VLOG(2) << "Warning: received " << extra_len << " bytes of extra data after stream close.";

            if (evbuffer_drain(input, extra_len) != 0) {
              VLOG(2) << "evbuffer_drain failed";
            }
          }

          // Keep the read callback as ReadCallback; receive direction is done.
          // Do NOT set state_ = CLOSED yet: on_close_() may still call Close()
          // to queue the outbound terminal chunk, and we need the output buffer
          // to drain before freeing the stream.
          bufferevent_setcb(stream->bev_,
                            ReadCallback,
                            nullptr,
                            EventCallback,
                            stream);

          if (stream->in_message_) {
            if (stream->on_error_) {
              stream->on_error_();
            }
          } else {
            if (stream->on_close_) {
              stream->on_close_();
            }
          }

          if (stream->close_pending_) {
            stream->state_ = DRAINING;
            bufferevent_setcb(stream->bev_,
                              ReadCallback,
                              DrainCallback,
                              EventCallback,
                              stream);

            stream->TryDrain();
          } else {
            stream->state_ = CLOSED;
            auto cleanup = std::move(stream->cleanup_cb_);
            if (cleanup) {
              cleanup(stream);
            }
          }
          return;
        }

        return;
      }
      case DRAINING: {
        evbuffer* input = bufferevent_get_input(stream->bev_);
        size_t len = evbuffer_get_length(input);
        if (len > 0) {
          VLOG(2) << "Warning: received " << len << " bytes of extra data after stream close.";

          if (evbuffer_drain(input, len) != 0) {
            VLOG(2) << "evbuffer_drain failed";
          }
        }
        return;
      }
      case CLOSED:
        return;
      default:
        ABSL_UNREACHABLE();
    }
  }
}

void BufferEventWebStream::DrainCallback(bufferevent* /*bev*/,
                                         void* ctx) {
  BufferEventWebStream* stream = static_cast<BufferEventWebStream*>(ctx);

  stream->TryDrain();
}

void BufferEventWebStream::EventCallback(bufferevent* bev,
                                         short what,  // NOLINT(runtime/int)
                                         void* ctx) {
  if (what & BEV_EVENT_ERROR) {
    int err = EVUTIL_SOCKET_ERROR();
    if (err != 0) {
      VLOG(2) << "Error on socket: " << evutil_socket_error_to_string(err);
    } else {
      VLOG(2) << "Error on bufferevent";
    }
  }

  if (what & (BEV_EVENT_EOF | BEV_EVENT_ERROR)) {
    BufferEventWebStream* stream = static_cast<BufferEventWebStream*>(ctx);

    // If the stream is still in OPEN state, the underlying connection closed
    // before we received the clean chunked terminal chunk ("0\r\n\r\n").
    // This is always treated as a premature termination/error.
    if (stream->state_ == OPEN) {
      if (stream->on_error_) {
        stream->on_error_();
      }
    }
    auto cleanup = std::move(stream->cleanup_cb_);
    if (cleanup) {
      cleanup(stream);
    }
  }
}

// ---- wslay callbacks ----

ssize_t BufferEventWebStream::WslayRecvCallback(wslay_event_context* /*ctx*/,
                                                uint8_t* buf,
                                                size_t len,
                                                int /*flags*/,
                                                void* user_data) {
  BufferEventWebStream* stream = static_cast<BufferEventWebStream*>(user_data);

  return stream->ReadChunkedBytes(buf, len);
}

ssize_t BufferEventWebStream::WslaySendCallback(wslay_event_context* ctx,
                                                const uint8_t* data,
                                                size_t len,
                                                int /*flags*/,
                                                void* user_data) {
  BufferEventWebStream* stream = static_cast<BufferEventWebStream*>(user_data);

  // Wrap the wslay frame bytes in a single HTTP/1.1 chunk:
  //   <hex-len>\r\n<data>\r\n
  char header[32];
  int header_len = snprintf(header, sizeof(header), "%zx\r\n", len);
  if (header_len <= 0) {
    wslay_event_set_error(ctx, WSLAY_ERR_CALLBACK_FAILURE);

    return -1;
  }

  int write_header_rv = bufferevent_write(stream->bev_,
                                          header,
                                          static_cast<size_t>(header_len));
  if (write_header_rv != 0) {
    VLOG(3) << "bufferevent_write() failed";

    wslay_event_set_error(ctx, WSLAY_ERR_CALLBACK_FAILURE);

    return -1;
  }

  int write_data_rv = bufferevent_write(stream->bev_,
                                        data,
                                        len);
  if (write_data_rv != 0) {
    VLOG(3) << "bufferevent_write() failed";

    wslay_event_set_error(ctx, WSLAY_ERR_CALLBACK_FAILURE);

    return -1;
  }

  int write_trailer_rv = bufferevent_write(stream->bev_,
                                           "\r\n",
                                           2);
  if (write_trailer_rv != 0) {
    VLOG(3) << "bufferevent_write() failed";

    wslay_event_set_error(ctx, WSLAY_ERR_CALLBACK_FAILURE);

    return -1;
  }

  return static_cast<ssize_t>(len);
}

int BufferEventWebStream::WslayGenmaskCallback(wslay_event_context* ctx, uint8_t* buf,
                                               size_t len, void* user_data) {
  ABSL_UNREACHABLE();
  return 0;
}

void BufferEventWebStream::WslayOnMsgRecvCallback(wslay_event_context* ctx,
                                                  const wslay_event_on_msg_recv_arg* arg,
                                                  void* user_data) {
  BufferEventWebStream* stream = static_cast<BufferEventWebStream*>(user_data);

  if (!wslay_is_ctrl_frame(arg->opcode)) {
    stream->in_message_ = false;
  }

  // Consider implementing backpressure.

  if (stream->on_message_) {
    std::string msg(reinterpret_cast<const char*>(arg->msg), arg->msg_length);
    stream->on_message_(arg->opcode, msg);
  }
}

void BufferEventWebStream::WslayOnFrameRecvStartCallback(wslay_event_context* ctx,
                                                         const wslay_event_on_frame_recv_start_arg* arg,
                                                         void* user_data) {
  BufferEventWebStream* stream = static_cast<BufferEventWebStream*>(user_data);

  if (!wslay_is_ctrl_frame(arg->opcode)) {
    stream->in_message_ = true;
  }
}

// ---- Private helpers ----

// Decode Transfer-Encoding: chunked bytes from the inbound bufferevent into
// buf[0..len).  Called by WslayRecvCallback on every wslay recv request.
//
// State machine (persists across calls via chunk_state_ / chunk_remaining_):
//
//   HEADER  — parse "<hex>\r\n"; if size == 0 set receive_closed_ then TRAILER
//   DATA    — copy up to chunk_remaining_ payload bytes into buf
//   TRAILER — consume the "\r\n" that follows each chunk body
//
// Returns the number of bytes placed in buf, or -1 (with wslay error set) when
// no bytes are available yet or a protocol error is detected.
ssize_t BufferEventWebStream::ReadChunkedBytes(uint8_t* buf, size_t len) {
  evbuffer* input = bufferevent_get_input(bev_);

  for (;;) {
    switch (chunk_state_) {
      case ChunkState::HEADER: {
        // Find the "\r\n" that terminates the chunk-size line.
        evbuffer_ptr pos = evbuffer_search(input, "\r\n", 2, nullptr);
        if (pos.pos < 0) {
          wslay_event_set_error(ctx_, WSLAY_ERR_WOULDBLOCK);

          return -1;  // Wait for more data.
        }
        if (pos.pos == 0) {
          VLOG(3) << "ReadChunkedBytes: empty chunk-size line";

          wslay_event_set_error(ctx_, WSLAY_ERR_CALLBACK_FAILURE);

          return -1;
        }

        // Read the entire "<hex>\r\n" line into a temporary buffer.
        size_t line_len = static_cast<size_t>(pos.pos) + 2;  // include \r\n
        std::vector<char> line(line_len + 1, '\0');

        int remove_rv = evbuffer_remove(input, line.data(), line_len);
        if (remove_rv < 0 || static_cast<size_t>(remove_rv) != line_len) {
          VLOG(3) << "ReadChunkedBytes: evbuffer_remove() failed";

          wslay_event_set_error(ctx_, WSLAY_ERR_CALLBACK_FAILURE);

          return -1;
        }

        // Null-terminate at the \r so strtoul sees only hex digits.
        line[pos.pos] = '\0';

        char* end = nullptr;
        unsigned long chunk_size = std::strtoul(line.data(), &end, 16);
        if (end == line.data()) {
          VLOG(3) << "ReadChunkedBytes: malformed chunk size";

          wslay_event_set_error(ctx_, WSLAY_ERR_CALLBACK_FAILURE);

          return -1;
        }

        chunk_remaining_ = static_cast<size_t>(chunk_size);

        if (chunk_remaining_ == 0) {
          // Terminal chunk: signal receive-close after the trailing \r\n.
          terminal_chunk_seen_ = true;

          chunk_state_ = ChunkState::TRAILER;
          continue;  // Consume the TRAILER in the same call.
        }

        chunk_state_ = ChunkState::DATA;
        continue;
      }

      case ChunkState::DATA: {
        size_t avail = evbuffer_get_length(input);
        if (avail == 0) {
          wslay_event_set_error(ctx_, WSLAY_ERR_WOULDBLOCK);

          return -1;
        }

        size_t n = std::min({len, chunk_remaining_, avail});
        int rv = evbuffer_remove(input, buf, n);
        if (rv < 0) {
          VLOG(3) << "ReadChunkedBytes: evbuffer_remove() failed";

          wslay_event_set_error(ctx_, WSLAY_ERR_CALLBACK_FAILURE);

          return -1;
        }
        chunk_remaining_ -= n;
        if (chunk_remaining_ == 0) {
          chunk_state_ = ChunkState::TRAILER;
        }
        return static_cast<ssize_t>(n);
      }

      case ChunkState::TRAILER: {
        size_t input_len = evbuffer_get_length(input);
        if (input_len < 2) {
          wslay_event_set_error(ctx_, WSLAY_ERR_WOULDBLOCK);

          return -1;
        }

        if (evbuffer_drain(input, 2) != 0) {
          VLOG(2) << "evbuffer_drain failed";
        }
        chunk_state_ = ChunkState::HEADER;

        if (terminal_chunk_seen_) {
          receive_closed_ = true;
          // Terminal chunk fully consumed; let ReadCallback close the stream.
          wslay_event_set_error(ctx_, WSLAY_ERR_WOULDBLOCK);

          return -1;
        }

        continue;  // Parse the next chunk header.
      }
    }
  }
}

int BufferEventWebStream::SendMessage(uint8_t opcode, const std::string& msg) {
  if (state_ != OPEN || close_pending_) {
    return -1;
  }

  wslay_event_msg msg_frame = {
      opcode,
      reinterpret_cast<const uint8_t*>(msg.c_str()),
      msg.length()};
  // Queue msg
  int rv = wslay_event_queue_msg(ctx_, &msg_frame);
  if (rv != 0) {
    return rv;
  }

  // Force send
  return wslay_event_send(ctx_);
}

void BufferEventWebStream::TryDrain() {
  size_t output_len = evbuffer_get_length(bufferevent_get_output(bev_));
  if (output_len == 0) {
    state_ = CLOSED;
    auto cleanup = std::move(cleanup_cb_);
    if (cleanup) {
      cleanup(this);
    }
  }
}
