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

  PlainClient(event_base* base,
              const std::string& host,
              int port);
  ~PlainClient();

  bool Init();

  void SetOnOpen(OpenCallback cb);

  void Run();
  void Stop();

 private:
  event_base* base_;

  std::string host_;
  int port_;

  evdns_base* dns_base_;

  std::unique_ptr<ClientHandshake> handshake_;
  std::unique_ptr<BufferEventWebStream> stream_;

  OpenCallback on_open_;
};

#endif  // WISH_CPP_SRC_PLAIN_CLIENT_H_
