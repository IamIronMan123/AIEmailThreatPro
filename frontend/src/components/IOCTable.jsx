import React from 'react';
import { Shield, AlertTriangle, AlertCircle, CheckCircle, Search, ExternalLink } from 'lucide-react';

export default function IOCTable({ iocs = [] }) {
  const getRiskBadge = (risk) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-400 border-red-500/40';
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/40';
      case 'MEDIUM':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
  };

  return (
    <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-5 shadow-xl space-y-4">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-slate-100 font-mono tracking-wide">
            Digital Forensics — Extracted Indicators of Compromise (IOCs)
          </h2>
        </div>
        <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-cyan-400 font-mono border border-slate-700 font-bold">
          Total IOCs: {iocs.length}
        </span>
      </div>

      {/* IOC Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left border-collapse font-mono text-xs">
          <thead>
            <tr className="bg-[#1E293B] text-slate-300 border-b border-slate-800 uppercase text-[11px]">
              <th className="p-3 font-semibold">IOC ID</th>
              <th className="p-3 font-semibold">Type</th>
              <th className="p-3 font-semibold">Value</th>
              <th className="p-3 font-semibold">Risk Level</th>
              <th className="p-3 font-semibold">Forensic Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-[#0A0E1A]">
            {iocs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-slate-500">
                  No IOCs extracted yet. Scan an email to generate forensic indicators.
                </td>
              </tr>
            ) : (
              iocs.map((ioc, idx) => (
                <tr key={idx} className="hover:bg-slate-900/80 transition-colors">
                  <td className="p-3 font-bold text-cyan-400">{ioc.ioc_id || `IOC #${idx+1}`}</td>
                  <td className="p-3">
                    <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded border border-slate-700 font-semibold">
                      {ioc.type}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-200 max-w-xs truncate" title={ioc.value}>
                    {ioc.value}
                  </td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded border font-bold text-[10px] tracking-wider ${getRiskBadge(ioc.risk)}`}>
                      {ioc.risk}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 max-w-md">{ioc.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
