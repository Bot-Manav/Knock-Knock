import { Link } from "react-router-dom";
import { ArrowUpCircle } from "lucide-react";

export default function UpgradeBanner({ message, isSimple }) {
  if (!isSimple || !message) return null;

  return (
    <div className="palette-card p-5 bg-cream border-2 border-brown flex gap-4 items-start">
      <ArrowUpCircle className="w-6 h-6 text-brown shrink-0 mt-0.5" />
      <div>
        <p className="font-bold text-brown text-sm mb-1">Want more detail?</p>
        <p className="text-sm text-body leading-relaxed">{message}</p>
        <Link
          to="/"
          className="inline-block mt-3 text-sm font-bold text-brown underline hover:opacity-80"
        >
          Back to home → Enable Master scan
        </Link>
      </div>
    </div>
  );
}
