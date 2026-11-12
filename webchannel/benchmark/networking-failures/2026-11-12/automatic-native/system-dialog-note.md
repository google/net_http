# Cellular-data-disabled system dialog

During T5-r2, the operator noticed an iPhone dialog saying cellular data was
turned off. Its original appearance time is unknown. The operator confirmed
closing it after the run was stopped. Cellular data remains disabled.

The autonomous runner was interrupted at Mac UTC 05:53:28 on 2026-11-12. The
native controller released loss after about 156.058 s instead of the scheduled
250 s, and verified all induced conditions inactive. An independent readback in
`after-dialog-state.jsonl` also confirmed inactive. T5-r2 is not counted as a
completed repetition; its interrupted directory is preserved on resume.

The SDK continued request/retry logging and accepted the app close notification.
No lifecycle notification identifying when the dialog appeared was recorded.
This does not prove that the dialog had no influence, and no precise effect is
inferred for earlier trials. The first 13 completed runs retain their raw
observations; dialog visibility was not monitored automatically.

Before resuming, an opt-in 1 Hz main-run-loop heartbeat and UIApplication state
were added to the demo. The runner aborts and releases loss if the heartbeat is
absent for more than 6 s or the app enters background (state 2). Inactive state
(state 1) is recorded and must be reviewed separately. This monitor does not
recognize or dismiss system dialogs. Transport defaults and the SDK are unchanged.

iPhone Mirroring was inspected as a possible UI-control route, but it was not
configured/could not connect; onboarding was dismissed without changing account
or permission settings. No UI automation outside Computer Use was installed.
