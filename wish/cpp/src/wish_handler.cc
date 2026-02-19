#include <iostream>
#include <sstream>
#include <random>
#include <cstring>

#include <wslay/wslay.h>

#include "wish_handler.h"

WishHandler::WishHandler(Socket& socket, bool is_server) 
    : socket_(socket), is_server_(is_server), ctx_(nullptr) {
    
  struct wslay_event_callbacks callbacks = {
    RecvCallback,
    SendCallback,
    GenMaskCallback,
    NULL, // on_frame_recv_start_callback
    NULL, // on_frame_recv_chunk_callback
    NULL, // on_frame_recv_end_callback
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
}

void WishHandler::SetOnMessage(MessageCallback cb) {
  on_message_ = cb;
}

ssize_t WishHandler::RecvCallback(wslay_event_context *ctx, uint8_t *buf, size_t len, int flags, void *user_data) {
  WishHandler* handler = static_cast<WishHandler*>(user_data);
  // Just return the errno/status directly
  ssize_t res = handler->socket_.RecvData(buf, len);
  if (res < 0) {
    wslay_event_set_error(ctx, WSLAY_ERR_CALLBACK_FAILURE);
    return -1;
  }
  return res;
}

ssize_t WishHandler::SendCallback(wslay_event_context *ctx, const uint8_t *data, size_t len, int flags, void *user_data) {
  WishHandler* handler = static_cast<WishHandler*>(user_data);
  ssize_t res = handler->socket_.SendData(data, len);
  if (res < 0) {
    wslay_event_set_error(ctx, WSLAY_ERR_CALLBACK_FAILURE);
    return -1;
  }
  return res;
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

int WishHandler::SendMessage(uint8_t opcode, const std::string& msg) {
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

bool WishHandler::Process() {
  // This drives the wslay event loop
  
  int err = wslay_event_recv(ctx_);
  if (err != 0) {
    std::cerr << "Process failed with error: " << err << std::endl;
    return false; // Error or closed
  }
  return true;
}

// ---------------- Handshake Logic ----------------

bool WishHandler::Handshake() {
  if (is_server_) {
    // Read Request
    if (!ReadHttpRequest()) return false;
    // Send Response
    return SendHttpResponse("200 OK", "application/web-stream");
  } else {
    // Send Request
    if (!SendHttpRequest()) return false;
    // Read Response
    return ReadHttpResponse();
  }
}

bool WishHandler::ReadHttpRequest() {
  // Very dummy HTTP reader. Just reads until \r\n\r\n
  // In reality, should parse headers.
  char buffer[4096];
  ssize_t n = socket_.RecvData(buffer, sizeof(buffer) - 1);
  if (n <= 0) return false;
  buffer[n] = '\0';
  std::string data(buffer);
  
  // Check for WiSH specific header
  if (data.find("Content-Type: application/web-stream") == std::string::npos &&
    data.find("content-type: application/web-stream") == std::string::npos) {
    std::cerr << "Missing WiSH Content-Type!" << std::endl;
    return false;
  }
  return true;
}

bool WishHandler::SendHttpResponse(const std::string& status, const std::string& content_type) {
  std::stringstream ss;
  ss << "HTTP/1.1 " << status << "\r\n";
  ss << "Content-Type: " << content_type << "\r\n";
  ss << "\r\n"; // End of headers
  std::string data = ss.str();
  socket_.SendData(data.c_str(), data.length());
  return true;
}

bool WishHandler::SendHttpRequest() {
  std::stringstream ss;
  ss << "POST / HTTP/1.1\r\n";
  ss << "Host: localhost\r\n";
  ss << "Content-Type: application/web-stream\r\n";
  ss << "\r\n";
  std::string data = ss.str();
  socket_.SendData(data.c_str(), data.length());
  return true;
}

bool WishHandler::ReadHttpResponse() {
  char buffer[4096];
  ssize_t n = socket_.RecvData(buffer, sizeof(buffer) - 1);
  if (n <= 0) return false;
  buffer[n] = '\0';
  std::string data(buffer);
  
  if (data.find("200 OK") == std::string::npos) {
    std::cerr << "Bad Handy handshake response: " << data << std::endl;
    return false;
  }
  return true;
}
