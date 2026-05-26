import sys
import os

# Add the backend directory to the sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from policy.policy_analyzer import analyze_policy, compare_policy_vs_traffic

def test_analyze():
    print("Testing Policy Analyzer...")
    
    # Test case 1: Standard policy
    policy_text = "We share your personal information with third parties. We use cookies and analytics tools. We do not sell your personal information."
    claims = analyze_policy(policy_text)
    print(f"Test 1 Claims: {claims}")
    assert "Shares data with third parties" in claims
    assert "Uses analytics tools" in claims
    assert "Uses cookies for tracking" in claims
    assert "Mentions data sale / CCPA rights" in claims
    
    # Test case 2: Mismatches
    detected_trackers = [
        {"type": "Advertising"},
        {"type": "Analytics"}
    ]
    # Provide claims that don't mention advertising or analytics
    claims2 = ["Specifies data retention policies"]
    mismatches = compare_policy_vs_traffic(detected_trackers, claims2)
    print(f"Test 2 Mismatches: {mismatches}")
    assert len(mismatches) == 2
    
    print("All tests passed!")

if __name__ == "__main__":
    test_analyze()
