import time
import os
import sys

# Ensure backend folder is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.redis_client import pop_from_queue
from app.core.es_client import index_log

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
                date_str = log_data.get("received_at", "").split("T")[0]
                index_name = f"siem-logs-{date_str}"
                
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
