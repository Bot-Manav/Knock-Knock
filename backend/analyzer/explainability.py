"""
Explainability layer — turns technical scan results into plain, helpful language.
Aligned with PLS goal: help users understand privacy, not exploit systems.
"""

from urllib.parse import urlparse


def _group_third_parties(trackers, target_url: str):
    """Build an ethical data-flow summary: site → categories of third parties."""
    try:
        site_host = urlparse(target_url).netloc
    except Exception:
        site_host = target_url

    categories: dict[str, list[dict]] = {}
    for t in trackers:
        kind = t.get("type", "Other") if isinstance(t, dict) else getattr(t, "type", "Other")
        entry = {
            "domain": t.get("domain") if isinstance(t, dict) else t.domain,
            "company": t.get("company") if isinstance(t, dict) else t.company,
        }
        categories.setdefault(kind, []).append(entry)

    flows = []
    for kind, items in sorted(categories.items()):
        flows.append({
            "category": kind,
            "count": len(items),
            "partners": items[:8],
        })

    return {
        "your_site": site_host,
        "third_party_groups": flows,
        "total_connections": len(trackers),
        "description": (
            "This shows outbound connections observed when the page loaded — "
            "where data may flow after a visitor opens your site."
        ),
    }


def build_plain_language_insights(
    trackers,
    leaks,
    mismatches,
    policy_claims,
    policy_found: bool,
    risk_score: int,
    transparency_score: int,
    scan_mode: str = "simple",
):
    if scan_mode == "simple":
        return _simple_plain_language(
            trackers, mismatches, policy_found, risk_score, transparency_score
        )
    return _full_plain_language(
        trackers, leaks, mismatches, policy_claims,
        policy_found, risk_score, transparency_score,
    )


def _simple_plain_language(
    trackers, mismatches, policy_found, risk_score, transparency_score
):
    n = len(trackers)
    insights = [{
        "icon": "shield",
        "title": "Quick overview",
        "text": (
            f"This Simple scan checked one public page. We counted about {n} "
            "third-party connection(s) and gave you risk and transparency scores — "
            "not a full audit. Own this site? Run Master scan for complete details."
        ),
    }]
    if not policy_found:
        insights.append({
            "icon": "document",
            "title": "Privacy policy",
            "text": "We could not find a clear privacy policy from the homepage.",
        })
    elif mismatches:
        insights.append({
            "icon": "alert",
            "title": "Possible gaps",
            "text": (
                f"Policy may not fully match what we observed ({len(mismatches)} area(s)). "
                "Master scan lists each gap if you have permission to review this site."
            ),
        })
    else:
        insights.append({
            "icon": "check",
            "title": "Scores",
            "text": (
                f"Privacy risk: {risk_score}/100 · Transparency: {transparency_score}/100. "
                "High-level check only — not legal advice."
            ),
        })
    return insights[:2]


def _full_plain_language(
    trackers,
    leaks,
    mismatches,
    policy_claims,
    policy_found: bool,
    risk_score: int,
    transparency_score: int,
):
    """Human-readable explanations for non-technical readers."""
    insights = []
    n_trackers = len(trackers)
    n_mismatches = len(mismatches)

    if n_trackers == 0:
        insights.append({
            "icon": "shield",
            "title": "What we saw",
            "text": (
                "When we loaded the page you specified, we did not detect connections "
                "to well-known analytics or advertising services. That can mean a simpler "
                "privacy footprint — confirm this matches what your policy promises."
            ),
        })
    else:
        companies = [
            c for c in {
                (t.get("company") if isinstance(t, dict) else t.company)
                for t in trackers
            }
            if c and c != "Unknown"
        ]
        company_list = ", ".join(companies[:5]) if companies else "various third-party services"
        insights.append({
            "icon": "flow",
            "title": "Where data may go",
            "text": (
                f"The page connected to {n_trackers} third-party service(s), including "
                f"partners such as {company_list}. Your privacy policy should name these "
                "services and explain what information they receive."
            ),
        })

    if n_mismatches > 0:
        insights.append({
            "icon": "alert",
            "title": "Policy honesty check",
            "text": (
                f"We found {n_mismatches} possible gap(s) between what the policy says and "
                "what the site actually does. Fixing this helps users trust your agreements "
                "and supports GDPR/CCPA-style transparency."
            ),
        })
    elif policy_found and n_trackers > 0:
        insights.append({
            "icon": "check",
            "title": "Policy honesty check",
            "text": (
                "What we observed on the page broadly matches the privacy policy claims. "
                "Keep both in sync when you add new tools or partners."
            ),
        })

    if not policy_found:
        insights.append({
            "icon": "document",
            "title": "Missing or hidden policy",
            "text": (
                "We could not find a readable privacy policy linked from the site. "
                "Publishing a clear policy is one of the best ways to show users you "
                "handle data responsibly."
            ),
        })

    if leaks:
        insights.append({
            "icon": "leak",
            "title": "Sensitive data signals",
            "text": (
                "Some requests contained patterns that look like personal data (e.g. email "
                "or location). Review whether this sharing is disclosed in your policy and "
                "covered by user consent."
            ),
        })
    else:
        insights.append({
            "icon": "lock",
            "title": "Sensitive data signals",
            "text": (
                "We did not flag obvious personal data (like email or location) in the "
                "requests captured during this scan. This is a positive sign for transparency."
            ),
        })

    if risk_score >= 70:
        insights.append({
            "icon": "score",
            "title": "Privacy risk score",
            "text": (
                f"Score: {risk_score}/100 — elevated. Many third-party connections or data "
                "signals were observed. A privacy review with your team is recommended."
            ),
        })
    elif risk_score >= 40:
        insights.append({
            "icon": "score",
            "title": "Privacy risk score",
            "text": (
                f"Score: {risk_score}/100 — moderate. Some third-party activity was detected. "
                "Ensure your cookie banner and policy describe it accurately."
            ),
        })
    else:
        insights.append({
            "icon": "score",
            "title": "Privacy risk score",
            "text": (
                f"Score: {risk_score}/100 — lower concern for this scan. Continue documenting "
                "practices in your policy as the site evolves."
            ),
        })

    insights.append({
        "icon": "transparency",
        "title": "Transparency score",
        "text": (
            f"Score: {transparency_score}/100 — reflects how clearly the policy describes "
            "actual site behavior. Higher scores mean better alignment for user trust."
        ),
    })

    return insights


def build_explainability_report(
    trackers,
    leaks,
    mismatches,
    policy_claims,
    policy_found: bool,
    risk_score: int,
    transparency_score: int,
    target_url: str,
    scan_mode: str = "simple",
):
    plain = build_plain_language_insights(
        trackers, leaks, mismatches, policy_claims,
        policy_found, risk_score, transparency_score,
        scan_mode=scan_mode,
    )
    data_flow = _group_third_parties(trackers, target_url)
    if scan_mode == "simple":
        data_flow["description"] = (
            "High-level categories only in Simple scan. "
            "Master scan shows named partners when you own the site."
        )
    return {"plain_language": plain, "data_flow": data_flow}
