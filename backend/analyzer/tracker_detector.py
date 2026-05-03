import json
import os
from .behavior_classifier import classify_domain

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "tracker_db.json")

def load_tracker_db():
    if not os.path.exists(DB_PATH):
        return {}
    with open(DB_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

def detect_trackers(traffic_data):
    """
    Matches network domains against known trackers.
    For unknown domains, uses behavior classification.
    Returns a list of unique trackers/behaviors found.
    """
    tracker_db = load_tracker_db()
    detected = {}
    domain_requests = {}
    
    # First pass: Group requests by domain
    for req in traffic_data:
        domain = req.get("domain", "")
        if not domain: continue
        if domain not in domain_requests:
            domain_requests[domain] = []
        domain_requests[domain].append(req)
        
    for domain, requests in domain_requests.items():
        matched = False
        # Basic substring matching for domain
        for known_domain, info in tracker_db.items():
            if known_domain in domain:
                if domain not in detected:
                    detected[domain] = {
                        "domain": domain,
                        "company": info.get("company", "Unknown"),
                        "type": info.get("type", "Unknown"),
                        "confidence": 100,
                        "risk": "Medium" if info.get("type") in ["Tracking", "Advertising"] else "Low",
                        "reason": ["Matched against known tracker database"],
                        "explanation": f"This domain is a known {info.get('type')} service operated by {info.get('company')}."
                    }
                matched = True
                break
                
        # If not matched in DB, classify by behavior
        if not matched:
            classification = classify_domain(domain, requests)
            # Only include if it is likely a tracker or exfiltration
            if classification["type"] != "Functional API" and classification["type"] != "Unknown":
                detected[domain] = classification
            
    return list(detected.values())
