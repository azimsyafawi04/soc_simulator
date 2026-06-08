import requests
import os

VT_API_KEY = os.getenv("VT_API_KEY", "dummy_vt_api_key_for_fyp")

def check_ip_reputation(ip_address: str):
    """Query VirusTotal for IP reputation."""
    url = f"https://www.virustotal.com/api/v3/ip_addresses/{ip_address}"
    headers = {
        "accept": "application/json",
        "x-apikey": VT_API_KEY
    }
    
    try:
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            data = response.json()
            stats = data['data']['attributes']['last_analysis_stats']
            malicious_count = stats.get('malicious', 0)
            return {"malicious": malicious_count, "total_engines": sum(stats.values())}
    except Exception as e:
        print(f"Error querying Threat Intel: {e}")
    return None
