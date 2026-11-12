# Handoff with advance instructions and local spoken cues, 2026-11-13

One physical-iPhone Wi-Fi → cellular → Wi-Fi trial. The assistant displayed
all action mappings before readiness confirmation. After confirmation, the
local runner handled the silent 3–2–1 countdown and cut/restore/finish cues;
no intermediate AI action instruction was sent. Audio audibility was confirmed
for the readiness tone by the operator; subsequent sound/speech invocations
are recorded, not independent proof that each was heard.

- Outcome: `handoff-observed`; three matched echo responses.
- Requested hold: 15 s from the observed cellular path.
- Restore cue threshold on device heartbeat: 16.000 s.
- Observed cellular-to-restored-Wi-Fi path interval: 26.947 s, including operator
  response and network association. This is not physical disconnection timing.
- Device echo RTTs: baseline 150.32 ms, cellular stage 199.85 ms, restored
  Wi-Fi stage 732.03 ms; these are not interface-handoff recovery latencies.
- One channel open, one unique SID in request logs, no SDK error callbacks.
- Seven recorded transaction metrics, four with `isCellular=true`; all h2.
  Default-path callbacks do not prove the interface used by every request.
- Wired devicectl transport verified before arming and after recovery.
- Channel closed and demo terminated during normal cleanup.

Cue sequence: readiness Tink; cut Glass + spoken instruction; restore Hero +
spoken instruction; finish Funk + spoken instruction. There was no intermediate
cellular-confirmation sound. The cue journal preserves countdown and cue times.
The earlier trial observed 41.942 s cellular-to-Wi-Fi; this trial observed
26.947 s. These two observations alone do not isolate the effect of cue changes.

See result.json for milestones/lifecycle/task metrics, device-events.jsonl and
device-console.log for app evidence, and runner-events.jsonl for local cues.
Measured runner sources are preserved in tool-sources/ with SHA-256 hashes.
Device intervals use device uptime, never host/device UTC subtraction.
This observation is not a blanket T9–T15 pass; no packet capture or confirmed
suspension test was performed.

Original output including identifying device snapshots remains locally at
`/private/tmp/net-http-handoff-20261113-02`. This copy omits those snapshots and
their command logs, and replaces identifying names/IDs in retained files with
TEST_DEVICE placeholders. Network addresses, session IDs and measurements are
retained as evidence.
