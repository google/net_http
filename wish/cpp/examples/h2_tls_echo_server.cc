#include <absl/flags/flag.h>
#include <absl/flags/parse.h>
#include <absl/log/initialize.h>
#include <absl/log/log.h>

#include "../src/h2_tls_server.h"
#include "../src/wish_handler.h"

ABSL_FLAG(int, port, 8080, "Port to listen on");
ABSL_FLAG(std::string, ca_cert, "certs/ca.crt", "Path to CA certificate file");
ABSL_FLAG(std::string, server_cert, "certs/server.crt",
          "Path to server certificate file");
ABSL_FLAG(std::string, server_key, "certs/server.key",
          "Path to server private key file");

int main(int argc, char** argv) {
  absl::ParseCommandLine(argc, argv);
  absl::InitializeLog();

  const int port = absl::GetFlag(FLAGS_port);
  const std::string ca_cert = absl::GetFlag(FLAGS_ca_cert);
  const std::string server_cert = absl::GetFlag(FLAGS_server_cert);
  const std::string server_key = absl::GetFlag(FLAGS_server_key);

  H2TlsServer server(ca_cert, server_cert, server_key, port);

  if (!server.Init()) {
    LOG(ERROR) << "Failed to initialize H2TlsServer";
    return 1;
  }

  server.SetOnStream([](H2WishStream* stream) {
    LOG(INFO) << "New TLS WiSH stream (stream_id=" << stream->stream_id()
              << ")";

    stream->SetOnMessage([stream](uint8_t opcode, const std::string& msg) {
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
      LOG(INFO) << "Received [" << type << "]: " << msg;

      if (opcode == WEB_STREAM_OPCODE_TEXT) {
        stream->SendText(msg);
      } else if (opcode == WEB_STREAM_OPCODE_BINARY) {
        stream->SendBinary(msg);
      } else if (opcode == WEB_STREAM_OPCODE_METADATA) {
        stream->SendMetadata(msg);
      } else {
        LOG(WARNING) << "Unknown opcode, cannot echo.";
      }
    });

    stream->SetOnClose([]() { LOG(INFO) << "TLS WiSH stream closed."; });
  });

  server.Run();
  return 0;
}
