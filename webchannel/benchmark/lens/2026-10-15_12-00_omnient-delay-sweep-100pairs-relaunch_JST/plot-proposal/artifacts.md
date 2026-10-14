# Unpaired plotting proposal

These are previews for choosing the next report format, using original measurements from the October 15 noon run. The main report has not been regenerated.

- [TTFA alternatives](ttfa-options.png): elapsed-time scatter, empirical cumulative distribution, and overlaid 10 ms histograms for delay 0 ms.
- [TTFD alternatives](ttfd-options.png): the same three formats for TTFD.
- [Extracted trial data](plotted-trials.json): all 1,000 source trial records, including missing metric values and the timed-out trial.
- [Preview generator](make-proposal.py): generates the alternatives directly from the original trial-to-batch maps and JSON attachments.

No paired subtraction, handshake-difference selection, completion-status selection, HTTP-status selection, or cold-connection selection is applied. Each metric uses all finite observed values independently. Missing observations remain missing; they are not assigned zero or a timeout duration. Distribution percentages are normalized within each setting's observed values; missing counts are shown separately. Original measurements, the existing report, and its figures are unchanged.
