#include <arpa/inet.h>
#include <errno.h>
#include <event2/buffer.h>
#include <event2/bufferevent.h>
#include <event2/event.h>
#include <event2/listener.h>
#include <fcntl.h>
#include <netinet/in.h>
#include <netinet/tcp.h>
#include <nghttp2/nghttp2.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <unistd.h>

#include "absl/flags/flag.h"
#include "absl/flags/parse.h"
#include "absl/log/initialize.h"
#include "absl/log/log.h"

ABSL_FLAG(int, port, 8080, "Port to listen on");

#define MAKE_NV(name, value)                                            \
  {                                                                     \
      (uint8_t*)(name), (uint8_t*)(value), strlen(name), strlen(value), \
      NGHTTP2_NV_FLAG_NONE}

struct ClientSession {
  struct bufferevent* bev;
  nghttp2_session* session;
  struct app_context* app_ctx;
};

struct stream_data {
  int32_t stream_id;
  struct evbuffer* req_body;
};

struct app_context {
  struct event_base* evbase;
};

static ssize_t send_callback(nghttp2_session* session, const uint8_t* data, size_t length, int flags, void* user_data) {
  struct ClientSession* client = (struct ClientSession*)user_data;
  struct bufferevent* bev = client->bev;
  struct evbuffer* output = bufferevent_get_output(bev);
  int add_result = evbuffer_add(output, data, length);
  if (add_result < 0) {
    LOG(FATAL) << "evbuffer_add() failed";
  }
  return (ssize_t)length;
}

static ssize_t echo_data_provider_callback(nghttp2_session* session, int32_t stream_id, uint8_t* buf, size_t length, uint32_t* data_flags, nghttp2_data_source* source, void* user_data);

static int on_frame_recv_callback(nghttp2_session* session, const nghttp2_frame* frame, void* user_data) {
  VLOG(2) << "Received frame type " << static_cast<int>(frame->hd.type);

  struct ClientSession* client = (struct ClientSession*)user_data;

  switch (frame->hd.type) {
    case NGHTTP2_HEADERS:
      if (frame->headers.cat == NGHTTP2_HCAT_REQUEST) {
        struct stream_data* sd = new stream_data;

        sd->stream_id = frame->hd.stream_id;
        sd->req_body = evbuffer_new();

        int set_stream_user_data_result = nghttp2_session_set_stream_user_data(session, frame->hd.stream_id, sd);
        if (set_stream_user_data_result < 0) {
          LOG(FATAL) << "nghttp2_session_set_stream_user_data() failed: " << nghttp2_strerror(set_stream_user_data_result);
        }

        int send_result = nghttp2_session_send(session);  // flush to output
        if (send_result < 0) {
          LOG(FATAL) << "nghttp2_session_send() failed: " << nghttp2_strerror(send_result);
        }
      }
      break;
    case NGHTTP2_DATA:
      VLOG(2) << "Received DATA frame on stream " << frame->hd.stream_id << ", flags " << static_cast<int>(frame->hd.flags);

      if (frame->hd.flags & NGHTTP2_FLAG_END_STREAM) {
        VLOG(1) << "Received END_STREAM";

        const nghttp2_nv hdrs[] = {
            MAKE_NV(":status", "200")};
        struct stream_data* sd = (struct stream_data*)nghttp2_session_get_stream_user_data(session, frame->hd.stream_id);
        if (!sd) {
          LOG(FATAL) << "No stream data found";
        }

        nghttp2_data_provider data_prd;
        data_prd.source.ptr = sd;
        data_prd.read_callback = echo_data_provider_callback;

        int submit_result = nghttp2_submit_response(session, frame->hd.stream_id, hdrs, 1, &data_prd);
        if (submit_result < 0) {
          LOG(FATAL) << "nghttp2_submit_response() failed: " << nghttp2_strerror(submit_result);
        }

        int send_result = nghttp2_session_send(session);  // flush to output
        if (send_result < 0) {
          LOG(FATAL) << "nghttp2_session_send() failed: " << nghttp2_strerror(send_result);
        }
      }
      break;
  }
  return 0;
}

static int on_data_chunk_recv_callback(nghttp2_session* session, uint8_t flags, int32_t stream_id, const uint8_t* data, size_t len, void* user_data) {
  struct stream_data* sd = (struct stream_data*)nghttp2_session_get_stream_user_data(session, stream_id);
  if (sd) {
    int add_result = evbuffer_add(sd->req_body, data, len);
    if (add_result < 0) {
      LOG(FATAL) << "evbuffer_add() failed";
    }
  }

  return 0;
}

static ssize_t echo_data_provider_callback(nghttp2_session* session, int32_t stream_id, uint8_t* buf, size_t length, uint32_t* data_flags, nghttp2_data_source* source, void* user_data) {
  struct stream_data* sd = (struct stream_data*)source->ptr;

  size_t avail = evbuffer_get_length(sd->req_body);
  size_t send_len = avail < length ? avail : length;

  if (send_len > 0) {
    evbuffer_remove(sd->req_body, buf, send_len);
  }

  if (evbuffer_get_length(sd->req_body) == 0) {
    *data_flags |= NGHTTP2_DATA_FLAG_EOF;

    evbuffer_free(sd->req_body);
    delete sd;
    nghttp2_session_set_stream_user_data(session, stream_id, NULL);
  }

  return send_len;
}

static int on_stream_close_callback(nghttp2_session* session, int32_t stream_id, uint32_t error_code, void* user_data) {
  struct stream_data* sd = (struct stream_data*)nghttp2_session_get_stream_user_data(session, stream_id);
  if (sd) {
    evbuffer_free(sd->req_body);
    delete sd;
    nghttp2_session_set_stream_user_data(session, stream_id, NULL);
  }
  return 0;
}

static int on_header_callback(nghttp2_session* session, const nghttp2_frame* frame, const uint8_t* name, size_t namelen, const uint8_t* value, size_t valuelen, uint8_t flags, void* user_data) {
  // We could inspect headers here if needed
  return 0;
}

static int on_begin_headers_callback(nghttp2_session* session, const nghttp2_frame* frame, void* user_data) {
  // Only care about request
  return 0;
}

static void readcb(struct bufferevent* bev, void* ptr) {
  struct ClientSession* client = (struct ClientSession*)ptr;

  struct evbuffer* input = bufferevent_get_input(bev);
  size_t datalen = evbuffer_get_length(input);
  VLOG(2) << "readcb(): got " << datalen << " bytes";

  if (datalen == 0) return;

  unsigned char* data = evbuffer_pullup(input, -1);

  ssize_t readlen = nghttp2_session_mem_recv(client->session, data, datalen);
  if (readlen < 0) {
    LOG(FATAL) << "nghttp2_session_mem_recv() failed: " << nghttp2_strerror(static_cast<int>(readlen));
  }

  VLOG(2) << "readcb(): consumed " << readlen << " bytes";

  evbuffer_drain(input, readlen);

  int send_result = nghttp2_session_send(client->session);
  if (send_result < 0) {
    LOG(FATAL) << "nghttp2_session_send() failed: " << nghttp2_strerror(send_result);
  }
}

static void eventcb(struct bufferevent* bev, short events, void* ptr) {
  struct ClientSession* client = (struct ClientSession*)ptr;

  if (events & BEV_EVENT_ERROR) {
    LOG(ERROR) << "Error from bufferevent";
  }

  if (events & (BEV_EVENT_EOF | BEV_EVENT_ERROR)) {
    nghttp2_session_del(client->session);
    bufferevent_free(bev);
    delete client;
  }
}

static void acceptcb(struct evconnlistener* listener, evutil_socket_t fd, struct sockaddr* addr, int slen, void* ptr) {
  struct app_context* app_ctx = (struct app_context*)ptr;
  struct event_base* base = app_ctx->evbase;

  int nodelay = 1;
  int setopt_result = setsockopt(fd, IPPROTO_TCP, TCP_NODELAY, &nodelay, sizeof(nodelay));
  if (setopt_result != 0) {
    LOG(FATAL) << "setsockopt(TCP_NODELAY) failed";
  }

  struct bufferevent* bev = bufferevent_socket_new(base, fd, BEV_OPT_CLOSE_ON_FREE);

  struct ClientSession* client = new ClientSession;
  client->bev = bev;
  client->app_ctx = app_ctx;

  nghttp2_session_callbacks* callbacks;
  nghttp2_session_callbacks_new(&callbacks);

  nghttp2_session_callbacks_set_send_callback(callbacks, send_callback);
  nghttp2_session_callbacks_set_on_frame_recv_callback(callbacks, on_frame_recv_callback);
  nghttp2_session_callbacks_set_on_data_chunk_recv_callback(callbacks, on_data_chunk_recv_callback);
  nghttp2_session_callbacks_set_on_stream_close_callback(callbacks, on_stream_close_callback);
  nghttp2_session_callbacks_set_on_header_callback(callbacks, on_header_callback);
  nghttp2_session_callbacks_set_on_begin_headers_callback(callbacks, on_begin_headers_callback);

  nghttp2_session_server_new(&client->session, callbacks, client);

  nghttp2_session_callbacks_del(callbacks);

  nghttp2_settings_entry iv[2] = {
      {NGHTTP2_SETTINGS_INITIAL_WINDOW_SIZE, 15 * 1024 * 1024},
      {NGHTTP2_SETTINGS_MAX_FRAME_SIZE, 1 << 20}};
  nghttp2_submit_settings(client->session, NGHTTP2_FLAG_NONE, iv, 2);

  nghttp2_session_set_local_window_size(client->session, NGHTTP2_FLAG_NONE, 0, 15 * 1024 * 1024);

  nghttp2_session_send(client->session);

  bufferevent_setcb(bev, readcb, NULL, eventcb, client);
  int enable_result = bufferevent_enable(bev, EV_READ | EV_WRITE);
  if (enable_result != 0) {
    LOG(FATAL) << "bufferevent_enable() failed";
  }
}

int main(int argc, char** argv) {
  absl::ParseCommandLine(argc, argv);
  absl::InitializeLog();

  struct event_base* base = event_base_new();
  if (!base) {
    LOG(FATAL) << "event_base_new() failed";
  }

  struct app_context app_ctx;
  app_ctx.evbase = base;

  struct sockaddr_in sin;
  memset(&sin, 0, sizeof(sin));
  sin.sin_family = AF_INET;
  sin.sin_addr.s_addr = htonl(0);
  sin.sin_port = htons(absl::GetFlag(FLAGS_port));

  struct evconnlistener* listener = evconnlistener_new_bind(base, acceptcb, (void*)&app_ctx,
                                                            LEV_OPT_CLOSE_ON_FREE | LEV_OPT_REUSEABLE, -1,
                                                            (struct sockaddr*)&sin, sizeof(sin));
  if (!listener) {
    LOG(FATAL) << "evconnlistener_new_bind() failed";
  }

  LOG(INFO) << "Listening on port " << absl::GetFlag(FLAGS_port) << "...";

  event_base_dispatch(base);

  evconnlistener_free(listener);
  event_base_free(base);

  return 0;
}
