import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, ArrowRight, Flag, ExternalLink } from 'lucide-react';

export default function EmployeeWarningBadge({ scanResult }) {
  const threatRisk = scanResult?.ai_threat_detection?.threat_risk || 'LOW';
  const threatScore = scanResult?.ai_threat_detection?.threat_score || 0;
  const senderAddress = scanResult?.header_analysis?.sender_address || 'Unknown Sender';
  const subject = scanResult?.header_analysis?.subject || 'No Subject';

  const isDangerous = threatRisk === 'CRITICAL' || threatRisk === 'HIGH';
  const isSuspicious = threatRisk === 'MEDIUM';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Main Banner */}
      <div className={`p-6 rounded-2xl border shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 transition-all ${
        isDangerous
          ? 'bg-gradient-to-r from-red-950/90 via-red-900/60 to-slate-900 border-red-500/50 text-red-200'
          : isSuspicious
          ? 'bg-gradient-to-r from-amber-950/90 via-amber-900/60 to-slate-900 border-amber-500/50 text-amber-200'
          : 'bg-gradient-to-r from-emerald-950/90 via-emerald-900/60 to-slate-900 border-emerald-500/50 text-emerald-200'
      }`}>
        
        <div className="flex items-center space-x-5">
          <div className={`p-4 rounded-2xl border shadow-lg ${
            isDangerous ? 'bg-red-500/20 border-red-500/40 text-red-400' : isSuspicious ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
          }`}>
            {isDangerous ? (
              <ShieldAlert className="w-12 h-12 animate-pulse" />
            ) : isSuspicious ? (
              <AlertTriangle className="w-12 h-12" />
            ) : (
              <ShieldCheck className="w-12 h-12" />
            )}
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono uppercase tracking-widest font-bold opacity-80">
              ZETP Automated Employee Security Status
            </span>
            <h2 className="text-2xl font-bold tracking-tight">
              {isDangerous
                ? 'DANGER: High Phishing & Security Threat Detected!'
                : isSuspicious
                ? 'WARNING: Suspicious Email Anomaly Detected'
                : 'SAFE: Email Passed Security Checks'}
            </h2>
            <p className="text-sm opacity-90 font-mono">
              Threat Score: <span className="font-bold underline">{threatScore.toFixed(1)} / 100</span> | Status: <span className="font-bold">{threatRisk}</span>
            </p>
          </div>
        </div>

        {/* Quick Employee Action */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {isDangerous && (
            <button
              onClick={() => alert("Reported to Security Operations Center (SOC). Thank you for keeping your organization safe!")}
              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs uppercase font-mono tracking-wider flex items-center justify-center space-x-2 shadow-lg transition-transform active:scale-95"
            >
              <Flag className="w-4 h-4" />
              <span>Report to Security Team</span>
            </button>
          )}
        </div>

      </div>

      {/* Employee Safety Guidance & Actionable Instructions */}
      <div className="bg-[#0F172A] p-6 rounded-xl border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-base font-bold text-slate-100 font-mono flex items-center">
          <ShieldAlert className="w-5 h-5 text-cyan-400 mr-2" />
          Employee Safety Checklist & Recommended Action
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-[#1E293B]/70 p-4 rounded-lg border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-cyan-300 font-mono uppercase">What Should You Do?</h4>
            <ul className="text-xs text-slate-300 space-y-2">
              <li className="flex items-start">
                <span className="text-red-400 font-bold mr-2">✕</span>
                <span>Do <strong>NOT</strong> click any hyperlinked URLs or buttons inside this email.</span>
              </li>
              <li className="flex items-start">
                <span className="text-red-400 font-bold mr-2">✕</span>
                <span>Do <strong>NOT</strong> download or run attached files or forms.</span>
              </li>
              <li className="flex items-start">
                <span className="text-emerald-400 font-bold mr-2">✓</span>
                <span>Verify sender identity directly through Slack, Teams, or phone call.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#1E293B]/70 p-4 rounded-lg border border-slate-800 space-y-2 font-mono text-xs">
            <h4 className="text-xs font-bold text-cyan-300 uppercase">Email Overview</h4>
            <p><span className="text-slate-400">Subject:</span> <span className="text-slate-100 font-semibold">{subject}</span></p>
            <p><span className="text-slate-400">Sender Address:</span> <span className="text-cyan-300 font-semibold break-all">{senderAddress}</span></p>
            <p><span className="text-slate-400">Security Recommendation:</span> <span className={isDangerous ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>{isDangerous ? 'DO NOT INTERACT. REPORT TO SOC.' : 'CLEAN. OK TO READ.'}</span></p>
          </div>

        </div>
      </div>

    </div>
  );
}
