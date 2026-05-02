def calculate_scores(detected_trackers, leaks, mismatches, policy_claims):
    """
    Calculates Privacy Risk Score (0-100) and Transparency Score (0-100)
    """
    # 1. Privacy Risk Score
    risk_score = 0
    
    # Base risk for number of trackers (max 50 points)
    num_trackers = len(detected_trackers)
    risk_score += min(num_trackers * 10, 50)
    
    # Risk for data leaks (25 points each, max 50)
    num_leaks = len(leaks)
    risk_score += min(num_leaks * 25, 50)
    
    # Cap at 100
    risk_score = min(risk_score, 100)
    
    
    # 2. Transparency Score
    # Base is 100 (fully transparent)
    transparency_score = 100
    
    # Deduct for not finding policy
    if "Could not analyze privacy policy (not found or inaccessible)." in policy_claims:
        transparency_score -= 50
        
    # Deduct for mismatches
    num_mismatches = len(mismatches)
    transparency_score -= (num_mismatches * 20)
    
    # Deduct a small amount if there are trackers but no explicit third-party claim (even if covered by mismatch)
    
    transparency_score = max(0, min(transparency_score, 100))
    
    return risk_score, transparency_score
