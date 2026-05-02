import { FileText, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function PolicyInsights({ summary, mismatches }) {
  return (
    <div className="space-y-6">
      
      {/* Policy Summary */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="text-blue-400 w-6 h-6" />
          <h3 className="text-lg font-semibold text-white">Policy Claims</h3>
        </div>
        
        {summary && summary.length > 0 ? (
          <ul className="space-y-3">
            {summary.map((claim, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-slate-300 items-start">
                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                <span className="mt-0.5">{claim}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 italic">No clear claims found or policy could not be analyzed.</p>
        )}
      </div>

      {/* Mismatches */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-amber-500 w-6 h-6" />
          <h3 className="text-lg font-semibold text-white">Policy vs Actual</h3>
        </div>

        {mismatches && mismatches.length > 0 ? (
          <ul className="space-y-3">
            {mismatches.map((mismatch, idx) => (
              <li key={idx} className="flex gap-3 text-sm text-amber-200 items-start bg-amber-950/20 p-3 rounded-lg border border-amber-900/30">
                <div className="min-w-2 min-h-2 mt-1.5 rounded-full bg-amber-500"></div>
                <span>{mismatch}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-4 bg-emerald-950/20 border border-emerald-900/30 rounded-lg text-emerald-400 text-sm flex gap-2 items-center">
            <CheckCircle2 className="w-5 h-5" />
            No conflicts detected.
          </div>
        )}
      </div>

    </div>
  );
}
