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
  Radar,
  FileSearch,
  Lock,
  Zap,
} from "lucide-react";

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
  { value: "", label: "Why are you scanning? (optional)" },
  { value: "personal", label: "Personal curiosity" },
  { value: "business", label: "Business audit" },
  { value: "compliance", label: "Compliance review" },
  { value: "research", label: "Research / academic" },
  { value: "vendor", label: "Vendor due diligence" },
];

const FEATURES = [
  { icon: Radar, label: "Tracker detection" },
  { icon: FileSearch, label: "Policy analysis" },
  { icon: Lock, label: "Leak scanning" },
  { icon: Zap, label: "Instant report" },
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
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url) return;

    let formattedUrl = url;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const extraPages = additionalPages
      .split(/[\n,]+/)
      .map((p) => p.trim())
      .filter(Boolean);

    const websiteDetails = {
      ...(websiteName.trim() && { name: websiteName.trim() }),
      ...(category && { category }),
      ...(scanPurpose && { scan_purpose: scanPurpose }),
      ...(notes.trim() && { notes: notes.trim() }),
      ...(extraPages.length > 0 && { additional_pages: extraPages }),
      scan_depth: scanDepth,
    };

    setIsScanning(true);
    setError(null);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
      const response = await fetch(`${baseUrl}/api/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: formattedUrl,
          policy_url: policyUrl.trim() || undefined,
          policy_text: policyText.trim() || undefined,
          website_details: websiteDetails,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to scan the website. Status: ${response.status}`);
      }

      const reportData = await response.json();
      navigate("/report", { state: { report: reportData, targetUrl: formattedUrl } });
    } catch (err) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during the scan.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center px-6 py-12 md:py-16">
      <div className="max-w-3xl w-full space-y-10">

        {/* Hero */}
        <div className="text-center space-y-6 animate-fade-up">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/25 rounded-2xl blur-2xl scale-150" />
              <div className="relative bg-gradient-to-br from-indigo-500/20 via-violet-500/15 to-cyan-500/10 p-5 rounded-2xl border border-indigo-400/25 shadow-[0_0_40px_rgba(99,102,241,0.15)]">
                <ShieldCheck className="w-14 h-14 text-indigo-300" strokeWidth={1.5} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <span className="section-pill">Privacy Intelligence Platform</span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
              <span className="text-white">Uncover Hidden</span>
              <br />
              <span className="gradient-text-warm">Privacy Risks</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed">
              Scan any website for third-party trackers, data leaks, and gaps between what they claim and what they actually do.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {FEATURES.map(({ icon: Icon, label }) => (
              <span key={label} className="feature-chip">
                <Icon className="w-3.5 h-3.5 text-cyan-400" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleScan}
          className="max-w-2xl mx-auto space-y-5 animate-fade-up animate-fade-up-delay-1"
        >
          {/* URL bar */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 rounded-2xl opacity-20 group-hover:opacity-35 blur-sm transition duration-500" />
            <div className="relative glass-card flex flex-col sm:flex-row items-stretch sm:items-center overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500/40">
              <div className="flex items-center flex-1 min-w-0">
                <div className="pl-5 pr-3 py-4 shrink-0">
                  <Search className="text-slate-500 w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Enter website URL — e.g. example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isScanning}
                  className="w-full bg-transparent text-slate-100 placeholder-slate-500 py-4 text-base md:text-lg outline-none disabled:opacity-50 font-mono"
                  required
                />
              </div>
              <div className="p-2 sm:pr-3 sm:pl-0">
                <button
                  type="submit"
                  disabled={isScanning || !url}
                  className="btn-primary w-full sm:w-auto py-3.5 px-8 rounded-xl flex items-center justify-center gap-2 text-sm md:text-base"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Scanning…
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      Analyze
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Website details */}
          <div className="glass-card p-6 space-y-5">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                <Globe className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-white">Website Details</h2>
                <p className="text-xs text-slate-500">Optional — included in your final report</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">
                  Website Name
                </label>
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
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">
                  Category
                </label>
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
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">
                Scan Purpose
              </label>
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
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">
                Additional Pages
              </label>
              <input
                type="text"
                placeholder="/checkout, /login, /account"
                value={additionalPages}
                onChange={(e) => setAdditionalPages(e.target.value)}
                disabled={isScanning}
                className="input-field font-mono text-sm"
              />
              <p className="text-xs text-slate-500 mt-1.5 flex items-center gap-1.5">
                <Info className="w-3 h-3 shrink-0 text-cyan-500" />
                Comma-separated paths where users enter sensitive data
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-2">
                Scan Depth
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "standard", label: "Standard", desc: "~15s / page" },
                  { value: "thorough", label: "Thorough", desc: "~25s / page" },
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
                    <div className="p-4 rounded-xl border border-white/5 bg-black/20 peer-checked:border-indigo-500/50 peer-checked:bg-indigo-500/10 transition-all hover:border-white/10">
                      <p className="text-sm font-semibold text-white">{opt.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">
                Notes
              </label>
              <textarea
                placeholder="Context about this website or what you're looking for…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isScanning}
                rows={3}
                className="input-field resize-y"
              />
            </div>
          </div>

          {/* Policy options toggle */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-300 transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
            >
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showAdvanced ? "Hide Policy Options" : "Show Policy Options"}
            </button>
          </div>

          {showAdvanced && (
            <div className="glass-card p-6 space-y-4 animate-fade-up">
              <p className="text-sm text-slate-400">
                Override auto-discovery with a specific policy URL or pasted text.
              </p>
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">
                  Custom Policy URL
                </label>
                <input
                  type="text"
                  placeholder="https://example.com/legal/privacy"
                  value={policyUrl}
                  onChange={(e) => setPolicyUrl(e.target.value)}
                  disabled={isScanning}
                  className="input-field font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 uppercase tracking-wide mb-1.5">
                  Or Paste Policy Text
                </label>
                <textarea
                  placeholder="Paste the raw privacy policy text here…"
                  value={policyText}
                  onChange={(e) => setPolicyText(e.target.value)}
                  disabled={isScanning}
                  rows={4}
                  className="input-field resize-y text-sm"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="flex gap-3 text-red-300 text-sm bg-red-950/30 p-4 rounded-xl border border-red-500/20">
              <ShieldCheck className="w-5 h-5 shrink-0 text-red-400" />
              {error}
            </div>
          )}
        </form>

        {/* Scanning state */}
        {isScanning && (
          <div className="max-w-md mx-auto space-y-4 animate-fade-up">
            <div className="glass-card p-6 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/15 border border-indigo-500/25">
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
              </div>
              <div>
                <p className="text-white font-medium">Running privacy scan…</p>
                <p className="text-sm text-slate-500 mt-1">
                  Capturing traffic{additionalPages.trim() ? " across multiple pages" : ""} &amp; analyzing policy
                </p>
              </div>
              <div className="scan-bar">
                <div className="scan-bar-fill" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
