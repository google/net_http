#include <iostream>
#include <sstream>
#include <random>
#include <cstring>
#include <vector>

#include <wslay/wslay.h>
#include <event2/bufferevent.h>
#include <event2/buffer.h>
#include <event2/event.h>

#include "wish_handler.h"

WishHandler::WishHandler(struct bufferevent* bev, bool is_server)
    : bev_(bev), is_server_(is_server), ctx_(nullptr), state_(HANDSHAKE) {

  struct wslay_event_callbacks callbacks = {
    RecvCallback,
    SendCallback,
    GenMaskCallback,
    NULL,
    NULL,
    NULL,
    OnMsgRecvCallback
  };

  if (is_server_) {
    wslay_event_context_server_init(&ctx_, &callbacks, this);
  } else {
    wslay_event_context_client_init(&ctx_, &callbacks, this);
  }
}

WishHandler::~WishHandler() {
  wslay_event_context_free(ctx_);
  if (bev_) {
    bufferevent_free(bev_);
  }
}

void WishHandler::Start() {
  bufferevent_setcb(bev_, ReadCallback, NULL, EventCallback, this);
  bufferevent_enable(bev_, EV_READ | EV_WRITE);

  if (!is_server_) {
    SendHttpRequest();
  }
}

void WishHandler::SetOnMessage(MessageCallback cb) {
  on_message_ = cb;
}

void WishHandler::SetOnOpen(OpenCallback cb) {
  on_open_ = cb;
}

ssize_t WishHandler::RecvCallback(wslay_event_context *ctx, uint8_t *buf, size_t len, int flags, void *user_data) {
  WishHandler* handler = static_cast<WishHandler*>(user_data);
  struct evbuffer *input = bufferevent_get_input(handler->bev_);
  
  size_t data_len = evbuffer_get_length(input);
  if (data_len == 0) {
    wslay_event_set_error(ctx, WSLAY_ERR_WOULDBLOCK);
    return -1;
  }

  size_t copy_len = std::min(len, data_len);
  evbuffer_remove(input, buf, copy_len);
  return copy_len;
}

ssize_t WishHandler::SendCallback(wslay_event_context *ctx, const uint8_t *data, size_t len, int flags, void *user_data) {
  WishHandler* handler = static_cast<WishHandler*>(user_data);
  bufferevent_write(handler->bev_, data, len);
  return len;
}

int WishHandler::GenMaskCallback(wslay_event_context *ctx, uint8_t *buf, size_t len, void *user_data) {
  static std::mt19937 rng(std::random_device{}());
  std::uniform_int_distribution<uint8_t> dist(0, 255);
  for (size_t i = 0; i < len; ++i) {
    buf[i] = dist(rng);
  }
  return 0;
}

void WishHandler::OnMsgRecvCallback(wslay_event_context *ctx, const wslay_event_on_msg_recv_arg *arg, void *user_data) {
  WishHandler* handler = static_cast<WishHandler*>(user_data);
  if (handler->on_message_) {
    std::string msg(reinterpret_cast<const char*>(arg->msg), arg->msg_length);
    handler->on_message_(arg->opcode, msg);
  }
}

void WishHandler::ReadCallback(struct bufferevent *bev, void *ctx) {
  WishHandler* handler = static_cast<WishHandler*>(ctx);
  
  if (handler->state_ == HANDSHAKE) {
    handler->HandleHandshake();
  }
  
  if (handler->state_ == OPEN) {
    int err = wslay_event_recv(handler->ctx_);
    if (err != 0) {
        std::cerr << "wslay_event_recv failed: " << err << std::endl;
        // Should we close?
    }
  }
}

void WishHandler::EventCallback(struct bufferevent *bev, short events, void *ctx) {
  if (events & BEV_EVENT_ERROR) {
    std::cerr << "Error on socket: " << evutil_socket_error_to_string(EVUTIL_SOCKET_ERROR()) << std::endl;
  }
  if (events & (BEV_EVENT_EOF | BEV_EVENT_ERROR)) {
    // Connection closed
    std::cout << "Connection closed." << std::endl;
    WishHandler* handler = static_cast<WishHandler*>(ctx);
    delete handler;
  }
}

int WishHandler::SendMessage(uint8_t opcode, const std::string& msg) {
  if (state_ != OPEN) return -1;
  
  struct wslay_event_msg msg_frame = {
    opcode,
    reinterpret_cast<const uint8_t*>(msg.c_str()),
    msg.length()
  };
  // Queue msg
  int res = wslay_event_queue_msg(ctx_, &msg_frame);
  if (res != 0) return res;

  // Force send
  return wslay_event_send(ctx_);
}

int WishHandler::SendText(const std::string& msg) {
  return SendMessage(1, msg);
}

int WishHandler::SendBinary(const std::string& msg) {
  return SendMessage(2, msg);
}

int WishHandler::SendMetadata(bool is_text, const std::string& msg) {
  return SendMessage(is_text ? 3 : 4, msg);
}

// ---------------- Handshake Logic ----------------

void WishHandler::HandleHandshake() {
  if (is_server_) {
    if (ReadHttpRequest()) {
        SendHttpResponse("200 OK", "application/web-stream");
        state_ = OPEN;
        if (on_open_) on_open_();
    }
  } else {
    // Client waits for response
    if (ReadHttpResponse()) {
        state_ = OPEN;
        // Maybe trigger some on_open callback?
        std::cout << "Handshake complete!" << std::endl;
        if (on_open_) on_open_();
    }
  }
}

bool WishHandler::ReadHttpRequest() {
  struct evbuffer *input = bufferevent_get_input(bev_);
  size_t len = evbuffer_get_length(input);
  if (len == 0) return false;

  // Search for \r\n\r\n
  struct evbuffer_ptr ptr = evbuffer_search(input, "\r\n\r\n", 4, NULL);
  if (ptr.pos == -1) return false; // Not full headers yet

  // Read up to the end of headers
  size_t header_len = ptr.pos + 4;
  char* headers = new char[header_len + 1];
  evbuffer_remove(input, headers, header_len);
  headers[header_len] = '\0';
  std::string data(headers);
  delete[] headers;

  // Check for WiSH specific header
  if (data.find("Content-Type: application/web-stream") == std::string::npos &&
    data.find("content-type: application/web-stream") == std::string::npos) {
    std::cerr << "Missing WiSH Content-Type!" << std::endl;
    return false;
  }
  return true;
}

void WishHandler::SendHttpResponse(const std::string& status, const std::string& content_type) {
  std::stringstream ss;
  ss << "HTTP/1.1 " << status << "\r\n";
  ss << "Content-Type: " << content_type << "\r\n";
  ss << "\r\n"; // End of headers
  std::string data = ss.str();
  bufferevent_write(bev_, data.c_str(), data.length());
}

void WishHandler::SendHttpRequest() {
  std::stringstream ss;
  ss << "POST / HTTP/1.1\r\n";
  ss << "Host: localhost\r\n";
  ss << "Content-Type: application/web-stream\r\n";
  ss << "\r\n";
  std::string data = ss.str();
  bufferevent_write(bev_, data.c_str(), data.length());
}

bool WishHandler::ReadHttpResponse() {
  struct evbuffer *input = bufferevent_get_input(bev_);
  
  // Search for \r\n\r\n
  struct evbuffer_ptr ptr = evbuffer_search(input, "\r\n\r\n", 4, NULL);
  if (ptr.pos == -1) return false; 

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
