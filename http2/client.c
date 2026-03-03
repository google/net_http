#include <arpa/inet.h>
#include <event2/buffer.h>
#include <event2/bufferevent.h>
#include <event2/event.h>
#include <netinet/in.h>
#include <nghttp2/nghttp2.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/time.h>
#include <time.h>
#include <unistd.h>

#define MAKE_NV(name, value)                                            \
  {                                                                     \
      (uint8_t*)(name), (uint8_t*)(value), strlen(name), strlen(value), \
      NGHTTP2_NV_FLAG_NONE}

#define REQUEST_PAYLOAD "Hello, HTTP/2 echo server!"
#define CONCURRENT_REQUESTS 100

struct ClientSession {
  struct bufferevent* bev;
  nghttp2_session* session;
  struct event_base* evbase;
  int requests_completed;
  int requests_in_flight;
  struct timeval start_time;
};

static void submit_request(struct ClientSession* client);

static ssize_t send_callback(nghttp2_session* session, const uint8_t* data, size_t length, int flags, void* user_data) {
  struct ClientSession* client = (struct ClientSession*)user_data;
  struct bufferevent* bev = client->bev;
  struct evbuffer* output = bufferevent_get_output(bev);
  evbuffer_add(output, data, length);
  return (ssize_t)length;
}

static int on_frame_recv_callback(nghttp2_session* session, const nghttp2_frame* frame, void* user_data) {
  struct ClientSession* client = (struct ClientSession*)user_data;
  printf("Client received frame type %d on stream %d\n", frame->hd.type, frame->hd.stream_id);
  if (frame->hd.type == NGHTTP2_DATA && (frame->hd.flags & NGHTTP2_FLAG_END_STREAM)) {
    client->requests_completed++;
    client->requests_in_flight--;
    submit_request(client);  // Submit another request to keep pipeline full

    if (client->requests_completed % 1000 == 0) {
      struct timeval now;
      gettimeofday(&now, NULL);
      double elapsed = (now.tv_sec - client->start_time.tv_sec) +
                       (now.tv_usec - client->start_time.tv_usec) / 1000000.0;
      printf("Completed %d requests. RPS: %.2f\n",
             client->requests_completed, client->requests_completed / elapsed);
    }
  } else if (frame->hd.type == NGHTTP2_HEADERS && (frame->hd.flags & NGHTTP2_FLAG_END_STREAM)) {
    // If server sent end stream on headers (e.g., error without body)
    printf("Client received END_STREAM on headers\n");
  }
  return 0;
}

static ssize_t data_provider_callback(nghttp2_session* session, int32_t stream_id, uint8_t* buf, size_t length, uint32_t* data_flags, nghttp2_data_source* source, void* user_data) {
  int* sent = (int*)source->ptr;
  size_t payload_len = strlen(REQUEST_PAYLOAD);

  if (*sent) {
    *data_flags |= NGHTTP2_DATA_FLAG_EOF;
    free(sent);
    return 0;
  }

  size_t send_len = payload_len < length ? payload_len : length;
  memcpy(buf, REQUEST_PAYLOAD, send_len);

  if (send_len == payload_len) {
    *data_flags |= NGHTTP2_DATA_FLAG_EOF;
    free(sent);
  } else {
    *sent = 1;  // Simplification: assume we send it all in one go or it's a bug in our tiny benchmark
  }

  return send_len;
}

static void submit_request(struct ClientSession* client) {
  const nghttp2_nv hdrs[] = {
      MAKE_NV(":method", "POST"),
      MAKE_NV(":path", "/"),
      MAKE_NV(":scheme", "http"),
      MAKE_NV(":authority", "127.0.0.1:8080"),
  };

  int* sent = malloc(sizeof(int));
  *sent = 0;

  nghttp2_data_provider data_prd;
  data_prd.source.ptr = sent;
  data_prd.read_callback = data_provider_callback;

  int32_t stream_id = nghttp2_submit_request(client->session, NULL, hdrs, 4, &data_prd, NULL);
  if (stream_id < 0) {
    printf("nghttp2_submit_request error\n");
  } else {
    client->requests_in_flight++;
  }
  nghttp2_session_send(client->session);
}

static void setup_nghttp2_callbacks(nghttp2_session_callbacks* callbacks) {
  nghttp2_session_callbacks_set_send_callback(callbacks, send_callback);
  nghttp2_session_callbacks_set_on_frame_recv_callback(callbacks, on_frame_recv_callback);
}

static void readcb(struct bufferevent* bev, void* ptr) {
  struct ClientSession* client = (struct ClientSession*)ptr;

  struct evbuffer* input = bufferevent_get_input(bev);
  size_t datalen = evbuffer_get_length(input);
  printf("Client readcb: got %zu bytes\n", datalen);
  fflush(stdout);

  if (datalen == 0) return;

  unsigned char* data = evbuffer_pullup(input, -1);
  ssize_t readlen = nghttp2_session_mem_recv(client->session, data, datalen);
  if (readlen < 0) {
    printf("Client: nghttp2_session_mem_recv error: %s\n", nghttp2_strerror((int)readlen));
    fflush(stdout);
    return;
  }

  printf("Client readcb: consumed %zd bytes\n", readlen);
  fflush(stdout);

  evbuffer_drain(input, readlen);
  nghttp2_session_send(client->session);
}

static void eventcb(struct bufferevent* bev, short events, void* ptr) {
  struct ClientSession* client = (struct ClientSession*)ptr;

  if (events & BEV_EVENT_CONNECTED) {
    printf("Connected to server.\n");

    nghttp2_session_callbacks* callbacks;
    nghttp2_session_callbacks_new(&callbacks);
    setup_nghttp2_callbacks(callbacks);

    nghttp2_session_client_new(&client->session, callbacks, client);

    nghttp2_session_callbacks_del(callbacks);

    // Send connection preface and initial settings
    nghttp2_settings_entry iv[1] = {
        {NGHTTP2_SETTINGS_MAX_CONCURRENT_STREAMS, CONCURRENT_REQUESTS}};
    nghttp2_submit_settings(client->session, NGHTTP2_FLAG_NONE, iv, 1);

    gettimeofday(&client->start_time, NULL);

    for (int i = 0; i < CONCURRENT_REQUESTS; i++) {
      submit_request(client);
    }

    return;
  }

  if (events & (BEV_EVENT_EOF | BEV_EVENT_ERROR)) {
    printf("Connection closed or error.\n");
    event_base_loopexit(client->evbase, NULL);
  }
}

int main(int argc, char** argv) {
  struct ClientSession client;
  memset(&client, 0, sizeof(client));

  struct event_base* base = event_base_new();
  client.evbase = base;

  struct sockaddr_in sin;
  memset(&sin, 0, sizeof(sin));

  const char* host = "127.0.0.1";
  int port = 8080;
  if (argc >= 3) {
    host = argv[1];
    port = atoi(argv[2]);
  }

  sin.sin_family = AF_INET;
  sin.sin_addr.s_addr = inet_addr(host);
  sin.sin_port = htons(port);

  struct bufferevent* bev = bufferevent_socket_new(base, -1, BEV_OPT_CLOSE_ON_FREE);
  client.bev = bev;

  bufferevent_setcb(bev, readcb, NULL, eventcb, &client);
  bufferevent_enable(bev, EV_READ | EV_WRITE);

  if (bufferevent_socket_connect(bev, (struct sockaddr*)&sin, sizeof(sin)) < 0) {
    printf("Connect failed\n");
    return 1;
  }

  event_base_dispatch(base);

  if (client.session) nghttp2_session_del(client.session);
  bufferevent_free(bev);
  event_base_free(base);

  return 0;
}
