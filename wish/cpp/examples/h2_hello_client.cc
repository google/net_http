#include <absl/flags/flag.h>
#include <absl/flags/parse.h>
#include <absl/log/initialize.h>
#include <absl/log/log.h>

#include <string>

#include "../src/buffer_event_web_stream.h"
#include "../src/h2_client.h"

ABSL_FLAG(std::string, host, "127.0.0.1", "Server host address");
ABSL_FLAG(int, port, 8080, "Server port");

int main(int argc, char** argv) {
  absl::ParseCommandLine(argc, argv);
  absl::InitializeLog();

  const std::string host = absl::GetFlag(FLAGS_host);
  const int port = absl::GetFlag(FLAGS_port);

  H2Client client(host, port);

  if (!client.Init()) {
    LOG(INFO) << "Init() failed";

    return 1;
  }

  client.SetOnOpen([](NGHTTP2WebStream* stream) {
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

      LOG(INFO) << "Message (opcode: " << type << ", message: " << msg << ")";
    });

    stream->SetOnClose(
        []() { LOG(INFO) << "OnClose"; });

    stream->SendText("Hello web-stream text over HTTP/2!");
    stream->SendBinary("Hello web-stream binary over HTTP/2!");
    stream->SendMetadata("Hello web-stream metadata over HTTP/2!");
  });

  client.Run();

  return 0;
}
