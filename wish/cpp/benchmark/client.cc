#include <arpa/inet.h>
#include <event2/bufferevent.h>
#include <event2/event.h>
#include <netdb.h>
#include <netinet/in.h>
#include <netinet/tcp.h>
#include <sys/socket.h>

#include <algorithm>
#include <chrono>
#include <cstring>
#include <string>
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

struct ClientState {
  struct event_base* base = nullptr;
  struct bufferevent* bev = nullptr;
  WishHandler* handler = nullptr;

  bool connected = false;
  bool awaiting_response = false;
  std::chrono::steady_clock::time_point request_start;
  std::vector<double> latencies_us;
};

double PercentileFromSorted(const std::vector<double>& values, double p) {
  if (values.empty()) {
    return 0.0;
  }
  const size_t idx = static_cast<size_t>(p * (values.size() - 1));
  return values[idx];
}

bool InitConnection(ClientState* client) {
  client->base = event_base_new();
  if (!client->base) {
    LOG(ERROR) << "event_base_new() failed";
    return false;
  }

  const std::string host = absl::GetFlag(FLAGS_host);
  const std::string port_str = std::to_string(absl::GetFlag(FLAGS_port));

  struct addrinfo hints{};
  hints.ai_family = AF_UNSPEC;
  hints.ai_socktype = SOCK_STREAM;
  struct addrinfo* res = nullptr;
  const int gai_err = getaddrinfo(host.c_str(), port_str.c_str(), &hints, &res);
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

static void BM_WiSHClient(benchmark::State& state) {
  const int payload_size = static_cast<int>(state.range(0));
  const std::string payload(payload_size, 'A');

  ClientState client;
  if (!InitConnection(&client)) {
    state.SkipWithError("Failed to establish WiSH connection");
    CleanupConnection(&client);
    return;
  }

  for (auto _ : state) {
    (void)_;
    client.awaiting_response = true;
    client.request_start = std::chrono::steady_clock::now();

    const int send_result = client.handler->SendBinary(payload);
    if (send_result != 0) {
      state.SkipWithError("WishHandler::SendBinary failed");
      break;
    }

    event_base_dispatch(client.base);
    if (client.awaiting_response) {
      state.SkipWithError("Connection closed before response");
      break;
    }
  }

  if (!client.latencies_us.empty()) {
    std::sort(client.latencies_us.begin(), client.latencies_us.end());

    state.counters["p10_latency_us"] =
        PercentileFromSorted(client.latencies_us, 0.10);
    state.counters["p50_latency_us"] =
        PercentileFromSorted(client.latencies_us, 0.50);
    state.counters["p90_latency_us"] =
        PercentileFromSorted(client.latencies_us, 0.90);
    state.counters["p99_latency_us"] =
        PercentileFromSorted(client.latencies_us, 0.99);

    state.SetItemsProcessed(client.latencies_us.size());
  }

  CleanupConnection(&client);
}

BENCHMARK(BM_WiSHClient)
    ->UseRealTime()
    ->Unit(benchmark::kMicrosecond)
    ->Args({0})
    ->RangeMultiplier(2)
    ->Range(1 << 10, 128 << 10);

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
