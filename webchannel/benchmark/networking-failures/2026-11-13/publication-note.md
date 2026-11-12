# Publication and measurement provenance

The physical measurements used the checkout based on commit `6b190dce7508`
(the PR #129 change before its merge) plus the opt-in demo instrumentation patch
in this directory. The measured code was built and installed before the trials;
the Python runner evolved between groups. Per-group measured runner snapshots
and SHA-256 checksums are retained. The SDK implementation was not modified.

PR #129 was merged into main as `223df457812e1c0a47b8d4498b96c382ed43d71a`.
The changes here are rebased onto that commit; SDK and demo base contents matched
the measured parent. A subsequent build validates the publishable checkout;
it does not retroactively rerun measurements on a different build.

The original run outputs (including identifying device snapshots) remain locally
under `/private/tmp/net-http-*20261113-*`. A pre-publication backup of the dated
evidence, controller sources and Swift files was also retained locally. Those
local backups are not included in this PR.

Published copies omit `device-before`, `device-armed` and `device-after` snapshots
and their command logs, which include device identity information. Included
hardware/CoreDevice IDs, serials, names and hostnames are replaced with TEST_DEVICE
placeholders. Console log line endings are normalized to LF and trailing
whitespace removed for review; timestamps, payloads and observed values are not
changed. Network addresses, URLs/session IDs, process IDs and host monotonic
values remain as experiment evidence. Do not interpret these replacements as
new measurements or independently verified packet timestamps.

Analysis scripts' hard-coded checkout roots were replaced with paths relative
to their published location. Measured controller snapshots are unchanged and
their original hashes are checked. Generated logs, JSON/CSV and measured
controller copies are marked as generated in .gitattributes so the reports and
current implementation remain reviewable.
