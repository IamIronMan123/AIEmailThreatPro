import pytest
from services.email_parser import EmailParserService
from services.ai_detector import AITreatDetector
from services.geolocation import GeolocationService
from services.forensics import ForensicService

SAMPLE_EMAIL_RAW = """From: Security Alert <account-update@paypal-verify-alert.com>
To: target.user@enterprise-corp.com
Subject: URGENT: Action Required - Verify Your Account Credentials Now
Date: Thu, 27 Aug 2026 14:22:10 +0000
Message-ID: <92847293847293847.alert@paypal-verify-alert.com>
Return-Path: <bounce@temp-mail.org>
Reply-To: phisher-collect@darknet-drop.com
Authentication-Results: spf=fail (sender IP 103.253.144.12) dkim=fail dmarc=fail
Received: from mail.darknet-drop.com ([103.253.144.12]) by mx.enterprise-corp.com with ESMTPS; Thu, 27 Aug 2026 14:22:12 +0000

Dear Valued Customer,

Your account has been temporarily suspended due to unusual activity detected from IP 185.220.101.5.
Please verify your password immediately by clicking the secure login link below:

https://suspicious-login-example.com/verify-account

Failure to take immediate action within 24 hours will result in permanent account termination.
Attachment: Account_Verification_Form.exe
"""

def test_email_parser():
    parser = EmailParserService()
    parsed = parser.parse(SAMPLE_EMAIL_RAW)
    assert parsed["sender_address"] == "account-update@paypal-verify-alert.com"
    assert parsed["sender_domain"] == "paypal-verify-alert.com"
    assert parsed["auth_spf"] == "FAIL"
    assert parsed["auth_dkim"] == "FAIL"
    assert parsed["auth_dmarc"] == "FAIL"
    assert len(parsed["hops"]) >= 1

def test_ai_detector_and_policy_actions():
    parser = EmailParserService()
    parsed = parser.parse(SAMPLE_EMAIL_RAW)
    ai = AITreatDetector()
    res = ai.analyze(parsed)
    
    # 1. Detection Stage
    assert "detection_characteristics" in res
    assert res["detection_characteristics"]["fake_sender_info"]["detected"] is True
    assert res["detection_characteristics"]["phishing_links"]["detected"] is True
    assert res["detection_characteristics"]["malicious_attachments"]["detected"] is True
    
    # 2. Risk Scoring Stage
    assert res["threat_score"] > 50.0
    assert res["threat_risk"] in ["HIGH", "CRITICAL"]
    assert res["phishing_probability"] > 50.0
    assert len(res["suspicious_indicators"]) > 0

    # 3. Action Stage (High risk -> QUARANTINE)
    assert res["policy_action"] == "QUARANTINE"
    assert res["action_status"] == "QUARANTINED_BLOCKED"

def test_geolocation_service():
    geo = GeolocationService()
    hops = [{"hop_index": 1, "ip_address": "103.253.144.12", "timestamp": "Thu, 27 Aug"}]
    resolved = geo.resolve_hops(hops)
    assert len(resolved) == 1
    assert resolved[0]["country"] == "Russia"
    assert resolved[0]["threat_reputation"] in ["CRITICAL", "MALICIOUS"]

def test_forensic_service():
    parser = EmailParserService()
    parsed = parser.parse(SAMPLE_EMAIL_RAW)
    ai = AITreatDetector()
    res_ai = ai.analyze(parsed)
    geo = GeolocationService()
    hops = geo.resolve_hops(parsed["hops"])

    forensic = ForensicService()
    iocs = forensic.extract_iocs(parsed, res_ai, hops)
    timeline = forensic.generate_timeline(parsed, res_ai, hops, iocs)

    assert len(iocs) > 0
    url_iocs = [i for i in iocs if i["type"] == "URL"]
    assert len(url_iocs) > 0
    assert "suspicious-login-example.com" in url_iocs[0]["value"]
    assert len(timeline) >= 4
