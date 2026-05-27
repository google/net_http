/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#ifndef WISH_CPP_SRC_BUFFER_EVENT_WEB_STREAM_H_
#define WISH_CPP_SRC_BUFFER_EVENT_WEB_STREAM_H_

#include <event2/buffer.h>
#include <event2/bufferevent.h>

#include <functional>
#include <memory>
#include <string>
#include <vector>

#include "web_stream.h"
#include "wish_opcodes.h"

// wslay forward decl
extern "C" {
struct wslay_event_context;
struct wslay_event_on_msg_recv_arg;
struct wslay_event_on_frame_recv_start_arg;
}

// BufferEventWebStream implements the web-stream protocol defined at https://datatracker.ietf.org/doc/html/draft-yoshino-wish
//
// It manages the lifecycle of a single web-stream connection, including the initial HTTP handshake and subsequent message framing/parsing.
//
// It uses libevent's bufferevent for async I/O. The underlying transport should be provided through it.
class BufferEventWebStream : public WebStream {
 public:
  // Constructor takes an already created bufferevent
  BufferEventWebStream(bufferevent* bev,
                       bool is_server);
  ~BufferEventWebStream() override;

  bool Init();

  using CleanupCallback = std::function<void(BufferEventWebStream*)>;
  void SetCleanupCallback(CleanupCallback cb);

  // Start the handler (sets up callbacks and enables events)
  void Start();

  void SetOnMessage(MessageCallback cb) override;
  void SetOnClose(CloseCallback cb) override;
  void SetOnError(ErrorCallback cb) override;

  int SendText(const std::string& msg) override;
  int SendBinary(const std::string& msg) override;
  int SendMetadata(const std::string& msg) override;

  // Signal EOF on the outbound HTTP/1.1 chunked body by writing a terminal
  // zero-length chunk ("0\r\n\r\n").
  // Returns 0 on success, or -1 if Close() has already been called.
  int Close() override;

 private:
  bufferevent* bev_;

  enum State {
    OPEN,
    // Inbound terminal chunk received; draining outbound buffer before delete.
    DRAINING,
    CLOSED
  };
  State state_;

  bool is_server_;
  bool in_message_ = false;
  wslay_event_context* ctx_;

  // ---- Chunked-encoding send state ----
  // Set by Close(); prevents further sends and writes the terminal chunk.
  bool close_pending_ = false;

  // ---- Chunked-encoding receive state ----
  // Set when the terminal zero-length chunk has been seen on the inbound side.
  bool receive_closed_ = false;
  // Set when the terminal chunk (size 0) has been seen, but before its trailer is consumed.
  bool terminal_chunk_seen_ = false;

  // State machine used by ReadChunkedBytes() to decode the inbound
  // Transfer-Encoding: chunked body after the HTTP handshake.
  enum class ChunkState {
    HEADER,   // Reading "<hex>\r\n"
    DATA,     // Reading chunk_remaining_ bytes of payload
    TRAILER,  // Reading trailing "\r\n" after payload
  };
  ChunkState chunk_state_ = ChunkState::HEADER;
  // Bytes remaining in the current DATA chunk.
  size_t chunk_remaining_ = 0;

  MessageCallback on_message_;
  CloseCallback on_close_;
  ErrorCallback on_error_;

  CleanupCallback cleanup_cb_;

  // libevent callbacks
  static void ReadCallback(bufferevent* bev,
                           void* ctx);
  static void DrainCallback(bufferevent* bev,
                            void* ctx);
  static void EventCallback(bufferevent* bev,
                            short what,  // NOLINT(runtime/int)
                            void* ctx);

  // wslay callbacks
  static ssize_t WslayRecvCallback(wslay_event_context* ctx,
                                   uint8_t* buf,
                                   size_t len,
                                   int flags,
                                   void* user_data);
  static ssize_t WslaySendCallback(wslay_event_context* ctx,
                                   const uint8_t* data,
                                   size_t len,
                                   int flags,
                                   void* user_data);
  static int WslayGenmaskCallback(wslay_event_context* ctx,
                                  uint8_t* buf,
                                  size_t len,
                                  void* user_data);
  static void WslayOnMsgRecvCallback(wslay_event_context* ctx,
                                     const wslay_event_on_msg_recv_arg* arg,
                                     void* user_data);
  static void WslayOnFrameRecvStartCallback(wslay_event_context* ctx,
                                            const wslay_event_on_frame_recv_start_arg* arg,
                                            void* user_data);

  int SendMessage(uint8_t opcode, const std::string& msg);
  void TryDrain();

  // Decode one batch of Transfer-Encoding: chunked bytes from the inbound
  // bufferevent into buf[0..len).  Mirrors the wslay recv-callback signature:
  // returns bytes copied on success, or -1 with wslay error set on failure /
  // would-block.  Sets receive_closed_ when the terminal chunk is consumed.
  ssize_t ReadChunkedBytes(uint8_t* buf, size_t len);
};

#endif  // WISH_CPP_SRC_BUFFER_EVENT_WEB_STREAM_H_
