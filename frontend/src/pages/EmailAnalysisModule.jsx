import React, { useState } from 'react';
import { Mail, FileText, Upload, RefreshCw, AlertTriangle, ShieldCheck, Flame, CheckCircle2, FileCode, Layers, ShieldBan, Inbox, Lock } from 'lucide-react';
import HeaderAnalysisCard from '../components/HeaderAnalysisCard';
import SeverityBadge from '../components/common/SeverityBadge';
import PolicyPipelineCard from '../components/pipeline/PolicyPipelineCard';

const SAMPLE_PHISHING = `From: Security Alert <account-update@paypal-verify-alert.com>
To: employee@company.com
Subject: URGENT: Action Required - Verify Your Account Credentials Now
Date: Thu, 27 Aug 2026 14:22:10 +0000
Message-ID: <92847293847293847.alert@paypal-verify-alert.com>
Return-Path: <bounce@temp-mail.org>
Reply-To: phisher-collect@darknet-drop.com
Authentication-Results: spf=fail dkim=fail dmarc=fail
Received: from mail.darknet-drop.com ([103.253.144.12]) by mx.enterprise-corp.com; Thu, 27 Aug 2026 14:22:12 +0000

Dear Valued Customer,

Your account has been temporarily suspended due to unusual activity detected from IP 185.220.101.5.
Please verify your password immediately by clicking the secure login link below:

https://suspicious-login-example.com/verify-account

Failure to take immediate action within 24 hours will result in permanent account termination.
Attachment: Account_Verification_Form.exe
`;

export default function EmailAnalysisModule({ scanResult, onRunScan, scanning }) {
  const [inputTab, setInputTab] = useState('raw');
  const [rawText, setRawText] = useState(SAMPLE_PHISHING);

  const analysis = scanResult?.header_analysis || {};
  const ai = scanResult?.ai_threat_detection || {};
  const policyAction = ai.policy_action || (ai.threat_score >= 55 ? 'QUARANTINE' : ai.threat_score >= 30 ? 'WARNING' : 'ALLOW');

  return (
    <div className="space-y-6">
      
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white font-mono tracking-wide">Email Analysis & Triage</h1>
          <p className="text-xs text-slate-400">Analyze email headers, message content, attachments and execute automated Allow / Warning / Quarantine policy</p>
        </div>

        <button
          onClick={() => { setRawText(''); }}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono rounded-lg flex items-center space-x-1.5 transition-colors"
        >
          <span>New Analysis</span>
        </button>
      </div>

      {/* Primary Email Input Panel */}
      <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-5 shadow-xl space-y-4">
        
        {/* Tab Headers */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2 font-mono text-xs">
            {['raw', 'headers', 'body', 'attachments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setInputTab(tab)}
                className={`px-3 py-1.5 rounded-lg border font-semibold capitalize transition-all ${
                  inputTab === tab
                    ? 'bg-slate-800 text-cyan-400 border-slate-700'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
                }`}
              >
                {tab === 'raw' ? 'Raw Email' : tab}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => { setRawText(SAMPLE_PHISHING); onRunScan(SAMPLE_PHISHING); }}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-cyan-400 rounded-lg transition-colors"
            >
              Load Sample Phish
            </button>
          </div>
        </div>

        {/* Text Input Area */}
        <div className="space-y-3">
          <textarea
            rows={5}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste raw email headers or MIME payload here (from Gmail / Outlook)..."
            className="w-full bg-[#0A0E1A] border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors"
          />

          <div className="flex justify-between items-center">
            <span className="text-[11px] text-slate-500 font-mono">
              Interprets Gmail & Outlook formats, .eml, .msg or raw MIME headers
            </span>
            
            <button
              onClick={() => onRunScan(rawText)}
              disabled={scanning}
              className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 transition-all active:scale-95 uppercase tracking-wider"
            >
              <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
              <span>{scanning ? 'Running Triage Analysis...' : 'Analyze & Enforce Policy'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Automated Policy Action & Detection Pipeline */}
      {scanResult && (
        <PolicyPipelineCard scanResult={scanResult} />
      )}

      {/* Analysis Summary & Metrics Cards */}
      {scanResult && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Threat Score Card */}
          <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <span className="text-xs font-mono uppercase text-slate-400 font-semibold">Assigned Threat Score</span>
              <SeverityBadge severity={ai.threat_severity || 'Critical'} />
            </div>

            <div className="text-center py-2">
              <span className="text-4xl font-extrabold font-mono text-white tracking-tight">
                {(ai.threat_score || 94.5).toFixed(1)}
              </span>
              <span className="text-sm text-slate-400 font-mono"> / 100</span>
            </div>

            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-red-500 h-full transition-all duration-500"
                style={{ width: `${ai.threat_score || 94.5}%` }}
              />
            </div>
          </div>

          {/* Probability Breakdown Bar */}
          <div className="lg:col-span-2 bg-[#0F172A] p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-semibold">Threat Class Probabilities</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
              <div className="bg-[#1E293B]/60 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[11px] text-red-400 font-bold block">Phishing</span>
                <span className="text-lg font-bold text-white">{ai.phishing_probability || 94.5}%</span>
              </div>
              <div className="bg-[#1E293B]/60 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[11px] text-orange-400 font-bold block">Malware</span>
                <span className="text-lg font-bold text-white">{ai.malware_probability || 88.0}%</span>
              </div>
              <div className="bg-[#1E293B]/60 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[11px] text-amber-400 font-bold block">Spam</span>
                <span className="text-lg font-bold text-white">{ai.spam_probability || 4.5}%</span>
              </div>
              <div className="bg-[#1E293B]/60 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="text-[11px] text-emerald-400 font-bold block">Legitimate</span>
                <span className="text-lg font-bold text-white">{ai.legitimate_probability || 1.0}%</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Header Forensic Inspector Component */}
      {scanResult && <HeaderAnalysisCard headerData={analysis} />}

    </div>
  );
}
