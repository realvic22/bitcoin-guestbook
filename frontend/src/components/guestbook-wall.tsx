"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { getEntryCount, getEntry, getPage } from "@/lib/contracts";
import { EntryCard } from "@/components/guestbook/EntryCard";
import { useWallet } from "./wallet-provider";
import type { EntryFull } from "@/lib/contracts";

interface Entry extends EntryFull { id: number; }

const FALLBACK_SENDER = "SP2X9XZZHGXMCV14WZ6FCNPH6JMR0NMASQGA3GAB1";
const MAX_ENTRIES = 50;

export function GuestbookWall({
  refreshKey = 0,
  pageId,
  onReply,
  onEndorse,
}: {
  refreshKey?: number;
  pageId?: number | null;
  onReply?: (id: number) => void;
  onEndorse?: (id: number) => void;
}) {
  const { address } = useWallet();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageColor, setPageColor] = useState<string | undefined>();
  const [pageName, setPageName] = useState<string | undefined>();

  const loadEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const sender = address || FALLBACK_SENDER;

      if (pageId) {
        const p = await getPage(pageId, sender);
        if (p) { setPageColor(p.color); setPageName(p.name); }
      } else {
        setPageColor(undefined);
        setPageName(undefined);
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

  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between mb-6 rounded-lg border bg-[rgba(255,248,236,0.58)] p-4" style={{ borderColor: pageColor ? `${pageColor}33` : "rgba(32,25,35,0.08)" }}>
        <div>
          <h3 className="text-lg font-black" style={{ color: "var(--ink)", letterSpacing: 0 }}>
            {pageName ? pageName : "All Rooms"}
          </h3>
          <p className="mt-1 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
            {pageName ? "Filtered to one emotional room." : "Latest messages across every room."}
          </p>
        </div>
        <button onClick={handleRefresh} disabled={loading} className="neu-icon-circle w-9 h-9 disabled:opacity-50" aria-label="Refresh">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} style={{ color: "var(--text-secondary)" }} />
        </button>
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
        <div className="rounded-lg border bg-[rgba(255,248,236,0.58)] p-12 text-center" style={{ borderColor: "rgba(32,25,35,0.08)" }}>
          <p className="text-xl font-black mb-2" style={{ color: "var(--ink)" }}>This room is quiet</p>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {pageId ? "Be the first to give it a voice." : "Connect your wallet and write the first permanent message."}
          </p>
        </div>
      )}

      {!loading && !error && entries.length > 0 && (
        <div className="space-y-4">
          {entries.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              pageColor={pageColor}
              pageName={pageName}
              onReply={onReply}
              onEndorse={onEndorse}
              onRefresh={handleRefresh}
            />
          ))}
        </div>
      )}
    </div>
  );
}
