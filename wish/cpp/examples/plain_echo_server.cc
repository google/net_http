#include <absl/flags/flag.h>
#include <absl/flags/parse.h>
#include <absl/log/initialize.h>
#include <absl/log/log.h>

#include <string>

#include "../src/plain_server.h"
#include "../src/wish_opcodes.h"

ABSL_FLAG(int, port, 8080, "Port to listen on");

int main(int argc, char** argv) {
  absl::ParseCommandLine(argc, argv);
  absl::InitializeLog();

  const int port = absl::GetFlag(FLAGS_port);

  PlainServer server(port);

  if (!server.Init()) {
    LOG(ERROR) << "Init() failed";

    return 1;
  }

  server.SetOnStream([](WebStream* stream) {
    LOG(INFO) << "OnStream";

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

      LOG(INFO) << "OnMessage (opcode: " << type << ", message: " << msg << ")";

      // Echo back
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

    stream->SetOnClose([stream]() {
      LOG(INFO) << "OnClose";

      stream->Close();
    });
  });

  server.Run();

  return 0;
}
