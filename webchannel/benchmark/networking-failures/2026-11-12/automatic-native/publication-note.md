# Publication preparation

Hardware UDIDs and CoreDevice UUIDs have been consistently replaced with
`TEST_DEVICE_UDID` and `TEST_COREDEVICE_ID` in published records and examples.
The numerical measurements, request/session identifiers, transaction addresses,
ports, timestamps and observed outcomes are retained for analysis. Tool-snapshot
SHA-256 values cover the published, redacted files.

The opt-in demo instrumentation was subsequently rebased onto main for this PR.
The measurements were made on the exact base and patches recorded in
`environment.json`; rebase/build checks do not represent a rerun of the 36 trials.

Published console logs use LF line endings and omit trailing whitespace.
`validation.json` records published byte counts and preserves original counts
where normalization changed the size. Unmodified originals were backed up locally.
