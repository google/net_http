#include <event2/event.h>
#include <event2/thread.h>
#include <nanobind/nanobind.h>
#include <nanobind/stl/function.h>
#include <nanobind/stl/shared_ptr.h>
#include <nanobind/stl/string.h>

#include <atomic>
#include <chrono>
#include <condition_variable>
#include <memory>
#include <mutex>

#include "buffer_event_web_stream.h"
#include "plain_client.h"
#include "tls_client.h"
#include "wish_opcodes.h"

namespace nb = nanobind;

// ---------------------------------------------------------------------------
// WebStreamHandlerRef: a shared, nullable handle to WebStream.
// ---------------------------------------------------------------------------

struct WebStreamHandlerRef {
  std::mutex mu;
  WebStream* ptr = nullptr;

  int send_text(const std::string& msg) {
    std::lock_guard<std::mutex> lock(mu);
    if (!ptr) {
      throw std::runtime_error("Connection is closed");
    }
    return ptr->SendText(msg);
  }

  int send_binary(const std::string& msg) {
    std::lock_guard<std::mutex> lock(mu);
    if (!ptr) {
      throw std::runtime_error("Connection is closed");
    }
    return ptr->SendBinary(msg);
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
              int port)
      : base(event_base_new()),
        client(base.get(),
               host,
               port,
               ca,
               cert,
               key) {}
};

struct PlainClientPy {
  std::unique_ptr<event_base, EventBaseDeleter> base;

  PlainClient client;
  nb::object on_open_cb;
  nb::object on_message_cb;

  std::shared_ptr<WebStreamHandlerRef> handler_ref;

  std::atomic<bool> running{false};
  std::mutex stopped_mu;
  std::condition_variable stopped_cv;

  std::atomic<bool> finalized{false};

  PlainClientPy(const std::string& host,
                int port)
      : base(event_base_new()),
        client(base.get(),
               host,
               port) {}
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
    bool stopped = w->stopped_cv.wait_for(lk,
                                          std::chrono::seconds(5),
                                          [w] { return !w->running.load(std::memory_order_acquire); });
    PyEval_RestoreThread(ts);  // reacquire GIL
    if (!stopped) {
      PySys_WriteStderr("web_stream_ext: WARNING: event loop did not stop within timeout\n");
    }
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

  return 0;
}

static int tls_clear(PyObject* self) {
  TlsClientPy* w = nb::inst_ptr<TlsClientPy>(nb::handle(self));
  tls_do_cleanup(w);
  w->on_open_cb = nb::object();
  w->on_message_cb = nb::object();
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
    bool stopped = w->stopped_cv.wait_for(lk,
                                          std::chrono::seconds(5),
                                          [w] { return !w->running.load(std::memory_order_acquire); });
    PyEval_RestoreThread(ts);
    if (!stopped) {
      PySys_WriteStderr("web_stream_ext: WARNING: event loop did not stop within timeout\n");
    }
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

  return 0;
}

static int plain_clear(PyObject* self) {
  PlainClientPy* w = nb::inst_ptr<PlainClientPy>(nb::handle(self));
  plain_do_cleanup(w);
  w->on_open_cb = nb::object();
  w->on_message_cb = nb::object();
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
      .def("send_text", &WebStreamHandlerRef::send_text)
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

        std::lock_guard<std::mutex> lock(self.mu);
        if (!self.ptr) {
          throw std::runtime_error("Connection is closed");
        }
        return self.ptr->SendBinary(s);
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
                    int>())
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
        self.handler_ref = ref;

        self.client.SetOnOpen([&self, ref](WebStream* handler) {
          {
            std::lock_guard<std::mutex> lock(ref->mu);
            ref->ptr = handler;
          }

          handler->SetOnClose([ref]() {
            std::lock_guard<std::mutex> lock(ref->mu);
            ref->ptr = nullptr;
          });
          handler->SetOnError([ref]() {
            std::lock_guard<std::mutex> lock(ref->mu);
            ref->ptr = nullptr;
          });
          handler->SetOnMessage([&self](uint8_t opcode, const std::string& msg) {
            nb::gil_scoped_acquire acquire;
            try {
              if (opcode == WEB_STREAM_OPCODE_BINARY || opcode == WEB_STREAM_OPCODE_METADATA) {
                self.on_message_cb(opcode, nb::bytes(msg.data(), msg.size()));
              } else {
                self.on_message_cb(opcode, msg);
              }
            } catch (nb::python_error& e) {
              e.restore();
              PyErr_WriteUnraisable(self.on_message_cb.ptr());
            }
          });

          nb::gil_scoped_acquire acquire;
          try {
            self.on_open_cb(ref);
          } catch (nb::python_error& e) {
            e.restore();
            PyErr_WriteUnraisable(self.on_open_cb.ptr());
          }
        });
      })
      .def("set_on_message", [](TlsClientPy& self, nb::object cb) {
        self.on_message_cb = cb;
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
        self.client.Stop();
        if (self.handler_ref) {
          std::lock_guard<std::mutex> lock(self.handler_ref->mu);
          self.handler_ref->ptr = nullptr;
        } })
      .def("__enter__", [](TlsClientPy& self) -> TlsClientPy& { return self; })
      .def("__exit__", [](TlsClientPy& self, nb::object, nb::object, nb::object) {
        self.client.Stop();
        if (self.handler_ref) {
          std::lock_guard<std::mutex> lock(self.handler_ref->mu);
          self.handler_ref->ptr = nullptr;
        } });

  // ---- PlainClient ------------------------------------------------------
  static PyType_Slot plain_slots[] = {
      {Py_tp_traverse, (void*)plain_traverse},
      {Py_tp_clear, (void*)plain_clear},
      {Py_tp_finalize, (void*)plain_finalize},
      {0, nullptr},
  };

  nb::class_<PlainClientPy>(m, "PlainClient", nb::type_slots(plain_slots))
      .def(nb::init<const std::string&, int>())
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
        self.handler_ref = ref;

        self.client.SetOnOpen([&self, ref](WebStream* handler) {
          {
            std::lock_guard<std::mutex> lock(ref->mu);
            ref->ptr = handler;
          }

          handler->SetOnClose([ref]() {
            std::lock_guard<std::mutex> lock(ref->mu);
            ref->ptr = nullptr;
          });
          handler->SetOnError([ref]() {
            std::lock_guard<std::mutex> lock(ref->mu);
            ref->ptr = nullptr;
          });
          handler->SetOnMessage([&self](uint8_t opcode, const std::string& msg) {
            nb::gil_scoped_acquire acquire;
            try {
              if (opcode == WEB_STREAM_OPCODE_BINARY || opcode == WEB_STREAM_OPCODE_METADATA) {
                self.on_message_cb(opcode, nb::bytes(msg.data(), msg.size()));
              } else {
                self.on_message_cb(opcode, msg);
              }
            } catch (nb::python_error& e) {
              e.restore();
              PyErr_WriteUnraisable(self.on_message_cb.ptr());
            }
          });

          nb::gil_scoped_acquire acquire;
          try {
            self.on_open_cb(ref);
          } catch (nb::python_error& e) {
            e.restore();
            PyErr_WriteUnraisable(self.on_open_cb.ptr());
          }
        });
      })
      .def("set_on_message", [](PlainClientPy& self, nb::object cb) {
        self.on_message_cb = cb;
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
        self.client.Stop();
        if (self.handler_ref) {
          std::lock_guard<std::mutex> lock(self.handler_ref->mu);
          self.handler_ref->ptr = nullptr;
        } })
      .def("__enter__", [](PlainClientPy& self) -> PlainClientPy& { return self; })
      .def("__exit__", [](PlainClientPy& self, nb::object, nb::object, nb::object) {
        self.client.Stop();
        if (self.handler_ref) {
          std::lock_guard<std::mutex> lock(self.handler_ref->mu);
          self.handler_ref->ptr = nullptr;
        } });
}
