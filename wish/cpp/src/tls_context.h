/*
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#ifndef WISH_CPP_SRC_TLS_CONTEXT_H_
#define WISH_CPP_SRC_TLS_CONTEXT_H_

#include <string>

#include <openssl/ssl.h>
#include <openssl/err.h>

class TlsContext {
 public:
  TlsContext();
  ~TlsContext();

  void set_certificate_file(const std::string& identity_certificate_path);
  void set_private_key_file(const std::string& private_key_path);
  void set_ca_file(const std::string& ca_path);

  const std::string& certificate_file() const;
  const std::string& private_key_file() const;
  const std::string& ca_file() const;

  // Initialize the SSL_CTX. If is_server is true, it is configured for a server
  // and requires client certificates (mTLS). If is_server is false, it is
  // configured for a client and verifies the server.
  bool Init(bool is_server);

  SSL_CTX* ssl_ctx() const;

 private:
  std::string certificate_file_;
  std::string private_key_file_;
  std::string ca_file_;

  SSL_CTX* ssl_ctx_;
};

#endif  // WISH_CPP_SRC_TLS_CONTEXT_H_
