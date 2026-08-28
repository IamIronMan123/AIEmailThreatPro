import React, { useState } from 'react';
import { X, FileText, Download, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function ReportGenerationModal({ scanData, onClose }) {
  const [exported, setExported] = useState(false);
  const [exportFormat, setExportFormat] = useState('PDF');

  const handleExport = (format) => {
    setExportFormat(format);
    setExported(true);

    if (format === 'JSON') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(scanData || {}, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `ZETP_Investigation_Report_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } else if (format === 'CSV') {
      const iocs = scanData?.digital_forensics?.iocs || [];
      let csvContent = "data:text/csv;charset=utf-8,IOC ID,Type,Value,Severity,Description\n";
      iocs.forEach(i => {
        csvContent += `"${i.ioc_id}","${i.type}","${i.value}","${i.severity}","${i.description}"\n`;
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `ZETP_IOC_Extract_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F172A] border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#1E293B]/60">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white font-mono">
              ZETP Enterprise Forensic Investigation Report
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Preview */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 font-sans text-xs">
          
          {exported && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 font-mono text-center font-bold flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Report exported successfully in {exportFormat} format!</span>
            </div>
          )}

          {/* Report Document Box */}
          <div className="bg-[#0A0E1A] p-6 rounded-xl border border-slate-800 space-y-4 font-mono">
            
            <div className="border-b border-slate-800 pb-3 flex justify-between items-start">
              <div>
                <h3 className="text-sm font-bold text-white uppercase">Executive Forensic Report</h3>
                <p className="text-[11px] text-slate-400">Zero Email Threat Portal — Incident Investigation</p>
              </div>
              <span className="text-xs text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800 font-bold">
                SEVERITY: CRITICAL
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-cyan-400 uppercase">1. Executive Summary</h4>
              <p className="text-slate-300 font-sans leading-relaxed text-xs">
                On 27 Aug 2026, ZETP automated scanners intercepted a high-risk email payload targeting enterprise credentials.
                The email exhibited multi-vector threats including domain spoofing, SPF/DKIM authentication failures, and credential phishing links.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-cyan-400 uppercase">2. Email & Header Metadata</h4>
              <div className="bg-[#1E293B]/70 p-3 rounded border border-slate-800 space-y-1 text-[11px]">
                <p><span className="text-slate-400">Sender Address:</span> account-update@paypal-verify-alert.com</p>
                <p><span className="text-slate-400">Subject:</span> URGENT: Action Required - Verify Your Account Credentials Now</p>
                <p><span className="text-slate-400">SPF Result:</span> <span className="text-red-400 font-bold">FAIL</span></p>
                <p><span className="text-slate-400">DMARC Result:</span> <span className="text-red-400 font-bold">FAIL</span></p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-cyan-400 uppercase">3. Geolocation & Observed Infrastructure</h4>
              <p className="text-slate-300 font-sans text-xs">
                Observed origin relay hop IP 103.253.144.12 located in Moscow, Russia (StormHost High-Risk Network).
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-cyan-400 uppercase">4. Recommended Incident Containment</h4>
              <ul className="list-disc list-inside text-slate-300 font-sans text-xs space-y-1">
                <li>Block domain paypal-verify-alert.com at email gateway.</li>
                <li>Block IP 103.253.144.12 on enterprise edge firewalls.</li>
                <li>Reset passwords for target user employee@company.com.</li>
              </ul>
            </div>

          </div>

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <span className="text-slate-400 font-mono text-xs">Select Export Format:</span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('PDF')}
                className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold text-xs rounded-lg flex items-center space-x-1.5 shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
              <button
                onClick={() => handleExport('JSON')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs rounded-lg border border-slate-700 flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export JSON</span>
              </button>
              <button
                onClick={() => handleExport('CSV')}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono font-bold text-xs rounded-lg border border-slate-700 flex items-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
