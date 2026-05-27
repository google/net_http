#ifndef WISH_CPP_SRC_TLS_CLIENT_H_
#define WISH_CPP_SRC_TLS_CLIENT_H_

#include <event2/bufferevent.h>
#include <event2/dns.h>
#include <event2/event.h>

#include <functional>
#include <memory>
#include <string>

#include "buffer_event_web_stream.h"
#include "handshake.h"
#include "tls_context.h"

class TlsClient {
 public:
  using OpenCallback = std::function<void(WebStream*)>;
  using MessageCallback = std::function<void(uint8_t, const std::string&)>;
  using CloseCallback = std::function<void()>;

  TlsClient(event_base* base,
            const std::string& host,
            int port,
            const std::string& ca_file,
            const std::string& cert_file,
            const std::string& key_file);
  ~TlsClient();

  bool Init();

  void SetOnOpen(OpenCallback cb);

  void Run();
  void Stop();

 private:
  event_base* base_;

  std::string host_;
  int port_;

  std::string ca_file_;
  std::string cert_file_;
  std::string key_file_;

  evdns_base* dns_base_;

  TlsContext tls_ctx_;

  std::unique_ptr<ClientHandshake> handshake_;
  std::unique_ptr<BufferEventWebStream> stream_;

  OpenCallback on_open_;
};

#endif  // WISH_CPP_SRC_TLS_CLIENT_H_
