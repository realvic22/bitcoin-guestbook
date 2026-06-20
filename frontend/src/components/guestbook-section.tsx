"use client";

import { useCallback, useEffect, useState } from "react";
import { WriteForm } from "@/components/guestbook/WriteForm";
import { GuestbookWall } from "@/components/guestbook-wall";
import { PageSelector } from "@/components/guestbook/PageSelector";
import { getPage, type PageData } from "@/lib/contracts";
import { useWallet } from "@/components/wallet-provider";

type PageMeta = (PageData & { id: number }) | null;

export function GuestbookSection({
  appMode = false,
  onRoomChange,
}: {
  appMode?: boolean;
  onRoomChange?: (meta: PageMeta) => void;
}) {
  const { address } = useWallet();
  const [selectedPage, setSelectedPage] = useState<number | null>(null);
  const [selectedPageMeta, setSelectedPageMeta] = useState<PageMeta>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [replyTo, setReplyTo] = useState<{ id: number; preview: string } | null>(null);

  useEffect(() => {
    if (!selectedPage) { setSelectedPageMeta(null); return; }
    const sender = address || "SP2X9XZZHGXMCV14WZ6FCNPH6JMR0NMASQGA3GAB1";
    let cancelled = false;
    getPage(selectedPage, sender).then((p) => {
      if (!cancelled && p) setSelectedPageMeta({ ...p, id: selectedPage });
    });
    return () => { cancelled = true; };
  }, [selectedPage, address]);

  useEffect(() => {
    onRoomChange?.(selectedPageMeta);
  }, [selectedPageMeta, onRoomChange]);

  const handleEntryWritten = useCallback(() => {
    setTimeout(() => setRefreshKey((k) => k + 1), 4000);
  }, []);

  const handleReply = useCallback((entryId: number) => {
    setReplyTo({ id: entryId, preview: "Loading..." });
    import("@/lib/contracts").then(({ getEntry }) => {
      const sender = "SP2X9XZZHGXMCV14WZ6FCNPH6JMR0NMASQGA3GAB1";
      getEntry(entryId, sender).then((entry) => {
        if (entry) setReplyTo({ id: entryId, preview: entry.message });
      });
    });
    document.getElementById("write-form")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleEndorse = useCallback((entryId: number) => {
    setReplyTo({ id: entryId, preview: "Endorsing" });
    document.getElementById("write-form")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <section id="wall" className={appMode ? "pb-20 pt-6 md:pb-24" : "py-20 md:py-28 scroll-mt-24"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className={appMode ? "mb-6 rounded-lg border bg-[rgba(255,248,236,0.58)] p-4 sm:p-5" : "mb-8 max-w-3xl"}>
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--rose)" }}>
            Rooms on the ledger
          </span>
          {!appMode && (
            <>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mt-3 leading-tight" style={{ color: "var(--ink)", letterSpacing: 0 }}>
                Choose the room that matches the feeling.
              </h2>
              <p className="text-base max-w-2xl mt-4 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                A prediction does not belong beside an apology. A memorial should not feel like a status update. Pick a room, write once, and let the chain keep the receipt.
              </p>
            </>
          )}
          {appMode && (
            <p className="mt-1 text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
              Start by choosing a room. The composer and message list below will follow that room.
            </p>
          )}
        </div>

        <div className="mb-6 overflow-x-auto pb-2">
          <PageSelector selected={selectedPage} onSelect={setSelectedPage} />
        </div>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div id="write-form">
            <WriteForm
              key={selectedPage ?? "all"}
              onEntryWritten={handleEntryWritten}
              defaultPageId={selectedPage}
              replyTo={replyTo}
            />
          </div>
          <GuestbookWall
            refreshKey={refreshKey}
            pageId={selectedPage}
            onReply={handleReply}
            onEndorse={handleEndorse}
            pageColor={selectedPageMeta?.color}
            pageName={selectedPageMeta?.name}
            pageDescription={selectedPageMeta?.description}
          />
        </div>
      </div>
    </section>
  );
}
