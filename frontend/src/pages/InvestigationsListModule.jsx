import React, { useState } from 'react';
import {
  FileSearch, Search, Filter, ShieldAlert, ShieldCheck, AlertTriangle,
  Lock, ArrowUpRight, Download, CheckCircle2, RefreshCw, Eye, ShieldBan,
  Inbox, User, Server, Layers, Calendar, ChevronDown, CheckSquare, XCircle
} from 'lucide-react';
import SeverityBadge from '../components/common/SeverityBadge';

export default function InvestigationsListModule({ onOpenCase, onGenerateReport }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [actionFilter, setActionFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [gatewayFilter, setGatewayFilter] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState([]);

  // Comprehensive list of intercepted individual emails
  const [investigations, setInvestigations] = useState([
    {
      case_id: 'CASE-2026-00421',
      subject: 'URGENT: Action Required - Verify Your Account Credentials Now',
      sender_address: 'account-update@paypal-verify-alert.com',
      sender_domain: 'paypal-verify-alert.com',
      recipient_email: 'employee@company.com',
      recipient_name: 'Alex Rivera (Finance)',
      gateway: 'Gmail Gateway',
      threat_score: 94.5,
      severity: 'Critical',
      threat_type: 'Credential Phishing',
      policy_action: 'QUARANTINED',
      status: 'Investigating',
      analyst: 'Security Analyst',
      scanned_at: '28 Aug 2026 13:15 UTC',
      iocs_count: 5,
      summary: 'Intercepted brand spoofing lure with executable payload and credential harvesting link.'
    },
    {
      case_id: 'CASE-2026-00420',
      subject: 'Invoice #9401 Payment Confirmation PDF Attachment',
      sender_address: 'billing@vendor-update-service.com',
      sender_domain: 'vendor-update-service.com',
      recipient_email: 'sarah.chen@company.com',
      recipient_name: 'Sarah Chen (Procurement)',
      gateway: 'Outlook Exchange',
      threat_score: 88.0,
      severity: 'High',
      threat_type: 'Malware Attachment',
      policy_action: 'QUARANTINED',
      status: 'Contained',
      analyst: 'Sarah Chen',
      scanned_at: '28 Aug 2026 12:40 UTC',
      iocs_count: 4,
      summary: 'Malicious PDF embedding obfuscated script targeting banking credentials.'
    },
    {
      case_id: 'CASE-2026-00419',
      subject: 'CEO Wire Transfer Request - Confidential Acquisition',
      sender_address: 'ceo-office@exec-directmail.com',
      sender_domain: 'exec-directmail.com',
      recipient_email: 'marcus.vance@company.com',
      recipient_name: 'Marcus Vance (Treasury)',
      gateway: 'Gmail Gateway',
      threat_score: 86.0,
      severity: 'High',
      threat_type: 'BEC Impersonation',
      policy_action: 'QUARANTINED',
      status: 'Escalated',
      analyst: 'Marcus Vance',
      scanned_at: '28 Aug 2026 11:20 UTC',
      iocs_count: 3,
      summary: 'Executive impersonation attempt spoofing corporate wire authorization.'
    },
    {
      case_id: 'CASE-2026-00418',
      subject: 'Notice: Payroll Direct Deposit Update Portal',
      sender_address: 'hr-support@payroll-secure-access.org',
      sender_domain: 'payroll-secure-access.org',
      recipient_email: 'david.kim@company.com',
      recipient_name: 'David Kim (Engineering)',
      gateway: 'Outlook Exchange',
      threat_score: 52.0,
      severity: 'Medium',
      threat_type: 'Credential Theft',
      policy_action: 'WARNED',
      status: 'Investigating',
      analyst: 'Security Analyst',
      scanned_at: '28 Aug 2026 10:45 UTC',
      iocs_count: 2,
      summary: 'Suspicious external HR link injected with employee warning banner.'
    },
    {
      case_id: 'CASE-2026-00417',
      subject: 'Quarterly Engineering Roadmap & Sprint Retrospective Summary',
      sender_address: 'pmo@enterprise-corp.com',
      sender_domain: 'enterprise-corp.com',
      recipient_email: 'dev.team@company.com',
      recipient_name: 'Engineering Team',
      gateway: 'Outlook Exchange',
      threat_score: 4.2,
      severity: 'Low',
      threat_type: 'Legitimate Email',
      policy_action: 'ALLOWED',
      status: 'Resolved',
      analyst: 'Automated SOC',
      scanned_at: '28 Aug 2026 10:05 UTC',
      iocs_count: 0,
      summary: 'Clean internal roadmap document with verified SPF/DKIM/DMARC alignment.'
    },
    {
      case_id: 'CASE-2026-00416',
      subject: 'Security Notice: Unrecognized Login from New Device',
      sender_address: 'no-reply@authenticator-cloud-alert.net',
      sender_domain: 'authenticator-cloud-alert.net',
      recipient_email: 'elena.rostova@company.com',
      recipient_name: 'Elena Rostova (Legal)',
      gateway: 'Gmail Gateway',
      threat_score: 91.0,
      severity: 'Critical',
      threat_type: 'Credential Phishing',
      policy_action: 'QUARANTINED',
      status: 'Resolved',
      analyst: 'Security Analyst',
      scanned_at: '28 Aug 2026 09:30 UTC',
      iocs_count: 6,
      summary: 'Fake 2FA security alert containing reverse proxy phishing link.'
    }
  ]);

  // Handle manual resolution
  const handleQuickResolve = (caseId) => {
    setInvestigations(items => items.map(c => c.case_id === caseId ? { ...c, status: 'Resolved' } : c));
  };

  const handleQuickContain = (caseId) => {
    setInvestigations(items => items.map(c => c.case_id === caseId ? { ...c, status: 'Contained', policy_action: 'QUARANTINED' } : c));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === investigations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(investigations.map(c => c.case_id));
    }
  };

  const toggleSelect = (caseId) => {
    setSelectedIds(ids => ids.includes(caseId) ? ids.filter(i => i !== caseId) : [...ids, caseId]);
  };

  // Filter logic
  const filtered = investigations.filter(c => {
    const matchesSearch = c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.sender_address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.recipient_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.case_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || c.severity.toUpperCase() === severityFilter.toUpperCase();
    const matchesAction = actionFilter === 'ALL' || c.policy_action === actionFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesGateway = gatewayFilter === 'ALL' || c.gateway.toLowerCase().includes(gatewayFilter.toLowerCase());

    return matchesSearch && matchesSeverity && matchesAction && matchesStatus && matchesGateway;
  });

  const exportListCsv = () => {
    let csv = "data:text/csv;charset=utf-8,Case ID,Subject,Sender,Recipient,Gateway,Score,Severity,Action,Status,Date\n";
    filtered.forEach(c => {
      csv += `"${c.case_id}","${c.subject}","${c.sender_address}","${c.recipient_email}","${c.gateway}","${c.threat_score}","${c.severity}","${c.policy_action}","${c.status}","${c.scanned_at}"\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ZETP_Investigations_List_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // Quick statistics
  const totalCount = investigations.length;
  const quarantinedCount = investigations.filter(c => c.policy_action === 'QUARANTINED').length;
  const activeCount = investigations.filter(c => c.status === 'Investigating' || c.status === 'Escalated').length;
  const resolvedCount = investigations.filter(c => c.status === 'Resolved').length;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white font-mono tracking-wide flex items-center">
            <FileSearch className="w-5 h-5 text-cyan-400 mr-2" />
            Investigation Cases & Email Threat Directory
          </h1>
          <p className="text-xs text-slate-400">
            Real-time repository of individual intercepted emails, forwarding telemetry, and SOC analyst case actions
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportListCsv}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono rounded-lg flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800 shadow-xl space-y-1">
          <span className="text-slate-400 uppercase text-[10px] font-semibold">Total Threat Cases</span>
          <p className="text-2xl font-extrabold text-white">{totalCount}</p>
          <p className="text-[10px] text-slate-500">Across all enterprise mailboxes</p>
        </div>

        <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800 shadow-xl space-y-1">
          <span className="text-red-400 uppercase text-[10px] font-semibold flex items-center">
            <ShieldBan className="w-3.5 h-3.5 mr-1" /> Quarantined Threats
          </span>
          <p className="text-2xl font-extrabold text-red-400">{quarantinedCount}</p>
          <p className="text-[10px] text-slate-500">Blocked from reaching user inbox</p>
        </div>

        <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800 shadow-xl space-y-1">
          <span className="text-amber-400 uppercase text-[10px] font-semibold flex items-center">
            <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Active Triage
          </span>
          <p className="text-2xl font-extrabold text-amber-400">{activeCount}</p>
          <p className="text-[10px] text-slate-500">Pending SOC containment</p>
        </div>

        <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800 shadow-xl space-y-1">
          <span className="text-emerald-400 uppercase text-[10px] font-semibold flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Resolved Incidents
          </span>
          <p className="text-2xl font-extrabold text-emerald-400">{resolvedCount}</p>
          <p className="text-[10px] text-slate-500">Feedback sent to employees</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800 shadow-xl space-y-3 font-mono text-xs">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          
          {/* Keyword Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Subject, Sender (From), Recipient Employee, Case ID, or Domain..."
              className="w-full bg-[#1E293B] border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            
            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-[#1E293B] border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Severity: All</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>

            {/* Policy Action Filter */}
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-[#1E293B] border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Policy: All Actions</option>
              <option value="QUARANTINED">Quarantined</option>
              <option value="WARNED">Warned</option>
              <option value="ALLOWED">Allowed</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1E293B] border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Status: All</option>
              <option value="Investigating">Investigating</option>
              <option value="Contained">Contained</option>
              <option value="Escalated">Escalated</option>
              <option value="Resolved">Resolved</option>
            </select>

            {/* Gateway Filter */}
            <select
              value={gatewayFilter}
              onChange={(e) => setGatewayFilter(e.target.value)}
              className="bg-[#1E293B] border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">Gateway: All</option>
              <option value="Gmail">Gmail</option>
              <option value="Outlook">Outlook</option>
            </select>

          </div>

        </div>

        {/* Results summary & Bulk Actions */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2">
          <span>Showing {filtered.length} of {investigations.length} email threat cases</span>
          {selectedIds.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-cyan-400 font-bold">{selectedIds.length} selected</span>
              <button
                onClick={() => {
                  setInvestigations(items => items.map(c => selectedIds.includes(c.case_id) ? { ...c, status: 'Resolved' } : c));
                  setSelectedIds([]);
                }}
                className="px-2 py-0.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-semibold"
              >
                Bulk Resolve
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Investigation Cases Table */}
      <div className="bg-[#0F172A] rounded-xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#1E293B] text-slate-400 uppercase text-[11px] border-b border-slate-800">
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === investigations.length && investigations.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                  />
                </th>
                <th className="p-3">Case ID</th>
                <th className="p-3">Email Threat Details</th>
                <th className="p-3">Target Employee</th>
                <th className="p-3">Score & Severity</th>
                <th className="p-3">Automated Policy</th>
                <th className="p-3">SOC Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-[#0A0E1A]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500 font-sans">
                    No investigation cases match your filter criteria. Try adjusting your search query.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr
                    key={item.case_id}
                    className="hover:bg-slate-900/80 transition-colors"
                  >
                    {/* Checkbox */}
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.case_id)}
                        onChange={() => toggleSelect(item.case_id)}
                        className="rounded bg-slate-900 border-slate-700 text-cyan-500 focus:ring-0"
                      />
                    </td>

                    {/* Case ID */}
                    <td className="p-3">
                      <button
                        onClick={() => onOpenCase(item)}
                        className="font-bold text-cyan-400 hover:underline flex items-center"
                      >
                        {item.case_id}
                        <ArrowUpRight className="w-3 h-3 ml-0.5 opacity-70" />
                      </button>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{item.gateway}</span>
                    </td>

                    {/* Email Details */}
                    <td className="p-3 max-w-sm">
                      <p
                        onClick={() => onOpenCase(item)}
                        className="text-white font-semibold truncate hover:text-cyan-300 cursor-pointer"
                        title={item.subject}
                      >
                        {item.subject}
                      </p>
                      <p className="text-cyan-400 text-[11px] truncate" title={item.sender_address}>
                        From: {item.sender_address}
                      </p>
                      <p className="text-slate-400 text-[10px] font-sans truncate mt-0.5">{item.summary}</p>
                    </td>

                    {/* Target Employee */}
                    <td className="p-3 max-w-xs">
                      <p className="text-slate-200 font-semibold truncate">{item.recipient_name}</p>
                      <p className="text-slate-400 text-[11px] truncate">{item.recipient_email}</p>
                      <span className="text-[10px] text-slate-500">{item.scanned_at}</span>
                    </td>

                    {/* Score & Severity */}
                    <td className="p-3">
                      <div className="space-y-1">
                        <span className="text-sm font-bold text-white">{item.threat_score.toFixed(1)}/100</span>
                        <SeverityBadge severity={item.severity} size="small" />
                      </div>
                    </td>

                    {/* Policy Action */}
                    <td className="p-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-bold uppercase tracking-wider ${
                        item.policy_action === 'QUARANTINED'
                          ? 'bg-red-500/10 text-red-400 border-red-500/30'
                          : item.policy_action === 'WARNED'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      }`}>
                        {item.policy_action === 'QUARANTINED' && <ShieldBan className="w-3 h-3 mr-1" />}
                        {item.policy_action === 'WARNED' && <AlertTriangle className="w-3 h-3 mr-1" />}
                        {item.policy_action === 'ALLOWED' && <Inbox className="w-3 h-3 mr-1" />}
                        {item.policy_action}
                      </span>
                    </td>

                    {/* SOC Status */}
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-semibold ${
                        item.status === 'Resolved'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : item.status === 'Contained'
                          ? 'bg-blue-950 text-blue-400 border-blue-800'
                          : item.status === 'Escalated'
                          ? 'bg-red-950 text-red-400 border-red-800'
                          : 'bg-slate-800 text-amber-400 border-slate-700'
                      }`}>
                        {item.status}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">{item.analyst}</span>
                    </td>

                    {/* Action Buttons */}
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onOpenCase(item)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded text-[11px] font-semibold transition-colors"
                          title="View Full Case"
                        >
                          View
                        </button>
                        {item.status !== 'Resolved' ? (
                          <button
                            onClick={() => handleQuickResolve(item.case_id)}
                            className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[11px] font-semibold transition-colors"
                            title="Mark as Resolved"
                          >
                            Resolve
                          </button>
                        ) : (
                          <button
                            onClick={() => handleQuickContain(item.case_id)}
                            className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded text-[11px] font-semibold transition-colors"
                            title="Re-open & Contain"
                          >
                            Contain
                          </button>
                        )}
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
