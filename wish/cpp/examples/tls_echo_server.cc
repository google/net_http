#include <string>

#include "../src/tls_server.h"
#include "../src/wish_handler.h"
#include "absl/flags/flag.h"
#include "absl/flags/parse.h"
#include "absl/log/initialize.h"
#include "absl/log/log.h"

ABSL_FLAG(int, port, 8080, "Port to listen on");
ABSL_FLAG(std::string, ca_cert, "certs/ca.crt", "Path to CA certificate file");
ABSL_FLAG(std::string, server_cert, "certs/server.crt", "Path to server certificate file");
ABSL_FLAG(std::string, server_key, "certs/server.key", "Path to server private key file");

int main(int argc, char** argv) {
  absl::ParseCommandLine(argc, argv);
  absl::InitializeLog();

  const int port = absl::GetFlag(FLAGS_port);
  const std::string ca_cert = absl::GetFlag(FLAGS_ca_cert);
  const std::string server_cert = absl::GetFlag(FLAGS_server_cert);
  const std::string server_key = absl::GetFlag(FLAGS_server_key);

  TlsServer server(ca_cert, server_cert, server_key, port);

  if (!server.Init()) {
    LOG(ERROR) << "Failed to initialize server";
    return 1;
  }

  server.SetOnConnection([](struct bufferevent* bev) {
    LOG(INFO) << "Client connected.";

    WishHandler* handler = new WishHandler(bev, true);

    handler->SetOnMessage([handler](uint8_t opcode, const std::string& msg) {
      std::string type;
      switch (opcode) {
        case WISH_OPCODE_TEXT:
          type = "TEXT";
          break;
        case WISH_OPCODE_BINARY:
          type = "BINARY";
          break;
        case WISH_OPCODE_TEXT_METADATA:
          type = "TEXT_METADATA";
          break;
        case WISH_OPCODE_BINARY_METADATA:
          type = "BINARY_METADATA";
          break;
        default:
          type = "UNKNOWN(" + std::to_string(opcode) + ")";
          break;
      }
      LOG(INFO) << "Received [" << type << "]: " << msg;

      // Echo back
      if (opcode == WISH_OPCODE_TEXT)
        handler->SendText(msg);
      else if (opcode == WISH_OPCODE_BINARY)
        handler->SendBinary(msg);
      else if (opcode == WISH_OPCODE_TEXT_METADATA)
        handler->SendTextMetadata(msg);
      else if (opcode == WISH_OPCODE_BINARY_METADATA)
        handler->SendBinaryMetadata(msg);
      else {
        LOG(WARNING) << "Unknown opcode, cannot echo.";
      }
    });

    handler->Start();
  });

  server.Run();

  return 0;
}
