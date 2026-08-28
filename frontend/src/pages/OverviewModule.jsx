import React, { useState } from 'react';
import { ShieldAlert, AlertTriangle, FileSearch, Shield, Activity, Filter, Eye, ArrowUpRight, Lock, CheckCircle2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import SeverityBadge from '../components/common/SeverityBadge';
import PolicyPipelineCard from '../components/pipeline/PolicyPipelineCard';
import QuarantineVaultTable from '../components/pipeline/QuarantineVaultTable';

export default function OverviewModule({ scanResult, onOpenCase, onNavigateModule }) {
  const [timeFilter, setTimeFilter] = useState('7d');

  // KPI Data
  const kpis = [
    { label: 'Active Investigations', value: '24', change: '+3 today', color: 'text-cyan-400', icon: FileSearch },
    { label: 'Critical Threats', value: '8', change: 'Requires SOC Triage', color: 'text-red-400', icon: ShieldAlert },
    { label: 'Emails Analyzed', value: '1,284', change: 'Gmail & Outlook', color: 'text-slate-200', icon: Activity },
    { label: 'Auto-Quarantined', value: '142', change: 'Blocked from Inbox', color: 'text-red-400', icon: Lock }
  ];

  // Chart Data
  const threatTimeData = [
    { time: 'Mon', Phishing: 12, Malware: 4, BEC: 2, Spam: 24 },
    { time: 'Tue', Phishing: 19, Malware: 7, BEC: 3, Spam: 30 },
    { time: 'Wed', Phishing: 15, Malware: 5, BEC: 1, Spam: 20 },
    { time: 'Thu', Phishing: 28, Malware: 11, BEC: 6, Spam: 45 },
    { time: 'Fri', Phishing: 22, Malware: 8, BEC: 4, Spam: 35 },
    { time: 'Sat', Phishing: 9, Malware: 2, BEC: 0, Spam: 15 },
    { time: 'Sun', Phishing: 14, Malware: 3, BEC: 1, Spam: 18 }
  ];

  const distributionData = [
    { name: 'Phishing', value: 45, color: '#EF4444' },
    { name: 'Malware', value: 20, color: '#F97316' },
    { name: 'BEC', value: 15, color: '#F59E0B' },
    { name: 'Spoofing', value: 12, color: '#3B82F6' },
    { name: 'Spam', value: 8, color: '#64748B' }
  ];

  const recentCases = [
    { case_id: 'CASE-2026-00421', subject: 'URGENT: Action Required - Account Verification', severity: 'Critical', threat_type: 'Credential Phishing', analyst: 'Alex Rivera', status: 'Investigating' },
    { case_id: 'CASE-2026-00420', subject: 'Invoice Payment Receipt PDF', severity: 'High', threat_type: 'Malware Attachment', analyst: 'Sarah Chen', status: 'Contained' },
    { case_id: 'CASE-2026-00419', subject: 'CEO Wire Transfer Request', severity: 'High', threat_type: 'BEC Impersonation', analyst: 'Marcus Vance', status: 'Escalated' },
    { case_id: 'CASE-2026-00418', subject: 'Weekly Engineering Retrospective Notes', severity: 'Low', threat_type: 'Legitimate Email', analyst: 'Automated SOC', status: 'Resolved' }
  ];

  const recentIOCs = [
    { id: 'IOC-001', type: 'URL', value: 'suspicious-login-example.com', severity: 'Critical' },
    { id: 'IOC-002', type: 'IP Address', value: '103.253.144.12', severity: 'Critical' },
    { id: 'IOC-003', type: 'Domain', value: 'paypal-verify-alert.com', severity: 'High' },
    { id: 'IOC-004', type: 'File Hash', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae...', severity: 'Critical' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white font-mono tracking-wide">Investigation Overview</h1>
          <p className="text-xs text-slate-400">Centralized view of email threats, active cases, automated policy triage and forensic telemetry</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigateModule('email-analysis')}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold text-xs rounded-lg shadow-md flex items-center space-x-1.5 uppercase tracking-wider"
          >
            <span>Analyze New Email</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-[#0F172A] p-4 rounded-xl border border-slate-800 shadow-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono font-semibold uppercase">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <p className={`text-2xl font-extrabold font-mono ${kpi.color}`}>{kpi.value}</p>
              <p className="text-[11px] text-slate-400 font-mono">{kpi.change}</p>
            </div>
          );
        })}
      </div>

      {/* ⭐ CORE PROTOTYPE PIPELINE: Email Detection ➔ Risk Scoring ➔ Allow / Warning / Quarantine */}
      <PolicyPipelineCard scanResult={scanResult} onActionOverride={(action) => console.log("Policy Action Overridden:", action)} />

      {/* Threat Overview Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Threats Detected Over Time */}
        <div className="lg:col-span-2 bg-[#0F172A] p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-100 font-mono">Threat Detection Volume (Gmail & Outlook)</h2>
            
            <div className="flex items-center space-x-1 bg-[#1E293B] p-1 rounded-lg border border-slate-700 text-xs font-mono">
              {['24h', '7d', '30d'].map((f) => (
                <button
                  key={f}
                  onClick={() => setTimeFilter(f)}
                  className={`px-2.5 py-0.5 rounded font-bold transition-all ${
                    timeFilter === f ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={threatTimeData}>
                <defs>
                  <linearGradient id="colorPhish" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', borderRadius: '8px', fontSize: '11px', fontFamily: 'Fira Code' }} />
                <Area type="monotone" dataKey="Phishing" stroke="#EF4444" fillOpacity={1} fill="url(#colorPhish)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Threat Distribution Donut */}
        <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-100 font-mono">Threat Category Breakdown</h2>
          </div>

          <div className="h-44 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={distributionData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={4}>
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderColor: '#334155', fontSize: '11px', fontFamily: 'Fira Code' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            {distributionData.map((d, i) => (
              <div key={i} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-300">{d.name} ({d.value}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quarantine Vault & Automated Action Log Table */}
      <QuarantineVaultTable onOpenCase={onOpenCase} />

      {/* Tables Row: Recent Investigations & Recent IOCs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Investigations Table */}
        <div className="lg:col-span-2 bg-[#0F172A] p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-100 font-mono">Active Investigation Cases</h2>
            <button
              onClick={() => onNavigateModule('investigations')}
              className="text-xs text-cyan-400 hover:underline font-mono"
            >
              View All Cases
            </button>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="bg-[#1E293B] text-slate-400 uppercase text-[11px] border-b border-slate-800">
                  <th className="p-3">Case ID</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Severity</th>
                  <th className="p-3">Analyst</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-[#0A0E1A]">
                {recentCases.map((c, i) => (
                  <tr
                    key={i}
                    onClick={() => onOpenCase(c)}
                    className="hover:bg-slate-900 cursor-pointer transition-colors"
                  >
                    <td className="p-3 font-bold text-cyan-400">{c.case_id}</td>
                    <td className="p-3 text-slate-200 truncate max-w-xs">{c.subject}</td>
                    <td className="p-3"><SeverityBadge severity={c.severity} size="small" /></td>
                    <td className="p-3 text-slate-400">{c.analyst}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-semibold">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent IOCs */}
        <div className="bg-[#0F172A] p-5 rounded-xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-sm font-bold text-slate-100 font-mono">Recent Extracted IOCs</h2>
            <button
              onClick={() => onNavigateModule('digital-forensics')}
              className="text-xs text-cyan-400 hover:underline font-mono"
            >
              View All
            </button>
          </div>

          <div className="space-y-2 font-mono text-xs">
            {recentIOCs.map((ioc, idx) => (
              <div key={idx} className="bg-[#1E293B]/60 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-cyan-400 font-bold text-[11px]">{ioc.id}</span>
                    <span className="bg-slate-800 px-1.5 py-0.2 rounded border border-slate-700 text-[10px] text-slate-300">{ioc.type}</span>
                  </div>
                  <p className="text-slate-200 text-xs truncate max-w-[180px] mt-1" title={ioc.value}>{ioc.value}</p>
                </div>
                <SeverityBadge severity={ioc.severity} size="small" />
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
