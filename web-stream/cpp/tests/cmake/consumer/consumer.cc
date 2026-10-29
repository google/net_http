#include "plain_client.h"
#include "tls_client.h"
#include "h2_client.h"
#include "h2_tls_client.h"
#include "plain_server.h"
#include "tls_server.h"
#include "h2_server.h"
#include "h2_tls_server.h"

static_assert(__cplusplus >= 201703L, "web-stream requires C++17");

int CheckConsumer() {
  event_base* base = event_base_new();
  if (!base) return 1;
  {
    PlainClient client(base, "localhost", 8080);
  }
  event_base_free(base);
  return 0;
}
