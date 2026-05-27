#ifndef WISH_CPP_SRC_NGHTTP2_WEB_STREAM_H_
#define WISH_CPP_SRC_NGHTTP2_WEB_STREAM_H_

#include <event2/buffer.h>
#include <nghttp2/nghttp2.h>

#include <functional>
#include <string>

#include "web_stream.h"

// Forward-declare wslay types to avoid pulling in wslay.h in this header.
extern "C" {
struct wslay_event_context;
struct wslay_event_on_msg_recv_arg;
}

// NGHTTP2WebStream implements the web-stream protocol over a single HTTP/2 stream.
//
// web-stream framing is layered on top of HTTP/2 DATA frames:
//   - Incoming DATA bytes are buffered and fed to wslay's receive path.
//   - wslay's send path writes framed bytes to an output buffer that is drained
//     by nghttp2's data-source read callback.
//
// The public API mirrors BufferEventWebStream so callers can switch transports with
// minimal changes.
class NGHTTP2WebStream : public WebStream {
 public:
  // session  : the nghttp2 session that owns this stream (not transferred).
  // stream_id: HTTP/2 stream identifier.
  // is_server: true when this end is the HTTP/2 server.
  NGHTTP2WebStream(nghttp2_session* session,
                   int32_t stream_id,
                   bool is_server);
  ~NGHTTP2WebStream() override;

  void SetOnMessage(MessageCallback cb) override;
  void SetOnOpen(OpenCallback cb) override;
  void SetOnClose(CloseCallback cb) override;

  int SendText(const std::string& msg) override;
  int SendBinary(const std::string& msg) override;
  int SendMetadata(const std::string& msg) override;

  // Signal EOF on the outbound HTTP/2 DATA stream by setting END_STREAM.
  // Returns 0 on success, or -1 if Close() has already been called.
  int Close() override;

  int32_t stream_id() const { return stream_id_; }

  // ---- Called by H2Server / H2Client session management ----

  // Append data received in an HTTP/2 DATA frame and run wslay recv.
  void OnDataChunk(const uint8_t* data,
                   size_t len);

  // Signal that the HTTP/2 handshake for this stream is complete (200 received
  // on the client side, or HEADERS received on the server side).
  void OnOpen();

  // Signal that the HTTP/2 stream has been closed.
  void OnClose();

  // nghttp2 data-source read callback: drains output_buf_ into the HTTP/2
  // DATA frame buffer.  Returns NGHTTP2_ERR_DEFERRED when no data is ready.
  nghttp2_ssize ReadSendData(uint8_t* buf,
                             size_t length,
                             uint32_t* data_flags);

 private:
  nghttp2_session* h2session_;
  int32_t stream_id_;

  // Bytes received from HTTP/2 DATA frames, consumed by wslay recv.
  evbuffer* input_buf_;
  // Bytes produced by wslay send, consumed by the nghttp2 data provider.
  evbuffer* output_buf_;

  bool is_server_;
  // Set by Close(); causes ReadSendData() to set NGHTTP2_DATA_FLAG_EOF.
  bool close_pending_ = false;
  wslay_event_context* ctx_;

  MessageCallback on_message_;
  OpenCallback on_open_;
  CloseCallback on_close_;

  // wslay callbacks
  static ssize_t WslayRecvCallback(wslay_event_context*,
                                   uint8_t*,
                                   size_t,
                                   int,
                                   void*);
  static ssize_t WslaySendCallback(wslay_event_context*,
                                   const uint8_t*,
                                   size_t,
                                   int,
                                   void*);
  static int WslayGenmaskCallback(wslay_event_context*,
                                  uint8_t*,
                                  size_t,
                                  void*);
  static void WslayOnMsgRecvCallback(wslay_event_context*,
                                     const wslay_event_on_msg_recv_arg*,
                                     void*);

  int SendMessage(uint8_t opcode, const std::string& msg);
};

#endif  // WISH_CPP_SRC_NGHTTP2_WEB_STREAM_H_
