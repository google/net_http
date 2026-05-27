#ifndef WISH_CPP_SRC_H2_CLIENT_H_
#define WISH_CPP_SRC_H2_CLIENT_H_

#include <event2/bufferevent.h>
#include <event2/dns.h>
#include <event2/event.h>
#include <nghttp2/nghttp2.h>

#include <functional>
#include <string>
#include <unordered_map>

#include "nghttp2_web_stream.h"

// H2Client establishes a plain (cleartext) HTTP/2 (h2c) connection and opens
// a single web-stream (POST / with Content-Type: application/web-stream).
//
// The OpenCallback receives a WebStream that can be used to send and
// receive web-stream messages.  Message and close callbacks should be installed on
// the stream inside the OpenCallback before returning.
class H2Client {
 public:
  // Called with the live WebStream once the server responds with 200.
  using OpenCallback = std::function<void(WebStream*)>;
  using CloseCallback = std::function<void()>;

  H2Client(const std::string& host, int port);
  ~H2Client();

  bool Init();
  void SetOnOpen(OpenCallback cb);
  void SetOnClose(CloseCallback cb);
  void Run();
  void Stop();

 private:
  // Per-connection state (heap-allocated, owned by the callbacks).
  struct Session {
    H2Client* client;

    bufferevent* bev;
    nghttp2_session* h2session;

    // The single web-stream stream created for this connection.
    NGHTTP2WebStream* web_stream;
    int32_t h2_stream_id;

    // HTTP response status code received for h2_stream_id (0 = not yet seen).
    int response_status;
  };

  // libevent bufferevent callbacks
  static void ReadCallback(bufferevent*, void*);
  static void EventCallback(bufferevent*,
                            short,  // NOLINT(runtime/int)
                            void*);

  // nghttp2 session callbacks
  static nghttp2_ssize SendCallback(nghttp2_session*, const uint8_t*, size_t,
                                    int, void*);
  static int OnHeaderCallback(nghttp2_session*, const nghttp2_frame*,
                              const uint8_t*, size_t, const uint8_t*, size_t,
                              uint8_t, void*);
  static int OnFrameRecvCallback(nghttp2_session*, const nghttp2_frame*, void*);
  static int OnDataChunkRecvCallback(nghttp2_session*, uint8_t, int32_t,
                                     const uint8_t*, size_t, void*);
  static int OnStreamCloseCallback(nghttp2_session*, int32_t, uint32_t, void*);

  // nghttp2 data-source read callback
  static nghttp2_ssize DataSourceReadCallback(nghttp2_session*, int32_t, uint8_t*,
                                              size_t, uint32_t*,
                                              nghttp2_data_source*, void*);

  // Initialise nghttp2 and submit the web-stream request.
  // Called inside BEV_EVENT_CONNECTED so that TCP_NODELAY can be set first.
  void InitH2Session(Session* sess);

  std::string host_;
  int port_;

  event_base* base_;
  evdns_base* dns_base_;

  Session* session_;

  OpenCallback on_open_;
  CloseCallback on_close_;
};

#endif  // WISH_CPP_SRC_H2_CLIENT_H_
