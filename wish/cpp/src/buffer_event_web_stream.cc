#include "buffer_event_web_stream.h"

#include <absl/base/optimization.h>
#include <event2/buffer.h>
#include <event2/bufferevent.h>
#include <event2/event.h>
#include <wslay/wslay.h>

#include <algorithm>
#include <cstring>
#include <iostream>
#include <random>
#include <sstream>
#include <vector>

BufferEventWebStream::BufferEventWebStream(bufferevent* bev,
                                           bool is_server)
    : bev_(bev),
      is_server_(is_server),
      ctx_(nullptr),
      state_(HANDSHAKE) {
  wslay_event_callbacks callbacks = {
      WslayRecvCallback,
      WslaySendCallback,
      WslayGenmaskCallback,
      nullptr,  // on_frame_recv_start_callback
      nullptr,  // on_frame_recv_chunk_callback
      nullptr,  // on_frame_recv_end_callback
      WslayOnMsgRecvCallback};

  if (is_server_) {
    wslay_event_context_server_init(&ctx_,
                                    &callbacks,
                                    this);
  } else {
    wslay_event_context_client_init(&ctx_,
                                    &callbacks,
                                    this);
  }
}

BufferEventWebStream::~BufferEventWebStream() {
  wslay_event_context_free(ctx_);
  if (bev_) {
    bufferevent_free(bev_);
  }
}

void BufferEventWebStream::Start() {
  bufferevent_setcb(bev_,
                    ReadCallback,
                    nullptr,
                    EventCallback,
                    this);

  int enable_rv = bufferevent_enable(bev_, EV_READ | EV_WRITE);
  if (enable_rv != 0) {
    std::cerr << "bufferevent_enable() failed" << std::endl;
  }

  if (!is_server_) {
    SendHttpRequest();
  }
}

void BufferEventWebStream::SetOnMessage(MessageCallback cb) { on_message_ = cb; }

void BufferEventWebStream::SetOnOpen(OpenCallback cb) { on_open_ = cb; }

void BufferEventWebStream::SetOnClose(CloseCallback cb) { on_close_ = cb; }

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
    std::cerr << "bufferevent_write() failed" << std::endl;
    return -1;
  }

  return 0;
}

// ---- libevent callbacks ----

void BufferEventWebStream::ReadCallback(bufferevent* bev, void* ctx) {
  BufferEventWebStream* handler = static_cast<BufferEventWebStream*>(ctx);

  for (;;) {
    switch (handler->state_) {
      case HANDSHAKE:
        handler->HandleHandshake();
        if (handler->state_ == HANDSHAKE) {
          // Handshake not complete, wait for more data.
          return;
        }
        break;
      case OPEN: {
        int err = wslay_event_recv(handler->ctx_);
        if (err != 0) {
          std::cerr << "wslay_event_recv() failed: " << err << std::endl;
          return;
        }

        // The inbound terminal chunk was fully consumed by ReadChunkedBytes().
        if (handler->receive_closed_) {
          // Check for any extra data received after the terminal chunk
          evbuffer* input = bufferevent_get_input(handler->bev_);
          size_t extra_len = evbuffer_get_length(input);
          if (extra_len > 0) {
            std::cerr << "Warning: received " << extra_len << " bytes of extra data after stream close." << std::endl;
            evbuffer_drain(input, extra_len);
          }

          // Keep the read callback as ReadCallback; receive direction is done.
          // Do NOT set state_ = CLOSED yet: on_close_() may still call Close()
          // to queue the outbound terminal chunk, and we need the output buffer
          // to drain before freeing the handler.
          bufferevent_setcb(handler->bev_,
                            ReadCallback,
                            nullptr,
                            EventCallback,
                            handler);

          if (handler->on_close_) {
            handler->on_close_();
          }

          if (handler->close_pending_) {
            // Close() was called in on_close_(); the outbound terminal chunk
            // (and any pending echo frames) are queued in the output buffer.
            // Switch to DRAINING and delete only after the buffer empties.
            handler->state_ = DRAINING;
            bufferevent_setcb(handler->bev_,
                              ReadCallback,
                              DrainCallback,
                              EventCallback,
                              handler);
          } else {
            handler->state_ = CLOSED;
            delete handler;
          }
          return;
        }

        return;
      }
      case DRAINING: {
        evbuffer* input = bufferevent_get_input(handler->bev_);
        size_t len = evbuffer_get_length(input);
        if (len > 0) {
          std::cerr << "Warning: received " << len << " bytes of extra data after stream close." << std::endl;
          evbuffer_drain(input, len);
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

void BufferEventWebStream::DrainCallback(bufferevent* bev, void* ctx) {
  BufferEventWebStream* handler = static_cast<BufferEventWebStream*>(ctx);
  // Delete the handler only once all queued outbound data has been sent.
  if (evbuffer_get_length(bufferevent_get_output(bev)) == 0) {
    handler->state_ = CLOSED;
    delete handler;
  }
}

void BufferEventWebStream::EventCallback(bufferevent* bev,
                                         short what,  // NOLINT(runtime/int)
                                         void* ctx) {
  if (what & BEV_EVENT_ERROR) {
    std::cerr << "Error on socket: "
              << evutil_socket_error_to_string(EVUTIL_SOCKET_ERROR())
              << std::endl;
  }

  if (what & (BEV_EVENT_EOF | BEV_EVENT_ERROR)) {
    // Connection closed
    std::cout << "Connection closed." << std::endl;
    BufferEventWebStream* handler = static_cast<BufferEventWebStream*>(ctx);
    // Guard against double-close: ReadCallback may have already called
    // on_close_() and deleted the handler via the terminal-chunk path.
    // state_ == CLOSED or DRAINING means on_close_() was already fired.
    if (handler->state_ != CLOSED && handler->state_ != DRAINING) {
      // Notify before self-deletion so Python-side handles can be invalidated
      // while the pointer is still valid.
      if (handler->on_close_) {
        handler->on_close_();
      }
    }
    delete handler;
  }
}

// ---- Handshake handling ----

void BufferEventWebStream::HandleHandshake() {
  if (is_server_) {
    if (ReadHttpRequest()) {
      SendHttpResponse("200 OK", "application/web-stream");
      state_ = OPEN;
      if (on_open_) {
        on_open_();
      }
    }

    return;
  }

  // Client waits for response
  if (ReadHttpResponse()) {
    state_ = OPEN;
    // Maybe trigger some on_open callback?
    std::cout << "Handshake complete!" << std::endl;
    if (on_open_) {
      on_open_();
    }
  }
}

bool BufferEventWebStream::ReadHttpRequest() {
  evbuffer* input = bufferevent_get_input(bev_);

  size_t len = evbuffer_get_length(input);
  if (len == 0) {
    return false;
  }

  // Search for \r\n\r\n
  evbuffer_ptr ptr = evbuffer_search(input,
                                     "\r\n\r\n",
                                     4,
                                     nullptr);
  if (ptr.pos == -1) {
    return false;  // Not full headers yet
  }

  // Read up to the end of headers
  size_t header_len = ptr.pos + 4;
  char* headers = new char[header_len + 1];
  evbuffer_remove(input, headers, header_len);
  headers[header_len] = '\0';
  std::string data(headers);
  delete[] headers;

  // Check for web-stream specific header
  if (data.find("Content-Type: application/web-stream") == std::string::npos &&
      data.find("content-type: application/web-stream") == std::string::npos) {
    std::cerr << "Missing web-stream Content-Type!" << std::endl;
    return false;
  }
  return true;
}

void BufferEventWebStream::SendHttpResponse(const std::string& status,
                                            const std::string& content_type) {
  std::stringstream ss;
  ss << "HTTP/1.1 " << status << "\r\n";
  ss << "Content-Type: " << content_type << "\r\n";
  ss << "Transfer-Encoding: chunked\r\n";
  ss << "\r\n";  // End of headers
  std::string data = ss.str();
  bufferevent_write(bev_, data.c_str(), data.length());
}

void BufferEventWebStream::SendHttpRequest() {
  std::stringstream ss;
  ss << "POST / HTTP/1.1\r\n";
  ss << "Host: localhost\r\n";
  ss << "Content-Type: application/web-stream\r\n";
  ss << "Transfer-Encoding: chunked\r\n";
  ss << "\r\n";
  std::string data = ss.str();
  bufferevent_write(bev_, data.c_str(), data.length());
}

bool BufferEventWebStream::ReadHttpResponse() {
  evbuffer* input = bufferevent_get_input(bev_);

  // Search for \r\n\r\n
  evbuffer_ptr ptr = evbuffer_search(input,
                                     "\r\n\r\n",
                                     4,
                                     nullptr);
  if (ptr.pos == -1) {
    return false;
  }

  size_t header_len = ptr.pos + 4;
  char* headers = new char[header_len + 1];
  evbuffer_remove(input, headers, header_len);
  headers[header_len] = '\0';
  std::string data(headers);
  delete[] headers;

  if (data.find("200 OK") == std::string::npos) {
    std::cerr << "Bad Handy handshake response: " << data << std::endl;
    return false;
  }
  return true;
}

// ---- wslay callbacks ----

ssize_t BufferEventWebStream::WslayRecvCallback(wslay_event_context* /*ctx*/,
                                                uint8_t* buf,
                                                size_t len,
                                                int /*flags*/,
                                                void* user_data) {
  BufferEventWebStream* handler = static_cast<BufferEventWebStream*>(user_data);
  return handler->ReadChunkedBytes(buf, len);
}

ssize_t BufferEventWebStream::WslaySendCallback(wslay_event_context* ctx,
                                                const uint8_t* data,
                                                size_t len,
                                                int /*flags*/,
                                                void* user_data) {
  BufferEventWebStream* handler = static_cast<BufferEventWebStream*>(user_data);

  // Wrap the wslay frame bytes in a single HTTP/1.1 chunk:
  //   <hex-len>\r\n<data>\r\n
  char header[32];
  int header_len = snprintf(header, sizeof(header), "%zx\r\n", len);
  if (header_len <= 0) {
    wslay_event_set_error(ctx, WSLAY_ERR_CALLBACK_FAILURE);
    return -1;
  }

  if (bufferevent_write(handler->bev_, header, static_cast<size_t>(header_len)) != 0 ||
      bufferevent_write(handler->bev_, data, len) != 0 ||
      bufferevent_write(handler->bev_, "\r\n", 2) != 0) {
    std::cerr << "bufferevent_write() failed" << std::endl;
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
  BufferEventWebStream* handler = static_cast<BufferEventWebStream*>(user_data);

  // Consider implementing backpressure.

  if (handler->on_message_) {
    std::string msg(reinterpret_cast<const char*>(arg->msg), arg->msg_length);
    handler->on_message_(arg->opcode, msg);
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
          std::cerr << "ReadChunkedBytes: empty chunk-size line" << std::endl;
          wslay_event_set_error(ctx_, WSLAY_ERR_CALLBACK_FAILURE);
          return -1;
        }

        // Read the entire "<hex>\r\n" line into a temporary buffer.
        size_t line_len = static_cast<size_t>(pos.pos) + 2;  // include \r\n
        std::vector<char> line(line_len + 1, '\0');
        evbuffer_remove(input, line.data(), line_len);
        // Null-terminate at the \r so strtoul sees only hex digits.
        line[pos.pos] = '\0';

        char* end = nullptr;
        unsigned long chunk_size = std::strtoul(line.data(), &end, 16);
        if (end == line.data()) {
          std::cerr << "ReadChunkedBytes: malformed chunk size" << std::endl;
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
          std::cerr << "ReadChunkedBytes: evbuffer_remove() failed" << std::endl;
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
        if (evbuffer_get_length(input) < 2) {
          wslay_event_set_error(ctx_, WSLAY_ERR_WOULDBLOCK);
          return -1;
        }

        evbuffer_drain(input, 2);  // Discard "\r\n".
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
