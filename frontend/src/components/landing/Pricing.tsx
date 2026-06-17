import Link from "next/link";
import { Check } from "lucide-react";
import { pricingData } from "@/lib/data";

export default function Pricing() {
  const { tag, headline, tiers } = pricingData;
  const tier = tiers[0];

  return (
    <section id="pricing" className="py-20 md:py-28 scroll-mt-24">
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--neu-accent)" }}
          >
            {tag}
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {headline}
          </h2>
        </div>

        <div
          className="neu-card p-8 md:p-10 flex flex-col"
          style={{ boxShadow: "var(--neu-accent-raised)" }}
        >
          <h3
            className="text-lg font-bold mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            {tier.name}
          </h3>
          <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
            {tier.description}
          </p>

          <div className="mb-6">
            <span
              className="text-4xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {tier.monthlyPrice}
            </span>
            <span className="text-sm ml-1" style={{ color: "var(--text-muted)" }}>
              STX per message
            </span>
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {tier.features.map((feature, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check
                  size={16}
                  style={{
                    color: "var(--neu-accent)",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <Link href="/wall" className="block text-center py-3 text-sm font-bold neu-btn-accent">
            {tier.cta}
          </Link>
        </div>
      </div>
    </section>
  );
}
