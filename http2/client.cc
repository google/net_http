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

ABSL_FLAG(std::string, host, "127.0.0.1", "Server host to connect to");
ABSL_FLAG(int, port, 8080, "Server port to connect to");
ABSL_FLAG(int, num_requests, 5000, "Total number of requests to send");
ABSL_FLAG(int, payload_size, 1024 * 1024, "Size of the request payload in bytes");
ABSL_FLAG(int, report_interval, 1000, "Frequency of progress reports");
ABSL_FLAG(int, concurrent_requests, 100, "Number of concurrent requests");

#define MAKE_NV(name, value)                                            \
  {                                                                     \
      (uint8_t*)(name), (uint8_t*)(value), strlen(name), strlen(value), \
      NGHTTP2_NV_FLAG_NONE}

std::string request_payload_data;

struct ClientSession {
  struct bufferevent* bev;
  nghttp2_session* session;
  struct event_base* evbase;
  int requests_completed;
  int requests_in_flight;
  int total_requests_submitted;
  struct timeval start_time;
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
  struct ClientSession* client = (struct ClientSession*)user_data;

  VLOG(2) << "Client received frame type " << static_cast<int>(frame->hd.type) << " on stream " << frame->hd.stream_id;

  if (frame->hd.type == NGHTTP2_DATA && (frame->hd.flags & NGHTTP2_FLAG_END_STREAM)) {
    client->requests_completed++;
    client->requests_in_flight--;

    int report_interval = absl::GetFlag(FLAGS_report_interval);
    if (report_interval > 0 && client->requests_completed % report_interval == 0) {
      struct timeval now;
      gettimeofday(&now, NULL);
      double elapsed = (now.tv_sec - client->start_time.tv_sec) +
                       (now.tv_usec - client->start_time.tv_usec) / 1000000.0;
      LOG(INFO) << "Completed " << client->requests_completed << " requests. RPS: "
                << client->requests_completed / elapsed;
    }

    auto it = client->request_start_times.find(frame->hd.stream_id);
    if (it != client->request_start_times.end()) {
      auto end_time = std::chrono::steady_clock::now();
      double duration = std::chrono::duration<double, std::milli>(end_time - it->second).count();
      client->latencies.push_back(duration);
      client->request_start_times.erase(it);
    }

    if (client->requests_completed < absl::GetFlag(FLAGS_num_requests)) {  // Limit total requests for bench
      submit_request(client);
    } else if (client->requests_in_flight == 0) {
      event_base_loopexit(client->evbase, NULL);
    }
  } else if (frame->hd.type == NGHTTP2_HEADERS && (frame->hd.flags & NGHTTP2_FLAG_END_STREAM)) {
    // If server sent end stream on headers (e.g., error without body)
    LOG(INFO) << "Client received END_STREAM on headers";
  }
  return 0;
}

static ssize_t data_provider_callback(nghttp2_session* session, int32_t stream_id, uint8_t* buf, size_t length, uint32_t* data_flags, nghttp2_data_source* source, void* user_data) {
  int* bytes_sent = (int*)source->ptr;
  size_t payload_len = request_payload_data.length();

  if (*bytes_sent >= payload_len) {
    *data_flags |= NGHTTP2_DATA_FLAG_EOF;
    return 0;
  }

  size_t remaining = payload_len - *bytes_sent;
  size_t send_len = remaining < length ? remaining : length;
  memcpy(buf, request_payload_data.data() + *bytes_sent, send_len);

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

  int32_t stream_id = nghttp2_submit_request(client->session, NULL, hdrs, 4, &data_prd, bytes_sent);
  if (stream_id < 0) {
    LOG(ERROR) << "nghttp2_submit_request error";
    delete bytes_sent;
  } else {
    client->requests_in_flight++;
    client->total_requests_submitted++;
    client->request_start_times[stream_id] = std::chrono::steady_clock::now();
  }
  nghttp2_session_send(client->session);
}

static void setup_nghttp2_callbacks(nghttp2_session_callbacks* callbacks) {
  nghttp2_session_callbacks_set_send_callback(callbacks, send_callback);
  nghttp2_session_callbacks_set_on_frame_recv_callback(callbacks, on_frame_recv_callback);
  nghttp2_session_callbacks_set_on_stream_close_callback(callbacks, on_stream_close_callback);
}

static void readcb(struct bufferevent* bev, void* ptr) {
  struct ClientSession* client = (struct ClientSession*)ptr;

  struct evbuffer* input = bufferevent_get_input(bev);
  size_t datalen = evbuffer_get_length(input);
  VLOG(2) << "Client readcb: got " << datalen << " bytes";

  if (datalen == 0) return;

  unsigned char* data = evbuffer_pullup(input, -1);
  ssize_t readlen = nghttp2_session_mem_recv(client->session, data, datalen);
  if (readlen < 0) {
    LOG(ERROR) << "Client: nghttp2_session_mem_recv error: " << nghttp2_strerror(static_cast<int>(readlen));
    return;
  }

  VLOG(2) << "Client readcb: consumed " << readlen << " bytes";

  evbuffer_drain(input, readlen);
  nghttp2_session_send(client->session);
}

static void eventcb(struct bufferevent* bev, short events, void* ptr) {
  struct ClientSession* client = (struct ClientSession*)ptr;

  if (events & BEV_EVENT_CONNECTED) {
    LOG(INFO) << "Connected to server.";

    nghttp2_session_callbacks* callbacks;
    nghttp2_session_callbacks_new(&callbacks);
    setup_nghttp2_callbacks(callbacks);

    nghttp2_session_client_new(&client->session, callbacks, client);

    nghttp2_session_callbacks_del(callbacks);

    // Send connection preface and initial settings
    nghttp2_settings_entry iv[2] = {
        {NGHTTP2_SETTINGS_MAX_CONCURRENT_STREAMS, static_cast<uint32_t>(absl::GetFlag(FLAGS_concurrent_requests))},
        {NGHTTP2_SETTINGS_INITIAL_WINDOW_SIZE, 128 * 1024 * 1024}};
    nghttp2_submit_settings(client->session, NGHTTP2_FLAG_NONE, iv, 2);
    nghttp2_submit_window_update(client->session, NGHTTP2_FLAG_NONE, 0, 128 * 1024 * 1024);

    gettimeofday(&client->start_time, NULL);

    for (int i = 0; i < absl::GetFlag(FLAGS_concurrent_requests); i++) {
      submit_request(client);
    }

    return;
  }

  if (events & (BEV_EVENT_EOF | BEV_EVENT_ERROR)) {
    LOG(INFO) << "Connection closed or error.";
    event_base_loopexit(client->evbase, NULL);
  }
}

int main(int argc, char** argv) {
  absl::ParseCommandLine(argc, argv);

  absl::InitializeLog();

  request_payload_data = std::string(absl::GetFlag(FLAGS_payload_size), 'A');

  LOG(INFO) << "Starting HTTP/2 benchmark client...";

  ClientSession client = {};
  client.requests_completed = 0;
  client.requests_in_flight = 0;
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

  bufferevent_setcb(bev, readcb, NULL, eventcb, &client);
  bufferevent_enable(bev, EV_READ | EV_WRITE);

  if (bufferevent_socket_connect(bev, (struct sockaddr*)&sin, sizeof(sin)) < 0) {
    LOG(ERROR) << "Connect failed";
    return 1;
  }

  event_base_dispatch(base);

  struct timeval end_time;
  gettimeofday(&end_time, NULL);
  double total_elapsed = (end_time.tv_sec - client.start_time.tv_sec) +
                         (end_time.tv_usec - client.start_time.tv_usec) / 1000000.0;

  LOG(INFO) << "Finished benchmark.";
  LOG(INFO) << "Total RPS: " << client.requests_completed / total_elapsed;

  if (!client.latencies.empty()) {
    double sum = std::accumulate(client.latencies.begin(), client.latencies.end(), 0.0);
    double avg = sum / client.latencies.size();

    double sq_sum = std::inner_product(client.latencies.begin(), client.latencies.end(), client.latencies.begin(), 0.0);
    double stdev = std::sqrt(sq_sum / client.latencies.size() - avg * avg);

    LOG(INFO) << "Latency Stats (ms):";
    LOG(INFO) << "  Average: " << avg;
    LOG(INFO) << "  StdDev:  " << stdev;
    LOG(INFO) << "  Min:     " << *std::min_element(client.latencies.begin(), client.latencies.end());
    LOG(INFO) << "  Max:     " << *std::max_element(client.latencies.begin(), client.latencies.end());
    LOG(INFO) << "  Samples: " << client.latencies.size();
  }

  if (client.session) nghttp2_session_del(client.session);
  bufferevent_free(bev);
  event_base_free(base);

  return 0;
}
