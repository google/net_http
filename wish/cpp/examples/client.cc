#include <iostream>
#include <cstring>
#include <string>

#include <event2/event.h>
#include <event2/bufferevent.h>
#include <event2/dns.h>

#include "../src/wish_handler.h"

int main() {
    struct event_base *base = event_base_new();
    if (!base) {
        std::cerr << "Could not initialize libevent!" << std::endl;
        return 1;
    }

    struct evdns_base *dns_base = evdns_base_new(base, 1);
    if (!dns_base) {
        std::cerr << "Could not initialize dns!" << std::endl;
        return 1;
    }

    struct bufferevent *bev = bufferevent_socket_new(base, -1, BEV_OPT_CLOSE_ON_FREE);
    if (!bev) {
        std::cerr << "Could not create bufferevent!" << std::endl;
        return 1;
    }

    if (bufferevent_socket_connect_hostname(bev, dns_base, AF_INET, "127.0.0.1", 8080) < 0) {
        std::cerr << "Could not connect!" << std::endl;
        return 1;
    }

    // Handler manages its own lifecycle (deletes itself on close)
    WishHandler* handler = new WishHandler(bev, false); // is_server = false
    
    handler->SetOnOpen([handler]() {
        std::cout << "Connected and Handshake Complete!" << std::endl;
        
        handler->SendText("Hello WiSH Text!");
        handler->SendBinary("Hello WiSH Binary!");
        handler->SendMetadata(true, "Hello WiSH Metadata!");
    });

    handler->SetOnMessage([](uint8_t opcode, const std::string& msg) {
        std::cout << "Server says [opcode " << (int)opcode << "]: " << msg << std::endl;
    });

    handler->Start();

    std::cout << "Client running..." << std::endl;
    event_base_dispatch(base);

    evdns_base_free(dns_base, 0);
    event_base_free(base);
    
    return 0;
}
