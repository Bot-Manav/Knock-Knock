import { User, Globe, ArrowRight, Building2 } from "lucide-react";

export default function DataFlowView({ dataFlow, isSimple = false }) {
  if (!dataFlow) return null;

  const { your_site, third_party_groups, total_connections, description, summary_only } =
    dataFlow;

  return (
    <div className="palette-card p-6 md:p-8 bg-orange">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 rounded-lg bg-terracotta border-2 border-brown">
          <Globe className="w-5 h-5 text-cream" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-brown">
            {isSimple || summary_only ? "Data flow summary" : "Data Flow Overview"}
          </h3>
          <p className="text-sm text-muted">{description}</p>
        </div>
      </div>

      {/* Simple ethical flow diagram */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 my-6 py-4 px-2 bg-cream rounded-xl border-2 border-terracotta">
        <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-lg bg-orange border-2 border-brown min-w-[100px]">
          <User className="w-6 h-6 text-brown" />
          <span className="text-xs font-bold text-brown">Visitor</span>
        </div>
        <ArrowRight className="w-5 h-5 text-brown shrink-0" />
        <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-lg bg-terracotta border-2 border-brown min-w-[120px]">
          <Globe className="w-6 h-6 text-cream" />
          <span className="text-xs font-bold text-cream text-center break-all max-w-[140px]">
            {your_site}
          </span>
        </div>
        {total_connections > 0 && (
          <>
            <ArrowRight className="w-5 h-5 text-brown shrink-0" />
            <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-lg bg-orange border-2 border-brown min-w-[100px]">
              <Building2 className="w-6 h-6 text-brown" />
              <span className="text-xs font-bold text-brown">
                {total_connections} partner{total_connections !== 1 ? "s" : ""}
              </span>
            </div>
          </>
        )}
      </div>

      {third_party_groups?.length > 0 ? (
        <div className="space-y-3">
          {third_party_groups.map((group, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-cream border-2 border-brown"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-brown text-sm">{group.category}</span>
                <span className="section-pill text-[10px] py-0.5">{group.count}</span>
              </div>
              <ul className="flex flex-wrap gap-2">
                {!summary_only &&
                  group.partners?.map((p, i) => (
                    <li
                      key={i}
                      className="text-xs font-mono px-2 py-1 rounded-lg bg-orange border border-terracotta text-brown"
                      title={p.company}
                    >
                      {p.domain}
                    </li>
                  ))}
                {(summary_only || !group.partners?.length) && (
                  <li className="text-xs text-brown font-medium">
                    {group.count} connection(s) in this category
                    {isSimple ? " — names hidden in Simple scan" : ""}
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-brown p-4 bg-cream rounded-xl border-2 border-terracotta font-medium text-center">
          No third-party data flows detected on the pages you checked.
        </p>
      )}
    </div>
  );
}
