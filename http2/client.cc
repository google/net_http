#include <arpa/inet.h>
#include <event2/buffer.h>
#include <event2/bufferevent.h>
#include <event2/event.h>
#include <netinet/in.h>
#include <netinet/tcp.h>
#include <nghttp2/nghttp2.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <sys/socket.h>
#include <time.h>
#include <unistd.h>

#include <algorithm>
#include <chrono>
#include <cmath>
#include <map>
#include <numeric>
#include <string>
#include <vector>

#include "absl/flags/flag.h"
#include "absl/flags/parse.h"
#include "absl/log/flags.h"
#include "absl/log/initialize.h"
#include "absl/log/log.h"
#include "benchmark/benchmark.h"

ABSL_FLAG(std::string, host, "127.0.0.1", "Server host to connect to");
ABSL_FLAG(int, port, 8080, "Server port to connect to");
ABSL_FLAG(int, report_interval, 1000, "Frequency of progress reports");

#define MAKE_NV(name, value)                                            \
  {                                                                     \
      (uint8_t*)(name), (uint8_t*)(value), strlen(name), strlen(value), \
      NGHTTP2_NV_FLAG_NONE}

std::string payload;

struct ClientSession {
  struct bufferevent* bev;
  nghttp2_session* session;
  struct event_base* evbase;

  int requests_completed;
  int total_requests_submitted;
  std::map<int32_t, std::chrono::steady_clock::time_point> request_start_times;
  std::vector<double> latencies;
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
  VLOG(2) << "Received frame type " << static_cast<int>(frame->hd.type) << " on stream " << frame->hd.stream_id;

  struct ClientSession* client = (struct ClientSession*)user_data;

  if (frame->hd.type == NGHTTP2_DATA) {
    if (frame->hd.flags & NGHTTP2_FLAG_END_STREAM) {
      client->requests_completed++;

      auto it = client->request_start_times.find(frame->hd.stream_id);
      if (it != client->request_start_times.end()) {
        auto end_time = std::chrono::steady_clock::now();
        double duration = std::chrono::duration<double, std::milli>(end_time - it->second).count();
        client->latencies.push_back(duration);
        client->request_start_times.erase(it);
      }

      int loopexit_result = event_base_loopexit(client->evbase, NULL);
      if (loopexit_result != 0) {
        LOG(FATAL) << "event_base_loopexit() failed";
      }
    }
  } else if (frame->hd.type == NGHTTP2_HEADERS && (frame->hd.flags & NGHTTP2_FLAG_END_STREAM)) {
    LOG(FATAL) << "Received END_STREAM on headers unexpectedly";
  }

  return 0;
}

static ssize_t data_provider_callback(nghttp2_session* session, int32_t stream_id, uint8_t* buf, size_t length, uint32_t* data_flags, nghttp2_data_source* source, void* user_data) {
  int* bytes_sent = (int*)source->ptr;
  size_t payload_len = payload.length();

  if (*bytes_sent >= payload_len) {
    *data_flags |= NGHTTP2_DATA_FLAG_EOF;
    return 0;
  }

  size_t remaining = payload_len - *bytes_sent;
  size_t send_len = remaining < length ? remaining : length;
  memcpy(buf, payload.data() + *bytes_sent, send_len);

  *bytes_sent += send_len;

  if (*bytes_sent >= payload_len) {
    *data_flags |= NGHTTP2_DATA_FLAG_EOF;
  }

  return send_len;
}

static int on_stream_close_callback(nghttp2_session* session, int32_t stream_id, uint32_t error_code, void* user_data) {
  int* bytes_sent = (int*)nghttp2_session_get_stream_user_data(session, stream_id);
  if (bytes_sent) {
    delete bytes_sent;
  }
  return 0;
}

static void submit_request(struct ClientSession* client) {
  const nghttp2_nv hdrs[] = {
      MAKE_NV(":method", "POST"),
      MAKE_NV(":path", "/"),
      MAKE_NV(":scheme", "http"),
      MAKE_NV(":authority", "127.0.0.1:8080"),
  };

  int* bytes_sent = new int;
  *bytes_sent = 0;

  nghttp2_data_provider data_prd;
  data_prd.source.ptr = bytes_sent;
  data_prd.read_callback = data_provider_callback;

  int32_t submit_result = nghttp2_submit_request(client->session, NULL, hdrs, 4, &data_prd, bytes_sent);
  if (submit_result < 0) {
    LOG(FATAL) << "nghttp2_submit_request() failed: " << nghttp2_strerror(submit_result);
  } else {
    client->total_requests_submitted++;
    client->request_start_times[submit_result] = std::chrono::steady_clock::now();
  }

  int send_result = nghttp2_session_send(client->session);
  if (send_result < 0) {
    LOG(FATAL) << "nghttp2_session_send() failed: " << nghttp2_strerror(send_result);
  }
}

static void readcb(struct bufferevent* bev, void* ptr) {
  struct ClientSession* client = (struct ClientSession*)ptr;

  struct evbuffer* input = bufferevent_get_input(bev);
  size_t datalen = evbuffer_get_length(input);
  VLOG(2) << "readcb(): got " << datalen << " bytes";

  if (datalen == 0) return;

  unsigned char* data = evbuffer_pullup(input, -1);
  ssize_t readlen = nghttp2_session_mem_recv2(client->session, data, datalen);
  if (readlen < 0) {
    LOG(FATAL) << "nghttp2_session_mem_recv2() failed: " << nghttp2_strerror(static_cast<int>(readlen));
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

  if (events & BEV_EVENT_CONNECTED) {
    int fd = bufferevent_getfd(bev);
    if (fd < 0) {
      LOG(FATAL) << "bufferevent_getfd() failed";
    }

    int nodelay = 1;
    int setopt_result = setsockopt(fd, IPPROTO_TCP, TCP_NODELAY, &nodelay, sizeof(nodelay));
    if (setopt_result != 0) {
      LOG(FATAL) << "setsockopt(TCP_NODELAY) failed";
    }

    nghttp2_session_callbacks* callbacks;
    nghttp2_session_callbacks_new(&callbacks);

    nghttp2_session_callbacks_set_send_callback(callbacks, send_callback);
    nghttp2_session_callbacks_set_on_frame_recv_callback(callbacks, on_frame_recv_callback);
    nghttp2_session_callbacks_set_on_stream_close_callback(callbacks, on_stream_close_callback);

    nghttp2_session_client_new(&client->session, callbacks, client);

    nghttp2_session_callbacks_del(callbacks);

    // Send connection preface and initial settings
    nghttp2_settings_entry iv[2] = {
        {NGHTTP2_SETTINGS_INITIAL_WINDOW_SIZE, 15 * 1024 * 1024},
        {NGHTTP2_SETTINGS_MAX_FRAME_SIZE, 1 << 20}};
    int submit_settings_result = nghttp2_submit_settings(client->session, NGHTTP2_FLAG_NONE, iv, 2);
    if (submit_settings_result < 0) {
      LOG(FATAL) << "nghttp2_submit_settings() failed: " << nghttp2_strerror(submit_settings_result);
    }

    nghttp2_session_set_local_window_size(client->session, NGHTTP2_FLAG_NONE, 0, 15 * 1024 * 1024);

    event_base_loopexit(client->evbase, NULL);

    return;
  }

  if (events & (BEV_EVENT_EOF | BEV_EVENT_ERROR)) {
    LOG(FATAL) << "Connection closed or error.";
  }
}

static void BM_HTTP2Client(benchmark::State& state) {
  const int payload_size = state.range(0);

  payload = std::string(payload_size, 'A');

  ClientSession client = {};
  client.requests_completed = 0;
  client.total_requests_submitted = 0;

  struct event_base* base = event_base_new();
  client.evbase = base;

  struct sockaddr_in sin;
  memset(&sin, 0, sizeof(sin));

  const char* host = absl::GetFlag(FLAGS_host).c_str();
  int port = absl::GetFlag(FLAGS_port);

  sin.sin_family = AF_INET;
  sin.sin_addr.s_addr = inet_addr(host);
  sin.sin_port = htons(port);

  struct bufferevent* bev = bufferevent_socket_new(base, -1, BEV_OPT_CLOSE_ON_FREE);
  client.bev = bev;

  bufferevent_enable(bev, EV_READ | EV_WRITE);
  bufferevent_setcb(bev, readcb, NULL, eventcb, &client);

  if (bufferevent_socket_connect(bev, (struct sockaddr*)&sin, sizeof(sin)) < 0) {
    LOG(FATAL) << "Connect failed";
  }

  event_base_dispatch(base);

  for (auto _ : state) {
    submit_request(&client);
    event_base_dispatch(base);
  }

  if (!client.latencies.empty()) {
    std::sort(client.latencies.begin(), client.latencies.end());

    state.counters["p10_latency_ms"] = client.latencies[client.latencies.size() * 0.10];
    state.counters["p50_latency_ms"] = client.latencies[client.latencies.size() * 0.50];
    state.counters["p90_latency_ms"] = client.latencies[client.latencies.size() * 0.90];
    state.counters["p99_latency_ms"] = client.latencies[client.latencies.size() * 0.99];

    // Calculates QPS.
    state.SetItemsProcessed(client.latencies.size());
  }

  if (client.session) nghttp2_session_del(client.session);

  bufferevent_free(bev);
  event_base_free(base);
}

BENCHMARK(BM_HTTP2Client)
    ->Args({0})
    ->Args({1 << 10})
    ->Args({2 << 10})
    ->Args({4 << 10})
    ->Args({8 << 10})
    ->Args({16 << 10})
    ->Args({32 << 10})
    ->Args({64 << 10})
    ->Args({128 << 10});

int main(int argc, char** argv) {
  benchmark::MaybeReenterWithoutASLR(argc, argv);
  benchmark::Initialize(&argc, argv);

  absl::ParseCommandLine(argc, argv);
  absl::InitializeLog();

  benchmark::RunSpecifiedBenchmarks();

  benchmark::Shutdown();

  return 0;
}
