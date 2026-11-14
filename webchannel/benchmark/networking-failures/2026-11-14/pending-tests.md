# Remaining scope and measurement limits

T13's idle handoff series is now recorded: three trials each at 50, 90 and
150 s requested holds. The 50/90 s groups resumed their original sessions;
the 150 s group ended after Wi-Fi restoration with HTTP 400 / SDK error 4
(UnknownSessionID), three times each. See [the report](t13-summary.md).

The operator created Mobile 100% Loss in the iPhone Network Link Conditioner,
selecting cellular and 100% loss in both directions. Interface-bound probes
verified working Wi-Fi and available but unresponsive cellular before the
series. The GUI supplies interface selection absent from the native helper.
The host did not replace or clear the manually enabled profile. The operator
was asked to disable it after the final trial; restoration is not yet verified.

Exact physical transition timing, continuous packet-level loss verification,
and underlying NSError details remain unmeasured. These idle trials do not
cover every traffic pattern or locate a precise expiry threshold. QUIC M6 is
conditional on h3 (not observed so far). No blanket SDK pass is claimed.
