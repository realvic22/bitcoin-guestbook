import { Trash2, Database, Clock } from "lucide-react";
import { problemData } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Trash2,
  Database,
  Clock,
};

export default function Problem() {
  const { tag, headline, items } = problemData;

  return (
    <section className="py-20 md:py-28">
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

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <div key={item.title} className="neu-card p-8 text-center group">
                <div className="neu-icon-circle w-16 h-16 mx-auto mb-5 group-hover:shadow-[var(--neu-inset-sm)] transition-all duration-300">
                  <Icon size={26} color="var(--neu-accent)" />
                </div>
                <h3
                  className="text-lg font-bold mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
