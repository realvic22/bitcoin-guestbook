import { Bitcoin, BookOpen, Clock3, HeartHandshake, Link2, MessagesSquare } from "lucide-react";
import { featuresData } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Bitcoin,
  BookOpen,
  Clock3,
  HeartHandshake,
  Link2,
  MessagesSquare,
};

export default function Features() {
  const { tag, headline, items } = featuresData;

  return (
    <section id="features" className="py-20 md:py-28">
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <div
                key={item.title}
                className="neu-card p-6 hover:translate-y-[-3px] transition-transform duration-200"
              >
                <div className="neu-icon-circle w-12 h-12 mb-4">
                  <Icon size={20} color={item.icon === "Bitcoin" ? "var(--gold)" : "var(--teal)"} />
                </div>
                <h3
                  className="text-base font-bold mb-2"
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
