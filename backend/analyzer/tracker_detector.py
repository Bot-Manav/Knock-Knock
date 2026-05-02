import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "tracker_db.json")

def load_tracker_db():
    if not os.path.exists(DB_PATH):
        return {}
    with open(DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def detect_trackers(traffic_data):
    """
    Matches network domains against known trackers.
    Returns a list of unique trackers found.
    """
    tracker_db = load_tracker_db()
    detected = {}
    
    for req in traffic_data:
        domain = req.get("domain", "")
        # Basic substring matching for domain (e.g., connect.facebook.net contains facebook.net)
        for known_domain, info in tracker_db.items():
            if known_domain in domain:
                if known_domain not in detected:
                    detected[known_domain] = {
                        "domain": domain, # use the actual domain we saw
                        "company": info.get("company", "Unknown"),
                        "type": info.get("type", "Unknown")
                    }
                break # Matched this request to a known tracker
                
    return list(detected.values())
