#include <event2/event.h>
#include <event2/thread.h>
#include <nanobind/nanobind.h>
#include <nanobind/stl/function.h>
#include <nanobind/stl/shared_ptr.h>
#include <nanobind/stl/string.h>

#include <atomic>
#include <condition_variable>
#include <memory>
#include <mutex>

#include "buffer_event_web_stream.h"
#include "plain_client.h"
#include "plain_server.h"
#include "tls_client.h"
#include "tls_server.h"
#include "wish_opcodes.h"

namespace nb = nanobind;

// ---------------------------------------------------------------------------
// WebStreamHandlerRef: a shared, nullable handle to WebStream.
// ---------------------------------------------------------------------------

struct WebStreamHandlerRef : std::enable_shared_from_this<WebStreamHandlerRef> {
  enum class CommandType { kSendText, kSendBinary, kSendMetadata, kClose };

  struct Command {
    Command(CommandType type, std::string message,
            std::shared_ptr<WebStreamHandlerRef> ref)
        : type(type), message(std::move(message)), ref(std::move(ref)) {}

    CommandType type;
    std::string message;
    std::shared_ptr<WebStreamHandlerRef> ref;
    std::mutex mu;
    std::condition_variable done_cv;
    bool done = false;
    int result = -1;
  };

  struct ScheduledCommand {
    std::shared_ptr<Command> command;
  };

  std::mutex mu;
  WebStream* ptr = nullptr;
  event_base* base = nullptr;

  nb::object on_message_cb;
  nb::object on_close_cb;
  nb::object on_error_cb;

  ~WebStreamHandlerRef() {
    if (Py_IsInitialized()) {
      nb::gil_scoped_acquire acquire;
      on_message_cb = nb::object();
      on_close_cb = nb::object();
      on_error_cb = nb::object();
    } else {
      on_message_cb.release();
      on_close_cb.release();
      on_error_cb.release();
    }
  }

  void bind(event_base* event_base) {
    std::lock_guard<std::mutex> lock(mu);
    base = event_base;
  }

  int send_text(const std::string& msg) {
    return Dispatch(CommandType::kSendText, msg);
  }

  int send_binary(const std::string& msg) {
    return Dispatch(CommandType::kSendBinary, msg);
  }

  int close() {
    return Dispatch(CommandType::kClose, "");
  }

  int send_metadata(const std::string& msg) {
    return Dispatch(CommandType::kSendMetadata, msg);
  }

  std::string path() {
    std::lock_guard<std::mutex> lock(mu);

    if (!ptr) {
      return "";
    }
    return ptr->path();
  }

 private:
  static void RunCommand(evutil_socket_t, short, void* arg) {
  std::unique_ptr<ScheduledCommand> scheduled_command(
    static_cast<ScheduledCommand*>(arg));
  std::shared_ptr<Command> command = std::move(scheduled_command->command);

    {
      std::lock_guard<std::mutex> ref_lock(command->ref->mu);
      if (command->ref->ptr) {
        switch (command->type) {
          case CommandType::kSendText:
            command->result = command->ref->ptr->SendText(command->message);
            break;
          case CommandType::kSendBinary:
            command->result = command->ref->ptr->SendBinary(command->message);
            break;
          case CommandType::kSendMetadata:
            command->result = command->ref->ptr->SendMetadata(command->message);
            break;
          case CommandType::kClose:
            command->result = command->ref->ptr->Close();
            break;
        }
      } else if (command->type == CommandType::kClose) {
        command->result = 0;
      }
    }

    {
      std::lock_guard<std::mutex> command_lock(command->mu);
      command->done = true;
    }
    command->done_cv.notify_one();
  }

  int Dispatch(CommandType type, const std::string& message) {
    std::shared_ptr<WebStreamHandlerRef> self = shared_from_this();
    event_base* event_base = nullptr;
    {
      std::lock_guard<std::mutex> lock(mu);
      if (!ptr) {
        if (type == CommandType::kClose) {
          return 0;
        }
        throw std::runtime_error("Connection is closed");
      }
      event_base = base;
    }
    if (!event_base) {
      throw std::runtime_error("Connection event loop is unavailable");
    }

    auto command = std::make_shared<Command>(type, message, std::move(self));
    auto* scheduled_command = new ScheduledCommand{command};
    timeval immediately = {0, 0};
    if (event_base_once(event_base, -1, EV_TIMEOUT, RunCommand, scheduled_command,
                        &immediately) != 0) {
      delete scheduled_command;
      throw std::runtime_error("Failed to schedule connection operation");
    }

    std::unique_lock<std::mutex> command_lock(command->mu);
    command->done_cv.wait(command_lock, [&command] { return command->done; });
    return command->result;
  }
};

// Custom deleter for event_base to manage its lifecycle inside the Py wrappers
struct EventBaseDeleter {
  void operator()(event_base* base) const {
    if (base) {
      event_base_free(base);
    }
  }
};

// ---------------------------------------------------------------------------
// Wrapper structs
// ---------------------------------------------------------------------------

struct TlsClientPy {
  std::unique_ptr<event_base, EventBaseDeleter> base;

  TlsClient client;

  nb::object on_open_cb;
  nb::object on_message_cb;
  nb::object on_error_cb;
  nb::object on_close_cb;

  std::shared_ptr<WebStreamHandlerRef> handler_ref;

  // Tracks whether Run() is currently executing.
  std::atomic<bool> running{false};
  std::mutex stopped_mu;
  std::condition_variable stopped_cv;

  std::atomic<bool> finalized{false};

  TlsClientPy(const std::string& ca,
              const std::string& cert,
              const std::string& key,
              const std::string& host,
              int port,
              const std::string& path = "/")
      : base(event_base_new()),
        client(base.get(),
               host,
               port,
               ca,
               cert,
               key,
               path) {
    if (base) {
      evthread_make_base_notifiable(base.get());
    }
    client.SetOnError([this]() {
      nb::gil_scoped_acquire acquire;
      client.Stop();

      if (handler_ref) {
        std::lock_guard<std::mutex> lock(handler_ref->mu);

        handler_ref->ptr = nullptr;
      }

      if (on_error_cb.ptr() && !on_error_cb.is_none()) {
        try {
          on_error_cb();
        } catch (nb::python_error& e) {
          e.restore();
          PyErr_WriteUnraisable(on_error_cb.ptr());
        }
      }
    });
  }
};

struct PlainClientPy {
  std::unique_ptr<event_base, EventBaseDeleter> base;

  PlainClient client;

  nb::object on_open_cb;
  nb::object on_message_cb;
  nb::object on_error_cb;
  nb::object on_close_cb;

  std::shared_ptr<WebStreamHandlerRef> handler_ref;

  std::atomic<bool> running{false};
  std::mutex stopped_mu;
  std::condition_variable stopped_cv;

  std::atomic<bool> finalized{false};

  PlainClientPy(const std::string& host,
                int port,
                const std::string& path = "/")
      : base(event_base_new()),
        client(base.get(),
               host,
               port,
               path) {
    if (base) {
      evthread_make_base_notifiable(base.get());
    }
    client.SetOnError([this]() {
      nb::gil_scoped_acquire acquire;
      client.Stop();

      if (handler_ref) {
        std::lock_guard<std::mutex> lock(handler_ref->mu);

        handler_ref->ptr = nullptr;
      }

      if (on_error_cb.ptr() && !on_error_cb.is_none()) {
        try {
          on_error_cb();
        } catch (nb::python_error& e) {
          e.restore();
          PyErr_WriteUnraisable(on_error_cb.ptr());
        }
      }
    });
  }
};

// ---------------------------------------------------------------------------
// tp_traverse / tp_clear / tp_finalize for TlsClientPy
// ---------------------------------------------------------------------------

static void tls_do_cleanup(TlsClientPy* w) {
  if (w->finalized.exchange(true, std::memory_order_acq_rel)) {
    return;
  }

  w->client.Stop();

  {
    PyThreadState* ts = PyEval_SaveThread();  // release GIL
    std::unique_lock<std::mutex> lk(w->stopped_mu);
    w->stopped_cv.wait(lk, [w] {
      return !w->running.load(std::memory_order_acquire);
    });
    PyEval_RestoreThread(ts);  // reacquire GIL
  }

  w->client.SetOnOpen({});

  if (w->handler_ref) {
    std::lock_guard<std::mutex> lock(w->handler_ref->mu);
    w->handler_ref->ptr = nullptr;
  }
  w->handler_ref.reset();
}

static void tls_finalize(PyObject* self) {
  TlsClientPy* w = nb::inst_ptr<TlsClientPy>(nb::handle(self));
  tls_do_cleanup(w);
}

static int tls_traverse(PyObject* self, visitproc visit, void* arg) {
  TlsClientPy* w = nb::inst_ptr<TlsClientPy>(nb::handle(self));

  Py_VISIT(w->on_open_cb.ptr());
  Py_VISIT(w->on_message_cb.ptr());
  Py_VISIT(w->on_error_cb.ptr());
  Py_VISIT(w->on_close_cb.ptr());

  return 0;
}

static int tls_clear(PyObject* self) {
  TlsClientPy* w = nb::inst_ptr<TlsClientPy>(nb::handle(self));

  tls_do_cleanup(w);

  w->on_open_cb = nb::object();
  w->on_message_cb = nb::object();
  w->on_error_cb = nb::object();
  w->on_close_cb = nb::object();

  return 0;
}

// ---------------------------------------------------------------------------
// tp_traverse / tp_clear / tp_finalize for PlainClientPy
// ---------------------------------------------------------------------------

static void plain_do_cleanup(PlainClientPy* w) {
  if (w->finalized.exchange(true, std::memory_order_acq_rel)) {
    return;
  }

  w->client.Stop();

  {
    PyThreadState* ts = PyEval_SaveThread();
    std::unique_lock<std::mutex> lk(w->stopped_mu);
    w->stopped_cv.wait(lk, [w] {
      return !w->running.load(std::memory_order_acquire);
    });
    PyEval_RestoreThread(ts);
  }

  w->client.SetOnOpen({});

  if (w->handler_ref) {
    std::lock_guard<std::mutex> lock(w->handler_ref->mu);
    w->handler_ref->ptr = nullptr;
  }
  w->handler_ref.reset();
}

static void plain_finalize(PyObject* self) {
  PlainClientPy* w = nb::inst_ptr<PlainClientPy>(nb::handle(self));
  plain_do_cleanup(w);
}

static int plain_traverse(PyObject* self, visitproc visit, void* arg) {
  PlainClientPy* w = nb::inst_ptr<PlainClientPy>(nb::handle(self));

  Py_VISIT(w->on_open_cb.ptr());
  Py_VISIT(w->on_message_cb.ptr());
  Py_VISIT(w->on_error_cb.ptr());
  Py_VISIT(w->on_close_cb.ptr());

  return 0;
}

static int plain_clear(PyObject* self) {
  PlainClientPy* w = nb::inst_ptr<PlainClientPy>(nb::handle(self));

  plain_do_cleanup(w);

  w->on_open_cb = nb::object();
  w->on_message_cb = nb::object();
  w->on_error_cb = nb::object();
  w->on_close_cb = nb::object();

  return 0;
}

// ---------------------------------------------------------------------------
// PlainServerPy & TlsServerPy
// ---------------------------------------------------------------------------

struct PlainServerPy {
  std::unique_ptr<event_base, EventBaseDeleter> base;
  PlainServer server;

  nb::object on_stream_cb;

  std::atomic<bool> running{false};
  std::mutex stopped_mu;
  std::condition_variable stopped_cv;
  std::atomic<bool> finalized{false};

  PlainServerPy(int port)
      : base(event_base_new()),
        server(base.get(), port) {
    if (!base) {
      throw std::runtime_error("Failed to create event_base");
    }
    evthread_make_base_notifiable(base.get());
  }

  void stop() {
    if (base) {
      event_base_loopexit(base.get(), nullptr);
      event_base_loopbreak(base.get());
    }
  }
};

static void plain_server_do_cleanup(PlainServerPy* w) {
  if (w->finalized.exchange(true, std::memory_order_acq_rel)) {
    return;
  }
  w->stop();
  {
    PyThreadState* ts = PyEval_SaveThread();
    std::unique_lock<std::mutex> lk(w->stopped_mu);
    w->stopped_cv.wait(lk, [w] {
      return !w->running.load(std::memory_order_acquire);
    });
    PyEval_RestoreThread(ts);
  }
}

static void plain_server_finalize(PyObject* self) {
  PlainServerPy* w = nb::inst_ptr<PlainServerPy>(nb::handle(self));
  plain_server_do_cleanup(w);
}

static int plain_server_traverse(PyObject* self, visitproc visit, void* arg) {
  PlainServerPy* w = nb::inst_ptr<PlainServerPy>(nb::handle(self));
  Py_VISIT(w->on_stream_cb.ptr());
  return 0;
}

static int plain_server_clear(PyObject* self) {
  PlainServerPy* w = nb::inst_ptr<PlainServerPy>(nb::handle(self));
  plain_server_do_cleanup(w);
  w->on_stream_cb = nb::object();
  return 0;
}

struct TlsServerPy {
  std::unique_ptr<event_base, EventBaseDeleter> base;
  TlsServer server;

  nb::object on_stream_cb;

  std::atomic<bool> running{false};
  std::mutex stopped_mu;
  std::condition_variable stopped_cv;
  std::atomic<bool> finalized{false};

  TlsServerPy(const std::string& ca,
              const std::string& cert,
              const std::string& key,
              int port)
      : base(event_base_new()),
        server(base.get(), port, ca, cert, key) {
    if (!base) {
      throw std::runtime_error("Failed to create event_base");
    }
    evthread_make_base_notifiable(base.get());
  }

  void stop() {
    if (base) {
      event_base_loopexit(base.get(), nullptr);
      event_base_loopbreak(base.get());
    }
  }
};

static void tls_server_do_cleanup(TlsServerPy* w) {
  if (w->finalized.exchange(true, std::memory_order_acq_rel)) {
    return;
  }
  w->stop();
  {
    PyThreadState* ts = PyEval_SaveThread();
    std::unique_lock<std::mutex> lk(w->stopped_mu);
    w->stopped_cv.wait(lk, [w] {
      return !w->running.load(std::memory_order_acquire);
    });
    PyEval_RestoreThread(ts);
  }
}

static void tls_server_finalize(PyObject* self) {
  TlsServerPy* w = nb::inst_ptr<TlsServerPy>(nb::handle(self));
  tls_server_do_cleanup(w);
}

static int tls_server_traverse(PyObject* self, visitproc visit, void* arg) {
  TlsServerPy* w = nb::inst_ptr<TlsServerPy>(nb::handle(self));
  Py_VISIT(w->on_stream_cb.ptr());
  return 0;
}

static int tls_server_clear(PyObject* self) {
  TlsServerPy* w = nb::inst_ptr<TlsServerPy>(nb::handle(self));
  tls_server_do_cleanup(w);
  w->on_stream_cb = nb::object();
  return 0;
}

// ---------------------------------------------------------------------------

NB_MODULE(web_stream_ext, m) {
#ifdef _WIN32
  evthread_use_windows_threads();
#else
  evthread_use_pthreads();
#endif

  nb::class_<WebStreamHandlerRef>(m, "BufferEventWebStream")
      .def("send_text", [](WebStreamHandlerRef& self, const std::string& msg) {
        nb::gil_scoped_release release;
        return self.send_text(msg);
      })
      .def("send_binary", [](WebStreamHandlerRef& self, nb::object data) {
        std::string s;
        if (nb::isinstance<nb::bytes>(data)) {
          nb::bytes b = nb::cast<nb::bytes>(data);
          s = std::string(b.c_str(), b.size());
        } else if (nb::isinstance<nb::str>(data)) {
          nb::str str_obj = nb::cast<nb::str>(data);
          s = str_obj.c_str();
        } else {
          throw nb::type_error("send_binary() expects bytes or str");
        }

        nb::gil_scoped_release release;
        return self.send_binary(s);
      })
      .def("send_metadata", [](WebStreamHandlerRef& self, nb::object data) {
        std::string s;
        if (nb::isinstance<nb::bytes>(data)) {
          nb::bytes b = nb::cast<nb::bytes>(data);
          s = std::string(b.c_str(), b.size());
        } else if (nb::isinstance<nb::str>(data)) {
          nb::str str_obj = nb::cast<nb::str>(data);
          s = str_obj.c_str();
        } else {
          throw nb::type_error("send_metadata() expects bytes or str");
        }

        nb::gil_scoped_release release;
        return self.send_metadata(s);
      })
      .def("set_on_message", [](WebStreamHandlerRef& self, nb::object cb) {
        std::lock_guard<std::mutex> lock(self.mu);
        self.on_message_cb = cb;
      })
      .def("set_on_close", [](WebStreamHandlerRef& self, nb::object cb) {
        std::lock_guard<std::mutex> lock(self.mu);
        self.on_close_cb = cb;
      })
      .def("set_on_error", [](WebStreamHandlerRef& self, nb::object cb) {
        std::lock_guard<std::mutex> lock(self.mu);
        self.on_error_cb = cb;
      })
      .def("close", [](WebStreamHandlerRef& self) {
        nb::gil_scoped_release release;
        return self.close();
      })
      .def("path", &WebStreamHandlerRef::path);

  // ---- PlainServer ------------------------------------------------------
  static PyType_Slot plain_server_slots[] = {
      {Py_tp_traverse, (void*)plain_server_traverse},
      {Py_tp_clear, (void*)plain_server_clear},
      {Py_tp_finalize, (void*)plain_server_finalize},
      {0, nullptr},
  };

  nb::class_<PlainServerPy>(m, "PlainServer", nb::type_slots(plain_server_slots))
      .def(nb::init<int>())
      .def("init", [](PlainServerPy& self) -> bool {
        self.server.SetOnStream([&self](WebStream* stream) {
          auto ref = std::make_shared<WebStreamHandlerRef>();
          ref->bind(self.base.get());
          {
            std::lock_guard<std::mutex> lock(ref->mu);
            ref->ptr = stream;
          }

          stream->SetOnMessage([ref](uint8_t opcode, const std::string& msg) {
            nb::gil_scoped_acquire acquire;
            nb::object cb;
            {
              std::lock_guard<std::mutex> lock(ref->mu);
              cb = ref->on_message_cb;
            }
            if (cb.ptr() && !cb.is_none()) {
              try {
                cb(opcode, nb::bytes(msg.data(), msg.size()));
              } catch (nb::python_error& e) {
                e.restore();
                PyErr_WriteUnraisable(cb.ptr());
              }
            }
          });

          stream->SetOnClose([ref]() {
            nb::gil_scoped_acquire acquire;
            nb::object cb;
            {
              std::lock_guard<std::mutex> lock(ref->mu);
              cb = ref->on_close_cb;
              ref->ptr = nullptr;
              ref->on_message_cb = nb::object();
              ref->on_close_cb = nb::object();
              ref->on_error_cb = nb::object();
            }
            if (cb.ptr() && !cb.is_none()) {
              try {
                cb();
              } catch (nb::python_error& e) {
                e.restore();
                PyErr_WriteUnraisable(cb.ptr());
              }
            }
          });

          stream->SetOnError([ref]() {
            nb::gil_scoped_acquire acquire;
            nb::object cb;
            {
              std::lock_guard<std::mutex> lock(ref->mu);
              cb = ref->on_error_cb;
              ref->ptr = nullptr;
              ref->on_message_cb = nb::object();
              ref->on_close_cb = nb::object();
              ref->on_error_cb = nb::object();
            }
            if (cb.ptr() && !cb.is_none()) {
              try {
                cb();
              } catch (nb::python_error& e) {
                e.restore();
                PyErr_WriteUnraisable(cb.ptr());
              }
            }
          });

          nb::gil_scoped_acquire acquire;
          if (self.on_stream_cb.ptr() && !self.on_stream_cb.is_none()) {
            try {
              self.on_stream_cb(ref);
            } catch (nb::python_error& e) {
              e.restore();
              PyErr_WriteUnraisable(self.on_stream_cb.ptr());
            }
          }
        });

        if (!self.server.Init()) {
          throw std::runtime_error("PlainServer.init() failed");
        }
        return true;
      })
      .def("set_on_stream", [](PlainServerPy& self, nb::object cb) {
        self.on_stream_cb = cb;
      })
      .def("run", [](PlainServerPy& self) {
        self.running.store(true, std::memory_order_release);
        struct RunGuard {
          PlainServerPy& s;
          ~RunGuard() noexcept {
            {
              std::lock_guard<std::mutex> lk(s.stopped_mu);
              s.running.store(false, std::memory_order_release);
            }
            s.stopped_cv.notify_all();
          }
        } guard{self};
        self.server.Run();
      }, nb::call_guard<nb::gil_scoped_release>())
      .def("stop", [](PlainServerPy& self) {
        nb::gil_scoped_release release;
        self.stop();
      });

  // ---- TlsServer --------------------------------------------------------
  static PyType_Slot tls_server_slots[] = {
      {Py_tp_traverse, (void*)tls_server_traverse},
      {Py_tp_clear, (void*)tls_server_clear},
      {Py_tp_finalize, (void*)tls_server_finalize},
      {0, nullptr},
  };

  nb::class_<TlsServerPy>(m, "TlsServer", nb::type_slots(tls_server_slots))
      .def(nb::init<const std::string&, const std::string&, const std::string&, int>())
      .def("init", [](TlsServerPy& self) -> bool {
        self.server.SetOnStream([&self](WebStream* stream) {
          auto ref = std::make_shared<WebStreamHandlerRef>();
          ref->bind(self.base.get());
          {
            std::lock_guard<std::mutex> lock(ref->mu);
            ref->ptr = stream;
          }

          stream->SetOnClose([ref]() {
            nb::gil_scoped_acquire acquire;
            nb::object cb;
            {
              std::lock_guard<std::mutex> lock(ref->mu);
              cb = ref->on_close_cb;
              ref->ptr = nullptr;
              ref->on_message_cb = nb::object();
              ref->on_close_cb = nb::object();
              ref->on_error_cb = nb::object();
            }
            if (cb.ptr() && !cb.is_none()) {
              try {
                cb();
              } catch (nb::python_error& e) {
                e.restore();
                PyErr_WriteUnraisable(cb.ptr());
              }
            }
          });

          stream->SetOnError([ref]() {
            nb::gil_scoped_acquire acquire;
            nb::object cb;
            {
              std::lock_guard<std::mutex> lock(ref->mu);
              cb = ref->on_error_cb;
              ref->ptr = nullptr;
              ref->on_message_cb = nb::object();
              ref->on_close_cb = nb::object();
              ref->on_error_cb = nb::object();
            }
            if (cb.ptr() && !cb.is_none()) {
              try {
                cb();
              } catch (nb::python_error& e) {
                e.restore();
                PyErr_WriteUnraisable(cb.ptr());
              }
            }
          });

          stream->SetOnMessage([ref](uint8_t opcode, const std::string& msg) {
            nb::gil_scoped_acquire acquire;
            nb::object cb;
            {
              std::lock_guard<std::mutex> lock(ref->mu);
              cb = ref->on_message_cb;
            }
            if (cb.ptr() && !cb.is_none()) {
              try {
                cb(opcode, nb::bytes(msg.data(), msg.size()));
              } catch (nb::python_error& e) {
                e.restore();
                PyErr_WriteUnraisable(cb.ptr());
              }
            }
          });

          nb::gil_scoped_acquire acquire;
          if (self.on_stream_cb.ptr() && !self.on_stream_cb.is_none()) {
            try {
              self.on_stream_cb(ref);
            } catch (nb::python_error& e) {
              e.restore();
              PyErr_WriteUnraisable(self.on_stream_cb.ptr());
            }
          }
        });

        if (!self.server.Init()) {
          throw std::runtime_error("TlsServer.init() failed");
        }
        return true;
      })
      .def("set_on_stream", [](TlsServerPy& self, nb::object cb) {
        self.on_stream_cb = cb;
      })
      .def("run", [](TlsServerPy& self) {
        self.running.store(true, std::memory_order_release);
        struct RunGuard {
          TlsServerPy& s;
          ~RunGuard() noexcept {
            {
              std::lock_guard<std::mutex> lk(s.stopped_mu);
              s.running.store(false, std::memory_order_release);
            }
            s.stopped_cv.notify_all();
          }
        } guard{self};
        self.server.Run();
      }, nb::call_guard<nb::gil_scoped_release>())
      .def("stop", [](TlsServerPy& self) {
        nb::gil_scoped_release release;
        self.stop();
      });

  // ---- TlsClient --------------------------------------------------------
  static PyType_Slot tls_slots[] = {
      {Py_tp_traverse, (void*)tls_traverse},
      {Py_tp_clear, (void*)tls_clear},
      {Py_tp_finalize, (void*)tls_finalize},
      {0, nullptr},
  };

  nb::class_<TlsClientPy>(m, "TlsClient", nb::type_slots(tls_slots))
      .def(nb::init<const std::string&,
                    const std::string&,
                    const std::string&,
                    const std::string&,
                    int,
                    const std::string&>(),
           nb::arg("ca"),
           nb::arg("cert"),
           nb::arg("key"),
           nb::arg("host"),
           nb::arg("port"),
           nb::arg("path") = "/")
      .def("init", [](TlsClientPy& self) -> bool {
        if (!self.client.Init()) {
          throw std::runtime_error("TlsClient.init() failed");
        }
        return true;
      })
      .def("set_on_open", [](TlsClientPy& self, nb::object cb) {
        if (self.handler_ref) {
          std::lock_guard<std::mutex> lock(self.handler_ref->mu);

          self.handler_ref->ptr = nullptr;
        }
        self.handler_ref.reset();

        self.on_open_cb = cb;

        auto ref = std::make_shared<WebStreamHandlerRef>();
  ref->bind(self.base.get());
        self.handler_ref = ref;

        self.client.SetOnOpen([&self, ref](WebStream* handler) {
          {
            std::lock_guard<std::mutex> lock(ref->mu);

            ref->ptr = handler;
          }

          handler->SetOnClose([ref, &self]() {
            {
              std::lock_guard<std::mutex> lock(ref->mu);

              ref->ptr = nullptr;
            }

            self.client.Stop();

            nb::gil_scoped_acquire acquire;
            if (self.on_close_cb.ptr() && !self.on_close_cb.is_none()) {
              try {
                self.on_close_cb();
              } catch (nb::python_error& e) {
                e.restore();
                PyErr_WriteUnraisable(self.on_close_cb.ptr());
              }
            }
          });

          handler->SetOnError([ref, &self]() {
            {
              std::lock_guard<std::mutex> lock(ref->mu);
              ref->ptr = nullptr;
            }

            self.client.Stop();

            nb::gil_scoped_acquire acquire;
            if (self.on_error_cb.ptr() && !self.on_error_cb.is_none()) {
              try {
                self.on_error_cb();
              } catch (nb::python_error& e) {
                e.restore();
                PyErr_WriteUnraisable(self.on_error_cb.ptr());
              }
            }
          });

          handler->SetOnMessage([&self](uint8_t opcode, const std::string& msg) {
            nb::gil_scoped_acquire acquire;
            if (self.on_message_cb.ptr() && !self.on_message_cb.is_none()) {
              try {
                self.on_message_cb(opcode, nb::bytes(msg.data(), msg.size()));
              } catch (nb::python_error& e) {
                e.restore();
                PyErr_WriteUnraisable(self.on_message_cb.ptr());
              }
            }
          });

          nb::gil_scoped_acquire acquire;
          if (self.on_open_cb.ptr() && !self.on_open_cb.is_none()) {
            try {
              self.on_open_cb(ref);
            } catch (nb::python_error& e) {
              e.restore();
              PyErr_WriteUnraisable(self.on_open_cb.ptr());
            }
          }
        });
      })
      .def("set_on_message", [](TlsClientPy& self, nb::object cb) {
        self.on_message_cb = cb;
      })
      .def("set_on_error", [](TlsClientPy& self, nb::object cb) {
        self.on_error_cb = cb;
      })
      .def("set_on_close", [](TlsClientPy& self, nb::object cb) {
        self.on_close_cb = cb;
      })
      .def("run", [](TlsClientPy& self) {
        self.running.store(true, std::memory_order_release);
        struct RunGuard {
          TlsClientPy& s;
          ~RunGuard() noexcept {
            {
              std::lock_guard<std::mutex> lk(s.stopped_mu);
              s.running.store(false, std::memory_order_release);
            }
            s.stopped_cv.notify_all();
          }
        } guard{self};
        self.client.Run(); }, nb::call_guard<nb::gil_scoped_release>())
      .def("stop", [](TlsClientPy& self) {
        auto handler_ref = self.handler_ref;
        nb::gil_scoped_release release;
        self.client.Stop();
        if (handler_ref) {
          std::lock_guard<std::mutex> lock(handler_ref->mu);
          handler_ref->ptr = nullptr;
        } })
      .def("__enter__", [](TlsClientPy& self) -> TlsClientPy& { return self; })
      .def("__exit__", [](TlsClientPy& self, nb::object, nb::object, nb::object) {
        auto handler_ref = self.handler_ref;
        nb::gil_scoped_release release;
        self.client.Stop();
        if (handler_ref) {
          std::lock_guard<std::mutex> lock(handler_ref->mu);
          handler_ref->ptr = nullptr;
        } });

  // ---- PlainClient ------------------------------------------------------
  static PyType_Slot plain_slots[] = {
      {Py_tp_traverse, (void*)plain_traverse},
      {Py_tp_clear, (void*)plain_clear},
      {Py_tp_finalize, (void*)plain_finalize},
      {0, nullptr},
  };

  nb::class_<PlainClientPy>(m, "PlainClient", nb::type_slots(plain_slots))
      .def(nb::init<const std::string&, int, const std::string&>(),
           nb::arg("host"),
           nb::arg("port"),
           nb::arg("path") = "/")
      .def("init", [](PlainClientPy& self) -> bool {
        if (!self.client.Init()) {
          throw std::runtime_error("PlainClient.init() failed");
        }
        return true;
      })
      .def("set_on_open", [](PlainClientPy& self, nb::object cb) {
        if (self.handler_ref) {
          std::lock_guard<std::mutex> lock(self.handler_ref->mu);

          self.handler_ref->ptr = nullptr;
        }
        self.handler_ref.reset();

        self.on_open_cb = cb;

        auto ref = std::make_shared<WebStreamHandlerRef>();
  ref->bind(self.base.get());
        self.handler_ref = ref;

        self.client.SetOnOpen([&self, ref](WebStream* handler) {
          {
            std::lock_guard<std::mutex> lock(ref->mu);

            ref->ptr = handler;
          }

          handler->SetOnClose([ref, &self]() {
            {
              std::lock_guard<std::mutex> lock(ref->mu);

              ref->ptr = nullptr;
            }

            self.client.Stop();

            nb::gil_scoped_acquire acquire;
            if (self.on_close_cb.ptr() && !self.on_close_cb.is_none()) {
              try {
                self.on_close_cb();
              } catch (nb::python_error& e) {
                e.restore();
                PyErr_WriteUnraisable(self.on_close_cb.ptr());
              }
            }
          });

          handler->SetOnError([ref, &self]() {
            {
              std::lock_guard<std::mutex> lock(ref->mu);
              ref->ptr = nullptr;
            }

            self.client.Stop();

            nb::gil_scoped_acquire acquire;
            if (self.on_error_cb.ptr() && !self.on_error_cb.is_none()) {
              try {
                self.on_error_cb();
              } catch (nb::python_error& e) {
                e.restore();
                PyErr_WriteUnraisable(self.on_error_cb.ptr());
              }
            }
          });

          handler->SetOnMessage([&self](uint8_t opcode, const std::string& msg) {
            nb::gil_scoped_acquire acquire;
            if (self.on_message_cb.ptr() && !self.on_message_cb.is_none()) {
              try {
                self.on_message_cb(opcode, nb::bytes(msg.data(), msg.size()));
              } catch (nb::python_error& e) {
                e.restore();
                PyErr_WriteUnraisable(self.on_message_cb.ptr());
              }
            }
          });

          nb::gil_scoped_acquire acquire;
          if (self.on_open_cb.ptr() && !self.on_open_cb.is_none()) {
            try {
              self.on_open_cb(ref);
            } catch (nb::python_error& e) {
              e.restore();
              PyErr_WriteUnraisable(self.on_open_cb.ptr());
            }
          }
        });
      })
      .def("set_on_message", [](PlainClientPy& self, nb::object cb) {
        self.on_message_cb = cb;
      })
      .def("set_on_error", [](PlainClientPy& self, nb::object cb) {
        self.on_error_cb = cb;
      })
      .def("set_on_close", [](PlainClientPy& self, nb::object cb) {
        self.on_close_cb = cb;
      })
      .def("run", [](PlainClientPy& self) {
        self.running.store(true, std::memory_order_release);
        struct RunGuard {
          PlainClientPy& s;
          ~RunGuard() noexcept {
            {
              std::lock_guard<std::mutex> lk(s.stopped_mu);
              s.running.store(false, std::memory_order_release);
            }
            s.stopped_cv.notify_all();
          }
        } guard{self};
        self.client.Run(); }, nb::call_guard<nb::gil_scoped_release>())
      .def("stop", [](PlainClientPy& self) {
        auto handler_ref = self.handler_ref;
        nb::gil_scoped_release release;
        self.client.Stop();
        if (handler_ref) {
          std::lock_guard<std::mutex> lock(handler_ref->mu);
          handler_ref->ptr = nullptr;
        } })
      .def("__enter__", [](PlainClientPy& self) -> PlainClientPy& { return self; })
      .def("__exit__", [](PlainClientPy& self, nb::object, nb::object, nb::object) {
        auto handler_ref = self.handler_ref;
        nb::gil_scoped_release release;
        self.client.Stop();
        if (handler_ref) {
          std::lock_guard<std::mutex> lock(handler_ref->mu);
          handler_ref->ptr = nullptr;
        } });
}
