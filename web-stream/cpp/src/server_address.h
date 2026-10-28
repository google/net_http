// Copyright 2026 Google LLC
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at https://www.apache.org/licenses/LICENSE-2.0

#ifndef WISH_CPP_SRC_SERVER_ADDRESS_H_
#define WISH_CPP_SRC_SERVER_ADDRESS_H_

#include <event2/listener.h>
#include <event2/util.h>
#include <netinet/in.h>
#include <sys/socket.h>

#include <string>

inline evconnlistener* BindStreamListener(event_base* base,
                                          evconnlistener_cb callback, void* ctx,
                                          const std::string& host, int port) {
  std::string address = host.empty() ? "0.0.0.0" : host;
  if (address.find(':') != std::string::npos) address = "[" + address + "]";
  if (port) address += ":" + std::to_string(port);
  sockaddr_storage storage{};
  int length = sizeof(storage);
  if (evutil_parse_sockaddr_port(address.c_str(),
                                reinterpret_cast<sockaddr*>(&storage), &length) != 0)
    return nullptr;
  return evconnlistener_new_bind(base, callback, ctx,
                                LEV_OPT_CLOSE_ON_FREE | LEV_OPT_REUSEABLE, -1,
                                reinterpret_cast<sockaddr*>(&storage), length);
}

inline int StreamListenerPort(evconnlistener* listener) {
  if (!listener) return 0;
  sockaddr_storage address{};
  socklen_t length = sizeof(address);
  if (getsockname(evconnlistener_get_fd(listener),
                  reinterpret_cast<sockaddr*>(&address), &length) != 0)
    return 0;
  if (address.ss_family == AF_INET6)
    return ntohs(reinterpret_cast<sockaddr_in6*>(&address)->sin6_port);
  return ntohs(reinterpret_cast<sockaddr_in*>(&address)->sin_port);
}

#endif  // WISH_CPP_SRC_SERVER_ADDRESS_H_
