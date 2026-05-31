import { Scale, Shield, FileCheck, Lightbulb, Heart } from "lucide-react";

const ICONS = {
  ethics: Heart,
  policy: FileCheck,
  alignment: Scale,
  transparency: Shield,
  scope: FileCheck,
  next_steps: Lightbulb,
};

export default function ComplianceInsights({ insights }) {
  if (!insights?.length) return null;

  return (
    <div className="palette-card p-6 md:p-8 bg-orange">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-terracotta border-2 border-brown">
          <Scale className="w-5 h-5 text-cream" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-brown">Transparency & Compliance Guidance</h3>
          <p className="text-sm text-muted">Ethical insights to align policy with practice</p>
        </div>
      </div>

      <ul className="space-y-4">
        {insights.map((item, idx) => {
          const Icon = ICONS[item.type] || Lightbulb;
          return (
            <li key={idx} className="palette-card-soft p-4 flex gap-4 bg-cream">
              <div className="shrink-0 p-2 h-fit rounded-lg bg-orange border-2 border-terracotta">
                <Icon className="w-4 h-4 text-brown" />
              </div>
              <div>
                <h4 className="font-bold text-brown text-sm mb-1">{item.title}</h4>
                <p className="text-sm text-body leading-relaxed">{item.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
