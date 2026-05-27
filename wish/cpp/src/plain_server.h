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
