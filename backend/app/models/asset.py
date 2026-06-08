from sqlalchemy import Column, Integer, String, DateTime, Enum
from sqlalchemy.sql import func
from app.database import Base
import enum

class CriticalityEnum(enum.Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"
    CRITICAL = "Critical"

class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    hostname = Column(String, index=True, nullable=False)
    ip_address = Column(String, unique=True, index=True, nullable=False)
    os_type = Column(String)
    criticality = Column(Enum(CriticalityEnum), default=CriticalityEnum.MEDIUM)
    last_seen = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
