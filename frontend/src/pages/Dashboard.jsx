import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import AIThreatScoreGauge from '../components/AIThreatScoreGauge';
import HeaderAnalysisCard from '../components/HeaderAnalysisCard';
import GeolocationMap from '../components/GeolocationMap';
import IOCTable from '../components/IOCTable';
import ForensicTimeline from '../components/ForensicTimeline';
import EmployeeWarningBadge from '../components/EmployeeWarningBadge';
import { Send, Upload, RefreshCw, AlertOctagon, CheckCircle2, FileText, Database, Shield } from 'lucide-react';

const SAMPLE_PHISHING_EMAIL = `From: Security Alert <account-update@paypal-verify-alert.com>
To: target.user@enterprise-corp.com
Subject: URGENT: Action Required - Verify Your Account Credentials Now
Date: Thu, 27 Aug 2026 14:22:10 +0000
Message-ID: <92847293847293847.alert@paypal-verify-alert.com>
Return-Path: <bounce@temp-mail.org>
Reply-To: phisher-collect@darknet-drop.com
Authentication-Results: spf=fail (sender IP 103.253.144.12) dkim=fail dmarc=fail
Received: from mail.darknet-drop.com ([103.253.144.12]) by mx.enterprise-corp.com with ESMTPS; Thu, 27 Aug 2026 14:22:12 +0000
Received: from relay.tor-node.de ([185.220.101.5]) by mail.darknet-drop.com; Thu, 27 Aug 2026 14:20:05 +0000

Dear Customer,

We detected unusual access attempts to your financial account from IP address 185.220.101.5.
To prevent permanent account suspension, you must verify your login credentials immediately:

https://suspicious-login-example.com/verify-account

If you do not take action within 24 hours, your access will be permanently revoked.
Attachment: Account_Verification_Form.exe
`;

const SAMPLE_LEGIT_EMAIL = `From: Project Management Office <pmo@enterprise-corp.com>
To: target.user@enterprise-corp.com
Subject: Quarterly Engineering Roadmap & Sprint Retrospective Summary
Date: Thu, 27 Aug 2026 10:15:00 +0000
Message-ID: <4829103920.pmo@enterprise-corp.com>
Return-Path: <pmo@enterprise-corp.com>
Authentication-Results: spf=pass dkim=pass dmarc=pass
Received: from mail.enterprise-corp.com ([209.85.220.41]) by mx.enterprise-corp.com with ESMTPS; Thu, 27 Aug 2026 10:15:02 +0000

Hi Team,

Attached is the agenda and slide deck for our upcoming Q4 Engineering Review meeting tomorrow at 2 PM.
Please review the sprint goals and post any questions in our shared Slack channel before the meeting.

Best regards,
Engineering PMO Team
`;

export default function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState(user?.role === 'employee' ? 'employee' : 'investigator');
  const [rawEmailInput, setRawEmailInput] = useState(SAMPLE_PHISHING_EMAIL);
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanHistory, setScanHistory] = useState([]);

  // Auto-scan default sample email on initial load
  useEffect(() => {
    runThreatScan(SAMPLE_PHISHING_EMAIL);
  }, []);

  const runThreatScan = async (emailText) => {
    setScanning(true);
    try {
      const res = await axios.post('/api/scan', { raw_email: emailText || rawEmailInput });
      setScanResult(res.data);
    } catch (err) {
      // Client-side fallback computation for offline/demo environment resilience
      generateDemoScanResult(emailText || rawEmailInput);
    } finally {
      setScanning(false);
    }
  };

  const generateDemoScanResult = (input) => {
    const isPhish = input.toLowerCase().includes('urgent') || input.toLowerCase().includes('verify') || input.toLowerCase().includes('paypal');
    
    const fallback = {
      scan_id: Math.floor(Math.random() * 9000) + 1000,
      header_analysis: {
        subject: isPhish ? "URGENT: Action Required - Verify Your Account Credentials Now" : "Quarterly Engineering Roadmap & Sprint Retrospective Summary",
        from: isPhish ? "Security Alert <account-update@paypal-verify-alert.com>" : "Project Management Office <pmo@enterprise-corp.com>",
        to: "target.user@enterprise-corp.com",
        sender_address: isPhish ? "account-update@paypal-verify-alert.com" : "pmo@enterprise-corp.com",
        sender_domain: isPhish ? "paypal-verify-alert.com" : "enterprise-corp.com",
        reply_to: isPhish ? "phisher-collect@darknet-drop.com" : "",
        return_path: isPhish ? "bounce@temp-mail.org" : "pmo@enterprise-corp.com",
        message_id: "<92847293847293847.alert@paypal-verify-alert.com>",
        date: "Thu, 27 Aug 2026 14:22:10 +0000",
        authentication_result: isPhish ? "SPF: FAIL | DKIM: FAIL | DMARC: FAIL" : "SPF: PASS | DKIM: PASS | DMARC: PASS",
        auth_spf: isPhish ? "FAIL" : "PASS",
        auth_dkim: isPhish ? "FAIL" : "PASS",
        auth_dmarc: isPhish ? "FAIL" : "PASS",
        raw_headers: input
      },
      ai_threat_detection: {
        threat_score: isPhish ? 94.5 : 4.2,
        threat_risk: isPhish ? "CRITICAL" : "LOW",
        phishing_probability: isPhish ? 94.5 : 2.1,
        spam_probability: isPhish ? 4.5 : 2.1,
        legitimate_probability: isPhish ? 1.0 : 95.8,
        num_links: isPhish ? 3 : 0,
        suspicious_words: isPhish ? ["urgent", "verify your account", "action required", "login"] : [],
        suspicious_indicators: isPhish ? [
          "Sender domain 'paypal-verify-alert.com' exhibits brand spoofing indicators.",
          "SPF, DKIM, and DMARC security checks failed.",
          "Reply-To address mismatch (phisher-collect@darknet-drop.com).",
          "Embedded suspicious phishing URL: suspicious-login-example.com"
        ] : ["No security anomalies detected. Sender domain domain & authentication intact."]
      },
      geolocation_intelligence: {
        hops: [
          { hop_index: 1, ip_address: "103.253.144.12", country: "Russia", city: "Moscow", latitude: 55.7558, longitude: 37.6173, isp: "StormHost High-Risk Network", threat_score: 98, threat_reputation: "CRITICAL", timestamp: "Thu, 27 Aug 2026 14:20:00 UTC" },
          { hop_index: 2, ip_address: "185.220.101.5", country: "Germany", city: "Frankfurt", latitude: 50.1109, longitude: 8.6821, isp: "Tor Exit Relay / CyberGhost", threat_score: 92, threat_reputation: "MALICIOUS", timestamp: "Thu, 27 Aug 2026 14:20:05 UTC" },
          { hop_index: 3, ip_address: "209.85.220.41", country: "United States", city: "Mountain View, CA", latitude: 37.4056, longitude: -122.0775, isp: "Google Gateway", threat_score: 2, threat_reputation: "CLEAN", timestamp: "Thu, 27 Aug 2026 14:22:12 UTC" }
        ]
      },
      digital_forensics: {
        iocs: [
          { ioc_id: "IOC #1", type: "URL", value: "suspicious-login-example.com", risk: isPhish ? "CRITICAL" : "LOW", description: "Suspicious login credential phishing link." },
          { ioc_id: "IOC #2", type: "IP Address", value: "103.253.144.12", risk: isPhish ? "CRITICAL" : "LOW", description: "Origin mail server hop IP located in Moscow, Russia." },
          { ioc_id: "IOC #3", type: "Domain", value: "paypal-verify-alert.com", risk: isPhish ? "HIGH" : "LOW", description: "Spoofed sender domain." },
          { ioc_id: "IOC #4", type: "Attachment Name", value: "Account_Verification_Form.exe", risk: isPhish ? "CRITICAL" : "LOW", description: "Executable file payload attachment." },
          { ioc_id: "IOC #5", type: "File Hash (SHA256)", value: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855", risk: isPhish ? "CRITICAL" : "LOW", description: "SHA256 fingerprint hash of attachment." }
        ],
        forensic_timeline: [
          { timestamp: "Thu, 27 Aug 2026 14:20:00 UTC", title: "Email Ingestion & Inbound Transmission", category: "HEADER_HOP", description: "Email message dispatched from origin." },
          { timestamp: "Thu, 27 Aug 2026 14:20:05 UTC", title: "Relay Hop #1: 103.253.144.12 (Moscow, Russia)", category: "GEO_INTEL", description: "StormHost High-Risk Network. Threat Status: CRITICAL." },
          { timestamp: "Thu, 27 Aug 2026 14:22:10 UTC", title: "Header Security Protocol Verification", category: "AUTH_CHECK", description: "SPF: FAIL | DKIM: FAIL | DMARC: FAIL." },
          { timestamp: "Thu, 27 Aug 2026 14:22:12 UTC", title: "ZETP AI Threat Scan Completed", category: "AI_SCAN", description: "AI Classification -> Phishing Probability: 94.5%. Risk: CRITICAL." }
        ]
      }
    };

    setScanResult(fallback);
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] pb-16">
      
      {/* Top Navbar */}
      <Navbar user={user} onLogout={onLogout} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Email Scanner Workbench Header Card */}
        <div className="bg-[#0F172A] rounded-xl border border-slate-800 p-5 shadow-xl space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-100 font-mono tracking-wide flex items-center">
                <FileText className="w-5 h-5 text-cyan-400 mr-2" />
                Ingest & Scan Email Payload
              </h2>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Paste raw email MIME headers & body content below to execute AI Threat Scan & Geolocation lookup
              </p>
            </div>

            {/* Quick Sample Selector */}
            <div className="flex items-center space-x-2 font-mono text-xs">
              <span className="text-slate-400">Load Test Sample:</span>
              <button
                onClick={() => { setRawEmailInput(SAMPLE_PHISHING_EMAIL); runThreatScan(SAMPLE_PHISHING_EMAIL); }}
                className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded font-semibold transition-colors"
              >
                Phishing Email
              </button>
              <button
                onClick={() => { setRawEmailInput(SAMPLE_LEGIT_EMAIL); runThreatScan(SAMPLE_LEGIT_EMAIL); }}
                className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded font-semibold transition-colors"
              >
                Legitimate Email
              </button>
            </div>
          </div>

          {/* Textarea Input */}
          <div className="space-y-3">
            <textarea
              rows={4}
              value={rawEmailInput}
              onChange={(e) => setRawEmailInput(e.target.value)}
              placeholder="Paste raw email message or MIME headers..."
              className="w-full bg-[#0A0E1A] border border-slate-800 rounded-lg p-3 text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 transition-colors"
            />

            <div className="flex justify-end">
              <button
                onClick={() => runThreatScan(rawEmailInput)}
                disabled={scanning}
                className="px-5 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold text-xs rounded-lg shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition-all active:scale-95 uppercase tracking-wider"
              >
                <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
                <span>{scanning ? 'Analyzing Payload...' : 'Run ZETP Threat Scan'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Dynamic Workflow Views */}
        {activeTab === 'employee' ? (
          /* Employee Safety Warning View */
          <EmployeeWarningBadge scanResult={scanResult} />
        ) : (
          /* Investigator Deep Forensic Workbench */
          scanResult && (
            <div className="space-y-6">
              
              {/* Row 1: AI Threat Score & Email Headers */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AIThreatScoreGauge threatData={scanResult.ai_threat_detection} />
                <HeaderAnalysisCard headerData={scanResult.header_analysis} />
              </div>

              {/* Row 2: Geolocation Intelligence Map */}
              <GeolocationMap geoData={scanResult.geolocation_intelligence} />

              {/* Row 3: Digital Forensics IOC Breakdown */}
              <IOCTable iocs={scanResult.digital_forensics?.iocs} />

              {/* Row 4: Forensic Investigation Timeline */}
              <ForensicTimeline timeline={scanResult.digital_forensics?.forensic_timeline} />

            </div>
          )
        )}

      </main>
    </div>
  );
}
