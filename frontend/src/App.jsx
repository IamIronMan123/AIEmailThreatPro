import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import AppShell from './components/layout/AppShell';
import LoginPage from './pages/LoginPage';
import InvestigatorDashboard from './pages/InvestigatorDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import OverviewModule from './pages/OverviewModule';
import EmailAnalysisModule from './pages/EmailAnalysisModule';
import ThreatDetectionModule from './pages/ThreatDetectionModule';
import GeolocationModule from './pages/GeolocationModule';
import DigitalForensicsModule from './pages/DigitalForensicsModule';
import InvestigationsListModule from './pages/InvestigationsListModule';
import UserManagementModule from './pages/UserManagementModule';
import EmployeeView from './pages/EmployeeView';
import SOCDashboard from './pages/SOCDashboard';
import CaseDetailsModal from './components/cases/CaseDetailsModal';
import ReportGenerationModal from './components/reports/ReportGenerationModal';

const SAMPLE_PHISHING = `From: Security Alert <account-update@paypal-verify-alert.com>
To: employee@company.com
Subject: URGENT: Action Required - Verify Your Account Credentials Now
Date: Thu, 27 Aug 2026 14:22:10 +0000
Message-ID: <92847293847293847.alert@paypal-verify-alert.com>
Return-Path: <bounce@temp-mail.org>
Reply-To: phisher-collect@darknet-drop.com
Authentication-Results: spf=fail dkim=fail dmarc=fail
Received: from mail.darknet-drop.com ([103.253.144.12]) by mx.enterprise-corp.com; Thu, 27 Aug 2026 14:22:12 +0000

Dear Customer,

We detected unusual access attempts to your financial account from IP address 185.220.101.5.
To prevent permanent account suspension, you must verify your login credentials immediately:

https://suspicious-login-example.com/verify-account

If you do not take action within 24 hours, your access will be permanently revoked.
Attachment: Account_Verification_Form.exe
`;

function InvestigatorAppWrapper() {
  const [user, setUser] = useState({
    username: 'analyst',
    email: 'security@company.com',
    role: 'analyst',
    display_name: 'Lead Security Analyst'
  });
  const [activeModule, setActiveModule] = useState('overview');
  const [viewMode, setViewMode] = useState('analyst');
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    handleRunScan(SAMPLE_PHISHING);
  }, []);

  const handleRunScan = async (emailText) => {
    setScanning(true);
    try {
      const res = await axios.post('/api/scan', { raw_email: emailText });
      setScanResult(res.data);
    } catch (err) {
      setScanResult({
        scan_id: 1042,
        case_id: 'CASE-2026-00421',
        header_analysis: {
          subject: 'URGENT: Action Required - Verify Your Account Credentials Now',
          from: 'Security Alert <account-update@paypal-verify-alert.com>',
          to: 'employee@company.com',
          sender_address: 'account-update@paypal-verify-alert.com',
          sender_domain: 'paypal-verify-alert.com',
          reply_to: 'phisher-collect@darknet-drop.com',
          return_path: 'bounce@temp-mail.org',
          message_id: '<92847293847293847.alert@paypal-verify-alert.com>',
          date: 'Thu, 27 Aug 2026 14:22:10 +0000',
          auth_spf: 'FAIL',
          auth_dkim: 'FAIL',
          auth_dmarc: 'FAIL',
          raw_headers: emailText
        },
        ai_threat_detection: {
          threat_score: 94.5,
          threat_severity: 'Critical',
          policy_action: 'QUARANTINE',
          action_label: 'Quarantined & Blocked',
          action_badge_color: 'red',
          action_description: 'High-risk or fake email detected! Automatically quarantined and blocked from reaching user inbox.',
          action_status: 'QUARANTINED_BLOCKED',
          phishing_probability: 94.5,
          spam_probability: 4.5,
          malware_probability: 88.0,
          legitimate_probability: 1.0,
          detection_characteristics: {
            fake_sender_info: { detected: true, label: "Fake Sender Information", details: "SPF/DKIM/DMARC domain alignment checks failed. Sender identity spoofed." },
            phishing_links: { detected: true, label: "Phishing Links", details: "Found 1 embedded link(s) matching credential harvesting patterns." },
            suspicious_messages: { detected: true, label: "Suspicious Words / Coercive Messages", details: "High-urgency social engineering triggers detected." },
            malicious_attachments: { detected: true, label: "Malicious Attachments", details: "Executable binary payload (.exe) detected." },
            unusual_patterns: { detected: true, label: "Unusual Email Patterns", details: "Reply-To address mismatch and anomalous relay routing observed." }
          },
          classifications: [
            { category: 'Phishing', probability: 94.5, confidence: 'High', risk_level: 'Critical', description: 'Credential harvesting lure targeting corporate accounts.' },
            { category: 'Malware', probability: 88.0, confidence: 'High', risk_level: 'High', description: 'Malicious payload attachment or execution script.' },
            { category: 'Credential Theft', probability: 92.5, confidence: 'High', risk_level: 'Critical', description: 'Spoofed portal capturing authentication tokens.' },
            { category: 'Business Email Compromise', probability: 45.0, confidence: 'Medium', risk_level: 'Medium', description: 'Executive or vendor domain impersonation.' },
            { category: 'Spoofing', probability: 96.0, confidence: 'High', risk_level: 'High', description: 'Falsified sender domain headers (SPF/DMARC fail).' },
            { category: 'Spam', probability: 4.5, confidence: 'Medium', risk_level: 'Low', description: 'Bulk unsolicited marketing mail.' },
            { category: 'Suspicious Attachment', probability: 90.0, confidence: 'High', risk_level: 'Critical', description: 'Executable payload filename extension.' },
            { category: 'Legitimate', probability: 1.0, confidence: 'Low', risk_level: 'Informational', description: 'Normal enterprise communication.' }
          ],
          explainable_findings: [
            { id: '1', title: 'Suspicious Credential Phishing URL', description: 'Embedded hyperlink targets untrusted domain containing login verification lure.', category: 'Payload Anomaly', severity: 'Critical' },
            { id: '2', title: 'SPF & DMARC Validation Failure', description: 'Origin IP not authorized under domain SPF record.', category: 'Authentication Failure', severity: 'Critical' },
            { id: '3', title: 'Reply-To Domain Mismatch', description: 'Header From address differs from designated Reply-To domain.', category: 'Identity Anomaly', severity: 'High' },
            { id: '4', title: 'Executable File Attachment', description: 'MIME attachment filename contains .exe extension.', category: 'Malware Risk', severity: 'Critical' }
          ]
        },
        geolocation_intelligence: {
          hops: [
            { hop_index: 1, ip_address: '103.253.144.12', country: 'Russia', city: 'Moscow', latitude: 55.7558, longitude: 37.6173, isp: 'StormHost High-Risk Infrastructure', asn: 'AS205100', threat_score: 98, threat_reputation: 'CRITICAL', timestamp: '27 Aug 14:20 UTC' },
            { hop_index: 2, ip_address: '185.220.101.5', country: 'Germany', city: 'Frankfurt', latitude: 50.1109, longitude: 8.6821, isp: 'Tor Exit Relay Network', asn: 'AS62240', threat_score: 84, threat_reputation: 'MALICIOUS', timestamp: '27 Aug 14:20 UTC' },
            { hop_index: 3, ip_address: '209.85.220.41', country: 'United States', city: 'Mountain View, CA', latitude: 37.4056, longitude: -122.0775, isp: 'Google Gateway LLC', asn: 'AS15169', threat_score: 2, threat_reputation: 'CLEAN', timestamp: '27 Aug 14:22 UTC' }
          ]
        },
        digital_forensics: {
          iocs: [
            { ioc_id: 'IOC-001', type: 'URL', value: 'suspicious-login-example.com', severity: 'Critical', source: 'Email Body', first_seen: '27 Aug 14:22 UTC', last_seen: '27 Aug 14:22 UTC', status: 'Active', description: 'Phishing login link.' },
            { ioc_id: 'IOC-002', type: 'IP Address', value: '103.253.144.12', severity: 'Critical', source: 'Relay Hop #1', first_seen: '27 Aug 14:20 UTC', last_seen: '27 Aug 14:22 UTC', status: 'Active', description: 'Moscow origin relay.' },
            { ioc_id: 'IOC-003', type: 'Domain', value: 'paypal-verify-alert.com', severity: 'High', source: 'Header From', first_seen: '27 Aug 14:20 UTC', last_seen: '27 Aug 14:22 UTC', status: 'Active', description: 'Spoofed sender domain.' },
            { ioc_id: 'IOC-004', type: 'Attachment', value: 'Account_Verification_Form.exe', severity: 'Critical', source: 'MIME Attachment Payload', first_seen: '27 Aug 14:22 UTC', last_seen: '27 Aug 14:22 UTC', status: 'Active', description: 'Executable file payload.' },
            { ioc_id: 'IOC-005', type: 'File Hash', value: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', severity: 'Critical', source: 'SHA-256 Digest', first_seen: '27 Aug 14:22 UTC', last_seen: '27 Aug 14:22 UTC', status: 'Active', description: 'SHA-256 payload hash.' }
          ],
          forensic_timeline: [
            { timestamp: '27 Aug 2026 14:20:00 UTC', event: 'Email Dispatched', category: 'HEADER_HOP', evidence: 'Sender: account-update@paypal-verify-alert.com', severity: 'Low' },
            { timestamp: '27 Aug 2026 14:20:05 UTC', event: 'Relay Hop Detected (#1)', category: 'GEO_INTEL', evidence: 'IP: 103.253.144.12 (Moscow, Russia)', severity: 'Critical' },
            { timestamp: '27 Aug 2026 14:22:10 UTC', event: 'SPF/DKIM/DMARC Verification Failed', category: 'AUTH_CHECK', evidence: 'SPF: FAIL | DKIM: FAIL | DMARC: FAIL', severity: 'High' },
            { timestamp: '27 Aug 2026 14:22:12 UTC', event: 'AI Threat Scan Completed', category: 'AI_SCAN', evidence: 'Threat Score: 94.5/100 | Phishing Prob: 94.5%', severity: 'Critical' }
          ]
        }
      });
    } finally {
      setScanning(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('zetp_token');
    localStorage.removeItem('zetp_user');
    navigate('/');
  };

  return (
    <AppShell
      activeModule={activeModule}
      setActiveModule={setActiveModule}
      viewMode={viewMode}
      setViewMode={(mode) => {
        setViewMode(mode);
        if (mode === 'employee') navigate('/employee');
        else navigate('/investigator');
      }}
      user={user}
      onLogout={handleLogout}
      scanResult={scanResult}
    >
      {activeModule === 'overview' && (
        <InvestigatorDashboard
          onNavigateModule={(m) => setActiveModule(m)}
          scanResult={scanResult}
        />
      )}

      {activeModule === 'email-analysis' && (
        <EmailAnalysisModule
          scanResult={scanResult}
          onRunScan={handleRunScan}
          scanning={scanning}
        />
      )}

      {activeModule === 'threat-detection' && (
        <ThreatDetectionModule scanResult={scanResult} />
      )}

      {activeModule === 'geolocation' && (
        <GeolocationModule scanResult={scanResult} />
      )}

      {activeModule === 'digital-forensics' && (
        <DigitalForensicsModule
          scanResult={scanResult}
          onGenerateReport={() => setShowReportModal(true)}
        />
      )}

      {activeModule === 'investigations' && (
        <InvestigationsListModule
          onOpenCase={(c) => setSelectedCase(c)}
          onGenerateReport={() => setShowReportModal(true)}
        />
      )}

      {activeModule === 'users' && (
        <UserManagementModule
          onOpenEmployeeThreats={() => {
            setActiveModule('investigations');
          }}
        />
      )}

      {/* Case Details Modal */}
      {selectedCase && (
        <CaseDetailsModal
          caseData={selectedCase}
          onClose={() => setSelectedCase(null)}
          onGenerateReport={() => { setSelectedCase(null); setShowReportModal(true); }}
        />
      )}

      {/* Report Generation Modal */}
      {showReportModal && (
        <ReportGenerationModal
          scanData={scanResult}
          onClose={() => setShowReportModal(false)}
        />
      )}
    </AppShell>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/investigator" element={<InvestigatorAppWrapper />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
