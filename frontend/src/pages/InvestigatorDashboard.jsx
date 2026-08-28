import React, { useState } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle, Clock, 
  Search, Download, Filter, Eye, MoreVertical,
  MapPin, Globe, Server, Mail, User, Calendar,
  Activity, Database, TrendingUp, Users,
  ChevronRight, ChevronDown, X, FileText,
  ExternalLink, RefreshCw, Flag, CheckCircle2, ShieldBan, Cpu
} from 'lucide-react';
import CaseDetailsModal from '../components/cases/CaseDetailsModal';
import ReportGenerationModal from '../components/reports/ReportGenerationModal';

export default function InvestigatorDashboard({ onNavigateModule, scanResult }) {
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showDeepAnalysisModal, setShowDeepAnalysisModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Mock data with detailed forensic information
  const [investigations, setInvestigations] = useState([
    {
      id: 'INV-2026-0842',
      case_id: 'INV-2026-0842',
      sender: 'john.doe@company.com',
      recipient: 'finance@company.com',
      subject: 'Urgent: Invoice Payment Required',
      received: '2026-08-28T10:30:00Z',
      threat_score: 92,
      risk_level: 'critical',
      status: 'quarantined',
      policy_action: 'QUARANTINED',
      type: 'phishing',
      threat_type: 'Credential Phishing',
      reported_by: 'employee@company.com',
      ai_explanation: 'Email impersonates a legitimate vendor (paypal-verify.com) with urgent payment request. Contains multiple red flags: fake sender domain, urgency language, and mismatched authentication records.',
      authentication: {
        spf: { status: 'FAIL', reason: 'IP 45.33.22.184 not in SPF record', record: 'v=spf1 include:spf.paypal.com ~all' },
        dkim: { status: 'FAIL', reason: 'No DKIM signature found', domain: 'paypal-verify.com' },
        dmarc: { status: 'FAIL', policy: 'p=quarantine', action: 'Policy violation - domain mismatch' }
      },
      forensic_data: {
        sender_ip: '45.33.22.184',
        geolocation: { city: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6173 },
        isp: 'Hetzner Online GmbH',
        headers: ['X-Phishing-Score: 92', 'X-Forensic-ID: fh3k9s2d', 'Received: from mail.sender.com (45.33.22.184)'],
        attachments: ['invoice_2026.pdf (2.3MB)']
      }
    },
    {
      id: 'INV-2026-0841',
      case_id: 'INV-2026-0841',
      sender: 'alice.wang@company.com',
      recipient: 'security@company.com',
      subject: 'Suspicious Login Attempt from Brazil',
      received: '2026-08-28T09:15:00Z',
      threat_score: 78,
      risk_level: 'high',
      status: 'investigating',
      policy_action: 'QUARANTINED',
      type: 'compromised_account',
      threat_type: 'Account Compromise / BEC',
      reported_by: 'system_alert',
      ai_explanation: 'Unusual login pattern detected: Account accessed from Brazil while user is in US. Multiple failed attempts before successful login. Device fingerprint mismatch detected.',
      authentication: {
        spf: { status: 'PASS', reason: 'Sender IP authorized', record: 'v=spf1 include:_spf.google.com ~all' },
        dkim: { status: 'PASS', reason: 'Valid DKIM signature', domain: 'company.com' },
        dmarc: { status: 'PASS', policy: 'p=quarantine', action: 'Policy passed' }
      },
      forensic_data: {
        sender_ip: '189.34.12.90',
        geolocation: { city: 'Sao Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333 },
        isp: 'Oi Internet',
        headers: ['X-Login-Attempts: 7', 'X-Device-Fingerprint: mismatch', 'X-Forensic-ID: jd83n2ks'],
        attachments: []
      }
    },
    {
      id: 'INV-2026-0840',
      case_id: 'INV-2026-0840',
      sender: 'marketing@external.com',
      recipient: 'team@company.com',
      subject: 'Partnership Opportunity - Special Offer',
      received: '2026-08-28T08:00:00Z',
      threat_score: 25,
      risk_level: 'low',
      status: 'resolved',
      policy_action: 'ALLOWED',
      type: 'spam',
      threat_type: 'Legitimate / Low Risk',
      reported_by: 'system_auto_detection',
      ai_explanation: 'Marketing email from legitimate vendor. No malicious indicators detected. Email passed all authentication checks. Low threat score based on content analysis.',
      authentication: {
        spf: { status: 'PASS', reason: 'Sender IP authorized', record: 'v=spf1 include:spf.sendgrid.net ~all' },
        dkim: { status: 'PASS', reason: 'Valid DKIM signature', domain: 'external.com' },
        dmarc: { status: 'PASS', policy: 'p=none', action: 'Policy passed - monitor only' }
      },
      forensic_data: {
        sender_ip: '192.168.1.1',
        geolocation: { city: 'San Francisco', country: 'US', lat: 37.7749, lng: -122.4194 },
        isp: 'AWS',
        headers: ['X-Marketing-Campaign: Q4-2026', 'X-Spam-Score: 25'],
        attachments: ['partner_brochure.pdf (5.1MB)']
      }
    },
    {
      id: 'INV-2026-0839',
      case_id: 'INV-2026-0839',
      sender: 'ceo@company.com',
      recipient: 'hr@company.com',
      subject: 'RE: Employee Payroll Changes',
      received: '2026-08-28T07:30:00Z',
      threat_score: 65,
      risk_level: 'medium',
      status: 'investigating',
      policy_action: 'WARNED',
      type: 'impersonation',
      threat_type: 'Executive Impersonation (BEC)',
      reported_by: 'employee@company.com',
      ai_explanation: 'Email appears to be from CEO but sender address has subtle difference (ceo@company.co vs ceo@company.com). Request for payroll changes outside normal process flow.',
      authentication: {
        spf: { status: 'FAIL', reason: 'Sender IP not authorized for company.com', record: 'v=spf1 include:_spf.google.com ~all' },
        dkim: { status: 'FAIL', reason: 'DKIM domain mismatch', domain: 'company.co' },
        dmarc: { status: 'FAIL', policy: 'p=quarantine', action: 'Policy violation - unauthorized domain' }
      },
      forensic_data: {
        sender_ip: '103.25.12.88',
        geolocation: { city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
        isp: 'Singapore Telecom',
        headers: ['X-Impersonation-Detected: true', 'X-Domain-Similarity: 95%'],
        attachments: ['payroll_changes.xlsx']
      }
    }
  ]);

  const stats = {
    total: investigations.length,
    critical: investigations.filter(i => i.risk_level === 'critical').length,
    quarantine: investigations.filter(i => i.status === 'quarantined').length,
    resolved: investigations.filter(i => i.status === 'resolved').length,
    investigating: investigations.filter(i => i.status === 'investigating').length
  };

  const getRiskColor = (level) => ({
    critical: 'bg-red-500',
    high: 'bg-orange-500',
    medium: 'bg-yellow-500',
    low: 'bg-green-500'
  }[level] || 'bg-gray-500');

  const getStatusIcon = (status) => ({
    quarantined: <Shield className="w-4 h-4 text-red-400" />,
    investigating: <Clock className="w-4 h-4 text-yellow-400" />,
    resolved: <CheckCircle className="w-4 h-4 text-green-400" />
  }[status] || <AlertTriangle className="w-4 h-4 text-gray-400" />);

  const handleResolveAction = (id) => {
    setInvestigations(items => items.map(inv => inv.id === id ? { ...inv, status: 'resolved' } : inv));
    if (selectedInvestigation && selectedInvestigation.id === id) {
      setSelectedInvestigation(prev => ({ ...prev, status: 'resolved' }));
    }
  };

  const handleBlockSenderAction = (id) => {
    setInvestigations(items => items.map(inv => inv.id === id ? { ...inv, status: 'quarantined', risk_level: 'critical' } : inv));
    if (selectedInvestigation && selectedInvestigation.id === id) {
      setSelectedInvestigation(prev => ({ ...prev, status: 'quarantined', risk_level: 'critical' }));
    }
    alert(`Sender domain blocked across corporate perimeter and quarantined.`);
  };

  const handleExportCsv = () => {
    let csv = "data:text/csv;charset=utf-8,Case ID,Sender,Subject,Threat Score,Risk Level,Status,Time,IP,Geolocation\n";
    investigations.forEach(inv => {
      csv += `"${inv.id}","${inv.sender}","${inv.subject}","${inv.threat_score}","${inv.risk_level}","${inv.status}","${inv.received}","${inv.forensic_data.sender_ip}","${inv.forensic_data.geolocation.city}, ${inv.forensic_data.geolocation.country}"\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ZETP_SOC_Investigation_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredInvestigations = investigations.filter(inv => {
    const matchesSearch = 
      inv.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.ai_explanation.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && inv.status === filterStatus;
  });

  return (
    <div className="min-h-screen bg-gray-900 text-white flex font-sans">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-gray-800 border-r border-gray-700 transition-all duration-300 overflow-hidden shrink-0`}>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-6 h-6 text-blue-400" />
            <span className="font-bold text-lg font-mono">ZETP SOC</span>
          </div>
          
          <nav className="space-y-1 font-mono text-xs">
            <SidebarItem icon={<Activity size={16} />} label="Overview" active onClick={() => onNavigateModule && onNavigateModule('overview')} />
            <SidebarItem icon={<Mail size={16} />} label="Email Analysis" onClick={() => onNavigateModule && onNavigateModule('email-analysis')} />
            <SidebarItem icon={<AlertTriangle size={16} />} label="Threat Detection" onClick={() => onNavigateModule && onNavigateModule('threat-detection')} />
            <SidebarItem icon={<Globe size={16} />} label="Geolocation Intel" onClick={() => onNavigateModule && onNavigateModule('geolocation')} />
            <SidebarItem icon={<Database size={16} />} label="Digital Forensics" onClick={() => onNavigateModule && onNavigateModule('digital-forensics')} />
            <SidebarItem icon={<Users size={16} />} label="Investigation Cases" onClick={() => onNavigateModule && onNavigateModule('investigations')} />
            <SidebarItem icon={<User size={16} />} label="Users & Mailboxes" onClick={() => onNavigateModule && onNavigateModule('users')} />
            
            <div className="pt-4 mt-4 border-t border-gray-700">
              <p className="text-[10px] text-gray-500 uppercase font-semibold px-3 mb-2">Intelligence</p>
              <SidebarItem icon={<Server size={16} />} label="Indicators of Compromise" onClick={() => onNavigateModule && onNavigateModule('digital-forensics')} />
              <SidebarItem icon={<TrendingUp size={16} />} label="Threat Sources" onClick={() => onNavigateModule && onNavigateModule('overview')} />
              <SidebarItem icon={<FileText size={16} />} label="Domain Intelligence" onClick={() => onNavigateModule && onNavigateModule('digital-forensics')} />
              <SidebarItem icon={<ExternalLink size={16} />} label="IP Intelligence" onClick={() => onNavigateModule && onNavigateModule('geolocation')} />
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold font-mono">SOC Investigation Dashboard</h1>
            <p className="text-gray-400 text-sm">Real-time threat monitoring and forensic analysis</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={handleExportCsv}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 font-mono text-sm font-semibold shadow-md transition-colors"
            >
              <Download size={18} />
              Export Report
            </button>
            <button 
              onClick={() => onNavigateModule && onNavigateModule('users')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center gap-2 font-mono text-sm transition-colors"
            >
              <Users size={18} />
              Analysts (3)
            </button>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              title="Toggle Sidebar"
            >
              <ChevronRight size={18} className={isSidebarOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Investigations" value={stats.total} color="bg-blue-500" />
          <StatCard label="Critical Threats" value={stats.critical} color="bg-red-500" />
          <StatCard label="In Quarantine" value={stats.quarantine} color="bg-orange-500" />
          <StatCard label="Resolved" value={stats.resolved} color="bg-green-500" />
        </div>

        {/* Real-time Alert */}
        <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="animate-pulse w-2.5 h-2.5 bg-red-500 rounded-full"></div>
            <span className="text-red-400 font-medium font-mono text-sm">
              ⚠️ HIGH-RISK ALERT: {stats.critical} critical threats detected - Immediate action required
            </span>
          </div>
          <span className="text-xs text-red-300 font-mono bg-red-950 px-2.5 py-1 rounded border border-red-800">
            Last updated: 2 min ago
          </span>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-wrap gap-4 mb-6 font-mono text-xs">
          <div className="flex-1 min-w-[240px] relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search IOCs, IPs, Headers, or Subjects..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-slate-100 placeholder-gray-500 text-xs font-mono"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['all', 'quarantined', 'investigating', 'resolved'].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                  filterStatus === status 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
                }`}
                onClick={() => setFilterStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
            <button 
              onClick={() => setSearchTerm('')}
              className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors"
            >
              <Filter size={14} />
              Reset Filter
            </button>
          </div>
        </div>

        {/* Investigations Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
          <table className="w-full font-mono text-xs">
            <thead className="bg-gray-900 border-b border-gray-700 text-gray-400 uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3 text-left">Case ID</th>
                <th className="px-4 py-3 text-left">Sender</th>
                <th className="px-4 py-3 text-left">Subject</th>
                <th className="px-4 py-3 text-left">Risk</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Time</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800/60">
              {filteredInvestigations.map((inv) => (
                <tr 
                  key={inv.id} 
                  className={`hover:bg-gray-700/50 cursor-pointer transition-colors ${
                    selectedInvestigation?.id === inv.id ? 'bg-gray-700/70 border-l-4 border-blue-500' : ''
                  }`}
                  onClick={() => setSelectedInvestigation(inv)}
                >
                  <td className="px-4 py-3 text-sm font-mono font-bold text-cyan-400">{inv.id}</td>
                  <td className="px-4 py-3 text-sm flex items-center gap-2">
                    <Mail size={14} className="text-gray-400 shrink-0" />
                    <span className="truncate max-w-[160px]">{inv.sender}</span>
                  </td>
                  <td className="px-4 py-3 text-sm max-w-xs truncate text-gray-100 font-sans font-medium">{inv.subject}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${getRiskColor(inv.risk_level)}`}></span>
                      <span className="text-xs capitalize font-bold">{inv.risk_level}</span>
                      <span className="text-xs text-gray-400">({inv.threat_score}%)</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(inv.status)}
                      <span className="text-xs capitalize font-semibold">{inv.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(inv.received).toLocaleTimeString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        className="p-1.5 hover:bg-gray-600 rounded text-cyan-400 transition-colors"
                        onClick={(e) => { e.stopPropagation(); setSelectedInvestigation(inv); }}
                        title="View Forensic Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        className="p-1.5 hover:bg-gray-600 rounded text-gray-400 hover:text-white transition-colors"
                        onClick={(e) => { e.stopPropagation(); setSelectedInvestigation(inv); setShowDeepAnalysisModal(true); }}
                        title="Deep Analysis Graph"
                      >
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Status Bar */}
        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-gray-400 bg-gray-800/50 p-3 rounded-lg border border-gray-700 font-mono">
          <div className="flex items-center gap-3">
            <span>👤 Security Analyst</span>
            <span>|</span>
            <span>🔍 Investigation Team</span>
            <span>|</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
              Online
            </span>
          </div>
          <div className="flex items-center gap-2">
            <RefreshCw size={14} className="animate-spin-slow" />
            <span>Auto-refresh: 30s</span>
          </div>
        </div>

        {/* Forensic Details Panel - Shown when investigation is selected */}
        {selectedInvestigation && (
          <div className="mt-6 bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start border-b border-gray-700 pb-3">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2 font-mono">
                  <Flag size={18} className="text-blue-400" />
                  Forensic Analysis: {selectedInvestigation.id}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Reported by: <span className="text-cyan-400 font-mono">{selectedInvestigation.reported_by}</span> • {new Date(selectedInvestigation.received).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => setSelectedInvestigation(null)}
                className="p-1 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - AI Explanation & Authentication */}
              <div className="space-y-4">
                {/* AI Explanation */}
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                  <h4 className="text-xs font-semibold text-gray-400 mb-2 font-mono uppercase tracking-wider">🤖 AI Threat Explanation</h4>
                  <p className="text-sm text-gray-200 leading-relaxed font-sans">{selectedInvestigation.ai_explanation}</p>
                </div>

                {/* Authentication Status */}
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                  <h4 className="text-xs font-semibold text-gray-400 mb-3 font-mono uppercase tracking-wider">🔐 Authentication Status</h4>
                  <div className="space-y-3 font-mono">
                    <AuthRow 
                      label="SPF" 
                      status={selectedInvestigation.authentication.spf.status}
                      detail={selectedInvestigation.authentication.spf.reason}
                    />
                    <AuthRow 
                      label="DKIM" 
                      status={selectedInvestigation.authentication.dkim.status}
                      detail={selectedInvestigation.authentication.dkim.reason}
                    />
                    <AuthRow 
                      label="DMARC" 
                      status={selectedInvestigation.authentication.dmarc.status}
                      detail={selectedInvestigation.authentication.dmarc.action}
                    />
                  </div>
                  {selectedInvestigation.authentication.spf.status === 'FAIL' && 
                   selectedInvestigation.authentication.dkim.status === 'FAIL' && (
                    <div className="mt-3 p-3 bg-red-900/20 border border-red-500/50 rounded-lg">
                      <p className="text-xs text-red-400 font-mono">
                        ⚠️ Critical authentication failure - This email failed all checks. High probability of spoofing.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Forensic Data & Actions */}
              <div className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-900 p-3 rounded-xl border border-gray-800">
                    <p className="text-[11px] text-gray-400">Sender IP</p>
                    <p className="text-sm font-bold text-red-400 mt-0.5">{selectedInvestigation.forensic_data.sender_ip}</p>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-xl border border-gray-800">
                    <p className="text-[11px] text-gray-400">ISP Network</p>
                    <p className="text-sm font-bold text-slate-200 mt-0.5 truncate">{selectedInvestigation.forensic_data.isp}</p>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-xl border border-gray-800">
                    <p className="text-[11px] text-gray-400">Origin Geolocation</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <MapPin size={14} className="text-blue-400" />
                      <p className="text-sm font-bold text-white">
                        {selectedInvestigation.forensic_data.geolocation.city}, {selectedInvestigation.forensic_data.geolocation.country}
                      </p>
                    </div>
                  </div>
                  <div className="bg-gray-900 p-3 rounded-xl border border-gray-800">
                    <p className="text-[11px] text-gray-400">Threat Type</p>
                    <p className="text-sm capitalize font-bold text-cyan-400 mt-0.5">{selectedInvestigation.type}</p>
                  </div>
                </div>

                {/* Headers */}
                <div className="bg-gray-900 p-4 rounded-xl border border-gray-800">
                  <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">📋 Email Headers</h4>
                  <div className="bg-gray-800 p-3 rounded-lg text-xs font-mono text-cyan-300 space-y-1 max-h-32 overflow-y-auto border border-gray-700">
                    {selectedInvestigation.forensic_data.headers.map((header, idx) => (
                      <div key={idx}>{header}</div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-1">
                  <button 
                    onClick={() => handleResolveAction(selectedInvestigation.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow flex items-center gap-2 transition-all active:scale-95 text-xs"
                  >
                    <CheckCircle size={16} />
                    Mark Resolved
                  </button>
                  <button 
                    onClick={() => handleBlockSenderAction(selectedInvestigation.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow flex items-center gap-2 transition-all active:scale-95 text-xs"
                  >
                    <Shield size={16} />
                    Block Sender
                  </button>
                  <button 
                    onClick={() => setShowReportModal(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow flex items-center gap-2 transition-all active:scale-95 text-xs"
                  >
                    <Download size={16} />
                    Export Report
                  </button>
                  <button 
                    onClick={() => setShowDeepAnalysisModal(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow flex items-center gap-2 transition-all active:scale-95 text-xs"
                  >
                    <Eye size={16} />
                    Deep Analysis
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Case Details & Relationship Graph Modal */}
      {showDeepAnalysisModal && selectedInvestigation && (
        <CaseDetailsModal
          caseData={{
            case_id: selectedInvestigation.id,
            subject: selectedInvestigation.subject,
            severity: selectedInvestigation.risk_level === 'critical' ? 'Critical' : 'High',
            status: selectedInvestigation.status,
            affected_user: selectedInvestigation.sender,
            threat_type: selectedInvestigation.threat_type
          }}
          onClose={() => setShowDeepAnalysisModal(false)}
          onGenerateReport={() => { setShowDeepAnalysisModal(false); setShowReportModal(true); }}
        />
      )}

      {/* Report Generation Modal */}
      {showReportModal && (
        <ReportGenerationModal
          scanData={{
            scan_id: 1042,
            case_id: selectedInvestigation?.id || 'INV-2026-0842',
            header_analysis: {
              subject: selectedInvestigation?.subject || 'Urgent: Invoice Payment Required',
              from: selectedInvestigation?.sender || 'john.doe@company.com'
            },
            ai_threat_detection: {
              threat_score: selectedInvestigation?.threat_score || 92,
              threat_severity: selectedInvestigation?.risk_level === 'critical' ? 'Critical' : 'High',
              policy_action: 'QUARANTINE'
            }
          }}
          onClose={() => setShowReportModal(false)}
        />
      )}

    </div>
  );
}

// Sub-components
const SidebarItem = ({ icon, label, active = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
      active ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold' : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
    } cursor-pointer`}
  >
    <span className="w-4 h-4 shrink-0">{icon}</span>
    <span>{label}</span>
  </div>
);

const StatCard = ({ label, value, color }) => (
  <div className={`${color} bg-opacity-10 border border-opacity-20 rounded-xl p-4 ${color.replace('bg-', 'border-')} shadow-lg space-y-1`}>
    <p className="text-gray-400 text-xs font-mono font-semibold uppercase">{label}</p>
    <p className="text-3xl font-extrabold font-mono text-white">{value}</p>
  </div>
);

const AuthRow = ({ label, status, detail }) => (
  <div className="flex items-center justify-between text-xs">
    <span className="font-semibold text-slate-300">{label}</span>
    <div className="flex items-center gap-2">
      <span className={`font-bold ${status === 'PASS' ? 'text-green-400' : 'text-red-400'}`}>
        {status === 'PASS' ? '✅ PASS' : '❌ FAIL'}
      </span>
      <span className="text-[11px] text-gray-500">{detail}</span>
    </div>
  </div>
);
