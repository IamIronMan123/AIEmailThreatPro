import React, { useState } from 'react';
import {
  ShieldAlert, AlertTriangle, ShieldCheck, Flag, CheckCircle2, XCircle,
  Clock, MessageSquare, Send, Inbox, ArrowRight, Bell, Sparkles, FileText
} from 'lucide-react';
import SeverityBadge from '../components/common/SeverityBadge';

export default function EmployeeView({ scanResult }) {
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('INC-2026-8842');
  const [reportNotes, setReportNotes] = useState('');
  const [activeTab, setActiveTab] = useState('advisory');

  const threatSeverity = scanResult?.ai_threat_detection?.threat_severity || 'Critical';
  const threatScore = scanResult?.ai_threat_detection?.threat_score || 94.5;
  const isDangerous = threatSeverity === 'Critical' || threatSeverity === 'High';

  // Employee Feedback & Report History
  const [feedbackHistory, setFeedbackHistory] = useState([
    {
      ticket_id: 'INC-2026-8840',
      subject: 'Fake DHL Package Delivery Notice',
      reported_at: '28 Aug 2026 11:15 UTC',
      status: 'Resolved & Quarantined',
      verdict: 'CONFIRMED PHISHING',
      soc_analyst: 'Alex Rivera (Tier 2 SOC)',
      soc_feedback: 'Thank you for reporting this email! Our detection engine analyzed the payload and confirmed malicious credential harvesting links. The sender domain dhl-tracking-express.net has been permanently blocked across company firewalls.',
      reward_points: '+50 Security Champion Points'
    },
    {
      ticket_id: 'INC-2026-8839',
      subject: 'IT Support: Mandatory Password Reset Required',
      reported_at: '27 Aug 2026 16:30 UTC',
      status: 'Resolved & Blocked',
      verdict: 'CONFIRMED CREDENTIAL THEFT',
      soc_analyst: 'Sarah Chen (SOC Analyst)',
      soc_feedback: 'Great catch! This was an active credential theft attempt impersonating the IT Service Desk. All similar emails across the company were auto-quarantined.',
      reward_points: '+50 Security Champion Points'
    }
  ]);

  const handleReportIncident = (e) => {
    e.preventDefault();
    const newId = `INC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(newId);
    setReportSubmitted(true);

    const newFeedbackItem = {
      ticket_id: newId,
      subject: scanResult?.header_analysis?.subject || 'URGENT: Action Required - Verify Your Account Credentials',
      reported_at: new Date().toUTCString(),
      status: 'SOC Triage In-Progress',
      verdict: 'ANALYSIS UNDERWAY',
      soc_analyst: 'Security Operations Center',
      soc_feedback: 'Your report was received by the ZETP Gateway. Threat score 94.5/100 detected. The email has been quarantined from your inbox. An analyst is reviewing containment actions.',
      reward_points: '+50 Security Champion Points'
    };

    setFeedbackHistory([newFeedbackItem, ...feedbackHistory]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-2 font-sans">
      
      {/* Top Banner */}
      <div className={`p-6 rounded-2xl border shadow-2xl space-y-4 ${
        isDangerous
          ? 'bg-gradient-to-r from-red-950/90 via-red-900/60 to-slate-900 border-red-500/50 text-red-200'
          : 'bg-gradient-to-r from-emerald-950/90 via-emerald-900/60 to-slate-900 border-emerald-500/50 text-emerald-200'
      }`}>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className={`p-3.5 rounded-2xl border shadow-lg ${
              isDangerous ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
            }`}>
              {isDangerous ? <ShieldAlert className="w-10 h-10 animate-pulse" /> : <ShieldCheck className="w-10 h-10" />}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono uppercase font-bold opacity-80">ZETP Email Security Protection</span>
                <SeverityBadge severity={threatSeverity} />
              </div>
              <h2 className="text-xl font-bold tracking-tight mt-1">
                {isDangerous ? 'This email has been quarantined and blocked.' : 'This email passed enterprise safety checks.'}
              </h2>
              <p className="text-xs font-mono opacity-90 mt-0.5">
                Calculated Risk Score: <span className="font-bold">{threatScore.toFixed(1)} / 100</span> (Policy: <strong>QUARANTINE</strong>)
              </p>
            </div>
          </div>

          <div className="bg-black/30 p-3 rounded-xl border border-white/10 font-mono text-xs text-right">
            <span className="text-slate-400 text-[10px] block">Mailbox Protected:</span>
            <span className="text-white font-bold">employee@company.com</span>
          </div>
        </div>

      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab('advisory')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'advisory' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Security Advisory & Threat Details
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center space-x-1.5 ${
            activeTab === 'feedback' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Employee Feedback Inbox ({feedbackHistory.length})</span>
        </button>
      </div>

      {activeTab === 'advisory' && (
        <div className="space-y-6">
          
          {/* Why Was This Email Flagged? */}
          <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-white font-mono flex items-center">
              <AlertTriangle className="w-4 h-4 text-cyan-400 mr-2" />
              Automated Detection Findings (Gmail & Outlook Gateway)
            </h3>

            <ul className="space-y-2 font-sans">
              <li className="flex items-start text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mr-2 shrink-0 mt-0.5" />
                <span><strong>Fake Sender Information:</strong> Sender claimed to be PayPal Alert but sent from unauthorized origin IP (SPF/DMARC failed).</span>
              </li>
              <li className="flex items-start text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mr-2 shrink-0 mt-0.5" />
                <span><strong>Phishing Hyperlink:</strong> Contains link to <code>suspicious-login-example.com</code> designed to steal credentials.</span>
              </li>
              <li className="flex items-start text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mr-2 shrink-0 mt-0.5" />
                <span><strong>Suspicious Urgency Message:</strong> Demands verification within 24 hours to prevent suspension (psychological trigger).</span>
              </li>
              <li className="flex items-start text-slate-300">
                <XCircle className="w-4 h-4 text-red-400 mr-2 shrink-0 mt-0.5" />
                <span><strong>Malicious Attachment:</strong> Executable payload <code>Account_Verification_Form.exe</code> attached.</span>
              </li>
            </ul>
          </div>

          {/* Recommended Actions & Incident Reporting */}
          <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white font-mono flex items-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2" />
              Employee Action & Incident Report Loop
            </h3>

            {reportSubmitted ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-3 font-mono">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-bold text-sm">Incident Report #{ticketId} Submitted Successfully!</span>
                </div>
                <p className="text-slate-300 text-xs font-sans">
                  The SOC team has received your incident report. The automated gateway has confirmed quarantine of this threat. A security analyst feedback update has been added to your feedback inbox.
                </p>

                {/* 4-Step Live Feedback Tracker */}
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Live Feedback Progress Tracker:</span>
                  <div className="grid grid-cols-4 gap-2 mt-2 text-[10px] text-center font-mono">
                    <div className="bg-emerald-950 p-2 rounded border border-emerald-800 text-emerald-400 font-bold">
                      1. Report Received
                    </div>
                    <div className="bg-emerald-950 p-2 rounded border border-emerald-800 text-emerald-400 font-bold">
                      2. Gateway Scanned
                    </div>
                    <div className="bg-cyan-950 p-2 rounded border border-cyan-800 text-cyan-400 font-bold animate-pulse">
                      3. SOC Triage
                    </div>
                    <div className="bg-slate-900 p-2 rounded border border-slate-800 text-slate-500">
                      4. Feedback Dispatched
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleReportIncident} className="space-y-3">
                <p className="text-slate-400 font-sans">
                  If you received or noticed anything suspicious about this message, report it directly to the SOC investigation queue to initiate employee feedback tracking:
                </p>

                <textarea
                  rows={2}
                  value={reportNotes}
                  onChange={(e) => setReportNotes(e.target.value)}
                  placeholder="Optional: Add context or notes for the SOC analyst (e.g. 'Received this at 10 AM, did not click any link')..."
                  className="w-full bg-[#1E293B] border border-slate-700/80 rounded-xl p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono text-xs"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 transition-transform active:scale-95 uppercase tracking-wider"
                  >
                    <Flag className="w-4 h-4" />
                    <span>Report Threat to SOC & Get Ticket</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>
      )}

      {activeTab === 'feedback' && (
        <div className="space-y-4">
          
          <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 space-y-2">
            <h3 className="text-sm font-bold text-white font-mono flex items-center">
              <MessageSquare className="w-4 h-4 text-cyan-400 mr-2" />
              Employee Feedback & Incident Resolution History
            </h3>
            <p className="text-xs text-slate-400 font-sans">
              Feedback from the SOC team confirming investigation outcomes for emails you reported.
            </p>
          </div>

          <div className="space-y-4">
            {feedbackHistory.map((item, idx) => (
              <div key={idx} className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 shadow-xl space-y-3 font-mono text-xs">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-cyan-400 text-sm">{item.ticket_id}</span>
                    <span className="bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-bold text-[10px]">
                      {item.verdict}
                    </span>
                  </div>
                  <span className="text-slate-500 text-[11px]">{item.reported_at}</span>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400">Subject:</span>
                  <p className="text-white font-bold font-sans text-sm mt-0.5">{item.subject}</p>
                </div>

                {/* SOC Feedback Box */}
                <div className="bg-[#1E293B]/80 p-3.5 rounded-xl border border-slate-700/80 space-y-1.5 font-sans">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-cyan-400 font-bold flex items-center">
                      <Sparkles className="w-3.5 h-3.5 mr-1" />
                      SOC Analyst Feedback ({item.soc_analyst}):
                    </span>
                    <span className="text-emerald-400 font-bold">{item.reward_points}</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">{item.soc_feedback}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Status: <strong className="text-emerald-400">{item.status}</strong></span>
                  <span className="text-cyan-400 font-semibold">Protected by ZETP</span>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
