# Operator notes, 2026-11-16

- Operator confirmed USB, Wi-Fi ON, cellular OFF, Network Link Conditioner disabled, and AP directly connected to switching hub without Linux box.
- Mac/Xcode had just been upgraded; operator accepted the Xcode license in the GUI.
- After T5 run 1, run 2 was stopped before fault injection because no active heartbeat appeared. Operator reported the system dialog "モバイルデータ通信がオフです" and dismissed it with OK.
- Run 1 is retained; the interrupted run 2 startup is excluded and preserved by --resume. T5 runs 2–3 were then resumed without rerunning run 1.
- First expiry startup was blocked by an Enable UI Automation dialog following the host update; UI observer exited before a verified hold. Operator enabled UI Automation. That startup is excluded; the six-trial expiry batch restarts in suffix -03.
