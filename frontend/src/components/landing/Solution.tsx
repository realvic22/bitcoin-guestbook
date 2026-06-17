import { CheckCircle2 } from "lucide-react";
import { solutionData } from "@/lib/data";

export default function Solution() {
  const { tag, headline, description, highlights } = solutionData;

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="neu-card p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--neu-accent)" }}
              >
                {tag}
              </span>
              <h2
                className="text-3xl sm:text-4xl font-bold mt-3 mb-6 leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {headline}
              </h2>
              <p
                className="text-sm leading-relaxed mb-8"
                style={{ color: "var(--text-secondary)" }}
              >
                {description}
              </p>
            </div>
            <div className="neu-card-inset p-6 space-y-4">
              {highlights.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: "var(--neu-bg)" }}
                >
                  <CheckCircle2
                    size={18}
                    style={{ color: "var(--neu-accent)", flexShrink: 0, marginTop: 1 }}
                  />
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
