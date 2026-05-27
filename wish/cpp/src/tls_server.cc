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

#include "tls_server.h"

#include <absl/log/log.h>
#include <arpa/inet.h>
#include <event2/bufferevent_ssl.h>
#include <netinet/tcp.h>
#include <openssl/ssl.h>

#include <algorithm>
#include <cstring>

#include "buffer_event_web_stream.h"
#include "handshake.h"

TlsServer::TlsServer(event_base* base,
                     int port,
                     const std::string& ca_file,
                     const std::string& cert_file,
                     const std::string& key_file)
    : base_(base),
      port_(port),
      ca_file_(ca_file),
      cert_file_(cert_file),
      key_file_(key_file),
      listener_(nullptr) {}

TlsServer::~TlsServer() {
  active_handshakes_.clear();
  active_streams_.clear();

  if (listener_) {
    evconnlistener_free(listener_);
  }
}

bool TlsServer::Init() {
  SSL_library_init();
  SSL_load_error_strings();

  tls_ctx_.set_ca_file(ca_file_);
  tls_ctx_.set_certificate_file(cert_file_);
  tls_ctx_.set_private_key_file(key_file_);

  if (!tls_ctx_.Init(true)) {
    VLOG(1) << "Failed to init TLS context";

    return false;
  }

  if (!base_) {
    VLOG(1) << "event_base is null";

    return false;
  }

  sockaddr_in sin;
  memset(&sin, 0, sizeof(sin));
  sin.sin_family = AF_INET;
  sin.sin_addr.s_addr = htonl(0);
  sin.sin_port = htons(port_);

  // passing 'this' instead of &tls_ctx_ because we can pass TlsServer
  // and access tls_ctx_ from it
  listener_ = evconnlistener_new_bind(base_,
                                      AcceptConnCb,
                                      this,
                                      LEV_OPT_CLOSE_ON_FREE | LEV_OPT_REUSEABLE,
                                      -1,
                                      (sockaddr*)&sin,
                                      sizeof(sin));

  if (!listener_) {
    VLOG(1) << "Could not create a listener!";

    return false;
  }

  evconnlistener_set_error_cb(listener_, AcceptErrorCb);

  return true;
}

int TlsServer::Run() {
  return event_base_dispatch(base_);
}

void TlsServer::SetOnStream(StreamCallback cb) {
  on_stream_ = cb;
}

void TlsServer::AcceptConnCb(evconnlistener* listener,
                             evutil_socket_t fd,
                             sockaddr* address,
                             int socklen,
                             void* ctx) {
  event_base* base = evconnlistener_get_base(listener);
  TlsServer* server = static_cast<TlsServer*>(ctx);

  int one = 1;
  int set_opt_rv = setsockopt(fd,
                              IPPROTO_TCP,
                              TCP_NODELAY,
                              &one,
                              sizeof(one));
  if (set_opt_rv < 0) {
    VLOG(1) << "setsockopt(TCP_NODELAY) failed: " << strerror(errno);
  }

  SSL* ssl = SSL_new(server->tls_ctx_.ssl_ctx());
  bufferevent* bev = bufferevent_openssl_socket_new(base,
                                                    fd,
                                                    ssl,
                                                    BUFFEREVENT_SSL_ACCEPTING,
                                                    BEV_OPT_CLOSE_ON_FREE);
  if (!bev) {
    VLOG(1) << "bufferevent_openssl_socket_new() failed";

    SSL_free(ssl);

    if (evutil_closesocket(fd) != 0) {
      VLOG(2) << "evutil_closesocket failed";
    }

    return;
  }

  bufferevent_openssl_set_allow_dirty_shutdown(bev, 1);

  auto handshake = std::make_unique<ServerHandshake>(
      bev,
      [server](bufferevent* bev) {
        auto stream = std::make_unique<BufferEventWebStream>(bev, true);

        if (!stream->Init()) {
          VLOG(1) << "BufferEventWebStream::Init() failed";

          return;
        }

        auto* raw_stream = stream.get();
        server->active_streams_.push_back(std::move(stream));

        raw_stream->SetCleanupCallback([server](BufferEventWebStream* s) {
          server->RemoveStream(s);
        });

        if (server->on_stream_) {
          server->on_stream_(raw_stream);
        } else {
          VLOG(2) << "Warning: No stream handler registered.";
        }

        raw_stream->Start();
      },
      []() {
        VLOG(1) << "Server handshake failed";
      },
      [server](ServerHandshake* h) {
        server->RemoveHandshake(h);
      });

  auto* raw_handshake = handshake.get();
  server->active_handshakes_.push_back(std::move(handshake));
  raw_handshake->Start();
}

void TlsServer::AcceptErrorCb(evconnlistener* listener,
                              void* ctx) {
  (void)ctx;

  event_base* base = evconnlistener_get_base(listener);
  int err = EVUTIL_SOCKET_ERROR();
  VLOG(1) << "Got an error " << err << " ("
          << evutil_socket_error_to_string(err)
          << ") on the listener. Shutting down.";

  if (event_base_loopexit(base, nullptr) != 0) {
    VLOG(2) << "event_base_loopexit failed";
  }
}

void TlsServer::RemoveHandshake(ServerHandshake* handshake) {
  auto it = std::find_if(active_handshakes_.begin(), active_handshakes_.end(), [handshake](const auto& ptr) { return ptr.get() == handshake; });
  if (it != active_handshakes_.end()) {
    auto ptr = std::move(*it);
    active_handshakes_.erase(it);
  }
}

void TlsServer::RemoveStream(BufferEventWebStream* stream) {
  auto it = std::find_if(active_streams_.begin(), active_streams_.end(), [stream](const auto& ptr) { return ptr.get() == stream; });
  if (it != active_streams_.end()) {
    auto ptr = std::move(*it);
    active_streams_.erase(it);
  }
}
