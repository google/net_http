#include <absl/flags/flag.h>
#include <absl/flags/parse.h>
#include <absl/log/initialize.h>
#include <absl/log/log.h>

#include <string>

#include "../src/tls_client.h"
#include "../src/wish_opcodes.h"

ABSL_FLAG(std::string, host, "127.0.0.1", "Server host address");
ABSL_FLAG(int, port, 8080, "Server port");

ABSL_FLAG(std::string,
          ca_cert,
          "certs/ca.crt",
          "Path to CA certificate file");
ABSL_FLAG(std::string,
          client_cert,
          "certs/client.crt",
          "Path to client certificate file");
ABSL_FLAG(std::string,
          client_key,
          "certs/client.key",
          "Path to client private key file");

int main(int argc, char** argv) {
  absl::ParseCommandLine(argc, argv);
  absl::InitializeLog();

  const std::string host = absl::GetFlag(FLAGS_host);
  const int port = absl::GetFlag(FLAGS_port);

  const std::string ca_cert = absl::GetFlag(FLAGS_ca_cert);
  const std::string client_cert = absl::GetFlag(FLAGS_client_cert);
  const std::string client_key = absl::GetFlag(FLAGS_client_key);

  TlsClient client(host,
                   port,
                   ca_cert,
                   client_cert,
                   client_key);

  if (!client.Init()) {
    LOG(INFO) << "Init() failed";

    return 1;
  }

  client.SetOnOpen([](WebStream* stream) {
    LOG(INFO) << "OnOpen";

    stream->SetOnMessage([](uint8_t opcode, const std::string& msg) {
      std::string type;
      switch (opcode) {
        case WEB_STREAM_OPCODE_TEXT:
          type = "TEXT";
          break;
        case WEB_STREAM_OPCODE_BINARY:
          type = "BINARY";
          break;
        case WEB_STREAM_OPCODE_METADATA:
          type = "METADATA";
          break;
        default:
          type = "UNKNOWN(" + std::to_string(opcode) + ")";
          break;
      }

      LOG(INFO) << "OnMessage (opcode: " << type << ", message: " << msg << ")";
    });

    stream->SetOnClose([]() {
      LOG(INFO) << "OnClose";
    });

    stream->SendText("Hello web-stream text!");
    stream->SendBinary("Hello web-stream binary!");
    stream->SendMetadata("Hello web-stream metadata!");
    stream->Close();
  });

  client.Run();

  return 0;
}
