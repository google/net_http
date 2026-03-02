#include "tls_context.h"

#include <iostream>

TlsContext::TlsContext() : ssl_ctx_(nullptr) {}

TlsContext::~TlsContext() {
  if (ssl_ctx_) {
    SSL_CTX_free(ssl_ctx_);
  }
}

void TlsContext::set_certificate_file(const std::string& file) { certificate_file_ = file; }
void TlsContext::set_private_key_file(const std::string& file) { private_key_file_ = file; }
void TlsContext::set_ca_file(const std::string& file) { ca_file_ = file; }

const std::string& TlsContext::certificate_file() const { return certificate_file_; }
const std::string& TlsContext::private_key_file() const { return private_key_file_; }
const std::string& TlsContext::ca_file() const { return ca_file_; }

bool TlsContext::Init(bool is_server) {
  if (ssl_ctx_) {
    SSL_CTX_free(ssl_ctx_);
    ssl_ctx_ = nullptr;
  }

  const SSL_METHOD* method =
      is_server ? TLS_server_method() : TLS_client_method();
  ssl_ctx_ = SSL_CTX_new(method);

  if (!ssl_ctx_) {
    std::cerr << "Failed to create SSL_CTX" << std::endl;
    return false;
  }

  // Load CA certificate for verifying the peer
  if (!ca_file_.empty()) {
    if (SSL_CTX_load_verify_locations(ssl_ctx_, ca_file_.c_str(), nullptr) !=
        1) {
      std::cerr << "Error loading CA file: " << ca_file_ << std::endl;
      return false;
    }
  }

  // Set verification mode for mTLS
  if (is_server) {
    SSL_CTX_set_verify(ssl_ctx_,
                       SSL_VERIFY_PEER | SSL_VERIFY_FAIL_IF_NO_PEER_CERT,
                       nullptr);
  } else {
    SSL_CTX_set_verify(ssl_ctx_, SSL_VERIFY_PEER, nullptr);
  }

  // Load own certificate and key
  if (!certificate_file_.empty() && !private_key_file_.empty()) {
    if (SSL_CTX_use_certificate_file(ssl_ctx_, certificate_file_.c_str(),
                                     SSL_FILETYPE_PEM) <= 0) {
      std::cerr << "Error loading certificate file: " << certificate_file_
                << std::endl;
      return false;
    }

    if (SSL_CTX_use_PrivateKey_file(ssl_ctx_, private_key_file_.c_str(),
                                    SSL_FILETYPE_PEM) <= 0) {
      std::cerr << "Error loading key file: " << private_key_file_ << std::endl;
      return false;
    }

    if (!SSL_CTX_check_private_key(ssl_ctx_)) {
      std::cerr << "Private key does not match the certificate public key"
                << std::endl;
      return false;
    }
  } else {
    std::cerr << "Warning: cert_path or key_path is empty. mTLS may fail."
              << std::endl;
  }

  return true;
}

SSL_CTX* TlsContext::ssl_ctx() const { return ssl_ctx_; }
