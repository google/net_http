# Startup investigation artifacts

[Report](report.md) · [Audit](connection-reuse-audit.md) · [Execution settings](execution-settings.json) · [Progress](progress.json)

[All attempts](trials.json) · [Recovery actions](actions.json) · [Notification UUID analysis](notification-observations.json)

[Raw notification stream](logs/notification-stream.ndjson) retains filtered host observations. [Logs and snapshots](logs/) retain per-invocation output, USB and process resource snapshots, and CoreDevice JSON. [Result bundles](xcresults/) retain every attempted XCTest invocation. [Parsed trial records](attachments/) are derived from stdout markers and capture metadata, not exported XCTest attachments.

[Original frozen runner](source-snapshots/run-startup-investigation.py) and [build provenance](provenance.json) retain the executed source hashes. The USB collector limitation is documented in the audit.
