import React, { useState } from 'react';
import { Database, Shield, FileText, Link2, FileCode, Clock, CheckCircle2, AlertTriangle, Download } from 'lucide-react';
import IOCTable from '../components/IOCTable';
import ForensicTimeline from '../components/ForensicTimeline';
import SeverityBadge from '../components/common/SeverityBadge';

export default function DigitalForensicsModule({ scanResult, onGenerateReport }) {
  const [evidenceTab, setEvidenceTab] = useState('iocs');

  const forensics = scanResult?.digital_forensics || {};
  const iocs = forensics.iocs || [
    { ioc_id: 'IOC-001', type: 'URL', value: 'suspicious-login-example.com', severity: 'Critical', source: 'Email Body', first_seen: '27 Aug 14:22 UTC', last_seen: '27 Aug 14:22 UTC', status: 'Active', description: 'Credential harvesting phishing link.' },
    { ioc_id: 'IOC-002', type: 'IP Address', value: '103.253.144.12', severity: 'Critical', source: 'Relay Hop #1', first_seen: '27 Aug 14:20 UTC', last_seen: '27 Aug 14:22 UTC', status: 'Active', description: 'Moscow origin relay server.' },
    { ioc_id: 'IOC-003', type: 'Domain', value: 'paypal-verify-alert.com', severity: 'High', source: 'Header From', first_seen: '27 Aug 14:20 UTC', last_seen: '27 Aug 14:22 UTC', status: 'Active', description: 'Spoofed brand domain.' },
    { ioc_id: 'IOC-004', type: 'Attachment', value: 'Account_Verification_Form.exe', severity: 'Critical', source: 'MIME Payload', first_seen: '27 Aug 14:22 UTC', last_seen: '27 Aug 14:22 UTC', status: 'Active', description: 'Executable payload attachment.' },
    { ioc_id: 'IOC-005', type: 'File Hash', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', severity: 'Critical', source: 'SHA-256 Digest', first_seen: '27 Aug 14:22 UTC', last_seen: '27 Aug 14:22 UTC', status: 'Active', description: 'SHA-256 fingerprint hash.' }
  ];

  const timeline = forensics.forensic_timeline || [
    { timestamp: '27 Aug 2026 14:20:00 UTC', event: 'Email Dispatched', category: 'HEADER_HOP', evidence: 'Sender: account-update@paypal-verify-alert.com', severity: 'Low' },
    { timestamp: '27 Aug 2026 14:20:05 UTC', event: 'Relay Hop Detected (#1)', category: 'GEO_INTEL', evidence: 'IP: 103.253.144.12 (Moscow, Russia)', severity: 'Critical' },
    { timestamp: '27 Aug 2026 14:22:10 UTC', event: 'SPF/DKIM/DMARC Verification Failed', category: 'AUTH_CHECK', evidence: 'SPF: FAIL | DKIM: FAIL | DMARC: FAIL', severity: 'High' },
    { timestamp: '27 Aug 2026 14:22:12 UTC', event: 'AI Threat Scan Completed', category: 'AI_SCAN', evidence: 'Threat Score: 94.5/100 | Phishing Prob: 94.5%', severity: 'Critical' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white font-mono tracking-wide">Digital Forensics</h1>
          <p className="text-xs text-slate-400">Extract, correlate and preserve technical evidence from analyzed email artifacts</p>
        </div>

        <button
          onClick={() => onGenerateReport && onGenerateReport(scanResult)}
          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold text-xs rounded-lg shadow-md flex items-center space-x-1.5 uppercase tracking-wider"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Generate Forensic Report</span>
        </button>
      </div>

      {/* Tab Selector */}
      <div className="flex items-center space-x-2 border-b border-slate-800 font-mono text-xs pb-3">
        {['iocs', 'evidence', 'timeline'].map((tab) => (
          <button
            key={tab}
            onClick={() => setEvidenceTab(tab)}
            className={`px-4 py-2 rounded-lg border font-semibold uppercase transition-all ${
              evidenceTab === tab ? 'bg-slate-800 text-cyan-400 border-slate-700' : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            {tab === 'iocs' ? 'Indicators of Compromise' : tab === 'evidence' ? 'Technical Evidence Cards' : 'Chronological Timeline'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {evidenceTab === 'iocs' && <IOCTable iocs={iocs} />}

      {evidenceTab === 'evidence' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Header Evidence */}
          <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-bold text-white">Header Security Evidence</span>
              <SeverityBadge severity="Critical" size="small" />
            </div>
            <p><span className="text-slate-400">SPF Validation:</span> <span className="text-red-400 font-bold">FAIL</span></p>
            <p><span className="text-slate-400">DKIM Signature:</span> <span className="text-red-400 font-bold">FAIL</span></p>
            <p><span className="text-slate-400">DMARC Policy:</span> <span className="text-red-400 font-bold">FAIL</span></p>
            <p><span className="text-slate-400">Return-Path:</span> bounce@temp-mail.org</p>
            <p><span className="text-slate-400">Reply-To:</span> phisher-collect@darknet-drop.com</p>
          </div>

          {/* Attachment Evidence */}
          <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-bold text-white">Attachment Evidence</span>
              <SeverityBadge severity="Critical" size="small" />
            </div>
            <p><span className="text-slate-400">Filename:</span> Account_Verification_Form.exe</p>
            <p><span className="text-slate-400">File Type:</span> Windows PE Executable</p>
            <p><span className="text-slate-400">File Size:</span> 1.42 MB</p>
            <p><span className="text-slate-400">MIME Type:</span> application/x-msdownload</p>
            <p className="truncate"><span className="text-slate-400">SHA-256:</span> e3b0c44298fc1c14...</p>
          </div>

          {/* URL Evidence */}
          <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <span className="font-bold text-white">Embedded URL Evidence</span>
              <SeverityBadge severity="Critical" size="small" />
            </div>
            <p className="truncate"><span className="text-slate-400">URL Target:</span> suspicious-login-example.com</p>
            <p><span className="text-slate-400">Domain Reg:</span> Created 2 days ago</p>
            <p><span className="text-slate-400">Redirect Chain:</span> 1 Redirect Hop</p>
            <p><span className="text-slate-400">Reputation:</span> Phishing / Malicious</p>
            <p><span className="text-slate-400">SSL Certificate:</span> Let's Encrypt (Untrusted)</p>
          </div>

        </div>
      )}

      {evidenceTab === 'timeline' && <ForensicTimeline timeline={timeline} />}

    </div>
  );
}
