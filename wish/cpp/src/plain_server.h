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

#ifndef WISH_CPP_SRC_PLAIN_SERVER_H_
#define WISH_CPP_SRC_PLAIN_SERVER_H_

#include <event2/bufferevent.h>
#include <event2/event.h>
#include <event2/listener.h>

#include <functional>
#include <memory>
#include <vector>

#include "web_stream.h"

class ServerHandshake;
class BufferEventWebStream;

class PlainServer {
 public:
  using StreamCallback = std::function<void(WebStream*)>;

  PlainServer(event_base* base,
              int port);
  ~PlainServer();

  bool Init();
  void SetOnStream(StreamCallback cb);
  int Run();

 private:
  static void AcceptConnCb(evconnlistener* listener,
                           evutil_socket_t fd,
                           sockaddr* address,
                           int socklen,
                           void* ctx);
  static void AcceptErrorCb(evconnlistener* listener,
                            void* ctx);

  void RemoveHandshake(ServerHandshake* handshake);
  void RemoveStream(BufferEventWebStream* stream);

  event_base* base_;

  int port_;

  evconnlistener* listener_;

  StreamCallback on_stream_;

  std::vector<std::unique_ptr<ServerHandshake>> active_handshakes_;
  std::vector<std::unique_ptr<BufferEventWebStream>> active_streams_;
};

#endif  // WISH_CPP_SRC_PLAIN_SERVER_H_
