#include <absl/flags/parse.h>
#include <absl/log/initialize.h>
#include <absl/log/log.h>

#include <string>

#include "../src/buffer_event_web_stream.h"
#include "../src/plain_client.h"

int main(int argc, char** argv) {
  absl::ParseCommandLine(argc, argv);
  absl::InitializeLog();

  PlainClient client("127.0.0.1", 8080);

  if (!client.Init()) {
    LOG(INFO) << "Init() failed";
    return 1;
  }

  client.SetOnOpen([](BufferEventWebStream* handler) {
    LOG(INFO) << "OnOpen";

    handler->SendText("Hello web-stream text!");
    handler->SendBinary("Hello web-stream binary!");
    handler->SendMetadata("Hello web-stream metadata!");
  });

  client.SetOnMessage([](uint8_t opcode, const std::string& msg) {
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

  client.Run();

  return 0;
}
