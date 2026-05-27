#include "plain_client.h"

#include <absl/log/log.h>

PlainClient::PlainClient(const std::string& host, int port)
    : host_(host),
      port_(port),
      base_(nullptr),
      dns_base_(nullptr),
      stream_(nullptr) {}

PlainClient::~PlainClient() {
  if (base_) {
    event_base_loopbreak(base_);
  }

  if (dns_base_) {
    evdns_base_free(dns_base_, 0);
  }
  if (base_) {
    event_base_free(base_);
  }
}

bool PlainClient::Init() {
  base_ = event_base_new();
  if (!base_) {
    LOG(ERROR) << "event_base_new() failed";

    return false;
  }

  dns_base_ = evdns_base_new(base_, 1);
  if (!dns_base_) {
    LOG(ERROR) << "evdns_base_new() failed";

    return false;
  }

  bufferevent* bev = bufferevent_socket_new(base_,
                                            -1,
                                            BEV_OPT_CLOSE_ON_FREE);
  if (!bev) {
    LOG(ERROR) << "bufferevent_socket_new() failed";

    return false;
  }

  if (bufferevent_socket_connect_hostname(bev,
                                          dns_base_,
                                          AF_INET,
                                          host_.c_str(),
                                          port_) < 0) {
    LOG(ERROR) << "bufferevent_socket_connect_hostname() failed";
    bufferevent_free(bev);

    return false;
  }

  handshake_ = std::make_unique<ClientHandshake>(
      bev,
      [this](bufferevent* bev) {
        stream_ = new BufferEventWebStream(bev, false);

        if (on_open_) {
          on_open_(stream_);
        }

        stream_->Start();
        handshake_.reset();
      },
      [this]() {
        LOG(ERROR) << "Client handshake failed";
        handshake_.reset();
      });

  handshake_->Start();

  return true;
}

void PlainClient::SetOnOpen(OpenCallback cb) {
  on_open_ = cb;
}

void PlainClient::Run() {
  event_base_dispatch(base_);
}

void PlainClient::Stop() {
  if (base_) {
    event_base_loopexit(base_, nullptr);
  }
}
