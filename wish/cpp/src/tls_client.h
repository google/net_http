#ifndef WISH_CPP_SRC_TLS_CLIENT_H_
#define WISH_CPP_SRC_TLS_CLIENT_H_

#include <functional>
#include <string>

#include "event2/bufferevent.h"
#include "event2/dns.h"
#include "event2/event.h"
#include "tls_context.h"
#include "wish_handler.h"

class TlsClient {
 public:
  using OpenCallback = std::function<void(WishHandler*)>;
  using MessageCallback = std::function<void(uint8_t, const std::string&)>;
  using CloseCallback = std::function<void()>;

  TlsClient(const std::string& ca_file, const std::string& cert_file,
            const std::string& key_file, const std::string& host, int port);
  ~TlsClient();

  bool Init();
  void SetOnOpen(OpenCallback cb);
  void SetOnMessage(MessageCallback cb);
  void SetOnClose(CloseCallback cb);
  void Run();
  void Stop();

 private:
  std::string ca_file_;
  std::string cert_file_;
  std::string key_file_;

  std::string host_;
  int port_;

  TlsContext tls_ctx_;

  struct event_base* base_;
  struct evdns_base* dns_base_;

  WishHandler* handler_;

  OpenCallback on_open_;
  MessageCallback on_message_;
  CloseCallback on_close_;
};

#endif  // WISH_CPP_SRC_TLS_CLIENT_H_
