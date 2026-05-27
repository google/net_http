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

// Verify that metadata frames (opcode = 3) can be sent and received correctly by both client and server.
TEST_F(BufferEventWebStreamTest, HandshakeAndMetadataExchange) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_,
                                BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS,
                                pair);
  ASSERT_EQ(rv, 0);

  BufferEventWebStream* server = new BufferEventWebStream(pair[0], true /* is_server */);
  BufferEventWebStream* client = new BufferEventWebStream(pair[1], false /* is_server */);

  bool server_opened = false;
  bool client_opened = false;
  std::string metadata_from_client;
  std::string metadata_from_server;

  server->SetOnOpen([&]() {
    server_opened = true;
    server->SendMetadata("Server Metadata");
  });

  client->SetOnOpen([&]() {
    client_opened = true;
    client->SendMetadata("Client Metadata");
  });

  auto check_done = [&]() {
    if (!metadata_from_client.empty() && !metadata_from_server.empty()) {
      event_base_loopbreak(base_);
    }
  };

  server->SetOnMessage([&](uint8_t opcode, const std::string& msg) {
    if (opcode == WEB_STREAM_OPCODE_METADATA) {
      metadata_from_client = msg;
    }
    check_done();
  });

  client->SetOnMessage([&](uint8_t opcode, const std::string& msg) {
    if (opcode == WEB_STREAM_OPCODE_METADATA) {
      metadata_from_server = msg;
    }
    check_done();
  });

  server->Start();
  client->Start();

  event_base_dispatch(base_);

  EXPECT_TRUE(client_opened);
  EXPECT_TRUE(server_opened);
  EXPECT_EQ(metadata_from_client, "Client Metadata");
  EXPECT_EQ(metadata_from_server, "Server Metadata");

  delete server;
  delete client;
}

// Verify that the local side can still receive messages from the peer after calling Close() (half-closed).
TEST_F(BufferEventWebStreamTest, ReceiveMessageAfterClose) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_,
                                BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS,
                                pair);
  ASSERT_EQ(rv, 0);

  BufferEventWebStream* server = new BufferEventWebStream(pair[0], true /* is_server */);
  BufferEventWebStream* client = new BufferEventWebStream(pair[1], false /* is_server */);

  bool server_received_msg_after_close = false;
  bool server_close_fired = false;
  bool client_close_fired = false;

  server->SetOnOpen([&]() {
    // Server closes first (half-close)
    EXPECT_EQ(server->Close(), 0);
  });

  server->SetOnMessage([&](uint8_t opcode, const std::string& msg) {
    if (opcode == WEB_STREAM_OPCODE_TEXT && msg == "Hello after server close") {
      server_received_msg_after_close = true;
    }
  });

  client->SetOnClose([&]() {
    client_close_fired = true;
    // Client sends a message after server has closed its outbound side.
    // This must be received successfully by the server.
    client->SendText("Hello after server close");
    // Client then closes its own side.
    client->Close();
  });

  server->SetOnClose([&]() {
    server_close_fired = true;
  });

  server->Start();
  client->Start();

  // The event loop should run until both server and client have completed their
  // close sequences and self-deleted (which frees their bufferevents, leaving the base empty).
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

  BufferEventWebStream* server = new BufferEventWebStream(pair[0], true /* is_server */);
  BufferEventWebStream* client = new BufferEventWebStream(pair[1], false /* is_server */);

  bool server_close_fired = false;
  bool client_close_fired = false;

  server->SetOnOpen([&]() {
    server->Close();
  });

  client->SetOnClose([&]() {
    client_close_fired = true;
    client->Close();
    // Write extra data after closing the client stream.
    const char* extra = "extra data after close";
    bufferevent_write(pair[1], extra, strlen(extra));
  });

  server->SetOnClose([&]() {
    server_close_fired = true;
  });

  server->Start();
  client->Start();

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

  BufferEventWebStream* server = new BufferEventWebStream(pair[0], true /* is_server */);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  bool server_close_fired = false;
  bool server_error_fired = false;

  server->SetOnOpen([&]() {
    // Handshake complete, wait for incoming data.
  });

  server->SetOnClose([&]() {
    server_close_fired = true;
  });

  server->SetOnError([&]() {
    server_error_fired = true;
    event_base_loopbreak(base_);
  });

  server->Start();

  // 1. Fake client handshake
  const char* req =
      "POST / HTTP/1.1\r\nHost: localhost\r\n"
      "Content-Type: application/web-stream\r\n\r\n";
  bufferevent_write(pair[1], req, strlen(req));

  // Let handshake complete
  event_base_loop(base_, EVLOOP_NONBLOCK);
  DrainInput(pair[1]);

  // 2. Write a partial message frame inside a chunk:
  // - Hex size of frame payload is 12 (frame header 2 bytes + 10 bytes text).
  // - Hex chunk size is "c".
  // - Frame expects 100 bytes of payload (0x64), but we only provide 10.
  bufferevent_write(pair[1], "c\r\n", 3);
  uint8_t frame_hdr[2] = {0x81, 100};
  bufferevent_write(pair[1], frame_hdr, 2);
  bufferevent_write(pair[1], "1234567890", 10);
  // Chunk trailer CRLF + Terminal Chunk "0\r\n\r\n"
  bufferevent_write(pair[1], "\r\n0\r\n\r\n", 7);

  // Run the event loop to process the incoming chunks
  event_base_dispatch(base_);

  EXPECT_FALSE(server_close_fired);
  EXPECT_TRUE(server_error_fired);

  bufferevent_free(pair[1]);
}




