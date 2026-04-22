#include <event2/thread.h>
#include <nanobind/nanobind.h>
#include <nanobind/stl/function.h>
#include <nanobind/stl/string.h>

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

  TlsClientPy(const std::string& ca, const std::string& cert,
              const std::string& key, const std::string& host, int port)
      : client(ca, cert, key, host, port) {};
};

struct PlainClientPy {
  PlainClient client;
  nb::object on_open_cb;
  nb::object on_message_cb;
  std::shared_ptr<WishHandlerRef> handler_ref;

  PlainClientPy(const std::string& host, int port)
      : client(host, port) {}
};

// ---------------------------------------------------------------------------
// tp_traverse / tp_clear for TlsClientPy
// ---------------------------------------------------------------------------

static int tls_traverse(PyObject* self, visitproc visit, void* arg) {
  TlsClientPy* w = nb::inst_ptr<TlsClientPy>(nb::handle(self));
  Py_VISIT(w->on_open_cb.ptr());
  Py_VISIT(w->on_message_cb.ptr());
  return 0;
}

static int tls_clear(PyObject* self) {
  TlsClientPy* w = nb::inst_ptr<TlsClientPy>(nb::handle(self));
  // Clear the C++ callbacks first so the lambda (which captures &*w) is
  // dropped before we invalidate on_open_cb / on_message_cb.
  w->client.SetOnOpen({});
  w->client.SetOnClose({});
  w->client.SetOnMessage({});
  // Invalidate the safe handle so Python code can no longer call through it.
  if (w->handler_ref) {
    std::lock_guard<std::mutex> lock(w->handler_ref->mu);
    w->handler_ref->ptr = nullptr;
  }
  w->handler_ref.reset();
  w->on_open_cb = nb::object();
  w->on_message_cb = nb::object();
  return 0;
}

// ---------------------------------------------------------------------------
// tp_traverse / tp_clear for PlainClientPy
// ---------------------------------------------------------------------------

static int plain_traverse(PyObject* self, visitproc visit, void* arg) {
  PlainClientPy* w = nb::inst_ptr<PlainClientPy>(nb::handle(self));
  Py_VISIT(w->on_open_cb.ptr());
  Py_VISIT(w->on_message_cb.ptr());
  return 0;
}

static int plain_clear(PyObject* self) {
  PlainClientPy* w = nb::inst_ptr<PlainClientPy>(nb::handle(self));
  w->client.SetOnOpen({});
  w->client.SetOnClose({});
  w->client.SetOnMessage({});
  // Invalidate the safe handle so Python code can no longer call through it.
  if (w->handler_ref) {
    std::lock_guard<std::mutex> lock(w->handler_ref->mu);
    w->handler_ref->ptr = nullptr;
  }
  w->handler_ref.reset();
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
      .def("run", [](TlsClientPy& self) { self.client.Run(); }, nb::call_guard<nb::gil_scoped_release>())
      .def("stop", [](TlsClientPy& self) { self.client.Stop(); });

  // ---- PlainClient ------------------------------------------------------
  static PyType_Slot plain_slots[] = {
      {Py_tp_traverse, (void*)plain_traverse},
      {Py_tp_clear, (void*)plain_clear},
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
      .def("run", [](PlainClientPy& self) { self.client.Run(); }, nb::call_guard<nb::gil_scoped_release>())
      .def("stop", [](PlainClientPy& self) { self.client.Stop(); });
}
