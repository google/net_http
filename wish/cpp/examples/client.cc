#include <iostream>
#include <thread>
#include <chrono>

#include "../src/wish_handler.h"

int main() {
  Socket socket;
  if (socket.Init() != 0) {
      std::cerr << "Failed to init socket" << std::endl;
      return 1;
  }

  std::string host = "127.0.0.1"; // localhost
  int port = 8080;

  std::cout << "Connecting to " << host << ":" << port << "..." << std::endl;
  if (socket.Connect(host, port) != 0) {
      std::cerr << "Failed to connect to " << host << ":" << port << std::endl;
      return 1;
  }

  WishHandler handler(socket, false); // is_server = false

  if (!handler.Handshake()) {
    std::cerr << "Handshake failed." << std::endl;
    return 1;
  }
  std::cout << "Handshake successful." << std::endl;

  handler.SetOnMessage([](uint8_t opcode, const std::string& msg) {
    std::string type;
    switch(opcode) {
      case 1: type = "TEXT"; break;
      case 2: type = "BINARY"; break;
      case 3: type = "TEXT_METADATA"; break;
      case 4: type = "BINARY_METADATA"; break;
      default: type = "UNKNOWN(" + std::to_string(opcode) + ")"; break;
    }
    std::cout << "Server says [" << type << "]: " << msg << std::endl;
  });

  // Send a text message
  std::string text_msg = "Hello WiSH Text!";
  std::cout << "Sending Text: " << text_msg << std::endl;
  if (handler.SendText(text_msg) != 0) {
      std::cerr << "Failed to send text message" << std::endl;
  }

  // Send a binary message
  std::string bin_msg = "Hello WiSH Binary!";
  std::cout << "Sending Binary: " << bin_msg << std::endl;
  if (handler.SendBinary(bin_msg) != 0) {
      std::cerr << "Failed to send binary message" << std::endl;
  }

  // Send a metadata message
  std::string meta_msg = "Hello WiSH Metadata!";
  std::cout << "Sending Metadata: " << meta_msg << std::endl;
  if (handler.SendMetadata(true, meta_msg) != 0) { // Text metadata
      std::cerr << "Failed to send metadata message" << std::endl;
  }

  // Process loop to receive echo
  // Run for a bit then exit
  auto start = std::chrono::steady_clock::now();
  while (std::chrono::steady_clock::now() - start < std::chrono::seconds(5)) {
    if (!handler.Process()) break;
    std::this_thread::sleep_for(std::chrono::milliseconds(10));
  }

  return 0;
}
