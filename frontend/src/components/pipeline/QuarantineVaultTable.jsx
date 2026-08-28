import React, { useState } from 'react';
import { ShieldBan, Inbox, AlertTriangle, CheckCircle2, Lock, ArrowUpRight, Search, Filter } from 'lucide-react';
import SeverityBadge from '../common/SeverityBadge';

export default function QuarantineVaultTable({ onOpenCase }) {
  const [filterAction, setFilterAction] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const [triageItems, setTriageItems] = useState([
    {
      id: 'TR-1042',
      subject: 'URGENT: Action Required - Verify Your Account Credentials Now',
      sender: 'account-update@paypal-verify-alert.com',
      source: 'Gmail Gateway',
      score: 94.5,
      severity: 'Critical',
      action: 'QUARANTINED',
      actionBadge: 'bg-red-500/10 text-red-400 border-red-500/30',
      reason: 'Fake sender spoofing + Phishing link + Executable attachment',
      time: '28 Aug 13:15 UTC',
      status: 'Blocked from Inbox'
    },
    {
      id: 'TR-1041',
      subject: 'Invoice #9401 Payment Confirmation PDF',
      sender: 'billing@vendor-update-service.com',
      source: 'Outlook Exchange',
      score: 48.0,
      severity: 'Medium',
      action: 'WARNED',
      actionBadge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      reason: 'Suspicious payment urgency words + Reply-To mismatch',
      time: '28 Aug 12:40 UTC',
      status: 'Warning Tag Injected'
    },
    {
      id: 'TR-1040',
      subject: 'CEO Wire Transfer Urgent Authorization',
      sender: 'ceo-office@exec-directmail.com',
      source: 'Gmail Gateway',
      score: 86.0,
      severity: 'High',
      action: 'QUARANTINED',
      actionBadge: 'bg-red-500/10 text-red-400 border-red-500/30',
      reason: 'BEC executive impersonation + Raw IP URL',
      time: '28 Aug 11:20 UTC',
      status: 'Blocked from Inbox'
    },
    {
      id: 'TR-1039',
      subject: 'Quarterly Engineering Roadmap & Sprint Retrospective Summary',
      sender: 'pmo@enterprise-corp.com',
      source: 'Outlook Exchange',
      score: 4.2,
      severity: 'Low',
      action: 'ALLOWED',
      actionBadge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      reason: 'SPF/DKIM/DMARC passed. Domain verified clean.',
      time: '28 Aug 10:05 UTC',
      status: 'Delivered to Inbox'
    }
  ]);

  const handleActionChange = (id, newAction) => {
    setTriageItems(items => items.map(item => {
      if (item.id === id) {
        let badge = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
        let status = 'Delivered to Inbox';
        if (newAction === 'QUARANTINED') {
          badge = 'bg-red-500/10 text-red-400 border-red-500/30';
          status = 'Blocked from Inbox';
        } else if (newAction === 'WARNED') {
          badge = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
          status = 'Warning Tag Injected';
        }
        return { ...item, action: newAction, actionBadge: badge, status };
      }
      return item;
    }));
  };

  const filtered = triageItems.filter(item => {
    const matchesFilter = filterAction === 'ALL' || item.action === filterAction;
    const matchesSearch = item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.sender.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-5 shadow-xl space-y-4">
      
      {/* Title Bar & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-100 font-mono flex items-center">
            <Lock className="w-4 h-4 text-cyan-400 mr-2" />
            Email Triage & Quarantine Vault Action Log
          </h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Real-time automated policy decisions enforced on Gmail and Outlook gateways
          </p>
        </div>

        {/* Action Filters */}
        <div className="flex items-center space-x-1 bg-[#1E293B] p-1 rounded-lg border border-slate-700 font-mono text-xs">
          {['ALL', 'QUARANTINED', 'WARNED', 'ALLOWED'].map((action) => (
            <button
              key={action}
              onClick={() => setFilterAction(action)}
              className={`px-2.5 py-1 rounded font-bold transition-all ${
                filterAction === action
                  ? action === 'QUARANTINED' ? 'bg-red-600 text-white' : action === 'WARNED' ? 'bg-amber-600 text-white' : action === 'ALLOWED' ? 'bg-emerald-600 text-white' : 'bg-cyan-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {action === 'ALL' ? 'All Mails' : action}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="w-full text-left font-mono text-xs">
          <thead>
            <tr className="bg-[#1E293B] text-slate-400 uppercase text-[11px] border-b border-slate-800">
              <th className="p-3">Email Details</th>
              <th className="p-3">Source Gateway</th>
              <th className="p-3">Risk Score</th>
              <th className="p-3">Policy Action</th>
              <th className="p-3">Detection Reason</th>
              <th className="p-3 text-right">Triage Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-[#0A0E1A]">
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-slate-900/80 transition-colors">
                
                {/* Details */}
                <td className="p-3 max-w-xs">
                  <p className="text-white font-semibold truncate" title={item.subject}>{item.subject}</p>
                  <p className="text-cyan-400 text-[11px] truncate">{item.sender}</p>
                  <span className="text-[10px] text-slate-500">{item.time}</span>
                </td>

                {/* Gateway */}
                <td className="p-3">
                  <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-[11px] text-slate-300 font-semibold">
                    {item.source}
                  </span>
                </td>

                {/* Risk Score */}
                <td className="p-3">
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-white">{item.score.toFixed(1)}/100</span>
                    <SeverityBadge severity={item.severity} size="small" />
                  </div>
                </td>

                {/* Action Badge */}
                <td className="p-3">
                  <div className="space-y-1">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded border text-[11px] font-bold uppercase tracking-wider ${item.actionBadge}`}>
                      {item.action === 'QUARANTINED' && <ShieldBan className="w-3.5 h-3.5 mr-1" />}
                      {item.action === 'WARNED' && <AlertTriangle className="w-3.5 h-3.5 mr-1" />}
                      {item.action === 'ALLOWED' && <Inbox className="w-3.5 h-3.5 mr-1" />}
                      {item.action}
                    </span>
                    <p className="text-[10px] text-slate-400">{item.status}</p>
                  </div>
                </td>

                {/* Detection Reason */}
                <td className="p-3 max-w-xs text-slate-300 text-xs font-sans">
                  {item.reason}
                </td>

                {/* Action Override Buttons */}
                <td className="p-3 text-right">
                  <div className="flex items-center justify-end space-x-1.5">
                    {item.action === 'QUARANTINED' ? (
                      <button
                        onClick={() => handleActionChange(item.id, 'ALLOWED')}
                        className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[11px] font-semibold"
                        title="Release to Inbox"
                      >
                        Release
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActionChange(item.id, 'QUARANTINED')}
                        className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded text-[11px] font-semibold"
                        title="Block & Quarantine"
                      >
                        Quarantine
                      </button>
                    )}
                    <button
                      onClick={() => onOpenCase && onOpenCase({ case_id: 'CASE-2026-00421', subject: item.subject, severity: item.severity })}
                      className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded text-[11px] font-semibold"
                    >
                      Investigate
                    </button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
