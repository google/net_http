#include "h2_server.h"

#include <arpa/inet.h>
#include <netinet/tcp.h>

#include <algorithm>
#include <cstring>
#include <iostream>

#define H2S_MAKE_NV(name, value) \
  {                              \
      (uint8_t*)(name), (uint8_t*)(value), strlen(name), strlen(value), NGHTTP2_NV_FLAG_NONE}

H2Server::H2Server(int port)
    : port_(port), base_(nullptr), listener_(nullptr) {}

H2Server::~H2Server() {
  if (listener_) {
    evconnlistener_free(listener_);
  }
  if (base_) {
    event_base_free(base_);
  }
}

bool H2Server::Init() {
  base_ = event_base_new();
  if (!base_) {
    std::cerr << "H2Server: event_base_new() failed" << std::endl;
    return false;
  }

  struct sockaddr_in sin;
  memset(&sin, 0, sizeof(sin));
  sin.sin_family = AF_INET;
  sin.sin_addr.s_addr = htonl(INADDR_ANY);
  sin.sin_port = htons(port_);

  listener_ = evconnlistener_new_bind(base_,
                                      AcceptConnCb,
                                      this,
                                      LEV_OPT_CLOSE_ON_FREE | LEV_OPT_REUSEABLE,
                                      -1,
                                      reinterpret_cast<struct sockaddr*>(&sin),
                                      sizeof(sin));
  if (!listener_) {
    std::cerr << "H2Server: evconnlistener_new_bind() failed" << std::endl;
    return false;
  }

  evconnlistener_set_error_cb(listener_,
                              AcceptErrorCb);
  return true;
}

void H2Server::SetOnStream(StreamCallback cb) { on_stream_ = cb; }

void H2Server::Run() {
  std::cout << "H2Server listening on port " << port_ << "..." << std::endl;
  event_base_dispatch(base_);
}

// ---- libevent listener callbacks ----

void H2Server::AcceptConnCb(struct evconnlistener* listener, evutil_socket_t fd,
                            struct sockaddr* /*address*/, int /*socklen*/,
                            void* ctx) {
  H2Server* server = static_cast<H2Server*>(ctx);
  struct event_base* base = evconnlistener_get_base(listener);

  int one = 1;
  setsockopt(fd,
             IPPROTO_TCP,
             TCP_NODELAY,
             &one,
             sizeof(one));

  struct bufferevent* bev =
      bufferevent_socket_new(base,
                             fd,
                             BEV_OPT_CLOSE_ON_FREE);
  if (!bev) {
    std::cerr << "H2Server: bufferevent_socket_new() failed" << std::endl;
    evutil_closesocket(fd);
    return;
  }

  Session* sess = new Session;
  sess->server = server;
  sess->bev = bev;
  sess->h2session = CreateH2Session(sess);

  // Send server connection preface (SETTINGS frame).
  nghttp2_settings_entry iv[] = {
      {NGHTTP2_SETTINGS_MAX_CONCURRENT_STREAMS, 100},
      {NGHTTP2_SETTINGS_INITIAL_WINDOW_SIZE, 1 << 20}};
  nghttp2_submit_settings(sess->h2session,
                          NGHTTP2_FLAG_NONE,
                          iv,
                          2);
  nghttp2_session_set_local_window_size(sess->h2session,
                                        NGHTTP2_FLAG_NONE,
                                        0,
                                        1 << 20);
  nghttp2_session_send(sess->h2session);

  bufferevent_setcb(bev, ReadCallback, nullptr, EventCallback, sess);
  bufferevent_enable(bev, EV_READ | EV_WRITE);
}

void H2Server::AcceptErrorCb(struct evconnlistener* listener, void* /*ctx*/) {
  struct event_base* base = evconnlistener_get_base(listener);
  int err = EVUTIL_SOCKET_ERROR();
  std::cerr << "H2Server: listener error " << err << " ("
            << evutil_socket_error_to_string(err) << ")" << std::endl;
  event_base_loopexit(base, nullptr);
}

// ---- libevent bufferevent callbacks ----

void H2Server::ReadCallback(struct bufferevent* bev, void* ctx) {
  Session* sess = static_cast<Session*>(ctx);

  struct evbuffer* input = bufferevent_get_input(bev);
  size_t len = evbuffer_get_length(input);
  if (len == 0) {
    return;
  }

  unsigned char* data = evbuffer_pullup(input, -1);
  ssize_t readlen =
      nghttp2_session_mem_recv(sess->h2session,
                               data,
                               len);
  if (readlen < 0) {
    std::cerr << "H2Server: nghttp2_session_mem_recv failed: "
              << nghttp2_strerror(static_cast<int>(readlen)) << std::endl;
    bufferevent_free(bev);
    return;
  }
  evbuffer_drain(input, static_cast<size_t>(readlen));

  int rv = nghttp2_session_send(sess->h2session);
  if (rv < 0) {
    std::cerr << "H2Server: nghttp2_session_send failed: "
              << nghttp2_strerror(rv) << std::endl;
  }
}

void H2Server::EventCallback(struct bufferevent* bev,
                             short events,  // NOLINT(runtime/int)
                             void* ctx) {
  Session* sess = static_cast<Session*>(ctx);

  if (events & BEV_EVENT_ERROR) {
    std::cerr << "H2Server: connection error" << std::endl;
  }

  if (events & (BEV_EVENT_EOF | BEV_EVENT_ERROR)) {
    for (auto& [sid, stream] : sess->streams) {
      stream->OnClose();
      delete stream;
    }
    nghttp2_session_del(sess->h2session);
    bufferevent_free(bev);
    delete sess;
  }
}

// ---- nghttp2 session callbacks ----

ssize_t H2Server::SendCallback(nghttp2_session* /*session*/,
                               const uint8_t* data, size_t length,
                               int /*flags*/, void* user_data) {
  Session* sess = static_cast<Session*>(user_data);
  bufferevent_write(sess->bev,
                    data,
                    length);
  return static_cast<ssize_t>(length);
}

int H2Server::OnHeaderCallback(nghttp2_session* /*session*/,
                               const nghttp2_frame* frame, const uint8_t* name,
                               size_t namelen, const uint8_t* value,
                               size_t valuelen, uint8_t /*flags*/,
                               void* user_data) {
  if (frame->hd.type != NGHTTP2_HEADERS ||
      frame->headers.cat != NGHTTP2_HCAT_REQUEST) {
    return 0;
  }
  Session* sess = static_cast<Session*>(user_data);
  int32_t stream_id = frame->hd.stream_id;

  std::string hdr_name(reinterpret_cast<const char*>(name), namelen);
  std::string hdr_value(reinterpret_cast<const char*>(value), valuelen);

  if (hdr_name == "content-type" && hdr_value == "application/web-stream") {
    sess->stream_is_wish[stream_id] = true;
  }
  return 0;
}

int H2Server::OnFrameRecvCallback(nghttp2_session* session,
                                  const nghttp2_frame* frame, void* user_data) {
  if (frame->hd.type != NGHTTP2_HEADERS ||
      frame->headers.cat != NGHTTP2_HCAT_REQUEST) {
    return 0;
  }

  Session* sess = static_cast<Session*>(user_data);
  int32_t stream_id = frame->hd.stream_id;

  // Reject non-web-stream requests with 415 Unsupported Media Type.
  auto it = sess->stream_is_wish.find(stream_id);
  if (it == sess->stream_is_wish.end() || !it->second) {
    const nghttp2_nv hdrs[] = {H2S_MAKE_NV(":status", "415")};
    nghttp2_submit_response(session,
                            stream_id,
                            hdrs,
                            1,
                            nullptr);
    nghttp2_session_send(session);
    return 0;
  }

  // Create the web-stream stream object.
  NGHTTP2WebStream* web_stream = new NGHTTP2WebStream(session, stream_id, true);
  sess->streams[stream_id] = web_stream;

  // Set up the data provider so we can push web-stream DATA frames to the client.
  nghttp2_data_provider data_prd;
  data_prd.source.ptr = web_stream;
  data_prd.read_callback = DataSourceReadCallback;

  const nghttp2_nv hdrs[] = {
      H2S_MAKE_NV(":status", "200"),
      H2S_MAKE_NV("content-type", "application/web-stream")};
  nghttp2_submit_response(session,
                          stream_id,
                          hdrs,
                          2,
                          &data_prd);
  nghttp2_session_send(session);

  // Notify the application.  The callback should register its own on_message /
  // on_close handlers on the stream before returning.
  if (sess->server->on_stream_) {
    sess->server->on_stream_(web_stream);
  }

  web_stream->OnOpen();
  return 0;
}

int H2Server::OnDataChunkRecvCallback(nghttp2_session* session,
                                      uint8_t /*flags*/, int32_t stream_id,
                                      const uint8_t* data, size_t len,
                                      void* user_data) {
  Session* sess = static_cast<Session*>(user_data);
  auto it = sess->streams.find(stream_id);
  if (it != sess->streams.end()) {
    it->second->OnDataChunk(data, len);
    nghttp2_session_send(session);
  }
  return 0;
}

int H2Server::OnStreamCloseCallback(nghttp2_session* /*session*/,
                                    int32_t stream_id, uint32_t /*error_code*/,
                                    void* user_data) {
  Session* sess = static_cast<Session*>(user_data);
  auto it = sess->streams.find(stream_id);
  if (it != sess->streams.end()) {
    it->second->OnClose();
    delete it->second;
    sess->streams.erase(it);
  }
  sess->stream_is_wish.erase(stream_id);
  return 0;
}

ssize_t H2Server::DataSourceReadCallback(nghttp2_session* /*session*/,
                                         int32_t /*stream_id*/, uint8_t* buf,
                                         size_t length, uint32_t* data_flags,
                                         nghttp2_data_source* source,
                                         void* /*user_data*/) {
  NGHTTP2WebStream* web_stream = static_cast<NGHTTP2WebStream*>(source->ptr);
  return web_stream->ReadSendData(buf,
                                  length,
                                  data_flags);
}

// ---- Helper ----

nghttp2_session* H2Server::CreateH2Session(Session* sess) {
  nghttp2_session_callbacks* cbs;
  nghttp2_session_callbacks_new(&cbs);
  nghttp2_session_callbacks_set_send_callback(cbs,
                                              SendCallback);
  nghttp2_session_callbacks_set_on_header_callback(cbs,
                                                   OnHeaderCallback);
  nghttp2_session_callbacks_set_on_frame_recv_callback(cbs,
                                                       OnFrameRecvCallback);
  nghttp2_session_callbacks_set_on_data_chunk_recv_callback(cbs,
                                                            OnDataChunkRecvCallback);
  nghttp2_session_callbacks_set_on_stream_close_callback(cbs,
                                                         OnStreamCloseCallback);

  nghttp2_session* session;
  nghttp2_session_server_new(&session, cbs, sess);
  nghttp2_session_callbacks_del(cbs);
  return session;
}
