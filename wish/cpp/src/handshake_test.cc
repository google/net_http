#include "handshake.h"

#include <event2/buffer.h>
#include <event2/bufferevent.h>
#include <event2/event.h>
#include <gtest/gtest.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <unistd.h>

#include <cstring>
#include <string>
#include <memory>

class HandshakeTest : public ::testing::Test {
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

// Helper to read all available data from a bufferevent.
static std::string ReadAllData(bufferevent* bev) {
  evbuffer* input = bufferevent_get_input(bev);
  size_t len = evbuffer_get_length(input);
  if (len == 0) return "";
  std::string data(len, '\0');
  evbuffer_remove(input, &data[0], len);
  return data;
}

TEST_F(HandshakeTest, ClientHandshakeSuccess) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_,
                                BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS,
                                pair);
  ASSERT_EQ(rv, 0);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  bool open_called = false;
  bool error_called = false;
  bufferevent* client_bev = nullptr;

  auto client = std::make_unique<ClientHandshake>(
      pair[0],
      [&](bufferevent* bev) {
        open_called = true;
        client_bev = bev;
        event_base_loopbreak(base_);
      },
      [&]() {
        error_called = true;
        event_base_loopbreak(base_);
      });
  client->Start();

  // Run loop until client writes the request to pair[0] and it flows to pair[1].
  int limit = 100;
  while (evbuffer_get_length(bufferevent_get_input(pair[1])) == 0 && --limit > 0) {
    event_base_loop(base_, EVLOOP_NONBLOCK);
  }
  ASSERT_GT(limit, 0) << "Timed out waiting for client request";

  // Read request sent by client on pair[1].
  std::string request = ReadAllData(pair[1]);
  EXPECT_NE(request.find("POST / HTTP/1.1"), std::string::npos);
  EXPECT_NE(request.find("Content-Type: application/web-stream"), std::string::npos);

  // Send a valid HTTP 200 OK response from server side.
  const char* response = "HTTP/1.1 200 OK\r\nContent-Type: application/web-stream\r\nTransfer-Encoding: chunked\r\n\r\n";
  bufferevent_write(pair[1], response, strlen(response));

  // Run loop to let client process response.
  event_base_dispatch(base_);

  EXPECT_TRUE(open_called);
  EXPECT_FALSE(error_called);
  EXPECT_NE(client_bev, nullptr);

  if (client_bev) {
    bufferevent_free(client_bev);
  }
  bufferevent_free(pair[1]);
}

TEST_F(HandshakeTest, ClientHandshakeFailureBadStatus) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_,
                                BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS,
                                pair);
  ASSERT_EQ(rv, 0);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  bool open_called = false;
  bool error_called = false;

  auto client = std::make_unique<ClientHandshake>(
      pair[0],
      [&](bufferevent* bev) {
        open_called = true;
        bufferevent_free(bev);
        event_base_loopbreak(base_);
      },
      [&]() {
        error_called = true;
        event_base_loopbreak(base_);
      });
  client->Start();

  // Run loop until client writes the request.
  int limit = 100;
  while (evbuffer_get_length(bufferevent_get_input(pair[1])) == 0 && --limit > 0) {
    event_base_loop(base_, EVLOOP_NONBLOCK);
  }
  ASSERT_GT(limit, 0) << "Timed out waiting for client request";

  // Read request to clear buffer.
  std::string request = ReadAllData(pair[1]);
  (void)request;

  // Send invalid status response.
  const char* response = "HTTP/1.1 400 Bad Request\r\nContent-Type: text/plain\r\n\r\n";
  bufferevent_write(pair[1], response, strlen(response));

  // Run loop.
  event_base_dispatch(base_);

  EXPECT_FALSE(open_called);
  EXPECT_TRUE(error_called);

  bufferevent_free(pair[1]);
}

TEST_F(HandshakeTest, ClientHandshakeEventError) {
  int fds[2];
  int rv = socketpair(AF_UNIX, SOCK_STREAM, 0, fds);
  ASSERT_EQ(rv, 0);

  bufferevent* pair[2];
  pair[0] = bufferevent_socket_new(base_, fds[0], BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS);
  pair[1] = bufferevent_socket_new(base_, fds[1], BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS);
  ASSERT_NE(pair[0], nullptr);
  ASSERT_NE(pair[1], nullptr);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  bool open_called = false;
  bool error_called = false;

  auto client = std::make_unique<ClientHandshake>(
      pair[0],
      [&](bufferevent* bev) {
        open_called = true;
        bufferevent_free(bev);
        event_base_loopbreak(base_);
      },
      [&]() {
        error_called = true;
        event_base_loopbreak(base_);
      });
  client->Start();

  // Wait until client writes request and it's sent over OS socket.
  int limit = 100;
  while (evbuffer_get_length(bufferevent_get_input(pair[1])) == 0 && --limit > 0) {
    event_base_loop(base_, EVLOOP_NONBLOCK);
  }
  ASSERT_GT(limit, 0) << "Timed out waiting for client request";

  // Close the server side socket/bufferevent to trigger EOF on client side.
  bufferevent_free(pair[1]);

  event_base_dispatch(base_);

  EXPECT_FALSE(open_called);
  EXPECT_TRUE(error_called);
}

TEST_F(HandshakeTest, ServerHandshakeSuccess) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_,
                                BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS,
                                pair);
  ASSERT_EQ(rv, 0);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  bool open_called = false;
  bool error_called = false;
  bufferevent* server_bev = nullptr;

  auto* server = new ServerHandshake(
      pair[0],
      [&](bufferevent* bev) {
        open_called = true;
        server_bev = bev;
        event_base_loopbreak(base_);
      },
      [&]() {
        error_called = true;
        event_base_loopbreak(base_);
      });
  server->Start();

  // Send valid HTTP POST request from client side.
  const char* request = "POST / HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/web-stream\r\n\r\n";
  bufferevent_write(pair[1], request, strlen(request));

  // Run event loop to let server process request and write response.
  event_base_dispatch(base_);

  EXPECT_TRUE(open_called);
  EXPECT_FALSE(error_called);
  EXPECT_NE(server_bev, nullptr);

  // Run loop to let the response flow from server_bev (pair[0]) to pair[1].
  int limit = 100;
  while (evbuffer_get_length(bufferevent_get_input(pair[1])) == 0 && --limit > 0) {
    event_base_loop(base_, EVLOOP_NONBLOCK);
  }
  ASSERT_GT(limit, 0) << "Timed out waiting for server response";

  // Read response sent by server.
  std::string response = ReadAllData(pair[1]);
  EXPECT_NE(response.find("HTTP/1.1 200 OK"), std::string::npos);
  EXPECT_NE(response.find("Content-Type: application/web-stream"), std::string::npos);

  if (server_bev) {
    bufferevent_free(server_bev);
  }
  bufferevent_free(pair[1]);
}

TEST_F(HandshakeTest, ServerHandshakeFailureBadContentType) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_,
                                BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS,
                                pair);
  ASSERT_EQ(rv, 0);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  bool open_called = false;
  bool error_called = false;

  auto* server = new ServerHandshake(
      pair[0],
      [&](bufferevent* bev) {
        open_called = true;
        bufferevent_free(bev);
        event_base_loopbreak(base_);
      },
      [&]() {
        error_called = true;
        event_base_loopbreak(base_);
      });
  server->Start();

  // Send request with invalid content type.
  const char* request = "POST / HTTP/1.1\r\nHost: localhost\r\nContent-Type: text/html\r\n\r\n";
  bufferevent_write(pair[1], request, strlen(request));

  event_base_dispatch(base_);

  EXPECT_FALSE(open_called);
  EXPECT_TRUE(error_called);

  bufferevent_free(pair[1]);
}

TEST_F(HandshakeTest, ServerHandshakeEventError) {
  int fds[2];
  int rv = socketpair(AF_UNIX, SOCK_STREAM, 0, fds);
  ASSERT_EQ(rv, 0);

  bufferevent* pair[2];
  pair[0] = bufferevent_socket_new(base_, fds[0], BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS);
  pair[1] = bufferevent_socket_new(base_, fds[1], BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS);
  ASSERT_NE(pair[0], nullptr);
  ASSERT_NE(pair[1], nullptr);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  bool open_called = false;
  bool error_called = false;

  auto* server = new ServerHandshake(
      pair[0],
      [&](bufferevent* bev) {
        open_called = true;
        bufferevent_free(bev);
        event_base_loopbreak(base_);
      },
      [&]() {
        error_called = true;
        event_base_loopbreak(base_);
      });
  server->Start();

  // Send half of the request headers, then close client side.
  const char* partial_request = "POST / HTTP/1.1\r\nHost: localhost\r\n";
  bufferevent_write(pair[1], partial_request, strlen(partial_request));

  // Wait until partial request flows to server side.
  int limit = 100;
  while (evbuffer_get_length(bufferevent_get_input(pair[0])) == 0 && --limit > 0) {
    event_base_loop(base_, EVLOOP_NONBLOCK);
  }
  ASSERT_GT(limit, 0) << "Timed out waiting for partial request";

  // Close client side to trigger event error on server side.
  bufferevent_free(pair[1]);

  event_base_dispatch(base_);

  EXPECT_FALSE(open_called);
  EXPECT_TRUE(error_called);
}

TEST_F(HandshakeTest, ClientHandshakeRejectsContentEncoding) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_, BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS, pair);
  ASSERT_EQ(rv, 0);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  bool open_called = false;
  bool error_called = false;
  auto client = std::make_unique<ClientHandshake>(
      pair[0],
      [&](bufferevent* bev) { open_called = true; bufferevent_free(bev); event_base_loopbreak(base_); },
      [&]() { error_called = true; event_base_loopbreak(base_); });
  client->Start();

  int limit = 100;
  while (evbuffer_get_length(bufferevent_get_input(pair[1])) == 0 && --limit > 0) {
    event_base_loop(base_, EVLOOP_NONBLOCK);
  }
  std::string req = ReadAllData(pair[1]); (void)req;

  const char* response = "HTTP/1.1 200 OK\r\nContent-Type: application/web-stream\r\nContent-Encoding: gzip\r\nTransfer-Encoding: chunked\r\n\r\n";
  bufferevent_write(pair[1], response, strlen(response));
  event_base_dispatch(base_);

  EXPECT_FALSE(open_called);
  EXPECT_TRUE(error_called);
  bufferevent_free(pair[1]);
}

TEST_F(HandshakeTest, ClientHandshakeRejectsContentLength) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_, BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS, pair);
  ASSERT_EQ(rv, 0);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  bool open_called = false;
  bool error_called = false;
  auto client = std::make_unique<ClientHandshake>(
      pair[0],
      [&](bufferevent* bev) { open_called = true; bufferevent_free(bev); event_base_loopbreak(base_); },
      [&]() { error_called = true; event_base_loopbreak(base_); });
  client->Start();

  int limit = 100;
  while (evbuffer_get_length(bufferevent_get_input(pair[1])) == 0 && --limit > 0) {
    event_base_loop(base_, EVLOOP_NONBLOCK);
  }
  std::string req = ReadAllData(pair[1]); (void)req;

  const char* response = "HTTP/1.1 200 OK\r\nContent-Type: application/web-stream\r\nContent-Length: 10\r\nTransfer-Encoding: chunked\r\n\r\n";
  bufferevent_write(pair[1], response, strlen(response));
  event_base_dispatch(base_);

  EXPECT_FALSE(open_called);
  EXPECT_TRUE(error_called);
  bufferevent_free(pair[1]);
}

TEST_F(HandshakeTest, ClientHandshakeRejectsConnectionClose) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_, BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS, pair);
  ASSERT_EQ(rv, 0);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  bool open_called = false;
  bool error_called = false;
  auto client = std::make_unique<ClientHandshake>(
      pair[0],
      [&](bufferevent* bev) { open_called = true; bufferevent_free(bev); event_base_loopbreak(base_); },
      [&]() { error_called = true; event_base_loopbreak(base_); });
  client->Start();

  int limit = 100;
  while (evbuffer_get_length(bufferevent_get_input(pair[1])) == 0 && --limit > 0) {
    event_base_loop(base_, EVLOOP_NONBLOCK);
  }
  std::string req = ReadAllData(pair[1]); (void)req;

  const char* response = "HTTP/1.1 200 OK\r\nContent-Type: application/web-stream\r\nConnection: close\r\nTransfer-Encoding: chunked\r\n\r\n";
  bufferevent_write(pair[1], response, strlen(response));
  event_base_dispatch(base_);

  EXPECT_FALSE(open_called);
  EXPECT_TRUE(error_called);
  bufferevent_free(pair[1]);
}

TEST_F(HandshakeTest, ClientHandshakeRejectsNonChunkedTransferEncoding) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_, BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS, pair);
  ASSERT_EQ(rv, 0);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  bool open_called = false;
  bool error_called = false;
  auto client = std::make_unique<ClientHandshake>(
      pair[0],
      [&](bufferevent* bev) { open_called = true; bufferevent_free(bev); event_base_loopbreak(base_); },
      [&]() { error_called = true; event_base_loopbreak(base_); });
  client->Start();

  int limit = 100;
  while (evbuffer_get_length(bufferevent_get_input(pair[1])) == 0 && --limit > 0) {
    event_base_loop(base_, EVLOOP_NONBLOCK);
  }
  std::string req = ReadAllData(pair[1]); (void)req;

  const char* response = "HTTP/1.1 200 OK\r\nContent-Type: application/web-stream\r\nTransfer-Encoding: gzip\r\n\r\n";
  bufferevent_write(pair[1], response, strlen(response));
  event_base_dispatch(base_);

  EXPECT_FALSE(open_called);
  EXPECT_TRUE(error_called);
  bufferevent_free(pair[1]);
}

TEST_F(HandshakeTest, ClientHandshakeRejectsUpgradeHeader) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_, BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS, pair);
  ASSERT_EQ(rv, 0);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  bool open_called = false;
  bool error_called = false;
  auto client = std::make_unique<ClientHandshake>(
      pair[0],
      [&](bufferevent* bev) { open_called = true; bufferevent_free(bev); event_base_loopbreak(base_); },
      [&]() { error_called = true; event_base_loopbreak(base_); });
  client->Start();

  int limit = 100;
  while (evbuffer_get_length(bufferevent_get_input(pair[1])) == 0 && --limit > 0) {
    event_base_loop(base_, EVLOOP_NONBLOCK);
  }
  std::string req = ReadAllData(pair[1]); (void)req;

  const char* response = "HTTP/1.1 200 OK\r\nContent-Type: application/web-stream\r\nUpgrade: websocket\r\nTransfer-Encoding: chunked\r\n\r\n";
  bufferevent_write(pair[1], response, strlen(response));
  event_base_dispatch(base_);

  EXPECT_FALSE(open_called);
  EXPECT_TRUE(error_called);
  bufferevent_free(pair[1]);
}

TEST_F(HandshakeTest, ClientHandshakeRejectsHTTP10) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_, BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS, pair);
  ASSERT_EQ(rv, 0);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  bool open_called = false;
  bool error_called = false;
  auto client = std::make_unique<ClientHandshake>(
      pair[0],
      [&](bufferevent* bev) { open_called = true; bufferevent_free(bev); event_base_loopbreak(base_); },
      [&]() { error_called = true; event_base_loopbreak(base_); });
  client->Start();

  int limit = 100;
  while (evbuffer_get_length(bufferevent_get_input(pair[1])) == 0 && --limit > 0) {
    event_base_loop(base_, EVLOOP_NONBLOCK);
  }
  std::string req = ReadAllData(pair[1]); (void)req;

  const char* response = "HTTP/1.0 200 OK\r\nContent-Type: application/web-stream\r\nTransfer-Encoding: chunked\r\n\r\n";
  bufferevent_write(pair[1], response, strlen(response));
  event_base_dispatch(base_);

  EXPECT_FALSE(open_called);
  EXPECT_TRUE(error_called);
  bufferevent_free(pair[1]);
}

TEST_F(HandshakeTest, ClientHandshakeRejectsMultipleTransferEncodings) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_, BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS, pair);
  ASSERT_EQ(rv, 0);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  bool open_called = false;
  bool error_called = false;
  auto client = std::make_unique<ClientHandshake>(
      pair[0],
      [&](bufferevent* bev) { open_called = true; bufferevent_free(bev); event_base_loopbreak(base_); },
      [&]() { error_called = true; event_base_loopbreak(base_); });
  client->Start();

  int limit = 100;
  while (evbuffer_get_length(bufferevent_get_input(pair[1])) == 0 && --limit > 0) {
    event_base_loop(base_, EVLOOP_NONBLOCK);
  }
  std::string req = ReadAllData(pair[1]); (void)req;

  const char* response = "HTTP/1.1 200 OK\r\nContent-Type: application/web-stream\r\nTransfer-Encoding: chunked, gzip\r\n\r\n";
  bufferevent_write(pair[1], response, strlen(response));
  event_base_dispatch(base_);

  EXPECT_FALSE(open_called);
  EXPECT_TRUE(error_called);
  bufferevent_free(pair[1]);
}

TEST_F(HandshakeTest, ServerHandshakeRejectsContentEncoding) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_, BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS, pair);
  ASSERT_EQ(rv, 0);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  bool open_called = false;
  bool error_called = false;
  auto* server = new ServerHandshake(
      pair[0],
      [&](bufferevent* bev) { open_called = true; bufferevent_free(bev); event_base_loopbreak(base_); },
      [&]() { error_called = true; event_base_loopbreak(base_); });
  server->Start();

  const char* request = "POST / HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/web-stream\r\nContent-Encoding: gzip\r\n\r\n";
  bufferevent_write(pair[1], request, strlen(request));
  event_base_dispatch(base_);

  EXPECT_FALSE(open_called);
  EXPECT_TRUE(error_called);
  bufferevent_free(pair[1]);
}

TEST_F(HandshakeTest, ServerHandshakeRejectsContentLength) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_, BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS, pair);
  ASSERT_EQ(rv, 0);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  bool open_called = false;
  bool error_called = false;
  auto* server = new ServerHandshake(
      pair[0],
      [&](bufferevent* bev) { open_called = true; bufferevent_free(bev); event_base_loopbreak(base_); },
      [&]() { error_called = true; event_base_loopbreak(base_); });
  server->Start();

  const char* request = "POST / HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/web-stream\r\nContent-Length: 100\r\n\r\n";
  bufferevent_write(pair[1], request, strlen(request));
  event_base_dispatch(base_);

  EXPECT_FALSE(open_called);
  EXPECT_TRUE(error_called);
  bufferevent_free(pair[1]);
}

TEST_F(HandshakeTest, ServerHandshakeRejectsConnectionClose) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_, BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS, pair);
  ASSERT_EQ(rv, 0);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  bool open_called = false;
  bool error_called = false;
  auto* server = new ServerHandshake(
      pair[0],
      [&](bufferevent* bev) { open_called = true; bufferevent_free(bev); event_base_loopbreak(base_); },
      [&]() { error_called = true; event_base_loopbreak(base_); });
  server->Start();

  const char* request = "POST / HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/web-stream\r\nConnection: close\r\n\r\n";
  bufferevent_write(pair[1], request, strlen(request));
  event_base_dispatch(base_);

  EXPECT_FALSE(open_called);
  EXPECT_TRUE(error_called);
  bufferevent_free(pair[1]);
}

TEST_F(HandshakeTest, ServerHandshakeRejectsNonChunkedTransferEncoding) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_, BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS, pair);
  ASSERT_EQ(rv, 0);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  bool open_called = false;
  bool error_called = false;
  auto* server = new ServerHandshake(
      pair[0],
      [&](bufferevent* bev) { open_called = true; bufferevent_free(bev); event_base_loopbreak(base_); },
      [&]() { error_called = true; event_base_loopbreak(base_); });
  server->Start();

  const char* request = "POST / HTTP/1.1\r\nHost: localhost\r\nContent-Type: application/web-stream\r\nTransfer-Encoding: gzip\r\n\r\n";
  bufferevent_write(pair[1], request, strlen(request));
  event_base_dispatch(base_);

  EXPECT_FALSE(open_called);
  EXPECT_TRUE(error_called);
  bufferevent_free(pair[1]);
}

TEST_F(HandshakeTest, ServerHandshakeRejectsHTTP10) {
  bufferevent* pair[2];
  int rv = bufferevent_pair_new(base_, BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS, pair);
  ASSERT_EQ(rv, 0);
  bufferevent_enable(pair[1], EV_READ | EV_WRITE);

  bool open_called = false;
  bool error_called = false;
  auto* server = new ServerHandshake(
      pair[0],
      [&](bufferevent* bev) { open_called = true; bufferevent_free(bev); event_base_loopbreak(base_); },
      [&]() { error_called = true; event_base_loopbreak(base_); });
  server->Start();

  const char* request = "POST / HTTP/1.0\r\nHost: localhost\r\nContent-Type: application/web-stream\r\n\r\n";
  bufferevent_write(pair[1], request, strlen(request));
  event_base_dispatch(base_);

  EXPECT_FALSE(open_called);
  EXPECT_TRUE(error_called);
  bufferevent_free(pair[1]);
}
