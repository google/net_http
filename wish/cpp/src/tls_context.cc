#include "tls_context.h"

#include <absl/log/log.h>

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
    VLOG(1) << "Failed to create SSL_CTX";

    return false;
  }

  if (!ca_file_.empty()) {
    int load_rv = SSL_CTX_load_verify_locations(ssl_ctx_,
                                                ca_file_.c_str(),
                                                nullptr);
    if (load_rv != 1) {
      VLOG(1) << "Error loading CA file: " << ca_file_;

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
    int cert_rv = SSL_CTX_use_certificate_file(ssl_ctx_,
                                               certificate_file_.c_str(),
                                               SSL_FILETYPE_PEM);
    if (cert_rv <= 0) {
      VLOG(1) << "Error loading certificate file: " << certificate_file_;

      return false;
    }

    int key_rv = SSL_CTX_use_PrivateKey_file(ssl_ctx_,
                                             private_key_file_.c_str(),
                                             SSL_FILETYPE_PEM);
    if (key_rv <= 0) {
      VLOG(1) << "Error loading key file: " << private_key_file_;

      return false;
    }

    int check_rv = SSL_CTX_check_private_key(ssl_ctx_);
    if (check_rv != 1) {
      VLOG(1) << "Private key does not match the certificate public key";

      return false;
    }
  } else {
    VLOG(1) << "Warning: cert_path or key_path is empty. mTLS may fail.";
  }

  return true;
}

SSL_CTX* TlsContext::ssl_ctx() const { return ssl_ctx_; }
