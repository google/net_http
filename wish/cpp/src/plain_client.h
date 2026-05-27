#ifndef WISH_CPP_SRC_PLAIN_CLIENT_H_
#define WISH_CPP_SRC_PLAIN_CLIENT_H_

#include <event2/bufferevent.h>
#include <event2/dns.h>
#include <event2/event.h>

#include <functional>
#include <string>

#include <memory>

#include "buffer_event_web_stream.h"
#include "handshake.h"

class PlainClient {
 public:
  using OpenCallback = std::function<void(WebStream*)>;
  using MessageCallback = std::function<void(uint8_t, const std::string&)>;
  using CloseCallback = std::function<void()>;

  PlainClient(const std::string& host,
              int port);
  ~PlainClient();

  bool Init();

  void SetOnOpen(OpenCallback cb);

  void Run();
  void Stop();

 private:
  std::string host_;
  int port_;

  event_base* base_;
  evdns_base* dns_base_;

  std::unique_ptr<ClientHandshake> handshake_;
  BufferEventWebStream* stream_;

  OpenCallback on_open_;
};

#endif  // WISH_CPP_SRC_PLAIN_CLIENT_H_
