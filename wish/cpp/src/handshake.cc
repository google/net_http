#include "handshake.h"

#include <absl/log/log.h>
#include <event2/buffer.h>
#include <event2/bufferevent.h>
#include <event2/event.h>
#include <picohttpparser.h>

#include <algorithm>
#include <cstring>
#include <sstream>
#include <string_view>

namespace {

bool CheckHeader(const phr_header* headers,
                 size_t num_headers,
                 std::string_view target_name,
                 std::string_view target_value) {
  for (size_t i = 0; i < num_headers; ++i) {
    std::string_view name(headers[i].name, headers[i].name_len);
    std::string_view value(headers[i].value, headers[i].value_len);
    if (name.size() == target_name.size() &&
        std::equal(name.begin(), name.end(), target_name.begin(), [](char a, char b) {
          return std::tolower(static_cast<unsigned char>(a)) == std::tolower(static_cast<unsigned char>(b));
        })) {
      if (value.size() == target_value.size() &&
          std::equal(value.begin(), value.end(), target_value.begin(), [](char a, char b) {
            return std::tolower(static_cast<unsigned char>(a)) == std::tolower(static_cast<unsigned char>(b));
          })) {
        return true;
      }
    }
  }
  return false;
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
    LOG(ERROR) << "bufferevent_enable() failed";

    InvokeError();

    return;
  }

  std::stringstream ss;
  ss << "POST / HTTP/1.1\r\n";
  ss << "Host: localhost\r\n";
  ss << "Content-Type: application/web-stream\r\n";
  ss << "Transfer-Encoding: chunked\r\n";
  ss << "\r\n";
  std::string data = ss.str();
  int write_rv = bufferevent_write(bev_, data.c_str(), data.length());
  if (write_rv != 0) {
    LOG(ERROR) << "bufferevent_write() failed";

    InvokeError();
  }
}

void ClientHandshake::ReadCb(bufferevent* bev, void* ctx) {
  static_cast<ClientHandshake*>(ctx)->HandleRead();
}

void ClientHandshake::EventCb(bufferevent* bev, short what, void* ctx) {
  static_cast<ClientHandshake*>(ctx)->HandleEvent(what);
}

void ClientHandshake::HandleRead() {
  evbuffer* input = bufferevent_get_input(bev_);

  size_t len = evbuffer_get_length(input);
  if (len == 0) {
    return;
  }

  const char* data = reinterpret_cast<const char*>(evbuffer_pullup(input, -1));
  if (!data) {
    ABSL_UNREACHABLE();
  }

  int minor_version;
  int status;
  const char* msg;
  size_t msg_len;
  struct phr_header headers[100];
  size_t num_headers = 100;

  int parse_rv = phr_parse_response(data, len, &minor_version, &status, &msg, &msg_len, headers, &num_headers, 0);
  if (parse_rv == -1) {
    LOG(ERROR) << "Failed to parse client handshake HTTP response";

    InvokeError();

    return;
  }
  if (parse_rv == -2) {
    return;  // Incomplete headers, wait for more data
  }

  if (status != 200) {
    LOG(ERROR) << "Bad client handshake response status: " << status;

    InvokeError();

    return;
  }

  if (!CheckHeader(headers, num_headers, "content-type", "application/web-stream")) {
    LOG(ERROR) << "Client handshake response missing web-stream Content-Type!";

    InvokeError();

    return;
  }

  evbuffer_drain(input, parse_rv);

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
    return;
  }

  if (what & BEV_EVENT_ERROR) {
    int err = EVUTIL_SOCKET_ERROR();
    if (err != 0) {
      LOG(ERROR) << "Error during client handshake: "
                 << evutil_socket_error_to_string(err);
    } else {
      LOG(ERROR) << "Error during client handshake";
    }
  }

  if (what & (BEV_EVENT_EOF | BEV_EVENT_ERROR | BEV_EVENT_TIMEOUT)) {
    InvokeError();
  }
}

void ClientHandshake::InvokeError() {
  auto on_error = std::move(on_error_);
  if (on_error) {
    on_error();
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
    LOG(ERROR) << "bufferevent_enable() failed";

    InvokeError();

    return;
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

  size_t len = evbuffer_get_length(input);
  if (len == 0) {
    return;
  }

  const char* data = reinterpret_cast<const char*>(evbuffer_pullup(input, -1));
  if (!data) {
    ABSL_UNREACHABLE();
  }

  int minor_version;
  const char* method;
  size_t method_len;
  const char* path;
  size_t path_len;
  struct phr_header headers[100];
  size_t num_headers = 100;

  int parse_rv = phr_parse_request(data, len, &method, &method_len, &path, &path_len, &minor_version, headers, &num_headers, 0);
  if (parse_rv == -1) {
    LOG(ERROR) << "Failed to parse server handshake HTTP request";

    InvokeError();

    return;
  }
  if (parse_rv == -2) {
    return;  // Incomplete headers, wait for more data
  }

  if (!CheckHeader(headers, num_headers, "content-type", "application/web-stream")) {
    LOG(ERROR) << "Missing web-stream Content-Type!";

    InvokeError();

    return;
  }

  int drain_rv = evbuffer_drain(input, parse_rv);
  if (drain_rv != 0) {
    LOG(ERROR) << "evbuffer_drain() failed";

    InvokeError();

    return;
  }

  // Send the HTTP 200 response
  std::stringstream ss;
  ss << "HTTP/1.1 200 OK\r\n";
  ss << "Content-Type: application/web-stream\r\n";
  ss << "Transfer-Encoding: chunked\r\n";
  ss << "\r\n";  // End of headers
  std::string response_data = ss.str();
  int write_rv = bufferevent_write(bev_, response_data.c_str(), response_data.length());
  if (write_rv != 0) {
    LOG(ERROR) << "bufferevent_write() failed";

    InvokeError();

    return;
  }

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
  if (what & BEV_EVENT_ERROR) {
    int err = EVUTIL_SOCKET_ERROR();
    if (err != 0) {
      LOG(ERROR) << "Error during server handshake: "
                 << evutil_socket_error_to_string(err);
    } else {
      LOG(ERROR) << "Error during server handshake";
    }
  }

  if (what & (BEV_EVENT_EOF | BEV_EVENT_ERROR | BEV_EVENT_TIMEOUT)) {
    InvokeError();
  }
}

void ServerHandshake::InvokeError() {
  auto on_error = std::move(on_error_);
  delete this;
  if (on_error) {
    on_error();
  }
}
