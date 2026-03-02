#ifndef WISH_CPP_SRC_TLS_SERVER_H_
#define WISH_CPP_SRC_TLS_SERVER_H_

#include <functional>
#include <string>

#include <event2/bufferevent.h>
#include <event2/event.h>
#include <event2/listener.h>

#include "tls_context.h"

class TlsServer {
 public:
  using ConnectCallback = std::function<void(struct bufferevent*)>;

  TlsServer(const std::string& ca_file, const std::string& cert_file,
             const std::string& key_file, int port);
  ~TlsServer();

  bool Init();
  void SetOnConnection(ConnectCallback cb);
  void Run();

 private:
  static void AcceptConnCb(struct evconnlistener* listener, evutil_socket_t fd,
                           struct sockaddr* address, int socklen, void* ctx);
  static void AcceptErrorCb(struct evconnlistener* listener, void* ctx);

  std::string ca_file_;
  std::string cert_file_;
  std::string key_file_;

  int port_;

  TlsContext tls_ctx_;
  struct event_base* base_;
  struct evconnlistener* listener_;

  ConnectCallback on_connection_;
};

#endif  // WISH_CPP_SRC_TLS_SERVER_H_
