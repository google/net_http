#ifndef WISH_CPP_SRC_SOCKET_UTILS_H_
#define WISH_CPP_SRC_SOCKET_UTILS_H_

#include <string>
#include <vector>
#include <cstdint>

#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <arpa/inet.h>

class Socket {
 public:
  Socket();
  ~Socket();

  // Disable copy
  Socket(const Socket&) = delete;
  Socket& operator=(const Socket&) = delete;

  // Move support
  Socket(Socket&& other) noexcept;
  Socket& operator=(Socket&& other) noexcept;

  // Initialize the socket (socket() call)
  // Returns 0 on success, -1 on error
  int Init();

  // Returns 0 on success, -1 on error
  int Connect(const std::string& host, int port);
  
  // Returns 0 on success, -1 on error
  int BindAndListen(int port);
  
  // Returns a new Socket object. On error, the returned socket is invalid (fd == -1).
  Socket Accept();

  // Returns bytes sent or -1 on error
  ssize_t SendData(const void* data, size_t len);
  
  // Returns bytes received or -1 on error
  ssize_t RecvData(void* buf, size_t len);

  // Set non-blocking mode if needed
  // Returns 0 on success, -1 on error
  int SetNonBlocking(bool non_blocking);

  int get_fd() const { return fd_; }
  bool is_valid() const { return fd_ != -1; }
  void CloseSocket();

 private:
  int fd_;
  explicit Socket(int fd); // For Accept()
};

#endif // WISH_CPP_SRC_SOCKET_UTILS_H_
