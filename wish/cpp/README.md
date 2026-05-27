# WiSH C++ Implementation

This directory contains a C++ implementation of WiSH protocol together with a thin TLS stack enabling mTLS.

## Building

To build the C++ targets (libraries, examples, benchmarks, and tests) using Clang and Ninja:

```bash
# Configure and build using Ninja and Clang
cmake \
  -B build \
  -G Ninja \
  -DCMAKE_C_COMPILER=clang \
  -DCMAKE_CXX_COMPILER=clang++ \
  -DCMAKE_BUILD_TYPE=Debug && \
  cmake --build build -- -j$(nproc)
```

To run unit tests after a standard build:

```bash
ctest --test-dir build --output-on-failure
```

# Development Conventions

## Coding style

We basically follow [Google C++ style guide](https://google.github.io/styleguide/cppguide.html).

## Testing and Memory Leak Detection (ASan / LSan)

To verify correctness and detect memory leaks (such as orphaned session objects on failed connection handshakes), run unit tests with **AddressSanitizer (ASan)** and **LeakSanitizer (LSan)** enabled.

### 1. Building with ASan / LSan

Pass `-fsanitize=address` to compiler and linker flags during CMake configuration:

```bash
# Configure build with ASan / LSan instrumentation
cmake -B build_asan -S . \
  -G Ninja \
  -DCMAKE_C_COMPILER=clang \
  -DCMAKE_CXX_COMPILER=clang++ \
  -DCMAKE_BUILD_TYPE=Debug \
  -DCMAKE_CXX_FLAGS="-fsanitize=address -g" \
  -DCMAKE_C_FLAGS="-fsanitize=address -g" \
  -DCMAKE_EXE_LINKER_FLAGS="-fsanitize=address"

# Build test targets
cmake --build build_asan
```

### 2. Running Tests with Leak Monitoring

Run `ctest` against the ASan-instrumented build directory:

```bash
# Run all tests with leak detection enabled
ctest --test-dir build_asan --output-on-failure

# Run a specific test (e.g., h2_server_test)
ctest --test-dir build_asan -R h2_server_test --output-on-failure
```

If a memory leak or invalid memory access occurs during test execution, LeakSanitizer/AddressSanitizer will print a detailed stack trace and cause the test to fail.
