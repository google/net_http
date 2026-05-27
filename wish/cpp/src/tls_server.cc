#include "tls_server.h"

#include <absl/log/log.h>
#include <arpa/inet.h>
#include <netinet/tcp.h>

#include <cstring>

#include "buffer_event_web_stream.h"

// To use BoringSSL
#define EVENT__HAVE_OPENSSL 1
#include <event2/bufferevent_ssl.h>
#include <openssl/ssl.h>

TlsServer::TlsServer(int port,
                     const std::string& ca_file,
                     const std::string& cert_file,
                     const std::string& key_file)
    : port_(port),
      ca_file_(ca_file),
      cert_file_(cert_file),
      key_file_(key_file),
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
    LOG(ERROR) << "Failed to init TLS context";

    return false;
  }

  base_ = event_base_new();
  if (!base_) {
    LOG(ERROR) << "Could not initialize libevent!";

    return false;
  }

  sockaddr_in sin;
  memset(&sin, 0, sizeof(sin));
  sin.sin_family = AF_INET;
  sin.sin_addr.s_addr = htonl(0);
  sin.sin_port = htons(port_);

  // passing 'this' instead of &tls_ctx_ because we can pass TlsServer
  // and access tls_ctx_ from it
  listener_ = evconnlistener_new_bind(base_,
                                      AcceptConnCb,
                                      this,
                                      LEV_OPT_CLOSE_ON_FREE | LEV_OPT_REUSEABLE,
                                      -1,
                                      (sockaddr*)&sin,
                                      sizeof(sin));

  if (!listener_) {
    LOG(ERROR) << "Could not create a listener!";

    return false;
  }

  evconnlistener_set_error_cb(listener_, AcceptErrorCb);

  return true;
}

void TlsServer::Run() {
  LOG(INFO) << "Server listening on port " << port_ << "...";

  event_base_dispatch(base_);
}

void TlsServer::SetOnStream(StreamCallback cb) {
  on_stream_ = cb;
}

void TlsServer::AcceptConnCb(evconnlistener* listener,
                             evutil_socket_t fd,
                             sockaddr* address,
                             int socklen,
                             void* ctx) {
  event_base* base = evconnlistener_get_base(listener);
  TlsServer* server = static_cast<TlsServer*>(ctx);

  int one = 1;
  if (setsockopt(fd,
                 IPPROTO_TCP,
                 TCP_NODELAY,
                 &one,
                 sizeof(one)) < 0) {
    LOG(ERROR) << "Failed to set TCP_NODELAY: " << strerror(errno);
  }

  SSL* ssl = SSL_new(server->tls_ctx_.ssl_ctx());
  bufferevent* bev = bufferevent_openssl_socket_new(base,
                                                    fd,
                                                    ssl,
                                                    BUFFEREVENT_SSL_ACCEPTING,
                                                    BEV_OPT_CLOSE_ON_FREE);

  BufferEventWebStream* stream = new BufferEventWebStream(bev, true);

  if (server->on_stream_) {
    server->on_stream_(stream);
  } else {
    LOG(WARNING) << "Warning: No stream handler registered.";
  }

  stream->Start();
}

void TlsServer::AcceptErrorCb(evconnlistener* listener, void* ctx) {
  event_base* base = evconnlistener_get_base(listener);
  int err = EVUTIL_SOCKET_ERROR();
  LOG(ERROR) << "Got an error " << err << " ("
             << evutil_socket_error_to_string(err)
             << ") on the listener. Shutting down.";
  event_base_loopexit(base, nullptr);
}
