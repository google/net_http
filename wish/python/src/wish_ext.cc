#include <nanobind/nanobind.h>
#include <nanobind/stl/string.h>
#include <nanobind/stl/function.h>
#include <event2/thread.h>

#include "wish_handler.h"
#include "tls_client.h"

namespace nb = nanobind;

NB_MODULE(wish_ext, m) {
    // Enable libevent thread-safety
#ifdef _WIN32
    evthread_use_windows_threads();
#else
    evthread_use_pthreads();
#endif

    nb::class_<WishHandler>(m, "WishHandler")
        .def("send_text", &WishHandler::SendText)
        .def("send_binary", &WishHandler::SendBinary);

    nb::class_<TlsClient>(m, "TlsClient")
        .def(nb::init<const std::string&, const std::string&, const std::string&, const std::string&, int>())
        .def("init", &TlsClient::Init)
        .def("set_on_open", [](TlsClient& self, nb::object cb) {
            // Store the Python callable in a shared_ptr so it survives GC.
            // The callback will be invoked from the libevent thread, so we
            // must acquire the GIL before touching any Python objects.
            auto cb_ptr = std::make_shared<nb::object>(cb);
            self.SetOnOpen([cb_ptr](WishHandler* handler) {
                nb::gil_scoped_acquire acquire;
                (*cb_ptr)(nb::cast(handler, nb::rv_policy::reference));
            });
        })
        .def("set_on_message", [](TlsClient& self, nb::object cb) {
            auto cb_ptr = std::make_shared<nb::object>(cb);
            self.SetOnMessage([cb_ptr](uint8_t opcode, const std::string& msg) {
                nb::gil_scoped_acquire acquire;
                (*cb_ptr)(opcode, msg);
            });
        })
        .def("run", &TlsClient::Run, nb::call_guard<nb::gil_scoped_release>());
}
