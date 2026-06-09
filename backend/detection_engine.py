import time
import os
import sys
import json
import math

# Ensure backend folder is in path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.es_client import get_es_client
from app.core.redis_client import redis_client
from app.database import SessionLocal
es = get_es_client()

# --- NEW: Load Assets Configuration ---
ASSETS_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "assets.json")

def load_assets():
    try:
        if os.path.exists(ASSETS_FILE):
            with open(ASSETS_FILE, 'r') as f:
                return json.load(f)
    except Exception as e:
        print(f"Error loading assets.json: {e}")
    return {}

ASSETS_CONFIG = load_assets()

def get_risk_multiplier(source_ip):
    criticality = ASSETS_CONFIG.get(source_ip, "Normal")
    multipliers = {
        "Crown_Jewels": 8,
        "Critical": 4,
        "Privileged": 2,
        "Normal": 1
    }
    return multipliers.get(criticality, 1), criticality

def calculate_shannon_entropy(data):
    if not data:
        return 0
    entropy = 0
    for x in range(256):
        p_x = float(data.count(chr(x))) / len(data)
        if p_x > 0:
            entropy += - p_x * math.log(p_x, 2)
    return entropy

def generate_alert(db, severity, source_ip, rule_name, mitre_tactic, description, recommended_response, raw_log_id):
    # Calculate RBA Risk Score dynamically without DB changes
    multiplier, criticality = get_risk_multiplier(source_ip)
    
    # Assign a base score based on severity (assuming lowercase strings 'critical', 'high', etc)
    base_scores = {'critical': 100, 'high': 75, 'medium': 50, 'low': 25}
    base_score = base_scores.get(str(severity.value).lower(), 50)
    calculated_risk_score = base_score * multiplier

    alert = Alert(
        severity=severity,
        source_ip=source_ip,
        rule_name=rule_name,
        mitre_tactic=mitre_tactic,
        description=description,
        recommended_response=recommended_response,
        raw_log_id=raw_log_id
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)
    
    alert_data = {
        "id": alert.id,
        "rule_name": alert.rule_name,
        "severity": alert.severity.value,
        "source_ip": alert.source_ip,
        "timestamp": alert.timestamp.isoformat(),
        "asset_criticality": criticality,
        "risk_score": calculated_risk_score
    }
    redis_client.publish("siem_alerts_channel", json.dumps(alert_data))
    print(f"Alert Generated: {alert.rule_name} | Criticality: {criticality} | Risk Score: {calculated_risk_score}")

def run_detection_engine():
    print("Starting SIEM Detection Rules Engine...")
    while True:
        try:
            db = SessionLocal()
            
            # --- Rule 1: SQL Injection Detection (Original) ---
            query_sqli = {
                "query": {
                    "bool": {
                        "must": [{"range": {"@timestamp": {"gte": "now-10s"}}}],
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
                    generate_alert(
                        db, SeverityEnum.HIGH, log.get("source", {}).get("ip", "Unknown"),
                        "SQL Injection Attempt Detected", "TA0001 - Initial Access",
                        f"Detected SQLi payload from {log.get('source_ip')}",
                        "Block IP at WAF, check application input validation.", hit['_id']
                    )
            except Exception:
                pass

            # --- Rule 2: Password Spraying (Threshold Alarm - >5 events from same IP) ---
            query_brute = {
                "query": {
                    "bool": {
                        "must": [
                            {"range": {"@timestamp": {"gte": "now-10s"}}},
                            {"match": {"event_id": 4625}}
                        ]
                    }
                },
                "aggs": {
                    "source_ips": {
                        "terms": {"field": "source.ip.keyword", "min_doc_count": 5}
                    }
                }
            }
            try:
                res = es.search(index="siem-logs-*", body=query_brute, size=0)
                buckets = res.get('aggregations', {}).get('source_ips', {}).get('buckets', [])
                for bucket in buckets:
                    ip = bucket['key']
                    count = bucket['doc_count']
                    generate_alert(
                        db, SeverityEnum.CRITICAL, ip,
                        "Password Spraying Detected", "TA0006 - Credential Access",
                        f"Detected {count} failed logins (Event 4625) from {ip} in 10s.",
                        "Issue password change requirement to account owner(s). Determine if systems are compromised.",
                        "AGGREGATION"
                    )
            except Exception:
                pass

            # --- Rule 3: Suspicious Process Execution (Match Alarm) ---
            query_exec = {
                "query": {
                    "bool": {
                        "must": [
                            {"range": {"@timestamp": {"gte": "now-10s"}}},
                            {"match": {"event_id": 4688}}
                        ],
                        "should": [
                            {"match_phrase": {"process_name": "powershell.exe -ExecutionPolicy Bypass"}},
                            {"match_phrase": {"process_name": "cmd.exe /c"}},
                            {"match_phrase": {"process_name": "base64"}}
                        ],
                        "minimum_should_match": 1
                    }
                }
            }
            try:
                res = es.search(index="siem-logs-*", body=query_exec, size=10)
                for hit in res['hits']['hits']:
                    log = hit['_source']
                    generate_alert(
                        db, SeverityEnum.HIGH, log.get("source", {}).get("ip", "Unknown"),
                        "Suspicious Process Execution", "TA0002 - Execution",
                        f"Malicious command execution detected: {log.get('process_name')}",
                        "Isolate the endpoint. Review surrounding Event ID 4688 logs.", hit['_id']
                    )
            except Exception:
                pass

            # --- Rule 4: Shannon Entropy Score Alarm (Defense Evasion) ---
            query_recent = {
                "query": {
                    "range": {"received_at": {"gte": "now-10s"}}
                }
            }
            try:
                res = es.search(index="siem-logs-*", body=query_recent, size=50)
                for hit in res['hits']['hits']:
                    log = hit['_source']
                    payload = log.get("payload", "")
                    if payload and len(payload) > 20:
                        entropy = calculate_shannon_entropy(payload)
                        if entropy > 4.5:
                            generate_alert(
                                db, SeverityEnum.HIGH, log.get("source", {}).get("ip", "Unknown"),
                                "High Entropy Payload Detected", "TA0005 - Defense Evasion",
                                f"Payload entropy is {entropy:.2f}, indicating obfuscation/DGA.",
                                "Analyze raw payload for base64/hex encoding. Block source IP.", hit['_id']
                            )
            except Exception:
                pass

            # --- Rule 5: Privilege Escalation (Wazuh Inspired) ---
            query_priv_esc = {
                "query": {
                    "bool": {
                        "must": [
                            {"range": {"@timestamp": {"gte": "now-10s"}}},
                            {"match": {"event_id": 1}}
                        ],
                        "should": [
                            {"match_phrase": {"process_name": "whoami /priv"}},
                            {"match_phrase": {"process_name": "net localgroup administrators"}},
                            {"match_phrase": {"process_name": "vssadmin delete shadows"}}
                        ],
                        "minimum_should_match": 1
                    }
                }
            }
            try:
                res = es.search(index="siem-logs-*", body=query_priv_esc, size=5)
                for hit in res['hits']['hits']:
                    log = hit['_source']
                    generate_alert(
                        db, SeverityEnum.CRITICAL, log.get("source", {}).get("ip", "Unknown"),
                        "Privilege Escalation Activity", "TA0004 - Privilege Escalation",
                        f"Adversary activity detected: {log.get('process_name')}",
                        "Isolate the endpoint. Review process lineage.", hit['_id']
                    )
            except Exception:
                pass

            # --- Rule 6: Lateral Movement (Wazuh Inspired) ---
            query_lateral = {
                "query": {
                    "bool": {
                        "must": [
                            {"range": {"@timestamp": {"gte": "now-10s"}}},
                            {"match": {"event_id": 1}}
                        ],
                        "should": [
                            {"match_phrase": {"process_name": "psexec.exe"}},
                            {"match_phrase": {"process_name": "wmic /node:"}}
                        ],
                        "minimum_should_match": 1
                    }
                }
            }
            try:
                res = es.search(index="siem-logs-*", body=query_lateral, size=5)
                for hit in res['hits']['hits']:
                    log = hit['_source']
                    generate_alert(
                        db, SeverityEnum.HIGH, log.get("source", {}).get("ip", "Unknown"),
                        "Lateral Movement Tools Detected", "TA0008 - Lateral Movement",
                        f"Detected execution of lateral movement utility: {log.get('process_name')}",
                        "Block inbound SMB/RPC from source IP.", hit['_id']
                    )
            except Exception:
                pass

            # --- Rule 7: Audit Log Clearing (Wazuh Inspired) ---
            query_audit = {
                "query": {
                    "bool": {
                        "must": [
                            {"range": {"@timestamp": {"gte": "now-10s"}}},
                            {"terms": {"event_id": [1102, 104]}}
                        ]
                    }
                }
            }
            try:
                res = es.search(index="siem-logs-*", body=query_audit, size=5)
                for hit in res['hits']['hits']:
                    log = hit['_source']
                    generate_alert(
                        db, SeverityEnum.CRITICAL, log.get("source", {}).get("ip", "Unknown"),
                        "Windows Audit Logs Cleared", "TA0005 - Defense Evasion",
                        f"Event ID {log.get('event_id')} detected: Log clearing activity.",
                        "Critical indicator of compromise. Escalate to IR team immediately.", hit['_id']
                    )
            except Exception:
                pass

            db.close()
            
        except Exception as e:
            print(f"Detection Engine Error: {e}")
            
        time.sleep(10)

if __name__ == "__main__":
    run_detection_engine()
