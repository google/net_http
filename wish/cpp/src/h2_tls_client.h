#ifndef WISH_CPP_SRC_H2_TLS_CLIENT_H_
#define WISH_CPP_SRC_H2_TLS_CLIENT_H_

#include <event2/bufferevent.h>
#include <event2/dns.h>
#include <event2/event.h>
#include <nghttp2/nghttp2.h>

#include <functional>
#include <string>

#include "h2_wish_stream.h"
#include "tls_context.h"

// H2TlsClient establishes a TLS-encrypted HTTP/2 connection and opens a single web-stream.
// ALPN "h2" is negotiated during the TLS handshake.
// mTLS is used (client certificate required), matching TlsClient.
class H2TlsClient {
 public:
  using OpenCallback = std::function<void(H2WishStream*)>;
  using CloseCallback = std::function<void()>;

  H2TlsClient(const std::string& host,
              int port,
              const std::string& ca_file,
              const std::string& cert_file,
              const std::string& key_file);
  ~H2TlsClient();

  bool Init();
  void SetOnOpen(OpenCallback cb);
  void SetOnClose(CloseCallback cb);
  void Run();
  void Stop();

 private:
  struct Session {
    H2TlsClient* client;
    bufferevent* bev;
    nghttp2_session* h2session;
    H2WishStream* wish_stream;
    int32_t wish_stream_id;
  };

  // libevent bufferevent callbacks
  static void ReadCallback(bufferevent*, void*);
  static void EventCallback(bufferevent*,
                            short,  // NOLINT(runtime/int)
                            void*);

  // nghttp2 session callbacks
  static ssize_t SendCallback(nghttp2_session*, const uint8_t*, size_t, int,
                              void*);
  static int OnHeaderCallback(nghttp2_session*, const nghttp2_frame*,
                              const uint8_t*, size_t, const uint8_t*, size_t,
                              uint8_t, void*);
  static int OnFrameRecvCallback(nghttp2_session*, const nghttp2_frame*, void*);
  static int OnDataChunkRecvCallback(nghttp2_session*, uint8_t, int32_t,
                                     const uint8_t*, size_t, void*);
  static int OnStreamCloseCallback(nghttp2_session*, int32_t, uint32_t, void*);

  static ssize_t DataSourceReadCallback(nghttp2_session*, int32_t, uint8_t*,
                                        size_t, uint32_t*,
                                        nghttp2_data_source*, void*);

  void InitH2Session(Session* sess);

  std::string host_;
  int port_;

  std::string ca_file_;
  std::string cert_file_;
  std::string key_file_;

  event_base* base_;
  evdns_base* dns_base_;

  TlsContext tls_ctx_;

  Session* session_;

  OpenCallback on_open_;
  CloseCallback on_close_;
};

#endif  // WISH_CPP_SRC_H2_TLS_CLIENT_H_
