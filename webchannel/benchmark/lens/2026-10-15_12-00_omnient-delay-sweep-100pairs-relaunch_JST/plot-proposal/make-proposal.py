import json,math,hashlib
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from matplotlib.ticker import PercentFormatter
import numpy as np
root=Path('/Users/riesz/net_http/webchannel/benchmark/lens/2026-10-15_12-00_omnient-delay-sweep-100pairs-relaunch_JST')
out=Path('/tmp/lens-raw-plot-proposal');out.mkdir(exist_ok=True)
records=[]
for phase in sorted(root.glob('delay-*ms')):
 for stem,item in json.loads((phase/'batch-trial-map.json').read_text()).items():
  row=json.loads((phase/item['originalJSON']).read_text())[0]
  records.append({k:row.get(k) for k in ['initialMessageDelayMs','batchTrialOrdinal','trialStartedEpochSeconds','fastHandshake2','status','handshakeMs','ttfaMs','ttfdMs']})
(out/'plotted-trials.json').write_text(json.dumps(records,indent=2)+'\n')
rows=sorted([r for r in records if r['initialMessageDelayMs']==0],key=lambda r:r['batchTrialOrdinal'])
style=[(False,'OFF','#0072B2','o'),(True,'ON','#D55E00','^')]
for metric in ['TTFA','TTFD']:
 key=metric.lower()+'Ms';fig,axes=plt.subplots(1,3,figsize=(15,4.6),layout='constrained');first=min(r['trialStartedEpochSeconds'] for r in rows)
 valid=lambda r:isinstance(r[key],(int,float)) and math.isfinite(r[key])
 allv=[r[key] for r in rows if valid(r)];bins=np.arange(math.floor(min(allv)/10)*10,math.floor(max(allv)/10)*10+20,10)
 for setting,label,color,marker in style:
  group=[r for r in rows if r['fastHandshake2']==setting];available=[r for r in group if valid(r)];v=np.array([r[key] for r in available]);caption=f'{label}: n={len(v)}, missing={len(group)-len(v)}'
  axes[0].scatter([r['trialStartedEpochSeconds']-first for r in available],v,s=18,c=color,marker=marker,alpha=.65,label=caption)
  x=np.sort(v);axes[1].step(np.r_[x[0],x],np.r_[0,np.arange(1,len(x)+1)/len(x)],where='post',color=color,label=caption)
  axes[2].hist(v,bins=bins,weights=np.ones(len(v))*100/len(v),color=color,alpha=.5,edgecolor='none',linewidth=0,label=caption)
 axes[0].set(title='A. Individual trials over time',xlabel='Elapsed time within delay (s)',ylabel=f'{metric} (ms)');axes[0].set_ylim(bottom=0)
 axes[1].set(title='B. Empirical cumulative distribution',xlabel=f'{metric} (ms)',ylabel='Fraction of observed trials');axes[1].yaxis.set_major_formatter(PercentFormatter(1));axes[1].set_ylim(0,1.03)
 axes[2].set(title='C. Overlaid histograms: 10 ms bins',xlabel=f'{metric} (ms)',ylabel='Observed trials per bin (%)')
 for ax in axes:ax.grid(alpha=.2);ax.set_axisbelow(True);ax.legend(fontsize=8)
 fig.suptitle(f'Proposal only | Omnient | M1 delay 0 ms | {metric}\nAll finite values; no pairing, handshake-difference filter, or HTTP-status filter',fontsize=12)
 fig.savefig(out/f'{metric.lower()}-options.png',dpi=150);plt.close(fig)
print(json.dumps({'proposalDirectory':str(out),'trialsRead':len(records),'delay0Trials':len(rows),'plotFiles':['ttfa-options.png','ttfd-options.png']}))
