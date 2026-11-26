# Manual browser validation

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
