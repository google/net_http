#include "tls_context.h"

#include <iostream>

TlsContext::TlsContext() : ssl_ctx_(nullptr) {}

TlsContext::~TlsContext() {
  if (ssl_ctx_) {
    SSL_CTX_free(ssl_ctx_);
  }
}

void TlsContext::set_identity_certificate_path(const std::string& path) { identity_certificate_path_ = path; }
void TlsContext::set_private_key_path(const std::string& path) { private_key_path_ = path; }
void TlsContext::set_ca_path(const std::string& path) { ca_path_ = path; }

const std::string& TlsContext::identity_certificate_path() const { return identity_certificate_path_; }
const std::string& TlsContext::private_key_path() const { return private_key_path_; }
const std::string& TlsContext::ca_path() const { return ca_path_; }

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
  if (!ca_path_.empty()) {
    if (SSL_CTX_load_verify_locations(ssl_ctx_, ca_path_.c_str(), nullptr) !=
        1) {
      std::cerr << "Error loading CA file: " << ca_path_ << std::endl;
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
  if (!identity_certificate_path_.empty() && !private_key_path_.empty()) {
    if (SSL_CTX_use_certificate_file(ssl_ctx_, identity_certificate_path_.c_str(),
                                     SSL_FILETYPE_PEM) <= 0) {
      std::cerr << "Error loading certificate file: " << identity_certificate_path_
                << std::endl;
      return false;
    }

    if (SSL_CTX_use_PrivateKey_file(ssl_ctx_, private_key_path_.c_str(),
                                    SSL_FILETYPE_PEM) <= 0) {
      std::cerr << "Error loading key file: " << private_key_path_ << std::endl;
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
