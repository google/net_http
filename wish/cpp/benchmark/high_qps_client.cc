#include <arpa/inet.h>
#include <event2/bufferevent.h>
#include <event2/event.h>
#include <netdb.h>
#include <netinet/in.h>
#include <netinet/tcp.h>
#include <sys/socket.h>

#include <algorithm>
#include <atomic>
#include <chrono>
#include <cmath>
#include <condition_variable>
#include <cstring>
#include <deque>
#include <mutex>
#include <random>
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
ABSL_FLAG(bool, poisson, false,
          "Model inter-request arrivals as a Poisson process (exponentially "
          "distributed inter-arrival times). Default: uniform spacing.");

namespace {

double PercentileFromSorted(const std::vector<double>& values, double p) {
  if (values.empty()) {
    return 0.0;
  }
  const size_t idx = static_cast<size_t>(p * (values.size() - 1));
  return values[idx];
}

// Centralized token dispenser: issues one token every interval_us microseconds
// on average. Supports uniform (default) and Poisson inter-arrival modes.
// A dedicated issuer thread maintains a wall-clock-anchored schedule.
// Workers call Acquire() before each request. When interval_us == 0,
// Acquire() returns immediately (unlimited mode).
struct TokenDispenser {
  std::mutex mu_;
  std::condition_variable cv_;

  int64_t tokens_ = 0;
  int64_t interval_us_ = 0;

  // Set before the issuer thread is started; read-only afterwards.
  bool poisson_mode_ = false;

  // Used only inside IssuerLoop (single-threaded access; no lock needed).
  std::mt19937_64 rng_{std::random_device{}()};

  void SetInterval(int64_t new_interval_us) {
    {
      std::lock_guard<std::mutex> lk(mu_);
      interval_us_ = new_interval_us;
      if (new_interval_us == 0) tokens_ = 0;
    }
    cv_.notify_all();
  }

  int64_t GetInterval() {
    std::lock_guard<std::mutex> lk(mu_);
    return interval_us_;
  }

  void IssuerLoop(const std::atomic<bool>& stop) {
    std::uniform_real_distribution<double> uniform(0.0, 1.0);
    std::unique_lock<std::mutex> lk(mu_);
    auto next = std::chrono::steady_clock::now();

    while (!stop.load(std::memory_order_relaxed)) {
      if (interval_us_ <= 0) {
        cv_.wait(lk, [&] {
          return stop.load(std::memory_order_relaxed) || interval_us_ > 0;
        });
        next = std::chrono::steady_clock::now();
        continue;
      }

      const int64_t iv = interval_us_;
      const bool woken_early = cv_.wait_until(lk, next, [&] {
        return stop.load(std::memory_order_relaxed) || interval_us_ != iv;
      });

      if (stop.load(std::memory_order_relaxed)) break;

      if (woken_early) {
        next = std::chrono::steady_clock::now();
        continue;
      }

      ++tokens_;
      if (poisson_mode_) {
        // Sample next inter-arrival time from Exponential(1/iv).
        // Use -log(u)*iv where u ~ Uniform(0,1); clamp u away from 0 to
        // avoid infinite intervals.
        double u = uniform(rng_);
        if (u < std::numeric_limits<double>::min())
          u = std::numeric_limits<double>::min();
        next += std::chrono::microseconds(
            static_cast<int64_t>(-std::log(u) * static_cast<double>(iv)));
      } else {
        next += std::chrono::microseconds(iv);
      }
      cv_.notify_one();
    }
  }

  bool Acquire(const std::atomic<bool>& stop) {
    std::unique_lock<std::mutex> lk(mu_);
    if (interval_us_ <= 0) return true;

    cv_.wait(lk, [&] {
      return stop.load(std::memory_order_relaxed) ||
             interval_us_ <= 0 || tokens_ > 0;
    });

    if (stop.load(std::memory_order_relaxed)) return false;
    if (interval_us_ <= 0) return true;

    --tokens_;
    return true;
  }
};

// State shared by all worker threads.
struct SharedState {
  std::string payload;
  std::atomic<bool> stop{false};
  TokenDispenser dispenser;

  // Completed-RPC counter for QPS measurement.
  std::atomic<int64_t> completed{0};

  // Result queue: workers push latency_us; benchmark loop pops one per iter.
  std::mutex result_mu;
  std::condition_variable result_cv;
  std::deque<double> results;
};

// Per-connection state, owned by each worker thread.
struct ClientState {
  struct event_base* base = nullptr;
  struct bufferevent* bev = nullptr;
  WishHandler* handler = nullptr;

  bool connected = false;
  bool awaiting_response = false;
  std::chrono::steady_clock::time_point request_start;
  double last_latency_us = 0.0;
};

bool InitConnection(ClientState* client) {
  client->base = event_base_new();
  if (!client->base) {
    LOG(ERROR) << "event_base_new() failed";
    return false;
  }

  const std::string host = absl::GetFlag(FLAGS_host);
  const std::string port = std::to_string(absl::GetFlag(FLAGS_port));

  LOG(INFO) << "Target address: " << host << ":" << port;

  struct addrinfo hints{};
  hints.ai_family = AF_UNSPEC;
  hints.ai_socktype = SOCK_STREAM;
  struct addrinfo* res = nullptr;
  const int gai_err = getaddrinfo(host.c_str(), port.c_str(), &hints, &res);
  if (gai_err != 0) {
    LOG(ERROR) << "getaddrinfo failed for " << host << ": "
               << gai_strerror(gai_err);
    return false;
  }

  client->bev = bufferevent_socket_new(client->base, -1, BEV_OPT_CLOSE_ON_FREE);
  if (!client->bev) {
    LOG(ERROR) << "bufferevent_socket_new() failed";
    freeaddrinfo(res);
    return false;
  }

  if (bufferevent_socket_connect(client->bev, res->ai_addr,
                                 static_cast<int>(res->ai_addrlen)) < 0) {
    LOG(ERROR) << "bufferevent_socket_connect() failed";
    freeaddrinfo(res);
    return false;
  }
  freeaddrinfo(res);

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
    client->last_latency_us =
        std::chrono::duration<double, std::micro>(end - client->request_start)
            .count();
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

// Each worker thread owns an independent libevent connection and issues
// requests sequentially, gated by the shared TokenDispenser.
void WorkerLoop(SharedState* ss) {
  LOG(INFO) << "Worker thread started";

  ClientState client;
  if (!InitConnection(&client)) {
    LOG(ERROR) << "WorkerLoop: failed to connect, worker exiting";
    return;
  }

  while (!ss->stop.load(std::memory_order_relaxed)) {
    if (!ss->dispenser.Acquire(ss->stop)) break;

    client.awaiting_response = true;
    client.request_start = std::chrono::steady_clock::now();
    if (client.handler->SendBinary(ss->payload) != 0) {
      LOG(ERROR) << "WorkerLoop: SendBinary failed, worker exiting";
      break;
    }

    event_base_dispatch(client.base);
    if (client.awaiting_response) {
      // Response never arrived — connection likely closed.
      break;
    }

    const double lat = client.last_latency_us;
    ss->completed.fetch_add(1, std::memory_order_relaxed);
    {
      std::lock_guard<std::mutex> lk(ss->result_mu);
      ss->results.push_back(lat);
    }
    ss->result_cv.notify_one();
  }

  CleanupConnection(&client);
}

// Measure actual QPS over a window_ms millisecond window.
double MeasureQps(std::atomic<int64_t>& completed, int window_ms) {
  const int64_t before = completed.load(std::memory_order_relaxed);
  const auto t0 = std::chrono::steady_clock::now();

  std::this_thread::sleep_for(std::chrono::milliseconds(window_ms));

  const int64_t after = completed.load(std::memory_order_relaxed);
  const auto t1 = std::chrono::steady_clock::now();

  const double elapsed_s = std::chrono::duration<double>(t1 - t0).count();
  return static_cast<double>(after - before) / elapsed_s;
}

// Benchmark WiSH throughput under a fixed target QPS with multiple workers.
//
// Workers are sequential per-connection libevent loops; N workers run in
// parallel so that aggregate QPS can exceed 1/RTT. The centralized
// TokenDispenser gates all workers, calibrated during warmup.
// With --poisson, inter-arrival times follow an exponential distribution
// (Poisson process), matching typical production traffic patterns.
static void BM_PlainText_HighQPS(benchmark::State& state) {
  const int payload_size = static_cast<int>(state.range(0));
  const double target_qps = static_cast<double>(state.range(1));

  LOG(INFO) << "Starting benchmark";
  LOG(INFO) << "  Payload size: " << payload_size << " bytes";
  LOG(INFO) << "  Target QPS: " << target_qps;
  LOG(INFO) << "  Poisson arrivals: " << (absl::GetFlag(FLAGS_poisson) ? "enabled" : "disabled");

  // Allocate enough workers so no single worker is the bottleneck.
  // 500 QPS/worker is conservative; it provides headroom for RTTs up to 2 ms.
  const int num_workers =
      std::max(1, static_cast<int>(std::ceil(target_qps / 500.0)));

  SharedState ss;
  ss.payload = std::string(payload_size, 'A');
  ss.dispenser.poisson_mode_ = absl::GetFlag(FLAGS_poisson);

  // Spawn the dispenser thread first so it is ready when workers arrive.
  std::thread dispenser_thread([&ss] { ss.dispenser.IssuerLoop(ss.stop); });

  std::vector<std::thread> workers;
  workers.reserve(num_workers);
  for (int i = 0; i < num_workers; ++i) {
    workers.emplace_back(WorkerLoop, &ss);
  }

  // ── Warmup ───────────────────────────────────────────────────────────────

  constexpr int kWindowMs = 2000;
  constexpr int kMaxWindows = 100;

  constexpr double kStableBand = 0.05;
  constexpr int kStableNeeded = 3;
  int near_target_count = 0;

  constexpr int kPlateauLimit = 10;
  constexpr double kPlateauBand = 0.01;
  int plateau_count = 0;

  double prev_qps = 0.0;

  for (int w = 0; w < kMaxWindows &&
                  near_target_count < kStableNeeded && plateau_count < kPlateauLimit;
       ++w) {
    ss.completed.store(0, std::memory_order_relaxed);
    {
      std::lock_guard<std::mutex> lk(ss.result_mu);
      ss.results.clear();
    }

    const double measured = MeasureQps(ss.completed, kWindowMs);
    VLOG(2) << "[warmup] QPS: " << static_cast<int>(measured)
            << " / target: " << static_cast<int>(target_qps);

    // Adjust only the interval knob. Workers are fixed in number; the interval
    // is the sole rate-control lever.
    if (measured > 0.0) {
      const int64_t current_us = ss.dispenser.GetInterval();
      const int64_t new_us = std::max<int64_t>(
          0, current_us + static_cast<int64_t>(
                              (1.0 / target_qps - 1.0 / measured) * 1e6));
      ss.dispenser.SetInterval(new_us);
    }

    const bool near_target =
        std::abs(measured - target_qps) / target_qps < kStableBand;
    const bool plateau =
        prev_qps > 0.0 &&
        std::abs(measured - prev_qps) / prev_qps < kPlateauBand;

    if (near_target)
      ++near_target_count;
    else
      near_target_count = 0;
    if (plateau)
      ++plateau_count;
    else
      plateau_count = 0;

    VLOG(2) << "[warmup] near_target_count=" << near_target_count
            << " plateau_count=" << plateau_count;
    prev_qps = measured;
  }

  LOG(INFO) << "Warmup complete: num_workers=" << num_workers
            << ", interval_us=" << ss.dispenser.GetInterval();

  // Reset before measurement.
  ss.completed.store(0, std::memory_order_relaxed);
  {
    std::lock_guard<std::mutex> lk(ss.result_mu);
    ss.results.clear();
  }

  // ── Measurement loop ─────────────────────────────────────────────────────
  std::vector<double> recorded;
  const auto measure_start = std::chrono::steady_clock::now();

  for (auto _ : state) {
    double latency_us;
    {
      std::unique_lock<std::mutex> lk(ss.result_mu);
      ss.result_cv.wait(lk, [&ss] {
        return ss.stop.load(std::memory_order_relaxed) || !ss.results.empty();
      });
      if (ss.results.empty()) break;
      latency_us = ss.results.front();
      ss.results.pop_front();
    }
    recorded.push_back(latency_us);
    state.SetIterationTime(latency_us / 1e6);
  }

  const auto measure_end = std::chrono::steady_clock::now();
  const double wall_seconds =
      std::chrono::duration<double>(measure_end - measure_start).count();

  // ── Teardown ─────────────────────────────────────────────────────────────
  ss.stop.store(true, std::memory_order_relaxed);
  ss.result_cv.notify_all();
  ss.dispenser.cv_.notify_all();
  dispenser_thread.join();
  for (auto& t : workers) t.join();

  // ── Report counters ───────────────────────────────────────────────────────

  std::sort(recorded.begin(), recorded.end());

  LOG(INFO) << "Result:";
  LOG(INFO) << "  # of workers: " << num_workers;
  LOG(INFO) << "  Measured requests: " << recorded.size();
  LOG(INFO) << "  Measurement duration: " << wall_seconds << " s";
  LOG(INFO) << "  Actual QPS: " << static_cast<double>(recorded.size()) / wall_seconds;
  LOG(INFO) << "  p10 latency: " << PercentileFromSorted(recorded, 0.10) << " us";
  LOG(INFO) << "  p50 latency: " << PercentileFromSorted(recorded, 0.50) << " us";
  LOG(INFO) << "  p90 latency: " << PercentileFromSorted(recorded, 0.90) << " us";
  LOG(INFO) << "  p99 latency: " << PercentileFromSorted(recorded, 0.99) << " us";
}

// Iterations are scaled per QPS level to target ~5 s of measurement.
// Separate registrations are required because Iterations() is a global setting
// per registration and cannot vary per-args in a single ArgsProduct call.
BENCHMARK(BM_PlainText_HighQPS)
    ->UseManualTime()
    ->Unit(benchmark::kMicrosecond)
    ->Args({1 << 10, 100})
    ->Iterations(100 * 10);
BENCHMARK(BM_PlainText_HighQPS)
    ->UseManualTime()
    ->Unit(benchmark::kMicrosecond)
    ->Args({1 << 10, 1'000})
    ->Iterations(1'000 * 10);
BENCHMARK(BM_PlainText_HighQPS)
    ->UseManualTime()
    ->Unit(benchmark::kMicrosecond)
    ->Args({1 << 10, 1'800})
    ->Iterations(800 * 10);
BENCHMARK(BM_PlainText_HighQPS)
    ->UseManualTime()
    ->Unit(benchmark::kMicrosecond)
    ->Args({1 << 10, 10'000})
    ->Iterations(10'000 * 10);

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
