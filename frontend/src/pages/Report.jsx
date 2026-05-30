import { useLocation, useNavigate, Navigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  ShieldAlert,
  Activity,
  Fingerprint,
  Target,
  AlertTriangle,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";
import RiskScore from "../components/RiskScore";
import TrackerTable from "../components/TrackerTable";
import PolicyInsights from "../components/PolicyInsights";
import WebsiteProfile from "../components/WebsiteProfile";

export default function Report() {
  const location = useLocation();
  const navigate = useNavigate();
  const { report, targetUrl } = location.state || {};

  if (!report) {
    return <Navigate to="/" />;
  }

  const generateSummary = (report) => {
    const numTrackers = report.trackers.length;
    const numMismatches = report.mismatches.length;
    let summary = `We detected ${numTrackers} tracking service${numTrackers !== 1 ? "s" : ""} on this website. `;

    if (numMismatches > 0) {
      summary += `Concerningly, ${numMismatches} tracker${numMismatches !== 1 ? "s are" : " is"} active without clear disclosure in their privacy policy. `;
    } else {
      summary += `Their privacy policy appears to align with the trackers we observed. `;
    }

    if (report.leaks?.length > 0) {
      summary += `We also found potential data leaks in network requests — sensitive information may be exposed.`;
    }

    return summary;
  };

  const riskLevel =
    report.risk_score >= 70 ? "critical" : report.risk_score >= 40 ? "moderate" : "low";

  const riskColors = {
    critical: "bg-red-500/10 text-red-400 border-red-500/25",
    moderate: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
  };

  return (
    <div className="flex-1 px-6 py-8 md:py-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-6 animate-fade-up">

        {/* Header */}
        <div className="glass-card p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-3">
              <button
                onClick={() => navigate(-1)}
                className="text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                Back to Scanner
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
                  <Activity className="text-indigo-400 w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">Scan Results</h2>
                  <p className="text-slate-500 text-sm mt-0.5">Privacy analysis complete</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="stat-badge bg-slate-800/60 text-slate-300 border border-white/5">
                  <Target className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono text-xs truncate max-w-[280px] sm:max-w-md">{targetUrl}</span>
                </span>
                <span className={`stat-badge border ${riskColors[riskLevel]}`}>
                  {riskLevel === "critical" && <AlertTriangle className="w-3.5 h-3.5" />}
                  {riskLevel === "moderate" && <ShieldAlert className="w-3.5 h-3.5" />}
                  {riskLevel === "low" && <CheckCircle2 className="w-3.5 h-3.5" />}
                  {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)} risk
                </span>
              </div>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/25 px-4 py-2.5 rounded-xl transition-all shrink-0 self-start"
            >
              <RotateCcw className="w-4 h-4" />
              New Scan
            </Link>
          </div>
        </div>

        {/* Summary */}
        <div className="glass-card p-6 md:p-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-4 right-6 opacity-[0.06] pointer-events-none">
            <Fingerprint className="w-28 h-28 text-indigo-300" />
          </div>
          <span className="section-pill mb-4 relative z-10">Executive Summary</span>
          <h3 className="text-xl font-semibold gradient-text mb-3 relative z-10">In Simple Terms</h3>
          <p className="text-slate-300 text-base md:text-lg leading-relaxed relative z-10 max-w-3xl">
            {generateSummary(report)}
          </p>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <RiskScore
            score={report.risk_score}
            title="Privacy Risk Score"
            description="0 = Safe · 100 = Critical"
            type="risk"
          />
          <RiskScore
            score={report.transparency_score}
            title="Transparency Score"
            description="0 = Opaque · 100 = Fully Transparent"
            type="transparency"
          />
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <TrackerTable trackers={report.trackers} />

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <ShieldAlert className="text-red-400 w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Potential Data Leaks</h3>
                  <p className="text-xs text-slate-500">Sensitive data found in network payloads</p>
                </div>
              </div>
              {report.leaks?.length > 0 ? (
                <ul className="space-y-2.5">
                  {report.leaks.map((leak, idx) => (
                    <li
                      key={idx}
                      className="flex gap-3 items-start bg-red-950/20 border border-red-500/15 p-4 rounded-xl text-red-200 text-sm"
                    >
                      <div className="mt-1.5 w-2 h-2 rounded-full bg-red-400 shrink-0 animate-pulse" />
                      {leak}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center gap-3 p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  No obvious data leaks detected in network payloads.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-5">
            <PolicyInsights summary={report.policy_summary} mismatches={report.mismatches} />
          </div>
        </div>

        <WebsiteProfile
          websiteDetails={report.website_details}
          scanMetadata={report.scan_metadata}
          targetUrl={targetUrl}
        />
      </div>
    </div>
  );
}
