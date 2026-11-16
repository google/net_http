# H3-started OS suspension observations

Completed trials only. OS-state samples, same PID and one SID are verified.
Known h2 fallback and unknown transaction protocols remain explicit.

| Trial | OS suspended (s) | Last GET age at foreground (s) | Observation | SDK errors | HTTP 400 | Protocol coverage |
| --- | ---: | ---: | --- | --- | --- | --- |
| T15-150s-r1 | 150.129 | 187.253 | channel-failed | [4] | True | h3-observed-no-known-fallback |
| T15-150s-r2 | 150.177 | 187.514 | channel-failed | [4] | True | h3-observed-no-known-fallback |
| T15-150s-r3 | 150.390 | 187.705 | channel-failed | [4] | True | h3-observed-no-known-fallback |
| T15-30s-r1 | 30.655 | 64.888 | echo-resumed | [] | False | h3-observed-no-known-fallback |
| T15-30s-r2 | 30.588 | 67.770 | echo-resumed | [] | False | h3-observed-no-known-fallback |
| T15-30s-r3 | 30.655 | 67.792 | echo-resumed | [] | False | h3-observed-no-known-fallback |
| T15-90s-r1 | 90.872 | 128.264 | channel-failed | [4] | True | h3-observed-no-known-fallback |
| T15-90s-r2 | 90.834 | 127.994 | channel-failed | [4] | True | h3-observed-no-known-fallback |
| T15-90s-r3 | 90.737 | 128.028 | channel-failed | [4] | True | h3-observed-no-known-fallback |

GET ages and asynchronous OS state bracket observations; they do not establish an exact server expiry threshold.
