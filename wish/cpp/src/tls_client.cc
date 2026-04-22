#include "tls_client.h"

#include <iostream>

// To use BoringSSL
#define EVENT__HAVE_OPENSSL 1
#include <event2/bufferevent_ssl.h>
#include <openssl/ssl.h>

TlsClient::TlsClient(const std::string& ca_file, const std::string& cert_file,
                     const std::string& key_file, const std::string& host,
                     int port)
    : ca_file_(ca_file),
      cert_file_(cert_file),
      key_file_(key_file),
      host_(host),
      port_(port),
      base_(nullptr),
      dns_base_(nullptr),
      handler_(nullptr) {}

TlsClient::~TlsClient() {
  if (dns_base_) {
    evdns_base_free(dns_base_, 0);
  }
  if (base_) {
    event_base_free(base_);
  }
  // WishHandler deletes itself when the connection closes
  // But if it wasn't started, we might need to delete it.
  // Assuming it manages its own lifecycle for now.
}

bool TlsClient::Init() {
  SSL_library_init();
  SSL_load_error_strings();

  tls_ctx_.set_ca_file(ca_file_);
  tls_ctx_.set_certificate_file(cert_file_);
  tls_ctx_.set_private_key_file(key_file_);

  if (!tls_ctx_.Init(false)) {
    std::cerr << "Failed to init TLS context" << std::endl;
    return false;
  }

  base_ = event_base_new();
  if (!base_) {
    std::cerr << "Could not initialize libevent!" << std::endl;
    return false;
  }

  dns_base_ = evdns_base_new(base_, 1);
  if (!dns_base_) {
    std::cerr << "Could not initialize dns!" << std::endl;
    return false;
  }

  SSL* ssl = SSL_new(tls_ctx_.ssl_ctx());
  struct bufferevent* bev = bufferevent_openssl_socket_new(
      base_, -1, ssl, BUFFEREVENT_SSL_CONNECTING, BEV_OPT_CLOSE_ON_FREE);
  if (!bev) {
    std::cerr << "Could not create bufferevent!" << std::endl;
    return false;
  }

  if (bufferevent_socket_connect_hostname(bev, dns_base_, AF_INET,
                                          host_.c_str(), port_) < 0) {
    std::cerr << "Could not connect!" << std::endl;
    return false;
  }

  handler_ = new WishHandler(bev, false);

  if (on_open_) {
    handler_->SetOnOpen([this]() { on_open_(handler_); });
  }

  if (on_message_) {
    handler_->SetOnMessage(on_message_);
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

void TlsClient::SetOnMessage(MessageCallback cb) {
  on_message_ = cb;
  if (handler_) {
    handler_->SetOnMessage(on_message_);
  }
}

void TlsClient::Run() {
  std::cout << "Client running..." << std::endl;

  event_base_dispatch(base_);
}

void TlsClient::Stop() {
  if (base_) {
    event_base_loopexit(base_, nullptr);
  }
}
