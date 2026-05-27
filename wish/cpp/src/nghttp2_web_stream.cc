#include "nghttp2_web_stream.h"

#include <absl/base/optimization.h>
#include <absl/log/log.h>
#include <nghttp2/nghttp2.h>
#include <wslay/wslay.h>

#include <algorithm>
#include <random>

#include "wish_opcodes.h"

NGHTTP2WebStream::NGHTTP2WebStream(nghttp2_session* session,
                                   int32_t stream_id,
                                   bool is_server)
    : h2session_(session),
      stream_id_(stream_id),
      is_server_(is_server),
      ctx_(nullptr),
      close_fired_(false),
      input_buf_(evbuffer_new()),
      output_buf_(evbuffer_new()) {
  wslay_event_callbacks callbacks = {
      WslayRecvCallback,
      WslaySendCallback,
      WslayGenmaskCallback,
      WslayOnFrameRecvStartCallback,  // on_frame_recv_start_callback
      nullptr,                        // on_frame_recv_chunk_callback
      nullptr,                        // on_frame_recv_end_callback
      WslayOnMsgRecvCallback};

  if (is_server_) {
    wslay_event_context_server_init(&ctx_,
                                    &callbacks,
                                    this);
  } else {
    wslay_event_context_client_init(&ctx_,
                                    &callbacks,
                                    this);
  }
}

NGHTTP2WebStream::~NGHTTP2WebStream() {
  wslay_event_context_free(ctx_);
  evbuffer_free(input_buf_);
  evbuffer_free(output_buf_);
}

void NGHTTP2WebStream::SetOnMessage(MessageCallback cb) { on_message_ = cb; }

void NGHTTP2WebStream::SetOnClose(CloseCallback cb) { on_close_ = cb; }

void NGHTTP2WebStream::SetOnError(ErrorCallback cb) { on_error_ = cb; }

// ---- Public send methods ----

int NGHTTP2WebStream::SendText(const std::string& msg) {
  return SendMessage(WEB_STREAM_OPCODE_TEXT, msg);
}
int NGHTTP2WebStream::SendBinary(const std::string& msg) {
  return SendMessage(WEB_STREAM_OPCODE_BINARY, msg);
}
int NGHTTP2WebStream::SendMetadata(const std::string& msg) {
  return SendMessage(WEB_STREAM_OPCODE_METADATA, msg);
}

int NGHTTP2WebStream::Close() {
  if (close_pending_) {
    return -1;
  }
  close_pending_ = true;

  // Wake up the deferred data source so ReadSendData() is called immediately;
  // it will set NGHTTP2_DATA_FLAG_EOF now that close_pending_ is true.
  // NGHTTP2_ERR_INVALID_ARGUMENT is returned when the stream is not deferred
  // (data provider already active), which is not an error here.
  int resume_rv = nghttp2_session_resume_data(h2session_, stream_id_);
  if (resume_rv < 0 && resume_rv != NGHTTP2_ERR_INVALID_ARGUMENT) {
    LOG(ERROR) << "NGHTTP2WebStream::Close: nghttp2_session_resume_data() failed: "
               << nghttp2_strerror(resume_rv);

    return resume_rv;
  }

  int send_rv = nghttp2_session_send(h2session_);
  if (send_rv < 0) {
    LOG(ERROR) << "NGHTTP2WebStream::Close: nghttp2_session_send() failed: "
               << nghttp2_strerror(send_rv);

    return send_rv;
  }

  return 0;
}

// ---- Session callbacks (called by H2Server / H2Client) ----

void NGHTTP2WebStream::OnDataChunk(const uint8_t* data, size_t len) {
  evbuffer_add(input_buf_, data, len);

  int rv = wslay_event_recv(ctx_);
  if (rv != 0) {
    LOG(ERROR) << "NGHTTP2WebStream: wslay_event_recv() failed: " << rv;
  }
}

void NGHTTP2WebStream::OnClose() {
  if (close_fired_) {
    return;
  }
  close_fired_ = true;
  if (in_message_) {
    if (on_error_) {
      on_error_();
    }
  } else {
    if (on_close_) {
      on_close_();
    }
  }
}

void NGHTTP2WebStream::OnError() {
  if (close_fired_) {
    return;
  }
  close_fired_ = true;
  if (on_error_) {
    on_error_();
  }
}

// ---- nghttp2 data-source read callback ----

nghttp2_ssize NGHTTP2WebStream::ReadSendData(uint8_t* buf,
                                             size_t length,
                                             uint32_t* data_flags) {
  size_t avail = evbuffer_get_length(output_buf_);
  if (avail == 0) {
    if (close_pending_) {
      // No more data and Close() was called: signal END_STREAM.
      *data_flags |= NGHTTP2_DATA_FLAG_EOF;
      return 0;
    }
    // Deferred: wake up with nghttp2_session_resume_data when data arrives.
    return NGHTTP2_ERR_DEFERRED;
  }
  size_t send_len = std::min(avail, length);

  int rv = evbuffer_remove(output_buf_, buf, send_len);
  if (rv < 0) {
    LOG(ERROR) << "evbuffer_remove() failed";

    // TODO(nlattice): Consider using `NGHTTP2_ERR_TEMPORAL_CALLBACK_FAILURE` instead of `NGHTTP2_ERR_CALLBACK_FAILURE`.
    return NGHTTP2_ERR_CALLBACK_FAILURE;
  }

  // Never set NGHTTP2_DATA_FLAG_EOF: the web-stream stream is long-lived.
  return static_cast<nghttp2_ssize>(send_len);
}

// ---- wslay callbacks ----

ssize_t NGHTTP2WebStream::WslayRecvCallback(wslay_event_context* ctx,
                                            uint8_t* buf,
                                            size_t len,
                                            int /*flags*/,
                                            void* user_data) {
  NGHTTP2WebStream* s = static_cast<NGHTTP2WebStream*>(user_data);

  evbuffer* input = s->input_buf_;

  size_t data_len = evbuffer_get_length(input);
  if (data_len == 0) {
    wslay_event_set_error(ctx, WSLAY_ERR_WOULDBLOCK);
    return -1;
  }

  size_t copy_len = std::min(len, data_len);
  int rv = evbuffer_remove(input, buf, copy_len);
  if (rv < 0) {
    LOG(ERROR) << "evbuffer_remove() failed";

    wslay_event_set_error(ctx, WSLAY_ERR_CALLBACK_FAILURE);
    return -1;
  }
  return static_cast<ssize_t>(copy_len);
}

ssize_t NGHTTP2WebStream::WslaySendCallback(wslay_event_context* /*ctx*/,
                                            const uint8_t* data,
                                            size_t len,
                                            int /*flags*/,
                                            void* user_data) {
  NGHTTP2WebStream* s = static_cast<NGHTTP2WebStream*>(user_data);

  int rv = evbuffer_add(s->output_buf_, data, len);
  if (rv != 0) {
    LOG(ERROR) << "evbuffer_add() failed";

    wslay_event_set_error(s->ctx_, WSLAY_ERR_CALLBACK_FAILURE);
    return -1;
  }

  return static_cast<ssize_t>(len);
}

int NGHTTP2WebStream::WslayGenmaskCallback(wslay_event_context* /*ctx*/,
                                           uint8_t* buf,
                                           size_t len,
                                           void* /*user_data*/) {
  ABSL_UNREACHABLE();
  return 0;
}

void NGHTTP2WebStream::WslayOnMsgRecvCallback(wslay_event_context* /*ctx*/,
                                              const wslay_event_on_msg_recv_arg* arg,
                                              void* user_data) {
  NGHTTP2WebStream* s = static_cast<NGHTTP2WebStream*>(user_data);

  if (!wslay_is_ctrl_frame(arg->opcode)) {
    s->in_message_ = false;
  }

  if (s->on_message_) {
    std::string msg(reinterpret_cast<const char*>(arg->msg), arg->msg_length);
    s->on_message_(arg->opcode, msg);
  }
}

void NGHTTP2WebStream::WslayOnFrameRecvStartCallback(wslay_event_context* /*ctx*/,
                                                     const wslay_event_on_frame_recv_start_arg* arg,
                                                     void* user_data) {
  NGHTTP2WebStream* s = static_cast<NGHTTP2WebStream*>(user_data);

  if (!wslay_is_ctrl_frame(arg->opcode)) {
    s->in_message_ = true;
  }
}

// ---- Private helpers ----

int NGHTTP2WebStream::SendMessage(uint8_t opcode,
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
  if (resume_data_rv < 0 &&
      resume_data_rv != NGHTTP2_ERR_INVALID_ARGUMENT) {
    LOG(ERROR) << "NGHTTP2WebStream: nghttp2_session_resume_data() failed: "
               << nghttp2_strerror(resume_data_rv);

    return resume_data_rv;
  }

  int h2_send_rv = nghttp2_session_send(h2session_);
  if (h2_send_rv < 0) {
    LOG(ERROR) << "NGHTTP2WebStream: nghttp2_session_send() failed: "
               << nghttp2_strerror(h2_send_rv);

    return h2_send_rv;
  }

  return 0;
}
