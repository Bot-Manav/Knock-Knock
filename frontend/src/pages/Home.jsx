import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Search, Loader2, ChevronDown, ChevronUp } from "lucide-react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [policyUrl, setPolicyUrl] = useState("");
  const [policyText, setPolicyText] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleScan = async (e) => {
    e.preventDefault();
    if (!url) return;
    
    // basic url formatting
    let formattedUrl = url;
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

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
          policy_text: policyText.trim() || undefined
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
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-900">
      <div className="max-w-3xl w-full text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-indigo-500/20 p-4 rounded-full border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <ShieldCheck className="w-16 h-16 text-indigo-400" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Uncover Hidden Privacy Risks
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Our advanced Privacy Leak Scanner analyzes network traffic, detects third-party trackers, and cross-references actual behavior with the website's privacy policy.
          </p>
        </div>

        <form onSubmit={handleScan} className="relative max-w-2xl mx-auto mt-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
            <div className="relative flex items-center bg-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
              <div className="pl-6 pr-2 py-4">
                <Search className="text-slate-400 w-6 h-6" />
              </div>
              <input
                type="text"
                placeholder="Enter website URL (e.g., target.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isScanning}
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 py-5 text-lg outline-none disabled:opacity-50"
              />
              <div className="pr-2 py-2 pl-2">
                <button
                  type="submit"
                  disabled={isScanning || !url}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isScanning ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Scanning...
                    </>
                  ) : (
                    "Analyze"
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors"
            >
              {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
            </button>
          </div>

          {showAdvanced && (
            <div className="mt-4 p-5 bg-slate-800/50 border border-slate-700/50 rounded-xl space-y-4 text-left">
              <p className="text-sm text-slate-400 mb-2">
                Provide a specific privacy policy URL or paste the raw text to bypass auto-discovery.
              </p>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Custom Policy URL</label>
                <input
                  type="text"
                  placeholder="https://example.com/legal/privacy"
                  value={policyUrl}
                  onChange={(e) => setPolicyUrl(e.target.value)}
                  disabled={isScanning}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Or Paste Policy Text</label>
                <textarea
                  placeholder="Paste the raw privacy policy text here..."
                  value={policyText}
                  onChange={(e) => setPolicyText(e.target.value)}
                  disabled={isScanning}
                  rows={4}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors resize-y"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 text-red-400 text-sm font-medium bg-red-950/40 p-3 rounded-lg border border-red-900/50">
              {error}
            </div>
          )}
        </form>

        {isScanning && (
          <div className="mt-12 space-y-3 animate-pulse">
            <p className="text-indigo-400 font-medium">Capturing network traffic & scraping privacy policy...</p>
            <div className="h-1 w-48 bg-slate-800 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-indigo-500 animate-[pulse_1s_ease-in-out_infinite] w-full origin-left scale-x-0"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
