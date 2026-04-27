#include <event2/thread.h>
#include <nanobind/nanobind.h>
#include <nanobind/stl/function.h>
#include <nanobind/stl/string.h>

#include <atomic>
#include <condition_variable>
#include <memory>
#include <mutex>

#include "plain_client.h"
#include "tls_client.h"
#include "wish_handler.h"

namespace nb = nanobind;

// ---------------------------------------------------------------------------
// WishHandlerRef: a shared, nullable handle to WishHandler.
//
// The raw WishHandler* lives only as long as the connection is open.
// WishHandler::EventCallback fires on_close_ BEFORE self-deleting; our
// on_close hook nullifies ptr under the mutex so any concurrent call from
// the Python thread via send_text/send_binary sees nullptr and raises
// RuntimeError rather than dereferencing freed memory.
// ---------------------------------------------------------------------------

struct WishHandlerRef {
  std::mutex mu;
  WishHandler* ptr = nullptr;

  int send_text(const std::string& msg) {
    std::lock_guard<std::mutex> lock(mu);
    if (!ptr) throw std::runtime_error("Connection is closed");
    return ptr->SendText(msg);
  }

  int send_binary(const std::string& msg) {
    std::lock_guard<std::mutex> lock(mu);
    if (!ptr) throw std::runtime_error("Connection is closed");
    return ptr->SendBinary(msg);
  }
};

// ---------------------------------------------------------------------------
// Wrapper structs
//
// Storing the Python callbacks as direct nb::object members (rather than
// inside a std::function closure) makes them visible to Python's cyclic GC
// via tp_traverse / tp_clear, breaking cycles such as:
//
//   WishConnection → TlsClient (Python) → on_open_ lambda
//     → nb::object → Python closure → WishConnection
// ---------------------------------------------------------------------------

struct TlsClientPy {
  TlsClient client;
  nb::object on_open_cb;
  nb::object on_message_cb;
  std::shared_ptr<WishHandlerRef> handler_ref;

  // Tracks whether Run() is currently executing.  Used by tls_clear to
  // wait for the event loop to exit before it clears the callbacks.
  std::atomic<bool> running{false};
  std::mutex stopped_mu;
  std::condition_variable stopped_cv;

  // Guards against running cleanup twice (once from tp_finalize, once from
  // tp_clear in the GC path).
  std::atomic<bool> finalized{false};

  TlsClientPy(const std::string& ca, const std::string& cert,
              const std::string& key, const std::string& host, int port)
      : client(ca, cert, key, host, port) {};
};

struct PlainClientPy {
  PlainClient client;
  nb::object on_open_cb;
  nb::object on_message_cb;
  std::shared_ptr<WishHandlerRef> handler_ref;

  std::atomic<bool> running{false};
  std::mutex stopped_mu;
  std::condition_variable stopped_cv;

  std::atomic<bool> finalized{false};

  PlainClientPy(const std::string& host, int port)
      : client(host, port) {}
};

// ---------------------------------------------------------------------------
// tp_traverse / tp_clear / tp_finalize for TlsClientPy
// ---------------------------------------------------------------------------

// tls_do_cleanup: stop the event loop, wait for it to exit, then release all
// C++ callbacks.  Safe to call multiple times (idempotent via finalized flag).
static void tls_do_cleanup(TlsClientPy* w) {
  if (w->finalized.exchange(true, std::memory_order_acq_rel)) return;

  // 1. Ask the event loop to stop.  event_base_loopexit is thread-safe.
  w->client.Stop();

  // 2. Release the GIL and wait for Run() to return.
  //
  //    Without this step there is a data race:
  //      - Event loop thread reads on_open_ / on_message_ and then blocks
  //        waiting to acquire the GIL (nb::gil_scoped_acquire).
  //      - GC thread (holding the GIL) writes those same std::function
  //        objects via SetOnOpen({}) etc. → UB.
  //    By releasing the GIL here we let any in-flight callback finish, after
  //    which event_base_dispatch returns and Run() signals stopped_cv.
  {
    PyThreadState* ts = PyEval_SaveThread();  // release GIL
    std::unique_lock<std::mutex> lk(w->stopped_mu);
    w->stopped_cv.wait(lk, [w] { return !w->running.load(std::memory_order_acquire); });
    PyEval_RestoreThread(ts);  // reacquire GIL
  }

  // 3. Event loop has exited; mutations are now single-threaded and safe.
  w->client.SetOnOpen({});
  w->client.SetOnClose({});
  w->client.SetOnMessage({});
  // Invalidate the safe handle so Python code can no longer call through it.
  if (w->handler_ref) {
    std::lock_guard<std::mutex> lock(w->handler_ref->mu);
    w->handler_ref->ptr = nullptr;
  }
  w->handler_ref.reset();
}

// tp_finalize is called for BOTH the normal refcount destruction path and the
// GC path (before tp_clear / tp_dealloc).  Putting the cleanup here ensures
// it runs regardless of whether a reference cycle was involved.
static void tls_finalize(PyObject* self) {
  TlsClientPy* w = nb::inst_ptr<TlsClientPy>(nb::handle(self));
  tls_do_cleanup(w);
  // Do NOT release on_open_cb / on_message_cb here: they are Python objects
  // that tp_traverse must still be able to visit until tp_clear runs.
}

static int tls_traverse(PyObject* self, visitproc visit, void* arg) {
  TlsClientPy* w = nb::inst_ptr<TlsClientPy>(nb::handle(self));
  Py_VISIT(w->on_open_cb.ptr());
  Py_VISIT(w->on_message_cb.ptr());
  return 0;
}

static int tls_clear(PyObject* self) {
  TlsClientPy* w = nb::inst_ptr<TlsClientPy>(nb::handle(self));
  // tls_do_cleanup is idempotent; if tp_finalize already ran this is a no-op.
  tls_do_cleanup(w);
  // Drop Python object references to break the cycle.
  w->on_open_cb = nb::object();
  w->on_message_cb = nb::object();
  return 0;
}

// ---------------------------------------------------------------------------
// tp_traverse / tp_clear / tp_finalize for PlainClientPy
// ---------------------------------------------------------------------------

static void plain_do_cleanup(PlainClientPy* w) {
  if (w->finalized.exchange(true, std::memory_order_acq_rel)) return;

  w->client.Stop();

  {
    PyThreadState* ts = PyEval_SaveThread();
    std::unique_lock<std::mutex> lk(w->stopped_mu);
    w->stopped_cv.wait(lk, [w] { return !w->running.load(std::memory_order_acquire); });
    PyEval_RestoreThread(ts);
  }

  w->client.SetOnOpen({});
  w->client.SetOnClose({});
  w->client.SetOnMessage({});
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

NB_MODULE(wish_ext, m) {
  // Enable libevent thread-safety
#ifdef _WIN32
  evthread_use_windows_threads();
#else
  evthread_use_pthreads();
#endif

  nb::class_<WishHandlerRef, std::shared_ptr<WishHandlerRef>>(m, "WishHandler")
      .def("send_text", &WishHandlerRef::send_text)
      .def("send_binary", &WishHandlerRef::send_binary);

  // ---- TlsClient --------------------------------------------------------
  static PyType_Slot tls_slots[] = {
      {Py_tp_traverse, (void*)tls_traverse},
      {Py_tp_clear, (void*)tls_clear},
      {Py_tp_finalize, (void*)tls_finalize},
      {0, nullptr},
  };

  nb::class_<TlsClientPy>(m, "TlsClient", nb::type_slots(tls_slots))
      .def(nb::init<const std::string&, const std::string&,
                    const std::string&, const std::string&, int>())
      .def("init", [](TlsClientPy& self) {
        return self.client.Init();
      })
      .def("set_on_open", [](TlsClientPy& self, nb::object cb) {
        self.on_open_cb = cb;
        // Create a fresh WishHandlerRef for this connection attempt.
        auto ref = std::make_shared<WishHandlerRef>();
        self.handler_ref = ref;
        // Wire the close notification: nullify ptr before WishHandler is
        // deleted so Python cannot reach freed memory.
        self.client.SetOnClose([ref]() {
          std::lock_guard<std::mutex> lock(ref->mu);
          ref->ptr = nullptr;
        });
        // Capture self by pointer; lifetime is safe because the lambda
        // lives inside self.client and is always cleared before self
        // is destroyed (either by tp_clear or ~TlsClient).
        self.client.SetOnOpen([&self, ref](WishHandler* handler) {
          {
            std::lock_guard<std::mutex> lock(ref->mu);
            ref->ptr = handler;
          }
          nb::gil_scoped_acquire acquire;
          try {
            self.on_open_cb(ref);
          } catch (nb::python_error& e) {
            e.restore();
            PyErr_WriteUnraisable(nullptr);
          }
        });
      })
      .def("set_on_message", [](TlsClientPy& self, nb::object cb) {
        self.on_message_cb = cb;
        self.client.SetOnMessage([&self](uint8_t opcode, const std::string& msg) {
          nb::gil_scoped_acquire acquire;
          try {
            self.on_message_cb(opcode, msg);
          } catch (nb::python_error& e) {
            e.restore();
            PyErr_WriteUnraisable(nullptr);
          }
        });
      })
      .def("run", [](TlsClientPy& self) {
        self.running.store(true, std::memory_order_release);
        self.client.Run();  // blocks in event_base_dispatch with GIL released
        {
          std::lock_guard<std::mutex> lk(self.stopped_mu);
          self.running.store(false, std::memory_order_release);
        }
        self.stopped_cv.notify_all(); }, nb::call_guard<nb::gil_scoped_release>())
      .def("stop", [](TlsClientPy& self) { self.client.Stop(); });

  // ---- PlainClient ------------------------------------------------------
  static PyType_Slot plain_slots[] = {
      {Py_tp_traverse, (void*)plain_traverse},
      {Py_tp_clear, (void*)plain_clear},
      {Py_tp_finalize, (void*)plain_finalize},
      {0, nullptr},
  };

  nb::class_<PlainClientPy>(m, "PlainClient", nb::type_slots(plain_slots))
      .def(nb::init<const std::string&, int>())
      .def("init", [](PlainClientPy& self) {
        return self.client.Init();
      })
      .def("set_on_open", [](PlainClientPy& self, nb::object cb) {
        self.on_open_cb = cb;
        // Create a fresh WishHandlerRef for this connection attempt.
        auto ref = std::make_shared<WishHandlerRef>();
        self.handler_ref = ref;
        self.client.SetOnClose([ref]() {
          std::lock_guard<std::mutex> lock(ref->mu);
          ref->ptr = nullptr;
        });
        self.client.SetOnOpen([&self, ref](WishHandler* handler) {
          {
            std::lock_guard<std::mutex> lock(ref->mu);
            ref->ptr = handler;
          }
          nb::gil_scoped_acquire acquire;
          try {
            self.on_open_cb(ref);
          } catch (nb::python_error& e) {
            e.restore();
            PyErr_WriteUnraisable(nullptr);
          }
        });
      })
      .def("set_on_message", [](PlainClientPy& self, nb::object cb) {
        self.on_message_cb = cb;
        self.client.SetOnMessage([&self](uint8_t opcode, const std::string& msg) {
          nb::gil_scoped_acquire acquire;
          try {
            self.on_message_cb(opcode, msg);
          } catch (nb::python_error& e) {
            e.restore();
            PyErr_WriteUnraisable(nullptr);
          }
        });
      })
      .def("run", [](PlainClientPy& self) {
        self.running.store(true, std::memory_order_release);
        self.client.Run();
        {
          std::lock_guard<std::mutex> lk(self.stopped_mu);
          self.running.store(false, std::memory_order_release);
        }
        self.stopped_cv.notify_all(); }, nb::call_guard<nb::gil_scoped_release>())
      .def("stop", [](PlainClientPy& self) { self.client.Stop(); });
}
