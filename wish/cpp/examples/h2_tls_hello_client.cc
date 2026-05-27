#include <iostream>
#include <string>

#include "../src/h2_tls_client.h"
#include "../src/wish_handler.h"

int main() {
  H2TlsClient client("127.0.0.1",
                     8080,
                     "certs/ca.crt",
                     "certs/client.crt",
                     "certs/client.key");

  if (!client.Init()) {
    std::cerr << "Failed to initialize H2TlsClient" << std::endl;
    return 1;
  }

  client.SetOnOpen([](H2WishStream* stream) {
    std::cout << "TLS Connected! WiSH stream open (stream_id="
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
        []() { std::cout << "TLS WiSH stream closed." << std::endl; });

    stream->SendText("Hello WiSH Text over HTTP/2+TLS!");
    stream->SendBinary("Hello WiSH Binary over HTTP/2+TLS!");
    stream->SendMetadata("Hello WiSH TextMetadata over HTTP/2+TLS!");
  });

  client.Run();
  return 0;
}
