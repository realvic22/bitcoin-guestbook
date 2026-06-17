import { Bitcoin, Layers, Lock, Network, Infinity, Code } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string }>> = {
  Bitcoin,
  Layers,
  Lock,
  Network,
  Infinity,
  Code,
};

const entries = [
  { name: "Bitcoin", icon: "Bitcoin" },
  { name: "Stacks", icon: "Layers" },
  { name: "Immutable", icon: "Lock" },
  { name: "Decentralized", icon: "Network" },
  { name: "Permanent", icon: "Infinity" },
  { name: "Open Source", icon: "Code" },
] as const;

export default function LogoBar() {
  return (
    <section className="py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <p
          className="text-center text-xs font-semibold uppercase tracking-widest mb-8"
          style={{ color: "var(--text-muted)" }}
        >
          Powered by
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
          {entries.map((entry) => {
            const Icon = iconMap[entry.icon];
            return (
              <div key={entry.name} className="flex flex-col items-center gap-2">
                <div className="neu-icon-circle w-14 h-14">
                  <Icon size={22} color="var(--text-secondary)" />
                </div>
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--text-muted)" }}
                >
                  {entry.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
