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

#include "buffer_event_web_stream.h"

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
    wslay_event_context_server_init(&ctx_, &callbacks, this);
  } else {
    wslay_event_context_client_init(&ctx_, &callbacks, this);
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

          // Handle the error.

          return;
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
    // Notify before self-deletion so Python-side handles can be invalidated
    // while the pointer is still valid.
    if (handler->on_close_) {
      handler->on_close_();
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
  ss << "\r\n";  // End of headers
  std::string data = ss.str();
  bufferevent_write(bev_, data.c_str(), data.length());
}

void BufferEventWebStream::SendHttpRequest() {
  std::stringstream ss;
  ss << "POST / HTTP/1.1\r\n";
  ss << "Host: localhost\r\n";
  ss << "Content-Type: application/web-stream\r\n";
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

ssize_t BufferEventWebStream::WslayRecvCallback(wslay_event_context* ctx,
                                                uint8_t* buf,
                                                size_t len,
                                                int flags,
                                                void* user_data) {
  BufferEventWebStream* handler = static_cast<BufferEventWebStream*>(user_data);

  evbuffer* input = bufferevent_get_input(handler->bev_);

  size_t data_len = evbuffer_get_length(input);
  if (data_len == 0) {
    wslay_event_set_error(ctx, WSLAY_ERR_WOULDBLOCK);
    return -1;
  }

  size_t copy_len = std::min(len, data_len);
  int rv = evbuffer_remove(input, buf, copy_len);
  if (rv < 0) {
    std::cerr << "evbuffer_remove() failed" << std::endl;
    wslay_event_set_error(ctx, WSLAY_ERR_CALLBACK_FAILURE);
    return -1;
  }
  return static_cast<ssize_t>(copy_len);
}

ssize_t BufferEventWebStream::WslaySendCallback(wslay_event_context* ctx,
                                                const uint8_t* data,
                                                size_t len,
                                                int flags,
                                                void* user_data) {
  BufferEventWebStream* handler = static_cast<BufferEventWebStream*>(user_data);

  int rv = bufferevent_write(handler->bev_, data, len);
  if (rv != 0) {
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

int BufferEventWebStream::SendMessage(uint8_t opcode, const std::string& msg) {
  if (state_ != OPEN) {
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
