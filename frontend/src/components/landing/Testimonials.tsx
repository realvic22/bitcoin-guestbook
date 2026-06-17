import { Quote } from "lucide-react";
import { testimonialsData } from "@/lib/data";

export default function Testimonials() {
  const { tag, headline, items } = testimonialsData;

  return (
    <section id="testimonials" className="py-20 md:py-28">
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

        <div className="grid md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div key={i} className="neu-card p-6 flex flex-col">
              <Quote
                size={28}
                color="var(--neu-accent)"
                className="opacity-40 mb-4"
              />
              <p
                className="text-sm leading-relaxed flex-1 mb-5 italic"
                style={{ color: "var(--text-secondary)" }}
              >
                {item.quote}
              </p>
              <div
                className="flex items-center gap-3 pt-4 border-t"
                style={{ borderColor: "var(--neu-border)" }}
              >
                <div className="neu-icon-circle w-10 h-10">
                  <span
                    className="text-xs font-bold"
                    style={{ color: "var(--neu-accent)" }}
                  >
                    #{item.entryId}
                  </span>
                </div>
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.name}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
