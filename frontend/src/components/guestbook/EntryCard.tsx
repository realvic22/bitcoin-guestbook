"use client";

import { useEffect, useState } from "react";
import { Bitcoin, ExternalLink, MessageCircle, Heart, Clock, Reply, Link2, LockKeyhole } from "lucide-react";
import { ReactionBar } from "./ReactionBar";
import type { EntryFull } from "@/lib/contracts";
import { getUsername } from "@/lib/contracts";
import { CONTRACT_ADDRESS, CONTRACT_NAME } from "@/lib/stacks";
import { useWallet } from "@/components/wallet-provider";

interface EntryCardProps {
  entry: EntryFull & { id: number };
  pageColor?: string;
  pageName?: string;
  onReply?: (entryId: number) => void;
  onEndorse?: (entryId: number) => void;
  onRefresh: () => void;
}

export function EntryCard({ entry, pageColor, pageName, onReply, onEndorse, onRefresh }: EntryCardProps) {
  const { address } = useWallet();
  const [username, setUsername] = useState<string | null>(null);
  const isSealed = entry.revealBlock !== null && entry.revealBlock > 0;
  const [showMeta, setShowMeta] = useState(false);

  useEffect(() => {
    const sender = address || "SP2X9XZZHGXMCV14WZ6FCNPH6JMR0NMASQGA3GAB1";
    getUsername(entry.author, sender).then(setUsername);
  }, [address, entry.author]);

  function truncate(addr: string) { return `${addr.slice(0, 6)}...${addr.slice(-4)}`; }

  return (
    <article className="relative overflow-hidden rounded-lg border bg-[rgba(255,248,236,0.78)] p-5 shadow-[0_14px_32px_rgba(77,58,43,0.12)] transition-all duration-200 hover:-translate-y-0.5 md:p-6" style={{ borderColor: pageColor ? `${pageColor}35` : "rgba(32,25,35,0.08)" }}>
      <div className="absolute left-0 top-0 h-full w-1.5" style={{ background: pageColor || "var(--gold)" }} />
      {/* Page badge + seal indicator */}
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {pageName && (
          <span className="px-2.5 py-1 rounded-full text-xs font-black" style={{ background: pageColor + "20", color: pageColor }}>
            {pageName}
          </span>
        )}
        {isSealed && (
          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black" style={{ background: "rgba(201,142,47,0.14)", color: "var(--gold)" }}>
            <Clock size={12} /> Opens at block {entry.revealBlock}
          </span>
        )}
        {entry.parentId !== null && entry.parentId > 0 && (
          <span className="px-2.5 py-1 rounded-full text-xs font-black" style={{ color: "var(--teal)", background: "rgba(23,111,117,0.1)" }}>
            <Reply size={10} className="inline mr-1" /> Reply to #{entry.parentId}
          </span>
        )}
      </div>

      {/* Message (or blurred if sealed) */}
      {isSealed ? (
        <div className="mb-4 select-none rounded-lg border p-5" style={{ background: "rgba(32,25,35,0.92)", borderColor: "rgba(201,142,47,0.28)" }}>
          <div className="mb-3 flex items-center gap-2 text-xs font-black" style={{ color: "#f4d08c" }}>
            <LockKeyhole size={14} /> Sealed time capsule
          </div>
          <p className="text-sm leading-relaxed blur-[4px] opacity-55" style={{ color: "#fff8ec" }}>{entry.message}</p>
        </div>
      ) : (
        <p className="text-base md:text-lg leading-relaxed mb-4 font-medium" style={{ color: "var(--ink)" }}>
          {entry.message}
        </p>
      )}

      {/* Reactions */}
      <div className="mb-4 rounded-lg border p-2" onClick={(e) => e.stopPropagation()} style={{ background: "rgba(255,248,236,0.52)", borderColor: "rgba(32,25,35,0.06)" }}>
        <ReactionBar entryId={entry.id} onRefresh={onRefresh} />
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 mb-3" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => onReply?.(entry.id)}
          className="flex items-center gap-1 text-xs font-black transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--neu-accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <MessageCircle size={13} /> Reply
        </button>
        <button
          onClick={() => onEndorse?.(entry.id)}
          className="flex items-center gap-1 text-xs font-black transition-colors"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--neu-accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <Heart size={13} /> Endorse
        </button>
        <button
          onClick={() => setShowMeta(!showMeta)}
          className="flex items-center gap-1 text-xs font-black transition-colors ml-auto"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--neu-accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          <Link2 size={13} /> #{entry.id}
        </button>
      </div>

      {/* Author + block metadata */}
      <div className="flex flex-wrap justify-between items-center gap-2 border-t pt-3 text-xs font-bold" style={{ color: "var(--text-muted)", borderColor: "rgba(32,25,35,0.08)" }}>
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black"
            style={{ background: pageColor ? `${pageColor}18` : "rgba(32,25,35,0.06)", color: pageColor || "var(--text-secondary)" }}
          >
            {(username ?? entry.author)[0]?.toUpperCase()}
          </span>
          <span className="font-mono truncate">{username ? `@${username}` : truncate(entry.author)}</span>
        </div>
        <span className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px]" style={{ background: "rgba(201,142,47,0.12)", color: "var(--gold)" }}>
          <Bitcoin size={10} /> Block #{entry.block}
        </span>
      </div>

      {/* Expandable metadata drawer */}
      {showMeta && (
        <div className="mt-3 space-y-1.5 rounded-lg border p-3 text-xs" style={{ borderColor: "rgba(32,25,35,0.06)", background: "rgba(255,248,236,0.42)" }}>
          <div className="flex justify-between gap-4">
            <span style={{ color: "var(--text-muted)" }}>Entry ID</span>
            <span className="font-mono font-bold" style={{ color: "var(--ink)" }}>#{entry.id}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span style={{ color: "var(--text-muted)" }}>Author</span>
            <span className="font-mono truncate" style={{ color: "var(--ink)" }}>{entry.author}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span style={{ color: "var(--text-muted)" }}>Block</span>
            <span className="font-mono font-bold" style={{ color: "var(--ink)" }}>#{entry.block}</span>
          </div>
          {entry.pageId !== null && (
            <div className="flex justify-between gap-4">
              <span style={{ color: "var(--text-muted)" }}>Room</span>
              <span className="font-bold" style={{ color: pageColor || "var(--ink)" }}>
                #{entry.pageId}{pageName ? ` · ${pageName}` : ""}
              </span>
            </div>
          )}
          {entry.parentId !== null && entry.parentId > 0 && (
            <div className="flex justify-between gap-4">
              <span style={{ color: "var(--text-muted)" }}>Reply to</span>
              <span className="font-mono font-bold" style={{ color: "var(--teal)" }}>#{entry.parentId}</span>
            </div>
          )}
          {isSealed && (
            <div className="flex justify-between gap-4">
              <span style={{ color: "var(--text-muted)" }}>Reveal block</span>
              <span className="font-mono font-bold" style={{ color: "var(--gold)" }}>#{entry.revealBlock}</span>
            </div>
          )}
          <a
            href={`https://explorer.stacks.co/contract/${CONTRACT_ADDRESS}.${CONTRACT_NAME}?chain=${process.env.NEXT_PUBLIC_NETWORK || "testnet"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 pt-2 mt-1 border-t text-xs font-bold transition-colors"
            style={{ borderColor: "rgba(32,25,35,0.06)", color: "var(--text-muted)" }}
          >
            <ExternalLink size={12} /> View contract on Stacks Explorer
          </a>
        </div>
      )}
    </article>
  );
}
