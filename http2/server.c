#include <arpa/inet.h>
#include <errno.h>
#include <event2/buffer.h>
#include <event2/bufferevent.h>
#include <event2/event.h>
#include <event2/listener.h>
#include <fcntl.h>
#include <netinet/in.h>
#include <nghttp2/nghttp2.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <unistd.h>

#define MAKE_NV(name, value)                                            \
  {                                                                     \
      (uint8_t*)(name), (uint8_t*)(value), strlen(name), strlen(value), \
      NGHTTP2_NV_FLAG_NONE}

#define PORT 8080

struct app_context;
struct stream_data;

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
  evbuffer_add(output, data, length);
  return (ssize_t)length;
}

static ssize_t echo_data_provider_callback(nghttp2_session* session, int32_t stream_id, uint8_t* buf, size_t length, uint32_t* data_flags, nghttp2_data_source* source, void* user_data);

static int on_frame_recv_callback(nghttp2_session* session, const nghttp2_frame* frame, void* user_data) {
  struct ClientSession* client = (struct ClientSession*)user_data;
  printf("Server received frame type %d\n", frame->hd.type);
  switch (frame->hd.type) {
    case NGHTTP2_HEADERS:
      if (frame->headers.cat == NGHTTP2_HCAT_REQUEST) {
        struct stream_data* sd = malloc(sizeof(struct stream_data));
        sd->stream_id = frame->hd.stream_id;
        sd->req_body = evbuffer_new();
        nghttp2_session_set_stream_user_data(session, frame->hd.stream_id, sd);
      }
      break;
    case NGHTTP2_DATA:
      printf("Server logic: DATA frame on stream %d, flags %x\n", frame->hd.stream_id, frame->hd.flags);
      if (frame->hd.flags & NGHTTP2_FLAG_END_STREAM) {
        printf("Server logic: END_STREAM seen\n");
        const nghttp2_nv hdrs[] = {
            MAKE_NV(":status", "200")};
        struct stream_data* sd = nghttp2_session_get_stream_user_data(session, frame->hd.stream_id);
        if (sd) {
          nghttp2_data_provider data_prd;
          data_prd.source.ptr = sd;
          data_prd.read_callback = echo_data_provider_callback;
          int rv = nghttp2_submit_response(session, frame->hd.stream_id, hdrs, 1, &data_prd);
          printf("nghttp2_submit_response returned %d\n", rv);
          nghttp2_session_send(session);  // flush to output
        } else {
          printf("Server logic: No stream data found!\n");
        }
      }
      break;
  }
  return 0;
}

static int on_data_chunk_recv_callback(nghttp2_session* session, uint8_t flags, int32_t stream_id, const uint8_t* data, size_t len, void* user_data) {
  struct stream_data* sd = nghttp2_session_get_stream_user_data(session, stream_id);
  if (sd) {
    evbuffer_add(sd->req_body, data, len);
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
    free(sd);
    nghttp2_session_set_stream_user_data(session, stream_id, NULL);
  }

  return send_len;
}

static int on_stream_close_callback(nghttp2_session* session, int32_t stream_id, uint32_t error_code, void* user_data) {
  struct stream_data* sd = nghttp2_session_get_stream_user_data(session, stream_id);
  if (sd) {
    evbuffer_free(sd->req_body);
    free(sd);
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

// nghttp2 callbacks
static void setup_nghttp2_callbacks(nghttp2_session_callbacks* callbacks) {
  nghttp2_session_callbacks_set_send_callback(callbacks, send_callback);
  nghttp2_session_callbacks_set_on_frame_recv_callback(callbacks, on_frame_recv_callback);
  nghttp2_session_callbacks_set_on_data_chunk_recv_callback(callbacks, on_data_chunk_recv_callback);
  nghttp2_session_callbacks_set_on_stream_close_callback(callbacks, on_stream_close_callback);
  nghttp2_session_callbacks_set_on_header_callback(callbacks, on_header_callback);
  nghttp2_session_callbacks_set_on_begin_headers_callback(callbacks, on_begin_headers_callback);
}

// Read from network
static void readcb(struct bufferevent* bev, void* ptr) {
  struct ClientSession* client = (struct ClientSession*)ptr;
  struct evbuffer* input = bufferevent_get_input(bev);

  size_t datalen = evbuffer_get_length(input);
  printf("Server readcb: got %zu bytes\n", datalen);
  fflush(stdout);
  if (datalen == 0) return;

  unsigned char* data = evbuffer_pullup(input, -1);

  ssize_t readlen = nghttp2_session_mem_recv(client->session, data, datalen);
  if (readlen < 0) {
    printf("Server: nghttp2_session_mem_recv error: %s\n", nghttp2_strerror((int)readlen));
    fflush(stdout);
    bufferevent_free(bev);
    return;
  }
  printf("Server readcb: consumed %zd bytes\n", readlen);
  fflush(stdout);
  evbuffer_drain(input, readlen);
  nghttp2_session_send(client->session);
}

static void eventcb(struct bufferevent* bev, short events, void* ptr) {
  struct ClientSession* client = (struct ClientSession*)ptr;
  if (events & BEV_EVENT_ERROR) {
    printf("Error from bufferevent\n");
  }
  if (events & (BEV_EVENT_EOF | BEV_EVENT_ERROR)) {
    nghttp2_session_del(client->session);
    bufferevent_free(bev);
    free(client);
  }
}

static void acceptcb(struct evconnlistener* listener, evutil_socket_t fd, struct sockaddr* a, int slen, void* p) {
  struct app_context* app_ctx = (struct app_context*)p;
  struct event_base* base = app_ctx->evbase;
  struct bufferevent* bev = bufferevent_socket_new(base, fd, BEV_OPT_CLOSE_ON_FREE);

  struct ClientSession* client = malloc(sizeof(struct ClientSession));
  client->bev = bev;
  client->app_ctx = app_ctx;

  nghttp2_session_callbacks* callbacks;
  nghttp2_session_callbacks_new(&callbacks);
  setup_nghttp2_callbacks(callbacks);

  nghttp2_session_server_new(&client->session, callbacks, client);
  nghttp2_session_callbacks_del(callbacks);

  nghttp2_settings_entry iv[1] = {
      {NGHTTP2_SETTINGS_MAX_CONCURRENT_STREAMS, 100}};
  nghttp2_submit_settings(client->session, NGHTTP2_FLAG_NONE, iv, 1);
  nghttp2_session_send(client->session);

  bufferevent_setcb(bev, readcb, NULL, eventcb, client);
  bufferevent_enable(bev, EV_READ | EV_WRITE);
}

int main(int argc, char** argv) {
  struct event_base* base;
  struct evconnlistener* listener;
  struct sockaddr_in sin;
  struct app_context app_ctx;

  base = event_base_new();
  if (!base) {
    fprintf(stderr, "Could not initialize libevent!\n");
    return 1;
  }

  app_ctx.evbase = base;

  memset(&sin, 0, sizeof(sin));
  sin.sin_family = AF_INET;
  sin.sin_addr.s_addr = htonl(0);
  sin.sin_port = htons(PORT);

  listener = evconnlistener_new_bind(base, acceptcb, (void*)&app_ctx,
                                     LEV_OPT_CLOSE_ON_FREE | LEV_OPT_REUSEABLE, -1,
                                     (struct sockaddr*)&sin, sizeof(sin));
  if (!listener) {
    fprintf(stderr, "Could not create a listener!\n");
    return 1;
  }

  printf("Listening on port %d...\n", PORT);

  event_base_dispatch(base);

  evconnlistener_free(listener);
  event_base_free(base);

  return 0;
}
