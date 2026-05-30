import { Globe, Tag, Target, FileText, Clock, Layers, StickyNote, BarChart3 } from "lucide-react";

const CATEGORY_LABELS = {
  ecommerce: "E-commerce",
  saas: "SaaS / Web App",
  social: "Social Media",
  news: "News / Media",
  blog: "Blog / Personal",
  finance: "Finance / Banking",
  healthcare: "Healthcare",
  education: "Education",
  other: "Other",
};

const PURPOSE_LABELS = {
  personal: "Personal curiosity",
  business: "Business audit",
  compliance: "Compliance review",
  research: "Research / academic",
  vendor: "Vendor due diligence",
};

function DetailRow({ icon: Icon, label, value, mono = false }) {
  if (!value) return null;

  return (
    <div className="flex gap-3 items-start p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
      <div className="p-1.5 rounded-lg bg-indigo-500/10 shrink-0">
        <Icon className="w-3.5 h-3.5 text-indigo-400" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">{label}</p>
        <p className={`text-sm text-slate-200 mt-0.5 ${mono ? "font-mono break-all text-xs" : ""}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function WebsiteProfile({ websiteDetails, scanMetadata, targetUrl }) {
  const details = websiteDetails || {};
  const metadata = scanMetadata || {};

  const displayName = details.name || metadata.page_title || targetUrl;
  const categoryLabel = CATEGORY_LABELS[details.category] || details.category;
  const purposeLabel = PURPOSE_LABELS[details.scan_purpose] || details.scan_purpose;

  const scannedAt = metadata.scanned_at
    ? new Date(metadata.scanned_at).toLocaleString()
    : null;

  return (
    <div className="glass-card p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500/15 to-cyan-500/10 border border-indigo-500/20">
          <Globe className="text-indigo-400 w-5 h-5" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Website Profile</h3>
          <p className="text-xs text-slate-500">Your submission & scan metadata</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <DetailRow icon={Globe} label="Website" value={displayName} />
        <DetailRow icon={Target} label="URL" value={targetUrl} mono />
        <DetailRow icon={Tag} label="Category" value={categoryLabel} />
        <DetailRow icon={FileText} label="Scan Purpose" value={purposeLabel} />
        <DetailRow
          icon={Layers}
          label="Pages Scanned"
          value={
            metadata.pages_scanned?.length
              ? `${metadata.pages_scanned.length} page(s)`
              : "1 page"
          }
        />
        <DetailRow
          icon={Clock}
          label="Scan Duration"
          value={
            metadata.scan_duration_seconds != null
              ? `${metadata.scan_duration_seconds}s · ${metadata.scan_depth || "standard"} depth`
              : null
          }
        />
        <DetailRow
          icon={BarChart3}
          label="Requests Captured"
          value={
            metadata.total_requests_captured != null
              ? String(metadata.total_requests_captured)
              : null
          }
        />
        <DetailRow icon={Clock} label="Scanned At" value={scannedAt} />
      </div>

      {metadata.pages_scanned?.length > 1 && (
        <div className="mt-5 pt-5 border-t border-white/5">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium mb-3">
            Scanned URLs
          </p>
          <ul className="space-y-1.5">
            {metadata.pages_scanned.map((pageUrl, idx) => (
              <li
                key={idx}
                className="text-xs font-mono text-slate-400 break-all px-3 py-2 rounded-lg bg-black/20 border border-white/5"
              >
                {pageUrl}
              </li>
            ))}
          </ul>
        </div>
      )}

      {details.notes && (
        <div className="mt-5 pt-5 border-t border-white/5">
          <div className="flex gap-3 items-start p-4 rounded-xl bg-indigo-500/[0.06] border border-indigo-500/15">
            <StickyNote className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] text-indigo-400/70 uppercase tracking-widest font-medium mb-1.5">
                Your Notes
              </p>
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{details.notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
