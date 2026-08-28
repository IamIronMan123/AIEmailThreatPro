import React, { useState } from 'react';
import {
  ShieldAlert, ShieldCheck, AlertTriangle, ArrowRight, Lock,
  Mail, CheckCircle2, XCircle, AlertOctagon, RefreshCw, Send,
  Inbox, ShieldBan, Bell, Sparkles, ExternalLink, HelpCircle
} from 'lucide-react';
import SeverityBadge from '../common/SeverityBadge';

export default function PolicyPipelineCard({ scanResult, onActionOverride }) {
  const [currentAction, setCurrentAction] = useState(null);
  const [showToast, setShowToast] = useState(true);

  const ai = scanResult?.ai_threat_detection || {};
  const threatScore = ai.threat_score !== undefined ? ai.threat_score : 94.5;
  const threatSeverity = ai.threat_severity || 'Critical';
  
  // Default automated policy determination
  const defaultPolicyAction = threatScore < 30.0 ? 'ALLOW' : threatScore < 55.0 ? 'WARNING' : 'QUARANTINE';
  const effectiveAction = currentAction || ai.policy_action || defaultPolicyAction;

  const characteristics = ai.detection_characteristics || {
    fake_sender_info: { detected: true, label: "Fake Sender Information", details: "SPF/DKIM/DMARC failure. Domain mismatch." },
    phishing_links: { detected: true, label: "Phishing Links", details: "Credential harvesting URL detected." },
    suspicious_messages: { detected: true, label: "Suspicious Words / Messages", details: "Urgency social engineering triggers." },
    malicious_attachments: { detected: true, label: "Malicious Attachments", details: "Executable payload .exe detected." },
    unusual_patterns: { detected: true, label: "Unusual Email Patterns", details: "Reply-To address discrepancy." }
  };

  const handleOverride = (action) => {
    setCurrentAction(action);
    if (onActionOverride) onActionOverride(action);
  };

  return (
    <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-5 shadow-2xl space-y-5 relative overflow-hidden">
      
      {/* Background Accent Mesh */}
      <div className="absolute top-0 right-0 w-96 h-48 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner Alert (Alert pop up feature for website) */}
      {showToast && effectiveAction === 'QUARANTINE' && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-between font-mono text-xs text-red-300">
          <div className="flex items-center space-x-2.5">
            <div className="p-1 rounded bg-red-500/20 text-red-400">
              <ShieldAlert className="w-4 h-4 animate-pulse" />
            </div>
            <span>
              <strong>REAL-TIME SECURITY ALERT:</strong> High-risk email intercepted from Gmail/Outlook relay. <strong>Quarantined & blocked</strong> from user inbox.
            </span>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="text-red-400 hover:text-white text-[11px] underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 p-0.5 flex items-center justify-center shadow-lg">
            <div className="h-full w-full bg-[#0A0E1A] rounded-[6px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-white font-mono tracking-wide">
                Automated Triage Pipeline & Policy Enforcement
              </h2>
              <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800 font-bold uppercase">
                Core Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans">
              Continuous 3-Stage Lifecycle: <strong>Email Detection</strong> ➔ <strong>Risk Scoring</strong> ➔ <strong>Allow / Warning / Quarantine</strong>
            </p>
          </div>
        </div>

        {/* Mail Provider Connectors */}
        <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-400 bg-[#1E293B] px-3 py-1.5 rounded-lg border border-slate-700/80">
          <span className="text-slate-300 font-semibold">Protected Gateways:</span>
          <span className="text-cyan-400 font-bold">Gmail</span>
          <span>•</span>
          <span className="text-blue-400 font-bold">Microsoft Outlook</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
        </div>
      </div>

      {/* 3-Stage Workflow Architecture Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* STAGE 1: DETECTION */}
        <div className="bg-[#1E293B]/60 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-cyan-400 font-mono flex items-center">
                <span className="h-5 w-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mr-1.5 text-[10px]">1</span>
                Detection Stage
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Gmail / Outlook Ingestion</span>
            </div>

            <p className="text-[11px] text-slate-400 mt-2">
              Automated heuristics and AI parsing inspect incoming payloads for suspicious characteristics:
            </p>

            <div className="space-y-1.5 mt-3 font-mono text-xs">
              {Object.entries(characteristics).map(([key, val]) => (
                <div
                  key={key}
                  className={`p-2 rounded-lg border flex items-center justify-between ${
                    val.detected
                      ? 'bg-red-500/10 border-red-500/30 text-red-300'
                      : 'bg-emerald-500/5 border-emerald-500/20 text-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    {val.detected ? (
                      <XCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                    <span className="text-[11px] font-semibold">{val.label}</span>
                  </div>
                  <span className={`text-[10px] font-bold ${val.detected ? 'text-red-400' : 'text-emerald-400'}`}>
                    {val.detected ? 'DETECTED' : 'CLEAR'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-mono border-t border-slate-800 pt-2">
            Status: <span className="text-emerald-400 font-bold">Inspection Complete</span>
          </div>
        </div>

        {/* STAGE 2: RISK SCORING */}
        <div className="bg-[#1E293B]/60 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-amber-400 font-mono flex items-center">
                <span className="h-5 w-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mr-1.5 text-[10px]">2</span>
                Risk Scoring Stage
              </span>
              <SeverityBadge severity={threatSeverity} size="small" />
            </div>

            <p className="text-[11px] text-slate-400 mt-2">
              Dynamic multi-layer ML model computes risk score and security classification:
            </p>

            <div className="bg-[#0A0E1A] p-4 rounded-xl border border-slate-800 text-center my-3 space-y-2">
              <span className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Calculated Risk Score</span>
              <div className="text-3xl font-extrabold font-mono text-white">
                {threatScore.toFixed(1)}
                <span className="text-xs font-normal text-slate-400"> / 100</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    threatScore >= 55 ? 'bg-red-500' : threatScore >= 30 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${threatScore}%` }}
                />
              </div>
            </div>

            {/* Threshold Legend */}
            <div className="space-y-1 font-mono text-[10px]">
              <div className="flex justify-between text-emerald-400">
                <span>0 – 29: Low-Risk Tier</span>
                <span>Allow Policy</span>
              </div>
              <div className="flex justify-between text-amber-400">
                <span>30 – 54: Medium-Risk Tier</span>
                <span>Warning Tag Policy</span>
              </div>
              <div className="flex justify-between text-red-400">
                <span>55 – 100: High/Fake Threat</span>
                <span>Quarantine Policy</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-mono border-t border-slate-800 pt-2">
            Model: <span className="text-cyan-400 font-bold">ZETP Neural Threat Engine</span>
          </div>
        </div>

        {/* STAGE 3: ACTION (ALLOW / WARNING / QUARANTINE) */}
        <div className="bg-[#1E293B]/60 p-4 rounded-xl border border-slate-800 space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-red-400 font-mono flex items-center">
                <span className="h-5 w-5 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mr-1.5 text-[10px]">3</span>
                Automated Policy Action
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Enforcement</span>
            </div>

            <p className="text-[11px] text-slate-400 mt-2">
              Automated action enforced based on the risk score tier:
            </p>

            {/* Current Active Decision Banner */}
            <div className={`p-3.5 rounded-xl border space-y-1.5 my-3 ${
              effectiveAction === 'QUARANTINE'
                ? 'bg-red-500/15 border-red-500/40 text-red-200'
                : effectiveAction === 'WARNING'
                ? 'bg-amber-500/15 border-amber-500/40 text-amber-200'
                : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider flex items-center">
                  {effectiveAction === 'QUARANTINE' && <ShieldBan className="w-4 h-4 mr-1 text-red-400" />}
                  {effectiveAction === 'WARNING' && <AlertTriangle className="w-4 h-4 mr-1 text-amber-400" />}
                  {effectiveAction === 'ALLOW' && <Inbox className="w-4 h-4 mr-1 text-emerald-400" />}
                  ACTION: {effectiveAction}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  effectiveAction === 'QUARANTINE' ? 'bg-red-950 text-red-400 border border-red-800' : effectiveAction === 'WARNING' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                }`}>
                  AUTO-ENFORCED
                </span>
              </div>
              <p className="text-[11px] font-sans">
                {effectiveAction === 'QUARANTINE'
                  ? 'High-risk or fake email detected! Email is quarantined in the secure vault and blocked from reaching the employee inbox.'
                  : effectiveAction === 'WARNING'
                  ? 'Medium-risk email detected. A prominent warning header advisory was injected to warn the recipient.'
                  : 'Low-risk verified email. Passed all authentication checks and allowed directly into employee inbox.'}
              </p>
            </div>

            {/* Manual Triage Override Controls */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold block">
                Manual SOC Analyst Triage Override:
              </span>
              <div className="grid grid-cols-3 gap-1.5 font-mono text-[11px]">
                <button
                  onClick={() => handleOverride('ALLOW')}
                  className={`px-2 py-1.5 rounded-lg border font-bold transition-all ${
                    effectiveAction === 'ALLOW'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                      : 'bg-[#0A0E1A] hover:bg-emerald-500/10 text-emerald-400 border-slate-800'
                  }`}
                >
                  Allow Inbox
                </button>
                <button
                  onClick={() => handleOverride('WARNING')}
                  className={`px-2 py-1.5 rounded-lg border font-bold transition-all ${
                    effectiveAction === 'WARNING'
                      ? 'bg-amber-600 text-white border-amber-500 shadow-md'
                      : 'bg-[#0A0E1A] hover:bg-amber-500/10 text-amber-400 border-slate-800'
                  }`}
                >
                  Add Warning
                </button>
                <button
                  onClick={() => handleOverride('QUARANTINE')}
                  className={`px-2 py-1.5 rounded-lg border font-bold transition-all ${
                    effectiveAction === 'QUARANTINE'
                      ? 'bg-red-600 text-white border-red-500 shadow-md'
                      : 'bg-[#0A0E1A] hover:bg-red-500/10 text-red-400 border-slate-800'
                  }`}
                >
                  Quarantine
                </button>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-mono border-t border-slate-800 pt-2">
            Policy Rule: <span className="text-slate-200 font-bold">Standard Enterprise Zero-Trust</span>
          </div>
        </div>

      </div>

    </div>
  );
}
