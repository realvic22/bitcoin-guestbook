import { Wallet, Pencil, ShieldCheck, Blocks } from "lucide-react";
import { howItWorksData } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Wallet,
  Pencil,
  ShieldCheck,
  Blocks,
};

export default function HowItWorks() {
  const { tag, headline, steps } = howItWorksData;

  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
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

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = iconMap[step.icon];
            return (
              <div key={i} className="neu-card p-6 text-center relative">
                <div className="neu-icon-circle-inset w-10 h-10 mx-auto mb-4">
                  <span
                    className="text-sm font-bold"
                    style={{ color: "var(--neu-accent)" }}
                  >
                    {step.step}
                  </span>
                </div>
                <div className="neu-icon-circle w-14 h-14 mx-auto mb-4">
                  <Icon size={22} color="var(--text-secondary)" />
                </div>
                <h3
                  className="text-sm font-bold mb-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
