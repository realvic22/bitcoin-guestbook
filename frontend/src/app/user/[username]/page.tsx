"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getPrincipal, getUsername, getUserEntryCount, getUserEntryAt, getEntry, getPage, type EntryFull, type PageData } from "@/lib/contracts";

const SENDER = "SP2X9XZZHGXMCV14WZ6FCNPH6JMR0NMASQGA3GAB1";

export default function UserProfile() {
  const params = useParams();
  const username = (params?.username as string || "").toLowerCase();

  const [principal, setPrincipal] = useState<string | null>(null);
  const [entryIds, setEntryIds] = useState<number[]>([]);
  const [entries, setEntries] = useState<(EntryFull & { id: number; pageName?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    (async () => {
      const p = await getPrincipal(username, SENDER);
      if (!p) { setError("No user found with that username."); setLoading(false); return; }
      setPrincipal(p);

      const count = await getUserEntryCount(p, SENDER);
      const ids: number[] = [];
      for (let i = count; i >= 1; i--) {
        const entryId = await getUserEntryAt(p, i, SENDER);
        if (entryId !== null) ids.push(entryId);
      }
      setEntryIds(ids);

      const entryList: (EntryFull & { id: number; pageName?: string })[] = [];
      for (const id of ids.slice(0, 20)) {
        const e = await getEntry(id, SENDER);
        if (!e) continue;
        let pageName: string | undefined;
        if (e.pageId) {
          const page = await getPage(e.pageId, SENDER);
          if (page) pageName = page.name;
        }
        entryList.push({ ...e, id, pageName });
      }
      setEntries(entryList);
      setLoading(false);
    })().catch((e) => { setError("Failed to load profile."); setLoading(false); console.error(e); });
  }, [username]);

  function truncate(addr: string) { return `${addr.slice(0, 8)}...${addr.slice(-6)}`; }

  return (
    <div className="min-h-screen neu-bg">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <Link href="/" className="flex items-center gap-2 text-sm mb-8" style={{ color: "var(--neu-accent)" }}>
          <ArrowLeft size={16} /> Back to Guestbook
        </Link>

        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 size={24} className="animate-spin" style={{ color: "var(--neu-accent)" }} />
          </div>
        )}

        {error && (
          <div className="neu-card p-8 text-center">
            <p className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>{error}</p>
            <Link href="/" className="text-sm underline" style={{ color: "var(--neu-accent)" }}>Go home</Link>
          </div>
        )}

        {!loading && !error && principal && (
          <>
            <div className="neu-card p-6 mb-8 text-center">
              <div className="neu-icon-circle w-16 h-16 mx-auto mb-3">
                <span className="text-2xl font-bold" style={{ color: "var(--neu-accent)" }}>@{username[0]?.toUpperCase()}</span>
              </div>
              <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>@{username}</h1>
              <p className="text-xs font-mono mb-3" style={{ color: "var(--text-muted)" }}>{principal}</p>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {entryIds.length} {entryIds.length === 1 ? "entry" : "entries"} across all walls
              </p>
            </div>

            {entries.length === 0 ? (
              <div className="neu-card-inset p-12 text-center">
                <p className="text-lg font-bold mb-2" style={{ color: "var(--text-primary)" }}>No entries yet</p>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>This user hasn&apos;t written anything yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <article key={entry.id} className="neu-card p-5">
                    {entry.pageName && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-3" style={{ background: "var(--neu-accent)20", color: "var(--neu-accent)" }}>
                        {entry.pageName}
                      </span>
                    )}
                    <p className="text-base leading-relaxed mb-3" style={{ color: "var(--text-primary)" }}>
                      {entry.message}
                    </p>
                    <div className="flex justify-between items-center text-xs" style={{ color: "var(--text-muted)" }}>
                      <span>Entry #{entry.id}</span>
                      <span>Block #{entry.block}</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
