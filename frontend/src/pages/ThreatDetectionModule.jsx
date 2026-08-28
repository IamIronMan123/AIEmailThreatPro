import React from 'react';
import { Cpu, ShieldAlert, CheckCircle2, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';
import SeverityBadge from '../components/common/SeverityBadge';

export default function ThreatDetectionModule({ scanResult }) {
  const aiData = scanResult?.ai_threat_detection || {};
  const classifications = aiData.classifications || [
    { category: 'Phishing', probability: 94.5, confidence: 'High', risk_level: 'Critical', description: 'Credential harvesting lure targeting corporate accounts.' },
    { category: 'Malware', probability: 88.0, confidence: 'High', risk_level: 'High', description: 'Malicious payload attachment or execution script.' },
    { category: 'Credential Theft', probability: 92.5, confidence: 'High', risk_level: 'Critical', description: 'Spoofed portal capturing authentication tokens.' },
    { category: 'Business Email Compromise', probability: 45.0, confidence: 'Medium', risk_level: 'Medium', description: 'Executive or vendor domain impersonation.' },
    { category: 'Spoofing', probability: 96.0, confidence: 'High', risk_level: 'High', description: 'Falsified sender domain headers (SPF/DMARC fail).' },
    { category: 'Spam', probability: 4.5, confidence: 'Medium', risk_level: 'Low', description: 'Bulk unsolicited marketing mail.' },
    { category: 'Suspicious Attachment', probability: 90.0, confidence: 'High', risk_level: 'Critical', description: 'Executable payload filename extension.' },
    { category: 'Legitimate', probability: 1.0, confidence: 'Low', risk_level: 'Informational', description: 'Normal enterprise communication.' }
  ];

  const findings = aiData.explainable_findings || [
    { id: '1', title: 'Suspicious Login URL Detected', description: 'Embedded hyperlink targets untrusted domain containing verification lure.', category: 'Payload Anomaly', severity: 'Critical' },
    { id: '2', title: 'Sender Domain & Org Discrepancy', description: 'Header From domain differs from known legitimate enterprise infrastructure.', category: 'Identity Anomaly', severity: 'High' },
    { id: '3', title: 'SPF Validation Failed', description: 'Origin IP not authorized under published SPF DNS record.', category: 'Authentication Failure', severity: 'High' },
    { id: '4', title: 'DKIM Validation Failed', description: 'Cryptographic signature verification failed.', category: 'Authentication Failure', severity: 'High' },
    { id: '5', title: 'DMARC Validation Failed', description: 'Domain alignment check failed under DMARC policy.', category: 'Authentication Failure', severity: 'Critical' },
    { id: '6', title: 'Urgency-Based Social Engineering', description: 'Email body uses coercive language (e.g. immediate action required).', category: 'Social Engineering', severity: 'Medium' },
    { id: '7', title: 'Executable Attachment Detected', description: 'Attachment extension .exe detected.', category: 'Malware Risk', severity: 'Critical' },
    { id: '8', title: 'Reply-To Domain Mismatch', description: 'Reply-To domain differs from Header From address.', category: 'Identity Anomaly', severity: 'High' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white font-mono tracking-wide">AI Threat Detection</h1>
        <p className="text-xs text-slate-400">Machine-assisted analysis of email content, sender identity, and technical detection signals</p>
      </div>

      {/* Threat Classification Cards Grid */}
      <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-5 shadow-xl space-y-4">
        
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-100 font-mono flex items-center">
            <Cpu className="w-4 h-4 text-cyan-400 mr-2" />
            Machine Learning Classification Matrix
          </h2>
          <span className="text-xs font-mono text-slate-400">Model: ZETP-SecBERT-v2</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {classifications.map((item, idx) => (
            <div key={idx} className="bg-[#1E293B]/60 p-4 rounded-xl border border-slate-800 space-y-2 font-mono">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white truncate">{item.category}</span>
                <SeverityBadge severity={item.risk_level} size="small" />
              </div>

              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-extrabold text-cyan-400">{item.probability}%</span>
                <span className="text-[10px] text-slate-400">Probability</span>
              </div>

              <div className="flex justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                <span>Confidence:</span>
                <span className="text-slate-200 font-bold">{item.confidence}</span>
              </div>

              <p className="text-[11px] text-slate-400 font-sans line-clamp-2">{item.description}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Explainable Findings Panel ("Why this email was flagged") */}
      <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-5 shadow-xl space-y-4">
        
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-slate-100 font-mono flex items-center">
            <ShieldAlert className="w-4 h-4 text-cyan-400 mr-2" />
            Explainable Findings — Why This Email Was Flagged ({findings.length} Detection Signals)
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Transparent security evidence backing the machine learning classification
          </p>
        </div>

        <div className="space-y-2.5">
          {findings.map((f, i) => (
            <div key={i} className="bg-[#1E293B]/60 p-3.5 rounded-xl border border-slate-800 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-white font-mono">{f.title}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.2 rounded border border-slate-700 font-mono">
                    {f.category}
                  </span>
                </div>
                <p className="text-xs text-slate-300 font-sans">{f.description}</p>
              </div>

              <SeverityBadge severity={f.severity} size="small" />
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
