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
  using CloseCallback = std::function<void()>;
  using ErrorCallback = std::function<void()>;

  virtual ~WebStream() = default;

  virtual void SetOnMessage(MessageCallback cb) = 0;

  // Set the callback triggered when the stream closes cleanly.
  //
  // This callback is invoked ONLY when the stream closed at a message boundary
  // (i.e. not in the middle of a message) AND the underlying transport
  // reached EOF cleanly without any errors.
  // If the stream is closed prematurely or an error occurs, SetOnError is
  // fired instead.
  virtual void SetOnClose(CloseCallback cb) = 0;

  // Set the callback triggered when the stream encounters an error or is
  // closed prematurely.
  virtual void SetOnError(ErrorCallback cb) = 0;

  virtual int SendText(const std::string& msg) = 0;
  virtual int SendBinary(const std::string& msg) = 0;
  virtual int SendMetadata(const std::string& msg) = 0;

  // Signal EOF to the underlying HTTP message body.
  // Returns 0 on success, or -1 if Close() has already been called.
  virtual int Close() = 0;
};

#endif  // WISH_CPP_SRC_WEB_STREAM_H_
