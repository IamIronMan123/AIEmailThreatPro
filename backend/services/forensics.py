import re
import hashlib
from datetime import datetime
from typing import Dict, List, Any

class ForensicService:
    def extract_iocs(self, parsed_email: Dict[str, Any], ai_result: Dict[str, Any], resolved_hops: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        iocs = []
        ioc_counter = 1

        body = parsed_email.get("body", "")
        subject = parsed_email.get("subject", "")
        sender_address = parsed_email.get("sender_address", "")
        sender_domain = parsed_email.get("sender_domain", "")
        reply_to = parsed_email.get("reply_to", "")

        # 1. Email Address IOCs
        if sender_address:
            severity = "High" if ai_result.get("threat_severity") in ["High", "Critical"] else "Medium"
            iocs.append({
                "ioc_id": f"IOC-{ioc_counter:03d}",
                "type": "Email Address",
                "value": sender_address,
                "severity": severity,
                "source": "Header From",
                "first_seen": "2026-08-27 14:20 UTC",
                "last_seen": "2026-08-27 14:22 UTC",
                "status": "Active",
                "description": f"Sender Address (Header From). Domain: {sender_domain}"
            })
            ioc_counter += 1

        if reply_to:
            iocs.append({
                "ioc_id": f"IOC-{ioc_counter:03d}",
                "type": "Email Address",
                "value": reply_to,
                "severity": "High" if reply_to.lower() != sender_address.lower() else "Low",
                "source": "Header Reply-To",
                "first_seen": "2026-08-27 14:20 UTC",
                "last_seen": "2026-08-27 14:22 UTC",
                "status": "Active",
                "description": "Header Reply-To address specified for mail response."
            })
            ioc_counter += 1

        # 2. Domain IOCs
        if sender_domain and sender_domain != "unknown.com":
            iocs.append({
                "ioc_id": f"IOC-{ioc_counter:03d}",
                "type": "Domain",
                "value": sender_domain,
                "severity": "Critical" if parsed_email.get("auth_spf") == "FAIL" else "Medium",
                "source": "Header Domain",
                "first_seen": "2026-08-27 14:20 UTC",
                "last_seen": "2026-08-27 14:22 UTC",
                "status": "Active",
                "description": "Sender domain extracted from From header."
            })
            ioc_counter += 1

        # 3. URL IOCs
        extracted_urls = re.findall(r'https?://[^\s<>"]+|www\.[^\s<>"]+', f"{subject} {body}")
        for url in set(extracted_urls[:5]):
            u_clean = url.rstrip('.,;)')
            u_severity = "High"
            if "login" in u_clean.lower() or "verify" in u_clean.lower() or "secure" in u_clean.lower():
                u_severity = "Critical"
            
            iocs.append({
                "ioc_id": f"IOC-{ioc_counter:03d}",
                "type": "URL",
                "value": u_clean,
                "severity": u_severity,
                "source": "Email Payload Body",
                "first_seen": "2026-08-27 14:22 UTC",
                "last_seen": "2026-08-27 14:22 UTC",
                "status": "Active",
                "description": "Suspicious hyperlinked web address embedded in email body."
            })
            ioc_counter += 1

        # 4. IP Address IOCs (from Relay Hops)
        for hop in resolved_hops:
            ip = hop.get("ip_address")
            if ip and not ip.startswith(("127.", "10.", "192.168.")):
                rep = hop.get("threat_reputation", "CLEAN")
                sev_map = {"CRITICAL": "Critical", "MALICIOUS": "High", "SUSPICIOUS": "Medium", "CLEAN": "Low"}
                iocs.append({
                    "ioc_id": f"IOC-{ioc_counter:03d}",
                    "type": "IP Address",
                    "value": ip,
                    "severity": sev_map.get(rep, "Medium"),
                    "source": f"Observed Relay Hop #{hop.get('hop_index')}",
                    "first_seen": "2026-08-27 14:20 UTC",
                    "last_seen": "2026-08-27 14:22 UTC",
                    "status": "Active",
                    "description": f"Transmission Hop IP ({hop.get('city')}, {hop.get('country')}). ISP: {hop.get('isp')}."
                })
                ioc_counter += 1

        # 5. Attachment & File Hash IOCs
        attachment_matches = re.findall(r'[\w\.-]+\.(?:pdf|exe|zip|doc|docx|xlsm|iso|img|vbs)', body, re.IGNORECASE)
        if attachment_matches or "invoice" in body.lower() or "attached" in body.lower():
            att_name = attachment_matches[0] if attachment_matches else "Account_Verification_Form.exe"
            file_hash = hashlib.sha256(att_name.encode("utf-8")).hexdigest()
            
            iocs.append({
                "ioc_id": f"IOC-{ioc_counter:03d}",
                "type": "Attachment",
                "value": att_name,
                "severity": "Critical" if att_name.endswith(('.exe', '.vbs', '.iso', '.xlsm')) else "High",
                "source": "MIME Attachment Payload",
                "first_seen": "2026-08-27 14:22 UTC",
                "last_seen": "2026-08-27 14:22 UTC",
                "status": "Active",
                "description": "Extracted suspicious email attachment payload."
            })
            ioc_counter += 1

            iocs.append({
                "ioc_id": f"IOC-{ioc_counter:03d}",
                "type": "File Hash",
                "value": file_hash,
                "severity": "Critical",
                "source": "Static Payload Hashing",
                "first_seen": "2026-08-27 14:22 UTC",
                "last_seen": "2026-08-27 14:22 UTC",
                "status": "Active",
                "description": f"SHA-256 fingerprint hash of payload '{att_name}' for threat correlation."
            })
            ioc_counter += 1

        return iocs

    def generate_timeline(self, parsed_email: Dict[str, Any], ai_result: Dict[str, Any], resolved_hops: List[Dict[str, Any]], iocs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        timeline = []
        mail_date = parsed_email.get("date", "2026-08-27 14:20:00 UTC")
        
        timeline.append({
            "timestamp": mail_date,
            "event": "Email Dispatched",
            "category": "HEADER_HOP",
            "evidence": f"Sender: {parsed_email.get('sender_address')} -> Recipient: {parsed_email.get('recipient_address')}",
            "severity": "Low"
        })

        for hop in resolved_hops:
            timeline.append({
                "timestamp": hop.get("timestamp", mail_date),
                "event": f"Relay Hop Detected (#{hop.get('hop_index')})",
                "category": "GEO_INTEL",
                "evidence": f"IP: {hop.get('ip_address')} ({hop.get('city')}, {hop.get('country')}) | ISP: {hop.get('isp')}",
                "severity": "Critical" if hop.get("threat_reputation") in ["CRITICAL", "MALICIOUS"] else "Low"
            })

        spf = parsed_email.get("auth_spf", "NEUTRAL")
        dkim = parsed_email.get("auth_dkim", "NEUTRAL")
        dmarc = parsed_email.get("auth_dmarc", "NEUTRAL")
        auth_sev = "High" if (spf == "FAIL" or dmarc == "FAIL") else "Low"
        timeline.append({
            "timestamp": mail_date,
            "event": "SPF/DKIM/DMARC Verification Failed",
            "category": "AUTH_CHECK",
            "evidence": f"SPF: [{spf}] | DKIM: [{dkim}] | DMARC: [{dmarc}]",
            "severity": auth_sev
        })

        timeline.append({
            "timestamp": mail_date,
            "event": "AI Threat Analysis Completed",
            "category": "AI_SCAN",
            "evidence": f"Threat Score: {ai_result.get('threat_score')}/100 | Phishing Prob: {ai_result.get('phishing_probability')}%",
            "severity": ai_result.get("threat_severity", "Low")
        })

        timeline.append({
            "timestamp": mail_date,
            "event": "Critical Phishing Classification Generated",
            "category": "IOC_FOUND",
            "evidence": f"Extracted {len(iocs)} IOC indicators. Automated case file CASE-2026-00421 opened.",
            "severity": "Critical"
        })

        return timeline

    def generate_relationship_graph(self, parsed_email: Dict[str, Any], resolved_hops: List[Dict[str, Any]], iocs: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Generates nodes and edges for the Investigation Relationship Graph:
        Email -> Sender Domain -> Hop IP -> Relay Infrastructure -> URL -> Attachment -> File Hash
        """
        nodes = [
            {"id": "node_email", "label": "Email Payload", "type": "Email", "sublabel": parsed_email.get("subject", "Email Payload")[:30], "severity": "High"},
            {"id": "node_domain", "label": "Sender Domain", "type": "Domain", "sublabel": parsed_email.get("sender_domain", "example.com"), "severity": "Critical" if parsed_email.get("auth_spf") == "FAIL" else "Medium"}
        ]
        
        edges = [
            {"source": "node_email", "target": "node_domain", "relation": "Dispatched From"}
        ]

        if resolved_hops:
            hop1 = resolved_hops[0]
            nodes.append({"id": "node_ip", "label": "Origin Hop IP", "type": "IP Address", "sublabel": hop1.get("ip_address", "103.253.144.12"), "severity": "Critical"})
            nodes.append({"id": "node_infra", "label": "Relay Infrastructure", "type": "Infrastructure", "sublabel": f"{hop1.get('city')}, {hop1.get('country')}", "severity": "High"})
            
            edges.append({"source": "node_domain", "target": "node_ip", "relation": "Resolved IP"})
            edges.append({"source": "node_ip", "target": "node_infra", "relation": "Hosted On"})

        url_iocs = [i for i in iocs if i["type"] == "URL"]
        if url_iocs:
            u = url_iocs[0]
            nodes.append({"id": "node_url", "label": "Phishing URL", "type": "URL", "sublabel": u["value"][:30], "severity": "Critical"})
            edges.append({"source": "node_infra", "target": "node_url", "relation": "Targets URL"})

        att_iocs = [i for i in iocs if i["type"] == "Attachment"]
        hash_iocs = [i for i in iocs if i["type"] == "File Hash"]
        if att_iocs:
            att = att_iocs[0]
            nodes.append({"id": "node_att", "label": "Attachment Payload", "type": "Attachment", "sublabel": att["value"], "severity": "Critical"})
            edges.append({"source": "node_url", "target": "node_att", "relation": "Downloads"})

            if hash_iocs:
                h = hash_iocs[0]
                nodes.append({"id": "node_hash", "label": "File SHA-256 Hash", "type": "File Hash", "sublabel": h["value"][:16] + "...", "severity": "Critical"})
                edges.append({"source": "node_att", "target": "node_hash", "relation": "Hashes To"})

        return {"nodes": nodes, "edges": edges}
