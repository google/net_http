#include <iostream>
#include <string>

#include "../src/tls_client.h"
#include "../src/wish_handler.h"

int main() {
  TlsClient client("127.0.0.1",
                   8080,
                   "certs/ca.crt",
                   "certs/client.crt",
                   "certs/client.key");

  if (!client.Init()) {
    std::cerr << "Failed to initialize client" << std::endl;
    return 1;
  }

  client.SetOnOpen([](WishHandler* handler) {
    std::cout << "Connected and Handshake Complete!" << std::endl;

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
    std::cout << "Server says [" << type << "]: " << msg << std::endl;
  });

  client.Run();

  return 0;
}
