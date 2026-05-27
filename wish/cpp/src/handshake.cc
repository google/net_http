#include "handshake.h"

#include <absl/log/log.h>
#include <event2/buffer.h>
#include <event2/bufferevent.h>
#include <event2/event.h>

#include <cstring>
#include <sstream>

namespace {

bool ReadHttpHeaders(evbuffer* input, std::string* headers_out) {
  size_t len = evbuffer_get_length(input);
  if (len == 0) {
    return false;
  }

  // Search for \r\n\r\n
  evbuffer_ptr ptr = evbuffer_search(input, "\r\n\r\n", 4, nullptr);
  if (ptr.pos == -1) {
    return false;  // Not full headers yet
  }

  // Read up to the end of headers
  size_t header_len = ptr.pos + 4;
  char* headers = new char[header_len + 1];
  evbuffer_remove(input, headers, header_len);
  headers[header_len] = '\0';
  *headers_out = std::string(headers);
  delete[] headers;

  return true;
}

void SendHttpRequest(bufferevent* bev) {
  std::stringstream ss;
  ss << "POST / HTTP/1.1\r\n";
  ss << "Host: localhost\r\n";
  ss << "Content-Type: application/web-stream\r\n";
  ss << "Transfer-Encoding: chunked\r\n";
  ss << "\r\n";
  std::string data = ss.str();
  bufferevent_write(bev, data.c_str(), data.length());
}

void SendHttpResponse(bufferevent* bev,
                      const std::string& status,
                      const std::string& content_type) {
  std::stringstream ss;
  ss << "HTTP/1.1 " << status << "\r\n";
  ss << "Content-Type: " << content_type << "\r\n";
  ss << "Transfer-Encoding: chunked\r\n";
  ss << "\r\n";  // End of headers
  std::string data = ss.str();
  bufferevent_write(bev, data.c_str(), data.length());
}

}  // namespace

// ---- ClientHandshake Implementation ----

ClientHandshake::ClientHandshake(bufferevent* bev,
                                 OnOpenCallback on_open,
                                 OnErrorCallback on_error)
    : bev_(bev),
      on_open_(std::move(on_open)),
      on_error_(std::move(on_error)) {}

ClientHandshake::~ClientHandshake() {
  if (bev_) {
    bufferevent_free(bev_);
  }
}

void ClientHandshake::Start() {
  bufferevent_setcb(bev_, ReadCb, nullptr, EventCb, this);
  int enable_rv = bufferevent_enable(bev_, EV_READ | EV_WRITE);
  if (enable_rv != 0) {
    LOG(ERROR) << "bufferevent_enable() failed in ClientHandshake";
  }
  SendHttpRequest(bev_);
}

void ClientHandshake::ReadCb(bufferevent* bev, void* ctx) {
  static_cast<ClientHandshake*>(ctx)->HandleRead();
}

void ClientHandshake::EventCb(bufferevent* bev, short what, void* ctx) {
  static_cast<ClientHandshake*>(ctx)->HandleEvent(what);
}

void ClientHandshake::HandleRead() {
  evbuffer* input = bufferevent_get_input(bev_);
  std::string headers;
  if (!ReadHttpHeaders(input, &headers)) {
    return;  // Wait for more data
  }

  if (headers.find("200 OK") == std::string::npos) {
    LOG(ERROR) << "Bad Handy handshake response: " << headers;
    HandleEvent(BEV_EVENT_ERROR);
    return;
  }

  // Handshake successful. Hand over bufferevent and trigger success callback.
  bufferevent* bev = bev_;
  bev_ = nullptr;  // Release ownership

  // Disable callbacks on the bufferevent before handing it over
  bufferevent_setcb(bev, nullptr, nullptr, nullptr, nullptr);

  auto on_open = std::move(on_open_);
  on_open(bev);
}

void ClientHandshake::HandleEvent(short what) {
  if (what & BEV_EVENT_CONNECTED) {
    LOG(INFO) << "Client handshake: connected";
    return;
  }

  if (what & (BEV_EVENT_EOF | BEV_EVENT_ERROR | BEV_EVENT_TIMEOUT)) {
    if (what & BEV_EVENT_ERROR) {
      int err = EVUTIL_SOCKET_ERROR();
      if (err != 0) {
        LOG(ERROR) << "Error during client handshake: "
                   << evutil_socket_error_to_string(err);
      } else {
        LOG(ERROR) << "Error during client handshake";
      }
    }

    auto on_error = std::move(on_error_);
    if (on_error) {
      on_error();
    }
  }
}

// ---- ServerHandshake Implementation ----

ServerHandshake::ServerHandshake(bufferevent* bev,
                                 OnOpenCallback on_open,
                                 OnErrorCallback on_error)
    : bev_(bev),
      on_open_(std::move(on_open)),
      on_error_(std::move(on_error)) {}

ServerHandshake::~ServerHandshake() {
  if (bev_) {
    bufferevent_free(bev_);
  }
}

void ServerHandshake::Start() {
  bufferevent_setcb(bev_, ReadCb, nullptr, EventCb, this);
  int enable_rv = bufferevent_enable(bev_, EV_READ | EV_WRITE);
  if (enable_rv != 0) {
    LOG(ERROR) << "bufferevent_enable() failed in ServerHandshake";
  }
}

void ServerHandshake::ReadCb(bufferevent* bev, void* ctx) {
  static_cast<ServerHandshake*>(ctx)->HandleRead();
}

void ServerHandshake::EventCb(bufferevent* bev, short what, void* ctx) {
  static_cast<ServerHandshake*>(ctx)->HandleEvent(what);
}

void ServerHandshake::HandleRead() {
  evbuffer* input = bufferevent_get_input(bev_);
  std::string headers;
  if (!ReadHttpHeaders(input, &headers)) {
    return;  // Wait for more data
  }

  // Check for web-stream specific header
  if (headers.find("Content-Type: application/web-stream") == std::string::npos &&
      headers.find("content-type: application/web-stream") == std::string::npos) {
    LOG(ERROR) << "Missing web-stream Content-Type!";
    HandleEvent(BEV_EVENT_ERROR);
    return;
  }

  // Send the HTTP 200 response
  SendHttpResponse(bev_, "200 OK", "application/web-stream");

  // Handshake successful. Hand over bufferevent and trigger success callback.
  bufferevent* bev = bev_;
  bev_ = nullptr;  // Release ownership

  // Disable callbacks on the bufferevent before handing it over
  bufferevent_setcb(bev, nullptr, nullptr, nullptr, nullptr);

  auto on_open = std::move(on_open_);
  // Save callback, delete this, then call callback
  delete this;
  on_open(bev);
}

void ServerHandshake::HandleEvent(short what) {
  if (what & (BEV_EVENT_EOF | BEV_EVENT_ERROR | BEV_EVENT_TIMEOUT)) {
    if (what & BEV_EVENT_ERROR) {
      int err = EVUTIL_SOCKET_ERROR();
      if (err != 0) {
        LOG(ERROR) << "Error during server handshake: "
                   << evutil_socket_error_to_string(err);
      } else {
        LOG(ERROR) << "Error during server handshake";
      }
    }

    auto on_error = std::move(on_error_);
    delete this;
    if (on_error) {
      on_error();
    }
  }
}
