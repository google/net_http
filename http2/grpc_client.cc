#include <grpcpp/grpcpp.h>

#include <algorithm>
#include <chrono>
#include <cmath>
#include <iostream>
#include <map>
#include <memory>
#include <numeric>
#include <string>
#include <vector>

#include "absl/flags/flag.h"
#include "absl/flags/parse.h"
#include "absl/log/initialize.h"
#include "absl/log/log.h"
#include "echo.grpc.pb.h"

ABSL_FLAG(std::string, host, "127.0.0.1", "Server host");
ABSL_FLAG(int, port, 50051, "Server port");
ABSL_FLAG(int, num_requests, 5000, "Total number of requests to complete");
ABSL_FLAG(int, payload_size, 1024 * 1024, "Size of the request payload in bytes");
ABSL_FLAG(int, report_interval, 1000, "Frequency of progress reports");
ABSL_FLAG(int, concurrent_requests, 100, "Number of concurrent requests");

using echo::EchoRequest;
using echo::EchoResponse;
using echo::EchoServer;
using grpc::Channel;
using grpc::ClientAsyncResponseReader;
using grpc::ClientContext;
using grpc::CompletionQueue;
using grpc::Status;

std::string request_payload_data;

struct AsyncClientCall {
  EchoResponse reply;
  ClientContext context;
  Status status;
  std::unique_ptr<ClientAsyncResponseReader<EchoResponse>> response_reader;
  std::chrono::steady_clock::time_point start_time;
};

class GrpcBenchClient {
 public:
  explicit GrpcBenchClient(std::shared_ptr<Channel> channel)
      : stub_(EchoServer::NewStub(channel)) {}

  void Run(int concurrency, int total_requests) {
    int requests_submitted = 0;
    int requests_completed = 0;
    std::vector<double> latencies;
    auto start_bench = std::chrono::steady_clock::now();

    // Warm up/Seed concurrency
    for (int i = 0; i < concurrency && requests_submitted < total_requests; i++) {
      AsyncEcho(requests_submitted++);
    }

    void* got_tag;
    bool ok = false;
    while (cq_.Next(&got_tag, &ok)) {
      AsyncClientCall* call = static_cast<AsyncClientCall*>(got_tag);
      requests_completed++;

      if (ok && call->status.ok()) {
        auto end_time = std::chrono::steady_clock::now();
        double duration = std::chrono::duration<double, std::milli>(end_time - call->start_time).count();
        latencies.push_back(duration);
      } else {
        LOG(ERROR) << "RPC failed";
      }

      int report_interval = absl::GetFlag(FLAGS_report_interval);
      if (report_interval > 0 && requests_completed % report_interval == 0) {
        auto now = std::chrono::steady_clock::now();
        double elapsed = std::chrono::duration<double>(now - start_bench).count();
        LOG(INFO) << "Completed " << requests_completed << " requests. RPS: " << requests_completed / elapsed;
      }

      delete call;

      if (requests_submitted < total_requests) {
        AsyncEcho(requests_submitted++);
      } else if (requests_completed == total_requests) {
        break;
      }
    }

    auto end_bench = std::chrono::steady_clock::now();
    double total_elapsed = std::chrono::duration<double>(end_bench - start_bench).count();

    LOG(INFO) << "Finished benchmark.";
    LOG(INFO) << "Total RPS: " << requests_completed / total_elapsed;

    if (!latencies.empty()) {
      double sum = std::accumulate(latencies.begin(), latencies.end(), 0.0);
      double avg = sum / latencies.size();
      double sq_sum = std::inner_product(latencies.begin(), latencies.end(), latencies.begin(), 0.0);
      double stdev = std::sqrt(sq_sum / latencies.size() - avg * avg);

      LOG(INFO) << "Latency Stats (ms):";
      LOG(INFO) << "  Average: " << avg;
      LOG(INFO) << "  StdDev:  " << stdev;
      LOG(INFO) << "  Min:     " << *std::min_element(latencies.begin(), latencies.end());
      LOG(INFO) << "  Max:     " << *std::max_element(latencies.begin(), latencies.end());
      LOG(INFO) << "  Samples: " << latencies.size();
    }
  }

 private:
  void AsyncEcho(int id) {
    AsyncClientCall* call = new AsyncClientCall;
    call->start_time = std::chrono::steady_clock::now();

    EchoRequest request;
    request.set_data(request_payload_data);

    call->response_reader = stub_->PrepareAsyncEcho(&call->context, request, &cq_);
    call->response_reader->StartCall();
    call->response_reader->Finish(&call->reply, &call->status, (void*)call);
  }

  std::unique_ptr<EchoServer::Stub> stub_;
  CompletionQueue cq_;
};

int main(int argc, char** argv) {
  absl::ParseCommandLine(argc, argv);
  absl::InitializeLog();

  std::string target = absl::GetFlag(FLAGS_host) + ":" + std::to_string(absl::GetFlag(FLAGS_port));
  GrpcBenchClient client(grpc::CreateChannel(target, grpc::InsecureChannelCredentials()));

  request_payload_data = std::string(absl::GetFlag(FLAGS_payload_size), 'A');

  LOG(INFO) << "Starting gRPC benchmark client connecting to " << target;
  client.Run(absl::GetFlag(FLAGS_concurrent_requests), absl::GetFlag(FLAGS_num_requests));

  return 0;
}
