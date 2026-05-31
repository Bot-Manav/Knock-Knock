import { useState, Fragment } from "react";
import { Database, Target, ChevronDown, ChevronUp } from "lucide-react";

export default function TrackerTable({
  trackers,
  compact = false,
  totalCount,
  truncated = false,
}) {
  const [expandedRow, setExpandedRow] = useState(null);
  const count = totalCount ?? trackers?.length ?? 0;

  if (!trackers?.length) {
    return (
      <div className="palette-card p-6 bg-orange">
        <div className="flex items-center gap-3 mb-3">
          <Target className="w-5 h-5 text-brown" />
          <h3 className="font-bold text-brown">
            {compact ? "Top connections (sample)" : "Third-party connections"}
          </h3>
        </div>
        <p className="text-sm text-brown p-4 bg-cream rounded-xl border-2 border-brown font-medium">
          None detected on the scanned page — good for minimal data sharing.
        </p>
      </div>
    );
  }

  return (
    <div className="palette-card overflow-hidden bg-cream">
      <div className="p-5 border-b-2 border-terracotta flex justify-between items-center bg-orange">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-brown" />
          <h3 className="font-bold text-brown">
            {compact ? "Top connections (sample)" : "Third-party connections"}
          </h3>
        </div>
        <span className="section-pill text-[10px]">
          {compact && truncated ? `${trackers.length} of ${count}` : count}
        </span>
      </div>
      {compact && truncated && (
        <p className="px-5 py-2 text-xs text-brown bg-cream border-b border-terracotta">
          Showing first {trackers.length} of {count}. Master scan lists all partners with full
          details.
        </p>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-brown">
          <thead>
            <tr className="border-b-2 border-brown bg-terracotta text-cream font-bold text-xs uppercase">
              <th className="px-5 py-3 text-left">Domain</th>
              <th className="px-5 py-3 text-left">Company</th>
              <th className="px-5 py-3 text-left">Type</th>
              {!compact && <th className="px-5 py-3 text-right" />}
            </tr>
          </thead>
          <tbody>
            {trackers.map((tracker, idx) => {
              const isExpanded = expandedRow === idx;
              const hasBehavior = !compact && tracker.confidence !== undefined;

              return (
                <Fragment key={idx}>
                  <tr
                    className={`border-b border-terracotta ${
                      !compact ? "cursor-pointer hover:bg-orange/60" : ""
                    } ${isExpanded ? "bg-orange" : ""}`}
                    onClick={() => !compact && setExpandedRow(isExpanded ? null : idx)}
                  >
                    <td className="px-5 py-3 font-mono text-xs font-semibold">
                      {tracker.domain}
                    </td>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-1.5">
                        <Database className="w-3.5 h-3.5 opacity-60" />
                        {tracker.company}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-cream border-2 border-brown">
                        {tracker.type}
                      </span>
                    </td>
                    {!compact && (
                      <td className="px-5 py-3 text-right">
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 inline" />
                        ) : (
                          <ChevronDown className="w-4 h-4 inline" />
                        )}
                      </td>
                    )}
                  </tr>
                  {isExpanded && hasBehavior && (
                    <tr className="bg-orange">
                      <td colSpan="4" className="px-5 py-4 text-xs">
                        <p>
                          <strong>Risk:</strong> {tracker.risk} · <strong>Confidence:</strong>{" "}
                          {tracker.confidence}%
                        </p>
                        {tracker.explanation && (
                          <p className="mt-2 p-3 bg-cream rounded-lg border-2 border-terracotta">
                            {tracker.explanation}
                          </p>
                        )}
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
