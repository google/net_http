# Browser validation

## Chrome / Windows smoke test

User-reported result, recorded on 2026-11-26 (JST).

| Item | Reported environment |
| --- | --- |
| Browser | Google Chrome 158.0.8127.37, official 64-bit build, Stable cohort |
| Chromium revision | `b8c2be851f62f6a394ec57955d7f31335d7cb6d4-refs/branch-heads/8127@{#1692}` |
| OS | Windows 11 Version 26H2, build 26300.9974 |
| JavaScript engine | V8 15.8.62.31 |
| Demo serving mode | `npm start` (Vite development server) |

Observed sequence:

1. Open the demo served by `npm start`.
2. Click **Connect**.
3. Click **Send Message**.
4. Receive five replies in the demo.

Result: **passed**, as reported by the user. This is a real-browser smoke test
of the demo connection/send/receive path, separate from the agent-run Node/VM
tests. The report does not record the selected endpoint, transport options or
negotiated HTTP version. It does not establish coverage of the minimum browser
versions, other transport modes, unload behavior or the built static site.


## Agent-run Playwright smoke tests

Recorded on 2026-11-26 (JST), against the public
`https://webchannel.sandbox.google.com/staging/channel/generator` and `/echo`
endpoints. This is separate from the user-reported Windows check above.

| Item | Automated environment |
| --- | --- |
| Browser | Chrome Headless Shell 158.0.8127.18, Playwright revision 1254 |
| Controller | Playwright 1.65.0 |
| OS | Debian GNU/Linux 13 (trixie) |
| Serving modes | Vite development server and freshly built Vite preview |

Playwright and playwright-core were installed in an isolated temporary
directory after verifying a publication age of at least 14 days, registry
integrity, zero known npm vulnerabilities, registry signatures and provenance.
The browser revision was fixed by that Playwright release. Missing OS libraries
were downloaded from Debian and extracted under `/tmp`, without installing
system packages or executing their maintainer scripts. No project dependency
was added and no existing user browser profile was used.

The checks operated the actual page controls, counted DOM log messages, observed
XHR requests and rejected both uncaught page errors and console errors:

| Scenario | Observed result |
| --- | --- |
| Generator, default streaming | Five replies, no duplicates; observed XHR backchannel with `CI=0` |
| Generator, `forceLongPolling=true` | Five replies, no duplicates; observed backchannel with `CI=1` |
| Generator, `sendRawJson=false` | Five replies; verified the form-encoded message field |
| Disconnect after two replies, then reconnect | No further replies after close; fresh connection received five replies without old messages |
| Echo, three successive ASCII messages | Each message returned exactly once |
| Built static demo served by Vite preview | Connect/send/five replies succeeded |

All six scenarios passed with no page or console errors after the header fix
below. The six scenarios can now be rerun with the optional
[`browser-smoke.mjs`](browser-smoke.mjs); see the [setup instructions](README.md#optional-browser-smoke-test).
Scheduled browser CI has not been added. Coverage of Firefox/Safari,
minimum-version engines, browser Fetch/fast-handshake variants, unload behavior
and negotiated HTTP/2/3 remains separate work.

### Issue found and corrected

The first run completed the send/receive flows but failed console checks:
Chromium reported `Refused to get unsafe header` for unexposed
`X-Client-Wire-Protocol`, `X-HTTP-Session-Id` and `X-HTTP-Initial-Response`.
The client enumerated response headers, then unnecessarily probed those names
individually on every XHR response.

Native XHR now uses only the enumerated, CORS-visible headers. Individual
lookups remain a fallback only for injected implementations that lack
`getAllResponseHeaders`. Two regression tests failed before the fix and passed
afterwards; the complete Node suite passed 75 tests and strict type checking
passed.
