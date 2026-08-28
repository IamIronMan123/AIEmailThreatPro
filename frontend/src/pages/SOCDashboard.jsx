import React, { useState } from 'react';
import { 
  AlertCircle, CheckCircle, Clock, Filter, Search, 
  Download, MoreVertical, Eye, Shield, User, Mail,
  CheckCircle2, ShieldBan, FileText, ArrowRight, X, Sparkles
} from 'lucide-react';
import CaseDetailsModal from '../components/cases/CaseDetailsModal';
import ReportGenerationModal from '../components/reports/ReportGenerationModal';

const SOCDashboard = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvestigation, setSelectedInvestigation] = useState(null);
  const [showDeepAnalysisModal, setShowDeepAnalysisModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  // Real fields with interactive state
  const [investigations, setInvestigations] = useState([
    {
      id: 'INV-2026-0842',
      case_id: 'INV-2026-0842',
      sender: 'john.doe@company.com',
      recipient: 'security@company.com',
      recipient_email: 'security@company.com',
      subject: 'Urgent: Invoice Payment Required',
      received: '2026-08-28T10:30:00Z',
      threat_score: 92,
      risk_level: 'critical',
      severity: 'Critical',
      status: 'quarantined',
      policy_action: 'QUARANTINED',
      type: 'phishing',
      threat_type: 'Credential Phishing',
      ai_explanation: 'Fake sender domain (paypal-verify.com), urgency language detected, executable attachment flagged',
      forensic_data: {
        sender_ip: '45.33.22.184',
        geolocation: 'Russia',
        authentication: 'SPF Fail',
        headers: [
          'X-Phishing-Score: 92',
          'X-Forensic-ID: fh3k9s2d',
          'Authentication-Results: spf=fail dkim=fail dmarc=fail',
          'Received: from mail.darknet-drop.com ([45.33.22.184]) by mx.enterprise-corp.com'
        ]
      }
    },
    {
      id: 'INV-2026-0841',
      case_id: 'INV-2026-0841',
      sender: 'alice.wang@company.com',
      recipient: 'security@company.com',
      recipient_email: 'security@company.com',
      subject: 'Suspicious Login Attempt',
      received: '2026-08-28T09:15:00Z',
      threat_score: 78,
      risk_level: 'high',
      severity: 'High',
      status: 'investigating',
      policy_action: 'QUARANTINED',
      type: 'compromised_account',
      threat_type: 'Account Compromise / BEC',
      ai_explanation: 'Unusual login location (Brazil), multiple failed attempts, anomalous IP routing',
      forensic_data: {
        sender_ip: '189.34.12.90',
        geolocation: 'Brazil',
        authentication: 'Passed',
        headers: [
          'X-Forensic-ID: jd83n2ks',
          'Authentication-Results: spf=pass dkim=pass dmarc=pass',
          'Received: from node.brazil-relay.net ([189.34.12.90])'
        ]
      }
    },
    {
      id: 'INV-2026-0840',
      case_id: 'INV-2026-0840',
      sender: 'marketing@external.com',
      recipient: 'security@company.com',
      recipient_email: 'security@company.com',
      subject: 'Partnership Opportunity',
      received: '2026-08-28T08:00:00Z',
      threat_score: 15,
      risk_level: 'low',
      severity: 'Low',
      status: 'resolved',
      policy_action: 'ALLOWED',
      type: 'spam',
      threat_type: 'Legitimate / Low Risk',
      ai_explanation: 'Marketing email, no malicious indicators, authentic signature verified',
      forensic_data: {
        sender_ip: '192.168.1.1',
        geolocation: 'US',
        authentication: 'Passed',
        headers: ['X-Spam-Score: 15', 'Authentication-Results: spf=pass dkim=pass']
      }
    }
  ]);

  const getRiskColor = (level) => {
    const colors = {
      critical: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return colors[level] || 'bg-gray-500';
  };

  const getStatusIcon = (status) => {
    const icons = {
      quarantined: <Shield className="w-4 h-4 text-red-400" />,
      investigating: <Clock className="w-4 h-4 text-yellow-400" />,
      resolved: <CheckCircle className="w-4 h-4 text-green-400" />
    };
    return icons[status] || <AlertCircle className="w-4 h-4 text-gray-400" />;
  };

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
    alert(`Sender domain blocked across corporate firewalls and added to IOC blacklist.`);
  };

  const handleExportCsv = () => {
    let csv = "data:text/csv;charset=utf-8,Case ID,Sender,Subject,Threat Score,Risk Level,Status,Time,IP,Geolocation\n";
    investigations.forEach(inv => {
      csv += `"${inv.id}","${inv.sender}","${inv.subject}","${inv.threat_score}","${inv.risk_level}","${inv.status}","${inv.received}","${inv.forensic_data.sender_ip}","${inv.forensic_data.geolocation}"\n`;
    });
    const encodedUri = encodeURI(csv);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `SOC_Investigation_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const filteredInvestigations = investigations.filter(inv => {
    const matchesSearch = 
      inv.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && inv.status === activeTab;
  });

  const stats = {
    total: investigations.length,
    critical: investigations.filter(i => i.risk_level === 'critical').length,
    quarantine: investigations.filter(i => i.status === 'quarantined').length,
    resolved: investigations.filter(i => i.status === 'resolved').length
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-wide">SOC Investigation Dashboard</h1>
          <p className="text-gray-400 text-sm">Real-time threat monitoring and forensic analysis</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={handleExportCsv}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-2 font-mono text-sm font-semibold transition-colors shadow-md"
          >
            <Download size={18} />
            Export Report
          </button>
          <button 
            onClick={() => alert("Active SOC Team: 3 Analysts on duty. Inbound IT Forwarding rules 100% active.")}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg flex items-center gap-2 font-mono text-sm text-gray-200 transition-colors"
          >
            <User size={18} />
            Analysts (3)
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Investigations', value: stats.total, color: 'text-blue-400', border: 'border-blue-500/30' },
          { label: 'Critical Threats', value: stats.critical, color: 'text-red-400', border: 'border-red-500/30' },
          { label: 'In Quarantine', value: stats.quarantine, color: 'text-orange-400', border: 'border-orange-500/30' },
          { label: 'Resolved', value: stats.resolved, color: 'text-green-400', border: 'border-green-500/30' }
        ].map((stat, idx) => (
          <div key={idx} className={`bg-gray-800/80 rounded-xl p-4 border ${stat.border} shadow-lg space-y-1`}>
            <p className="text-gray-400 text-xs font-mono font-semibold uppercase">{stat.label}</p>
            <p className={`text-3xl font-extrabold font-mono ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Real-time Alert */}
      <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="animate-pulse w-2.5 h-2.5 bg-red-500 rounded-full"></div>
          <span className="text-red-400 font-medium font-mono text-sm">
            ⚠️ HIGH-RISK ALERT: 3 new critical threats detected in last 5 minutes (Forwarded via Gmail & Outlook)
          </span>
        </div>
        <span className="text-xs text-red-300 font-mono bg-red-950/80 px-2.5 py-1 rounded border border-red-800">
          Requires immediate attention
        </span>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
          <input
            type="text"
            placeholder="Search by subject, sender, or ID..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 font-mono"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'quarantined', 'investigating', 'resolved'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-lg text-sm font-mono font-semibold transition-all ${
                activeTab === tab 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 border border-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
          <button 
            onClick={() => setSearchTerm('')}
            className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg flex items-center gap-2 text-sm text-gray-300 hover:bg-gray-700 font-mono"
          >
            <Filter size={16} />
            Reset Filter
          </button>
        </div>
      </div>

      {/* Investigations Table */}
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
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
                  <td className="px-4 py-3 text-sm font-bold text-cyan-400">{inv.id}</td>
                  <td className="px-4 py-3 text-sm text-gray-200">
                    <div className="flex items-center gap-1.5">
                      <Mail size={14} className="text-gray-400 shrink-0" />
                      <span className="truncate max-w-[180px]">{inv.sender}</span>
                    </div>
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
                        onClick={(e) => { e.stopPropagation(); setSelectedInvestigation(inv); }}
                        className="p-1.5 hover:bg-gray-600 rounded text-cyan-400 transition-colors"
                        title="View Forensic Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setSelectedInvestigation(inv); setShowDeepAnalysisModal(true); }}
                        className="p-1.5 hover:bg-gray-600 rounded text-gray-400 hover:text-white transition-colors"
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
      </div>

      {/* AI Explanation & Forensic Data (shown when selected) */}
      {selectedInvestigation && (
        <div className="mt-6 bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-2xl space-y-4">
          <div className="flex justify-between items-start border-b border-gray-700 pb-3">
            <div>
              <h3 className="text-lg font-semibold font-mono flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Forensic Analysis & Triage: {selectedInvestigation.id}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Subject: <strong className="text-white">{selectedInvestigation.subject}</strong> | Sender: <strong className="text-cyan-400">{selectedInvestigation.sender}</strong>
              </p>
            </div>
            <button 
              onClick={() => setSelectedInvestigation(null)}
              className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2 font-mono">AI Threat Explanation</h4>
              <p className="text-sm bg-gray-900 p-3 rounded-lg border border-gray-800 text-gray-200 leading-relaxed font-sans">
                {selectedInvestigation.ai_explanation}
              </p>
              
              <div className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs">
                <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                  <p className="text-xs text-gray-400">Sender IP</p>
                  <p className="text-sm font-bold text-red-400">{selectedInvestigation.forensic_data.sender_ip}</p>
                </div>
                <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                  <p className="text-xs text-gray-400">Geolocation</p>
                  <p className="text-sm font-bold text-white">{selectedInvestigation.forensic_data.geolocation}</p>
                </div>
                <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                  <p className="text-xs text-gray-400">Authentication</p>
                  <p className="text-sm font-bold text-red-400">{selectedInvestigation.forensic_data.authentication}</p>
                </div>
                <div className="bg-gray-900 p-3 rounded-lg border border-gray-800">
                  <p className="text-xs text-gray-400">Threat Type</p>
                  <p className="text-sm capitalize font-bold text-cyan-400">{selectedInvestigation.type}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2 font-mono">SOC Action & Containment</h4>
              <div className="flex flex-wrap gap-2 font-mono text-xs">
                <button 
                  onClick={() => handleResolveAction(selectedInvestigation.id)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold shadow transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <CheckCircle2 size={15} />
                  Mark as Resolved
                </button>
                <button 
                  onClick={() => handleBlockSenderAction(selectedInvestigation.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <ShieldBan size={15} />
                  Block Sender Domain
                </button>
                <button 
                  onClick={() => setShowReportModal(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Download size={15} />
                  Download Forensic Report
                </button>
                <button 
                  onClick={() => setShowDeepAnalysisModal(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold shadow transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <Eye size={15} />
                  Deep Analysis Graph
                </button>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-400 mb-2 font-mono">Email Headers Inspection</h4>
                <div className="bg-gray-900 p-3 rounded-lg text-xs font-mono text-gray-300 space-y-1 border border-gray-800 max-h-36 overflow-y-auto">
                  {selectedInvestigation.forensic_data.headers.map((header, idx) => (
                    <div key={idx} className="text-cyan-300">{header}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
};

export default SOCDashboard;
