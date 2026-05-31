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
  personal: "Personal transparency check",
  business: "Business / vendor review",
  compliance: "Compliance & policy audit",
  research: "Research (with permission)",
  vendor: "Partner due diligence",
};

function DetailRow({ icon: Icon, label, value, mono = false }) {
  if (!value) return null;
  return (
    <div className="flex gap-3 p-3 rounded-xl bg-cream border-2 border-terracotta">
      <Icon className="w-4 h-4 text-brown shrink-0 mt-0.5" />
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase text-brown opacity-70">{label}</p>
        <p className={`text-sm font-semibold text-brown ${mono ? "font-mono text-xs break-all" : ""}`}>
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
  const scannedAt = metadata.scanned_at ? new Date(metadata.scanned_at).toLocaleString() : null;

  return (
    <div className="palette-card p-6 md:p-8 bg-orange">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-xl bg-terracotta border-2 border-brown">
          <Globe className="w-5 h-5 text-cream" />
        </div>
        <h3 className="text-lg font-bold text-brown">Your scan details</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <DetailRow icon={Globe} label="Website" value={displayName} />
        <DetailRow icon={Target} label="URL" value={targetUrl} mono />
        <DetailRow icon={Tag} label="Category" value={categoryLabel} />
        <DetailRow icon={FileText} label="Purpose" value={purposeLabel} />
        <DetailRow
          icon={Layers}
          label="Pages checked"
          value={
            metadata.pages_scanned?.length
              ? `${metadata.pages_scanned.length} (only URLs you listed)`
              : "1"
          }
        />
        <DetailRow
          icon={Clock}
          label="Duration"
          value={
            metadata.scan_duration_seconds != null
              ? `${metadata.scan_duration_seconds}s`
              : null
          }
        />
        <DetailRow
          icon={BarChart3}
          label="Requests"
          value={
            metadata.total_requests_captured != null
              ? String(metadata.total_requests_captured)
              : null
          }
        />
        <DetailRow icon={Clock} label="Completed" value={scannedAt} />
      </div>
      {details.notes && (
        <div className="mt-4 p-4 rounded-xl bg-terracotta border-2 border-brown flex gap-3">
          <StickyNote className="w-4 h-4 shrink-0 text-cream" />
          <p className="text-sm font-medium text-cream whitespace-pre-wrap">{details.notes}</p>
        </div>
      )}
    </div>
  );
}
