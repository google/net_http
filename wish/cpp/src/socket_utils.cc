#include <cstring>
#include <iostream>
#include <fcntl.h>
#include <netdb.h>

#include "socket_utils.h"

Socket::Socket() : fd_(-1) {}

Socket::Socket(int fd) : fd_(fd) {}

Socket::~Socket() {
  CloseSocket();
}

Socket::Socket(Socket&& other) noexcept : fd_(other.fd_) {
  other.fd_ = -1;
}

Socket& Socket::operator=(Socket&& other) noexcept {
  if (this != &other) {
    CloseSocket();
    fd_ = other.fd_;
    other.fd_ = -1;
  }
  return *this;
}

int Socket::Init() {
  if (fd_ != -1) return 0; // Already initialized
  fd_ = socket(AF_INET, SOCK_STREAM, 0);
  if (fd_ == -1) {
    return -1;
  }
  return 0;
}

void Socket::CloseSocket() {
  if (fd_ != -1) {
    close(fd_);
    fd_ = -1;
  }
}

int Socket::Connect(const std::string& host, int port) {
  if (Init() != 0) return -1;

  struct sockaddr_in serv_addr;
  struct hostent *server;

  server = gethostbyname(host.c_str());
  if (server == NULL) {
    return -1;
  }

  std::memset(&serv_addr, 0, sizeof(serv_addr));
  serv_addr.sin_family = AF_INET;
  std::memcpy(&serv_addr.sin_addr.s_addr, server->h_addr, server->h_length);
  serv_addr.sin_port = htons(port);

  if (::connect(fd_, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0) {
    return -1;
  }
  return 0;
}

int Socket::BindAndListen(int port) {
  if (Init() != 0) return -1;

  struct sockaddr_in serv_addr;
  std::memset(&serv_addr, 0, sizeof(serv_addr));
  serv_addr.sin_family = AF_INET;
  serv_addr.sin_addr.s_addr = INADDR_ANY;
  serv_addr.sin_port = htons(port);

  int opt = 1;
  if (setsockopt(fd_, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt)) < 0) {
    return -1;
  }

  if (bind(fd_, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) < 0) {
    return -1;
  }

  if (listen(fd_, 5) < 0) {
    return -1;
  }
  return 0;
}

Socket Socket::Accept() {
  struct sockaddr_in cli_addr;
  socklen_t clilen = sizeof(cli_addr);
  int new_sockfd = ::accept(fd_, (struct sockaddr *)&cli_addr, &clilen);
  // If accept returns -1, the returned Socket will have fd_ = -1 (invalid)
  return Socket(new_sockfd);
}

ssize_t Socket::SendData(const void* data, size_t len) {
  return send(fd_, data, len, 0);
}

ssize_t Socket::RecvData(void* buf, size_t len) {
  return recv(fd_, buf, len, 0);
}

int Socket::SetNonBlocking(bool non_blocking) {
  int flags = fcntl(fd_, F_GETFL, 0);
  if (flags == -1) {
    return -1;
  }
  if (non_blocking) {
    flags |= O_NONBLOCK;
  } else {
    flags &= ~O_NONBLOCK;
  }
  if (fcntl(fd_, F_SETFL, flags) == -1) {
    return -1;
  }
  return 0;
}
