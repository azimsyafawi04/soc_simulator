import time
import os
import sys
import json

# Ensure backend folder is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.es_client import get_es_client
from app.core.redis_client import redis_client
from app.database import SessionLocal
from app.models.alert import Alert, SeverityEnum

es = get_es_client()

def run_detection_engine():
    print("Starting SIEM Detection Rules Engine...")
    while True:
        try:
            db = SessionLocal()
            
            # 1. Rule: SQL Injection Detection
            # Look for common SQLi patterns in the last 10 seconds
            query_sqli = {
                "query": {
                    "bool": {
                        "must": [
                            {"range": {"received_at": {"gte": "now-10s"}}}
                        ],
                        "should": [
                            {"match_phrase": {"payload": "UNION SELECT"}},
                            {"match_phrase": {"payload": "OR 1=1"}},
                            {"match_phrase": {"payload": "'--"}},
                        ],
                        "minimum_should_match": 1
                    }
                }
            }
            
            try:
                res = es.search(index="siem-logs-*", body=query_sqli, size=10)
                for hit in res['hits']['hits']:
                    log = hit['_source']
                    
                    # Create Alert in Postgres
                    alert = Alert(
                        severity=SeverityEnum.HIGH,
                        source_ip=log.get("source_ip", "Unknown"),
                        rule_name="SQL Injection Attempt Detected",
                        mitre_tactic="TA0001 - Initial Access",
                        description=f"Detected SQLi payload from {log.get('source_ip')}",
                        recommended_response="Block IP at WAF, check application input validation.",
                        raw_log_id=hit['_id']
                    )
                    db.add(alert)
                    db.commit()
                    db.refresh(alert)
                    
                    # Broadcast Alert via Redis Pub/Sub for WebSockets
                    alert_data = {
                        "id": alert.id,
                        "rule_name": alert.rule_name,
                        "severity": alert.severity.value,
                        "source_ip": alert.source_ip,
                        "timestamp": alert.timestamp.isoformat()
                    }
                    redis_client.publish("siem_alerts_channel", json.dumps(alert_data))
                    print(f"Alert Generated: {alert.rule_name}")
            except Exception as e:
                # Index might not exist yet or connection error
                pass

            db.close()
            
        except Exception as e:
            print(f"Detection Engine Error: {e}")
            
        time.sleep(10) # Run rules every 10 seconds

if __name__ == "__main__":
    run_detection_engine()
