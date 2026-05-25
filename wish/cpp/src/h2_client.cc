#include "h2_client.h"

#include <netinet/tcp.h>

#include <algorithm>
#include <cstring>
#include <iostream>
#include <string>

#define H2C_MAKE_NV(name, value) \
  {                              \
      (uint8_t*)(name), (uint8_t*)(value), strlen(name), strlen(value), NGHTTP2_NV_FLAG_NONE}

H2Client::H2Client(const std::string& host, int port)
    : host_(host),
      port_(port),
      base_(nullptr),
      dns_base_(nullptr),
      session_(nullptr) {}

H2Client::~H2Client() {
  if (base_) {
    event_base_loopbreak(base_);
  }
  if (dns_base_) {
    evdns_base_free(dns_base_, 0);
  }
  if (base_) {
    event_base_free(base_);
  }
}

bool H2Client::Init() {
  base_ = event_base_new();
  if (!base_) {
    std::cerr << "event_base_new() failed" << std::endl;
    return false;
  }

  dns_base_ = evdns_base_new(base_,
                             1);
  if (!dns_base_) {
    std::cerr << "evdns_base_new() failed" << std::endl;
    return false;
  }

  struct bufferevent* bev =
      bufferevent_socket_new(base_,
                             -1,
                             BEV_OPT_CLOSE_ON_FREE);
  if (!bev) {
    std::cerr << "bufferevent_socket_new() failed" << std::endl;
    return false;
  }

  session_ = new Session;
  session_->client = this;
  session_->bev = bev;
  session_->h2session = nullptr;
  session_->wish_stream = nullptr;
  session_->wish_stream_id = -1;

  bufferevent_setcb(bev,
                    ReadCallback,
                    nullptr,
                    EventCallback,
                    session_);
  bufferevent_enable(bev,
                     EV_READ | EV_WRITE);

  if (bufferevent_socket_connect_hostname(bev,
                                          dns_base_,
                                          AF_INET,
                                          host_.c_str(),
                                          port_) < 0) {
    std::cerr << "bufferevent_socket_connect_hostname() failed" << std::endl;
    return false;
  }

  return true;
}

void H2Client::SetOnOpen(OpenCallback cb) { on_open_ = cb; }

void H2Client::SetOnClose(CloseCallback cb) { on_close_ = cb; }

void H2Client::Run() {
  std::cout << "Running..." << std::endl;

  event_base_dispatch(base_);
}

void H2Client::Stop() {
  if (base_) {
    event_base_loopexit(base_, nullptr);
  }
}

// ---- libevent bufferevent callbacks ----

void H2Client::ReadCallback(struct bufferevent* bev, void* arg) {
  Session* sess = static_cast<Session*>(arg);
  if (!sess->h2session) {
    return;
  }

  struct evbuffer* input = bufferevent_get_input(bev);
  size_t len = evbuffer_get_length(input);
  if (len == 0) {
    return;
  }

  unsigned char* data = evbuffer_pullup(input, -1);
  ssize_t recv_len = nghttp2_session_mem_recv(sess->h2session,
                                              data,
                                              len);
  if (recv_len < 0) {
    std::cerr << "nghttp2_session_mem_recv() failed: "
              << nghttp2_strerror(static_cast<int>(recv_len)) << std::endl;
    return;
  }
  evbuffer_drain(input, static_cast<size_t>(recv_len));

  int rv = nghttp2_session_send(sess->h2session);
  if (rv < 0) {
    std::cerr << "nghttp2_session_send() failed: "
              << nghttp2_strerror(rv) << std::endl;
  }
}

void H2Client::EventCallback(struct bufferevent* bev,
                             short events,  // NOLINT(runtime/int)
                             void* arg) {
  Session* sess = static_cast<Session*>(arg);

  if (events & BEV_EVENT_CONNECTED) {
    // Set TCP_NODELAY now that we have the real fd.
    int fd = bufferevent_getfd(bev);
    if (fd >= 0) {
      int one = 1;
      setsockopt(fd, IPPROTO_TCP, TCP_NODELAY, &one, sizeof(one));
    }

    sess->client->InitH2Session(sess);

    return;
  }

  if (events & BEV_EVENT_ERROR) {
    std::cerr << "BEV_EVENT_ERROR event" << std::endl;
  }

  if (events & (BEV_EVENT_EOF | BEV_EVENT_ERROR)) {
    if (sess->wish_stream) {
      sess->wish_stream->OnClose();
      if (sess->client->on_close_) {
        sess->client->on_close_();
      }
      delete sess->wish_stream;
      sess->wish_stream = nullptr;
    }

    if (sess->h2session) {
      nghttp2_session_del(sess->h2session);
      sess->h2session = nullptr;
    }

    bufferevent_free(bev);

    delete sess;
  }
}

// ---- nghttp2 session callbacks ----

ssize_t H2Client::SendCallback(nghttp2_session* /*session*/,
                               const uint8_t* data, size_t length,
                               int /*flags*/, void* user_data) {
  Session* sess = static_cast<Session*>(user_data);
  bufferevent_write(sess->bev,
                    data,
                    length);
  return static_cast<ssize_t>(length);
}

int H2Client::OnHeaderCallback(nghttp2_session* /*session*/,
                               const nghttp2_frame* frame,
                               const uint8_t* name, size_t namelen,
                               const uint8_t* value, size_t valuelen,
                               uint8_t /*flags*/, void* /*user_data*/) {
  // We only care about detecting the :status 200 for our web-stream stream.
  // That check is done in OnFrameRecvCallback once all headers are received.
  (void)frame;
  (void)name;
  (void)namelen;
  (void)value;
  (void)valuelen;
  return 0;
}

int H2Client::OnFrameRecvCallback(nghttp2_session* /*session*/,
                                  const nghttp2_frame* frame,
                                  void* user_data) {
  Session* sess = static_cast<Session*>(user_data);

  // Detect the 200 response for our web-stream stream.
  if (frame->hd.type == NGHTTP2_HEADERS &&
      frame->headers.cat == NGHTTP2_HCAT_RESPONSE &&
      frame->hd.stream_id == sess->wish_stream_id) {
    if (sess->wish_stream) {
      sess->wish_stream->OnOpen();
      if (sess->client->on_open_) {
        sess->client->on_open_(sess->wish_stream);
      }
    }
  }
  return 0;
}

int H2Client::OnDataChunkRecvCallback(nghttp2_session* session,
                                      uint8_t /*flags*/, int32_t stream_id,
                                      const uint8_t* data, size_t len,
                                      void* user_data) {
  Session* sess = static_cast<Session*>(user_data);
  if (sess->wish_stream && stream_id == sess->wish_stream_id) {
    sess->wish_stream->OnDataChunk(data,
                                   len);
    nghttp2_session_send(session);
  }
  return 0;
}

int H2Client::OnStreamCloseCallback(nghttp2_session* /*session*/,
                                    int32_t stream_id,
                                    uint32_t /*error_code*/, void* user_data) {
  Session* sess = static_cast<Session*>(user_data);
  if (sess->wish_stream && stream_id == sess->wish_stream_id) {
    sess->wish_stream->OnClose();
    if (sess->client->on_close_) {
      sess->client->on_close_();
    }
    delete sess->wish_stream;
    sess->wish_stream = nullptr;
  }
  return 0;
}

// DataSourceReadCallback looks up the H2WishStream via stream user-data so
// that the stream object can be created after nghttp2_submit_request returns
// the real stream_id (the id is not known before that call).
ssize_t H2Client::DataSourceReadCallback(nghttp2_session* session,
                                         int32_t stream_id, uint8_t* buf,
                                         size_t length, uint32_t* data_flags,
                                         nghttp2_data_source* /*source*/,
                                         void* /*user_data*/) {
  H2WishStream* stream = static_cast<H2WishStream*>(
      nghttp2_session_get_stream_user_data(session, stream_id));
  if (!stream) {
    return NGHTTP2_ERR_DEFERRED;
  }
  return stream->ReadSendData(buf, length, data_flags);
}

// ---- Helper: initialise nghttp2 after TCP connection ----

void H2Client::InitH2Session(Session* sess) {
  nghttp2_session_callbacks* cbs;
  nghttp2_session_callbacks_new(&cbs);
  nghttp2_session_callbacks_set_send_callback(cbs, SendCallback);
  nghttp2_session_callbacks_set_on_header_callback(cbs, OnHeaderCallback);
  nghttp2_session_callbacks_set_on_frame_recv_callback(cbs,
                                                       OnFrameRecvCallback);
  nghttp2_session_callbacks_set_on_data_chunk_recv_callback(
      cbs, OnDataChunkRecvCallback);
  nghttp2_session_callbacks_set_on_stream_close_callback(cbs,
                                                         OnStreamCloseCallback);

  nghttp2_session_client_new(&sess->h2session, cbs, sess);
  nghttp2_session_callbacks_del(cbs);

  // Send client connection preface (SETTINGS).
  nghttp2_settings_entry iv[] = {
      {NGHTTP2_SETTINGS_INITIAL_WINDOW_SIZE, 1 << 20}};
  nghttp2_submit_settings(sess->h2session,
                          NGHTTP2_FLAG_NONE,
                          iv,
                          1);
  nghttp2_session_set_local_window_size(sess->h2session,
                                        NGHTTP2_FLAG_NONE,
                                        0,
                                        1 << 20);

  // Construct the :authority pseudo-header value (variable-length host:port).
  std::string authority = host_ + ":" + std::to_string(port_);
  nghttp2_nv authority_nv = {
      (uint8_t*)":authority",
      reinterpret_cast<uint8_t*>(const_cast<char*>(authority.data())),
      sizeof(":authority") - 1,
      authority.size(),
      NGHTTP2_NV_FLAG_NONE};

  // Submit the web-stream request.
  // The data provider uses stream user-data (set below) so source.ptr can remain null here.
  nghttp2_nv hdrs[] = {
      H2C_MAKE_NV(":method", "POST"),
      H2C_MAKE_NV(":path", "/"),
      H2C_MAKE_NV(":scheme", "http"),
      authority_nv,
      H2C_MAKE_NV("content-type", "application/web-stream"),
  };

  nghttp2_data_provider data_prd;
  data_prd.source.ptr = nullptr;  // resolved via stream user-data below
  data_prd.read_callback = DataSourceReadCallback;

  int32_t stream_id = nghttp2_submit_request(sess->h2session,
                                             nullptr,
                                             hdrs,
                                             5,
                                             &data_prd,
                                             nullptr);
  if (stream_id < 0) {
    std::cerr << "H2Client: nghttp2_submit_request failed: "
              << nghttp2_strerror(stream_id) << std::endl;
    return;
  }
  sess->wish_stream_id = stream_id;

  // Create the H2WishStream now that the real stream_id is known.
  sess->wish_stream = new H2WishStream(sess->h2session,
                                       stream_id,
                                       false);

  // Register the stream object as stream user-data so DataSourceReadCallback
  // can find it.  This must happen before nghttp2_session_send().
  nghttp2_session_set_stream_user_data(sess->h2session,
                                       stream_id,
                                       sess->wish_stream);

  nghttp2_session_send(sess->h2session);
}
