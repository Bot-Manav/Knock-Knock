from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal, Optional

from scanner.traffic_capture import capture_traffic
from scanner.url_validator import validate_scan_url
from policy.policy_scraper import scrape_policy
from policy.policy_analyzer import analyze_policy, compare_policy_vs_traffic
from analyzer.tracker_detector import detect_trackers
from analyzer.leak_detector import detect_leaks
from analyzer.risk_engine import calculate_scores
from analyzer.compliance_insights import build_compliance_insights
from analyzer.explainability import build_explainability_report
from analyzer.report_formatter import format_report_for_mode

app = FastAPI(title="Privacy Leak Scanner API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class WebsiteDetails(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    scan_purpose: Optional[str] = None
    notes: Optional[str] = None
    additional_pages: Optional[list[str]] = None
    scan_depth: Literal["standard", "thorough"] = "standard"
    scan_mode: Literal["simple", "master"] = "simple"


def _apply_scan_mode(details: WebsiteDetails) -> WebsiteDetails:
    """Simple scan: homepage only, standard depth. Master: full user options."""
    if details.scan_mode == "master":
        return details
    return WebsiteDetails(
        name=details.name,
        category=details.category,
        scan_purpose=details.scan_purpose,
        notes=details.notes,
        additional_pages=None,
        scan_depth="standard",
        scan_mode="simple",
    )


class ScanRequest(BaseModel):
    url: str
    policy_url: Optional[str] = None
    policy_text: Optional[str] = None
    website_details: Optional[WebsiteDetails] = None


@app.post("/api/scan")
def scan_website(request: ScanRequest):
    try:
        url = request.url.strip()
        raw_details = request.website_details or WebsiteDetails()
        details = _apply_scan_mode(raw_details)
        scan_mode = details.scan_mode

        ok, validation_error = validate_scan_url(url)
        if not ok:
            raise HTTPException(status_code=400, detail=validation_error)

        print(f"Starting {scan_mode} scan for: {url}")

        traffic_result = capture_traffic(
            url,
            additional_pages=details.additional_pages,
            scan_depth=details.scan_depth,
        )
        if not traffic_result.get("reachable", False):
            raise HTTPException(
                status_code=422,
                detail=traffic_result.get("error")
                or "We could not reach this website. Check the URL and try again.",
            )

        traffic_data = traffic_result["requests"]
        scan_metadata = traffic_result["metadata"]

        policy_result = None
        policy_text = ""
        
        if request.policy_text and scan_mode == "master":
            print("Using provided raw policy text.")
            policy_text = request.policy_text
            policy_result = {"status": "FOUND", "content": policy_text}
        elif request.policy_url and scan_mode == "master":
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
        
        policy_found = not any(
            "Could not analyze privacy policy" in c for c in policy_claims
        )

        risk_score, transparency_score = calculate_scores(
            detected_trackers, leaks, mismatches, policy_claims
        )

        compliance_insights = build_compliance_insights(
            detected_trackers,
            mismatches,
            policy_claims,
            policy_found,
            scan_metadata.get("pages_scanned", []),
            scan_mode=scan_mode,
        )

        explainability = build_explainability_report(
            detected_trackers,
            leaks,
            mismatches,
            policy_claims,
            policy_found,
            risk_score,
            transparency_score,
            url,
            scan_mode=scan_mode,
        )

        full_report = {
            "scan_status": "success",
            "scan_mode": scan_mode,
            "risk_score": risk_score,
            "transparency_score": transparency_score,
            "trackers": [t.model_dump() if hasattr(t, "model_dump") else t for t in detected_trackers],
            "leaks": leaks,
            "policy_summary": policy_claims,
            "mismatches": mismatches,
            "compliance_insights": compliance_insights,
            "plain_language": explainability["plain_language"],
            "data_flow": explainability["data_flow"],
            "website_details": details.model_dump(exclude_none=True),
            "scan_metadata": {
                **scan_metadata,
                "scanned_at": datetime.now(timezone.utc).isoformat(),
                "target_url": url,
                "scan_mode": scan_mode,
            },
        }

        return format_report_for_mode(scan_mode, full_report)
    except Exception as e:
        print(f"Error during scan: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
