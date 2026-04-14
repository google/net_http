#include <arpa/inet.h>
#include <event2/bufferevent.h>
#include <event2/event.h>
#include <netinet/in.h>
#include <netinet/tcp.h>
#include <sys/socket.h>

#include <algorithm>
#include <chrono>
#include <cmath>
#include <cstring>
#include <string>
#include <thread>
#include <vector>

#include "../src/wish_handler.h"
#include "absl/flags/flag.h"
#include "absl/flags/parse.h"
#include "absl/log/initialize.h"
#include "absl/log/log.h"
#include "benchmark/benchmark.h"

ABSL_FLAG(std::string, host, "127.0.0.1", "Server host to connect to");
ABSL_FLAG(int, port, 8080, "Server port to connect to");

namespace {

double PercentileFromSorted(const std::vector<double>& values, double p) {
  if (values.empty()) {
    return 0.0;
  }
  const size_t idx = static_cast<size_t>(p * (values.size() - 1));
  return values[idx];
}

struct ClientState {
  struct event_base* base = nullptr;
  struct bufferevent* bev = nullptr;
  WishHandler* handler = nullptr;

  bool connected = false;
  bool awaiting_response = false;
  std::chrono::steady_clock::time_point request_start;
  std::vector<double> latencies_us;
};

bool InitConnection(ClientState* client) {
  client->base = event_base_new();
  if (!client->base) {
    LOG(ERROR) << "event_base_new() failed";
    return false;
  }

  struct sockaddr_in sin;
  std::memset(&sin, 0, sizeof(sin));
  sin.sin_family = AF_INET;
  sin.sin_port = htons(absl::GetFlag(FLAGS_port));

  const std::string host = absl::GetFlag(FLAGS_host);

  if (inet_pton(AF_INET, host.c_str(), &sin.sin_addr) != 1) {
    LOG(ERROR) << "Invalid IPv4 host: " << host;
    return false;
  }

  client->bev = bufferevent_socket_new(client->base, -1, BEV_OPT_CLOSE_ON_FREE);
  if (!client->bev) {
    LOG(ERROR) << "bufferevent_socket_new() failed";
    return false;
  }

  if (bufferevent_socket_connect(client->bev,
                                 reinterpret_cast<struct sockaddr*>(&sin),
                                 sizeof(sin)) < 0) {
    LOG(ERROR) << "bufferevent_socket_connect() failed";
    return false;
  }

  client->handler = new WishHandler(client->bev, false);
  client->handler->SetOnOpen([client]() {
    const int fd = bufferevent_getfd(client->bev);
    if (fd >= 0) {
      int nodelay = 1;
      setsockopt(fd, IPPROTO_TCP, TCP_NODELAY, &nodelay, sizeof(nodelay));
    }

    client->connected = true;
    event_base_loopexit(client->base, nullptr);
  });

  client->handler->SetOnMessage([client](uint8_t opcode, const std::string& msg) {
    (void)opcode;
    (void)msg;

    if (!client->awaiting_response) {
      return;
    }

    const auto end = std::chrono::steady_clock::now();
    const double latency_us =
        std::chrono::duration<double, std::micro>(end - client->request_start)
            .count();
    client->latencies_us.push_back(latency_us);
    client->awaiting_response = false;
    event_base_loopexit(client->base, nullptr);
  });

  client->handler->Start();

  event_base_dispatch(client->base);
  return client->connected;
}

void CleanupConnection(ClientState* client) {
  if (client->handler) {
    delete client->handler;
    client->handler = nullptr;
    client->bev = nullptr;
  }

  if (client->base) {
    event_base_free(client->base);
    client->base = nullptr;
  }
}

// Benchmark WiSH throughput under a fixed target QPS.
//
// WiSH uses a single-threaded libevent loop (sequential request/response), so
// concurrency is always 1 and QPS is controlled solely by an inter-request
// sleep interval.  A warmup phase calibrates that interval before measurement.
static void BM_WiSHClientHighQPS(benchmark::State& state) {
  LOG(INFO) << "Starting QPS benchmark iteration with payload_size="
            << state.range(0) << " bytes, target_qps=" << state.range(1);

  const int payload_size = static_cast<int>(state.range(0));
  const double target_qps = static_cast<double>(state.range(1));
  const std::string payload(payload_size, 'A');

  ClientState client;
  if (!InitConnection(&client)) {
    state.SkipWithError("Failed to establish WiSH connection");
    CleanupConnection(&client);
    return;
  }

  // Warmup: calibrate inter-request sleep to hit target_qps.
  constexpr int kWindowMs = 2000;
  constexpr int kMaxWindows = 100;

  constexpr double kStableBand = 0.05;
  constexpr int kStableNeeded = 3;
  int near_target_count = 0;

  constexpr int kPlateauLimit = 10;
  constexpr double kPlateauBand = 0.01;
  int plateau_count = 0;

  double inter_request_us = 0.0;
  double prev_qps = 0.0;
  bool error = false;

  for (int w = 0;
       !error &&
       w < kMaxWindows &&
       near_target_count < kStableNeeded && plateau_count < kPlateauLimit;
       ++w) {
    int count = 0;
    client.latencies_us.clear();
    auto window_start = std::chrono::steady_clock::now();
    auto window_end = window_start + std::chrono::milliseconds(kWindowMs);

    while (std::chrono::steady_clock::now() < window_end) {
      if (inter_request_us > 0.0) {
        std::this_thread::sleep_for(
            std::chrono::microseconds(static_cast<int64_t>(inter_request_us)));
      }
      client.awaiting_response = true;
      client.request_start = std::chrono::steady_clock::now();
      if (client.handler->SendBinary(payload) != 0) {
        error = true;
        break;
      }
      event_base_dispatch(client.base);
      if (client.awaiting_response) {
        error = true;
        break;
      }
      ++count;
    }
    if (error) break;

    const double elapsed_s =
        std::chrono::duration<double>(
            std::chrono::steady_clock::now() - window_start)
            .count();
    const double measured_qps = (elapsed_s > 0.0) ? count / elapsed_s : 0.0;
    VLOG(2) << "[warmup] QPS: " << static_cast<int>(measured_qps)
            << " / target: " << static_cast<int>(target_qps);

    if (measured_qps > 0.0) {
      const double delta_us = (1.0 / target_qps - 1.0 / measured_qps) * 1e6;
      inter_request_us = std::max(0.0, inter_request_us + delta_us);
    }

    const bool near_target =
        std::abs(measured_qps - target_qps) / target_qps < kStableBand;
    const bool plateau =
        prev_qps > 0.0 &&
        std::abs(measured_qps - prev_qps) / prev_qps < kPlateauBand;

    if (near_target) {
      ++near_target_count;
    } else {
      near_target_count = 0;
    }

    if (plateau) {
      ++plateau_count;
    } else {
      plateau_count = 0;
    }

    VLOG(2) << "[warmup] near_target_count=" << near_target_count
            << " plateau_count=" << plateau_count;
    prev_qps = measured_qps;
  }

  if (error) {
    state.SkipWithError("WiSH connection error during warmup");
    CleanupConnection(&client);
    return;
  }

  LOG(INFO) << "Warmup complete: inter_request_us=" << inter_request_us;

  // Reset accumulated latencies before measurement.
  client.latencies_us.clear();

  std::vector<double> recorded;
  const auto measure_start = std::chrono::steady_clock::now();

  for (auto _ : state) {
    if (inter_request_us > 0.0) {
      std::this_thread::sleep_for(
          std::chrono::microseconds(static_cast<int64_t>(inter_request_us)));
    }
    client.awaiting_response = true;
    client.request_start = std::chrono::steady_clock::now();
    if (client.handler->SendBinary(payload) != 0) {
      state.SkipWithError("WishHandler::SendBinary failed");
      break;
    }
    event_base_dispatch(client.base);
    if (client.awaiting_response) {
      state.SkipWithError("Connection closed before response");
      break;
    }
    const double lat = client.latencies_us.back();
    recorded.push_back(lat);
    state.SetIterationTime(lat / 1e6);
  }

  const auto measure_end = std::chrono::steady_clock::now();
  const double wall_seconds =
      std::chrono::duration<double>(measure_end - measure_start).count();

  if (!recorded.empty()) {
    std::sort(recorded.begin(), recorded.end());
    state.counters["p10_us"] = PercentileFromSorted(recorded, 0.10);
    state.counters["p50_us"] = PercentileFromSorted(recorded, 0.50);
    state.counters["p90_us"] = PercentileFromSorted(recorded, 0.90);
    state.counters["p99_us"] = PercentileFromSorted(recorded, 0.99);
    state.counters["target_qps"] = target_qps;
    state.counters["actual_qps"] =
        static_cast<double>(recorded.size()) / wall_seconds;
    state.SetItemsProcessed(static_cast<int64_t>(recorded.size()));
  }

  CleanupConnection(&client);
}

// Iterations are scaled per QPS level to target ~5 s of measurement.
// Separate registrations are required because Iterations() is a global setting
// per registration and cannot vary per-args in a single ArgsProduct call.
BENCHMARK(BM_WiSHClientHighQPS)->UseManualTime()->Unit(benchmark::kMicrosecond)->Args({1 << 10, 100})->Iterations(500);
BENCHMARK(BM_WiSHClientHighQPS)->UseManualTime()->Unit(benchmark::kMicrosecond)->Args({1 << 10, 1'000})->Iterations(5000);
BENCHMARK(BM_WiSHClientHighQPS)->UseManualTime()->Unit(benchmark::kMicrosecond)->Args({1 << 10, 1'800})->Iterations(8000);
BENCHMARK(BM_WiSHClientHighQPS)->UseManualTime()->Unit(benchmark::kMicrosecond)->Args({1 << 10, 10'000})->Iterations(50000);

}  // namespace

int main(int argc, char** argv) {
  benchmark::MaybeReenterWithoutASLR(argc, argv);
  benchmark::Initialize(&argc, argv);

  absl::ParseCommandLine(argc, argv);
  absl::InitializeLog();

  benchmark::RunSpecifiedBenchmarks();
  benchmark::Shutdown();

  return 0;
}
