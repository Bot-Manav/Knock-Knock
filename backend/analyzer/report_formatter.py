"""
Shape API responses by scan_mode — simple = brief public check, master = full audit.
"""

SIMPLE_TRACKER_LIMIT = 5
SIMPLE_POLICY_LIMIT = 2


def _slim_tracker(t) -> dict:
    if isinstance(t, dict):
        return {
            "domain": t.get("domain"),
            "company": t.get("company"),
            "type": t.get("type"),
        }
    return {
        "domain": t.domain,
        "company": t.company,
        "type": t.type,
    }


def _build_simple_summary(
    tracker_count: int,
    mismatch_count: int,
    policy_found: bool,
    leak_count: int,
) -> str:
    parts = [
        "Quick public check of the homepage only. "
    ]
    if tracker_count == 0:
        parts.append("Few third-party connections were seen on this page. ")
    else:
        parts.append(
            f"About {tracker_count} third-party connection(s) were observed. "
        )
    if not policy_found:
        parts.append("A clear privacy policy was not easy to find. ")
    elif mismatch_count > 0:
        parts.append(
            f"There may be {mismatch_count} gap(s) between policy and behavior — "
            "enable Master scan on a site you own for details. "
        )
    else:
        parts.append("Policy and behavior look broadly aligned at a high level. ")
    if leak_count > 0:
        parts.append("Some data-handling signals were flagged — see scores below.")
    else:
        parts.append("No major data signals were flagged in this brief scan.")
    return "".join(parts)


def format_report_for_mode(scan_mode: str, full: dict) -> dict:
    if scan_mode == "master":
        full["report_tier"] = "master"
        full["tracker_total"] = len(full.get("trackers", []))
        full["mismatch_count"] = len(full.get("mismatches", []))
        full["leak_count"] = len(full.get("leaks", []))
        full["upgrade_message"] = None
        return full

    trackers = full.get("trackers", [])
    mismatches = full.get("mismatches", [])
    leaks = full.get("leaks", [])
    policy_summary = full.get("policy_summary", [])
    policy_found = not any(
        "Could not analyze privacy policy" in c for c in policy_summary
    )

    tracker_total = len(trackers)
    mismatch_count = len(mismatches)
    leak_count = len(leaks)

    data_flow = full.get("data_flow") or {}
    simple_flow = {
        "your_site": data_flow.get("your_site"),
        "total_connections": data_flow.get("total_connections", 0),
        "third_party_groups": [
            {
                "category": g.get("category"),
                "count": g.get("count"),
                "partners": [],
            }
            for g in (data_flow.get("third_party_groups") or [])
        ],
        "description": (
            "Summary only — domain names are hidden in Simple scan. "
            "Use Master scan on a site you own for the full data-flow breakdown."
        ),
        "summary_only": True,
    }

    return {
        **{k: v for k, v in full.items() if k not in (
            "trackers", "mismatches", "leaks", "policy_summary",
            "plain_language", "data_flow", "compliance_insights", "website_details",
        )},
        "report_tier": "simple",
        "tracker_total": tracker_total,
        "mismatch_count": mismatch_count,
        "leak_count": leak_count,
        "trackers": [_slim_tracker(t) for t in trackers[:SIMPLE_TRACKER_LIMIT]],
        "trackers_truncated": tracker_total > SIMPLE_TRACKER_LIMIT,
        "mismatches": [],
        "mismatches_hidden": mismatch_count > 0,
        "leaks": [],
        "leak_alert": leak_count > 0,
        "policy_summary": policy_summary[:SIMPLE_POLICY_LIMIT],
        "policy_truncated": len(policy_summary) > SIMPLE_POLICY_LIMIT,
        "plain_language": (full.get("plain_language") or [])[:2],
        "data_flow": simple_flow,
        "compliance_insights": (full.get("compliance_insights") or [])[:2],
        "website_details": None,
        "simple_summary": _build_simple_summary(
            tracker_total, mismatch_count, policy_found, leak_count
        ),
        "upgrade_message": (
            "This was a Simple scan (homepage only, limited detail). "
            "Enable Master scan on the home page if you own this site and need "
            "full tracker lists, policy gaps, leak notes, and compliance guidance."
        ),
    }
