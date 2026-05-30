import { useState, Fragment } from "react";
import { Database, Target, ChevronDown, ChevronUp, ShieldAlert, Zap } from "lucide-react";

const TYPE_STYLES = {
  analytics: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  advertising: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  exfiltration: "bg-red-500/10 text-red-300 border-red-500/20",
  default: "bg-rose-500/10 text-rose-300 border-rose-500/20",
};

function getTypeStyle(type) {
  const lower = type.toLowerCase();
  if (lower.includes("analytics")) return TYPE_STYLES.analytics;
  if (lower.includes("advertising")) return TYPE_STYLES.advertising;
  if (lower.includes("exfiltration")) return TYPE_STYLES.exfiltration;
  return TYPE_STYLES.default;
}

export default function TrackerTable({ trackers }) {
  const [expandedRow, setExpandedRow] = useState(null);

  if (!trackers?.length) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <Target className="text-indigo-400 w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-white">Detected Trackers</h3>
        </div>
        <div className="flex items-center gap-3 p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
          <Target className="w-5 h-5 shrink-0 opacity-60" />
          No trackers or exfiltration endpoints were detected.
        </div>
      </div>
    );
  }

  const toggleRow = (idx) => {
    setExpandedRow(expandedRow === idx ? null : idx);
  };

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
            <Target className="text-indigo-400 w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Detected Endpoints</h3>
            <p className="text-xs text-slate-500">{trackers.length} tracker{trackers.length !== 1 ? "s" : ""} found</p>
          </div>
        </div>
        <span className="section-pill">{trackers.length} total</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/5 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-6 py-3.5 font-medium">Domain</th>
              <th className="px-6 py-3.5 font-medium">Company</th>
              <th className="px-6 py-3.5 font-medium">Type</th>
              <th className="px-6 py-3.5 font-medium text-right">Details</th>
            </tr>
          </thead>
          <tbody>
            {trackers.map((tracker, idx) => {
              const isExpanded = expandedRow === idx;
              const hasBehavior = tracker.confidence !== undefined;

              return (
                <Fragment key={idx}>
                  <tr
                    className={`border-b border-white/[0.03] transition-colors cursor-pointer ${
                      isExpanded ? "bg-indigo-500/[0.06]" : "hover:bg-white/[0.02]"
                    }`}
                    onClick={() => toggleRow(idx)}
                  >
                    <td className="px-6 py-4 font-mono text-xs text-cyan-300/90">{tracker.domain}</td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-2 text-slate-300">
                        <Database className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        {tracker.company}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${getTypeStyle(tracker.type)}`}
                      >
                        {tracker.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 inline-block text-indigo-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 inline-block" />
                      )}
                    </td>
                  </tr>

                  {isExpanded && hasBehavior && (
                    <tr className="bg-black/20">
                      <td colSpan="4" className="px-6 py-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <ShieldAlert
                                className={`w-4 h-4 ${
                                  tracker.risk === "High" || tracker.risk === "Critical"
                                    ? "text-red-400"
                                    : "text-amber-400"
                                }`}
                              />
                              <span className="text-slate-400">Risk:</span>
                              <span className="text-white font-medium">{tracker.risk}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-indigo-400" />
                              <span className="text-slate-400">Confidence:</span>
                              <span className="text-white font-medium">{tracker.confidence}%</span>
                            </div>
                            {tracker.reason?.length > 0 && (
                              <ul className="space-y-1 text-xs text-slate-400">
                                {tracker.reason.map((r, i) => (
                                  <li key={i} className="flex gap-2">
                                    <span className="text-indigo-500">·</span>
                                    {r}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <div className="bg-white/[0.03] border border-white/5 p-4 rounded-xl text-slate-300 text-sm leading-relaxed">
                            <span className="text-indigo-300 font-medium block mb-1.5">Behavior</span>
                            {tracker.explanation}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
