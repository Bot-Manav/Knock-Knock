import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  Search,
  Loader2,
  ChevronDown,
  ChevronUp,
  Globe,
  Info,
  Scale,
  FileCheck,
  Handshake,
  Heart,
} from "lucide-react";
import { validateUrlInput, parseApiError } from "../utils/validateUrl";

const WEBSITE_CATEGORIES = [
  { value: "", label: "Select category (optional)" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "saas", label: "SaaS / Web App" },
  { value: "social", label: "Social Media" },
  { value: "news", label: "News / Media" },
  { value: "blog", label: "Blog / Personal" },
  { value: "finance", label: "Finance / Banking" },
  { value: "healthcare", label: "Healthcare" },
  { value: "education", label: "Education" },
  { value: "other", label: "Other" },
];

const SCAN_PURPOSES = [
  { value: "", label: "Purpose of this check (optional)" },
  { value: "personal", label: "Personal transparency check" },
  { value: "business", label: "Business / vendor review" },
  { value: "compliance", label: "Compliance & policy audit" },
  { value: "research", label: "Research (with permission)" },
  { value: "vendor", label: "Partner due diligence" },
];

const FEATURES = [
  { icon: FileCheck, label: "Policy alignment" },
  { icon: Handshake, label: "User agreements" },
  { icon: Scale, label: "Transparency score" },
  { icon: Heart, label: "Ethical scanning" },
];

export default function Home() {
  const [url, setUrl] = useState("");
  const [websiteName, setWebsiteName] = useState("");
  const [category, setCategory] = useState("");
  const [scanPurpose, setScanPurpose] = useState("");
  const [additionalPages, setAdditionalPages] = useState("");
  const [scanDepth, setScanDepth] = useState("standard");
  const [notes, setNotes] = useState("");
  const [policyUrl, setPolicyUrl] = useState("");
  const [policyText, setPolicyText] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [masterScan, setMasterScan] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleScan = async (e) => {
    e.preventDefault();
    setError(null);

    const validation = validateUrlInput(url);
    if (!validation.ok) {
      setError(validation.message);
      return;
    }

    const formattedUrl = validation.url;
    const extraPages = masterScan
      ? additionalPages
          .split(/[\n,]+/)
          .map((p) => p.trim())
          .filter(Boolean)
      : [];

    const websiteDetails = {
      ...(websiteName.trim() && { name: websiteName.trim() }),
      ...(category && { category }),
      ...(scanPurpose && { scan_purpose: scanPurpose }),
      ...(notes.trim() && masterScan && { notes: notes.trim() }),
      ...(extraPages.length > 0 && { additional_pages: extraPages }),
      scan_depth: masterScan ? scanDepth : "standard",
      scan_mode: masterScan ? "master" : "simple",
    };

    setIsScanning(true);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const response = await fetch(`${baseUrl}/api/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: formattedUrl,
          policy_url: masterScan ? policyUrl.trim() || undefined : undefined,
          policy_text: masterScan ? policyText.trim() || undefined : undefined,
          website_details: websiteDetails,
        }),
      });

      if (!response.ok) {
        throw new Error(await parseApiError(response));
      }

      const reportData = await response.json();
      if (reportData.scan_status !== "success") {
        throw new Error("We could not complete a valid scan for this website.");
      }

      navigate("/report", { state: { report: reportData, targetUrl: formattedUrl } });
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-10 md:py-14">
      <div className="max-w-3xl w-full space-y-8">
        <div className="text-center space-y-5 animate-fade-up">
          <div className="flex justify-center">
            <div className="p-5 rounded-2xl bg-orange border-2 border-brown">
              <ShieldCheck className="w-14 h-14 text-brown" strokeWidth={1.5} />
            </div>
          </div>

          <div className="space-y-3">
            <span className="section-pill">Policy & Transparency</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-brown leading-tight">
              Are privacy policies
              <br />
              honest & aligned?
            </h1>
            <p className="text-base md:text-lg text-body max-w-xl mx-auto leading-relaxed">
              Check whether a website&apos;s privacy policy matches its real behavior — for
              transparency, compliance, and fair user agreements. Not for hacking or probing.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {FEATURES.map(({ icon: Icon, label }) => (
              <span key={label} className="feature-chip">
                <Icon className="w-3.5 h-3.5" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="ethics-banner p-4 md:p-5 text-sm font-medium leading-relaxed animate-fade-up">
          <strong className="block mb-1">Two scan modes</strong>
          <strong>Simple scan</strong> — check any public site (homepage only).{" "}
          <strong>Master scan</strong> — full audit when you own the site or have permission
          (extra pages, depth, custom policy).
        </div>

        <form onSubmit={handleScan} className="max-w-2xl mx-auto space-y-5">
          <div className="palette-card flex flex-col sm:flex-row overflow-hidden">
            <div className="flex items-center flex-1 min-w-0 bg-cream">
              <div className="pl-4 pr-2 py-3 shrink-0">
                <Search className="w-5 h-5 text-brown" />
              </div>
              <input
                type="text"
                placeholder="example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isScanning}
                className="w-full bg-transparent text-brown placeholder-brown placeholder-opacity-40 py-4 text-base outline-none font-mono font-semibold disabled:opacity-50"
                required
              />
            </div>
            <div className="p-2 bg-orange border-t-2 sm:border-t-0 sm:border-l-2 border-brown">
              <button
                type="submit"
                disabled={isScanning || !url.trim()}
                className="btn-primary w-full sm:w-auto py-3 px-6 flex items-center justify-center gap-2 text-sm"
              >
                {isScanning ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Checking…
                  </>
                ) : masterScan ? (
                  "Master Scan"
                ) : (
                  "Simple Scan"
                )}
              </button>
            </div>
          </div>

          <label className="flex items-start gap-3 p-4 rounded-xl bg-cream border-2 border-terracotta cursor-pointer">
            <input
              type="checkbox"
              checked={masterScan}
              onChange={(e) => setMasterScan(e.target.checked)}
              disabled={isScanning}
              className="mt-1 w-4 h-4 accent-terracotta shrink-0"
            />
            <span className="text-sm text-brown leading-relaxed">
              <strong>Enable Master scan</strong> — I own this website or have permission for a
              full audit (extra pages, thorough depth, custom policy URL/text). Leave unchecked
              for a quick <strong>Simple scan</strong> of the homepage only.
            </span>
          </label>

          {masterScan && (
          <div className="palette-card p-6 space-y-4 bg-orange">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-terracotta border-2 border-brown">
                <Globe className="w-4 h-4 text-cream" />
              </div>
              <div>
                <h2 className="font-bold text-brown">Website context</h2>
                <p className="text-xs text-muted">Optional — helps your compliance report</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-brown uppercase mb-1">Name</label>
                <input
                  type="text"
                  placeholder="e.g. Acme Store"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  disabled={isScanning}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-brown uppercase mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isScanning}
                  className="input-field"
                >
                  {WEBSITE_CATEGORIES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brown uppercase mb-1">Purpose</label>
              <select
                value={scanPurpose}
                onChange={(e) => setScanPurpose(e.target.value)}
                disabled={isScanning}
                className="input-field"
              >
                {SCAN_PURPOSES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brown uppercase mb-1">
                Extra pages you list (not auto-discovered)
              </label>
              <input
                type="text"
                placeholder="/privacy, /terms — only paths you specify"
                value={additionalPages}
                onChange={(e) => setAdditionalPages(e.target.value)}
                disabled={isScanning}
                className="input-field font-mono text-sm"
              />
              <p className="text-xs text-muted mt-1 flex items-center gap-1">
                <Info className="w-3 h-3" />
                We only visit URLs you provide — never random site paths
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-brown uppercase mb-2">Depth</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "standard", label: "Standard", desc: "~15s" },
                  { value: "thorough", label: "Thorough", desc: "~25s" },
                ].map((opt) => (
                  <label key={opt.value} className="cursor-pointer">
                    <input
                      type="radio"
                      name="scanDepth"
                      value={opt.value}
                      checked={scanDepth === opt.value}
                      onChange={(e) => setScanDepth(e.target.value)}
                      disabled={isScanning}
                      className="sr-only peer"
                    />
                    <div className="p-3 rounded-xl bg-cream border-2 border-terracotta peer-checked:border-brown peer-checked:bg-orange">
                      <p className="text-sm font-bold text-brown">{opt.label}</p>
                      <p className="text-xs text-muted">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-brown uppercase mb-1">Notes</label>
              <textarea
                placeholder="Compliance context for your records…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isScanning}
                rows={2}
                className="input-field resize-y"
              />
            </div>
          </div>
          )}

          {masterScan && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm font-semibold text-brown flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-terracotta bg-cream"
            >
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showAdvanced ? "Hide policy options" : "Policy URL or text"}
            </button>
          </div>
          )}

          {masterScan && showAdvanced && (
            <div className="palette-card-soft p-6 space-y-4 bg-cream">
              <p className="text-sm text-body">
                Paste or link a privacy policy if auto-discovery does not find one.
              </p>
              <input
                type="text"
                placeholder="https://example.com/privacy"
                value={policyUrl}
                onChange={(e) => setPolicyUrl(e.target.value)}
                disabled={isScanning}
                className="input-field font-mono text-sm"
              />
              <textarea
                placeholder="Or paste policy text…"
                value={policyText}
                onChange={(e) => setPolicyText(e.target.value)}
                disabled={isScanning}
                rows={4}
                className="input-field resize-y text-sm"
              />
            </div>
          )}

          {error && (
            <div className="error-box p-4 flex gap-3 text-sm font-semibold">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold mb-0.5">Could not scan this site</p>
                <p className="font-normal opacity-90">{error}</p>
              </div>
            </div>
          )}
        </form>

        {isScanning && (
          <div className="max-w-md mx-auto palette-card p-6 text-center space-y-4 bg-orange">
            <Loader2 className="w-8 h-8 text-brown animate-spin mx-auto" />
            <p className="font-bold text-brown">
              {masterScan ? "Running master scan…" : "Running simple scan…"}
            </p>
            <p className="text-sm text-muted">
              {masterScan
                ? "Checking your selected pages and policy options"
                : "Checking the homepage and public policy only"}
            </p>
            <div className="scan-bar">
              <div className="scan-bar-fill" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
