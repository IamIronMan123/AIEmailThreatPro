import React from 'react';
import { Clock, ShieldCheck, AlertTriangle, Cpu, Globe, Search } from 'lucide-react';

export default function ForensicTimeline({ timeline = [] }) {
  const getCategoryIcon = (cat) => {
    switch (cat) {
      case 'HEADER_HOP':
        return <Clock className="w-4 h-4 text-cyan-400" />;
      case 'GEO_INTEL':
        return <Globe className="w-4 h-4 text-blue-400" />;
      case 'AUTH_CHECK':
        return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
      case 'AI_SCAN':
        return <Cpu className="w-4 h-4 text-amber-400" />;
      case 'IOC_FOUND':
        return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default:
        return <Search className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-5 shadow-xl space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-slate-100 font-mono tracking-wide">
            Forensic Investigation Timeline
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Chronological Lifecycle Trace
        </span>
      </div>

      {/* Timeline Stream */}
      <div className="relative border-l-2 border-slate-800 ml-4 space-y-6 py-2">
        {timeline.length === 0 ? (
          <p className="text-xs font-mono text-slate-500 ml-6">No timeline events captured.</p>
        ) : (
          timeline.map((event, idx) => (
            <div key={idx} className="relative ml-6 space-y-1">
              {/* Dot Icon */}
              <div className="absolute -left-[35px] top-0 h-8 w-8 rounded-full bg-[#1E293B] border border-slate-700 flex items-center justify-center shadow-md">
                {getCategoryIcon(event.category)}
              </div>

              {/* Event Content */}
              <div className="bg-[#1E293B]/60 p-3.5 rounded-xl border border-slate-800 space-y-1 font-mono">
                <div className="flex flex-wrap items-center justify-between text-xs">
                  <h3 className="font-bold text-slate-100 text-sm">{event.title}</h3>
                  <span className="text-[11px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60 font-semibold">
                    {event.timestamp}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {event.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
