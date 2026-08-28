import React from 'react';

export default function SeverityBadge({ severity = 'Low', size = 'normal' }) {
  const sev = (severity || 'Low').toString().toLowerCase();

  let colors = 'bg-slate-500/10 text-slate-400 border-slate-700';

  if (sev === 'critical') {
    colors = 'bg-red-500/10 text-red-400 border-red-500/30 font-bold';
  } else if (sev === 'high') {
    colors = 'bg-orange-500/10 text-orange-400 border-orange-500/30 font-semibold';
  } else if (sev === 'medium') {
    colors = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
  } else if (sev === 'low') {
    colors = 'bg-blue-500/10 text-blue-400 border-blue-500/30';
  } else if (sev === 'informational' || sev === 'info') {
    colors = 'bg-slate-500/10 text-slate-300 border-slate-700';
  }

  const padding = size === 'small' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center rounded border font-mono uppercase tracking-wider ${padding} ${colors}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
      {severity}
    </span>
  );
}
