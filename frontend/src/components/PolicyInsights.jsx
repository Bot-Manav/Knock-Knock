import { FileText, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function PolicyInsights({ summary, mismatches }) {
  return (
    <div className="space-y-5">
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <FileText className="text-blue-400 w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Policy Claims</h3>
            <p className="text-xs text-slate-500">What the privacy policy states</p>
          </div>
        </div>

        {summary?.length > 0 ? (
          <ul className="space-y-2.5">
            {summary.map((claim, idx) => (
              <li
                key={idx}
                className="flex gap-3 text-sm text-slate-300 items-start bg-white/[0.02] border border-white/5 p-3 rounded-xl"
              >
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{claim}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500 italic p-3 bg-white/[0.02] rounded-xl border border-white/5">
            No clear claims found or policy could not be analyzed.
          </p>
        )}
      </div>

      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="text-amber-400 w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Policy vs Actual</h3>
            <p className="text-xs text-slate-500">Discrepancies found</p>
          </div>
        </div>

        {mismatches?.length > 0 ? (
          <ul className="space-y-2.5">
            {mismatches.map((mismatch, idx) => (
              <li
                key={idx}
                className="flex gap-3 text-sm text-amber-200 items-start bg-amber-950/20 p-3.5 rounded-xl border border-amber-500/15"
              >
                <div className="mt-1.5 w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <span>{mismatch}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center gap-3 p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            No conflicts detected between policy and traffic.
          </div>
        )}
      </div>
    </div>
  );
}
