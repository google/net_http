#include "tls_client.h"

#include <absl/log/log.h>

// To use BoringSSL
#define EVENT__HAVE_OPENSSL 1
#include <event2/bufferevent_ssl.h>
#include <openssl/ssl.h>

TlsClient::TlsClient(const std::string& host,
                     int port,
                     const std::string& ca_file,
                     const std::string& cert_file,
                     const std::string& key_file)
    : host_(host),
      port_(port),
      ca_file_(ca_file),
      cert_file_(cert_file),
      key_file_(key_file),
      base_(nullptr),
      dns_base_(nullptr),
      handler_(nullptr) {}

TlsClient::~TlsClient() {
  // Signal the event loop to exit before freeing it.  If Run() is still
  // executing in another thread (e.g. the caller forgot to call Stop()),
  // event_base_loopbreak wakes it up immediately so event_base_free is safe.
  if (base_) {
    event_base_loopbreak(base_);
  }

  if (dns_base_) {
    evdns_base_free(dns_base_, 0);
  }
  if (base_) {
    event_base_free(base_);
  }
}

bool TlsClient::Init() {
  SSL_library_init();
  SSL_load_error_strings();

  tls_ctx_.set_ca_file(ca_file_);
  tls_ctx_.set_certificate_file(cert_file_);
  tls_ctx_.set_private_key_file(key_file_);

  if (!tls_ctx_.Init(false)) {
    LOG(ERROR) << "Failed to init TLS context";

    return false;
  }

  base_ = event_base_new();
  if (!base_) {
    LOG(ERROR) << "event_base_new() failed";

    return false;
  }

  dns_base_ = evdns_base_new(base_, 1);
  if (!dns_base_) {
    LOG(ERROR) << "evdns_base_new() failed";

    return false;
  }

  SSL* ssl = SSL_new(tls_ctx_.ssl_ctx());
  bufferevent* bev = bufferevent_openssl_socket_new(base_,
                                                    -1,
                                                    ssl,
                                                    BUFFEREVENT_SSL_CONNECTING,
                                                    BEV_OPT_CLOSE_ON_FREE);
  if (!bev) {
    LOG(ERROR) << "bufferevent_openssl_socket_new() failed";

    return false;
  }

  if (bufferevent_socket_connect_hostname(bev,
                                          dns_base_,
                                          AF_INET,
                                          host_.c_str(),
                                          port_) < 0) {
    LOG(ERROR) << "bufferevent_socket_connect_hostname() failed";

    return false;
  }

  handler_ = new BufferEventWebStream(bev, false);

  if (on_open_) {
    handler_->SetOnOpen([this]() { on_open_(handler_); });
  }

  handler_->Start();

  return true;
}

void TlsClient::SetOnOpen(OpenCallback cb) {
  on_open_ = cb;
  if (handler_) {
    handler_->SetOnOpen([this]() { on_open_(handler_); });
  }
}

void TlsClient::Run() {
  LOG(INFO) << "Client running...";

  event_base_dispatch(base_);
}

void TlsClient::Stop() {
  if (base_) {
    event_base_loopexit(base_, nullptr);
  }
}
