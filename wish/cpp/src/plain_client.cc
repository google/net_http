#include "plain_client.h"

#include <iostream>

PlainClient::PlainClient(const std::string& host, int port)
    : host_(host),
      port_(port),
      base_(nullptr),
      dns_base_(nullptr),
      handler_(nullptr) {}

PlainClient::~PlainClient() {
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
    std::cerr << "Could not initialize libevent!" << std::endl;
    return false;
  }

  dns_base_ = evdns_base_new(base_, 1);
  if (!dns_base_) {
    std::cerr << "Could not initialize dns!" << std::endl;
    return false;
  }

  struct bufferevent* bev =
      bufferevent_socket_new(base_, -1, BEV_OPT_CLOSE_ON_FREE);
  if (!bev) {
    std::cerr << "Could not create bufferevent!" << std::endl;
    return false;
  }

  if (bufferevent_socket_connect_hostname(bev, dns_base_, AF_INET,
                                          host_.c_str(), port_) < 0) {
    std::cerr << "Could not connect!" << std::endl;
    return false;
  }

  handler_ = new WishHandler(bev, false);

  if (on_open_) {
    handler_->SetOnOpen([this]() { on_open_(handler_); });
  }

  if (on_message_) {
    handler_->SetOnMessage(on_message_);
  }

  if (on_close_) {
    handler_->SetOnClose(on_close_);
  }

  handler_->Start();

  return true;
}

void PlainClient::SetOnOpen(OpenCallback cb) {
  on_open_ = cb;
  if (handler_) {
    handler_->SetOnOpen([this]() { on_open_(handler_); });
  }
}

void PlainClient::SetOnMessage(MessageCallback cb) {
  on_message_ = cb;
  if (handler_) {
    handler_->SetOnMessage(on_message_);
  }
}

void PlainClient::SetOnClose(CloseCallback cb) {
  on_close_ = cb;
  if (handler_) {
    handler_->SetOnClose(on_close_);
  }
}

void PlainClient::Run() {
  std::cout << "Client running..." << std::endl;

  event_base_dispatch(base_);
}

void PlainClient::Stop() {
  if (base_) {
    event_base_loopexit(base_, nullptr);
  }
}
