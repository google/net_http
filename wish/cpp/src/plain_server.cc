#include "plain_server.h"

#include <absl/log/log.h>
#include <arpa/inet.h>
#include <event2/util.h>
#include <netinet/tcp.h>

#include <algorithm>
#include <cerrno>
#include <cstring>

#include "buffer_event_web_stream.h"
#include "handshake.h"

PlainServer::PlainServer(event_base* base,
                         int port)
    : base_(base),
      port_(port),
      listener_(nullptr) {}

PlainServer::~PlainServer() {
  active_handshakes_.clear();
  active_streams_.clear();

  if (listener_) {
    evconnlistener_free(listener_);
  }
}

bool PlainServer::Init() {
  if (!base_) {
    VLOG(1) << "event_base is null";

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
    VLOG(1) << "Could not create a listener!";

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
    VLOG(1) << "setsockopt(TCP_NODELAY) failed: " << strerror(errno);
  }

  bufferevent* bev = bufferevent_socket_new(base,
                                            fd,
                                            BEV_OPT_CLOSE_ON_FREE);
  if (!bev) {
    VLOG(1) << "bufferevent_socket_new() failed";

    evutil_closesocket(fd);

    return;
  }

  auto handshake = std::make_unique<ServerHandshake>(
      bev,
      [server](bufferevent* bev) {
        auto stream = std::make_unique<BufferEventWebStream>(bev, true);
        auto* raw_stream = stream.get();
        server->active_streams_.push_back(std::move(stream));

        raw_stream->SetCleanupCallback([server](BufferEventWebStream* s) {
          server->RemoveStream(s);
        });

        if (server->on_stream_) {
          server->on_stream_(raw_stream);
        } else {
          VLOG(2) << "Warning: No stream handler registered.";
        }

        raw_stream->Start();
      },
      []() {
        VLOG(1) << "Server handshake failed";
      },
      [server](ServerHandshake* h) {
        server->RemoveHandshake(h);
      });

  auto* raw_handshake = handshake.get();
  server->active_handshakes_.push_back(std::move(handshake));
  raw_handshake->Start();
}

void PlainServer::AcceptErrorCb(evconnlistener* listener, void* ctx) {
  // Suppress unused parameter warnings.
  (void)ctx;

  event_base* base = evconnlistener_get_base(listener);
  int err = EVUTIL_SOCKET_ERROR();
  VLOG(1) << "Got an error " << err << " ("
          << evutil_socket_error_to_string(err)
          << ") on the listener. Shutting down.";
  event_base_loopexit(base, nullptr);
}

void PlainServer::RemoveHandshake(ServerHandshake* handshake) {
  auto it = std::find_if(active_handshakes_.begin(), active_handshakes_.end(), [handshake](const auto& ptr) { return ptr.get() == handshake; });
  if (it != active_handshakes_.end()) {
    auto ptr = std::move(*it);
    active_handshakes_.erase(it);
  }
}

void PlainServer::RemoveStream(BufferEventWebStream* stream) {
  auto it = std::find_if(active_streams_.begin(), active_streams_.end(), [stream](const auto& ptr) { return ptr.get() == stream; });
  if (it != active_streams_.end()) {
    auto ptr = std::move(*it);
    active_streams_.erase(it);
  }
}
