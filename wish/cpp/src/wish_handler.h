#ifndef WISH_CPP_SRC_WISH_HANDLER_H_
#define WISH_CPP_SRC_WISH_HANDLER_H_

#include <string>
#include <vector>
#include <functional>
#include <memory>

#include "socket_utils.h"

// wslay forward decl
extern "C" {
struct wslay_event_context;
struct wslay_event_on_msg_recv_arg;
}

class WishHandler {
 public:
  using MessageCallback = std::function<void(uint8_t opcode, const std::string&)>;

  WishHandler(Socket& socket, bool is_server);
  ~WishHandler();

  // Perform the WiSH HTTP handshake
  // Returns true on success
  bool Handshake();

  // Send a text message (opcode 1)
  // Returns 0 on success, error code otherwise
  int SendText(const std::string& msg);

  // Send a binary message (opcode 2)
  int SendBinary(const std::string& msg);
  
  // Send a metadata message (opcode 3 for text, 4 for binary)
  int SendMetadata(bool is_text, const std::string& msg);

  // Process incoming data (call this in a loop or when data is available)
  // Returns true if connection is active, false if closed/error
  bool Process();

  void SetOnMessage(MessageCallback cb);

 private:
  Socket& socket_;
  bool is_server_;
  struct wslay_event_context* ctx_;
  MessageCallback on_message_;

  // Callbacks for wslay
  static ssize_t RecvCallback(struct wslay_event_context *ctx, uint8_t *buf, size_t len, int flags, void *user_data);
  static ssize_t SendCallback(struct wslay_event_context *ctx, const uint8_t *data, size_t len, int flags, void *user_data);
  static int GenMaskCallback(struct wslay_event_context *ctx, uint8_t *buf, size_t len, void *user_data);
  static void OnMsgRecvCallback(struct wslay_event_context *ctx, const struct wslay_event_on_msg_recv_arg *arg, void *user_data);

  int SendMessage(uint8_t opcode, const std::string& msg);

  bool SendHttpResponse(const std::string& status, const std::string& content_type);
  bool ReadHttpRequest();
  bool SendHttpRequest();
  bool ReadHttpResponse();
};

#endif // WISH_CPP_SRC_WISH_HANDLER_H_
