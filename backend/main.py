from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import asyncio

from scanner.traffic_capture import capture_traffic
from policy.policy_scraper import scrape_policy
from policy.policy_analyzer import analyze_policy, compare_policy_vs_traffic
from analyzer.tracker_detector import detect_trackers
from analyzer.leak_detector import detect_leaks
from analyzer.risk_engine import calculate_scores

app = FastAPI(title="Privacy Leak Scanner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ScanRequest(BaseModel):
    url: str
    policy_url: Optional[str] = None
    policy_text: Optional[str] = None

@app.post("/api/scan")
def scan_website(request: ScanRequest):
    try:
        url = request.url
        print(f"Starting scan for: {url}")
        
        # 1. Capture Traffic & 4. Scrape Policy (Run in parallel if possible, or sequential)
        # We will run them sequentially for stability
        traffic_data = capture_traffic(url)
        
        policy_result = None
        policy_text = ""
        
        if request.policy_text:
            print("Using provided raw policy text.")
            policy_text = request.policy_text
            policy_result = {"status": "FOUND", "content": policy_text}
        elif request.policy_url:
            print(f"Scraping specific provided policy URL: {request.policy_url}")
            from policy.policy_scraper import scrape_specific_policy_url
            policy_result = scrape_specific_policy_url(request.policy_url)
            if policy_result and policy_result.get("status") == "FOUND":
                policy_text = policy_result.get("content", "")
        else:
            policy_result = scrape_policy(url)
            if policy_result and policy_result.get("status") == "FOUND":
                policy_text = policy_result.get("content", "")
        
        # 2. Detect Trackers
        detected_trackers = detect_trackers(traffic_data)
        
        # 3. Detect Leaks
        leaks = detect_leaks(traffic_data)
        
        # 5. Analyze Policy
        policy_claims = analyze_policy(policy_text)
        
        # Append insight if policy wasn't found
        if policy_result and policy_result.get("status") == "NOT_FOUND" and policy_result.get("insight"):
            policy_claims.append(policy_result.get("insight"))
        
        # 6. Compare Policy vs Traffic
        mismatches = compare_policy_vs_traffic(detected_trackers, policy_claims)
        
        # 7. Scoring System
        risk_score, transparency_score = calculate_scores(
            detected_trackers, leaks, mismatches, policy_claims
        )
        
        return {
            "risk_score": risk_score,
            "transparency_score": transparency_score,
            "trackers": [t.model_dump() if hasattr(t, 'model_dump') else t for t in detected_trackers],
            "leaks": leaks,
            "policy_summary": policy_claims,
            "mismatches": mismatches
        }
    except Exception as e:
        print(f"Error during scan: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
