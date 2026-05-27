add_executable(echo_server
    echo_server.cc
)
target_link_libraries(echo_server
    buffer_event_web_stream
    absl::flags
    absl::flags_parse
    absl::log
    absl::log_initialize
    # Based on https://github.com/abseil/abseil-cpp/discussions/1474
    "$<LINK_LIBRARY:WHOLE_ARCHIVE,absl::log_flags>"
)

add_executable(tls_echo_server
    tls_echo_server.cc
)
target_link_libraries(tls_echo_server
    buffer_event_web_stream
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
    buffer_event_web_stream
)

# ---- HTTP/2 (h2c) examples ----

add_executable(h2_echo_server
    h2_echo_server.cc
)
target_link_libraries(h2_echo_server
    buffer_event_web_stream
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
    buffer_event_web_stream
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
    buffer_event_web_stream
)

add_executable(h2_tls_hello_client
    h2_tls_hello_client.cc
)
target_link_libraries(h2_tls_hello_client
    buffer_event_web_stream
)
