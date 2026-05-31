import {
  Shield,
  GitBranch,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Droplets,
  Lock,
  BarChart3,
  Eye,
} from "lucide-react";

const ICONS = {
  shield: Shield,
  flow: GitBranch,
  alert: AlertTriangle,
  check: CheckCircle2,
  document: FileText,
  leak: Droplets,
  lock: Lock,
  score: BarChart3,
  transparency: Eye,
};

export default function PlainLanguageInsights({ insights }) {
  if (!insights?.length) return null;

  return (
    <div className="palette-card p-6 md:p-8 bg-cream">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-orange border-2 border-brown">
          <Eye className="w-5 h-5 text-brown" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-brown">In Plain Language</h3>
          <p className="text-sm text-muted">Technical results explained for everyone</p>
        </div>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((item, idx) => {
          const Icon = ICONS[item.icon] || Eye;
          return (
            <li key={idx} className="palette-card-soft p-4 bg-orange">
              <div className="flex gap-3">
                <div className="shrink-0 p-2 h-fit rounded-lg bg-terracotta border-2 border-brown">
                  <Icon className="w-4 h-4 text-cream" />
                </div>
                <div>
                  <h4 className="font-bold text-brown text-sm mb-1">{item.title}</h4>
                  <p className="text-sm text-body leading-relaxed">{item.text}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
