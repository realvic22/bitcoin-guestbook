"use client";

import { useEffect, useMemo, useState } from "react";
import { Archive, Feather, Heart, Hourglass, Landmark, Layers, Moon, Sparkles, Sprout } from "lucide-react";
import { getPageCount, getPage, type PageData } from "@/lib/contracts";
import { useWallet } from "@/components/wallet-provider";

interface PageItem extends PageData { id: number; }

const FALLBACK: PageItem[] = [
  { id: 1, creator: "", name: "Dream Wall", description: "What you hope for.", color: "#6f4fd8", entryCount: 0 },
  { id: 2, creator: "", name: "Thank You Wall", description: "Things you owe that money cannot repay.", color: "#e07b5a", entryCount: 0 },
  { id: 3, creator: "", name: "Memory Wall", description: "Moments you refuse to forget.", color: "#5a8ec9", entryCount: 0 },
  { id: 4, creator: "", name: "Love Notes", description: "For the people you love.", color: "#d46a8c", entryCount: 0 },
  { id: 5, creator: "", name: "Forgiveness Wall", description: "Let it go. Leave it here.", color: "#6bbf8a", entryCount: 0 },
  { id: 6, creator: "", name: "Legacy Wall", description: "What you want to leave behind.", color: "#c9a85a", entryCount: 0 },
  { id: 7, creator: "", name: "Predictions", description: "What you think will happen.", color: "#8ec9c9", entryCount: 0 },
  { id: 8, creator: "", name: "General", description: "Everything else.", color: "#9e9e9e", entryCount: 0 },
];

const icons = [Moon, Sprout, Archive, Heart, Feather, Landmark, Hourglass, Sparkles];

export function PageSelector({ selected, onSelect }: { selected: number | null; onSelect: (id: number | null) => void }) {
  const { address } = useWallet();
  const [pages, setPages] = useState<PageItem[]>(FALLBACK);

  useEffect(() => {
    const sender = address || "SP2X9XZZHGXMCV14WZ6FCNPH6JMR0NMASQGA3GAB1";
    getPageCount(sender).then(async (count) => {
      if (count === 0) { setPages(FALLBACK); return; }
      const items: PageItem[] = [];
      for (let i = 1; i <= count; i++) {
        const p = await getPage(i, sender);
        if (p) items.push({ ...p, id: i });
      }
      if (items.length > 0) setPages(items);
    }).catch(() => setPages(FALLBACK));
  }, [address]);

  const totalEntries = useMemo(() => pages.reduce((sum, p) => sum + p.entryCount, 0), [pages]);

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      <button
        onClick={() => onSelect(null)}
        className="relative overflow-hidden rounded-lg border p-4 text-left transition-all duration-200 hover:-translate-y-0.5"
        style={{
          background: selected === null ? "var(--ink)" : "rgba(255,248,236,0.76)",
          color: selected === null ? "#fff8ec" : "var(--ink)",
          borderColor: selected === null ? "var(--ink)" : "rgba(32,25,35,0.08)",
          boxShadow: selected === null ? "0 18px 34px rgba(32,25,35,0.22)" : "var(--neu-raised-sm)",
        }}
      >
        <div
          className="absolute left-0 top-0 h-full w-1.5"
          style={{ background: selected === null ? "#fff8ec" : "rgba(32,25,35,0.18)" }}
        />
        <div className="mb-3 flex items-center justify-between">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: selected === null ? "rgba(255,248,236,0.18)" : "rgba(32,25,35,0.08)" }}
          >
            <Layers size={17} color={selected === null ? "#fff8ec" : "var(--ink)"} />
          </span>
          {totalEntries > 0 && (
            <span
              className="rounded-full px-2 py-0.5 text-xs font-black"
              style={{ background: selected === null ? "rgba(255,248,236,0.14)" : "rgba(32,25,35,0.06)", color: selected === null ? "#fff8ec" : "var(--text-muted)" }}
            >
              {totalEntries}
            </span>
          )}
        </div>
        <div className="text-sm font-black">All Rooms</div>
        <p
          className="mt-1 line-clamp-2 text-xs font-semibold leading-relaxed opacity-75"
          style={{ color: selected === null ? "rgba(255,248,236,0.7)" : undefined }}
        >
          Browse every message, every tone.
        </p>
      </button>

      {pages.map((p, index) => {
        const Icon = icons[index % icons.length];
        const active = selected === p.id;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            className="relative min-w-0 overflow-hidden rounded-lg border p-4 text-left transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: active ? p.color : "rgba(255,248,236,0.76)",
              color: active ? "#fff8ec" : "var(--ink)",
              borderColor: active ? p.color : `${p.color}33`,
              boxShadow: active ? `0 18px 34px ${p.color}35` : "var(--neu-raised-sm)",
            }}
          >
            <div
              className="absolute left-0 top-0 h-full w-1.5"
              style={{ background: active ? "rgba(255,248,236,0.28)" : p.color }}
            />
            <div className="mb-3 flex items-center justify-between">
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ background: active ? "rgba(255,248,236,0.18)" : `${p.color}18` }}
              >
                <Icon size={17} color={active ? "#fff8ec" : p.color} />
              </span>
              {p.entryCount > 0 && (
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-black"
                  style={{ background: active ? "rgba(255,248,236,0.14)" : `${p.color}14`, color: active ? "#fff8ec" : "var(--text-muted)" }}
                >
                  {p.entryCount}
                </span>
              )}
            </div>
            <div className="text-sm font-black">{p.name}</div>
            <p className="mt-1 line-clamp-2 text-xs font-semibold leading-relaxed opacity-75">{p.description}</p>
          </button>
        );
      })}
    </div>
  );
}
