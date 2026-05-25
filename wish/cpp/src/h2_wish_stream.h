#ifndef WISH_CPP_SRC_H2_WISH_STREAM_H_
#define WISH_CPP_SRC_H2_WISH_STREAM_H_

#include <event2/buffer.h>
#include <nghttp2/nghttp2.h>

#include <functional>
#include <string>

// Forward-declare wslay types to avoid pulling in wslay.h in this header.
extern "C" {
struct wslay_event_context;
struct wslay_event_on_msg_recv_arg;
}

// H2WishStream implements the web-stream protocol over a single HTTP/2 stream.
//
// web-stream framing is layered on top of HTTP/2 DATA frames:
//   - Incoming DATA bytes are buffered and fed to wslay's receive path.
//   - wslay's send path writes framed bytes to an output buffer that is drained
//     by nghttp2's data-source read callback.
//
// The public API mirrors WishHandler so callers can switch transports with
// minimal changes.
class H2WishStream {
 public:
  using MessageCallback = std::function<void(uint8_t, const std::string&)>;
  using OpenCallback = std::function<void()>;
  using CloseCallback = std::function<void()>;

  // session  : the nghttp2 session that owns this stream (not transferred).
  // stream_id: HTTP/2 stream identifier.
  // is_server: true when this end is the HTTP/2 server.
  H2WishStream(nghttp2_session* session, int32_t stream_id, bool is_server);
  ~H2WishStream();

  void SetOnMessage(MessageCallback cb);
  void SetOnOpen(OpenCallback cb);
  void SetOnClose(CloseCallback cb);

  int SendText(const std::string& msg);
  int SendBinary(const std::string& msg);
  int SendTextMetadata(const std::string& msg);
  int SendBinaryMetadata(const std::string& msg);

  int32_t stream_id() const { return stream_id_; }

  // ---- Called by H2Server / H2Client session management ----

  // Append data received in an HTTP/2 DATA frame and run wslay recv.
  void OnDataChunk(const uint8_t* data, size_t len);

  // Signal that the HTTP/2 handshake for this stream is complete (200 received
  // on the client side, or HEADERS received on the server side).
  void OnOpen();

  // Signal that the HTTP/2 stream has been closed.
  void OnClose();

  // nghttp2 data-source read callback: drains output_buf_ into the HTTP/2
  // DATA frame buffer.  Returns NGHTTP2_ERR_DEFERRED when no data is ready.
  ssize_t ReadSendData(uint8_t* buf, size_t length, uint32_t* data_flags);

 private:
  nghttp2_session* h2session_;
  int32_t stream_id_;

  bool is_server_;
  wslay_event_context* ctx_;

  // Bytes received from HTTP/2 DATA frames, consumed by wslay recv.
  evbuffer* input_buf_;
  // Bytes produced by wslay send, consumed by the nghttp2 data provider.
  evbuffer* output_buf_;

  MessageCallback on_message_;
  OpenCallback on_open_;
  CloseCallback on_close_;

  // wslay callbacks
  static ssize_t WslayRecvCallback(wslay_event_context*, uint8_t*,
                                   size_t, int, void*);
  static ssize_t WslaySendCallback(wslay_event_context*,
                                   const uint8_t*, size_t, int, void*);
  static int WslayGenmaskCallback(wslay_event_context*, uint8_t*,
                                  size_t, void*);
  static void WslayOnMsgRecvCallback(
      wslay_event_context*,
      const wslay_event_on_msg_recv_arg*, void*);

  int SendMessage(uint8_t opcode, const std::string& msg);
};

#endif  // WISH_CPP_SRC_H2_WISH_STREAM_H_
