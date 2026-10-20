These certificates and private keys are development/test fixtures only.

`server.crt` includes SANs for `localhost`, `127.0.0.1`, and `::1`. TLS clients
verify SANs rather than the legacy Common Name. Regenerate the server certificate
from the repository root with:

```sh
openssl x509 -req -in wish/cpp/certs/server.csr \
  -CA wish/cpp/certs/ca.crt -CAkey wish/cpp/certs/ca.key \
  -set_serial 0x2026101901 -days 365 -sha256 \
  -extfile wish/cpp/certs/server.ext -out wish/cpp/certs/server.crt
```

The effective validity is also limited by the CA certificate's expiration date.
