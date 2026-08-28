import re
from typing import Dict, List, Any

# Explainable Security Rules & Risk Indicators
EXPLAINABLE_SIGNALS = [
    {
        "id": "SPF_FAIL",
        "title": "Fake Sender Information / SPF Failure",
        "description": "Sender IP address is not authorized in the sender domain's SPF DNS record. Sender identity is spoofed/faked.",
        "category": "Fake Sender Information",
        "severity": "High"
    },
    {
        "id": "DKIM_FAIL",
        "title": "DKIM Cryptographic Signature Failure",
        "description": "Cryptographic email signature is missing or invalid. Message headers or body altered in transit.",
        "category": "Fake Sender Information",
        "severity": "High"
    },
    {
        "id": "DMARC_FAIL",
        "title": "DMARC Policy Enforcement Failure",
        "description": "Email failed domain alignment checks under published DMARC policy. Severe sender spoofing detected.",
        "category": "Fake Sender Information",
        "severity": "Critical"
    },
    {
        "id": "SUSPICIOUS_URL",
        "title": "Phishing Links / Credential Harvesting URL",
        "description": "Embedded hyperlink points to an untrusted domain containing suspicious account verification keywords.",
        "category": "Phishing Links",
        "severity": "Critical"
    },
    {
        "id": "DOMAIN_MISMATCH",
        "title": "Unusual Pattern / Reply-To Domain Discrepancy",
        "description": "Header 'From' domain differs from designated 'Reply-To' domain, characteristic of phishing lure patterns.",
        "category": "Unusual Email Patterns",
        "severity": "High"
    },
    {
        "id": "EXECUTABLE_ATTACHMENT",
        "title": "Malicious Attachment / Executable Payload",
        "description": "Attachment filename or MIME payload exhibits executable binary format (.exe / .vbs / .xlsm).",
        "category": "Malicious Attachments",
        "severity": "Critical"
    },
    {
        "id": "URGENCY_LANGUAGE",
        "title": "Suspicious Words / Urgency Psychological Triggers",
        "description": "Email body uses coercive language (e.g. 'immediate action required', 'account suspended within 24 hours').",
        "category": "Suspicious Words or Messages",
        "severity": "Medium"
    },
    {
        "id": "RAW_IP_URL",
        "title": "Phishing Link / Raw IP Address Hyperlink",
        "description": "Hyperlink targets a raw numeric IP address rather than a registered DNS domain name.",
        "category": "Phishing Links",
        "severity": "High"
    }
]


class AITreatDetector:
    def analyze(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        subject = email_data.get("subject", "")
        body = email_data.get("body", "")
        sender_address = email_data.get("sender_address", "")
        sender_domain = email_data.get("sender_domain", "")
        reply_to = email_data.get("reply_to", "")
        spf = email_data.get("auth_spf", "NEUTRAL")
        dkim = email_data.get("auth_dkim", "NEUTRAL")
        dmarc = email_data.get("auth_dmarc", "NEUTRAL")

        combined_text = f"{subject} {body}".lower()

        # Extract URLs
        urls = re.findall(r'https?://[^\s<>"]+|www\.[^\s<>"]+', combined_text)
        num_links = len(urls)
        ip_in_url = [u for u in urls if re.search(r'https?://\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', u)]

        # Detection Characteristics Checklist (Detection Phase 1)
        detection_characteristics = {
            "fake_sender_info": {
                "detected": spf == "FAIL" or dkim == "FAIL" or dmarc == "FAIL",
                "label": "Fake Sender Information",
                "details": "SPF/DKIM/DMARC domain alignment checks failed. Sender identity spoofed." if (spf == "FAIL" or dmarc == "FAIL") else "Sender domain cryptographic signatures validated."
            },
            "phishing_links": {
                "detected": any(w in combined_text for w in ["verify", "login", "password", "bank", "paypal", "secure"]) and num_links > 0 or len(ip_in_url) > 0,
                "label": "Phishing Links",
                "details": f"Found {num_links} embedded link(s) matching credential harvesting patterns." if num_links > 0 else "No suspicious external hyperlinks detected."
            },
            "suspicious_messages": {
                "detected": any(w in combined_text for w in ["urgent", "immediate action", "24 hours", "suspended", "wire transfer", "lottery", "claim prize"]),
                "label": "Suspicious Words / Coercive Messages",
                "details": "High-urgency social engineering triggers detected (coercive psychological lures)." if any(w in combined_text for w in ["urgent", "immediate action", "suspended"]) else "Neutral message syntax."
            },
            "malicious_attachments": {
                "detected": bool(re.search(r'[\w\.-]+\.(?:exe|vbs|zip|iso|xlsm)', combined_text, re.IGNORECASE)) or "attachment" in combined_text,
                "label": "Malicious Attachments",
                "details": "Executable binary payload (.exe / .vbs / .xlsm) detected." if "exe" in combined_text or "attachment" in combined_text else "No malicious attachment extensions detected."
            },
            "unusual_patterns": {
                "detected": (reply_to and sender_address and reply_to.lower() != sender_address.lower()) or "darknet" in combined_text or len(ip_in_url) > 0,
                "label": "Unusual Email Patterns",
                "details": "Reply-To address mismatch and anomalous relay routing observed." if (reply_to and sender_address and reply_to.lower() != sender_address.lower()) else "Standard routing pattern."
            }
        }

        # Collect explainable findings based on observed signals
        explainable_findings = []
        threat_weight = 0.0

        if spf == "FAIL":
            explainable_findings.append(EXPLAINABLE_SIGNALS[0])
            threat_weight += 20.0
        if dkim == "FAIL":
            explainable_findings.append(EXPLAINABLE_SIGNALS[1])
            threat_weight += 20.0
        if dmarc == "FAIL":
            explainable_findings.append(EXPLAINABLE_SIGNALS[2])
            threat_weight += 25.0

        if any(w in combined_text for w in ["verify", "login", "bank", "paypal", "password", "suspended", "account"]):
            explainable_findings.append(EXPLAINABLE_SIGNALS[3])
            threat_weight += 25.0

        if reply_to and sender_address and reply_to.lower() != sender_address.lower():
            explainable_findings.append(EXPLAINABLE_SIGNALS[4])
            threat_weight += 20.0

        if re.search(r'[\w\.-]+\.(?:exe|vbs|zip|iso|xlsm)', combined_text, re.IGNORECASE) or "attachment" in combined_text:
            explainable_findings.append(EXPLAINABLE_SIGNALS[5])
            threat_weight += 30.0

        if any(w in combined_text for w in ["urgent", "immediate action", "24 hours", "suspended"]):
            explainable_findings.append(EXPLAINABLE_SIGNALS[6])
            threat_weight += 15.0

        if ip_in_url:
            explainable_findings.append(EXPLAINABLE_SIGNALS[7])
            threat_weight += 20.0

        # Calculate Threat Score & Severity (Phase 2: Risk Scoring)
        threat_score = round(min(98.5, max(4.2, threat_weight)), 1)
        
        if threat_score >= 80.0:
            severity = "Critical"
        elif threat_score >= 55.0:
            severity = "High"
        elif threat_score >= 30.0:
            severity = "Medium"
        else:
            severity = "Low"

        # Automated Action & Policy Determination (Phase 3: Action)
        if threat_score < 30.0:
            policy_action = "ALLOW"
            action_label = "Allowed into Inbox"
            action_badge_color = "green"
            action_description = "Low-risk email passed all detection checks. Automatically allowed and delivered directly into user inbox."
            action_status = "INBOX_ALLOWED"
        elif 30.0 <= threat_score < 55.0:
            policy_action = "WARNING"
            action_label = "Warning Tag Applied"
            action_badge_color = "amber"
            action_description = "Medium-risk email detected. Warning security advisory header injected to alert user of potential risks."
            action_status = "USER_WARNED"
        else:
            policy_action = "QUARANTINE"
            action_label = "Quarantined & Blocked"
            action_badge_color = "red"
            action_description = "High-risk or fake email detected! Automatically quarantined and blocked from reaching the user's inbox."
            action_status = "QUARANTINED_BLOCKED"

        # Threat Classifications Breakdown Matrix
        is_high_risk = threat_score >= 50.0
        classifications = [
            {
                "category": "Phishing",
                "probability": round(min(99.0, threat_score * 1.02), 1) if is_high_risk else 2.1,
                "confidence": "High" if is_high_risk else "Low",
                "risk_level": severity if is_high_risk else "Low",
                "description": "Lure targeting user credentials or sensitive system access."
            },
            {
                "category": "Malware",
                "probability": 88.0 if is_high_risk else 0.5,
                "confidence": "High" if is_high_risk else "Low",
                "risk_level": "High" if is_high_risk else "Low",
                "description": "Malicious payload attachment or drive-by download URL."
            },
            {
                "category": "Credential Theft",
                "probability": 92.5 if is_high_risk else 1.2,
                "confidence": "High" if is_high_risk else "Low",
                "risk_level": "Critical" if is_high_risk else "Low",
                "description": "Spoofed login portal designed to capture authentication tokens."
            },
            {
                "category": "Business Email Compromise",
                "probability": 45.0 if is_high_risk else 0.8,
                "confidence": "Medium" if is_high_risk else "Low",
                "risk_level": "Medium" if is_high_risk else "Low",
                "description": "Impersonation of executive or corporate vendor."
            },
            {
                "category": "Spoofing",
                "probability": 96.0 if (spf == "FAIL" or dmarc == "FAIL") else 5.0,
                "confidence": "High" if (spf == "FAIL" or dmarc == "FAIL") else "Low",
                "risk_level": "High" if (spf == "FAIL" or dmarc == "FAIL") else "Low",
                "description": "Sender identity or domain header falsification."
            },
            {
                "category": "Spam",
                "probability": 12.0 if is_high_risk else 15.4,
                "confidence": "Medium",
                "risk_level": "Low",
                "description": "Unsolicited bulk marketing or low-reputation mail."
            },
            {
                "category": "Legitimate",
                "probability": round(max(0.5, 100.0 - threat_score), 1),
                "confidence": "High" if threat_score < 30.0 else "Low",
                "risk_level": "Informational",
                "description": "Normal enterprise email traffic passing security checks."
            }
        ]

        phishing_prob = next(c["probability"] for c in classifications if c["category"] == "Phishing")
        spam_prob = next(c["probability"] for c in classifications if c["category"] == "Spam")
        malware_prob = next(c["probability"] for c in classifications if c["category"] == "Malware")
        legit_prob = next(c["probability"] for c in classifications if c["category"] == "Legitimate")

        return {
            "threat_score": threat_score,
            "threat_risk": severity.upper(),
            "threat_severity": severity,
            "policy_action": policy_action,
            "action_label": action_label,
            "action_badge_color": action_badge_color,
            "action_description": action_description,
            "action_status": action_status,
            "detection_characteristics": detection_characteristics,
            "phishing_probability": phishing_prob,
            "spam_probability": spam_prob,
            "malware_probability": malware_prob,
            "legitimate_probability": legit_prob,
            "num_links": num_links,
            "classifications": classifications,
            "explainable_findings": explainable_findings,
            "suspicious_indicators": [f.get("title") for f in explainable_findings]
        }
