#include <iostream>
#include <string>

#include "../src/buffer_event_web_stream.h"
#include "../src/h2_client.h"

int main() {
  H2Client client("127.0.0.1", 8080);

  if (!client.Init()) {
    std::cerr << "Failed to initialize H2Client" << std::endl;
    return 1;
  }

  client.SetOnOpen([](NGHTTP2WebStream* stream) {
    std::cout << "Connected! WiSH stream open (stream_id="
              << stream->stream_id() << ")" << std::endl;

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
      std::cout << "Server says [" << type << "]: " << msg << std::endl;
    });

    stream->SetOnClose(
        []() { std::cout << "WiSH stream closed." << std::endl; });

    stream->SendText("Hello web-stream text over HTTP/2!");
    stream->SendBinary("Hello web-stream binary over HTTP/2!");
    stream->SendMetadata("Hello web-stream metadata over HTTP/2!");
  });

  client.Run();
  return 0;
}
