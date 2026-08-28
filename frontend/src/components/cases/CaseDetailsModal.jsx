import React, { useState } from 'react';
import { X, ShieldAlert, CheckCircle2, Clock, User, AlertOctagon, Send, FileText, Download } from 'lucide-react';
import SeverityBadge from '../common/SeverityBadge';
import RelationshipGraph from '../graph/RelationshipGraph';

export default function CaseDetailsModal({ caseData, onClose, onGenerateReport }) {
  const [activeTab, setActiveTab] = useState('summary');
  const [notes, setNotes] = useState([
    { id: 1, author: 'Lead Threat Analyst', time: '27 Aug 2026 14:25 UTC', text: 'Initiated case containment. Sender IP 103.253.144.12 flagged on SOC firewalls.' },
    { id: 2, author: 'SOC Responder', time: '27 Aug 2026 14:30 UTC', text: 'Affected email address employee@company.com isolated for credentials reset.' }
  ]);
  const [newNote, setNewNote] = useState('');

  const caseId = caseData?.case_id || 'CASE-2026-00421';
  const status = caseData?.status || 'Investigating';
  const severity = caseData?.severity || 'Critical';
  const confidence = caseData?.confidence || '94.5%';
  const threatType = caseData?.threat_type || 'Credential Phishing';
  const affectedUser = caseData?.affected_user || 'employee@company.com';

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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#1E293B]/60">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white font-mono">{caseId}</h2>
                <SeverityBadge severity={severity} />
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono font-semibold">
                  STATUS: {status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Target User: <span className="text-slate-200 font-mono">{affectedUser}</span> | Type: <span className="text-slate-200 font-semibold">{threatType}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
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
          {['summary', 'graph', 'notes'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 border-b-2 font-semibold capitalize transition-colors ${
                activeTab === tab ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab === 'summary' ? 'Case Summary' : tab === 'graph' ? 'Relationship Graph' : 'Analyst Notes'}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {activeTab === 'summary' && (
            <div className="space-y-6">
              
              {/* Top Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  <p className="text-sm font-bold text-slate-200 mt-1 font-mono">27 Aug 2026 14:20 UTC</p>
                </div>
                <div className="bg-[#1E293B]/60 p-4 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">Affected Target</span>
                  <p className="text-sm font-bold text-cyan-300 mt-1 font-mono truncate">{affectedUser}</p>
                </div>
              </div>

              {/* Relationship Graph Preview */}
              <RelationshipGraph />

            </div>
          )}

          {activeTab === 'graph' && <RelationshipGraph />}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              
              {/* Notes Stream */}
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

              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-2 pt-2">
                <textarea
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add analyst investigation note..."
                  className="w-full bg-[#0A0E1A] border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-mono font-bold text-xs rounded-lg flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Note</span>
                </button>
              </form>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
