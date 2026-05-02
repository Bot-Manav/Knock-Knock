import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { ArrowLeft, ShieldAlert, FileText, Activity, Fingerprint } from "lucide-react";
import RiskScore from "../components/RiskScore";
import TrackerTable from "../components/TrackerTable";
import PolicyInsights from "../components/PolicyInsights";

export default function Report() {
  const location = useLocation();
  const navigate = useNavigate();
  const { report, targetUrl } = location.state || {};

  if (!report) {
    return <Navigate to="/" />;
  }

  // Generate the simple terms summary
  const generateSummary = (report) => {
    const numTrackers = report.trackers.length;
    const numMismatches = report.mismatches.length;
    let summary = `We detected ${numTrackers} tracking services on this website. `;
    
    if (numMismatches > 0) {
      summary += `Concerningly, there are ${numMismatches} trackers active that are not clearly disclosed in their privacy policy. `;
    } else {
      summary += `Their privacy policy appears to match the actual trackers detected. `;
    }

    if (report.leaks && report.leaks.length > 0) {
      summary += `Additionally, we detected potential data leaks in the network requests, which means your sensitive information might be exposed.`;
    }

    return summary;
  };

  return (
    <div className="flex-1 bg-slate-950 p-6 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-slate-900 p-6 rounded-xl border border-slate-800 shadow-sm">
          <div>
            <button 
              onClick={() => navigate(-1)}
              className="text-slate-400 hover:text-white flex items-center gap-2 mb-2 text-sm transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Scanner
            </button>
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Activity className="text-indigo-400" />
              Scan Results
            </h2>
            <p className="text-slate-400 mt-1">Target: <span className="text-slate-200 font-mono">{targetUrl}</span></p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Fingerprint className="w-32 h-32 text-indigo-300" />
          </div>
          <h3 className="text-xl font-semibold text-indigo-300 mb-3 relative z-10">In Simple Terms</h3>
          <p className="text-slate-200 text-lg leading-relaxed relative z-10">
            {generateSummary(report)}
          </p>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RiskScore 
            score={report.risk_score} 
            title="Privacy Risk Score" 
            description="0 = Safe, 100 = Critical Risk" 
            type="risk"
          />
          <RiskScore 
            score={report.transparency_score} 
            title="Transparency Score" 
            description="0 = Poor, 100 = Fully Transparent" 
            type="transparency"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            <TrackerTable trackers={report.trackers} />
            
            {/* Leaks Section */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <ShieldAlert className="text-red-400 w-6 h-6" />
                <h3 className="text-lg font-semibold text-white">Potential Data Leaks</h3>
              </div>
              {report.leaks && report.leaks.length > 0 ? (
                <ul className="space-y-3">
                  {report.leaks.map((leak, idx) => (
                    <li key={idx} className="bg-red-950/30 border border-red-900/50 p-4 rounded-lg text-red-200 text-sm flex gap-3 items-start">
                      <div className="mt-0.5 min-w-2 min-h-2 rounded-full bg-red-500"></div>
                      {leak}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-lg text-emerald-400 text-sm">
                  No obvious data leaks detected in network payloads.
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PolicyInsights 
              summary={report.policy_summary} 
              mismatches={report.mismatches} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
