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

#include "plain_client.h"

#include <absl/log/log.h>

PlainClient::PlainClient(event_base* base,
                         const std::string& host,
                         int port)
    : base_(base),
      host_(host),
      port_(port),
      dns_base_(nullptr),
      stream_(nullptr) {}

PlainClient::~PlainClient() {
  handshake_.reset();
  stream_.reset();

  if (dns_base_) {
    evdns_base_free(dns_base_, 0);
  }
}

bool PlainClient::Init() {
  if (!base_) {
    VLOG(1) << "event_base is null";

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
        auto s = std::make_unique<BufferEventWebStream>(bev, false);

        if (!s->Init()) {
          VLOG(1) << "BufferEventWebStream::Init() failed";

          handshake_.reset();

          return;
        }

        stream_ = std::move(s);
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

int PlainClient::Run() {
  return event_base_dispatch(base_);
}

int PlainClient::Stop() {
  if (base_) {
    return event_base_loopexit(base_, nullptr);
  }
  return -1;
}
