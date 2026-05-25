#include <iostream>
#include <string>

#include "../src/h2_client.h"
#include "../src/wish_handler.h"

int main() {
  H2Client client("127.0.0.1", 8080);

  if (!client.Init()) {
    std::cerr << "Failed to initialize H2Client" << std::endl;
    return 1;
  }

  client.SetOnOpen([](H2WishStream* stream) {
    std::cout << "Connected! WiSH stream open (stream_id="
              << stream->stream_id() << ")" << std::endl;

    stream->SetOnMessage([](uint8_t opcode, const std::string& msg) {
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

    stream->SetOnClose(
        []() { std::cout << "WiSH stream closed." << std::endl; });

    stream->SendText("Hello WiSH Text over HTTP/2!");
    stream->SendBinary("Hello WiSH Binary over HTTP/2!");
    stream->SendTextMetadata("Hello WiSH TextMetadata over HTTP/2!");
    stream->SendBinaryMetadata("Hello WiSH BinaryMetadata over HTTP/2!");
  });

  client.Run();
  return 0;
}
