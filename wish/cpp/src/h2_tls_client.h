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

#ifndef WISH_CPP_SRC_H2_TLS_CLIENT_H_
#define WISH_CPP_SRC_H2_TLS_CLIENT_H_

#include <event2/bufferevent.h>
#include <event2/dns.h>
#include <event2/event.h>
#include <nghttp2/nghttp2.h>

#include <functional>
#include <string>

#include "nghttp2_web_stream.h"
#include "tls_context.h"

// H2TlsClient establishes a TLS-encrypted HTTP/2 connection and opens a single web-stream.
// ALPN "h2" is negotiated during the TLS handshake.
// mTLS is used (client certificate required), matching TlsClient.
class H2TlsClient {
 public:
  using OpenCallback = std::function<void(WebStream*)>;
  using CloseCallback = std::function<void()>;
  using ErrorCallback = std::function<void()>;

  H2TlsClient(event_base* base,
              const std::string& host,
              int port,
              const std::string& ca_file,
              const std::string& cert_file,
              const std::string& key_file);
  ~H2TlsClient();

  bool Init();

  void SetOnOpen(OpenCallback cb);
  void SetOnError(ErrorCallback cb);

  int Run();
  int Stop();

 private:
  struct Session {
    H2TlsClient* client;

    bufferevent* bev;
    nghttp2_session* h2session;

    NGHTTP2WebStream* web_stream;
    int32_t h2_stream_id;

    // HTTP response status code received for h2_stream_id (0 = not yet seen).
    int response_status;
  };

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

  void InitH2Session(Session* sess);
  void HandleSessionError(Session* sess);

  event_base* base_;

  std::string host_;
  int port_;

  std::string ca_file_;
  std::string cert_file_;
  std::string key_file_;

  evdns_base* dns_base_;

  TlsContext tls_ctx_;

  Session* session_;

  OpenCallback on_open_;
  ErrorCallback on_error_;
};

#endif  // WISH_CPP_SRC_H2_TLS_CLIENT_H_
