#include "h2_wish_stream.h"

#include <gtest/gtest.h>
#include <nghttp2/nghttp2.h>

#include <cstring>
#include <string>

#include "wish_opcodes.h"

// Create a minimal nghttp2 session whose send callback discards all bytes.
// This lets H2WishStream call nghttp2_session_resume_data /
// nghttp2_session_send without a real network connection.
static nghttp2_session* MakeDiscardSession(bool is_server) {
  nghttp2_session_callbacks* cbs = nullptr;
  nghttp2_session_callbacks_new(&cbs);
  nghttp2_session_callbacks_set_send_callback(
      cbs, [](nghttp2_session*, const uint8_t*, size_t len, int, void*) -> ssize_t { return static_cast<ssize_t>(len); });

  nghttp2_session* session = nullptr;
  if (is_server) {
    nghttp2_session_server_new(&session, cbs, nullptr);
  } else {
    nghttp2_session_client_new(&session, cbs, nullptr);
  }
  nghttp2_session_callbacks_del(cbs);
  return session;
}

class H2WishStreamTest : public ::testing::Test {
 protected:
  void SetUp() override {
    server_session_ = MakeDiscardSession(true);
    client_session_ = MakeDiscardSession(false);
    ASSERT_NE(server_session_, nullptr);
    ASSERT_NE(client_session_, nullptr);
  }

  void TearDown() override {
    nghttp2_session_del(server_session_);
    nghttp2_session_del(client_session_);
  }

  // Drain all wslay-framed bytes from src's output buffer and feed them to
  // dst's input via OnDataChunk.
  static void Pipe(H2WishStream* src, H2WishStream* dst) {
    uint8_t buf[65536];
    uint32_t flags = 0;
    ssize_t n;
    while ((n = src->ReadSendData(buf, sizeof(buf), &flags)) > 0) {
      dst->OnDataChunk(buf, static_cast<size_t>(n));
    }
  }

  nghttp2_session* server_session_ = nullptr;
  nghttp2_session* client_session_ = nullptr;
};

TEST_F(H2WishStreamTest, HandshakeAndSimpleExchange) {
  H2WishStream server(server_session_, 1, true /* is_server */);
  H2WishStream client(client_session_, 1, false /* is_server */);

  bool server_opened = false;
  bool client_opened = false;
  std::string received_from_client;
  std::string received_from_server;

  server.SetOnOpen([&]() {
    server_opened = true;
    server.SendText("Hello, Client!");
  });

  client.SetOnOpen([&]() {
    client_opened = true;
    client.SendText("Hello, Server!");
  });

  server.SetOnMessage([&](uint8_t opcode, const std::string& msg) {
    if (opcode == WEB_STREAM_OPCODE_TEXT) {
      received_from_client = msg;
    }
  });

  client.SetOnMessage([&](uint8_t opcode, const std::string& msg) {
    if (opcode == WEB_STREAM_OPCODE_TEXT) {
      received_from_server = msg;
    }
  });

  // Simulate the HTTP/2 handshake completing on both sides.
  server.OnOpen();
  client.OnOpen();

  // Deliver each side's wslay frames to the other side.
  Pipe(&server, &client);
  Pipe(&client, &server);

  EXPECT_TRUE(server_opened);
  EXPECT_TRUE(client_opened);
  EXPECT_EQ(received_from_client, "Hello, Server!");
  EXPECT_EQ(received_from_server, "Hello, Client!");
}

// Tests that the client does NOT mask frames when sending.
// web-stream doesn't use masking (unlike WebSocket over TCP).
TEST_F(H2WishStreamTest, ClientSendsUnmasked) {
  H2WishStream client(client_session_, 1, false /* is_server */);
  client.OnOpen();
  client.SendText("Hello");

  uint8_t buf[256];
  uint32_t flags = 0;
  ssize_t n = client.ReadSendData(buf, sizeof(buf), &flags);
  ASSERT_GT(n, 0) << "No bytes in output buffer after SendText";

  // First byte: FIN=1, RSV=0, opcode=TEXT(0x1) => 0x81
  EXPECT_EQ(buf[0], 0x81u);

  // Second byte: mask bit (0x80) + payload length.
  // web-stream must not use masking.
  bool is_masked = (buf[1] & 0x80) != 0;
  EXPECT_FALSE(is_masked)
      << "Client sent a masked frame! web-stream must not use masking.";
}

// Tests that the server does NOT mask frames when sending.
TEST_F(H2WishStreamTest, ServerSendsUnmasked) {
  H2WishStream server(server_session_, 1, true /* is_server */);
  server.OnOpen();
  server.SendText("Hello");

  uint8_t buf[256];
  uint32_t flags = 0;
  ssize_t n = server.ReadSendData(buf, sizeof(buf), &flags);
  ASSERT_GT(n, 0) << "No bytes in output buffer after SendText";

  // First byte: FIN=1, RSV=0, opcode=TEXT(0x1) => 0x81
  EXPECT_EQ(buf[0], 0x81u);

  // Second byte: mask bit must be clear for web-stream.
  bool is_masked = (buf[1] & 0x80) != 0;
  EXPECT_FALSE(is_masked)
      << "Server sent a masked frame! web-stream must not use masking.";
}
