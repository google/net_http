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

add_executable(plain_echo_server
    plain_echo_server.cc
)
target_link_libraries(plain_echo_server
    web_stream
    absl::flags
    absl::flags_parse
    absl::log
    absl::log_initialize
    # Based on https://github.com/abseil/abseil-cpp/discussions/1474
    "$<LINK_LIBRARY:WHOLE_ARCHIVE,absl::log_flags>"
)

add_executable(plain_hello_client
    plain_hello_client.cc
)
target_link_libraries(plain_hello_client
    web_stream
    absl::flags
    absl::flags_parse
    absl::log
    absl::log_initialize
    "$<LINK_LIBRARY:WHOLE_ARCHIVE,absl::log_flags>"
)

add_executable(tls_echo_server
    tls_echo_server.cc
)
target_link_libraries(tls_echo_server
    web_stream
    absl::flags
    absl::flags_parse
    absl::log
    absl::log_initialize
    "$<LINK_LIBRARY:WHOLE_ARCHIVE,absl::log_flags>"
)

add_executable(tls_hello_client
    tls_hello_client.cc
)
target_link_libraries(tls_hello_client
    web_stream
    absl::flags
    absl::flags_parse
    absl::log
    absl::log_initialize
    "$<LINK_LIBRARY:WHOLE_ARCHIVE,absl::log_flags>"
)

# ---- HTTP/2 (h2c) examples ----

add_executable(h2_echo_server
    h2_echo_server.cc
)
target_link_libraries(h2_echo_server
    web_stream
    absl::flags
    absl::flags_parse
    absl::log
    absl::log_initialize
    "$<LINK_LIBRARY:WHOLE_ARCHIVE,absl::log_flags>"
)

add_executable(h2_hello_client
    h2_hello_client.cc
)
target_link_libraries(h2_hello_client
    web_stream
    absl::flags
    absl::flags_parse
    absl::log
    absl::log_initialize
    "$<LINK_LIBRARY:WHOLE_ARCHIVE,absl::log_flags>"
)

add_executable(h2_tls_echo_server
    h2_tls_echo_server.cc
)
target_link_libraries(h2_tls_echo_server
    web_stream
    absl::flags
    absl::flags_parse
    absl::log
    absl::log_initialize
    "$<LINK_LIBRARY:WHOLE_ARCHIVE,absl::log_flags>"
)

add_executable(h2_tls_hello_client
    h2_tls_hello_client.cc
)
target_link_libraries(h2_tls_hello_client
    web_stream
    absl::flags
    absl::flags_parse
    absl::log
    absl::log_initialize
    "$<LINK_LIBRARY:WHOLE_ARCHIVE,absl::log_flags>"
)
