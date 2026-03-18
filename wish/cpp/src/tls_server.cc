#include "tls_server.h"

#include <iostream>
#include <cstring>
#include <arpa/inet.h>

// To use BoringSSL
#define EVENT__HAVE_OPENSSL 1
#include <event2/bufferevent_ssl.h>
#include <openssl/ssl.h>

TlsServer::TlsServer(const std::string& ca_file, const std::string& cert_file,
                       const std::string& key_file, int port)
    : ca_file_(ca_file),
      cert_file_(cert_file),
      key_file_(key_file),
      port_(port),
      base_(nullptr),
      listener_(nullptr) {}

TlsServer::~TlsServer() {
  if (listener_) {
    evconnlistener_free(listener_);
  }
  if (base_) {
    event_base_free(base_);
  }
}

bool TlsServer::Init() {
  SSL_library_init();
  SSL_load_error_strings();

  tls_ctx_.set_ca_file(ca_file_);
  tls_ctx_.set_certificate_file(cert_file_);
  tls_ctx_.set_private_key_file(key_file_);

  if (!tls_ctx_.Init(true)) {
    std::cerr << "Failed to init TLS context" << std::endl;
    return false;
  }

  base_ = event_base_new();
  if (!base_) {
    std::cerr << "Could not initialize libevent!" << std::endl;
    return false;
  }

  struct sockaddr_in sin;
  memset(&sin, 0, sizeof(sin));
  sin.sin_family = AF_INET;
  sin.sin_addr.s_addr = htonl(0);
  sin.sin_port = htons(port_);

  // passing 'this' instead of &tls_ctx_ because we can pass TlsServer
  // and access tls_ctx_ from it
  listener_ = evconnlistener_new_bind(
      base_, AcceptConnCb, this, LEV_OPT_CLOSE_ON_FREE | LEV_OPT_REUSEABLE, -1,
      (struct sockaddr*)&sin, sizeof(sin));

  if (!listener_) {
    std::cerr << "Could not create a listener!" << std::endl;
    return false;
  }

  evconnlistener_set_error_cb(listener_, AcceptErrorCb);

  return true;
}

void TlsServer::Run() {
  std::cout << "Server listening on port " << port_ << "..." << std::endl;
  event_base_dispatch(base_);
}

void TlsServer::SetOnConnection(ConnectCallback cb) {
  on_connection_ = cb;
}

void TlsServer::AcceptConnCb(struct evconnlistener* listener,
                              evutil_socket_t fd, struct sockaddr* address,
                              int socklen, void* ctx) {
  struct event_base* base = evconnlistener_get_base(listener);
  TlsServer* server = static_cast<TlsServer*>(ctx);

  SSL* ssl = SSL_new(server->tls_ctx_.ssl_ctx());
  struct bufferevent* bev = bufferevent_openssl_socket_new(
      base, fd, ssl, BUFFEREVENT_SSL_ACCEPTING, BEV_OPT_CLOSE_ON_FREE);

  if (server->on_connection_) {
    server->on_connection_(bev);
  } else {
    std::cerr << "Warning: No connection handler registered." << std::endl;
    bufferevent_free(bev);
  }
}

void TlsServer::AcceptErrorCb(struct evconnlistener* listener, void* ctx) {
  struct event_base* base = evconnlistener_get_base(listener);
  int err = EVUTIL_SOCKET_ERROR();
  std::cerr << "Got an error " << err << " ("
            << evutil_socket_error_to_string(err)
            << ") on the listener. Shutting down." << std::endl;
  event_base_loopexit(base, NULL);
}
