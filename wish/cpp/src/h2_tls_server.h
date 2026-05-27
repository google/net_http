/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#ifndef WISH_CPP_SRC_H2_TLS_SERVER_H_
#define WISH_CPP_SRC_H2_TLS_SERVER_H_

#include <event2/bufferevent.h>
#include <event2/event.h>
#include <event2/listener.h>
#include <nghttp2/nghttp2.h>

#include <functional>
#include <string>
#include <unordered_map>

#include "nghttp2_web_stream.h"
#include "tls_context.h"

// H2TlsServer listens for TLS-encrypted HTTP/2 connections.
// ALPN "h2" is advertised so standard HTTP/2 clients can connect.
// mTLS is enforced (client certificates are required), matching TlsServer.
class H2TlsServer {
 public:
  using StreamCallback = std::function<void(WebStream*)>;

  H2TlsServer(event_base* base,
              const std::string& ca_file,
              const std::string& cert_file,
              const std::string& key_file,
              int port);
  ~H2TlsServer();

  bool Init();
  void SetOnStream(StreamCallback cb);
  int Run();

 private:
  struct Session {
    struct Http2Stream {
      std::unordered_map<std::string, std::string> headers;
      NGHTTP2WebStream* web_stream = nullptr;
    };

    H2TlsServer* server;

    bufferevent* bev;

    nghttp2_session* h2session;

    // Tracks received headers and active web-streams per HTTP/2 stream.
    std::unordered_map<int32_t, Http2Stream> incoming_streams;
  };

  // libevent listener callbacks
  static void AcceptConnCb(evconnlistener*,
                           evutil_socket_t,
                           sockaddr*, int,
                           void*);
  static void AcceptErrorCb(evconnlistener*,
                            void*);

  // libevent bufferevent callbacks
  static void ReadCallback(bufferevent*,
                           void*);
  static void EventCallback(bufferevent*,
                            short,  // NOLINT(runtime/int)
                            void*);

  // nghttp2 session callbacks
  static nghttp2_ssize SendCallback(nghttp2_session*,
                                    const uint8_t*,
                                    size_t,
                                    int,
                                    void*);
  static int OnHeaderCallback(nghttp2_session*,
                              const nghttp2_frame*,
                              const uint8_t*,
                              size_t,
                              const uint8_t*,
                              size_t,
                              uint8_t,
                              void*);
  static int OnFrameRecvCallback(nghttp2_session*,
                                 const nghttp2_frame*,
                                 void*);
  static int OnDataChunkRecvCallback(nghttp2_session*,
                                     uint8_t,
                                     int32_t,
                                     const uint8_t*,
                                     size_t,
                                     void*);
  static int OnStreamCloseCallback(nghttp2_session*,
                                   int32_t,
                                   uint32_t,
                                   void*);

  static nghttp2_ssize DataSourceReadCallback(nghttp2_session*,
                                              int32_t,
                                              uint8_t*,
                                              size_t,
                                              uint32_t*,
                                              nghttp2_data_source*,
                                              void*);

  static nghttp2_session* CreateH2Session(Session* sess);

  event_base* base_;

  int port_;

  std::string ca_file_;
  std::string cert_file_;
  std::string key_file_;

  evconnlistener* listener_;

  TlsContext tls_ctx_;

  StreamCallback on_stream_;
};

#endif  // WISH_CPP_SRC_H2_TLS_SERVER_H_
