#include <chrono>
#include <iostream>
#include <string>
#include <vector>

#include "../src/tls_client.h"
#include "../src/wish_handler.h"

int main() {
  TlsClient client("../certs/ca.crt", "../certs/client.crt",
                   "../certs/client.key", "127.0.0.1", 8080);

  if (!client.Init()) {
    std::cerr << "Failed to initialize client" << std::endl;
    return 1;
  }

  const int kTotalMessages = 1000;
  int messages_received = 0;
  auto start_time = std::chrono::high_resolution_clock::now();

  client.SetOnOpen([&start_time, kTotalMessages](WishHandler* handler) {
    std::cout << "Connected! Starting benchmark..." << std::endl;

    start_time = std::chrono::high_resolution_clock::now();

    for (int i = 0; i < kTotalMessages; ++i) {
      handler->SendText("Benchmark message " + std::to_string(i));
    }
  });

  client.SetOnMessage([&messages_received, kTotalMessages,
                       &start_time](uint8_t opcode, const std::string& msg) {
    messages_received++;
    if (messages_received == kTotalMessages) {
      auto end_time = std::chrono::high_resolution_clock::now();
      auto duration = std::chrono::duration_cast<std::chrono::milliseconds>(
          end_time - start_time);
      std::cout << "Benchmark complete: Received " << kTotalMessages
                << " messages in " << duration.count() << " ms." << std::endl;
      exit(0);
    }
  });

  client.Run();

  return 0;
}
