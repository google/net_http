#include <iostream>
#include <string>

#include "../src/tls_server.h"
#include "../src/wish_handler.h"

int main(int argc, char** argv) {
  int port = 8080;

  TlsServer server("../certs/ca.crt", "../certs/server.crt",
                   "../certs/server.key", port);

  if (!server.Init()) {
    std::cerr << "Failed to initialize server" << std::endl;
    return 1;
  }

  server.SetOnConnection([](struct bufferevent* bev) {
    std::cout << "Client connected." << std::endl;

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
      std::cout << "Received [" << type << "]: " << msg << std::endl;

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
        std::cerr << "Unknown opcode, cannot echo." << std::endl;
      }
    });

    handler->Start();
  });

  server.Run();

  return 0;
}
