// Copyright 2026 Google LLC
// Licensed under the Apache License, Version 2.0.

#include <event2/event.h>
#include <event2/thread.h>
#include <nanobind/nanobind.h>
#include <nanobind/stl/string.h>

#include <algorithm>
#include <cstdint>
#include <deque>
#include <functional>
#include <memory>
#include <mutex>
#include <stdexcept>
#include <unordered_map>

#include "buffer_event_web_stream.h"
#include "plain_client.h"
#include "plain_server.h"
#include "tls_client.h"
#include "tls_server.h"

namespace nb = nanobind;
namespace {

struct Limits {
  size_t message;
  size_t receive;
  size_t write;
  void Validate() const {
    if (!message || !receive || write < 1024 || message > write / 2) {
      throw std::invalid_argument(
          "positive limits and max_message_size <= "
          "write_buffer_limit / 2 required");
    }
  }
};

// No Python objects occur in commands or stream state. All networking state is
// confined to Run(); only Post(), Stop(), and the command queue use a mutex.
class NativeRuntime {
 public:
  explicit NativeRuntime(nb::object callback) : callback_(std::move(callback)) {
    base_ = event_base_new();
    if (!base_) throw std::runtime_error("Failed to create event_base");
    wake_ = event_new(base_, -1, EV_PERSIST, Wake, this);
    if (!wake_ || evthread_make_base_notifiable(base_) != 0) {
      if (wake_) event_free(wake_);
      event_base_free(base_);
      throw std::runtime_error("Failed to initialize runtime events");
    }
  }

  ~NativeRuntime() {
    // The Python call to run() retains this instance until the loop returns.
    states_.clear();
    listeners_.clear();
    event_free(wake_);
    event_base_free(base_);
  }

  void Run() {
    {
      std::lock_guard<std::mutex> lock(mu_);
      if (started_) throw std::runtime_error("Runtime can only run once");
      started_ = true;
    }
    event_active(wake_, 0, 0);
    Emit("started", 0, 0, "");
    event_base_loop(base_, EVLOOP_NO_EXIT_ON_EMPTY);
    Shutdown();
    {
      std::lock_guard<std::mutex> lock(mu_);
      accepting_ = false;
      commands_.clear();
    }
    Emit("stopped", 0, 0, "Runtime stopped");
    nb::gil_scoped_acquire acquire;
    callback_ = nb::object();
  }

  void Stop() {
    std::lock_guard<std::mutex> lock(mu_);
    if (!accepting_) return;
    accepting_ = false;
    commands_.emplace_back([this] { event_base_loopbreak(base_); });
    event_active(wake_, 0, 0);
  }

  void Connect(int64_t id, int64_t op, const std::string &host, int port,
               bool tls, const std::string &ca, const std::string &cert,
               const std::string &key, const std::string &path, Limits limits) {
    limits.Validate();
    Post(op, [=] {
      auto state = std::make_unique<State>();
      state->limits = limits;
      state->opening = op;
      auto *raw = state.get();
      states_.emplace(id, std::move(state));
      auto opened = [this, id](WebStream *stream) { Attach(id, stream); };
      auto failed = [this, id] {
        Terminal(id, "connect",
                 "Connection failed during DNS, TCP, TLS, or HTTP handshake");
      };
      bool ok;
      if (tls) {
        raw->tls =
            std::make_unique<TlsClient>(base_, host, port, ca, cert, key, path);
        raw->tls->SetOnOpen(opened);
        raw->tls->SetOnError(failed);
        ok = raw->tls->Init();
      } else {
        raw->plain = std::make_unique<PlainClient>(base_, host, port, path);
        raw->plain->SetOnOpen(opened);
        raw->plain->SetOnError(failed);
        ok = raw->plain->Init();
      }
      if (!ok) Terminal(id, "connect", "Client initialization failed");
    });
  }

  void Listen(int64_t id, int64_t op, int port, bool tls, const std::string &ca,
              const std::string &cert, const std::string &key, Limits limits,
              size_t max_connections) {
    limits.Validate();
    Post(op, [=] {
      auto listener = std::make_unique<Listener>();
      listener->limits = limits;
      auto accepted = [this, id, limits](WebStream *stream) {
        int64_t stream_id = next_accepted_--;
        auto state = std::make_unique<State>();
        state->listener = id;
        state->limits = limits;
        states_.emplace(stream_id, std::move(state));
        Attach(stream_id, stream);
      };
      auto failed = [this, id](int error) {
        auto it = listeners_.find(id);
        if (it != listeners_.end()) {
          if (it->second->plain) it->second->plain->StopAccepting();
          if (it->second->tls) it->second->tls->StopAccepting();
        }
        Emit("listener_error", id, error, evutil_socket_error_to_string(error));
      };
      bool ok;
      if (tls) {
        listener->tls = std::make_unique<TlsServer>(base_, port, ca, cert, key);
        listener->tls->SetMaxConnections(max_connections);
        listener->tls->SetOnStream(accepted);
        listener->tls->SetOnError(failed);
        ok = listener->tls->Init();
      } else {
        listener->plain = std::make_unique<PlainServer>(base_, port);
        listener->plain->SetMaxConnections(max_connections);
        listener->plain->SetOnStream(accepted);
        listener->plain->SetOnError(failed);
        ok = listener->plain->Init();
      }
      if (!ok) {
        Emit("result", op, 1, "listen: Server initialization failed");
        return;
      }
      listeners_.emplace(id, std::move(listener));
      Emit("result", op, 0, "");
    });
  }

  void StopAccepting(int64_t id, int64_t op) {
    Post(op, [=] {
      auto it = listeners_.find(id);
      if (it != listeners_.end()) {
        if (it->second->plain) it->second->plain->StopAccepting();
        if (it->second->tls) it->second->tls->StopAccepting();
      }
      Emit("result", op, 0, "");
    });
  }

  void RemoveListener(int64_t id, int64_t op) {
    Post(op, [=] {
      for (auto &entry : states_) {
        if (entry.second->listener == id) {
          Terminal(entry.first, "closed", "Server stopped");
        }
      }
      listeners_.erase(id);
      for (auto it = states_.begin(); it != states_.end();) {
        if (it->second->listener == id)
          it = states_.erase(it);
        else
          ++it;
      }
      Emit("result", op, 0, "");
    });
  }

  void Operation(int64_t id, int64_t op, int opcode, std::string data) {
    Post(op, [=, data = std::move(data)]() mutable {
      auto it = states_.find(id);
      if (it == states_.end() || !it->second->stream) {
        Emit("result", op, 1, "closed: Connection is closed");
        return;
      }
      auto &state = *it->second;
      if (opcode > 0 && (data.size() > state.limits.message ||
                         data.size() > state.limits.write / 2)) {
        Emit("result", op, 1, "limit: Message exceeds configured limit");
        return;
      }
      state.operations.push_back({op, opcode, std::move(data), false});
      Progress(state);
    });
  }

  void Consume(int64_t id, size_t bytes) {
    Post(0, [=] {
      auto it = states_.find(id);
      if (it == states_.end()) return;
      auto &state = *it->second;
      state.received -= std::min(bytes, state.received);
      if (state.stream && state.paused &&
          state.received < state.limits.receive / 2 + 1) {
        state.paused = false;
        state.stream->SetReadEnabled(true);
      }
    });
  }

  void Release(int64_t id, int64_t op) {
    Post(op, [=] {
      auto it = states_.find(id);
      if (it != states_.end()) {
        auto *stream = it->second->stream;
        Terminal(id, "closed", "Connection closed locally");
        if (stream) {
          stream->SetOnDestroy({});
          stream->SetOnMessage({});
          stream->SetOnClose({});
          stream->SetOnError({});
          stream->Abort();
        }
        states_.erase(it);
      }
      Emit("result", op, 0, "");
    });
  }

  nb::object callback_;

 private:
  struct OperationState {
    int64_t id;
    int opcode;  // 1..3 send; 0 drain; -1 write EOF
    std::string data;
    bool submitted;
  };
  struct State {
    Limits limits{};
    BufferEventWebStream *stream = nullptr;
    std::unique_ptr<PlainClient> plain;
    std::unique_ptr<TlsClient> tls;
    int64_t listener = 0;
    int64_t opening = 0;
    size_t received = 0;
    bool paused = false;
    bool eof = false;
    std::deque<OperationState> operations;
  };
  struct Listener {
    Limits limits{};
    std::unique_ptr<PlainServer> plain;
    std::unique_ptr<TlsServer> tls;
  };

  event_base *base_ = nullptr;
  event *wake_ = nullptr;
  std::mutex mu_;
  bool accepting_ = true;
  bool started_ = false;
  std::deque<std::function<void()>> commands_;
  std::unordered_map<int64_t, std::unique_ptr<State>> states_;
  std::unordered_map<int64_t, std::unique_ptr<Listener>> listeners_;
  int64_t next_accepted_ = -1;

  void Post(int64_t op, std::function<void()> command) {
    std::lock_guard<std::mutex> lock(mu_);
    if (!accepting_) throw std::runtime_error("Runtime is stopped");
    commands_.emplace_back([this, op, command = std::move(command)] {
      try {
        command();
      } catch (const std::exception &e) {
        Emit("result", op, 1, std::string("runtime: ") + e.what());
      }
    });
    event_active(wake_, 0, 0);
  }

  static void Wake(evutil_socket_t, short, void *context) noexcept {
    auto &self = *static_cast<NativeRuntime *>(context);
    std::deque<std::function<void()>> commands;
    {
      std::lock_guard<std::mutex> lock(self.mu_);
      commands.swap(self.commands_);
    }
    for (auto &command : commands) command();
  }

  void Emit(const char *kind, int64_t id, int64_t number,
            const std::string &payload, bool binary = false) noexcept {
    nb::gil_scoped_acquire acquire;
    if (!callback_.is_valid() || callback_.is_none()) return;
    try {
      if (binary)
        callback_(kind, id, number, nb::bytes(payload.data(), payload.size()));
      else
        callback_(kind, id, number, payload);
    } catch (nb::python_error &e) {
      e.restore();
      PyErr_WriteUnraisable(callback_.ptr());
    }
  }

  void Attach(int64_t id, WebStream *stream) {
    auto &state = *states_.at(id);
    state.stream = static_cast<BufferEventWebStream *>(stream);
    state.stream->SetMaxMessageSize(state.limits.message);
    state.stream->SetOnWritable([this, id] {
      auto it = states_.find(id);
      if (it != states_.end()) Progress(*it->second);
    });
    state.stream->SetOnDestroy([this, id] {
      auto it = states_.find(id);
      if (it == states_.end()) return;
      auto &state = *it->second;
      bool flushed =
          state.eof && state.stream && state.stream->PendingWriteBytes() == 0;
      state.stream = nullptr;
      // A clean bidirectional EOF can destroy the core before the next write
      // observes zero output bytes. Already submitted operations did flush.
      for (auto &op : state.operations) {
        Emit("result", op.id, op.submitted && flushed ? 0 : 1,
             op.submitted && flushed
                 ? ""
                 : "transport: Transport destroyed before flush");
      }
      state.operations.clear();
      Emit("destroyed", id, 0, "");
    });
    stream->SetOnMessage([this, id](uint8_t opcode, const std::string &data) {
      auto &state = *states_.at(id);
      state.received +=
          data.size() + 64;  // Empty messages also consume credit.
      if (state.received >= state.limits.receive) {
        state.paused = true;
        state.stream->SetReadEnabled(false);
      }
      Emit("message", id, opcode, data, true);
    });
    stream->SetOnClose([this, id] {
      Emit("terminal", id, 0, "closed: Inbound EOF received");
    });
    stream->SetOnError([this, id] {
      Terminal(id, "transport",
               "Transport or framing failure (including message size limit)");
    });
    Emit("open", id, state.listener, stream->path());
    if (state.opening) {
      Emit("result", state.opening, 0, "");
      state.opening = 0;
    }
  }

  void Terminal(int64_t id, const std::string &code,
                const std::string &detail) {
    auto it = states_.find(id);
    if (it == states_.end()) return;
    auto &state = *it->second;
    if (!state.stream && !state.opening) return;
    state.stream = nullptr;
    if (state.opening) {
      Emit("result", state.opening, 1, code + ": " + detail);
      state.opening = 0;
    }
    for (auto &op : state.operations)
      Emit("result", op.id, 1, code + ": " + detail);
    state.operations.clear();
    Emit("terminal", id, code == "closed" ? 0 : 1, code + ": " + detail);
  }

  void Progress(State &state) {
    while (state.stream && !state.operations.empty()) {
      auto &op = state.operations.front();
      if (!op.submitted) {
        if (op.opcode > 0 && state.eof) {
          Emit("result", op.id, 1, "closed: Outbound EOF already sent");
          state.operations.pop_front();
          continue;
        }
        // A single message uses at most half the write budget; the remaining
        // half reserves framing overhead and the previous batch's low
        // watermark.
        if (op.opcode > 0 &&
            state.stream->PendingWriteBytes() > state.limits.write / 4) {
          state.stream->SetWriteLowWatermark(state.limits.write / 4);
          return;
        }
        int result = 0;
        switch (op.opcode) {
          case 1:
            result = state.stream->SendText(op.data);
            break;
          case 2:
            result = state.stream->SendBinary(op.data);
            break;
          case 3:
            result = state.stream->SendMetadata(op.data);
            break;
          case -1:
            if (!state.eof) result = state.stream->Close();
            state.eof = true;
            break;
          case 0:
            break;
          default:
            result = -1;
        }
        if (result != 0) {
          Emit("result", op.id, 1,
               "send: Native stream rejected the operation");
          state.operations.pop_front();
          continue;
        }
        op.submitted = true;
        op.data.clear();
      }
      size_t watermark = op.opcode > 0 ? state.limits.write / 4 : 0;
      if (state.stream->PendingWriteBytes() > watermark) {
        state.stream->SetWriteLowWatermark(watermark);
        return;
      }
      Emit("result", op.id, 0, "");
      state.operations.pop_front();
    }
  }

  void Shutdown() {
    for (auto &entry : states_) {
      if (entry.second->stream) entry.second->stream->SetOnDestroy({});
      Terminal(entry.first, "runtime", "Runtime stopped");
    }
    states_.clear();
    listeners_.clear();
  }
};

int Traverse(PyObject *self, visitproc visit, void *arg) {
  Py_VISIT(Py_TYPE(self));
  if (nb::inst_ready(self)) {
    Py_VISIT(nb::inst_ptr<NativeRuntime>(self)->callback_.ptr());
  }
  return 0;
}

int Clear(PyObject *self) {
  if (nb::inst_ready(self)) {
    auto *runtime = nb::inst_ptr<NativeRuntime>(self);
    runtime->Stop();
    runtime->callback_ = nb::object();
  }
  return 0;
}
}  // namespace

void BindRuntime(nb::module_ &m) {
  static PyType_Slot slots[] = {
      {Py_tp_traverse, reinterpret_cast<void *>(Traverse)},
      {Py_tp_clear, reinterpret_cast<void *>(Clear)},
      {0, nullptr}};
  nb::class_<Limits>(m, "_Limits").def(nb::init<size_t, size_t, size_t>());
  nb::class_<NativeRuntime>(m, "_Runtime", nb::type_slots(slots))
      .def(nb::init<nb::object>())
      .def("run", &NativeRuntime::Run, nb::call_guard<nb::gil_scoped_release>())
      .def("stop", &NativeRuntime::Stop)
      .def("connect", &NativeRuntime::Connect)
      .def("listen", &NativeRuntime::Listen)
      .def("stop_accepting", &NativeRuntime::StopAccepting)
      .def("remove_listener", &NativeRuntime::RemoveListener)
      .def("operation",
           [](NativeRuntime &self, int64_t id, int64_t op, int opcode,
              nb::bytes data) {
             self.Operation(id, op, opcode,
                            std::string(data.c_str(), data.size()));
           })
      .def("consume", &NativeRuntime::Consume)
      .def("release", &NativeRuntime::Release);
}
