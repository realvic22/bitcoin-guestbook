"use client";

import { useCallback, useEffect, useState } from "react";
import { Archive, Feather, Heart, Hourglass, Landmark, Layers, Moon, RefreshCw, Sparkles, Sprout } from "lucide-react";
import { getEntryCount, getEntry, getPage } from "@/lib/contracts";
import { EntryCard } from "@/components/guestbook/EntryCard";
import { useWallet } from "./wallet-provider";
import type { EntryFull } from "@/lib/contracts";

interface Entry extends EntryFull { id: number; }

const FALLBACK_SENDER = "SP2X9XZZHGXMCV14WZ6FCNPH6JMR0NMASQGA3GAB1";
const MAX_ENTRIES = 50;

const roomIcons = [Moon, Sprout, Archive, Heart, Feather, Landmark, Hourglass, Sparkles];

function renderRoomIcon(id: number | null, size: number, color: string) {
  const Icon = id === null ? Layers : roomIcons[(id - 1) % roomIcons.length];
  return <Icon size={size} color={color} />;
}

const emptyStateByRoom: Record<string, { heading: string; text: string }> = {
  "Dream Wall": { heading: "No dreams shared yet", text: "Be the first to plant a dream on the chain." },
  "Thank You Wall": { heading: "No gratitude anchored yet", text: "Leave a thank you that cannot be deleted." },
  "Memory Wall": { heading: "No memories sealed yet", text: "Be the first to save a moment here." },
  "Love Notes": { heading: "No love notes written yet", text: "Write one that will still be here decades from now." },
  "Forgiveness Wall": { heading: "Nothing let go yet", text: "Leave it here and let the chain keep the receipt." },
  "Legacy Wall": { heading: "No legacy written yet", text: "Be the first to leave something behind." },
  "Predictions": { heading: "No predictions made", text: "Seal a version of the future and see if it comes true." },
  "General": { heading: "This room is quiet", text: "Be the first to give it a voice." },
};

function emptyStateFor(pageName: string | undefined): { heading: string; text: string } {
  if (pageName && emptyStateByRoom[pageName]) return emptyStateByRoom[pageName];
  return { heading: "This room is quiet", text: "Be the first to give it a voice." };
}

export function GuestbookWall({
  refreshKey = 0,
  pageId,
  onReply,
  onEndorse,
  pageColor: initialColor,
  pageName: initialName,
  pageDescription: initialDescription,
}: {
  refreshKey?: number;
  pageId?: number | null;
  onReply?: (id: number) => void;
  onEndorse?: (id: number) => void;
  pageColor?: string;
  pageName?: string;
  pageDescription?: string;
}) {
  const { address } = useWallet();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageColor, setPageColor] = useState<string | undefined>(initialColor);
  const [pageName, setPageName] = useState<string | undefined>(initialName);
  const [pageDescription, setPageDescription] = useState<string | undefined>(initialDescription);

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const sender = address || FALLBACK_SENDER;

      if (pageId) {
        const p = await getPage(pageId, sender);
        if (p) {
          setPageColor(p.color);
          setPageName(p.name);
          setPageDescription(p.description);
        }
      } else {
        setPageColor(undefined);
        setPageName(undefined);
        setPageDescription(undefined);
      }

      const count = await getEntryCount(sender);

      if (count === 0) { setEntries([]); return; }

      const ids: number[] = [];
      for (let i = count; i >= Math.max(1, count - MAX_ENTRIES + 1); i--) ids.push(i);

      const results = await Promise.all(
        ids.map(async (id) => {
          const entry = await getEntry(id, sender);
          if (!entry) return null;
          if (pageId && entry.pageId !== pageId) return null;
          return { ...entry, id } as Entry;
        })
      );

      setEntries(results.filter((e): e is Entry => e !== null));
    } catch (err) {
      setError("Failed to load entries.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [address, pageId]);

  useEffect(() => {
    void Promise.resolve().then(loadEntries);
  }, [loadEntries, refreshKey]);

  const handleRefresh = useCallback(() => { loadEntries(); }, [loadEntries]);

  const empty = emptyStateFor(pageName);

  return (
    <div className="min-w-0">
      <div
        className="relative mb-6 overflow-hidden rounded-lg border transition-colors duration-300"
        style={{ borderColor: pageColor ? `${pageColor}55` : "rgba(32,25,35,0.08)" }}
      >
        <div
          className="h-1.5 transition-colors duration-300"
          style={{ background: pageColor || "var(--text-muted)" }}
        />
        <div className="p-4 sm:p-5" style={{ background: "rgba(255,248,236,0.58)" }}>
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-300"
                  style={{ background: pageColor ? `${pageColor}18` : "rgba(32,25,35,0.06)" }}
                >
                  {renderRoomIcon(pageId ?? null, 15, pageColor || "var(--text-secondary)")}
                </div>
                <h3 className="text-xl font-black leading-tight" style={{ color: "var(--ink)", letterSpacing: 0 }}>
                  {pageName || "All Rooms"}
                </h3>
              </div>
              <p className="text-xs font-semibold leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {pageName
                  ? pageDescription || "Filtered to one emotional room."
                  : "Latest messages across every room."}
              </p>
              {entries.length > 0 && (
                <span
                  className="mt-2.5 inline-block rounded-full px-2.5 py-1 text-xs font-black transition-colors duration-300"
                  style={{
                    background: pageColor ? `${pageColor}14` : "rgba(32,25,35,0.06)",
                    color: pageColor || "var(--text-muted)",
                  }}
                >
                  {entries.length} {entries.length === 1 ? "entry" : "entries"}
                </span>
              )}
            </div>
            <button onClick={handleRefresh} disabled={loading} className="neu-icon-circle w-9 h-9 shrink-0 mt-0.5 disabled:opacity-50" aria-label="Refresh">
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} style={{ color: "var(--text-secondary)" }} />
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <p className="text-sm animate-pulse" style={{ color: "var(--text-muted)" }}>Loading...</p>
        </div>
      )}

      {!loading && error && (
        <div className="neu-card-inset p-8 text-center">
          <p className="text-sm text-red-500 mb-4">{error}</p>
          <button onClick={loadEntries} className="text-sm font-semibold underline" style={{ color: "var(--text-secondary)" }}>Retry</button>
        </div>
      )}

      {!loading && !error && entries.length === 0 && (
        <div
          className="relative overflow-hidden rounded-lg border p-12 text-center transition-colors duration-300"
          style={{ borderColor: pageColor ? `${pageColor}33` : "rgba(32,25,35,0.08)" }}
        >
          <div className="absolute top-0 left-0 right-0 h-1.5 transition-colors duration-300" style={{ background: pageColor || "var(--text-muted)" }} />
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-300" style={{ background: pageColor ? `${pageColor}18` : "rgba(32,25,35,0.06)" }}>
            {renderRoomIcon(pageId ?? null, 22, pageColor || "var(--text-muted)")}
          </div>
          <p className="text-xl font-black mb-2" style={{ color: "var(--ink)" }}>{empty.heading}</p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {pageId ? empty.text : "Connect your wallet and write the first permanent message."}
          </p>
        </div>
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="space-y-4">
          {entries.map((entry, index) => (
            <div key={entry.id} className="animate-entry-in" style={{ animationDelay: `${index * 0.05}s` }}>
              <EntryCard
                entry={entry}
                pageColor={pageColor}
                pageName={pageName}
                onReply={onReply}
                onEndorse={onEndorse}
                onRefresh={handleRefresh}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
