#ifndef WISH_CPP_SRC_H2_SERVER_H_
#define WISH_CPP_SRC_H2_SERVER_H_

#include <event2/bufferevent.h>
#include <event2/event.h>
#include <event2/listener.h>
#include <nghttp2/nghttp2.h>

#include <functional>
#include <string>
#include <unordered_map>

#include "nghttp2_web_stream.h"

// H2Server listens for plain (cleartext) HTTP/2 (h2c) connections and
// exposes each incoming web-stream stream as an NGHTTP2WebStream to the caller.
class H2Server {
 public:
  // Called once per accepted web-stream stream.  The callback owns no lifetime;
  // the stream is deleted by H2Server when the HTTP/2 stream closes.
  using StreamCallback = std::function<void(NGHTTP2WebStream*)>;

  explicit H2Server(int port);
  ~H2Server();

  bool Init();
  void SetOnStream(StreamCallback cb);
  void Run();

 private:
  // Per-connection state.
  struct Session {
    H2Server* server;
    bufferevent* bev;
    nghttp2_session* h2session;

    // Live web-stream streams keyed by HTTP/2 stream id.
    std::unordered_map<int32_t, NGHTTP2WebStream*> streams;
    // Tracks whether a stream's HEADERS carried the web-stream content-type.
    std::unordered_map<int32_t, bool> stream_is_wish;
  };

  // libevent listener callbacks
  static void AcceptConnCb(evconnlistener*, evutil_socket_t,
                           sockaddr*, int, void*);
  static void AcceptErrorCb(evconnlistener*, void*);

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

  // nghttp2 data-source read callback (feeds NGHTTP2WebStream output to H2 DATA)
  static ssize_t DataSourceReadCallback(nghttp2_session*, int32_t, uint8_t*,
                                        size_t, uint32_t*,
                                        nghttp2_data_source*, void*);

  // Helper: initialise an nghttp2 server session for a new connection.
  static nghttp2_session* CreateH2Session(Session* sess);

  int port_;
  event_base* base_;
  evconnlistener* listener_;
  StreamCallback on_stream_;
};

#endif  // WISH_CPP_SRC_H2_SERVER_H_
