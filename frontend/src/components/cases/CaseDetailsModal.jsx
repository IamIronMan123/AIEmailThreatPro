import React, { useState } from 'react';
import {
  X, ShieldAlert, CheckCircle2, Clock, User, AlertOctagon, Send,
  FileText, Download, ShieldBan, Inbox, MessageSquare, AlertTriangle,
  Lock, RefreshCw, Sparkles, Check, ChevronRight
} from 'lucide-react';
import SeverityBadge from '../common/SeverityBadge';
import RelationshipGraph from '../graph/RelationshipGraph';

export default function CaseDetailsModal({ caseData, onClose, onGenerateReport }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [caseStatus, setCaseStatus] = useState(caseData?.status || 'Investigating');
  const [policyAction, setPolicyAction] = useState(caseData?.policy_action || 'QUARANTINED');
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState(
    'Thank you for reporting this email. Our investigation confirmed high-risk credential phishing. The sender domain and origin IP have been blocked across our perimeter.'
  );

  const [notes, setNotes] = useState([
    { id: 1, author: 'Lead Threat Analyst', time: '28 Aug 2026 13:18 UTC', text: 'Auto-quarantined on Gmail Gateway. Threat score 94.5/100. Sender IP 103.253.144.12 located in Moscow, Russia.' },
    { id: 2, author: 'SOC Responder', time: '28 Aug 2026 13:25 UTC', text: 'Affected target employee@company.com alerted. Malicious attachment Account_Verification_Form.exe fingerprint SHA-256 logged.' }
  ]);
  const [newNote, setNewNote] = useState('');

  // Complete Investigation Timeline / History
  const [timeline, setTimeline] = useState([
    { id: 'T-1', time: '28 Aug 2026 13:15:00 UTC', event: 'Inbound Email Dispatched', source: 'Gmail Gateway Forwarding Rule', category: 'INGESTION', detail: 'Received from account-update@paypal-verify-alert.com targeting employee@company.com', status: 'Complete' },
    { id: 'T-2', time: '28 Aug 2026 13:15:02 UTC', event: 'Detection Engine Analysis', source: 'ZETP Multi-Vector Scanner', category: 'DETECTION', detail: 'Identified SPF/DKIM/DMARC Failure, Phishing URL, and Executable Attachment', status: 'Complete' },
    { id: 'T-3', time: '28 Aug 2026 13:15:04 UTC', event: 'Risk Scoring Evaluated', source: 'Neural Threat Engine', category: 'SCORING', detail: 'Assigned Threat Score: 94.5/100 (Critical Severity Tier)', status: 'Complete' },
    { id: 'T-4', time: '28 Aug 2026 13:15:05 UTC', event: 'Automated Policy Quarantine Enforced', source: 'Zero-Trust Policy Gateway', category: 'POLICY_ACTION', detail: 'Email blocked from user inbox and moved to Quarantine Vault', status: 'Complete' },
    { id: 'T-5', time: '28 Aug 2026 13:18:00 UTC', event: 'SOC Case Created', source: 'Automated Triage System', category: 'TRIAGE', detail: 'Case CASE-2026-00421 opened for analyst review and containment', status: 'Complete' }
  ]);

  const caseId = caseData?.case_id || 'CASE-2026-00421';
  const severity = caseData?.severity || 'Critical';
  const confidence = caseData?.confidence || '94.5%';
  const threatType = caseData?.threat_type || 'Credential Phishing';
  const affectedUser = caseData?.recipient_email || caseData?.affected_user || 'employee@company.com';
  const subject = caseData?.subject || 'URGENT: Action Required - Verify Your Account Credentials Now';

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([...notes, {
      id: Date.now(),
      author: 'Security Analyst',
      time: new Date().toUTCString(),
      text: newNote.trim()
    }]);
    setNewNote('');
  };

  const handleResolveCase = () => {
    setCaseStatus('Resolved');
    setTimeline(prev => [...prev, {
      id: `T-${prev.length + 1}`,
      time: new Date().toUTCString(),
      event: 'Case Resolved & Closed',
      source: 'Security Analyst',
      category: 'RESOLUTION',
      detail: 'Investigation completed. Threat neutralized and IOCs distributed.',
      status: 'Complete'
    }]);
  };

  const handleContainDomain = () => {
    setCaseStatus('Contained');
    setTimeline(prev => [...prev, {
      id: `T-${prev.length + 1}`,
      time: new Date().toUTCString(),
      event: 'Sender Domain Contained & Blocked',
      source: 'Edge Firewall Connector',
      category: 'CONTAINMENT',
      detail: 'Domain paypal-verify-alert.com and IP 103.253.144.12 blocked organization-wide.',
      status: 'Complete'
    }]);
  };

  const handleReleaseQuarantine = () => {
    setPolicyAction('ALLOWED');
    setTimeline(prev => [...prev, {
      id: `T-${prev.length + 1}`,
      time: new Date().toUTCString(),
      event: 'Released from Quarantine',
      source: 'SOC Analyst Override',
      category: 'OVERRIDE',
      detail: 'Email released from Quarantine Vault to employee inbox.',
      status: 'Complete'
    }]);
  };

  const handleSendFeedback = (e) => {
    e.preventDefault();
    setFeedbackSent(true);
    setTimeline(prev => [...prev, {
      id: `T-${prev.length + 1}`,
      time: new Date().toUTCString(),
      event: 'Feedback Dispatched to Employee',
      source: 'SOC Notification Loop',
      category: 'FEEDBACK',
      detail: `Sent resolution feedback to ${affectedUser}`,
      status: 'Complete'
    }]);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1E293B]/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white font-mono">{caseId}</h2>
                <SeverityBadge severity={severity} />
                <span className={`text-xs px-2 py-0.5 rounded font-mono font-semibold ${
                  caseStatus === 'Resolved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : caseStatus === 'Contained' ? 'bg-blue-950 text-blue-400 border border-blue-800' : 'bg-cyan-950 text-cyan-400 border border-cyan-800'
                }`}>
                  STATUS: {caseStatus.toUpperCase()}
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800 font-mono font-semibold">
                  POLICY: {policyAction}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Target: <span className="text-slate-200 font-mono">{affectedUser}</span> | Type: <span className="text-slate-200 font-semibold">{threatType}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onGenerateReport && onGenerateReport(caseData)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono rounded-lg flex items-center space-x-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Report</span>
            </button>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-800 flex items-center space-x-4 bg-[#0F172A] font-mono text-xs">
          {['summary', 'timeline', 'graph', 'feedback', 'notes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 border-b-2 font-semibold capitalize transition-colors ${
                activeTab === tab ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'summary' ? 'Case Summary' : tab === 'timeline' ? `Timeline & History (${timeline.length})` : tab === 'graph' ? 'Relationship Graph' : tab === 'feedback' ? 'Employee Feedback' : 'Analyst Notes'}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: SUMMARY */}
          {activeTab === 'summary' && (
            <div className="space-y-6">
              
              {/* Summary Metadata Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#1E293B]/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Threat Classification</span>
                  <p className="text-sm font-bold text-white mt-1">{threatType}</p>
                </div>
                <div className="bg-[#1E293B]/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Model Confidence</span>
                  <p className="text-sm font-bold text-cyan-400 mt-1 font-mono">{confidence}</p>
                </div>
                <div className="bg-[#1E293B]/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">First Observed</span>
                  <p className="text-sm font-bold text-slate-200 mt-1 font-mono">28 Aug 2026 13:15 UTC</p>
                </div>
                <div className="bg-[#1E293B]/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Target Recipient</span>
                  <p className="text-sm font-bold text-cyan-300 mt-1 font-mono truncate">{affectedUser}</p>
                </div>
              </div>

              {/* Intercepted Email Details Banner */}
              <div className="bg-[#1E293B]/40 p-4 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">Intercepted Email Subject & Payload:</span>
                <p className="text-sm font-bold text-white font-mono">{subject}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-slate-300 pt-1">
                  <div>Sender: <span className="text-cyan-400">account-update@paypal-verify-alert.com</span></div>
                  <div>Origin IP: <span className="text-red-400">103.253.144.12 (Moscow, Russia)</span></div>
                  <div>Ingestion Gateway: <span className="text-white">Gmail Workspace (Auto-Forwarded)</span></div>
                  <div>Quarantine Status: <span className="text-red-400 font-bold">{policyAction}</span></div>
                </div>
              </div>

              {/* Relationship Graph Preview */}
              <RelationshipGraph />

            </div>
          )}

          {/* TAB 2: TIMELINE & HISTORY */}
          {activeTab === 'timeline' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center">
                    <Clock className="w-4 h-4 text-cyan-400 mr-2" />
                    Complete Threat Audit Trail & Chronological History
                  </h3>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    End-to-end lifecycle from Forwarding Ingestion ➔ Detection ➔ Scoring ➔ Quarantine ➔ SOC Action
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {timeline.map((item, idx) => (
                  <div key={item.id} className="bg-[#1E293B]/60 p-4 rounded-xl border border-slate-800 flex items-start space-x-3">
                    <div className="h-6 w-6 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="font-bold text-white text-xs">{item.event}</span>
                        <span className="text-slate-500 text-[11px]">{item.time}</span>
                      </div>
                      <p className="text-slate-300 font-sans text-xs">{item.detail}</p>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 pt-1">
                        <span>Source: <strong className="text-cyan-400">{item.source}</strong></span>
                        <span>•</span>
                        <span className="text-emerald-400">{item.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: RELATIONSHIP GRAPH */}
          {activeTab === 'graph' && <RelationshipGraph />}

          {/* TAB 4: EMPLOYEE FEEDBACK LOOP */}
          {activeTab === 'feedback' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center">
                  <MessageSquare className="w-4 h-4 text-cyan-400 mr-2" />
                  Employee Feedback Loop & Resolution Notice
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Send official SOC response and security advice to recipient: <strong className="text-cyan-400">{affectedUser}</strong>
                </p>
              </div>

              {feedbackSent ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-400">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold">Feedback Sent to Employee!</span>
                  </div>
                  <p className="text-slate-300 font-sans text-xs">
                    The employee's feedback inbox in ZETP has been updated with your message and resolution verdict.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSendFeedback} className="space-y-3">
                  <label className="text-slate-400 text-xs font-sans block">
                    Customize Feedback Message for Employee:
                  </label>
                  <textarea
                    rows={4}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="w-full bg-[#0A0E1A] border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500 font-sans"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg shadow-md flex items-center space-x-1.5 uppercase tracking-wider text-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Feedback to Employee</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 5: NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {notes.map((n) => (
                  <div key={n.id} className="bg-[#1E293B]/60 p-4 rounded-xl border border-slate-800 space-y-1 font-mono text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span className="font-bold text-cyan-400">{n.author}</span>
                      <span>{n.time}</span>
                    </div>
                    <p className="text-slate-200 pt-1 font-sans text-sm">{n.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddNote} className="space-y-2 pt-2">
                <textarea
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record SOC analyst triage notes, forensic observations..."
                  className="w-full bg-[#0A0E1A] border border-slate-800 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs rounded-lg shadow flex items-center space-x-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Append Note</span>
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

        {/* Persistent SOC Action & Resolution Footer Bar */}
        <div className="px-6 py-4 bg-[#1E293B]/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
          
          <div className="flex items-center space-x-2 text-slate-400">
            <span className="font-semibold text-slate-300">SOC Actions:</span>
            <span>Current Status: <strong className="text-cyan-400">{caseStatus}</strong></span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            
            {/* Release from Quarantine button */}
            {policyAction === 'QUARANTINED' && (
              <button
                onClick={handleReleaseQuarantine}
                className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg font-bold flex items-center space-x-1 transition-colors"
                title="Release false positive into inbox"
              >
                <Inbox className="w-3.5 h-3.5" />
                <span>Release to Inbox</span>
              </button>
            )}

            {/* Contain & Block Domain button */}
            <button
              onClick={handleContainDomain}
              className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg font-bold flex items-center space-x-1 transition-colors"
              title="Block sender domain on perimeter"
            >
              <ShieldBan className="w-3.5 h-3.5" />
              <span>Block Sender Domain</span>
            </button>

            {/* Resolve Case button */}
            {caseStatus !== 'Resolved' ? (
              <button
                onClick={handleResolveCase}
                className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg font-bold shadow-md flex items-center space-x-1.5 transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Mark as Resolved</span>
              </button>
            ) : (
              <span className="px-3 py-1.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-lg font-bold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Case Resolved</span>
              </span>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
