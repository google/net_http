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

#include "buffer_event_web_stream.h"
#include "handshake.h"

#include <event2/buffer.h>
#include <event2/bufferevent.h>
#include <event2/event.h>
#include <gtest/gtest.h>

#include <cstring>
#include <string>
#include <memory>

class BufferEventWebStreamTest : public ::testing::Test {
 protected:
  void SetUp() override {
    base_ = event_base_new();
    ASSERT_NE(base_, nullptr);
  }

  void TearDown() override {
    event_base_free(base_);
  }

  event_base* base_ = nullptr;
};

TEST_F(BufferEventWebStreamTest, HandshakeAndSimpleExchange) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_,
                                BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS,
                                pair);
  ASSERT_EQ(rv, 0);

  std::unique_ptr<BufferEventWebStream> server;
  std::unique_ptr<BufferEventWebStream> client;

  bool server_opened = false;
  bool client_opened = false;
  std::string received_from_client;
  std::string received_from_server;

  auto check_done = [&]() {
    if (!received_from_client.empty() && !received_from_server.empty()) {
      event_base_loopbreak(base_);
    }
  };

  auto server_handshake = std::make_unique<ServerHandshake>(
      pair[0],
      [&](bufferevent* bev) {
        server = std::make_unique<BufferEventWebStream>(bev, true);
        ASSERT_TRUE(server->Init());
        server_opened = true;
        server->SetOnMessage([&](uint8_t opcode, const std::string& msg) {
          if (opcode == WEB_STREAM_OPCODE_TEXT) {
            received_from_client = msg;
          }
          check_done();
        });
        server->Start();
        server->SendText("Hello, Client!");
      },
      []() { ADD_FAILURE() << "Server handshake failed"; });
  server_handshake->Start();

  auto client_handshake = std::make_unique<ClientHandshake>(
      pair[1],
      [&](bufferevent* bev) {
        client = std::make_unique<BufferEventWebStream>(bev, false);
        ASSERT_TRUE(client->Init());
        client_opened = true;
        client->SetOnMessage([&](uint8_t opcode, const std::string& msg) {
          if (opcode == WEB_STREAM_OPCODE_TEXT) {
            received_from_server = msg;
          }
          check_done();
        });
        client->Start();
        client->SendText("Hello, Server!");
      },
      []() { ADD_FAILURE() << "Client handshake failed"; });
  client_handshake->Start();

  event_base_dispatch(base_);

  EXPECT_TRUE(client_opened);
  EXPECT_TRUE(server_opened);
  EXPECT_EQ(received_from_client, "Hello, Server!");
  EXPECT_EQ(received_from_server, "Hello, Client!");
}

// Helper: drain all bytes from a bufferevent's input buffer.
static void DrainInput(bufferevent* bev) {
  evbuffer* buf = bufferevent_get_input(bev);
  evbuffer_drain(buf, evbuffer_get_length(buf));
}

// Tests that the client does NOT mask frames when sending.
// web-stream doesn't use masking (unlike WebSocket over TCP).
TEST_F(BufferEventWebStreamTest, ClientSendsUnmasked) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_, BEV_OPT_CLOSE_ON_FREE, pair);
  ASSERT_EQ(rv, 0);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  std::unique_ptr<BufferEventWebStream> client;
  auto client_handshake = std::make_unique<ClientHandshake>(
      pair[0],
      [&](bufferevent* bev) {
        client = std::make_unique<BufferEventWebStream>(bev, false);
        ASSERT_TRUE(client->Init());
        client->Start();
      },
      []() { ADD_FAILURE() << "Client handshake failed"; });
  client_handshake->Start();

  // Let client's HTTP request flow to pair[1].
  event_base_loop(base_, EVLOOP_NONBLOCK);
  DrainInput(pair[1]);

  // Fake server sends HTTP 200 OK back through pair[1] -> pair[0].
  const char* resp =
      "HTTP/1.1 200 OK\r\nContent-Type: application/web-stream\r\n\r\n";
  bufferevent_write(pair[1], resp, strlen(resp));

  // Let the client process the response and transition to OPEN state.
  event_base_loop(base_, EVLOOP_ONCE);
  DrainInput(pair[1]);

  // The client should now be OPEN. Send a text message.
  client->SendText("Hello");
  event_base_loop(base_, EVLOOP_NONBLOCK);

  evbuffer* raw = bufferevent_get_input(pair[1]);
  size_t len = evbuffer_get_length(raw);
  ASSERT_GT(len, 0) << "No bytes received from client after handshake";

  unsigned char* bytes = evbuffer_pullup(raw, len);

  // With Transfer-Encoding: chunked, outbound wslay frames are wrapped as:
  //   <hex-len>\r\n<wslay frame>\r\n
  // For "Hello" (5-byte payload), the wslay TEXT frame is 7 bytes
  // (0x81 0x05 + 5-byte payload). The chunk header for 7 bytes is "7\r\n"
  // (3 bytes), so the first wslay frame byte appears at offset 3.
  ASSERT_GE(len, 5u) << "Too few bytes to inspect wslay frame inside chunk";

  EXPECT_EQ(bytes[3], 0x81u);

  bool is_masked = (bytes[4] & 0x80) != 0;
  EXPECT_FALSE(is_masked) << "Client sent a masked frame! web-stream must not use masking.";
  bufferevent_free(pair[1]);
}

// Tests that the server does NOT mask frames when sending.
TEST_F(BufferEventWebStreamTest, ServerSendsUnmasked) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_, BEV_OPT_CLOSE_ON_FREE, pair);
  ASSERT_EQ(rv, 0);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  std::unique_ptr<BufferEventWebStream> server;
  auto server_handshake = std::make_unique<ServerHandshake>(
      pair[0],
      [&](bufferevent* bev) {
        server = std::make_unique<BufferEventWebStream>(bev, true);
        ASSERT_TRUE(server->Init());
        server->Start();
      },
      []() { ADD_FAILURE() << "Server handshake failed"; });
  server_handshake->Start();

  // Fake client sends HTTP POST to open the connection.
  const char* req =
      "POST / HTTP/1.1\r\nHost: localhost\r\n"
      "Content-Type: application/web-stream\r\n\r\n";
  bufferevent_write(pair[1], req, strlen(req));

  // Let server process the request, transition to OPEN, and send 200 OK.
  event_base_loop(base_, EVLOOP_ONCE);
  DrainInput(pair[1]);

  // Server is now OPEN. Send a text message.
  server->SendText("Hello");
  event_base_loop(base_, EVLOOP_NONBLOCK);

  evbuffer* raw = bufferevent_get_input(pair[1]);
  size_t len = evbuffer_get_length(raw);
  ASSERT_GT(len, 0) << "No bytes received from server after handshake";

  unsigned char* bytes = evbuffer_pullup(raw, len);

  ASSERT_GE(len, 5u) << "Too few bytes to inspect wslay frame inside chunk";

  EXPECT_EQ(bytes[3], 0x81u);

  bool is_masked = (bytes[4] & 0x80) != 0;
  EXPECT_FALSE(is_masked) << "Server sent a masked frame! web-stream must not use masking.";
  bufferevent_free(pair[1]);
}

// Verify that Close() delivers a terminal chunk to the peer and that the peer's
// on_close_ callback fires.
TEST_F(BufferEventWebStreamTest, CloseSignalsEOF) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_,
                                BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS,
                                pair);
  ASSERT_EQ(rv, 0);

  std::unique_ptr<BufferEventWebStream> server;
  std::unique_ptr<BufferEventWebStream> client;
  bool client_close_fired = false;

  auto server_handshake = std::make_unique<ServerHandshake>(
      pair[0],
      [&](bufferevent* bev) {
        server = std::make_unique<BufferEventWebStream>(bev, true);
        ASSERT_TRUE(server->Init());
        server->Start();
        EXPECT_EQ(server->Close(), 0);
        EXPECT_EQ(server->Close(), -1);
      },
      []() { ADD_FAILURE() << "Server handshake failed"; });
  server_handshake->Start();

  auto client_handshake = std::make_unique<ClientHandshake>(
      pair[1],
      [&](bufferevent* bev) {
        client = std::make_unique<BufferEventWebStream>(bev, false);
        ASSERT_TRUE(client->Init());
        client->SetOnClose([&]() {
          client_close_fired = true;
          event_base_loopbreak(base_);
        });
        client->Start();
      },
      []() { ADD_FAILURE() << "Client handshake failed"; });
  client_handshake->Start();

  event_base_dispatch(base_);

  EXPECT_TRUE(client_close_fired);
}

// Verify that metadata frames (opcode = 3) can be sent and received correctly by both client and server.
TEST_F(BufferEventWebStreamTest, HandshakeAndMetadataExchange) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_,
                                BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS,
                                pair);
  ASSERT_EQ(rv, 0);

  std::unique_ptr<BufferEventWebStream> server;
  std::unique_ptr<BufferEventWebStream> client;

  bool server_opened = false;
  bool client_opened = false;
  std::string metadata_from_client;
  std::string metadata_from_server;

  auto check_done = [&]() {
    if (!metadata_from_client.empty() && !metadata_from_server.empty()) {
      event_base_loopbreak(base_);
    }
  };

  auto server_handshake = std::make_unique<ServerHandshake>(
      pair[0],
      [&](bufferevent* bev) {
        server = std::make_unique<BufferEventWebStream>(bev, true);
        ASSERT_TRUE(server->Init());
        server_opened = true;
        server->SetOnMessage([&](uint8_t opcode, const std::string& msg) {
          if (opcode == WEB_STREAM_OPCODE_METADATA) {
            metadata_from_client = msg;
          }
          check_done();
        });
        server->Start();
        server->SendMetadata("Server Metadata");
      },
      []() { ADD_FAILURE() << "Server handshake failed"; });
  server_handshake->Start();

  auto client_handshake = std::make_unique<ClientHandshake>(
      pair[1],
      [&](bufferevent* bev) {
        client = std::make_unique<BufferEventWebStream>(bev, false);
        ASSERT_TRUE(client->Init());
        client_opened = true;
        client->SetOnMessage([&](uint8_t opcode, const std::string& msg) {
          if (opcode == WEB_STREAM_OPCODE_METADATA) {
            metadata_from_server = msg;
          }
          check_done();
        });
        client->Start();
        client->SendMetadata("Client Metadata");
      },
      []() { ADD_FAILURE() << "Client handshake failed"; });
  client_handshake->Start();

  event_base_dispatch(base_);

  EXPECT_TRUE(client_opened);
  EXPECT_TRUE(server_opened);
  EXPECT_EQ(metadata_from_client, "Client Metadata");
  EXPECT_EQ(metadata_from_server, "Server Metadata");
}

// Verify that the local side can still receive messages from the peer after calling Close() (half-closed).
TEST_F(BufferEventWebStreamTest, ReceiveMessageAfterClose) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_,
                                BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS,
                                pair);
  ASSERT_EQ(rv, 0);

  std::unique_ptr<BufferEventWebStream> server;
  std::unique_ptr<BufferEventWebStream> client;

  bool server_received_msg_after_close = false;
  bool server_close_fired = false;
  bool client_close_fired = false;

  auto server_handshake = std::make_unique<ServerHandshake>(
      pair[0],
      [&](bufferevent* bev) {
        server = std::make_unique<BufferEventWebStream>(bev, true);
        ASSERT_TRUE(server->Init());
        server->SetOnMessage([&](uint8_t opcode, const std::string& msg) {
          if (opcode == WEB_STREAM_OPCODE_TEXT && msg == "Hello after server close") {
            server_received_msg_after_close = true;
          }
        });
        server->SetOnClose([&]() {
          server_close_fired = true;
        });
        server->Start();
        EXPECT_EQ(server->Close(), 0);
      },
      []() { ADD_FAILURE() << "Server handshake failed"; });
  server_handshake->Start();

  auto client_handshake = std::make_unique<ClientHandshake>(
      pair[1],
      [&](bufferevent* bev) {
        client = std::make_unique<BufferEventWebStream>(bev, false);
        ASSERT_TRUE(client->Init());
        client->SetOnClose([&]() {
          client_close_fired = true;
          client->SendText("Hello after server close");
          client->Close();
        });
        client->Start();
      },
      []() { ADD_FAILURE() << "Client handshake failed"; });
  client_handshake->Start();

  event_base_dispatch(base_);

  EXPECT_TRUE(server_received_msg_after_close);
  EXPECT_TRUE(client_close_fired);
  EXPECT_TRUE(server_close_fired);
}

// Verify that any extra data arriving after the peer's terminal chunk is closed
// triggers a warning to stderr and is drained.
TEST_F(BufferEventWebStreamTest, WarningOnExtraDataPostClose) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_,
                                BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS,
                                pair);
  ASSERT_EQ(rv, 0);

  std::unique_ptr<BufferEventWebStream> server;
  std::unique_ptr<BufferEventWebStream> client;

  bool server_close_fired = false;
  bool client_close_fired = false;

  auto server_handshake = std::make_unique<ServerHandshake>(
      pair[0],
      [&](bufferevent* bev) {
        server = std::make_unique<BufferEventWebStream>(bev, true);
        ASSERT_TRUE(server->Init());
        server->SetOnClose([&]() {
          server_close_fired = true;
        });
        server->Start();
        server->Close();
      },
      []() { ADD_FAILURE() << "Server handshake failed"; });
  server_handshake->Start();

  auto client_handshake = std::make_unique<ClientHandshake>(
      pair[1],
      [&](bufferevent* bev) {
        client = std::make_unique<BufferEventWebStream>(bev, false);
        ASSERT_TRUE(client->Init());
        client->SetOnClose([&]() {
          client_close_fired = true;
          client->Close();
          const char* extra = "extra data after close";
          bufferevent_write(pair[1], extra, strlen(extra));
        });
        client->Start();
      },
      []() { ADD_FAILURE() << "Client handshake failed"; });
  client_handshake->Start();

  event_base_dispatch(base_);

  EXPECT_TRUE(client_close_fired);
  EXPECT_TRUE(server_close_fired);
}

// Verify that SetOnError callback fires instead of SetOnClose if the stream is closed
// in the middle of receiving a message.
TEST_F(BufferEventWebStreamTest, OnErrorOnMidMessageEOF) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_,
                                BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS,
                                pair);
  ASSERT_EQ(rv, 0);

  std::unique_ptr<BufferEventWebStream> server;
  bool server_close_fired = false;
  bool server_error_fired = false;

  auto server_handshake = std::make_unique<ServerHandshake>(
      pair[0],
      [&](bufferevent* bev) {
        server = std::make_unique<BufferEventWebStream>(bev, true);
        ASSERT_TRUE(server->Init());
        server->SetOnClose([&]() {
          server_close_fired = true;
        });
        server->SetOnError([&]() {
          server_error_fired = true;
          event_base_loopbreak(base_);
        });
        server->Start();
      },
      []() { ADD_FAILURE() << "Server handshake failed"; });
  server_handshake->Start();

  // Fake client handshake
  const char* req =
      "POST / HTTP/1.1\r\nHost: localhost\r\n"
      "Content-Type: application/web-stream\r\n\r\n";
  bufferevent_write(pair[1], req, strlen(req));

  // Let handshake complete
  event_base_loop(base_, EVLOOP_ONCE);
  DrainInput(pair[1]);

  // Write a partial message frame inside a chunk
  bufferevent_write(pair[1], "c\r\n", 3);
  uint8_t frame_hdr[2] = {0x81, 100};
  bufferevent_write(pair[1], frame_hdr, 2);
  bufferevent_write(pair[1], "1234567890", 10);
  bufferevent_write(pair[1], "\r\n0\r\n\r\n", 7);

  event_base_dispatch(base_);

  EXPECT_FALSE(server_close_fired);
  EXPECT_TRUE(server_error_fired);

  bufferevent_free(pair[1]);
}

// Verify that SetOnError callback fires instead of SetOnClose if the TCP/TLS connection
// itself is disconnected (EOF/ERROR) in the middle of receiving a message.
TEST_F(BufferEventWebStreamTest, OnErrorOnConnectionClosedMidMessage) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_,
                                BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS,
                                pair);
  ASSERT_EQ(rv, 0);

  std::unique_ptr<BufferEventWebStream> server;
  bool server_close_fired = false;
  bool server_error_fired = false;

  auto server_handshake = std::make_unique<ServerHandshake>(
      pair[0],
      [&](bufferevent* bev) {
        server = std::make_unique<BufferEventWebStream>(bev, true);
        ASSERT_TRUE(server->Init());
        server->SetOnClose([&]() {
          server_close_fired = true;
        });
        server->SetOnError([&]() {
          server_error_fired = true;
          event_base_loopbreak(base_);
        });
        server->Start();
      },
      []() { ADD_FAILURE() << "Server handshake failed"; });
  server_handshake->Start();

  // Fake client handshake
  const char* req =
      "POST / HTTP/1.1\r\nHost: localhost\r\n"
      "Content-Type: application/web-stream\r\n\r\n";
  bufferevent_write(pair[1], req, strlen(req));

  // Let handshake complete
  event_base_loop(base_, EVLOOP_NONBLOCK);
  DrainInput(pair[1]);

  // Write a partial message frame inside a chunk
  bufferevent_write(pair[1], "c\r\n", 3);
  uint8_t frame_hdr[2] = {0x81, 100};
  bufferevent_write(pair[1], frame_hdr, 2);
  bufferevent_write(pair[1], "1234567890", 10);
  
  // Let the data flow to the server
  event_base_loop(base_, EVLOOP_NONBLOCK);
  
  // Close the client's side of the connection.
  bufferevent_flush(pair[1], EV_WRITE, BEV_FINISHED);
  bufferevent_free(pair[1]);

  // Process the EOF event on the server
  event_base_loop(base_, EVLOOP_NONBLOCK);

  EXPECT_FALSE(server_close_fired);
  EXPECT_TRUE(server_error_fired);
}

