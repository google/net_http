#include "wish_handler.h"
#include <gtest/gtest.h>
#include <event2/bufferevent.h>
#include <event2/event.h>
#include <memory>
#include <string>

class WishHandlerTest : public ::testing::Test {
 protected:
  void SetUp() override {
    base_ = event_base_new();
    ASSERT_NE(base_, nullptr);

    struct bufferevent* pair[2];
    int res = bufferevent_pair_new(base_, BEV_OPT_CLOSE_ON_FREE | BEV_OPT_DEFER_CALLBACKS, pair);
    ASSERT_EQ(res, 0);

    server_bev_ = pair[0];
    client_bev_ = pair[1];
  }

  void TearDown() override {
    event_base_free(base_);
  }

  struct event_base* base_ = nullptr;
  struct bufferevent* server_bev_ = nullptr;
  struct bufferevent* client_bev_ = nullptr;
};

TEST_F(WishHandlerTest, HandshakeAndSimpleExchange) {
  // We allocate on heap because EventCallback might execute `delete handler`.
  // To avoid this causing problems, we ensure we don't double delete.
  WishHandler* server = new WishHandler(server_bev_, true /* is_server */);
  WishHandler* client = new WishHandler(client_bev_, false /* is_server */);

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
    if (opcode == WISH_OPCODE_TEXT) received_from_client = msg;
    check_done();
  });

  client->SetOnMessage([&](uint8_t opcode, const std::string& msg) {
    if (opcode == WISH_OPCODE_TEXT) received_from_server = msg;
    check_done();
  });

  server->Start();
  client->Start();

  event_base_dispatch(base_);

  EXPECT_TRUE(client_opened);
  EXPECT_TRUE(server_opened);

  EXPECT_EQ(received_from_client, "Hello, Server!");
  EXPECT_EQ(received_from_server, "Hello, Client!");

  // Clean up
  // If connection is still alive, we can safely delete them.
  // Their destructors will free the bufferevents and wslay contexts.
  delete server;
  delete client;
}
