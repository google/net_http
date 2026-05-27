#ifndef WISH_CPP_SRC_TLS_SERVER_H_
#define WISH_CPP_SRC_TLS_SERVER_H_

#include <event2/bufferevent.h>
#include <event2/event.h>
#include <event2/listener.h>

#include <functional>
#include <string>

#include "buffer_event_web_stream.h"
#include "tls_context.h"

class TlsServer {
 public:
  using StreamCallback = std::function<void(BufferEventWebStream*)>;

  TlsServer(int port,
            const std::string& ca_file,
            const std::string& cert_file,
            const std::string& key_file);
  ~TlsServer();

  bool Init();
  void SetOnStream(StreamCallback cb);
  void Run();

 private:
  static void AcceptConnCb(evconnlistener* listener, evutil_socket_t fd,
                           sockaddr* address, int socklen, void* ctx);
  static void AcceptErrorCb(evconnlistener* listener, void* ctx);

  int port_;

  std::string ca_file_;
  std::string cert_file_;
  std::string key_file_;

  TlsContext tls_ctx_;
  event_base* base_;
  evconnlistener* listener_;

  StreamCallback on_stream_;
};

#endif  // WISH_CPP_SRC_TLS_SERVER_H_
