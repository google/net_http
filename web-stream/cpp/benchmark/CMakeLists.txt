# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

add_executable(plain_benchmark_client
    plain_client.cc
)
target_link_libraries(plain_benchmark_client
    web_stream
    absl::flags
    absl::flags_parse
    absl::log
    absl::log_initialize
    # Based on https://github.com/abseil/abseil-cpp/discussions/1474
    "$<LINK_LIBRARY:WHOLE_ARCHIVE,absl::log_flags>"
    benchmark::benchmark
)

add_executable(high_qps_benchmark_client
    high_qps_client.cc
)
target_link_libraries(high_qps_benchmark_client
    web_stream
    absl::flags
    absl::flags_parse
    absl::log
    absl::log_initialize
    "$<LINK_LIBRARY:WHOLE_ARCHIVE,absl::log_flags>"
    benchmark::benchmark
)

add_executable(tls_benchmark_client
    tls_client.cc
)
target_link_libraries(tls_benchmark_client
    web_stream
    absl::flags
    absl::flags_parse
    absl::log
    absl::log_initialize
    "$<LINK_LIBRARY:WHOLE_ARCHIVE,absl::log_flags>"
    benchmark::benchmark
)