#include "h2_wish_stream.h"

#include <absl/base/optimization.h>
#include <nghttp2/nghttp2.h>
#include <wslay/wslay.h>

#include <algorithm>
#include <iostream>
#include <random>

H2WishStream::H2WishStream(nghttp2_session* session,
                           int32_t stream_id,
                           bool is_server)
    : h2session_(session),
      stream_id_(stream_id),
      is_server_(is_server),
      ctx_(nullptr),
      input_buf_(evbuffer_new()),
      output_buf_(evbuffer_new()) {
  wslay_event_callbacks callbacks = {
      WslayRecvCallback,
      WslaySendCallback,
      WslayGenmaskCallback,
      nullptr,  // on_frame_recv_start_callback
      nullptr,  // on_frame_recv_chunk_callback
      nullptr,  // on_frame_recv_end_callback
      WslayOnMsgRecvCallback};

  if (is_server_) {
    wslay_event_context_server_init(&ctx_, &callbacks, this);
  } else {
    wslay_event_context_client_init(&ctx_, &callbacks, this);
  }
}

H2WishStream::~H2WishStream() {
  wslay_event_context_free(ctx_);
  evbuffer_free(input_buf_);
  evbuffer_free(output_buf_);
}

void H2WishStream::SetOnMessage(MessageCallback cb) { on_message_ = cb; }

void H2WishStream::SetOnOpen(OpenCallback cb) { on_open_ = cb; }

void H2WishStream::SetOnClose(CloseCallback cb) { on_close_ = cb; }

// ---- Public send methods ----

int H2WishStream::SendText(const std::string& msg) {
  return SendMessage(1, msg);
}
int H2WishStream::SendBinary(const std::string& msg) {
  return SendMessage(2, msg);
}
int H2WishStream::SendTextMetadata(const std::string& msg) {
  return SendMessage(3, msg);
}
int H2WishStream::SendBinaryMetadata(const std::string& msg) {
  return SendMessage(4, msg);
}

// ---- Session callbacks (called by H2Server / H2Client) ----

void H2WishStream::OnDataChunk(const uint8_t* data, size_t len) {
  evbuffer_add(input_buf_, data, len);
  int err = wslay_event_recv(ctx_);
  if (err != 0) {
    std::cerr << "H2WishStream: wslay_event_recv failed: " << err << std::endl;
  }
}

void H2WishStream::OnOpen() {
  if (on_open_) {
    on_open_();
  }
}

void H2WishStream::OnClose() {
  if (on_close_) {
    on_close_();
  }
}

// ---- nghttp2 data-source read callback ----

ssize_t H2WishStream::ReadSendData(uint8_t* buf,
                                   size_t length,
                                   uint32_t* data_flags) {
  size_t avail = evbuffer_get_length(output_buf_);
  if (avail == 0) {
    // Deferred: wake up with nghttp2_session_resume_data when data arrives.
    return NGHTTP2_ERR_DEFERRED;
  }
  size_t send_len = std::min(avail, length);
  evbuffer_remove(output_buf_, buf, send_len);
  // Never set NGHTTP2_DATA_FLAG_EOF: the web-stream stream is long-lived.
  return static_cast<ssize_t>(send_len);
}

// ---- Private helpers ----

int H2WishStream::SendMessage(uint8_t opcode,
                              const std::string& msg) {
  wslay_event_msg msg_frame = {
      opcode,
      reinterpret_cast<const uint8_t*>(msg.c_str()),
      msg.length()};
  int queue_msg_rv = wslay_event_queue_msg(ctx_, &msg_frame);
  if (queue_msg_rv != 0) {
    return queue_msg_rv;
  }

  // wslay sends to output_buf_ via WslaySendCallback.
  int ws_send_rv = wslay_event_send(ctx_);
  if (ws_send_rv != 0) {
    return ws_send_rv;
  }

  // Resume the deferred data source and flush the nghttp2 session.
  // NGHTTP2_ERR_INVALID_ARGUMENT is returned when the stream is not deferred,
  // meaning the data provider is already active – that is not an error here.
  int resume_data_rv = nghttp2_session_resume_data(h2session_, stream_id_);
  if (resume_data_rv < 0 && resume_data_rv != NGHTTP2_ERR_INVALID_ARGUMENT) {
    std::cerr << "H2WishStream: nghttp2_session_resume_data failed: "
              << nghttp2_strerror(resume_data_rv) << std::endl;
    return resume_data_rv;
  }

  int h2_send_rv = nghttp2_session_send(h2session_);
  if (h2_send_rv < 0) {
    std::cerr << "H2WishStream: nghttp2_session_send failed: "
              << nghttp2_strerror(h2_send_rv) << std::endl;
    return h2_send_rv;
  }

  return 0;
}

// ---- wslay callbacks ----

ssize_t H2WishStream::WslayRecvCallback(wslay_event_context* ctx,
                                        uint8_t* buf,
                                        size_t len,
                                        int /*flags*/,
                                        void* user_data) {
  H2WishStream* s = static_cast<H2WishStream*>(user_data);
  size_t avail = evbuffer_get_length(s->input_buf_);
  if (avail == 0) {
    wslay_event_set_error(ctx, WSLAY_ERR_WOULDBLOCK);
    return -1;
  }
  size_t copy_len = std::min(len, avail);
  evbuffer_remove(s->input_buf_, buf, copy_len);
  return static_cast<ssize_t>(copy_len);
}

ssize_t H2WishStream::WslaySendCallback(wslay_event_context* /*ctx*/,
                                        const uint8_t* data,
                                        size_t len,
                                        int /*flags*/,
                                        void* user_data) {
  H2WishStream* s = static_cast<H2WishStream*>(user_data);
  evbuffer_add(s->output_buf_, data, len);
  return static_cast<ssize_t>(len);
}

int H2WishStream::WslayGenmaskCallback(wslay_event_context* /*ctx*/,
                                       uint8_t* buf,
                                       size_t len,
                                       void* /*user_data*/) {
  ABSL_UNREACHABLE();
  return 0;
}

void H2WishStream::WslayOnMsgRecvCallback(wslay_event_context* /*ctx*/,
                                          const wslay_event_on_msg_recv_arg* arg,
                                          void* user_data) {
  H2WishStream* s = static_cast<H2WishStream*>(user_data);
  if (s->on_message_) {
    std::string msg(reinterpret_cast<const char*>(arg->msg), arg->msg_length);
    s->on_message_(arg->opcode, msg);
  }
}
