"""
Ethical, policy-focused guidance — transparency and agreement alignment, not exploitation.
"""


def build_compliance_insights(
    detected_trackers,
    mismatches,
    policy_claims,
    policy_found: bool,
    pages_scanned: list,
    scan_mode: str = "simple",
):
    if scan_mode == "simple":
        return _simple_compliance_insights(
            detected_trackers, mismatches, policy_found
        )
    return _master_compliance_insights(
        detected_trackers, mismatches, policy_claims,
        policy_found, pages_scanned,
    )


def _simple_compliance_insights(detected_trackers, mismatches, policy_found):
    """Brief, ethical guidance for public curiosity scans."""
    insights = [{
        "type": "ethics",
        "title": "Simple scan — limited by design",
        "body": (
            "We only loaded the homepage you entered. We do not list every policy gap "
            "or partner domain in this mode — that protects sites you do not own from "
            "deep inspection. For a full compliance report, use Master scan with permission."
        ),
    }]
    n = len(detected_trackers)
    if not policy_found:
        insights.append({
            "type": "policy",
            "title": "At a glance",
            "body": (
                "No clear privacy policy was found from the homepage. "
                f"About {n} third-party connection(s) were detected."
            ),
        })
    elif mismatches:
        insights.append({
            "type": "alignment",
            "title": "At a glance",
            "body": (
                f"About {n} third-party connection(s) and possible policy gaps were detected. "
                "Enable Master scan if you own this site to see exactly what differs."
            ),
        })
    else:
        insights.append({
            "type": "alignment",
            "title": "At a glance",
            "body": (
                f"About {n} third-party connection(s) observed; policy looks broadly aligned "
                "at a high level on this page."
            ),
        })
    return insights


def _master_compliance_insights(
    detected_trackers,
    mismatches,
    policy_claims,
    policy_found: bool,
    pages_scanned: list,
):
    insights = [{
        "type": "ethics",
        "title": "Master scan (authorized review)",
        "body": (
            "You confirmed permission to review this site. This report includes full "
            "tracker names, policy mismatches, leak notes, and compliance steps for "
            "your team or legal review."
        ),
    }]

    if not policy_found:
        insights.append({
            "type": "policy",
            "title": "Privacy policy not found",
            "body": (
                "A clear, accessible privacy policy is a foundation of user trust and many "
                "regulations (GDPR, CCPA, etc.). Consider publishing one and linking it in the footer."
            ),
        })
    elif mismatches:
        insights.append({
            "type": "alignment",
            "title": "Policy vs. practice gap",
            "body": (
                f"We found {len(mismatches)} area(s) where live connections may not match what the "
                "policy describes. Updating the policy—or adjusting site configuration—to reflect "
                "actual data sharing supports transparency and user consent."
            ),
        })
    else:
        insights.append({
            "type": "alignment",
            "title": "Good policy alignment",
            "body": (
                "Based on this scan, third-party connections appear consistent with policy claims. "
                "Keep policies updated when you add new analytics or partners."
            ),
        })

    if detected_trackers:
        third_party_count = len(detected_trackers)
        insights.append({
            "type": "transparency",
            "title": "Third-party disclosure",
            "body": (
                f"This scan observed {third_party_count} third-party connection(s). Ethical sites "
                "name each partner, explain what data is shared, and offer opt-out where required."
            ),
        })
    else:
        insights.append({
            "type": "transparency",
            "title": "Minimal third-party footprint",
            "body": (
                "Few or no third-party trackers were observed on the scanned page(s). "
                "Document this in your privacy policy if it reflects your usual user experience."
            ),
        })

    if len(pages_scanned) > 1:
        insights.append({
            "type": "scope",
            "title": "Multi-page review",
            "body": (
                f"You scanned {len(pages_scanned)} user-specified page(s). Policies should describe "
                "data practices across checkout, login, and account areas—not only the homepage."
            ),
        })

    insights.append({
        "type": "next_steps",
        "title": "Recommended next steps",
        "body": (
            "Review your privacy policy with legal counsel, ensure cookie/consent banners match "
            "actual trackers, and re-scan after site changes. Use this report for transparency audits, "
            "not unauthorized testing of sites you do not own or have permission to review."
        ),
    })

    return insights
