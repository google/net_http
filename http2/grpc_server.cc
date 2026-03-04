#include <iostream>
#include <memory>
#include <string>

#include <grpcpp/grpcpp.h>
#include "echo.grpc.pb.h"

#include "absl/flags/flag.h"
#include "absl/flags/parse.h"
#include "absl/log/initialize.h"
#include "absl/log/log.h"

ABSL_FLAG(int, port, 50051, "Port to listen on");

using grpc::Server;
using grpc::ServerBuilder;
using grpc::ServerContext;
using grpc::Status;
using echo::EchoRequest;
using echo::EchoResponse;
using echo::EchoServer;

class EchoServiceImpl final : public EchoServer::Service {
  Status Echo(ServerContext* context, const EchoRequest* request,
              EchoResponse* response) override {
    response->set_data(request->data());
    return Status::OK;
  }
};

void RunServer(int port) {
  std::string server_address("0.0.0.0:" + std::to_string(port));
  EchoServiceImpl service;

  ServerBuilder builder;
  builder.AddListeningPort(server_address, grpc::InsecureServerCredentials());
  builder.RegisterService(&service);
  std::unique_ptr<Server> server(builder.BuildAndStart());
  LOG(INFO) << "gRPC Echo Server listening on " << server_address;
  server->Wait();
}

int main(int argc, char** argv) {
  absl::ParseCommandLine(argc, argv);
  absl::InitializeLog();

  RunServer(absl::GetFlag(FLAGS_port));

  return 0;
}
