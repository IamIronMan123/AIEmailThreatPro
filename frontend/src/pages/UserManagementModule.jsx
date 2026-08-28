import React, { useState } from 'react';
import {
  Users, Search, Filter, Shield, ShieldAlert, ShieldCheck, Mail,
  Server, ArrowUpRight, CheckCircle2, AlertTriangle, RefreshCw, Eye,
  Lock, Key, Bell, ExternalLink
} from 'lucide-react';
import SeverityBadge from '../components/common/SeverityBadge';

export default function UserManagementModule({ onOpenEmployeeThreats }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [gatewayFilter, setGatewayFilter] = useState('ALL');

  const [employees, setEmployees] = useState([
    {
      id: 'EMP-0104',
      name: 'Alex Rivera',
      email: 'employee@company.com',
      department: 'Finance & Accounts',
      role: 'Senior Financial Analyst',
      gateway: 'Gmail Workspace',
      forwarding_rule: 'ACTIVE (Auto-Forward to ZETP)',
      threats_intercepted: 8,
      quarantined_count: 6,
      risk_profile: 'High Risk (Targeted)',
      last_incident: '28 Aug 2026 13:15 UTC',
      status: 'Active'
    },
    {
      id: 'EMP-0105',
      name: 'Sarah Chen',
      email: 'sarah.chen@company.com',
      department: 'Procurement & Vendor Ops',
      role: 'Procurement Director',
      gateway: 'Microsoft 365 Outlook',
      forwarding_rule: 'ACTIVE (Auto-Forward to ZETP)',
      threats_intercepted: 5,
      quarantined_count: 4,
      risk_profile: 'Targeted',
      last_incident: '28 Aug 2026 12:40 UTC',
      status: 'Active'
    },
    {
      id: 'EMP-0106',
      name: 'Marcus Vance',
      email: 'marcus.vance@company.com',
      department: 'Executive / Treasury',
      role: 'Treasury Controller',
      gateway: 'Gmail Workspace',
      forwarding_rule: 'ACTIVE (Auto-Forward to ZETP)',
      threats_intercepted: 12,
      quarantined_count: 11,
      risk_profile: 'High Risk (VIP / BEC Target)',
      last_incident: '28 Aug 2026 11:20 UTC',
      status: 'Active'
    },
    {
      id: 'EMP-0107',
      name: 'David Kim',
      email: 'david.kim@company.com',
      department: 'Engineering & DevOps',
      role: 'Staff Infrastructure Engineer',
      gateway: 'Microsoft 365 Outlook',
      forwarding_rule: 'ACTIVE (Auto-Forward to ZETP)',
      threats_intercepted: 2,
      quarantined_count: 1,
      risk_profile: 'Low Risk',
      last_incident: '28 Aug 2026 10:45 UTC',
      status: 'Active'
    },
    {
      id: 'EMP-0108',
      name: 'Elena Rostova',
      email: 'elena.rostova@company.com',
      department: 'Legal & Compliance',
      role: 'Senior Legal Counsel',
      gateway: 'Gmail Workspace',
      forwarding_rule: 'ACTIVE (Auto-Forward to ZETP)',
      threats_intercepted: 4,
      quarantined_count: 3,
      risk_profile: 'Targeted',
      last_incident: '28 Aug 2026 09:30 UTC',
      status: 'Active'
    },
    {
      id: 'EMP-0109',
      name: 'Engineering Broadcast Group',
      email: 'dev.team@company.com',
      department: 'Engineering & DevOps',
      role: 'Distribution Mailbox',
      gateway: 'Microsoft 365 Outlook',
      forwarding_rule: 'ACTIVE (Auto-Forward to ZETP)',
      threats_intercepted: 1,
      quarantined_count: 0,
      risk_profile: 'Clean',
      last_incident: '28 Aug 2026 10:05 UTC',
      status: 'Active'
    }
  ]);

  const filtered = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || emp.department.toLowerCase().includes(deptFilter.toLowerCase());
    const matchesGateway = gatewayFilter === 'ALL' || emp.gateway.toLowerCase().includes(gatewayFilter.toLowerCase());

    return matchesSearch && matchesDept && matchesGateway;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white font-mono tracking-wide flex items-center">
            <Users className="w-5 h-5 text-cyan-400 mr-2" />
            Enterprise User & Mailbox Directory
          </h1>
          <p className="text-xs text-slate-400">
            Mapping enterprise employees, IT automated forwarding rules, protected mailboxes, and individual threat profiles
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs text-slate-400 bg-[#1E293B] px-3 py-1.5 rounded-lg border border-slate-700/80">
          <span className="text-slate-300 font-semibold">IT Forwarding Gateways:</span>
          <span className="text-cyan-400 font-bold">100% Enforced</span>
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
        <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800 shadow-xl space-y-1">
          <span className="text-slate-400 uppercase text-[10px] font-semibold">Protected Employees</span>
          <p className="text-2xl font-extrabold text-white">{employees.length}</p>
          <p className="text-[10px] text-slate-500">Corporate mailboxes secured</p>
        </div>

        <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800 shadow-xl space-y-1">
          <span className="text-red-400 uppercase text-[10px] font-semibold">Targeted / VIP Users</span>
          <p className="text-2xl font-extrabold text-red-400">3</p>
          <p className="text-[10px] text-slate-500">Finance, Treasury & Legal</p>
        </div>

        <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800 shadow-xl space-y-1">
          <span className="text-cyan-400 uppercase text-[10px] font-semibold">Gmail Gateways</span>
          <p className="text-2xl font-extrabold text-cyan-400">3</p>
          <p className="text-[10px] text-slate-500">Auto-forwarding active</p>
        </div>

        <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800 shadow-xl space-y-1">
          <span className="text-blue-400 uppercase text-[10px] font-semibold">Microsoft 365 Outlook</span>
          <p className="text-2xl font-extrabold text-blue-400">3</p>
          <p className="text-[10px] text-slate-500">Exchange transport rules active</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800 shadow-xl space-y-3 font-mono text-xs">
        <div className="flex flex-col lg:flex-row items-center gap-3">
          
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Employee Name, Corporate Email, or Department..."
              className="w-full bg-[#1E293B] border border-slate-700/80 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full lg:w-auto">
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-[#1E293B] border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Departments</option>
              <option value="Finance">Finance & Treasury</option>
              <option value="Procurement">Procurement</option>
              <option value="Engineering">Engineering</option>
              <option value="Legal">Legal</option>
            </select>

            <select
              value={gatewayFilter}
              onChange={(e) => setGatewayFilter(e.target.value)}
              className="bg-[#1E293B] border border-slate-700 rounded-lg px-2.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Mail Providers</option>
              <option value="Gmail">Gmail Workspace</option>
              <option value="Microsoft">Microsoft 365</option>
            </select>
          </div>

        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-[#0F172A] rounded-xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="bg-[#1E293B] text-slate-400 uppercase text-[11px] border-b border-slate-800">
                <th className="p-3">Employee & Role</th>
                <th className="p-3">Mail Provider Gateway</th>
                <th className="p-3">IT Forwarding Rule</th>
                <th className="p-3">Threats Intercepted</th>
                <th className="p-3">Risk Profile</th>
                <th className="p-3">Last Intercepted</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-[#0A0E1A]">
              {filtered.map((emp) => (
                <tr key={emp.id} className="hover:bg-slate-900/80 transition-colors">
                  
                  {/* Employee & Role */}
                  <td className="p-3">
                    <div className="flex items-center space-x-2.5">
                      <div className="h-8 w-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold shrink-0">
                        {emp.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-white font-semibold">{emp.name}</p>
                        <p className="text-cyan-400 text-[11px]">{emp.email}</p>
                        <span className="text-[10px] text-slate-500 font-sans">{emp.department} • {emp.role}</span>
                      </div>
                    </div>
                  </td>

                  {/* Mail Provider */}
                  <td className="p-3">
                    <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-[11px] text-slate-300 font-semibold">
                      {emp.gateway}
                    </span>
                  </td>

                  {/* IT Forwarding Rule */}
                  <td className="p-3">
                    <div className="flex items-center space-x-1.5 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[11px] font-semibold">Auto-Forwarded to ZETP</span>
                    </div>
                    <span className="text-[10px] text-slate-500">Rule ID: FW-RULE-{emp.id.replace('EMP-', '')}</span>
                  </td>

                  {/* Threats Intercepted */}
                  <td className="p-3">
                    <div className="space-y-0.5">
                      <span className="text-white font-bold text-sm">{emp.threats_intercepted} Total</span>
                      <span className="text-red-400 text-[10px] block">{emp.quarantined_count} Quarantined</span>
                    </div>
                  </td>

                  {/* Risk Profile */}
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${
                      emp.risk_profile.includes('High')
                        ? 'bg-red-500/10 text-red-400 border-red-500/30'
                        : emp.risk_profile.includes('Targeted')
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {emp.risk_profile}
                    </span>
                  </td>

                  {/* Last Intercepted */}
                  <td className="p-3 text-slate-400 text-[11px]">
                    {emp.last_incident}
                  </td>

                  {/* Actions */}
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onOpenEmployeeThreats && onOpenEmployeeThreats(emp)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 rounded text-[11px] font-semibold transition-colors"
                    >
                      View Threat Log
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
