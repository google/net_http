#include "h2_tls_client.h"

#include <absl/log/log.h>
#include <absl/strings/numbers.h>
#include <netinet/tcp.h>

#include <algorithm>
#include <cstring>
#include <string>

#include <event2/bufferevent_ssl.h>
#include <openssl/ssl.h>

#define H2TC_MAKE_NV(name, value) \
  {                               \
      (uint8_t*)(name), (uint8_t*)(value), strlen(name), strlen(value), NGHTTP2_NV_FLAG_NONE}

H2TlsClient::H2TlsClient(const std::string& host,
                         int port,
                         const std::string& ca_file,
                         const std::string& cert_file,
                         const std::string& key_file)
    : host_(host),
      port_(port),
      ca_file_(ca_file),
      cert_file_(cert_file),
      key_file_(key_file),
      base_(nullptr),
      dns_base_(nullptr),
      session_(nullptr) {}

H2TlsClient::~H2TlsClient() {
  if (base_) {
    event_base_loopbreak(base_);
  }

  if (session_) {
    if (session_->web_stream) {
      delete session_->web_stream;
    }
    if (session_->h2session) {
      nghttp2_session_del(session_->h2session);
    }
    if (session_->bev) {
      bufferevent_free(session_->bev);
    }
    delete session_;
    session_ = nullptr;
  }

  if (dns_base_) {
    evdns_base_free(dns_base_, 0);
  }
  if (base_) {
    event_base_free(base_);
  }
}

bool H2TlsClient::Init() {
  SSL_library_init();
  SSL_load_error_strings();

  tls_ctx_.set_ca_file(ca_file_);
  tls_ctx_.set_certificate_file(cert_file_);
  tls_ctx_.set_private_key_file(key_file_);

  if (!tls_ctx_.Init(false)) {
    LOG(ERROR) << "H2TlsClient: failed to init TLS context";

    return false;
  }

  // Advertise "h2" via ALPN so the server can negotiate HTTP/2.
  static const unsigned char kAlpnH2[] = "\x02h2";
  SSL_CTX_set_alpn_protos(tls_ctx_.ssl_ctx(), kAlpnH2, sizeof(kAlpnH2) - 1);

  base_ = event_base_new();
  if (!base_) {
    LOG(ERROR) << "event_base_new() failed";

    return false;
  }

  dns_base_ = evdns_base_new(base_,
                             1);
  if (!dns_base_) {
    LOG(ERROR) << "evdns_base_new() failed";

    return false;
  }

  SSL* ssl = SSL_new(tls_ctx_.ssl_ctx());
  bufferevent* bev = bufferevent_openssl_socket_new(base_,
                                                    -1,
                                                    ssl,
                                                    BUFFEREVENT_SSL_CONNECTING,
                                                    BEV_OPT_CLOSE_ON_FREE);
  if (!bev) {
    LOG(ERROR) << "bufferevent_openssl_socket_new() failed";

    return false;
  }

  session_ = new Session;
  session_->client = this;
  session_->bev = bev;
  session_->h2session = nullptr;
  session_->web_stream = nullptr;
  session_->h2_stream_id = -1;
  session_->response_status = 0;

  bufferevent_setcb(bev,
                    ReadCallback,
                    nullptr,
                    EventCallback,
                    session_);

  int enable_rv = bufferevent_enable(bev,
                                     EV_READ | EV_WRITE);
  if (enable_rv != 0) {
    LOG(ERROR) << "bufferevent_enable() failed";

    return false;
  }

  if (bufferevent_socket_connect_hostname(bev,
                                          dns_base_,
                                          AF_INET,
                                          host_.c_str(),
                                          port_) < 0) {
    LOG(ERROR) << "bufferevent_socket_connect_hostname() failed";

    return false;
  }

  return true;
}

void H2TlsClient::SetOnOpen(OpenCallback cb) { on_open_ = cb; }

void H2TlsClient::Run() {
  LOG(INFO) << "Running...";

  event_base_dispatch(base_);
}

void H2TlsClient::Stop() {
  if (base_) {
    event_base_loopexit(base_, nullptr);
  }
}

// ---- libevent bufferevent callbacks ----

void H2TlsClient::ReadCallback(bufferevent* bev,
                               void* ctx) {
  Session* sess = static_cast<Session*>(ctx);

  if (!sess->h2session) {
    return;
  }

  evbuffer* input = bufferevent_get_input(bev);

  size_t len = evbuffer_get_length(input);
  if (len == 0) {
    return;
  }

  unsigned char* data = evbuffer_pullup(input,
                                        -1);
  ssize_t recv_len = nghttp2_session_mem_recv(sess->h2session,
                                              data,
                                              len);
  if (recv_len < 0) {
    LOG(ERROR) << "nghttp2_session_mem_recv() failed: "
               << nghttp2_strerror(static_cast<int>(recv_len));

    sess->client->HandleSessionError(sess);

    return;
  }

  int drain_rv = evbuffer_drain(input, static_cast<size_t>(recv_len));
  if (drain_rv != 0) {
    LOG(ERROR) << "evbuffer_drain() failed";

    sess->client->HandleSessionError(sess);

    return;
  }

  // nghttp2_session_mem_recv() only processes incoming frames; it does not
  // transmit anything. Processing received frames may cause nghttp2 to
  // internally queue outgoing frames (e.g. SETTINGS_ACK, WINDOW_UPDATE).
  // Call nghttp2_session_send() here to flush those queued frames via
  // SendCallback.
  int send_rv = nghttp2_session_send(sess->h2session);
  if (send_rv < 0) {
    LOG(ERROR) << "nghttp2_session_send() failed: "
               << nghttp2_strerror(send_rv);

    sess->client->HandleSessionError(sess);

    return;
  }
}

void H2TlsClient::EventCallback(bufferevent* bev,
                                short what,  // NOLINT(runtime/int)
                                void* arg) {
  Session* sess = static_cast<Session*>(arg);

  if (what & BEV_EVENT_CONNECTED) {
    int fd = bufferevent_getfd(bev);
    if (fd >= 0) {
      int one = 1;
      int rv = setsockopt(fd,
                          IPPROTO_TCP,
                          TCP_NODELAY,
                          &one,
                          sizeof(one));
      if (rv != 0) {
        LOG(ERROR) << "H2TlsClient: setsockopt(TCP_NODELAY) failed";
      }
    }

    sess->client->InitH2Session(sess);

    return;
  }

  if (what & BEV_EVENT_ERROR) {
    LOG(ERROR) << "BEV_EVENT_ERROR event";
  }

  if (what & (BEV_EVENT_EOF | BEV_EVENT_ERROR)) {
    if (sess->web_stream) {
      if (what & BEV_EVENT_ERROR) {
        sess->web_stream->OnError();
      } else {
        sess->web_stream->OnClose();
      }

      delete sess->web_stream;
      sess->web_stream = nullptr;
    }

    if (sess->h2session) {
      nghttp2_session_del(sess->h2session);
      sess->h2session = nullptr;
    }

    sess->client->Stop();

    bufferevent_free(bev);

    if (sess->client->session_ == sess) {
      sess->client->session_ = nullptr;
    }
    delete sess;
  }
}

void H2TlsClient::HandleSessionError(Session* sess) {
  if (sess->web_stream) {
    sess->web_stream->OnError();
    delete sess->web_stream;
    sess->web_stream = nullptr;
  }

  if (sess->h2session) {
    nghttp2_session_del(sess->h2session);
    sess->h2session = nullptr;
  }

  if (sess->bev) {
    bufferevent_free(sess->bev);
    sess->bev = nullptr;
  }

  Stop();

  if (session_ == sess) {
    session_ = nullptr;
  }
  delete sess;
}

// ---- nghttp2 session callbacks ----

nghttp2_ssize H2TlsClient::SendCallback(nghttp2_session* /*session*/,
                                        const uint8_t* data,
                                        size_t length,
                                        int /*flags*/,
                                        void* user_data) {
  Session* sess = static_cast<Session*>(user_data);

  int rv = bufferevent_write(sess->bev,
                             data,
                             length);
  if (rv != 0) {
    LOG(ERROR) << "bufferevent_write() failed";

    return NGHTTP2_ERR_CALLBACK_FAILURE;
  }

  return static_cast<nghttp2_ssize>(length);
}

int H2TlsClient::OnHeaderCallback(nghttp2_session* /*session*/,
                                  const nghttp2_frame* frame,
                                  const uint8_t* name,
                                  size_t namelen,
                                  const uint8_t* value,
                                  size_t valuelen,
                                  uint8_t /*flags*/,
                                  void* user_data) {
  Session* sess = static_cast<Session*>(user_data);

  // Capture the :status value for our web-stream stream so that
  // OnFrameRecvCallback can verify the server accepted the request.
  if (frame->hd.stream_id == sess->h2_stream_id &&
      absl::string_view(reinterpret_cast<const char*>(name), namelen) == ":status") {
    int parsed = 0;
    // Store -1 for malformed values so the == 200 check in
    // OnFrameRecvCallback never accidentally matches.
    bool valid = absl::SimpleAtoi(
        absl::string_view(reinterpret_cast<const char*>(value), valuelen),
        &parsed);
    sess->response_status = valid ? parsed : -1;
  }

  return 0;
}

int H2TlsClient::OnFrameRecvCallback(nghttp2_session* /*session*/,
                                     const nghttp2_frame* frame,
                                     void* user_data) {
  Session* sess = static_cast<Session*>(user_data);

  if (frame->hd.stream_id != sess->h2_stream_id) {
    return 0;
  }

  // Trigger OnOpen only when the server responds with 200 for our web-stream
  // stream, indicating it accepted the request.  Any other status (e.g. 400,
  // 404, 500) is treated as a rejection and the stream is left unopened.
  if (frame->hd.type == NGHTTP2_HEADERS &&
      frame->headers.cat == NGHTTP2_HCAT_RESPONSE) {
    if (sess->response_status == 200) {
      if (sess->web_stream) {
        if (sess->client->on_open_) {
          sess->client->on_open_(sess->web_stream);
        }
      }
    } else {
      LOG(ERROR) << "H2TlsClient: Server rejected stream with status: "
                 << sess->response_status;

      // nghttp2_on_frame_recv_callback spec: any nonzero value signals a fatal error.
      return -1;
    }
  }

  // Trigger OnClose if we receive END_STREAM (body EOF) from the peer.
  if ((frame->hd.type == NGHTTP2_DATA || frame->hd.type == NGHTTP2_HEADERS) &&
      (frame->hd.flags & NGHTTP2_FLAG_END_STREAM)) {
    if (sess->web_stream) {
      sess->web_stream->OnClose();
    }
  }

  return 0;
}

int H2TlsClient::OnDataChunkRecvCallback(nghttp2_session* session,
                                         uint8_t /*flags*/,
                                         int32_t stream_id,
                                         const uint8_t* data,
                                         size_t len,
                                         void* user_data) {
  Session* sess = static_cast<Session*>(user_data);

  if (sess->web_stream && stream_id == sess->h2_stream_id) {
    sess->web_stream->OnDataChunk(data,
                                  len);

    int send_rv = nghttp2_session_send(session);
    if (send_rv < 0) {
      LOG(ERROR) << "nghttp2_session_send() failed: "
                 << nghttp2_strerror(send_rv);
      return NGHTTP2_ERR_CALLBACK_FAILURE;
    }
  }

  return 0;
}

int H2TlsClient::OnStreamCloseCallback(nghttp2_session* /*session*/,
                                       int32_t stream_id,
                                       uint32_t error_code,
                                       void* user_data) {
  Session* sess = static_cast<Session*>(user_data);

  if (sess->web_stream && stream_id == sess->h2_stream_id) {
    if (error_code != NGHTTP2_NO_ERROR) {
      LOG(ERROR) << "H2TlsClient: Stream closed with error code: " << error_code;
      sess->web_stream->OnError();
    } else {
      sess->web_stream->OnClose();
    }

    delete sess->web_stream;
    sess->web_stream = nullptr;
  }

  return 0;
}

nghttp2_ssize H2TlsClient::DataSourceReadCallback(nghttp2_session* session,
                                                  int32_t stream_id, uint8_t* buf,
                                                  size_t length,
                                                  uint32_t* data_flags,
                                                  nghttp2_data_source* /*source*/,
                                                  void* /*user_data*/) {
  NGHTTP2WebStream* web_stream = static_cast<NGHTTP2WebStream*>(
      nghttp2_session_get_stream_user_data(session, stream_id));
  if (!web_stream) {
    return NGHTTP2_ERR_DEFERRED;
  }

  return web_stream->ReadSendData(buf,
                                  length,
                                  data_flags);
}

// ---- Helper ----

void H2TlsClient::InitH2Session(Session* sess) {
  nghttp2_session_callbacks* cbs;
  nghttp2_session_callbacks_new(&cbs);
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

  nghttp2_session_client_new(&sess->h2session,
                             cbs,
                             sess);
  nghttp2_session_callbacks_del(cbs);

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

  std::string authority = host_ + ":" + std::to_string(port_);
  nghttp2_nv authority_nv = {
      (uint8_t*)":authority",
      reinterpret_cast<uint8_t*>(const_cast<char*>(authority.data())),
      sizeof(":authority") - 1,
      authority.size(),
      NGHTTP2_NV_FLAG_NONE};

  nghttp2_nv hdrs[] = {
      H2TC_MAKE_NV(":method", "POST"),
      H2TC_MAKE_NV(":path", "/"),
      H2TC_MAKE_NV(":scheme", "https"),
      authority_nv,
      H2TC_MAKE_NV("content-type", "application/web-stream"),
  };

  nghttp2_data_provider2 data_prd;
  data_prd.source.ptr = nullptr;
  data_prd.read_callback = DataSourceReadCallback;

  int32_t stream_id = nghttp2_submit_request2(sess->h2session,
                                              nullptr,
                                              hdrs,
                                              5,
                                              &data_prd,
                                              nullptr);
  if (stream_id < 0) {
    LOG(ERROR) << "H2TlsClient: nghttp2_submit_request2() failed: "
               << nghttp2_strerror(stream_id);
    HandleSessionError(sess);
    return;
  }
  sess->h2_stream_id = stream_id;

  sess->web_stream = new NGHTTP2WebStream(sess->h2session,
                                          stream_id,
                                          false);

  // Register the stream object as stream user-data so DataSourceReadCallback
  // can find it.  This must happen before nghttp2_session_send().
  nghttp2_session_set_stream_user_data(sess->h2session,
                                       stream_id,
                                       sess->web_stream);

  int send_rv = nghttp2_session_send(sess->h2session);
  if (send_rv < 0) {
    LOG(ERROR) << "H2TlsClient: nghttp2_session_send() failed: "
               << nghttp2_strerror(send_rv);
    HandleSessionError(sess);
  }
}
