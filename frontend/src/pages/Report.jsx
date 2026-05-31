import { useLocation, useNavigate, Navigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShieldAlert,
  Activity,
  Target,
  CheckCircle2,
  RotateCcw,
  Scale,
  Info,
} from "lucide-react";
import RiskScore from "../components/RiskScore";
import TrackerTable from "../components/TrackerTable";
import PolicyInsights from "../components/PolicyInsights";
import WebsiteProfile from "../components/WebsiteProfile";
import ComplianceInsights from "../components/ComplianceInsights";
import PlainLanguageInsights from "../components/PlainLanguageInsights";
import DataFlowView from "../components/DataFlowView";
import UpgradeBanner from "../components/UpgradeBanner";

export default function Report() {
  const location = useLocation();
  const navigate = useNavigate();
  const { report, targetUrl } = location.state || {};

  if (!report || report.scan_status !== "success") {
    return <Navigate to="/" replace />;
  }

  const isSimple = report.scan_mode === "simple" || report.report_tier === "simple";
  const isMaster = !isSimple;

  const generateMasterSummary = (report) => {
    const numTrackers = report.tracker_total ?? report.trackers?.length ?? 0;
    const numMismatches = report.mismatch_count ?? report.mismatches?.length ?? 0;
    let summary = `Full authorized audit of the page(s) you specified. `;

    if (numTrackers > 0) {
      summary += `${numTrackers} third-party connection(s) were observed with named domains and types. `;
    } else {
      summary += `Few third-party connections were observed. `;
    }

    if (numMismatches > 0) {
      summary += `${numMismatches} specific policy-vs-practice gap(s) are listed below for your team to review. `;
    } else if (numTrackers > 0) {
      summary += `Policy claims appear broadly aligned with observed connections. `;
    }

    if (report.leaks?.length > 0) {
      summary += `Data-handling notes flag items that should be disclosed in your policy and consent flows.`;
    } else {
      summary += `No obvious sensitive payload issues were flagged in this scan.`;
    }

    return summary;
  };

  const alignmentLabel =
    (report.mismatch_count ?? report.mismatches?.length ?? 0) > 0
      ? "Review needed"
      : "Looks aligned";

  const summaryText = isSimple
    ? report.simple_summary || "Brief homepage transparency check."
    : generateMasterSummary(report);

  return (
    <div className="flex-1 px-6 py-8 md:py-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-up">
        <div className="palette-card p-6 md:p-8 bg-orange">
          <button
            onClick={() => navigate("/")}
            className="text-brown font-semibold flex items-center gap-2 mb-4 text-sm opacity-80 hover:opacity-100"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex flex-col md:flex-row md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-terracotta border-2 border-brown">
                <Activity className="w-5 h-5 text-cream" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-brown">
                  {isSimple ? "Quick Transparency Check" : "Full Transparency Report"}
                </h2>
                <p className="text-sm text-muted">
                  {isSimple
                    ? "Simple scan — homepage, limited detail"
                    : "Master scan — complete audit"}
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="btn-primary inline-flex items-center gap-2 py-2.5 px-5 text-sm self-start"
            >
              <RotateCcw className="w-4 h-4" />
              New Check
            </Link>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="stat-badge font-mono text-xs max-w-full truncate bg-cream">
              <Target className="w-3.5 h-3.5" />
              {targetUrl}
            </span>
            <span className="stat-badge bg-terracotta text-cream border-brown">
              <Scale className="w-3.5 h-3.5" />
              {alignmentLabel}
            </span>
            <span
              className={`stat-badge border-brown ${
                isSimple ? "bg-cream" : "bg-terracotta text-cream"
              }`}
            >
              {isSimple ? "Simple scan" : "Master scan"}
            </span>
          </div>
        </div>

        <UpgradeBanner message={report.upgrade_message} isSimple={isSimple} />

        <div className="palette-card p-6 md:p-8 bg-terracotta">
          <span className="section-pill mb-3 bg-orange text-brown border-brown">Summary</span>
          <p className="text-cream text-base md:text-lg leading-relaxed font-medium">
            {summaryText}
          </p>
        </div>

        <PlainLanguageInsights insights={report.plain_language} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <RiskScore
            score={report.risk_score}
            title="Privacy Risk"
            description={
              isSimple
                ? "High-level signal from homepage only"
                : "Full analysis across scanned pages"
            }
            type="risk"
          />
          <RiskScore
            score={report.transparency_score}
            title="Transparency Score"
            description={
              isSimple
                ? "Based on limited policy sample"
                : "Policy alignment across full scan"
            }
            type="transparency"
          />
        </div>

        <DataFlowView dataFlow={report.data_flow} isSimple={isSimple} />

        <ComplianceInsights insights={report.compliance_insights} />

        {isSimple && report.mismatches_hidden && (
          <div className="palette-card-soft p-4 flex gap-3 bg-cream">
            <Info className="w-5 h-5 text-brown shrink-0" />
            <p className="text-sm text-brown">
              <strong>{report.mismatch_count} possible policy gap(s)</strong> were detected but
              are not listed in Simple scan. Use Master scan if you own this site to see each item.
            </p>
          </div>
        )}

        {isSimple ? (
          <>
            <TrackerTable
              trackers={report.trackers}
              compact
              totalCount={report.tracker_total}
              truncated={report.trackers_truncated}
            />

            {report.leak_alert && (
              <div className="palette-card p-5 bg-orange flex gap-3">
                <ShieldAlert className="w-5 h-5 text-brown shrink-0" />
                <p className="text-sm text-brown font-medium">
                  Some data-handling signals were detected. Master scan shows exactly what was
                  found and how to address it in your policy.
                </p>
              </div>
            )}

            <PolicyInsights
              summary={report.policy_summary}
              mismatches={[]}
              compact
              truncated={report.policy_truncated}
            />
          </>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              <TrackerTable trackers={report.trackers} />

              <div className="palette-card p-6 bg-orange">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-cream border-2 border-brown">
                    <ShieldAlert className="w-5 h-5 text-brown" />
                  </div>
                  <h3 className="font-bold text-brown">Data handling notes</h3>
                </div>
                {report.leaks?.length > 0 ? (
                  <ul className="space-y-2">
                    {report.leaks.map((leak, idx) => (
                      <li
                        key={idx}
                        className="p-3 rounded-xl bg-cream border-2 border-brown text-sm text-brown"
                      >
                        {leak}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex items-center gap-2 p-4 rounded-xl bg-cream border-2 border-brown text-sm font-semibold text-brown">
                    <CheckCircle2 className="w-5 h-5" />
                    No obvious sensitive payload issues in this scan.
                  </div>
                )}
              </div>
            </div>

            <PolicyInsights
              summary={report.policy_summary}
              mismatches={report.mismatches}
            />
          </div>
        )}

        {isMaster && (
          <WebsiteProfile
            websiteDetails={report.website_details}
            scanMetadata={report.scan_metadata}
            targetUrl={targetUrl}
          />
        )}
      </div>
    </div>
  );
}
