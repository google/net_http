# Publication and provenance

Console copies normalize line endings and trim trailing whitespace. Device IDs,
names, hostnames and user home paths are replaced with TEST placeholders.
Full device snapshots, process lists, xcresults and build diagnostics stay local.
Only the resumed demo process is selected from process snapshots.

`tool-sources/initial-app` preserves the app/controller sources used for the T5
and expiry measurements and the first WebChannel HTTP/3 preflight. Later
diagnostic builds are identified separately. SHA256SUMS identifies published
copies; identifying constants in auxiliary scripts may be replaced. SDK
retry/recovery sources are not changed. Analysis scripts operate on retained
events and do not operate the device. These are follow-up observations under
Xcode 27.2, not a controlled isolation of the wiring change alone.
