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

#ifndef WISH_CPP_SRC_PLAIN_CLIENT_H_
#define WISH_CPP_SRC_PLAIN_CLIENT_H_

#include <event2/bufferevent.h>
#include <event2/dns.h>
#include <event2/event.h>

#include <functional>
#include <memory>
#include <string>

#include "buffer_event_web_stream.h"
#include "handshake.h"

class PlainClient {
 public:
  using OpenCallback = std::function<void(WebStream*)>;
  using MessageCallback = std::function<void(uint8_t, const std::string&)>;
  using CloseCallback = std::function<void()>;
  using ErrorCallback = std::function<void()>;

  PlainClient(event_base* base,
              const std::string& host,
              int port);
  ~PlainClient();

  bool Init();

  void SetOnOpen(OpenCallback cb);
  void SetOnError(ErrorCallback cb);

  int Run();
  int Stop();

 private:
  event_base* base_;

  std::string host_;
  int port_;

  evdns_base* dns_base_;

  std::unique_ptr<ClientHandshake> handshake_;
  std::unique_ptr<BufferEventWebStream> stream_;

  OpenCallback on_open_;
  ErrorCallback on_error_;
};

#endif  // WISH_CPP_SRC_PLAIN_CLIENT_H_
