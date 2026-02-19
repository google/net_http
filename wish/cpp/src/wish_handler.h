#ifndef WISH_CPP_SRC_WISH_HANDLER_H_
#define WISH_CPP_SRC_WISH_HANDLER_H_

#include <string>
#include <vector>
#include <functional>
#include <memory>

#include <event2/bufferevent.h>
#include <event2/buffer.h>

// wslay forward decl
extern "C" {
struct wslay_event_context;
struct wslay_event_on_msg_recv_arg;
}

class WishHandler {
 public:
  using MessageCallback = std::function<void(uint8_t opcode, const std::string&)>;
  using OpenCallback = std::function<void()>;

  // Constructor takes an already created bufferevent
  WishHandler(struct bufferevent* bev, bool is_server);
  ~WishHandler();

  // Start the handler (sets up callbacks and enables events)
  void Start();

  // Send methods
  int SendText(const std::string& msg);
  int SendBinary(const std::string& msg);
  int SendMetadata(bool is_text, const std::string& msg);

  void SetOnMessage(MessageCallback cb);
  void SetOnOpen(OpenCallback cb);

 private:
  struct bufferevent* bev_;
  bool is_server_;
  struct wslay_event_context* ctx_;
  MessageCallback on_message_;
  OpenCallback on_open_;

  enum State {
    HANDSHAKE,
    OPEN,
    CLOSED
  };
  State state_;

  // wslay callbacks
  static ssize_t RecvCallback(struct wslay_event_context *ctx, uint8_t *buf, size_t len, int flags, void *user_data);
  static ssize_t SendCallback(struct wslay_event_context *ctx, const uint8_t *data, size_t len, int flags, void *user_data);
  static int GenMaskCallback(struct wslay_event_context *ctx, uint8_t *buf, size_t len, void *user_data);
  static void OnMsgRecvCallback(struct wslay_event_context *ctx, const struct wslay_event_on_msg_recv_arg *arg, void *user_data);

  // libevent callbacks
  static void ReadCallback(struct bufferevent *bev, void *ctx);
  // We might not need a write callback unless we want flow control
  // static void WriteCallback(struct bufferevent *bev, void *ctx);
  static void EventCallback(struct bufferevent *bev, short events, void *ctx);

  void HandleHandshake();
  bool ReadHttpRequest();
  bool ReadHttpResponse();
  void SendHttpResponse(const std::string& status, const std::string& content_type);
  void SendHttpRequest();

  int SendMessage(uint8_t opcode, const std::string& msg);
};

#endif // WISH_CPP_SRC_WISH_HANDLER_H_
