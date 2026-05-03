import { useState, Fragment } from "react";
import { Database, Target, ChevronDown, ChevronUp, ShieldAlert, Zap } from "lucide-react";

export default function TrackerTable({ trackers }) {
  const [expandedRow, setExpandedRow] = useState(null);

  if (!trackers || trackers.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-white mb-4">Detected Trackers</h3>
        <p className="text-slate-400">No trackers or exfiltration endpoints were detected.</p>
      </div>
    );
  }

  const toggleRow = (idx) => {
    if (expandedRow === idx) {
      setExpandedRow(null);
    } else {
      setExpandedRow(idx);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Target className="text-indigo-400 w-5 h-5" />
          Detected Endpoints ({trackers.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/50 text-slate-400 font-medium">
            <tr>
              <th className="px-6 py-4">Domain</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Classification</th>
              <th className="px-6 py-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {trackers.map((tracker, idx) => {
              const isExpanded = expandedRow === idx;
              const hasBehavior = tracker.confidence !== undefined;

              return (
                <Fragment key={idx}>
                  <tr 
                    className={`hover:bg-slate-800/20 transition-colors cursor-pointer ${isExpanded ? 'bg-slate-800/20' : ''}`}
                    onClick={() => toggleRow(idx)}
                  >
                    <td className="px-6 py-4 font-mono text-xs text-indigo-300">{tracker.domain}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Database className="w-4 h-4 text-slate-500" />
                      {tracker.company}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        tracker.type.toLowerCase().includes('analytics') 
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                          : tracker.type.toLowerCase().includes('advertising')
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : tracker.type.toLowerCase().includes('exfiltration')
                          ? 'bg-red-500/10 text-red-400 border-red-500/20'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}>
                        {tracker.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500">
                      {isExpanded ? <ChevronUp className="w-5 h-5 inline-block" /> : <ChevronDown className="w-5 h-5 inline-block" />}
                    </td>
                  </tr>
                  
                  {isExpanded && hasBehavior && (
                    <tr className="bg-slate-950/50">
                      <td colSpan="4" className="px-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-400">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <ShieldAlert className={`w-4 h-4 ${tracker.risk === 'High' || tracker.risk === 'Critical' ? 'text-red-400' : 'text-amber-400'}`} />
                              <span className="font-semibold text-slate-300">Risk Level:</span> {tracker.risk}
                            </div>
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-indigo-400" />
                              <span className="font-semibold text-slate-300">Confidence:</span> {tracker.confidence}%
                            </div>
                            {tracker.reason && tracker.reason.length > 0 && (
                              <div className="mt-2">
                                <span className="font-semibold text-slate-300 block mb-1">Detected Rules:</span>
                                <ul className="list-disc list-inside text-xs space-y-1">
                                  {tracker.reason.map((r, i) => (
                                    <li key={i}>{r}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                          
                          <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg text-slate-300">
                            <span className="font-semibold text-indigo-300 block mb-1">Behavior Explanation:</span>
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
