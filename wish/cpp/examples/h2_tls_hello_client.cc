#include <absl/flags/parse.h>
#include <absl/log/initialize.h>
#include <absl/log/log.h>

#include <string>

#include "../src/buffer_event_web_stream.h"
#include "../src/h2_tls_client.h"

int main(int argc, char** argv) {
  absl::ParseCommandLine(argc, argv);
  absl::InitializeLog();

  H2TlsClient client("127.0.0.1",
                     8080,
                     "certs/ca.crt",
                     "certs/client.crt",
                     "certs/client.key");

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

    stream->SendText("Hello web-stream text over HTTP/2+TLS!");
    stream->SendBinary("Hello web-stream binary over HTTP/2+TLS!");
    stream->SendMetadata("Hello web-stream metadata over HTTP/2+TLS!");
  });

  client.Run();
  return 0;
}
