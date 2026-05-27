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

  handshake_.reset();
  stream_.reset();

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
    VLOG(1) << "event_base_new() failed";

    return false;
  }

  dns_base_ = evdns_base_new(base_, 1);
  if (!dns_base_) {
    VLOG(1) << "evdns_base_new() failed";

    return false;
  }

  bufferevent* bev = bufferevent_socket_new(base_,
                                            -1,
                                            BEV_OPT_CLOSE_ON_FREE);
  if (!bev) {
    VLOG(1) << "bufferevent_socket_new() failed";

    return false;
  }

  int connect_rv = bufferevent_socket_connect_hostname(bev,
                                                       dns_base_,
                                                       AF_INET,
                                                       host_.c_str(),
                                                       port_);
  if (connect_rv < 0) {
    VLOG(1) << "bufferevent_socket_connect_hostname() failed";

    bufferevent_free(bev);

    return false;
  }

  handshake_ = std::make_unique<ClientHandshake>(
      bev,
      [this](bufferevent* bev) {
        stream_ = std::make_unique<BufferEventWebStream>(bev, false);
        stream_->SetCleanupCallback([this](BufferEventWebStream* s) {
          stream_.reset();
        });

        if (on_open_) {
          on_open_(stream_.get());
        }

        stream_->Start();
        handshake_.reset();
      },
      [this]() {
        VLOG(1) << "Client handshake failed";
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
