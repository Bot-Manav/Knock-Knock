import { Database, Ghost, Target } from "lucide-react";

export default function TrackerTable({ trackers }) {
  if (!trackers || trackers.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-white mb-4">Detected Trackers</h3>
        <p className="text-slate-400">No known trackers were detected.</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-800 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Target className="text-indigo-400 w-5 h-5" />
          Detected Trackers ({trackers.length})
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-800/50 text-slate-400 font-medium">
            <tr>
              <th className="px-6 py-4">Domain</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {trackers.map((tracker, idx) => (
              <tr key={idx} className="hover:bg-slate-800/20 transition-colors">
                <td className="px-6 py-4 font-mono text-xs text-indigo-300">{tracker.domain}</td>
                <td className="px-6 py-4 flex items-center gap-2">
                  <Database className="w-4 h-4 text-slate-500" />
                  {tracker.company}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                    tracker.type.toLowerCase() === 'analytics' 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                      : tracker.type.toLowerCase() === 'advertising'
                      ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {tracker.type}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
