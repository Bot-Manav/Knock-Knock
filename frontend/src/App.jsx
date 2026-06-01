import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { Shield, Scale } from "lucide-react";
import Home from "./pages/Home";
import Report from "./pages/Report";

function Header() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 border-b-2 border-brown bg-cream">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange border-2 border-brown">
            <Shield className="w-5 h-5 text-brown" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-brown leading-tight">Knock-Knock</h1>
            <p className="text-[10px] uppercase tracking-widest text-brown opacity-70 font-semibold">
              Policy Transparency Checker
            </p>
          </div>
        </Link>

        <nav className="flex items-center gap-3">
          {!isHome && (
            <Link
              to="/"
              className="text-sm font-semibold text-brown px-3 py-1.5 rounded-lg border-2 border-brown bg-orange hover:bg-terracotta hover:text-cream transition-colors"
            >
              New Check
            </Link>
          )}
          <span className="hidden sm:inline-flex items-center gap-1.5 section-pill">
            <Scale className="w-3 h-3" />
            Ethical
          </span>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t-2 border-brown py-6 px-6 bg-brown">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-cream font-medium">
        <p>&copy; {new Date().getFullYear()} Knock-Knock by team Falcons</p>
        <p className="text-xs opacity-80 text-center">
          Compare privacy policies with public site behavior — responsibly & transparently
        </p>
      </div>
    </footer>
  );
}

function AppLayout() {
  return (
    <div className="app-shell flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex flex-col">
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
