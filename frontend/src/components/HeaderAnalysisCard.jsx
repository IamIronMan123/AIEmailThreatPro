import React, { useState } from 'react';
import { Mail, CheckCircle2, XCircle, AlertCircle, FileText, ChevronDown, ChevronUp } from 'lucide-react';

export default function HeaderAnalysisCard({ headerData }) {
  const [showRaw, setShowRaw] = useState(false);

  const {
    subject = "No Subject",
    from = "unknown",
    to = "unknown",
    sender_address = "",
    sender_domain = "",
    reply_to = "",
    return_path = "",
    message_id = "",
    date = "",
    auth_spf = "NEUTRAL",
    auth_dkim = "NEUTRAL",
    auth_dmarc = "NEUTRAL",
    raw_headers = ""
  } = headerData || {};

  const renderAuthBadge = (status, label) => {
    let color = "bg-amber-500/10 text-amber-400 border-amber-500/30";
    let Icon = AlertCircle;

    if (status === "PASS") {
      color = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      Icon = CheckCircle2;
    } else if (status === "FAIL") {
      color = "bg-red-500/10 text-red-400 border-red-500/30";
      Icon = XCircle;
    }

    return (
      <div className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold ${color}`}>
        <Icon className="w-3.5 h-3.5" />
        <span>{label}: {status}</span>
      </div>
    );
  };

  return (
    <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-5 shadow-xl space-y-4">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base font-bold text-slate-100 font-mono tracking-wide">
            Email & Header Forensic Inspector
          </h2>
        </div>
        <button
          onClick={() => setShowRaw(!showRaw)}
          className="flex items-center space-x-1 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{showRaw ? "Hide Raw Headers" : "View Raw Headers"}</span>
          {showRaw ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      </div>

      {/* Authentication Verification Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {renderAuthBadge(auth_spf, "SPF")}
        {renderAuthBadge(auth_dkim, "DKIM")}
        {renderAuthBadge(auth_dmarc, "DMARC")}
      </div>

      {/* Structured Header Metadata */}
      <div className="bg-[#1E293B]/60 p-4 rounded-xl border border-slate-800 space-y-2.5 font-mono text-xs">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 pb-2 border-b border-slate-800/60">
          <span className="md:col-span-3 text-slate-400 font-semibold">Subject:</span>
          <span className="md:col-span-9 text-slate-100 font-bold">{subject}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          <span className="md:col-span-3 text-slate-400 font-semibold">From:</span>
          <span className="md:col-span-9 text-cyan-300 break-all">{from}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          <span className="md:col-span-3 text-slate-400 font-semibold">Sender Domain:</span>
          <span className="md:col-span-9 text-slate-200">
            <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-bold text-cyan-400">{sender_domain}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
          <span className="md:col-span-3 text-slate-400 font-semibold">To:</span>
          <span className="md:col-span-9 text-slate-300 break-all">{to}</span>
        </div>

        {reply_to && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <span className="md:col-span-3 text-slate-400 font-semibold">Reply-To:</span>
            <span className="md:col-span-9 text-amber-300 break-all">{reply_to}</span>
          </div>
        )}

        {return_path && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <span className="md:col-span-3 text-slate-400 font-semibold">Return-Path:</span>
            <span className="md:col-span-9 text-slate-300 break-all">{return_path}</span>
          </div>
        )}

        {message_id && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <span className="md:col-span-3 text-slate-400 font-semibold">Message-ID:</span>
            <span className="md:col-span-9 text-slate-400 break-all">{message_id}</span>
          </div>
        )}

        {date && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <span className="md:col-span-3 text-slate-400 font-semibold">Date:</span>
            <span className="md:col-span-9 text-slate-300">{date}</span>
          </div>
        )}

      </div>

      {/* Collapsible Raw Headers */}
      {showRaw && (
        <div className="bg-[#0A0E1A] p-4 rounded-xl border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 block mb-2 font-bold uppercase">Raw Headers Stream</span>
          <pre className="text-[11px] font-mono text-emerald-400/90 whitespace-pre-wrap break-all max-h-48 overflow-y-auto p-2 bg-slate-950 rounded">
            {raw_headers || "No raw headers captured."}
          </pre>
        </div>
      )}

    </div>
  );
}
