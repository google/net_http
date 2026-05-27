// Copyright 2026 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#include "h2_server.h"

#include <arpa/inet.h>
#include <event2/event.h>
#include <gtest/gtest.h>
#include <netinet/in.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>

#include <cstring>

class H2ServerTest : public ::testing::Test {
 protected:
  void SetUp() override {
    base_ = event_base_new();
    ASSERT_NE(base_, nullptr);
  }

  void TearDown() override {
    if (base_) {
      event_base_free(base_);
    }
  }

  event_base* base_ = nullptr;
};

TEST_F(H2ServerTest, InvalidConnectionPrefaceCleanlyDeallocatesSession) {
  // Bind to port 0 (ephemeral port)
  H2Server server(base_, 0);
  ASSERT_TRUE(server.Init());

  // Connect client socket to local loopback port
  int client_fd = socket(AF_INET, SOCK_STREAM, 0);
  ASSERT_GE(client_fd, 0);

  sockaddr_in addr{};
  addr.sin_family = AF_INET;
  addr.sin_port = htons(server.GetPort());
  inet_pton(AF_INET, "127.0.0.1", &addr.sin_addr);

  ASSERT_EQ(connect(client_fd, reinterpret_cast<sockaddr*>(&addr), sizeof(addr)), 0);

  // Dispatch event loop briefly to accept the connection.
  event_base_loop(base_, EVLOOP_NONBLOCK);

  // Send malformed connection preface instead of valid HTTP/2 magic.
  const char kInvalidPreface[] = "INVALID_CLIENT_MAGIC_BYTES_PAYLOAD";
  ssize_t bytes_written = send(client_fd, kInvalidPreface, sizeof(kInvalidPreface) - 1, 0);
  ASSERT_EQ(bytes_written, sizeof(kInvalidPreface) - 1);

  // Process the read callback which handles the preface failure.
  event_base_loop(base_, EVLOOP_NONBLOCK);

  close(client_fd);
  event_base_loop(base_, EVLOOP_NONBLOCK);
}
