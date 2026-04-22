#ifndef WISH_CPP_SRC_PLAIN_CLIENT_H_
#define WISH_CPP_SRC_PLAIN_CLIENT_H_

#include <event2/bufferevent.h>
#include <event2/dns.h>
#include <event2/event.h>

#include <functional>
#include <string>

#include "wish_handler.h"

class PlainClient {
 public:
  using OpenCallback = std::function<void(WishHandler*)>;
  using MessageCallback = std::function<void(uint8_t, const std::string&)>;

  PlainClient(const std::string& host, int port);
  ~PlainClient();

  bool Init();
  void SetOnOpen(OpenCallback cb);
  void SetOnMessage(MessageCallback cb);
  void Run();
  void Stop();

 private:
  std::string host_;
  int port_;

  struct event_base* base_;
  struct evdns_base* dns_base_;

  WishHandler* handler_;

  OpenCallback on_open_;
  MessageCallback on_message_;
};

#endif  // WISH_CPP_SRC_PLAIN_CLIENT_H_
