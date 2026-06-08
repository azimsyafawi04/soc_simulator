from sqlalchemy import Column, Integer, String, DateTime, Float
from sqlalchemy.sql import func
from app.database import Base

class ThreatIntel(Base):
    __tablename__ = "threat_intel"

    id = Column(Integer, primary_key=True, index=True)
    indicator = Column(String, unique=True, index=True, nullable=False) # IP or Hash
    indicator_type = Column(String, nullable=False) # "IP", "HASH", "URL"
    source = Column(String) # VT, AbuseIPDB
    reputation_score = Column(Float)
    last_checked = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
