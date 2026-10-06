# Transport evidence and limitations

| Trial | Setting | Fresh transport source | Protocol | Reused connection | TCP connect (ms) | TLS handshake (ms) |
|---:|---|---|---|---|---:|---:|
| 1 | off | handshake | h2 | False | 26.000 | 14.000 |
| 2 | off | handshake | h2 | False | 27.000 | 16.000 |
| 3 | on | handshake | h2 | False | 23.000 | 15.000 |
| 4 | on | handshake | h2 | False | 24.000 | 16.000 |

For an ON handshake GET that reused the early POST connection, the early POST must itself show fresh h2 TCP/TLS and share the handshake’s remote address and local port. Fresh transport does not imply cold DNS, radio, TLS-resumption state, or backend application state.

The same Xcode repetition option independently produced 1000 distinct application PIDs in the no-network investigation. These Lens attachments directly establish fresh transport for these four trials. This does not validate an OFF/ON alternating batch runner that has not yet been implemented.
