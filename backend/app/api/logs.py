from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import Dict, Any
from datetime import datetime
from app.core.redis_client import push_to_queue
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from enrichment_pipeline import enrich_log

router = APIRouter()

class LogEntry(BaseModel):
    source_system: str
    log_type: str
    payload: Dict[str, Any]

@router.post("/ingest")
async def ingest_log(log: LogEntry, request: Request):
    """
    Ingest a log entry via REST API. 
    In an educational SIEM, this endpoint handles custom JSON logs (e.g. from DVWA).
    The logs are pushed to a Redis queue for processing.
    """
    client_ip = request.client.host
    
    log_data = {
        "source_ip": client_ip,
        "source_system": log.source_system,
        "log_type": log.log_type,
        "payload": log.payload,
        "received_at": datetime.utcnow().isoformat()
    }
    
    # Enrich log with GeoIP and Threat Intel
    log_data = enrich_log(log_data)
    
    # Push to ingestion pipeline queue
    success = push_to_queue("siem_logs_queue", log_data)
    
    if success:
        return {"status": "success", "message": "Log ingested and queued"}
    else:
        return {"status": "error", "message": "Failed to queue log"}
