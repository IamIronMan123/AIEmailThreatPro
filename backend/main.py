from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Any
from sqlalchemy.orm import Session

from database import init_db, get_db, User, ScanRecord, IOCItem, TimelineEvent, HopLocation
from auth import hash_password, verify_password, create_access_token, get_current_user
from services.email_parser import EmailParserService
from services.ai_detector import AITreatDetector
from services.geolocation import GeolocationService
from services.forensics import ForensicService

app = FastAPI(
    title="ZETP — Zero Email Threat Portal API",
    description="Production-Grade Enterprise AI Email Threat Detection & Digital Forensics API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

parser_service = EmailParserService()
ai_service = AITreatDetector()
geo_service = GeolocationService()
forensic_service = ForensicService()


@app.on_event("startup")
def on_startup():
    init_db()


class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: Optional[str] = "investigator"


class LoginRequest(BaseModel):
    email: str
    password: str


class EmailScanRequest(BaseModel):
    raw_email: str
    sender_override: Optional[str] = None
    subject_override: Optional[str] = None


class NoteRequest(BaseModel):
    note: str


@app.post("/api/auth/register")
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == req.email.strip().lower()).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already registered.")

    user = User(
        email=req.email.strip().lower(),
        hashed_password=hash_password(req.password),
        full_name=req.full_name,
        role=req.role or "investigator"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "full_name": user.full_name, "role": user.role}}


@app.post("/api/auth/login")
def login_user(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.strip().lower()).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid login credentials.")

    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "user": {"id": user.id, "email": user.email, "full_name": user.full_name, "role": user.role}}


@app.post("/api/scan")
def analyze_email(req: EmailScanRequest, current_user: Optional[User] = Depends(get_current_user), db: Session = Depends(get_db)):
    if not req.raw_email or not req.raw_email.strip():
        raise HTTPException(status_code=400, detail="Email payload cannot be empty.")

    # 1. Header parsing
    parsed = parser_service.parse(req.raw_email)
    if req.sender_override:
        parsed["sender_address"] = req.sender_override.strip().lower()
        parsed["sender_domain"] = req.sender_override.split("@")[-1].lower()
    if req.subject_override:
        parsed["subject"] = req.subject_override.strip()

    # 2. AI Threat Analysis & Explainable Findings
    ai_result = ai_service.analyze(parsed)

    # 3. Geolocation & Infrastructure Route
    resolved_hops = geo_service.resolve_hops(parsed.get("hops", []))

    # 4. Digital Forensics IOC & Relationship Graph
    iocs = forensic_service.extract_iocs(parsed, ai_result, resolved_hops)
    timeline = forensic_service.generate_timeline(parsed, ai_result, resolved_hops, iocs)
    graph = forensic_service.generate_relationship_graph(parsed, resolved_hops, iocs)

    # Save to Database
    scan_rec = ScanRecord(
        user_id=current_user.id if current_user else None,
        email_subject=parsed["subject"],
        sender_address=parsed["sender_address"],
        sender_domain=parsed["sender_domain"],
        recipient_address=parsed["recipient_address"],
        reply_to=parsed["reply_to"],
        return_path=parsed["return_path"],
        message_id=parsed["message_id"],
        email_date=parsed["date"],
        auth_spf=parsed["auth_spf"],
        auth_dkim=parsed["auth_dkim"],
        auth_dmarc=parsed["auth_dmarc"],
        auth_summary=f"SPF: {parsed['auth_spf']} | DKIM: {parsed['auth_dkim']} | DMARC: {parsed['auth_dmarc']}",
        threat_score=ai_result["threat_score"],
        threat_risk=ai_result["threat_severity"].upper(),
        phishing_prob=ai_result["phishing_probability"],
        spam_prob=ai_result["spam_probability"],
        legit_prob=ai_result["legitimate_probability"],
        raw_headers=parsed["raw_headers"],
        raw_body=parsed["body"]
    )
    db.add(scan_rec)
    db.commit()

    return {
        "scan_id": scan_rec.id,
        "case_id": f"CASE-2026-0{scan_rec.id:04d}",
        "header_analysis": {
            "subject": parsed["subject"],
            "from": parsed["from"],
            "to": parsed["to"],
            "sender_address": parsed["sender_address"],
            "sender_domain": parsed["sender_domain"],
            "reply_to": parsed["reply_to"],
            "return_path": parsed["return_path"],
            "message_id": parsed["message_id"],
            "date": parsed["date"],
            "auth_spf": parsed["auth_spf"],
            "auth_dkim": parsed["auth_dkim"],
            "auth_dmarc": parsed["auth_dmarc"],
            "raw_headers": parsed["raw_headers"]
        },
        "ai_threat_detection": ai_result,
        "geolocation_intelligence": {
            "hops": resolved_hops
        },
        "digital_forensics": {
            "iocs": iocs,
            "forensic_timeline": timeline,
            "relationship_graph": graph
        }
    }


@app.get("/api/cases")
def list_cases(db: Session = Depends(get_db)):
    scans = db.query(ScanRecord).order_by(ScanRecord.scanned_at.desc()).limit(15).all()
    cases = []
    for s in scans:
        cases.append({
            "case_id": f"CASE-2026-0{s.id:04d}",
            "scan_id": s.id,
            "subject": s.email_subject,
            "threat_type": "Credential Phishing" if s.threat_score >= 80 else "Normal Email",
            "severity": "Critical" if s.threat_score >= 80 else "Low",
            "confidence": f"{s.phishing_prob:.1f}%",
            "affected_user": s.recipient_address or "employee@company.com",
            "analyst": "Security Analyst",
            "status": "Investigating" if s.threat_score >= 50 else "Resolved",
            "scanned_at": s.scanned_at.strftime("%Y-%m-%d %H:%M UTC")
        })
    return cases
