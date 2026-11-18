# M6 with Buffalo 5 GHz fixed

Six qualified 180 s observations completed, three each with cellular data OFF
and ON. The operator confirmed the NEC network forgotten and other auto-join
networks disabled. AP and band are operator-reported, not SSID/BSSID telemetry.

| Condition / run | h3 transactions | Connected wired checks | Post-setup PING packets, primary trace | Path flags |
| --- | ---: | ---: | ---: | --- |
| M6-off-r1 | 6 | 8 | 8 | Wi-Fi only |
| M6-off-r2 | 6 | 8 | 7 | Wi-Fi only |
| M6-off-r3 | 6 | 8 | 6 | Wi-Fi only |
| M6-on-r1 | 6 | 8 | 7 | Wi-Fi only |
| M6-on-r2 | 6 | 8 | 7 | Wi-Fi only |
| M6-on-r3 | 6 | 8 | 6 | Wi-Fi only |

All 36 completed task transactions were h3, with no unknown or fallback protocol,
no SDK error and no application sends. Every foreground heartbeat remained
active. All 48 transport checks recorded wired/connected. Each observation
exceeded 180 s from channel open to stop control. All path callbacks remained
Wi-Fi=true/cellular=false, including the cellular-ON observations.

No sustained approximately 1 s PING sequence was reproduced in either condition.
The primary traces show the first post-setup PING near 20 s and mostly roughly
30 s spacing, with additional PINGs at shorter/irregular intervals retained
in the full evidence. Not every PING is labeled as application keepalive.
Local max_idle_timeout is 0 and remote is 240000 ms in all six primary traces.

The third ON observation also generated a separate 0.021629 s, 14-event trace,
with local parameters but no remote parameters and no PING. It is retained
without assigning a cause. Primary timing summaries select the longest trace;
times from separate trace origins are not concatenated or subtracted.

The earlier approximately 1 s PING behavior was not reproduced under this
fixed-AP setup. This does not prove the AP was its cause or that cellular
availability cannot affect it. The conditions were consecutive OFF and ON
batches, and the earlier AP identities were not recorded.

The first GET still received peer RESET_STREAM/STOP_SENDING error 0x101 with
63 unique response-stream bytes in all six primary traces, with immediate
normal next-GET creation. This behavior persists with Buffalo fixed.

## Exclusions and provenance

An initial OFF batch was started without a verified wired preflight. The
operator reported no USB cable, and CoreDevice recorded localNetwork. That
entire batch (one complete observation and a partial second) is excluded.
After USB connection, the replacement controller required wired/connected
before launch, every 30 s and before collection. No radio switch or fault was
introduced by these controllers. The operator-specified conditions and source
hashes are stored per condition.

Session invalidation was observed before each qlog copy. Native qlog originals
remain local; source hashes and explicit PING excerpts are retained. RVI was
started only after all six qualified M6 observations ended. The client SDK
recovery implementation is unchanged.

[Summary](m6-summary.json), [OFF evidence](m6-off/), [ON evidence](m6-on/),
[excluded wireless start](excluded-wireless-start/exclusion.json).
