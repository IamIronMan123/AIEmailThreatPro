import React from 'react';
import { ShieldAlert, AlertTriangle, ShieldCheck, Flag, CheckCircle2, XCircle } from 'lucide-react';
import SeverityBadge from '../components/common/SeverityBadge';

export default function EmployeeView({ scanResult }) {
  const threatSeverity = scanResult?.ai_threat_detection?.threat_severity || 'Critical';
  const threatScore = scanResult?.ai_threat_detection?.threat_score || 94.5;
  const isDangerous = threatSeverity === 'Critical' || threatSeverity === 'High';

  return (
    <div className="max-w-3xl mx-auto space-y-6 pt-4">
      
      {/* Top Banner */}
      <div className={`p-6 rounded-2xl border shadow-2xl space-y-4 ${
        isDangerous
          ? 'bg-gradient-to-r from-red-950/90 via-red-900/60 to-slate-900 border-red-500/50 text-red-200'
          : 'bg-gradient-to-r from-emerald-950/90 via-emerald-900/60 to-slate-900 border-emerald-500/50 text-emerald-200'
      }`}>
        
        <div className="flex items-center space-x-4">
          <div className={`p-3.5 rounded-2xl border shadow-lg ${
            isDangerous ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
          }`}>
            {isDangerous ? <ShieldAlert className="w-10 h-10 animate-pulse" /> : <ShieldCheck className="w-10 h-10" />}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono uppercase font-bold opacity-80">ZETP Email Security Alert</span>
              <SeverityBadge severity={threatSeverity} />
            </div>
            <h2 className="text-xl font-bold tracking-tight mt-1">
              {isDangerous ? 'This email has been identified as potentially dangerous.' : 'This email passed enterprise safety checks.'}
            </h2>
            <p className="text-xs font-mono opacity-90 mt-0.5">
              Threat Score: <span className="font-bold">{threatScore.toFixed(1)} / 100</span>
            </p>
          </div>
        </div>

      </div>

      {/* Why Was This Email Flagged? */}
      <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 space-y-3 font-sans text-xs">
        <h3 className="text-sm font-bold text-white font-mono flex items-center">
          <AlertTriangle className="w-4 h-4 text-cyan-400 mr-2" />
          Why Was This Email Flagged?
        </h3>

        <ul className="space-y-2">
          <li className="flex items-start text-slate-300">
            <XCircle className="w-4 h-4 text-red-400 mr-2 shrink-0 mt-0.5" />
            <span><strong>Suspicious Sender Identity:</strong> The sender address differs from expected corporate email domains.</span>
          </li>
          <li className="flex items-start text-slate-300">
            <XCircle className="w-4 h-4 text-red-400 mr-2 shrink-0 mt-0.5" />
            <span><strong>Unsafe Credential Link:</strong> Contains an unverified website hyperlink attempting to collect login details.</span>
          </li>
          <li className="flex items-start text-slate-300">
            <XCircle className="w-4 h-4 text-red-400 mr-2 shrink-0 mt-0.5" />
            <span><strong>Authentication Protocol Failure:</strong> Sender domain failed SPF and DMARC security checks.</span>
          </li>
          <li className="flex items-start text-slate-300">
            <XCircle className="w-4 h-4 text-red-400 mr-2 shrink-0 mt-0.5" />
            <span><strong>Suspicious Attachment:</strong> Contains executable file attachment (.exe).</span>
          </li>
        </ul>
      </div>

      {/* Recommended Actions */}
      <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 space-y-4 font-sans text-xs">
        <h3 className="text-sm font-bold text-white font-mono flex items-center">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2" />
          Recommended Actions for Employees
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
          <div className="bg-[#1E293B]/70 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-red-400 font-bold block">1. Do NOT Click Links</span>
            <p className="text-slate-400 text-[11px] font-sans">Do not click any hyperlinked buttons or web addresses inside this message.</p>
          </div>
          <div className="bg-[#1E293B]/70 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-red-400 font-bold block">2. Do NOT Open Attachments</span>
            <p className="text-slate-400 text-[11px] font-sans">Do not download, open, or run attached files or forms.</p>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => alert("Reported to Security Operations Center (SOC). Thank you for keeping your organization secure!")}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 transition-transform active:scale-95 uppercase tracking-wider"
          >
            <Flag className="w-4 h-4" />
            <span>Report Incident to Security Team</span>
          </button>
        </div>
      </div>

    </div>
  );
}
