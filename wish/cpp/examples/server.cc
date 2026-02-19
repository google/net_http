#include <iostream>
#include <thread>
#include <vector>

#include "../src/wish_handler.h"

void HandleClient(Socket client_socket) {
  std::cout << "Client connected." << std::endl;
  WishHandler handler(client_socket, true);

  if (!handler.Handshake()) {
    std::cerr << "Handshake failed." << std::endl;
    return;
  }
  std::cout << "Handshake successful." << std::endl;

  handler.SetOnMessage([&](uint8_t opcode, const std::string& msg) {
    std::string type;
    switch(opcode) {
      case 1: type = "TEXT"; break;
      case 2: type = "BINARY"; break;
      case 3: type = "TEXT_METADATA"; break;
      case 4: type = "BINARY_METADATA"; break;
      default: type = "UNKNOWN(" + std::to_string(opcode) + ")"; break;
    }
    std::cout << "Received [" << type << "]: " << msg << std::endl;
    
    // Echo back with same opcode
    // handler.SendMessage is private, so we use specific methods or expose it? 
    // Wait, I made SendMessage private. I should use the specific methods.
    int res = 0;
    if (opcode == 1) res = handler.SendText("Echo: " + msg);
    else if (opcode == 2) res = handler.SendBinary("Echo: " + msg);
    else if (opcode == 3) res = handler.SendMetadata(true, "Echo: " + msg);
    else if (opcode == 4) res = handler.SendMetadata(false, "Echo: " + msg);
    
    if (res != 0) {
        std::cerr << "Failed to send echo." << std::endl;
    }
  });

  // Event loop
  while (handler.Process()) {
    // Processing...
  }
  std::cout << "Client disconnected." << std::endl;
}

int main() {
  Socket server;
  if (server.Init() != 0) {
      std::cerr << "Failed to init socket" << std::endl;
      return 1;
  }

  int port = 8080;
  if (server.BindAndListen(port) != 0) {
      std::cerr << "Failed to bind and listen on port " << port << std::endl;
      return 1;
  }
  std::cout << "Server listening on port " << port << "..." << std::endl;

  while (true) {
    Socket client = server.Accept();
    if (!client.is_valid()) {
        std::cerr << "Failed to accept client" << std::endl;
        continue;
    }
    
    // Let's detach a thread to handle it
    std::thread(HandleClient, std::move(client)).detach();
  }
  return 0;
}
