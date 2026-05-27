#include "h2_tls_server.h"

#include <arpa/inet.h>
#include <netinet/tcp.h>

#include <algorithm>
#include <cstring>
#include <iostream>

// BoringSSL headers
#define EVENT__HAVE_OPENSSL 1
#include <event2/bufferevent_ssl.h>
#include <openssl/ssl.h>

#define H2TS_MAKE_NV(name, value) \
  {                               \
      (uint8_t*)(name), (uint8_t*)(value), strlen(name), strlen(value), NGHTTP2_NV_FLAG_NONE}

// ALPN selection callback: prefers "h2".
static int AlpnSelectCb(SSL* /*ssl*/,
                        const unsigned char** out,
                        unsigned char* outlen,
                        const unsigned char* in,
                        unsigned int inlen,
                        void* /*arg*/) {
  // nghttp2_select_next_protocol returns 1 if "h2" is found, <=0 otherwise.
  if (nghttp2_select_next_protocol(const_cast<unsigned char**>(out), outlen, in, inlen) <= 0) {
    return SSL_TLSEXT_ERR_NOACK;
  }
  return SSL_TLSEXT_ERR_OK;
}

H2TlsServer::H2TlsServer(const std::string& ca_file,
                         const std::string& cert_file,
                         const std::string& key_file, int port)
    : ca_file_(ca_file),
      cert_file_(cert_file),
      key_file_(key_file),
      port_(port),
      base_(nullptr),
      listener_(nullptr) {}

H2TlsServer::~H2TlsServer() {
  if (listener_) {
    evconnlistener_free(listener_);
  }
  if (base_) {
    event_base_free(base_);
  }
}

bool H2TlsServer::Init() {
  SSL_library_init();
  SSL_load_error_strings();

  tls_ctx_.set_ca_file(ca_file_);
  tls_ctx_.set_certificate_file(cert_file_);
  tls_ctx_.set_private_key_file(key_file_);

  if (!tls_ctx_.Init(true)) {
    std::cerr << "H2TlsServer: failed to init TLS context" << std::endl;
    return false;
  }

  // Advertise "h2" via ALPN.
  SSL_CTX_set_alpn_select_cb(tls_ctx_.ssl_ctx(), AlpnSelectCb, nullptr);

  base_ = event_base_new();
  if (!base_) {
    std::cerr << "H2TlsServer: event_base_new() failed" << std::endl;
    return false;
  }

  sockaddr_in sin;
  memset(&sin, 0, sizeof(sin));
  sin.sin_family = AF_INET;
  sin.sin_addr.s_addr = htonl(INADDR_ANY);
  sin.sin_port = htons(port_);

  listener_ = evconnlistener_new_bind(
      base_, AcceptConnCb, this, LEV_OPT_CLOSE_ON_FREE | LEV_OPT_REUSEABLE, -1, reinterpret_cast<sockaddr*>(&sin), sizeof(sin));
  if (!listener_) {
    std::cerr << "H2TlsServer: evconnlistener_new_bind() failed" << std::endl;
    return false;
  }

  evconnlistener_set_error_cb(listener_, AcceptErrorCb);
  return true;
}

void H2TlsServer::SetOnStream(StreamCallback cb) { on_stream_ = cb; }

void H2TlsServer::Run() {
  std::cout << "H2TlsServer listening on port " << port_ << "..." << std::endl;

  event_base_dispatch(base_);
}

// ---- libevent listener callbacks ----

void H2TlsServer::AcceptConnCb(evconnlistener* listener,
                               evutil_socket_t fd,
                               sockaddr* /*address*/,
                               int /*socklen*/,
                               void* ctx) {
  H2TlsServer* server = static_cast<H2TlsServer*>(ctx);

  event_base* base = evconnlistener_get_base(listener);

  int one = 1;
  int set_rv = setsockopt(fd,
                          IPPROTO_TCP,
                          TCP_NODELAY,
                          &one,
                          sizeof(one));
  if (set_rv != 0) {
    std::cerr << "H2TlsServer: setsockopt(TCP_NODELAY) failed" << std::endl;
    evutil_closesocket(fd);
    return;
  }

  SSL* ssl = SSL_new(server->tls_ctx_.ssl_ctx());
  bufferevent* bev = bufferevent_openssl_socket_new(
      base, fd, ssl, BUFFEREVENT_SSL_ACCEPTING, BEV_OPT_CLOSE_ON_FREE);
  if (!bev) {
    std::cerr << "H2TlsServer: bufferevent_openssl_socket_new() failed"
              << std::endl;
    evutil_closesocket(fd);
    return;
  }

  Session* sess = new Session;
  sess->server = server;
  sess->bev = bev;
  sess->h2session = CreateH2Session(sess);

  nghttp2_settings_entry iv[] = {
      {NGHTTP2_SETTINGS_MAX_CONCURRENT_STREAMS, 100},
      {NGHTTP2_SETTINGS_INITIAL_WINDOW_SIZE, 1 << 20}};
  int submit_settings_rv = nghttp2_submit_settings(sess->h2session,
                                                   NGHTTP2_FLAG_NONE,
                                                   iv,
                                                   2);
  if (submit_settings_rv != 0) {
    std::cerr << "H2TlsServer: nghttp2_submit_settings() failed: "
              << nghttp2_strerror(submit_settings_rv) << std::endl;

    nghttp2_session_del(sess->h2session);
    bufferevent_free(bev);
    delete sess;

    return;
  }
  int set_local_window_size_rv = nghttp2_session_set_local_window_size(sess->h2session,
                                                                       NGHTTP2_FLAG_NONE,
                                                                       0,
                                                                       1 << 20);
  if (set_local_window_size_rv != 0) {
    std::cerr << "H2TlsServer: nghttp2_session_set_local_window_size() failed: "
              << nghttp2_strerror(set_local_window_size_rv) << std::endl;

    nghttp2_session_del(sess->h2session);
    bufferevent_free(bev);
    delete sess;

    return;
  }
  int send_rv = nghttp2_session_send(sess->h2session);
  if (send_rv != 0) {
    std::cerr << "H2TlsServer: nghttp2_session_send() failed: "
              << nghttp2_strerror(send_rv) << std::endl;

    nghttp2_session_del(sess->h2session);
    bufferevent_free(bev);
    delete sess;

    return;
  }

  bufferevent_setcb(bev,
                    ReadCallback,
                    nullptr,
                    EventCallback,
                    sess);

  int enable_rv = bufferevent_enable(bev,
                                     EV_READ | EV_WRITE);
  if (enable_rv != 0) {
    std::cerr << "H2TlsServer: bufferevent_enable() failed" << std::endl;

    nghttp2_session_del(sess->h2session);
    bufferevent_free(bev);
    delete sess;

    return;
  }
}

void H2TlsServer::AcceptErrorCb(evconnlistener* listener,
                                void* /*ctx*/) {
  event_base* base = evconnlistener_get_base(listener);
  int err = EVUTIL_SOCKET_ERROR();
  std::cerr << "H2TlsServer: listener error " << err << " ("
            << evutil_socket_error_to_string(err) << ")" << std::endl;
  event_base_loopexit(base, nullptr);
}

// ---- libevent bufferevent callbacks ----

void H2TlsServer::ReadCallback(bufferevent* bev, void* ctx) {
  Session* sess = static_cast<Session*>(ctx);

  evbuffer* input = bufferevent_get_input(bev);

  size_t len = evbuffer_get_length(input);
  if (len == 0) {
    return;
  }

  unsigned char* data = evbuffer_pullup(input, -1);
  ssize_t recv_len = nghttp2_session_mem_recv(sess->h2session,
                                              data,
                                              len);
  if (recv_len < 0) {
    std::cerr << "H2TlsServer: nghttp2_session_mem_recv failed: "
              << nghttp2_strerror(static_cast<int>(recv_len)) << std::endl;
    bufferevent_free(bev);
    return;
  }
  evbuffer_drain(input, static_cast<size_t>(recv_len));

  int rv = nghttp2_session_send(sess->h2session);
  if (rv < 0) {
    std::cerr << "H2TlsServer: nghttp2_session_send failed: "
              << nghttp2_strerror(rv) << std::endl;
  }
}

void H2TlsServer::EventCallback(bufferevent* bev,
                                short what,  // NOLINT(runtime/int)
                                void* ctx) {
  Session* sess = static_cast<Session*>(ctx);

  if (what & BEV_EVENT_ERROR) {
    std::cerr << "H2TlsServer: connection error" << std::endl;
  }

  if (what & (BEV_EVENT_EOF | BEV_EVENT_ERROR)) {
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

nghttp2_ssize H2TlsServer::SendCallback(nghttp2_session* /*session*/,
                                        const uint8_t* data,
                                        size_t length,
                                        int /*flags*/,
                                        void* user_data) {
  Session* sess = static_cast<Session*>(user_data);

  int rv = bufferevent_write(sess->bev,
                             data,
                             length);
  if (rv != 0) {
    return NGHTTP2_ERR_CALLBACK_FAILURE;
  }

  return static_cast<nghttp2_ssize>(length);
}

int H2TlsServer::OnHeaderCallback(nghttp2_session* /*session*/,
                                  const nghttp2_frame* frame,
                                  const uint8_t* name,
                                  size_t namelen,
                                  const uint8_t* value,
                                  size_t valuelen,
                                  uint8_t /*flags*/,
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

int H2TlsServer::OnFrameRecvCallback(nghttp2_session* session,
                                     const nghttp2_frame* frame,
                                     void* user_data) {
  if (frame->hd.type != NGHTTP2_HEADERS ||
      frame->headers.cat != NGHTTP2_HCAT_REQUEST) {
    return 0;
  }

  Session* sess = static_cast<Session*>(user_data);

  int32_t stream_id = frame->hd.stream_id;

  auto it = sess->stream_is_wish.find(stream_id);
  if (it == sess->stream_is_wish.end() || !it->second) {
    const nghttp2_nv hdrs[] = {H2TS_MAKE_NV(":status", "415")};
    int submit_response_rv = nghttp2_submit_response2(session,
                                                      stream_id,
                                                      hdrs,
                                                      1,
                                                      nullptr);
    if (submit_response_rv != 0) {
      std::cerr << "H2TlsServer: nghttp2_submit_response2() failed: "
                << nghttp2_strerror(submit_response_rv) << std::endl;

      // nghttp2_on_frame_recv_callback spec: any nonzero value signals a fatal error.
      return -1;
    }

    int send_rv = nghttp2_session_send(session);
    if (send_rv != 0) {
      std::cerr << "H2TlsServer: nghttp2_session_send() failed: "
                << nghttp2_strerror(send_rv) << std::endl;

      // nghttp2_on_frame_recv_callback spec: any nonzero value signals a fatal error.
      return -1;
    }
    return 0;
  }

  NGHTTP2WebStream* web_stream = new NGHTTP2WebStream(session, stream_id, true);
  sess->streams[stream_id] = web_stream;

  nghttp2_data_provider2 data_prd;
  data_prd.source.ptr = web_stream;
  data_prd.read_callback = DataSourceReadCallback;

  const nghttp2_nv hdrs[] = {
      H2TS_MAKE_NV(":status", "200"),
      H2TS_MAKE_NV("content-type", "application/web-stream")};
  int submit_response_rv = nghttp2_submit_response2(session,
                                                    stream_id,
                                                    hdrs,
                                                    2,
                                                    &data_prd);
  if (submit_response_rv != 0) {
    std::cerr << "H2TlsServer: nghttp2_submit_response2() failed: "
              << nghttp2_strerror(submit_response_rv) << std::endl;

    delete web_stream;
    sess->streams.erase(stream_id);

    // nghttp2_on_frame_recv_callback spec: any nonzero value signals a fatal error.
    return -1;
  }

  int send_rv = nghttp2_session_send(session);
  if (send_rv != 0) {
    std::cerr << "H2TlsServer: nghttp2_session_send() failed: "
              << nghttp2_strerror(send_rv) << std::endl;

    delete web_stream;
    sess->streams.erase(stream_id);

    // nghttp2_on_frame_recv_callback spec: any nonzero value signals a fatal error.
    return -1;
  }

  if (sess->server->on_stream_) {
    sess->server->on_stream_(web_stream);
  }

  web_stream->OnOpen();

  return 0;
}

int H2TlsServer::OnDataChunkRecvCallback(nghttp2_session* session,
                                         uint8_t /*flags*/,
                                         int32_t stream_id,
                                         const uint8_t* data,
                                         size_t len,
                                         void* user_data) {
  Session* sess = static_cast<Session*>(user_data);

  auto it = sess->streams.find(stream_id);
  if (it != sess->streams.end()) {
    it->second->OnDataChunk(data, len);

    int rv = nghttp2_session_send(session);
    if (rv != 0) {
      std::cerr << "H2TlsServer: nghttp2_session_send() failed: "
                << nghttp2_strerror(rv) << std::endl;
    }
  }

  return 0;
}

int H2TlsServer::OnStreamCloseCallback(nghttp2_session* /*session*/,
                                       int32_t stream_id,
                                       uint32_t /*error_code*/,
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

nghttp2_ssize H2TlsServer::DataSourceReadCallback(nghttp2_session* /*session*/,
                                                  int32_t /*stream_id*/,
                                                  uint8_t* buf,
                                                  size_t length,
                                                  uint32_t* data_flags,
                                                  nghttp2_data_source* source,
                                                  void* /*user_data*/) {
  NGHTTP2WebStream* web_stream = static_cast<NGHTTP2WebStream*>(source->ptr);
  return web_stream->ReadSendData(buf,
                                  length,
                                  data_flags);
}

// ---- Helper ----

nghttp2_session* H2TlsServer::CreateH2Session(Session* sess) {
  nghttp2_session_callbacks* cbs;
  int callbacks_new_rv = nghttp2_session_callbacks_new(&cbs);
  if (callbacks_new_rv != 0) {
    std::cerr << "H2TlsServer: nghttp2_session_callbacks_new() failed" << std::endl;
    return nullptr;
  }
  nghttp2_session_callbacks_set_send_callback2(cbs,
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
  int server_new_rv = nghttp2_session_server_new(&session,
                                                 cbs,
                                                 sess);
  nghttp2_session_callbacks_del(cbs);
  if (server_new_rv != 0) {
    std::cerr << "H2TlsServer: nghttp2_session_server_new() failed" << std::endl;
    return nullptr;
  }
  return session;
}
