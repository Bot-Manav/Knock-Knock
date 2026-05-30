import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { Shield, Sparkles } from "lucide-react";
import Home from "./pages/Home";
import Report from "./pages/Report";

function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#070b14]/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/30 rounded-xl blur-md group-hover:blur-lg transition-all" />
            <div className="relative bg-gradient-to-br from-indigo-500/20 to-violet-500/20 p-2.5 rounded-xl border border-indigo-500/30">
              <Shield className="w-5 h-5 text-indigo-300" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text leading-tight">Knock-Knock</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-medium">Privacy Leak Scanner</p>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          {!isHome && (
            <Link
              to="/"
              className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
            >
              New Scan
            </Link>
          )}
          <span className="hidden sm:inline-flex items-center gap-1.5 section-pill">
            <Sparkles className="w-3 h-3" />
            Beta
          </span>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/5 py-6 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} Knock-Knock · Privacy Leak Scanner</p>
        <p className="text-xs text-slate-600">Detect trackers · Analyze policies · Protect privacy</p>
      </div>
    </footer>
  );
}

function AppLayout() {
  return (
    <div className="app-shell flex flex-col min-h-screen">
      <div className="orb orb-violet" aria-hidden="true" />
      <div className="orb orb-cyan" aria-hidden="true" />
      <div className="orb orb-indigo" aria-hidden="true" />

      <Header />

      <main className="flex-grow flex flex-col relative z-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;
