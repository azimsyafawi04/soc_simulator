# enrichment_pipeline.py
import urllib.request

LIVE_THREAT_IPS = set()

def load_live_threat_intel():
    global LIVE_THREAT_IPS
    print("Fetching live Tor Exit Node blocklist...")
    try:
        url = "https://check.torproject.org/torbulkexitlist"
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=10) as response:
            data = response.read().decode('utf-8')
            for line in data.splitlines():
                if line and not line.startswith('#'):
                    LIVE_THREAT_IPS.add(line.strip())
        print(f"Successfully loaded {len(LIVE_THREAT_IPS)} malicious IPs.")
    except Exception as e:
        print(f"Failed to fetch live threat intel: {e}")

# Load the list into memory on module start
load_live_threat_intel()

# We preserve a mock geo mapping for visual purposes since we lack a real MaxMind API
MOCK_GEO_MAPPING = {
    "Tor Exit Node": {"country": "RU", "lat": 61.5, "lon": 105.3}
}

def enrich_log(log_data: dict) -> dict:
    """
    Takes an incoming log dictionary, extracts the source_ip, 
    and checks it against live threat intelligence feeds.
    """
    ip_to_check = log_data.get("source_ip")
    if not ip_to_check and "payload" in log_data:
        payload = log_data.get("payload", {})
        ip_to_check = payload.get("client_ip") or payload.get("src_ip")

    ip_to_check = str(ip_to_check)

    if ip_to_check in LIVE_THREAT_IPS:
        enriched_data = {
            "threat_intel_match": True,
            "actor": "Tor Exit Node",
            "country": MOCK_GEO_MAPPING["Tor Exit Node"]["country"],
            "lat": MOCK_GEO_MAPPING["Tor Exit Node"]["lat"],
            "lon": MOCK_GEO_MAPPING["Tor Exit Node"]["lon"]
        }
    else:
        # Check if it was one of our old mock IPs for POC backward compatibility testing
        legacy_mock = {
            "10.0.0.5": {"country": "KP", "lat": 40.3, "lon": 127.5, "actor": "Lazarus Group"},
            "198.51.100.44": {"country": "CN", "lat": 35.8, "lon": 104.1, "actor": "APT41"},
            "203.0.113.12": {"country": "IR", "lat": 32.4, "lon": 53.6, "actor": "MuddyWater"},
            "192.168.1.100": {"country": "RU", "lat": 61.5, "lon": 105.3, "actor": "APT28"}
        }
        if ip_to_check in legacy_mock:
            enriched_data = legacy_mock[ip_to_check]
            enriched_data["threat_intel_match"] = True
        else:
            enriched_data = {
                "threat_intel_match": False,
                "actor": "Unknown",
                "country": "US",
                "lat": 37.0,
                "lon": -95.7
            }
    
    log_data["enriched_data"] = enriched_data
    return log_data
