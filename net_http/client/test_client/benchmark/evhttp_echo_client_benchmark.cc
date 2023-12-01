/* Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
==============================================================================*/

// A benchmark test client to print the response from the evhttp_echo_server
// URI: /print

#include <iostream>
#include <benchmark/benchmark.h>

#include "net_http/client/test_client/internal/evhttp_connection.h"

namespace {

    using net_http::TestClientRequest;
    using net_http::TestClientResponse;
    using net_http::TestEvHTTPConnection;

    const char* global_url;  // Global variable to store the URL

    bool SendRequest(const char* url) {
        auto connection = TestEvHTTPConnection::Connect(url);
        if (connection == nullptr) {
            std::cerr << "Fail to connect to " << url << std::endl;
            return false;
        }

        TestClientRequest request = {url, "GET", {}, ""};
        TestClientResponse response = {};

        if (!connection->BlockingSendRequest(request, &response)) {
            std::cerr << "Request failed." << std::endl;
            return false;
        }

        // Suppress output for benchmarking
        return true;
    }

}  // namespace

static void BM_SendRequest(benchmark::State& state) {
    for (auto _ : state) {
        SendRequest(global_url);  // Use the global variable
    }
}
BENCHMARK(BM_SendRequest);

int main(int argc, char** argv) {
    if (argc < 2) {
        std::cerr << "Usage: http-client <url>" << std::endl;
        return 1;
    }

    global_url = argv[1];  // Set the global URL from argv

    // Run benchmarks
    ::benchmark::Initialize(&argc, argv);
    ::benchmark::RunSpecifiedBenchmarks();
    return 0;
}
