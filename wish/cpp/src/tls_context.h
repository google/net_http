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
