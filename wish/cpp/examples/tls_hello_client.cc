#include <iostream>
#include <string>

#include "../src/tls_client.h"
#include "../src/wish_handler.h"

int main() {
  TlsClient client("../certs/ca.crt", "../certs/client.crt",
                    "../certs/client.key", "127.0.0.1", 8080);

  if (!client.Init()) {
    std::cerr << "Failed to initialize client" << std::endl;
    return 1;
  }

  client.SetOnOpen([](WishHandler* handler) {
    std::cout << "Connected and Handshake Complete!" << std::endl;

    handler->SendText("Hello WiSH Text!");
    handler->SendBinary("Hello WiSH Binary!");
    handler->SendTextMetadata("Hello WiSH Metadata!");
    handler->SendBinaryMetadata("Hello WiSH Binary Metadata!");
  });

  client.SetOnMessage([](uint8_t opcode, const std::string& msg) {
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
    std::cout << "Server says [" << type << "]: " << msg << std::endl;
  });

  client.Run();

  return 0;
}
