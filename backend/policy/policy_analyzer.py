import re

def analyze_policy(policy_text: str):
    """
    Analyzes the raw policy text for specific claims.
    """
    claims = []
    if not policy_text:
        return ["Could not analyze privacy policy (not found or inaccessible)."]
        
    text_lower = policy_text.lower()
    
    if re.search(r'\b(third[\s-]?part(y|ies))\b', text_lower):
        claims.append("Shares data with third parties")
        
    if re.search(r'\b(analytics)\b', text_lower):
        claims.append("Uses analytics tools")
        
    if re.search(r'\b(cookie(s)?|tracking technologies)\b', text_lower):
        claims.append("Uses cookies for tracking")
        
    if re.search(r'\b(location( data)?|gps)\b', text_lower):
        claims.append("May collect location data")
        
    if re.search(r'\b(retain( your)? data|keep( your)? information|retention period)\b', text_lower):
        claims.append("Specifies data retention policies")
        
    if re.search(r'\b(sell( my)? personal information|do not sell)\b', text_lower):
        claims.append("Mentions data sale / CCPA rights")
        
    if re.search(r'\b(targeted ads|marketing purposes|advertising partners)\b', text_lower):
        claims.append("Discloses advertising or marketing practices")
        
    if re.search(r'\b(right to access|right to delete|opt-out)\b', text_lower):
        claims.append("Acknowledges specific user rights (e.g., access, delete)")
        
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
    has_analytics = any(t.get('type', '').lower() == 'analytics' for t in detected_trackers)
    claims_analytics = any("analytics" in c.lower() for c in policy_claims)
    
    if has_analytics and not claims_analytics:
        mismatches.append("Analytics trackers detected, but not clearly disclosed in policy.")
        
    # Check if we found third-party trackers but policy doesn't mention third parties
    claims_third_party = any("third part" in c.lower() for c in policy_claims)
    if detected_trackers and not claims_third_party:
        mismatches.append("Third-party trackers detected, but sharing with third parties is not clearly disclosed.")
        
    # Check if we found Advertising trackers but policy doesn't mention advertising/marketing
    has_advertising = any(t.get('type', '').lower() == 'advertising' for t in detected_trackers)
    claims_advertising = any("advertising" in c.lower() or "marketing" in c.lower() for c in policy_claims)
    
    if has_advertising and not claims_advertising:
        mismatches.append("Advertising trackers detected, but marketing/advertising practices are not clearly disclosed.")
        
    return mismatches
