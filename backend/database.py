import os
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./zetp_database.db")

engine = create_engine(
    DATABASE_URL, 
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    role = Column(String, default="investigator")  # "investigator" or "employee"
    created_at = Column(DateTime, default=datetime.utcnow)

    scans = relationship("ScanRecord", back_populates="owner")


class ScanRecord(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    
    # Header summary
    email_subject = Column(String, default="No Subject")
    sender_address = Column(String, nullable=False)
    sender_domain = Column(String, nullable=False)
    recipient_address = Column(String, default="")
    reply_to = Column(String, default="")
    return_path = Column(String, default="")
    message_id = Column(String, default="")
    email_date = Column(String, default="")
    
    # Auth results
    auth_spf = Column(String, default="NEUTRAL")
    auth_dkim = Column(String, default="NEUTRAL")
    auth_dmarc = Column(String, default="NEUTRAL")
    auth_summary = Column(Text, default="")
    
    # AI Threat Scores
    threat_score = Column(Float, default=0.0)
    threat_risk = Column(String, default="LOW")  # LOW, MEDIUM, HIGH, CRITICAL
    phishing_prob = Column(Float, default=0.0)
    spam_prob = Column(Float, default=0.0)
    legit_prob = Column(Float, default=100.0)
    
    # Raw payload
    raw_headers = Column(Text, default="")
    raw_body = Column(Text, default="")
    scanned_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="scans")
    iocs = relationship("IOCItem", back_populates="scan", cascade="all, delete-orphan")
    timeline = relationship("TimelineEvent", back_populates="scan", cascade="all, delete-orphan")
    hops = relationship("HopLocation", back_populates="scan", cascade="all, delete-orphan")


class IOCItem(Base):
    __tablename__ = "iocs"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=False)
    
    ioc_type = Column(String, nullable=False)  # URL, IP, Domain, Email, Hash, Attachment
    ioc_value = Column(String, nullable=False)
    risk_level = Column(String, default="MEDIUM")  # LOW, MEDIUM, HIGH, CRITICAL
    description = Column(String, default="")

    scan = relationship("ScanRecord", back_populates="iocs")


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=False)
    
    timestamp = Column(String, nullable=False)
    title = Column(String, nullable=False)
    description = Column(Text, default="")
    category = Column(String, default="GENERAL")  # HEADER_HOP, AUTH_CHECK, AI_SCAN, GEO_INTEL, IOC_FOUND

    scan = relationship("ScanRecord", back_populates="timeline")


class HopLocation(Base):
    __tablename__ = "hop_locations"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=False)
    
    hop_index = Column(Integer, nullable=False)
    ip_address = Column(String, nullable=False)
    country = Column(String, default="Unknown")
    city = Column(String, default="Unknown")
    latitude = Column(Float, default=0.0)
    longitude = Column(Float, default=0.0)
    isp = Column(String, default="Unknown")
    threat_reputation = Column(String, default="CLEAN")

    scan = relationship("ScanRecord", back_populates="hops")


def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
