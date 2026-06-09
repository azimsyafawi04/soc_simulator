import time
import os
import sys

# Ensure backend folder is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.redis_client import pop_from_queue
from app.core.es_client import index_log
from datetime import datetime

def normalize_to_ecs(log_data: dict) -> dict:
    # Standardize Timestamp
    if "received_at" in log_data:
        log_data["@timestamp"] = log_data.pop("received_at")
    else:
        log_data["@timestamp"] = datetime.utcnow().isoformat()
        
    # Standardize IP fields into ECS `source.ip`
    ip_candidates = [
        log_data.pop("source_ip", None),
        log_data.get("payload", {}).get("client_ip"),
        log_data.get("payload", {}).get("src_ip"),
        log_data.get("payload", {}).get("ip_address"),
        log_data.get("payload", {}).get("attacker_ip")
    ]
    
    resolved_ip = next((ip for ip in ip_candidates if ip), "Unknown")
    
    if "source" not in log_data:
        log_data["source"] = {}
    log_data["source"]["ip"] = resolved_ip
    
    return log_data

def run_log_worker():
    print("Starting SIEM Log Processor Worker...")
    print("Waiting for logs on 'siem_logs_queue'...")
    while True:
        try:
            # Block until a log arrives in the queue
            log_data = pop_from_queue("siem_logs_queue", timeout=0)
            if log_data:
                source_sys = log_data.get('source_system', 'unknown')
                print(f"Processing log from {source_sys}")
                
                # In a real SIEM, parsing and normalization happen here (Logstash equivalent)
                # For now, we index the raw JSON directly into Elasticsearch
                
                # Determine index name (e.g. siem-logs-2026-06-08)
                date_str = log_data.get("received_at", log_data.get("@timestamp", "")).split("T")[0]
                index_name = f"siem-logs-{date_str}"
                
                # Normalize to Elastic Common Schema (ECS)
                log_data = normalize_to_ecs(log_data)
                
                # Send to Elasticsearch
                res = index_log(index_name, log_data)
                if res and res.get("result") in ["created", "updated"]:
                    print(f"Successfully indexed to {index_name}")
                else:
                    print(f"Failed to index: {res}")
        except KeyboardInterrupt:
            print("Worker shutting down...")
            break
        except Exception as e:
            print(f"Worker encountered an error: {e}")
            time.sleep(5)

if __name__ == "__main__":
    run_log_worker()
