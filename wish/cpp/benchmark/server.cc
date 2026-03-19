#include <arpa/inet.h>
#include <event2/bufferevent.h>
#include <event2/event.h>
#include <event2/listener.h>
#include <event2/util.h>
#include <netinet/tcp.h>
#include <sys/socket.h>

#include <cstring>
#include <string>

#include "../src/wish_handler.h"
#include "absl/flags/flag.h"
#include "absl/flags/parse.h"
#include "absl/log/initialize.h"
#include "absl/log/log.h"

ABSL_FLAG(int, port, 8080, "Port to listen on");

namespace {

void accept_conn_cb(struct evconnlistener* listener, evutil_socket_t fd,
                    struct sockaddr* address, int socklen, void* ctx) {
  (void)address;
  (void)socklen;
  (void)ctx;

  struct event_base* base = evconnlistener_get_base(listener);

  int nodelay = 1;
  if (setsockopt(fd, IPPROTO_TCP, TCP_NODELAY, &nodelay, sizeof(nodelay)) !=
      0) {
    LOG(ERROR) << "setsockopt(TCP_NODELAY) failed";
  }

  struct bufferevent* bev =
      bufferevent_socket_new(base, fd, BEV_OPT_CLOSE_ON_FREE);
  if (!bev) {
    LOG(ERROR) << "Failed to create bufferevent for accepted socket";
    evutil_closesocket(fd);
    return;
  }

  auto* handler = new WishHandler(bev, true);
  handler->SetOnMessage([handler](uint8_t opcode, const std::string& msg) {
    std::string type;
    switch (opcode) {
      case WISH_OPCODE_TEXT:
        type = "TEXT";
        break;
      case WISH_OPCODE_BINARY:
        type = "BINARY";
        break;
      case WISH_OPCODE_TEXT_METADATA:
        type = "TEXT_METADATA";
        break;
      case WISH_OPCODE_BINARY_METADATA:
        type = "BINARY_METADATA";
        break;
      default:
        type = "UNKNOWN(" + std::to_string(opcode) + ")";
        break;
    }
    LOG(INFO) << "Received [" << type << "]: " << msg;

    // Echo back
    if (opcode == WISH_OPCODE_TEXT)
      handler->SendText(msg);
    else if (opcode == WISH_OPCODE_BINARY)
      handler->SendBinary(msg);
    else if (opcode == WISH_OPCODE_TEXT_METADATA)
      handler->SendTextMetadata(msg);
    else if (opcode == WISH_OPCODE_BINARY_METADATA)
      handler->SendBinaryMetadata(msg);
    else {
      LOG(WARNING) << "Unknown opcode, cannot echo.";
    }
  });

  handler->Start();
}

void accept_error_cb(struct evconnlistener* listener, void* ctx) {
  (void)ctx;
  struct event_base* base = evconnlistener_get_base(listener);
  const int err = EVUTIL_SOCKET_ERROR();
  LOG(ERROR) << "Listener error " << err << " ("
             << evutil_socket_error_to_string(err) << ")";
  event_base_loopexit(base, nullptr);
}

}  // namespace

int main(int argc, char** argv) {
  absl::ParseCommandLine(argc, argv);
  absl::InitializeLog();
  const int port = absl::GetFlag(FLAGS_port);

  struct event_base* base = event_base_new();
  if (!base) {
    LOG(ERROR) << "Could not initialize libevent";
    return 1;
  }

  struct sockaddr_in sin;
  std::memset(&sin, 0, sizeof(sin));
  sin.sin_family = AF_INET;
  sin.sin_addr.s_addr = htonl(INADDR_ANY);
  sin.sin_port = htons(port);

  struct evconnlistener* listener = evconnlistener_new_bind(
      base, accept_conn_cb, nullptr, LEV_OPT_CLOSE_ON_FREE | LEV_OPT_REUSEABLE,
      -1, reinterpret_cast<struct sockaddr*>(&sin), sizeof(sin));

  if (!listener) {
    LOG(ERROR) << "Could not create listener on port " << port;
    event_base_free(base);
    return 1;
  }

  evconnlistener_set_error_cb(listener, accept_error_cb);
  LOG(INFO) << "WiSH benchmark server listening on port " << port << "...";
  event_base_dispatch(base);

  evconnlistener_free(listener);
  event_base_free(base);
  return 0;
}
