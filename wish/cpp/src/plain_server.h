#ifndef WISH_CPP_SRC_PLAIN_SERVER_H_
#define WISH_CPP_SRC_PLAIN_SERVER_H_

#include <event2/bufferevent.h>
#include <event2/event.h>
#include <event2/listener.h>

#include <functional>

class PlainServer {
 public:
  using ConnectCallback = std::function<void(bufferevent*)>;

  explicit PlainServer(int port);
  ~PlainServer();

  bool Init();
  void SetOnConnection(ConnectCallback cb);
  void Run();

 private:
  static void AcceptConnCb(evconnlistener* listener, evutil_socket_t fd,
                           sockaddr* address, int socklen, void* ctx);
  static void AcceptErrorCb(evconnlistener* listener, void* ctx);

  int port_;
  event_base* base_;
  evconnlistener* listener_;

  ConnectCallback on_connection_;
};

#endif  // WISH_CPP_SRC_PLAIN_SERVER_H_
