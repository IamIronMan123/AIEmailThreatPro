import React, { useState } from 'react';
import { 
  Send, CheckCircle, Clock, AlertCircle, 
  Mail, User, Calendar, Shield, FileText,
  Plus, Search, Filter, ChevronDown, Sparkles
} from 'lucide-react';

const EmployeeDashboard = () => {
  const [emailContent, setEmailContent] = useState('');
  const [sender, setSender] = useState('');
  const [subject, setSubject] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState('report');

  const [reports, setReports] = useState([
    {
      id: 1,
      to: 'security@company.com',
      subject: 'Suspicious Invoice from PayPal',
      status: 'resolved',
      date: '2026-08-28T10:30:00Z',
      resolution: '✅ Confirmed phishing - sender blocked',
      threat_score: 92,
      risk_level: 'critical'
    },
    {
      id: 2,
      to: 'security@company.com',
      subject: 'Login Alert from Unknown Device',
      status: 'investigating',
      date: '2026-08-28T09:15:00Z',
      resolution: '⏳ Under investigation - SOC team analyzing',
      threat_score: 78,
      risk_level: 'high'
    },
    {
      id: 3,
      to: 'security@company.com',
      subject: 'Suspicious Attachment in Email',
      status: 'resolved',
      date: '2026-08-27T14:20:00Z',
      resolution: '✅ Safe - false positive',
      threat_score: 15,
      risk_level: 'low'
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    
    const newReport = {
      id: reports.length + 1,
      to: 'security@company.com',
      subject: subject.trim() || 'Suspicious Email Report',
      status: 'investigating',
      date: new Date().toISOString(),
      resolution: '⏳ Report received by ZETP Gateway. Under automated inspection.',
      threat_score: 85,
      risk_level: 'high'
    };

    setReports([newReport, ...reports]);
    setEmailContent('');
    setSender('');
    setSubject('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  const getStatusBadge = (status) => {
    const badges = {
      resolved: 'bg-green-900/30 text-green-400 border-green-500',
      investigating: 'bg-yellow-900/30 text-yellow-400 border-yellow-500',
      pending: 'bg-gray-900/30 text-gray-400 border-gray-500'
    };
    return badges[status] || badges.pending;
  };

  const getRiskBadge = (level) => {
    const badges = {
      critical: 'bg-red-900/30 text-red-400 border-red-500',
      high: 'bg-orange-900/30 text-orange-400 border-orange-500',
      medium: 'bg-yellow-900/30 text-yellow-400 border-yellow-500',
      low: 'bg-green-900/30 text-green-400 border-green-500'
    };
    return badges[level] || badges.low;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 font-mono tracking-wide">
              <Shield className="w-6 h-6 text-blue-400" />
              Security Reporting Portal
            </h1>
            <p className="text-gray-400 text-sm mt-0.5">
              Report suspicious emails to our SOC team for immediate investigation
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800 px-4 py-2 rounded-xl border border-gray-700 font-mono">
            <User size={16} className="text-blue-400" />
            <span className="text-white">employee@company.com</span>
            <span className="text-gray-600">|</span>
            <span className="text-green-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Online
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700 shadow-lg space-y-1">
            <p className="text-xs text-gray-400 uppercase font-semibold">Total Reports</p>
            <p className="text-3xl font-extrabold text-white">{reports.length}</p>
          </div>
          <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700 shadow-lg space-y-1">
            <p className="text-xs text-gray-400 uppercase font-semibold">Resolved</p>
            <p className="text-3xl font-extrabold text-green-400">
              {reports.filter(r => r.status === 'resolved').length}
            </p>
          </div>
          <div className="bg-gray-800/80 p-4 rounded-xl border border-gray-700 shadow-lg space-y-1">
            <p className="text-xs text-gray-400 uppercase font-semibold">Under Investigation</p>
            <p className="text-3xl font-extrabold text-yellow-400">
              {reports.filter(r => r.status === 'investigating').length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-700 font-mono text-sm">
          {['report', 'history'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2.5 font-medium transition-colors ${
                activeTab === tab 
                  ? 'text-blue-400 border-b-2 border-blue-400 font-bold' 
                  : 'text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'report' ? '📧 Report New Email' : `📋 Report History (${reports.length})`}
            </button>
          ))}
        </div>

        {/* Report Form */}
        {activeTab === 'report' && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-xl space-y-4">
            <h2 className="text-lg font-semibold font-mono flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-400" />
              Report Suspicious Email
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Your Corporate Email</label>
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 text-gray-500" size={18} />
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white text-xs font-mono"
                      placeholder="employee@company.com"
                      value={sender}
                      onChange={(e) => setSender(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">Email Subject Line</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-gray-500" size={18} />
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white text-xs font-mono"
                      placeholder="Original email subject (e.g. 'Urgent Invoice')"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">Email Content (Forwarded Body & Headers)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-500" size={18} />
                  <textarea
                    className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 h-44 font-mono text-xs text-slate-100"
                    placeholder="Paste the full suspicious email content, headers, or sender links here..."
                    value={emailContent}
                    onChange={(e) => setEmailContent(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-2 font-bold shadow-md transition-all active:scale-95"
                >
                  <Send size={18} />
                  Submit Incident Report
                </button>
                <span className="text-xs text-gray-400 font-sans">
                  🛡️ ZETP SOC team and automated gateway respond within 5 minutes
                </span>
              </div>
            </form>
            
            {submitted && (
              <div className="mt-4 p-4 bg-green-900/30 border border-green-500/50 rounded-xl text-green-400 flex items-center gap-3 font-mono text-sm shadow-lg animate-pulse">
                <CheckCircle size={20} className="shrink-0" />
                <span>Report submitted successfully! Our SOC team and automated gateway are investigating this payload.</span>
              </div>
            )}
          </div>
        )}

        {/* Report History */}
        {activeTab === 'history' && (
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-xl space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold font-mono flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                My Incident Reports & Feedback History
              </h2>
            </div>
            
            <div className="space-y-3 font-mono">
              {reports.map((report) => (
                <div key={report.id} className="bg-gray-900 p-4 rounded-xl border border-gray-800 hover:border-gray-700 transition-colors shadow-md">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-semibold text-white text-sm">{report.subject}</p>
                        <span className={`px-2 py-0.5 text-xs rounded-full border font-bold ${getRiskBadge(report.risk_level)}`}>
                          {report.risk_level.toUpperCase()} ({report.threat_score}%)
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">To: {report.to}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-400 pt-1">
                        <span className="text-gray-500 flex items-center">
                          <Calendar size={13} className="mr-1" />
                          {new Date(report.date).toLocaleString()}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(report.status)}`}>
                          {report.status === 'resolved' ? '✅ Resolved' : '⏳ Investigating'}
                        </span>
                      </div>

                      <p className="text-xs text-gray-300 font-sans mt-2 bg-gray-800/60 p-2 rounded-lg border border-gray-700/60">
                        {report.resolution}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {reports.length === 0 && (
              <div className="text-center py-10 text-gray-500 font-mono">
                <Mail size={48} className="mx-auto mb-2 opacity-50" />
                <p>No reports submitted yet</p>
                <p className="text-xs font-sans text-gray-400">Report suspicious emails to help protect your organization</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default EmployeeDashboard;
