// Copyright 2026 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#include "h2_server.h"

#include <absl/log/log.h>
#include <arpa/inet.h>
#include <netinet/tcp.h>

#include <algorithm>
#include <cstring>

#define H2S_MAKE_NV(name, value) \
  {                              \
      (uint8_t*)(name), (uint8_t*)(value), strlen(name), strlen(value), NGHTTP2_NV_FLAG_NONE}

H2Server::H2Server(event_base* base,
                   int port)
    : base_(base),
      port_(port),
      listener_(nullptr) {}

H2Server::~H2Server() {
  if (listener_) {
    evconnlistener_free(listener_);
  }
}

bool H2Server::Init() {
  if (!base_) {
    VLOG(1) << "H2Server: event_base is null";

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
    VLOG(1) << "H2Server: evconnlistener_new_bind() failed";

    return false;
  }

  evconnlistener_set_error_cb(listener_,
                              AcceptErrorCb);
  return true;
}

void H2Server::SetOnStream(StreamCallback cb) { on_stream_ = cb; }

int H2Server::Run() {
  return event_base_dispatch(base_);
}

// ---- libevent listener callbacks ----

void H2Server::AcceptConnCb(evconnlistener* listener,
                            evutil_socket_t fd,
                            sockaddr* /*address*/,
                            int /*socklen*/,
                            void* ctx) {
  H2Server* server = static_cast<H2Server*>(ctx);

  event_base* base = evconnlistener_get_base(listener);

  int one = 1;
  int set_rv = setsockopt(fd,
                          IPPROTO_TCP,
                          TCP_NODELAY,
                          &one,
                          sizeof(one));
  if (set_rv != 0) {
    VLOG(1) << "H2Server: setsockopt(TCP_NODELAY) failed";

    if (evutil_closesocket(fd) != 0) {
      VLOG(2) << "evutil_closesocket failed";
    }

    return;
  }

  bufferevent* bev = bufferevent_socket_new(base,
                                            fd,
                                            BEV_OPT_CLOSE_ON_FREE);
  if (!bev) {
    VLOG(1) << "H2Server: bufferevent_socket_new() failed";

    if (evutil_closesocket(fd) != 0) {
      VLOG(2) << "evutil_closesocket failed";
    }

    return;
  }

  Session* sess = new Session;
  sess->server = server;
  sess->bev = bev;
  sess->h2session = CreateH2Session(sess);
  if (!sess->h2session) {
    VLOG(1) << "H2Server: CreateH2Session() failed";

    bufferevent_free(bev);

    if (evutil_closesocket(fd) != 0) {
      VLOG(2) << "evutil_closesocket failed";
    }

    delete sess;

    return;
  }

  // Send server connection preface (SETTINGS frame).
  nghttp2_settings_entry iv[] = {
      {NGHTTP2_SETTINGS_MAX_CONCURRENT_STREAMS, 100},
      {NGHTTP2_SETTINGS_INITIAL_WINDOW_SIZE, 1 << 20}};
  int submit_settings_rv = nghttp2_submit_settings(sess->h2session,
                                                   NGHTTP2_FLAG_NONE,
                                                   iv,
                                                   2);
  if (submit_settings_rv != 0) {
    VLOG(1) << "H2Server: nghttp2_submit_settings() failed: "
            << nghttp2_strerror(submit_settings_rv);

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
    VLOG(1) << "H2Server: nghttp2_session_set_local_window_size() failed: "
            << nghttp2_strerror(set_local_window_size_rv);

    nghttp2_session_del(sess->h2session);
    bufferevent_free(bev);
    delete sess;

    return;
  }

  int send_rv = nghttp2_session_send(sess->h2session);
  if (send_rv != 0) {
    VLOG(1) << "H2Server: nghttp2_session_send() failed: "
            << nghttp2_strerror(send_rv);

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
    VLOG(1) << "H2Server: bufferevent_enable() failed";

    nghttp2_session_del(sess->h2session);
    bufferevent_free(bev);
    delete sess;

    return;
  }
}

void H2Server::AcceptErrorCb(evconnlistener* listener,
                             void* ctx) {
  (void)ctx;

  event_base* base = evconnlistener_get_base(listener);
  int err = EVUTIL_SOCKET_ERROR();
  VLOG(1) << "H2Server: Got an error " << err << " ("
          << evutil_socket_error_to_string(err)
          << ") on the listener. Shutting down.";

  if (event_base_loopexit(base, nullptr) != 0) {
    VLOG(2) << "event_base_loopexit failed";
  }
}

// ---- libevent bufferevent callbacks ----

void H2Server::ReadCallback(bufferevent* bev, void* ctx) {
  Session* sess = static_cast<Session*>(ctx);

  evbuffer* input = bufferevent_get_input(bev);

  size_t len = evbuffer_get_length(input);
  if (len == 0) {
    return;
  }

  unsigned char* data = evbuffer_pullup(input, -1);
  ssize_t readlen = nghttp2_session_mem_recv(sess->h2session,
                                             data,
                                             len);
  if (readlen < 0) {
    VLOG(1) << "H2Server: nghttp2_session_mem_recv() failed: "
            << nghttp2_strerror(static_cast<int>(readlen));

    bufferevent_free(bev);

    return;
  }
  int drain_rv = evbuffer_drain(input, static_cast<size_t>(readlen));
  if (drain_rv != 0) {
    VLOG(3) << "H2Server: evbuffer_drain() failed";

    bufferevent_free(bev);

    return;
  }

  int session_send_rv = nghttp2_session_send(sess->h2session);
  if (session_send_rv < 0) {
    VLOG(1) << "H2Server: nghttp2_session_send() failed: "
            << nghttp2_strerror(session_send_rv);
  }
}

void H2Server::EventCallback(bufferevent* bev,
                             short what,  // NOLINT(runtime/int)
                             void* ctx) {
  Session* sess = static_cast<Session*>(ctx);

  if (what & BEV_EVENT_ERROR) {
    VLOG(2) << "H2Server: connection error";
  }

  if (what & (BEV_EVENT_EOF | BEV_EVENT_ERROR)) {
    for (auto& [sid, info] : sess->incoming_streams) {
      if (info.web_stream) {
        info.web_stream->OnError();
        delete info.web_stream;
      }
    }

    nghttp2_session_del(sess->h2session);
    bufferevent_free(bev);
    delete sess;
  }
}

// ---- nghttp2 session callbacks ----

nghttp2_ssize H2Server::SendCallback(nghttp2_session* /*session*/,
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

int H2Server::OnHeaderCallback(nghttp2_session* /*session*/,
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

  sess->incoming_streams[stream_id].headers[hdr_name] = hdr_value;
  return 0;
}

int H2Server::OnFrameRecvCallback(nghttp2_session* session,
                                  const nghttp2_frame* frame,
                                  void* user_data) {
  Session* sess = static_cast<Session*>(user_data);

  int32_t stream_id = frame->hd.stream_id;

  NGHTTP2WebStream* web_stream = nullptr;
  auto it = sess->incoming_streams.find(stream_id);
  if (it != sess->incoming_streams.end()) {
    web_stream = it->second.web_stream;
  }

  if (web_stream) {
    // Trigger OnClose if we receive END_STREAM (body EOF) from the peer.
    if ((frame->hd.type == NGHTTP2_DATA || frame->hd.type == NGHTTP2_HEADERS) &&
        (frame->hd.flags & NGHTTP2_FLAG_END_STREAM)) {
      web_stream->OnClose();
    }
  }

  if (frame->hd.type != NGHTTP2_HEADERS ||
      frame->headers.cat != NGHTTP2_HCAT_REQUEST) {
    return 0;
  }

  // Reject non-web-stream requests with 415 Unsupported Media Type.
  bool is_wish = false;
  auto it_stream = sess->incoming_streams.find(stream_id);
  if (it_stream != sess->incoming_streams.end()) {
    auto ct_it = it_stream->second.headers.find("content-type");
    if (ct_it != it_stream->second.headers.end() && ct_it->second == "application/web-stream") {
      is_wish = true;
    }
  }

  if (!is_wish) {
    const nghttp2_nv hdrs[] = {H2S_MAKE_NV(":status", "415")};
    int submit_response_rv = nghttp2_submit_response2(session,
                                                      stream_id,
                                                      hdrs,
                                                      1,
                                                      nullptr);
    if (submit_response_rv != 0) {
      VLOG(1) << "H2Server: nghttp2_submit_response2() failed: "
              << nghttp2_strerror(submit_response_rv);

      // nghttp2_on_frame_recv_callback spec: any nonzero value signals a fatal error.
      return -1;
    }

    int session_send_rv = nghttp2_session_send(session);
    if (session_send_rv != 0) {
      VLOG(1) << "H2Server: nghttp2_session_send() failed: "
              << nghttp2_strerror(session_send_rv);

      // nghttp2_on_frame_recv_callback spec: any nonzero value signals a fatal error.
      return -1;
    }

    return 0;
  }

  // Create the web-stream stream object.
  web_stream = new NGHTTP2WebStream(session, stream_id, true);

  if (!web_stream->Init()) {
    VLOG(1) << "H2Server: NGHTTP2WebStream::Init() failed";

    delete web_stream;

    return -1;
  }

  sess->incoming_streams[stream_id].web_stream = web_stream;

  nghttp2_data_provider2 data_prd;
  data_prd.source.ptr = web_stream;
  data_prd.read_callback = DataSourceReadCallback;

  const nghttp2_nv hdrs[] = {
      H2S_MAKE_NV(":status", "200"),
      H2S_MAKE_NV("content-type", "application/web-stream")};
  int submit_response_rv = nghttp2_submit_response2(session,
                                                    stream_id,
                                                    hdrs,
                                                    2,
                                                    &data_prd);
  if (submit_response_rv != 0) {
    VLOG(1) << "H2Server: nghttp2_submit_response2() failed: "
            << nghttp2_strerror(submit_response_rv);

    delete web_stream;
    sess->incoming_streams.erase(stream_id);

    // nghttp2_on_frame_recv_callback spec: any nonzero value signals a fatal error.
    return -1;
  }

  int session_send_rv = nghttp2_session_send(session);
  if (session_send_rv != 0) {
    VLOG(1) << "H2Server: nghttp2_session_send() failed: "
            << nghttp2_strerror(session_send_rv);

    delete web_stream;
    sess->incoming_streams.erase(stream_id);

    // nghttp2_on_frame_recv_callback spec: any nonzero value signals a fatal error.
    return -1;
  }

  // Notify the application.  The callback should register its own on_message /
  // on_close handlers on the stream before returning.
  if (sess->server->on_stream_) {
    sess->server->on_stream_(web_stream);
  }

  return 0;
}

int H2Server::OnDataChunkRecvCallback(nghttp2_session* session,
                                      uint8_t /*flags*/,
                                      int32_t stream_id,
                                      const uint8_t* data,
                                      size_t len,
                                      void* user_data) {
  Session* sess = static_cast<Session*>(user_data);

  NGHTTP2WebStream* web_stream = nullptr;
  auto it = sess->incoming_streams.find(stream_id);
  if (it != sess->incoming_streams.end()) {
    web_stream = it->second.web_stream;
  }

  if (web_stream) {
    web_stream->OnDataChunk(data, len);

    int rv = nghttp2_session_send(session);
    if (rv != 0) {
      VLOG(1) << "H2Server: nghttp2_session_send() failed: "
              << nghttp2_strerror(rv);
    }
  }

  return 0;
}

int H2Server::OnStreamCloseCallback(nghttp2_session* /*session*/,
                                    int32_t stream_id,
                                    uint32_t error_code,
                                    void* user_data) {
  Session* sess = static_cast<Session*>(user_data);

  NGHTTP2WebStream* web_stream = nullptr;
  auto it = sess->incoming_streams.find(stream_id);
  if (it != sess->incoming_streams.end()) {
    web_stream = it->second.web_stream;
  }

  if (web_stream) {
    if (error_code != NGHTTP2_NO_ERROR) {
      web_stream->OnError();
    } else {
      web_stream->OnClose();
    }

    delete web_stream;
  }
  sess->incoming_streams.erase(stream_id);

  return 0;
}

nghttp2_ssize H2Server::DataSourceReadCallback(nghttp2_session* /*session*/,
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

nghttp2_session* H2Server::CreateH2Session(Session* sess) {
  nghttp2_session_callbacks* cbs;
  int callbacks_new_rv = nghttp2_session_callbacks_new(&cbs);
  if (callbacks_new_rv != 0) {
    VLOG(1) << "H2Server: nghttp2_session_callbacks_new() failed";

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
  int session_new_rv = nghttp2_session_server_new(&session,
                                                  cbs,
                                                  sess);
  nghttp2_session_callbacks_del(cbs);
  if (session_new_rv != 0) {
    VLOG(1) << "H2Server: nghttp2_session_server_new() failed";

    return nullptr;
  }

  return session;
}
