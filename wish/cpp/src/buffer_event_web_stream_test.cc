#include "buffer_event_web_stream.h"

#include <event2/buffer.h>
#include <event2/bufferevent.h>
#include <event2/event.h>
#include <gtest/gtest.h>

#include <cstring>
#include <string>

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

  BufferEventWebStream* server = new BufferEventWebStream(pair[0], true /* is_server */);
  BufferEventWebStream* client = new BufferEventWebStream(pair[1], false /* is_server */);

  bool server_opened = false;
  bool client_opened = false;
  std::string received_from_client;
  std::string received_from_server;

  server->SetOnOpen([&]() {
    server_opened = true;
    server->SendText("Hello, Client!");
  });

  client->SetOnOpen([&]() {
    client_opened = true;
    client->SendText("Hello, Server!");
  });

  auto check_done = [&]() {
    if (!received_from_client.empty() && !received_from_server.empty()) {
      event_base_loopbreak(base_);
    }
  };

  server->SetOnMessage([&](uint8_t opcode, const std::string& msg) {
    if (opcode == WEB_STREAM_OPCODE_TEXT) {
      received_from_client = msg;
    }
    check_done();
  });

  client->SetOnMessage([&](uint8_t opcode, const std::string& msg) {
    if (opcode == WEB_STREAM_OPCODE_TEXT) {
      received_from_server = msg;
    }
    check_done();
  });

  server->Start();
  client->Start();

  event_base_dispatch(base_);

  EXPECT_TRUE(client_opened);
  EXPECT_TRUE(server_opened);
  EXPECT_EQ(received_from_client, "Hello, Server!");
  EXPECT_EQ(received_from_server, "Hello, Client!");

  delete server;
  delete client;
}

// Helper: drain all bytes from a bufferevent's input buffer.
static void DrainInput(bufferevent* bev) {
  evbuffer* buf = bufferevent_get_input(bev);
  evbuffer_drain(buf, evbuffer_get_length(buf));
}

// Tests that the client does NOT mask frames when sending.
// web-stream doesn't use masking (unlike WebSocket over TCP).
//
// Strategy: use a raw bufferevent on one end of a pair as a fake server.
// Inject a valid HTTP 200 response to move the BufferEventWebStream into OPEN state,
// then call SendText and inspect the raw bytes for the mask bit.
TEST_F(BufferEventWebStreamTest, ClientSendsUnmasked) {
  // No DEFER_CALLBACKS: pair transfers data synchronously between loop ticks.
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_, BEV_OPT_CLOSE_ON_FREE, pair);
  ASSERT_EQ(rv, 0);
  // pair[0]: BufferEventWebStream client bev
  // pair[1]: raw observer (fake server)
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  BufferEventWebStream* client = new BufferEventWebStream(pair[0], false /* is_server */);
  // Start writes the HTTP POST request and enables read on pair[0].
  client->Start();

  // Let client's HTTP request flow to pair[1].
  event_base_loop(base_, EVLOOP_NONBLOCK);
  DrainInput(pair[1]);

  // Fake server sends HTTP 200 OK back through pair[1] -> pair[0].
  const char* resp =
      "HTTP/1.1 200 OK\r\nContent-Type: application/web-stream\r\n\r\n";
  bufferevent_write(pair[1], resp, strlen(resp));

  // Let the client process the response and transition to OPEN state.
  event_base_loop(base_, EVLOOP_NONBLOCK);
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
  // (0x81 0x05 + 5-byte payload).  The chunk header for 7 bytes is "7\r\n"
  // (3 bytes), so the first wslay frame byte appears at offset 3.
  // If wslay splits the frame header (2 B) from the payload (5 B), the first
  // chunk is "2\r\n", still 3 bytes, and bytes[3] is still 0x81.
  ASSERT_GE(len, 5u) << "Too few bytes to inspect wslay frame inside chunk";

  // First wslay frame byte: FIN=1, RSV=0, opcode=TEXT(0x1) => 0x81
  EXPECT_EQ(bytes[3], 0x81u);

  // Second wslay frame byte: mask bit (0x80) + payload length.
  // web-stream doesn't use masking.
  bool is_masked = (bytes[4] & 0x80) != 0;
  EXPECT_FALSE(is_masked) << "Client sent a masked frame! web-stream must not use masking.";

  // BufferEventWebStream destructor frees pair[0].
  delete client;
  // free pair[1] manually.
  bufferevent_free(pair[1]);
}

// Tests that the server does NOT mask frames when sending.
TEST_F(BufferEventWebStreamTest, ServerSendsUnmasked) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_, BEV_OPT_CLOSE_ON_FREE, pair);
  ASSERT_EQ(rv, 0);
  // pair[0]: BufferEventWebStream server bev
  // pair[1]: raw observer (fake client)
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  BufferEventWebStream* server = new BufferEventWebStream(pair[0], true /* is_server */);
  server->Start();

  // Fake client sends HTTP POST to open the connection.
  const char* req =
      "POST / HTTP/1.1\r\nHost: localhost\r\n"
      "Content-Type: application/web-stream\r\n\r\n";
  bufferevent_write(pair[1], req, strlen(req));

  // Let server process the request, transition to OPEN, and send 200 OK.
  event_base_loop(base_, EVLOOP_NONBLOCK);
  DrainInput(pair[1]);

  // Server is now OPEN. Send a text message.
  server->SendText("Hello");
  event_base_loop(base_, EVLOOP_NONBLOCK);

  evbuffer* raw = bufferevent_get_input(pair[1]);
  size_t len = evbuffer_get_length(raw);
  ASSERT_GT(len, 0) << "No bytes received from server after handshake";

  unsigned char* bytes = evbuffer_pullup(raw, len);

  // Same chunk-framing offset as ClientSendsUnmasked: the chunk header for the
  // wslay frame occupies 3 bytes ("<1-digit-hex>\r\n"), so the first wslay
  // frame byte is at offset 3.
  ASSERT_GE(len, 5u) << "Too few bytes to inspect wslay frame inside chunk";

  EXPECT_EQ(bytes[3], 0x81u);

  bool is_masked = (bytes[4] & 0x80) != 0;
  EXPECT_FALSE(is_masked) << "Server sent a masked frame! web-stream must not use masking.";

  delete server;
  bufferevent_free(pair[1]);
}

// Verify that Close() delivers a terminal chunk to the peer and that the peer's
// on_close_ callback fires.  Also checks that calling Close() twice returns -1.
TEST_F(BufferEventWebStreamTest, CloseSignalsEOF) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_,
                                BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS,
                                pair);
  ASSERT_EQ(rv, 0);

  BufferEventWebStream* server = new BufferEventWebStream(pair[0], true /* is_server */);
  BufferEventWebStream* client = new BufferEventWebStream(pair[1], false /* is_server */);

  bool client_close_fired = false;

  server->SetOnOpen([&]() {
    // First Close() must succeed.
    EXPECT_EQ(server->Close(), 0);
    // Second Close() must return an error.
    EXPECT_EQ(server->Close(), -1);
  });

  client->SetOnClose([&]() {
    client_close_fired = true;
    event_base_loopbreak(base_);
  });

  server->Start();
  client->Start();

  event_base_dispatch(base_);

  EXPECT_TRUE(client_close_fired);
  // client self-deleted inside ReadCallback when it received the terminal chunk.
  // Only delete server.
  delete server;
}
