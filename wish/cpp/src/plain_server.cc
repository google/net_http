#include "plain_server.h"

#include <absl/log/log.h>
#include <arpa/inet.h>
#include <event2/util.h>
#include <netinet/tcp.h>

#include <cerrno>
#include <cstring>

#include "buffer_event_web_stream.h"
#include "handshake.h"

PlainServer::PlainServer(int port)
    : port_(port),
      base_(nullptr),
      listener_(nullptr) {}

PlainServer::~PlainServer() {
  if (listener_) {
    evconnlistener_free(listener_);
  }
  if (base_) {
    event_base_free(base_);
  }
}

bool PlainServer::Init() {
  base_ = event_base_new();
  if (!base_) {
    LOG(ERROR) << "Could not initialize libevent!";

    return false;
  }

  sockaddr_in sin;
  memset(&sin, 0, sizeof(sin));
  sin.sin_family = AF_INET;
  sin.sin_addr.s_addr = htonl(INADDR_ANY);
  sin.sin_port = htons(port_);

  listener_ = evconnlistener_new_bind(base_,
                                      AcceptConnCb,
                                      this,
                                      LEV_OPT_CLOSE_ON_FREE | LEV_OPT_REUSEABLE,
                                      -1,
                                      reinterpret_cast<sockaddr*>(&sin),
                                      sizeof(sin));
  if (!listener_) {
    LOG(ERROR) << "Could not create a listener!";

    return false;
  }

  evconnlistener_set_error_cb(listener_, AcceptErrorCb);
  return true;
}

void PlainServer::SetOnStream(StreamCallback cb) {
  on_stream_ = cb;
}

void PlainServer::Run() {
  event_base_dispatch(base_);
}

void PlainServer::AcceptConnCb(evconnlistener* listener,
                               evutil_socket_t fd,
                               sockaddr* address,
                               int socklen,
                               void* ctx) {
  (void)address;
  (void)socklen;

  event_base* base = evconnlistener_get_base(listener);
  PlainServer* server = static_cast<PlainServer*>(ctx);

  int one = 1;
  int set_opt_rv = setsockopt(fd,
                              IPPROTO_TCP,
                              TCP_NODELAY,
                              &one,
                              sizeof(one));
  if (set_opt_rv < 0) {
    LOG(ERROR) << "setsockopt(TCP_NODELAY) failed: " << strerror(errno);
  }

  bufferevent* bev = bufferevent_socket_new(base,
                                            fd,
                                            BEV_OPT_CLOSE_ON_FREE);
  if (!bev) {
    LOG(ERROR) << "bufferevent_socket_new() failed";

    evutil_closesocket(fd);
    return;
  }

  auto* handshake = new ServerHandshake(
      bev,
      [server](bufferevent* bev) {
        BufferEventWebStream* stream = new BufferEventWebStream(bev, true);

        if (server->on_stream_) {
          server->on_stream_(stream);
        } else {
          LOG(WARNING) << "Warning: No stream handler registered.";
        }

        stream->Start();
      },
      []() {
        LOG(ERROR) << "Server handshake failed";
      });

  handshake->Start();
}

void PlainServer::AcceptErrorCb(evconnlistener* listener, void* ctx) {
  // Suppress unused parameter warnings.
  (void)ctx;

  event_base* base = evconnlistener_get_base(listener);
  int err = EVUTIL_SOCKET_ERROR();
  LOG(ERROR) << "Got an error " << err << " ("
             << evutil_socket_error_to_string(err)
             << ") on the listener. Shutting down.";
  event_base_loopexit(base, nullptr);
}
