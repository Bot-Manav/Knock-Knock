def extract_features(domain, requests):
    """
    Extracts behavioral features for a specific domain based on its requests.
    """
    request_count = len(requests)
    total_payload = sum(req.get("payload_size", 0) for req in requests)
    avg_payload_size = total_payload / request_count if request_count > 0 else 0
    first_request_time = min(req.get("timestamp", float('inf')) for req in requests)
    
    # Calculate frequency (requests per second from first to last request)
    last_request_time = max(req.get("timestamp", 0) for req in requests)
    duration = last_request_time - first_request_time
    request_frequency = request_count / duration if duration > 0 else request_count
    
    methods_used = list(set(req.get("method", "GET") for req in requests))
    has_api_path = any("/api/" in req.get("url", "").lower() for req in requests)
    
    return {
        "request_count": request_count,
        "avg_payload_size": avg_payload_size,
        "first_request_time": first_request_time,
        "request_frequency": request_frequency,
        "methods_used": methods_used,
        "has_api_path": has_api_path,
        "requests": requests
    }

def generate_simple_explanation(classification, features):
    """
    Generates a simple, human-readable explanation based on the features.
    """
    if classification == "Tracking":
        return f"This domain likely acts as a tracking service because it sends frequent small requests ({features['request_count']} times) immediately after page load."
    elif classification == "Analytics":
        return f"This domain appears to be an analytics service, sending periodic data updates (average payload: {int(features['avg_payload_size'])} bytes)."
    elif classification == "Potential Data Exfiltration":
        return f"High-risk behavior detected: this domain receives large POST requests (average payload: {int(features['avg_payload_size'])} bytes) which could indicate data being sent out."
    elif classification == "Functional API":
        return "This domain behaves like a functional API supporting the website's core features rather than a tracker."
    return "This domain exhibits mixed or generic behavior."

def classify_domain(domain, requests):
    """
    Classifies a domain based on heuristic behavioral rules.
    Returns a dict with classification, confidence, risk, and reasons.
    """
    features = extract_features(domain, requests)
    
    classification = "Unknown"
    confidence = 0
    risk = "Low"
    reasons = []
    
    # 1. TRACKING BEHAVIOR
    # IF: request occurs immediately on page load (<2s) AND frequent small requests
    if features["first_request_time"] < 2.0 and features["request_count"] > 2 and features["avg_payload_size"] < 500:
        classification = "Tracking"
        confidence = 85
        risk = "Medium"
        reasons.append("Requests triggered immediately on page load (<2s)")
        reasons.append("Frequent small requests detected")
        
    # 2. DATA EXFILTRATION (HIGH RISK)
    # IF: large payload (>1000 bytes) AND POST requests
    elif features["avg_payload_size"] > 1000 and "POST" in features["methods_used"]:
        classification = "Potential Data Exfiltration"
        confidence = 90
        risk = "Critical"
        reasons.append("Large data payloads detected (>1000 bytes)")
        reasons.append("Uses POST method to send data externally")
        # Checking for sensitive patterns would be done in leak_detector, but behaviorally this is high risk
        
    # 3. ANALYTICS
    # IF: periodic requests, medium payload, or starts a bit later
    elif features["request_count"] > 1 and 100 <= features["avg_payload_size"] <= 1000:
        classification = "Analytics"
        confidence = 70
        risk = "Low"
        reasons.append("Periodic requests with medium payload size")
        
    # 4. API / NORMAL SERVICE
    # IF: structured endpoints (/api/) or very specific slow triggers
    elif features["has_api_path"] or (features["first_request_time"] > 2.0 and features["request_count"] <= 2):
        classification = "Functional API"
        confidence = 75
        risk = "Low"
        reasons.append("Structured API endpoints detected")
        if features["first_request_time"] > 2.0:
            reasons.append("Requests triggered after initial page load (likely user interaction)")
            
    # Default fallback
    if classification == "Unknown":
        confidence = 40
        reasons.append("Behavior does not strongly match known patterns")
        
    explanation = generate_simple_explanation(classification, features)
        
    return {
        "domain": domain,
        "company": "Unknown (Behavioral Analysis)",
        "type": classification,
        "confidence": confidence,
        "risk": risk,
        "reason": reasons,
        "explanation": explanation
    }
