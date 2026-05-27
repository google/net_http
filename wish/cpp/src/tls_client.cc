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

#include "tls_client.h"

#include <absl/log/log.h>
#include <event2/bufferevent_ssl.h>
#include <openssl/ssl.h>

TlsClient::TlsClient(event_base* base,
                     const std::string& host,
                     int port,
                     const std::string& ca_file,
                     const std::string& cert_file,
                     const std::string& key_file)
    : base_(base),
      host_(host),
      port_(port),
      ca_file_(ca_file),
      cert_file_(cert_file),
      key_file_(key_file),
      dns_base_(nullptr),
      stream_(nullptr) {}

TlsClient::~TlsClient() {
  handshake_.reset();
  stream_.reset();

  if (dns_base_) {
    evdns_base_free(dns_base_, 0);
  }
}

bool TlsClient::Init() {
  SSL_library_init();
  SSL_load_error_strings();

  tls_ctx_.set_ca_file(ca_file_);
  tls_ctx_.set_certificate_file(cert_file_);
  tls_ctx_.set_private_key_file(key_file_);

  if (!tls_ctx_.Init(false)) {
    VLOG(1) << "Failed to init TLS context";

    return false;
  }

  if (!base_) {
    VLOG(1) << "event_base is null";

    return false;
  }

  dns_base_ = evdns_base_new(base_, 1);
  if (!dns_base_) {
    VLOG(1) << "evdns_base_new() failed";

    return false;
  }

  SSL* ssl = SSL_new(tls_ctx_.ssl_ctx());
  bufferevent* bev = bufferevent_openssl_socket_new(base_,
                                                    -1,
                                                    ssl,
                                                    BUFFEREVENT_SSL_CONNECTING,
                                                    BEV_OPT_CLOSE_ON_FREE);
  if (!bev) {
    VLOG(1) << "bufferevent_openssl_socket_new() failed";

    SSL_free(ssl);

    return false;
  }

  bufferevent_openssl_set_allow_dirty_shutdown(bev, 1);

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

void TlsClient::SetOnOpen(OpenCallback cb) {
  on_open_ = cb;
}

int TlsClient::Run() {
  return event_base_dispatch(base_);
}

int TlsClient::Stop() {
  if (base_) {
    return event_base_loopexit(base_, nullptr);
  }
  return -1;
}
