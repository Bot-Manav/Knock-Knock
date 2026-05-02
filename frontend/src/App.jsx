import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Report from "./pages/Report";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
        <header className="bg-slate-800 border-b border-slate-700 py-4 px-6 flex justify-between items-center shadow-md">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Privacy Leak Scanner</h1>
        </header>
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<Report />} />
          </Routes>
        </main>
        <footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} Privacy Leak Scanner (PLS). Knock-Knock.
        </footer>
      </div>
    </Router>
  );
}

export default App;
