#include <absl/flags/flag.h>
#include <absl/flags/parse.h>
#include <absl/log/initialize.h>
#include <absl/log/log.h>

#include <string>

#include "../src/plain_client.h"
#include "../src/wish_opcodes.h"

ABSL_FLAG(std::string, host, "127.0.0.1", "Server host address");
ABSL_FLAG(int, port, 8080, "Server port");

int main(int argc, char** argv) {
  absl::ParseCommandLine(argc, argv);
  absl::InitializeLog();

  const std::string host = absl::GetFlag(FLAGS_host);
  const int port = absl::GetFlag(FLAGS_port);

  PlainClient client(host, port);

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
