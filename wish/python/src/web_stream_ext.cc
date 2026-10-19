#include <event2/event.h>
#include <event2/thread.h>
#include <nanobind/nanobind.h>
#include <nanobind/stl/function.h>
#include <nanobind/stl/shared_ptr.h>
#include <nanobind/stl/string.h>

#include <atomic>
#include <condition_variable>
#include <exception>
#include <functional>
#include <memory>
#include <mutex>
#include <thread>
#include <unordered_map>

#include "buffer_event_web_stream.h"
#include "plain_client.h"
#include "plain_server.h"
#include "tls_client.h"
#include "tls_server.h"
#include "wish_opcodes.h"

namespace nb = nanobind;

// All operations run on the owning libevent thread. Cross-thread callers wait
// for their command, but stop() wakes them even if the loop is inside a callback.
// Scheduled events stay owned until their callback completes or Run() exits.
struct EventLoopDispatcher {
  struct Command {
    EventLoopDispatcher* owner;
    std::function<int()> execute;
    event* scheduled = nullptr;
    std::mutex mu;
    std::condition_variable done_cv;
    bool done = false;
    int result = -1;
    std::exception_ptr error;

    Command(EventLoopDispatcher* owner, std::function<int()> execute)
        : owner(owner), execute(std::move(execute)) {}

    ~Command() { ReleaseEvent(); }

    void ReleaseEvent() {
      if (scheduled) {
        event_free(scheduled);
        scheduled = nullptr;
      }
    }

    void Complete(int value, std::exception_ptr failure = {}) {
      {
        std::lock_guard<std::mutex> lock(mu);
        if (done) {
          return;
        }
        result = value;
        error = failure;
        done = true;
      }
      done_cv.notify_one();
    }
  };

  explicit EventLoopDispatcher(event_base* base) : base(base) {}

  bool Start() {
    std::lock_guard<std::mutex> lock(mu);
    if (stopped) {
      return false;
    }
    if (running) {
      throw std::runtime_error("Connection event loop is already running");
    }
    running = true;
    thread = std::this_thread::get_id();
    return true;
  }

  void Stop() {
    std::lock_guard<std::mutex> lock(mu);
    stopped = true;
    CancelPending();
  }

  void Finish() {
    // libevent has returned, so no callback can still use a queued raw argument.
    // Release captured handles outside the lock: their destruction may need GIL.
    decltype(pending) commands;
    {
      std::lock_guard<std::mutex> lock(mu);
      stopped = true;
      running = false;
      base = nullptr;
      CancelPending();
      // Waiting callers may retain the command after the native wrapper dies.
      // Detach every event now, while its event_base is still alive.
      for (auto& entry : pending) {
        entry.second->ReleaseEvent();
      }
      commands.swap(pending);
    }
  }

  int Dispatch(std::function<int()> execute) {
    std::shared_ptr<Command> command;
    {
      std::lock_guard<std::mutex> lock(mu);
      if (stopped || !running) {
        throw std::runtime_error("Connection event loop is stopped");
      }
      if (thread == std::this_thread::get_id()) {
        return execute();
      }

      command = std::make_shared<Command>(this, std::move(execute));
      command->scheduled = event_new(base, -1, 0, RunCommand, command.get());
      if (!command->scheduled) {
        throw std::runtime_error("Failed to create connection operation");
      }
      pending.emplace(command.get(), command);
      timeval immediately = {0, 0};
      if (event_add(command->scheduled, &immediately) != 0) {
        pending.erase(command.get());
        throw std::runtime_error("Failed to schedule connection operation");
      }
    }

    std::unique_lock<std::mutex> lock(command->mu);
    command->done_cv.wait(lock, [&command] { return command->done; });
    if (command->error) {
      std::rethrow_exception(command->error);
    }
    return command->result;
  }

 private:
  std::mutex mu;
  event_base* base;
  std::thread::id thread;
  bool running = false;
  bool stopped = false;
  std::unordered_map<Command*, std::shared_ptr<Command>> pending;

  void CancelPending() {
    if (pending.empty()) {
      return;
    }
    auto error = std::make_exception_ptr(
        std::runtime_error("Connection event loop is stopped"));
    for (auto& entry : pending) {
      entry.second->Complete(-1, error);
    }
  }

  static void RunCommand(evutil_socket_t, short, void* arg) {
    auto* raw = static_cast<Command*>(arg);
    auto* owner = raw->owner;
    std::shared_ptr<Command> command;
    {
      std::lock_guard<std::mutex> lock(owner->mu);
      command = owner->pending.at(raw);
      owner->pending.erase(raw);
      command->ReleaseEvent();
      if (!owner->stopped) {
        try {
          command->Complete(command->execute());
        } catch (...) {
          command->Complete(-1, std::current_exception());
        }
      }
      // A stopped command was already completed by Stop().
    }
  }
};

// ---------------------------------------------------------------------------
// WebStreamHandlerRef: a shared, nullable handle to WebStream.
// ---------------------------------------------------------------------------

struct WebStreamHandlerRef : std::enable_shared_from_this<WebStreamHandlerRef> {
  enum class CommandType { kSendText, kSendBinary, kSendMetadata, kClose };

  std::mutex mu;
  WebStream* ptr = nullptr;
  std::shared_ptr<EventLoopDispatcher> dispatcher;

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

  void bind(std::shared_ptr<EventLoopDispatcher> owner) {
    std::lock_guard<std::mutex> lock(mu);
    dispatcher = std::move(owner);
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
  int Dispatch(CommandType type, const std::string& message) {
    auto self = shared_from_this();
    std::shared_ptr<EventLoopDispatcher> owner;
    {
      std::lock_guard<std::mutex> lock(mu);
      if (!ptr) {
        if (type == CommandType::kClose) {
          return 0;
        }
        throw std::runtime_error("Connection is closed");
      }
      owner = dispatcher;
    }
    if (!owner) {
      throw std::runtime_error("Connection event loop is unavailable");
    }
    return owner->Dispatch([self, type, message]() {
      std::lock_guard<std::mutex> lock(self->mu);
      if (!self->ptr) {
        if (type == CommandType::kClose) {
          return 0;
        }
        throw std::runtime_error("Connection is closed");
      }
      switch (type) {
        case CommandType::kSendText:
          return self->ptr->SendText(message);
        case CommandType::kSendBinary:
          return self->ptr->SendBinary(message);
        case CommandType::kSendMetadata:
          return self->ptr->SendMetadata(message);
        case CommandType::kClose:
          return self->ptr->Close();
      }
      throw std::runtime_error("Unknown connection operation");
    });
  }
};

// Weak entries avoid retaining closed streams. Terminal callbacks remove their
// entries; shutdown invalidates all remaining handles before native teardown.
struct ServerHandlerRegistry {
  std::mutex mu;
  bool stopped = false;
  std::unordered_map<WebStreamHandlerRef*, std::weak_ptr<WebStreamHandlerRef>> refs;

  bool Add(const std::shared_ptr<WebStreamHandlerRef>& ref, WebStream* stream,
           const std::shared_ptr<EventLoopDispatcher>& dispatcher) {
    std::lock_guard<std::mutex> lock(mu);
    if (stopped) {
      return false;
    }
    std::lock_guard<std::mutex> ref_lock(ref->mu);
    ref->ptr = stream;
    ref->dispatcher = dispatcher;
    refs.emplace(ref.get(), ref);
    return true;
  }

  void Remove(WebStreamHandlerRef* ref) {
    std::lock_guard<std::mutex> lock(mu);
    refs.erase(ref);
  }

  void Invalidate() {
    std::lock_guard<std::mutex> lock(mu);
    stopped = true;
    for (auto& entry : refs) {
      if (auto ref = entry.second.lock()) {
        std::lock_guard<std::mutex> ref_lock(ref->mu);
        ref->ptr = nullptr;
      }
    }
    refs.clear();
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
  std::shared_ptr<EventLoopDispatcher> dispatcher =
      std::make_shared<EventLoopDispatcher>(base.get());

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
      dispatcher->Stop();
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
  std::shared_ptr<EventLoopDispatcher> dispatcher =
      std::make_shared<EventLoopDispatcher>(base.get());

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
      dispatcher->Stop();
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

  w->dispatcher->Stop();
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

  w->dispatcher->Stop();
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
  std::shared_ptr<EventLoopDispatcher> dispatcher =
      std::make_shared<EventLoopDispatcher>(base.get());
  std::shared_ptr<ServerHandlerRegistry> handlers =
      std::make_shared<ServerHandlerRegistry>();

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

  ~PlainServerPy() { handlers->Invalidate(); }

  void stop() {
    dispatcher->Stop();
    handlers->Invalidate();
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
  std::shared_ptr<EventLoopDispatcher> dispatcher =
      std::make_shared<EventLoopDispatcher>(base.get());
  std::shared_ptr<ServerHandlerRegistry> handlers =
      std::make_shared<ServerHandlerRegistry>();

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

  ~TlsServerPy() { handlers->Invalidate(); }

  void stop() {
    dispatcher->Stop();
    handlers->Invalidate();
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
          auto handlers = self.handlers;
          if (!handlers->Add(ref, stream, self.dispatcher)) {
            return;
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

          stream->SetOnClose([ref, handlers]() {
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
            handlers->Remove(ref.get());
            if (cb.ptr() && !cb.is_none()) {
              try {
                cb();
              } catch (nb::python_error& e) {
                e.restore();
                PyErr_WriteUnraisable(cb.ptr());
              }
            }
          });

          stream->SetOnError([ref, handlers]() {
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
            handlers->Remove(ref.get());
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
        if (!self.dispatcher->Start()) {
          return;
        }
        self.running.store(true, std::memory_order_release);
        struct RunGuard {
          PlainServerPy& s;
          ~RunGuard() noexcept {
            s.dispatcher->Finish();
            s.handlers->Invalidate();
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
          auto handlers = self.handlers;
          if (!handlers->Add(ref, stream, self.dispatcher)) {
            return;
          }

          stream->SetOnClose([ref, handlers]() {
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
            handlers->Remove(ref.get());
            if (cb.ptr() && !cb.is_none()) {
              try {
                cb();
              } catch (nb::python_error& e) {
                e.restore();
                PyErr_WriteUnraisable(cb.ptr());
              }
            }
          });

          stream->SetOnError([ref, handlers]() {
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
            handlers->Remove(ref.get());
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
        if (!self.dispatcher->Start()) {
          return;
        }
        self.running.store(true, std::memory_order_release);
        struct RunGuard {
          TlsServerPy& s;
          ~RunGuard() noexcept {
            s.dispatcher->Finish();
            s.handlers->Invalidate();
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
        ref->bind(self.dispatcher);
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

            self.dispatcher->Stop();
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

            self.dispatcher->Stop();
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
        if (!self.dispatcher->Start()) {
          return;
        }
        self.running.store(true, std::memory_order_release);
        struct RunGuard {
          TlsClientPy& s;
          ~RunGuard() noexcept {
            s.dispatcher->Finish();
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
        self.dispatcher->Stop();
        self.client.Stop();
        if (handler_ref) {
          std::lock_guard<std::mutex> lock(handler_ref->mu);
          handler_ref->ptr = nullptr;
        } })
      .def("__enter__", [](TlsClientPy& self) -> TlsClientPy& { return self; })
      .def("__exit__", [](TlsClientPy& self, nb::object, nb::object, nb::object) {
        auto handler_ref = self.handler_ref;
        nb::gil_scoped_release release;
        self.dispatcher->Stop();
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
        ref->bind(self.dispatcher);
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

            self.dispatcher->Stop();
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

            self.dispatcher->Stop();
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
        if (!self.dispatcher->Start()) {
          return;
        }
        self.running.store(true, std::memory_order_release);
        struct RunGuard {
          PlainClientPy& s;
          ~RunGuard() noexcept {
            s.dispatcher->Finish();
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
        self.dispatcher->Stop();
        self.client.Stop();
        if (handler_ref) {
          std::lock_guard<std::mutex> lock(handler_ref->mu);
          handler_ref->ptr = nullptr;
        } })
      .def("__enter__", [](PlainClientPy& self) -> PlainClientPy& { return self; })
      .def("__exit__", [](PlainClientPy& self, nb::object, nb::object, nb::object) {
        auto handler_ref = self.handler_ref;
        nb::gil_scoped_release release;
        self.dispatcher->Stop();
        self.client.Stop();
        if (handler_ref) {
          std::lock_guard<std::mutex> lock(handler_ref->mu);
          handler_ref->ptr = nullptr;
        } });
}
