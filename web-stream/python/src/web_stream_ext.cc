#include <event2/thread.h>
#include <nanobind/nanobind.h>

namespace nb = nanobind;

void BindRuntime(nb::module_& m);

NB_MODULE(web_stream_ext, m) {
#ifdef _WIN32
  evthread_use_windows_threads();
#else
  evthread_use_pthreads();
#endif

  BindRuntime(m);
}
