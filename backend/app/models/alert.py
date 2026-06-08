from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base
import enum

class SeverityEnum(enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class AlertStatusEnum(enum.Enum):
    NEW = "New"
    IN_PROGRESS = "In Progress"
    RESOLVED = "Resolved"
    FALSE_POSITIVE = "False Positive"

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    severity = Column(Enum(SeverityEnum), nullable=False)
    source_ip = Column(String, index=True)
    dest_ip = Column(String, index=True)
    rule_name = Column(String, index=True, nullable=False)
    mitre_tactic = Column(String)
    description = Column(Text)
    recommended_response = Column(Text)
    status = Column(Enum(AlertStatusEnum), default=AlertStatusEnum.NEW)
    raw_log_id = Column(String) # Reference to Elasticsearch doc
