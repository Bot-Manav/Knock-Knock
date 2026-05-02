def analyze_policy(policy_text: str):
    """
    Analyzes the raw policy text for specific claims.
    """
    claims = []
    if not policy_text:
        return ["Could not analyze privacy policy (not found or inaccessible)."]
        
    text_lower = policy_text.lower()
    
    if "third party" in text_lower or "third parties" in text_lower or "third-party" in text_lower:
        claims.append("Shares data with third parties")
        
    if "analytics" in text_lower:
        claims.append("Uses analytics tools")
        
    if "cookies" in text_lower:
        claims.append("Uses cookies for tracking")
        
    if "location" in text_lower or "gps" in text_lower:
        claims.append("May collect location data")
        
    if not claims:
        claims.append("Policy found but no standard tracking claims detected.")
        
    return claims

def compare_policy_vs_traffic(detected_trackers, policy_claims):
    """
    Compares the trackers found in traffic vs the claims made in the policy.
    """
    mismatches = []
    
    # If no policy was found but we found trackers
    if "Could not analyze privacy policy (not found or inaccessible)." in policy_claims:
        if detected_trackers:
            mismatches.append("Trackers detected but no privacy policy could be found.")
        return mismatches
        
    # Check if we found analytics trackers but policy doesn't mention analytics
    has_analytics = any(t['type'].lower() == 'analytics' for t in detected_trackers)
    claims_analytics = any("analytics" in c.lower() for c in policy_claims)
    
    if has_analytics and not claims_analytics:
        mismatches.append("Analytics trackers detected, but not clearly disclosed in policy.")
        
    # Check if we found third-party trackers but policy doesn't mention third parties
    claims_third_party = any("third part" in c.lower() for c in policy_claims)
    if detected_trackers and not claims_third_party:
        mismatches.append("Third-party trackers detected, but sharing with third parties is not clearly disclosed.")
        
    return mismatches
