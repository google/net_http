#ifndef WISH_CPP_SRC_WEB_STREAM_H_
#define WISH_CPP_SRC_WEB_STREAM_H_

#include <functional>
#include <string>

// WebStream is the common interface for all web-stream implementations.
//
// Both BufferEventWebStream (HTTP/1.1 upgrade over libevent) and
// NGHTTP2WebStream (HTTP/2 DATA frames) implement this interface so that
// callers can write transport-agnostic code.
class WebStream {
 public:
  using MessageCallback = std::function<void(uint8_t, const std::string&)>;
  using OpenCallback = std::function<void()>;
  using CloseCallback = std::function<void()>;

  virtual ~WebStream() = default;

  virtual void SetOnMessage(MessageCallback cb) = 0;
  virtual void SetOnOpen(OpenCallback cb) = 0;
  virtual void SetOnClose(CloseCallback cb) = 0;

  virtual int SendText(const std::string& msg) = 0;
  virtual int SendBinary(const std::string& msg) = 0;
  virtual int SendMetadata(const std::string& msg) = 0;

  // Signal EOF to the underlying HTTP message body.
  // Returns 0 on success, or -1 if Close() has already been called.
  virtual int Close() = 0;
};

#endif  // WISH_CPP_SRC_WEB_STREAM_H_
