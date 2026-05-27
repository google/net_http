#ifndef WISH_CPP_SRC_PLAIN_SERVER_H_
#define WISH_CPP_SRC_PLAIN_SERVER_H_

#include <event2/bufferevent.h>
#include <event2/event.h>
#include <event2/listener.h>

#include <functional>

#include "buffer_event_web_stream.h"

class PlainServer {
 public:
  using StreamCallback = std::function<void(BufferEventWebStream*)>;

  explicit PlainServer(int port);
  ~PlainServer();

  bool Init();
  void SetOnStream(StreamCallback cb);
  void Run();

 private:
  static void AcceptConnCb(evconnlistener* listener, evutil_socket_t fd,
                           sockaddr* address, int socklen, void* ctx);
  static void AcceptErrorCb(evconnlistener* listener, void* ctx);

  int port_;
  event_base* base_;
  evconnlistener* listener_;

  StreamCallback on_stream_;
};

#endif  // WISH_CPP_SRC_PLAIN_SERVER_H_
