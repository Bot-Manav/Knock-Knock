import { FileText, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function PolicyInsights({
  summary,
  mismatches,
  compact = false,
  truncated = false,
}) {
  return (
    <div className="space-y-5">
      <div className="palette-card p-6 bg-orange">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-terracotta border-2 border-brown">
            <FileText className="w-5 h-5 text-cream" />
          </div>
          <h3 className="font-bold text-brown">
            {compact ? "Policy highlights" : "Policy claims"}
          </h3>
        </div>
        {summary?.length > 0 ? (
          <>
            <ul className="space-y-2">
              {summary.map((claim, idx) => (
                <li
                  key={idx}
                  className="flex gap-2 text-sm text-brown p-3 rounded-xl bg-cream border-2 border-terracotta"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{claim}</span>
                </li>
              ))}
            </ul>
            {compact && truncated && (
              <p className="text-xs text-muted mt-3">
                More policy claims available in Master scan.
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-muted italic p-3 bg-cream rounded-xl border-2 border-terracotta">
            No policy claims could be extracted.
          </p>
        )}
      </div>

      {!compact && (
        <div className="palette-card p-6 bg-cream">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange border-2 border-brown">
              <AlertTriangle className="w-5 h-5 text-brown" />
            </div>
            <h3 className="font-bold text-brown">Policy vs. practice</h3>
          </div>
          {mismatches?.length > 0 ? (
            <ul className="space-y-2">
              {mismatches.map((mismatch, idx) => (
                <li
                  key={idx}
                  className="text-sm text-cream p-3 rounded-xl bg-terracotta border-2 border-brown font-medium"
                >
                  {mismatch}
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex gap-2 p-4 rounded-xl bg-orange border-2 border-brown text-sm font-semibold text-brown">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              No major gaps detected between policy and observed connections.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
