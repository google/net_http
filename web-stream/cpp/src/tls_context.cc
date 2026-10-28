// Copyright 2026 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#include "tls_context.h"

#include <absl/log/log.h>
#include <event2/util.h>

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

SSL* TlsContext::NewClientSsl(const std::string& host) const {
  // Reject embedded NULs rather than verifying a truncated peer name.
  if (!ssl_ctx_ || host.empty() || host.find('\0') != std::string::npos) {
    return nullptr;
  }
  SSL* ssl = SSL_new(ssl_ctx_);
  if (!ssl) {
    return nullptr;
  }

  unsigned char address[16];
  int address_length = 0;
  if (evutil_inet_pton(AF_INET, host.c_str(), address) == 1) {
    address_length = 4;
  } else if (evutil_inet_pton(AF_INET6, host.c_str(), address) == 1) {
    address_length = 16;
  }

  SSL_set_hostflags(ssl, X509_CHECK_FLAG_NEVER_CHECK_SUBJECT);
  bool configured;
  if (address_length != 0) {
    // IP literals must match an iPAddress SAN, never a DNS SAN or common name.
    configured = X509_VERIFY_PARAM_set1_ip(
        SSL_get0_param(ssl), address, address_length) == 1;
  } else {
    configured = SSL_set1_host(ssl, host.c_str()) == 1 &&
                 SSL_set_tlsext_host_name(ssl, host.c_str()) == 1;
  }
  if (!configured) {
    SSL_free(ssl);
    return nullptr;
  }
  return ssl;
}
