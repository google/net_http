#ifndef WISH_CPP_SRC_WISH_HANDLER_H_
#define WISH_CPP_SRC_WISH_HANDLER_H_

#include <event2/buffer.h>
#include <event2/bufferevent.h>

#include <functional>
#include <memory>
#include <string>
#include <vector>

// wslay forward decl
extern "C" {
struct wslay_event_context;
struct wslay_event_on_msg_recv_arg;
}

const uint8_t WISH_OPCODE_TEXT = 1;
const uint8_t WISH_OPCODE_BINARY = 2;
const uint8_t WISH_OPCODE_TEXT_METADATA = 3;
const uint8_t WISH_OPCODE_BINARY_METADATA = 4;

// WishHandler implements the WiSH Procotol defined at https://datatracker.ietf.org/doc/html/draft-yoshino-wish
//
// It manages the lifecycle of a single WiSH connection, including the initial HTTP handshake and subsequent message framing/parsing.
//
// It uses libevent's bufferevent for async I/O. The underlying transport should be provided through it.
class WishHandler {
 public:
  using MessageCallback =
      std::function<void(uint8_t opcode, const std::string&)>;
  using OpenCallback = std::function<void()>;
  using CloseCallback = std::function<void()>;

  // Constructor takes an already created bufferevent
  WishHandler(struct bufferevent* bev, bool is_server);
  ~WishHandler();

  // Start the handler (sets up callbacks and enables events)
  void Start();

  // Send methods
  int SendText(const std::string& msg);
  int SendBinary(const std::string& msg);
  int SendTextMetadata(const std::string& msg);
  int SendBinaryMetadata(const std::string& msg);

  void SetOnMessage(MessageCallback cb);
  void SetOnOpen(OpenCallback cb);
  void SetOnClose(CloseCallback cb);

 private:
  struct bufferevent* bev_;
  bool is_server_;
  struct wslay_event_context* ctx_;
  MessageCallback on_message_;
  OpenCallback on_open_;
  CloseCallback on_close_;

  enum State { HANDSHAKE,
               OPEN,
               CLOSED };
  State state_;

  // wslay callbacks
  static ssize_t RecvCallback(struct wslay_event_context* ctx, uint8_t* buf,
                              size_t len, int flags, void* user_data);
  static ssize_t SendCallback(struct wslay_event_context* ctx,
                              const uint8_t* data, size_t len, int flags,
                              void* user_data);
  static int GenMaskCallback(struct wslay_event_context* ctx, uint8_t* buf,
                             size_t len, void* user_data);
  static void OnMsgRecvCallback(struct wslay_event_context* ctx,
                                const struct wslay_event_on_msg_recv_arg* arg,
                                void* user_data);

  // libevent callbacks
  static void ReadCallback(struct bufferevent* bev, void* ctx);
  // We might not need a write callback unless we want flow control
  // static void WriteCallback(struct bufferevent *bev, void *ctx);
  static void EventCallback(struct bufferevent* bev, short events, void* ctx);

  void HandleHandshake();
  bool ReadHttpRequest();
  bool ReadHttpResponse();
  void SendHttpResponse(const std::string& status,
                        const std::string& content_type);
  void SendHttpRequest();

  int SendMessage(uint8_t opcode, const std::string& msg);
};

#endif  // WISH_CPP_SRC_WISH_HANDLER_H_
