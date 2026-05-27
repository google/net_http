#ifndef WISH_CPP_SRC_HANDSHAKE_H_
#define WISH_CPP_SRC_HANDSHAKE_H_

#include <event2/buffer.h>
#include <event2/bufferevent.h>

#include <functional>
#include <memory>
#include <string>

class ClientHandshake {
 public:
  using OnOpenCallback = std::function<void(bufferevent*)>;
  using OnErrorCallback = std::function<void()>;

  ClientHandshake(bufferevent* bev, OnOpenCallback on_open, OnErrorCallback on_error);
  ~ClientHandshake();

  void Start();

 private:
  static void ReadCb(bufferevent* bev, void* ctx);
  static void EventCb(bufferevent* bev, short what, void* ctx);

  void HandleRead();
  void HandleEvent(short what);
  void InvokeError();

  bufferevent* bev_;

  OnOpenCallback on_open_;
  OnErrorCallback on_error_;
};

class ServerHandshake {
 public:
  using OnOpenCallback = std::function<void(bufferevent*)>;
  using OnErrorCallback = std::function<void()>;
  using CleanupCallback = std::function<void(ServerHandshake*)>;

  ServerHandshake(bufferevent* bev, OnOpenCallback on_open, OnErrorCallback on_error, CleanupCallback cleanup = nullptr);
  ~ServerHandshake();

  void Start();

 private:
  static void ReadCb(bufferevent* bev, void* ctx);
  static void EventCb(bufferevent* bev, short what, void* ctx);

  void HandleRead();
  void HandleEvent(short what);
  void InvokeError();

  bufferevent* bev_;

  OnOpenCallback on_open_;
  OnErrorCallback on_error_;
  CleanupCallback cleanup_;
};

#endif  // WISH_CPP_SRC_HANDSHAKE_H_
