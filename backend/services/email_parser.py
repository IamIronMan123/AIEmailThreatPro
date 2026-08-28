import re
import email
from email.policy import default
from typing import Dict, List, Any

class EmailParserService:
    def parse(self, raw_email_str: str) -> Dict[str, Any]:
        """
        Parses raw email standard headers and body.
        Supports both raw MIME .eml strings and unstructured headers/body text.
        """
        msg = email.message_from_string(raw_email_str, policy=default)
        
        # Standard Headers
        subject = msg.get("Subject", "").strip() or "No Subject"
        from_hdr = msg.get("From", "").strip()
        to_hdr = msg.get("To", "").strip()
        reply_to = msg.get("Reply-To", "").strip()
        return_path = msg.get("Return-Path", "").strip()
        message_id = msg.get("Message-ID", "").strip()
        date_hdr = msg.get("Date", "").strip()
        auth_results = msg.get("Authentication-Results", "").strip()

        # Sender email & domain extraction
        sender_address = self._extract_email_address(from_hdr)
        sender_domain = self._extract_domain(sender_address)
        recipient_address = self._extract_email_address(to_hdr)
        
        # Extract Received Hops
        received_headers = msg.get_all("Received", [])
        hops = self._parse_received_hops(received_headers)

        # Extract Authentication (SPF, DKIM, DMARC)
        spf_status, dkim_status, dmarc_status = self._analyze_auth_results(auth_results, sender_domain, return_path, from_hdr)

        # Extract Body (Plain Text & HTML)
        body = self._extract_body(msg, raw_email_str)

        return {
            "subject": subject,
            "from": from_hdr,
            "sender_address": sender_address,
            "sender_domain": sender_domain,
            "to": to_hdr,
            "recipient_address": recipient_address,
            "reply_to": reply_to,
            "return_path": return_path,
            "message_id": message_id,
            "date": date_hdr,
            "auth_results": auth_results,
            "auth_spf": spf_status,
            "auth_dkim": dkim_status,
            "auth_dmarc": dmarc_status,
            "hops": hops,
            "body": body,
            "raw_headers": "\n".join([f"{k}: {v}" for k, v in msg.items()])
        }

    def _extract_email_address(self, header_val: str) -> str:
        if not header_val:
            return "unknown@unknown.com"
        match = re.search(r'[\w\.-]+@[\w\.-]+\.\w+', header_val)
        if match:
            return match.group(0).lower()
        return header_val.strip().lower()

    def _extract_domain(self, email_address: str) -> str:
        if "@" in email_address:
            return email_address.split("@")[-1].lower()
        return "unknown.com"

    def _parse_received_hops(self, received_headers: List[str]) -> List[Dict[str, Any]]:
        hops = []
        if not received_headers:
            return hops

        # Received headers appear in reverse chronological order (top to bottom)
        # Hop 1 is the origin server, Hop N is the destination
        reversed_headers = list(reversed(received_headers))
        
        for idx, header in enumerate(reversed_headers, start=1):
            ip_match = re.findall(r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b', header)
            # Filter out local private IPs if public ones exist
            valid_ips = [ip for ip in ip_match if not ip.startswith(("127.", "10.", "192.168."))]
            ip = valid_ips[0] if valid_ips else (ip_match[0] if ip_match else "127.0.0.1")
            
            # Extract timestamp or date string in received header
            time_match = re.search(r';\s*(.*)$', header, re.DOTALL)
            timestamp_str = time_match.group(1).strip() if time_match else f"Hop {idx} Timestamp"
            
            hops.append({
                "hop_index": idx,
                "header_raw": header.strip(),
                "ip_address": ip,
                "timestamp": timestamp_str
            })
        return hops

    def _analyze_auth_results(self, auth_results: str, sender_domain: str, return_path: str, from_hdr: str) -> tuple:
        """
        Parses Authentication-Results header or performs alignment checks.
        """
        spf = "NEUTRAL"
        dkim = "NEUTRAL"
        dmarc = "NEUTRAL"

        auth_upper = auth_results.upper()
        if "SPF=PASS" in auth_upper:
            spf = "PASS"
        elif "SPF=FAIL" in auth_upper or "SPF=SOFTFAIL" in auth_upper:
            spf = "FAIL"

        if "DKIM=PASS" in auth_upper:
            dkim = "PASS"
        elif "DKIM=FAIL" in auth_upper:
            dkim = "FAIL"

        if "DMARC=PASS" in auth_upper:
            dmarc = "PASS"
        elif "DMARC=FAIL" in auth_upper:
            dmarc = "FAIL"

        # Domain alignment check fallback if headers omitted auth_results
        if spf == "NEUTRAL" and return_path:
            rp_domain = self._extract_domain(self._extract_email_address(return_path))
            if rp_domain and rp_domain == sender_domain:
                spf = "PASS"
            elif rp_domain:
                spf = "FAIL"

        if dmarc == "NEUTRAL":
            if spf == "PASS" and dkim != "FAIL":
                dmarc = "PASS"
            elif spf == "FAIL":
                dmarc = "FAIL"

        return spf, dkim, dmarc

    def _extract_body(self, msg: email.message.Message, raw_fallback: str) -> str:
        body_parts = []
        if msg.is_multipart():
            for part in msg.walk():
                content_type = part.get_content_type()
                content_disposition = str(part.get("Content-Disposition"))
                if content_type in ["text/plain", "text/html"] and "attachment" not in content_disposition:
                    try:
                        payload = part.get_payload(decode=True).decode(part.get_content_charset() or "utf-8", errors="ignore")
                        body_parts.append(payload)
                    except Exception:
                        pass
        else:
            payload = msg.get_payload(decode=True)
            if payload:
                body_parts.append(payload.decode(msg.get_content_charset() or "utf-8", errors="ignore"))
            else:
                body_parts.append(msg.get_payload() or "")

        full_body = "\n".join(body_parts).strip()
        if not full_body:
            # Fallback if raw text was pasted directly without MIME structure
            body_parts_raw = raw_fallback.split("\n\n", 1)
            full_body = body_parts_raw[1] if len(body_parts_raw) > 1 else raw_fallback
        return full_body
