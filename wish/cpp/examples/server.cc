#include <iostream>
#include <cstring>
#include <string>  // Added for std::to_string

#include <event2/event.h>
#include <event2/listener.h>
#include <event2/bufferevent.h>
#include <arpa/inet.h>

#include "../src/wish_handler.h"

void accept_conn_cb(struct evconnlistener *listener, evutil_socket_t fd,
    struct sockaddr *address, int socklen, void *ctx) {

    struct event_base *base = evconnlistener_get_base(listener);
    struct bufferevent *bev = bufferevent_socket_new(base, fd, BEV_OPT_CLOSE_ON_FREE);

    std::cout << "Client connected." << std::endl;

    // Handler manages its own lifecycle (deletes itself on close)
    WishHandler* handler = new WishHandler(bev, true);
    
    handler->SetOnMessage([handler](uint8_t opcode, const std::string& msg) {
        std::string type;
        switch(opcode) {
          case 1: type = "TEXT"; break;
          case 2: type = "BINARY"; break;
          case 3: type = "TEXT_METADATA"; break;
          case 4: type = "BINARY_METADATA"; break;
          default: type = "UNKNOWN(" + std::to_string(opcode) + ")"; break;
        }
        std::cout << "Received [" << type << "]: " << msg << std::endl;
        
        // Echo back
        int res = 0;
        if (opcode == 1) res = handler->SendText("Echo: " + msg);
        else if (opcode == 2) res = handler->SendBinary("Echo: " + msg);
        else if (opcode == 3 || opcode == 4) res = handler->SendMetadata(opcode == 3, "Echo: " + msg);
        
        if (res != 0) {
            std::cerr << "Failed to send echo." << std::endl;
        }
    });

    handler->Start();
}

void accept_error_cb(struct evconnlistener *listener, void *ctx) {
    struct event_base *base = evconnlistener_get_base(listener);
    int err = EVUTIL_SOCKET_ERROR();
    std::cerr << "Got an error " << err << " (" << evutil_socket_error_to_string(err) << ") on the listener. Shutting down." << std::endl;
    event_base_loopexit(base, NULL);
}

int main(int argc, char **argv) {
    struct event_base *base;
    struct evconnlistener *listener;
    struct sockaddr_in sin;
    int port = 8080;

    base = event_base_new();
    if (!base) {
        std::cerr << "Could not initialize libevent!" << std::endl;
        return 1;
    }

    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = htonl(0);
    sin.sin_port = htons(port);

    listener = evconnlistener_new_bind(base, accept_conn_cb, NULL,
        LEV_OPT_CLOSE_ON_FREE|LEV_OPT_REUSEABLE, -1,
        (struct sockaddr*)&sin, sizeof(sin));

    if (!listener) {
        std::cerr << "Could not create a listener!" << std::endl;
        return 1;
    }

    std::cout << "Server listening on port " << port << "..." << std::endl;
    event_base_dispatch(base);

    evconnlistener_free(listener);
    event_base_free(base);

    return 0;
}
