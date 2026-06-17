"use client";

import { useEffect, useState } from "react";
import { request } from "@stacks/connect";
import { Cl } from "@stacks/transactions";
import { Clock3, Feather, LockKeyhole, MessageCircle, Stamp } from "lucide-react";
import { CONTRACT_ADDRESS, CONTRACT_NAME, ENTRY_FEE } from "@/lib/stacks";
import { getPageCount, getPage, type PageData } from "@/lib/contracts";
import { useWallet } from "@/components/wallet-provider";
import { WalletButton } from "@/components/wallet-button";

type WriteMode = "new" | "reply" | "endorse" | "capsule";

interface WriteFormProps {
  onEntryWritten: () => void;
  defaultPageId?: number | null;
  replyTo?: { id: number; preview: string } | null;
}

export function WriteForm({ onEntryWritten, defaultPageId, replyTo }: WriteFormProps) {
  const { connected, address } = useWallet();
  const [message, setMessage] = useState(replyTo ? "" : "");
  const [pageId, setPageId] = useState<number | null>(defaultPageId ?? null);
  const [revealBlock, setRevealBlock] = useState<string>("");
  const [mode, setMode] = useState<WriteMode>("new");
  const [sending, setSending] = useState(false);
  const [txId, setTxId] = useState("");
  const [error, setError] = useState("");
  const [pages, setPages] = useState<(PageData & { id: number })[]>([]);
  const [showPagePicker, setShowPagePicker] = useState(false);
  const MAX_CHARS = 200;

  useEffect(() => {
    const sender = address || "SP2X9XZZHGXMCV14WZ6FCNPH6JMR0NMASQGA3GAB1";
    getPageCount(sender).then(async (count) => {
      const items: (PageData & { id: number })[] = [];
      for (let i = 1; i <= count; i++) {
        const p = await getPage(i, sender);
        if (p) items.push({ ...p, id: i });
      }
      setPages(items);
    }).catch(() => setPages([]));
  }, [address]);

  async function handleSubmit() {
    if (!message.trim()) return;
    setSending(true); setError(""); setTxId("");
    try {
      const contractId = `${CONTRACT_ADDRESS}.${CONTRACT_NAME}` as `${string}.${string}`;
      const args = [
        Cl.stringAscii(message.trim()),
        pageId ? Cl.some(Cl.uint(pageId)) : Cl.none(),
        replyTo ? Cl.some(Cl.uint(replyTo.id)) : Cl.none(),
        revealBlock ? Cl.some(Cl.uint(Number.parseInt(revealBlock, 10))) : Cl.none(),
      ];

      const result = await request("stx_callContract", {
        contract: contractId,
        functionName: "write",
        functionArgs: args,
        network: "mainnet",
        postConditionMode: "allow",
      });
      const { txid, txId } = result as { txid?: string; txId?: string };
      const id = txid || txId || "";
      setTxId(id);
      setMessage("");
      onEntryWritten();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Transaction failed");
    }
    setSending(false);
  }

  if (!connected) {
    return (
      <div className="neu-card p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full" style={{ background: "rgba(201,142,47,0.16)" }}>
          <Stamp size={22} color="var(--gold)" />
        </div>
        <h3 className="text-lg font-black mb-2" style={{ color: "var(--ink)" }}>Connect to write</h3>
        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Your wallet signs the message, the chain keeps the receipt.</p>
        <WalletButton />
      </div>
    );
  }

  return (
    <div className="neu-card p-6 md:p-8">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <span className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--gold)" }}>Compose</span>
          <h3 className="mt-1 text-2xl font-black" style={{ color: "var(--ink)", letterSpacing: 0 }}>Write it like it matters.</h3>
        </div>
        <div className="hidden h-12 w-12 items-center justify-center rounded-full sm:flex" style={{ background: "var(--ink)" }}>
          <Feather size={21} color="#fff8ec" />
        </div>
      </div>

      {replyTo && (
        <div className="mb-4 rounded-lg border p-3 text-xs" style={{ color: "var(--text-secondary)", borderColor: "rgba(23,111,117,0.22)", background: "rgba(23,111,117,0.08)" }}>
          <span className="font-black" style={{ color: "var(--teal)" }}>Replying to #{replyTo.id}:</span> {replyTo.preview.slice(0, 72)}...
        </div>
      )}

      <div className="mb-3 grid grid-cols-3 gap-2">
        {[
          { value: "new" as WriteMode, label: "Note", icon: Feather },
          { value: "reply" as WriteMode, label: "Reply", icon: MessageCircle },
          { value: "capsule" as WriteMode, label: "Capsule", icon: LockKeyhole },
        ].map((item) => {
          const Icon = item.icon;
          const active = (replyTo && item.value === "reply") || (!replyTo && mode === item.value);
          return (
            <button
              key={item.value}
              onClick={() => !replyTo && setMode(item.value === "reply" ? "new" : item.value)}
              disabled={Boolean(replyTo) && item.value !== "reply"}
              className="flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-black transition-all disabled:opacity-45"
              style={{
                background: active ? "var(--ink)" : "rgba(255,248,236,0.58)",
                color: active ? "#fff8ec" : "var(--text-secondary)",
                borderColor: active ? "var(--ink)" : "rgba(32,25,35,0.08)",
              }}
            >
              <Icon size={14} /> {item.label}
            </button>
          );
        })}
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={MAX_CHARS}
        placeholder={replyTo ? "Add your voice to this thread..." : mode === "capsule" ? "Write the message they can read later..." : "What should still be readable years from now?"}
        rows={6}
        disabled={sending}
        className="neu-input w-full resize-none text-base leading-relaxed disabled:opacity-50"
      />

      {/* Options row */}
      <div className="flex flex-wrap items-center gap-2 mt-3">
        <button onClick={() => setShowPagePicker(!showPagePicker)}
          className="rounded-full px-3 py-1.5 text-xs font-black transition-all"
          style={{ background: pageId ? (pages.find(p => p.id === pageId)?.color + "20" || "rgba(255,248,236,0.72)") : "rgba(255,248,236,0.72)", color: pageId ? (pages.find(p => p.id === pageId)?.color || "var(--text-secondary)") : "var(--text-secondary)", boxShadow: pageId ? "var(--neu-inset-sm)" : "none" }}
        >
          {pageId ? pages.find(p => p.id === pageId)?.name || `Wall #${pageId}` : "Choose Wall"}
        </button>

        {!replyTo && (
          <button onClick={() => setMode(mode === "capsule" ? "new" : "capsule")}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black transition-all"
            style={{ background: mode === "capsule" ? "rgba(201,142,47,0.16)" : "rgba(255,248,236,0.72)", color: mode === "capsule" ? "var(--gold)" : "var(--text-secondary)", boxShadow: mode === "capsule" ? "var(--neu-inset-sm)" : "none" }}
          >
            <Clock3 size={13} /> {mode === "capsule" ? "Sealed" : "Time Capsule"}
          </button>
        )}
      </div>

      {/* Page picker dropdown */}
      {showPagePicker && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          <button onClick={() => { setPageId(null); setShowPagePicker(false); }}
            className="px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(255,248,236,0.72)", color: "var(--text-secondary)" }}
          >None</button>
          {pages.map((p) => (
            <button key={p.id} onClick={() => { setPageId(p.id); setShowPagePicker(false); }}
              className="px-2.5 py-1 rounded-full text-xs font-bold transition-all"
              style={{ background: pageId === p.id ? p.color : "var(--neu-bg)", color: pageId === p.id ? "#fff" : p.color, borderColor: p.color, borderWidth: 1, borderStyle: "solid" }}
            >{p.name}</button>
          ))}
        </div>
      )}

      {/* Capsule reveal block input */}
      {mode === "capsule" && (
        <input
          type="number"
          value={revealBlock}
          onChange={(e) => setRevealBlock(e.target.value)}
          placeholder="Reveal at block height (e.g. 900000)"
          className="neu-input w-full mt-3 text-sm"
          disabled={sending}
        />
      )}

      <div className="flex justify-between items-center mt-5 gap-4">
        <span className="text-xs font-semibold" style={{ color: message.length > MAX_CHARS * 0.9 ? "var(--neu-accent)" : "var(--text-muted)" }}>
          {message.length}/{MAX_CHARS} &middot; {ENTRY_FEE / 1000000} STX
        </span>
        <button onClick={handleSubmit} disabled={!message.trim() || sending}
          className="neu-btn-accent px-6 py-2.5 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed">
          {sending ? "Sending..." : replyTo ? "Reply" : mode === "capsule" ? "Seal Capsule" : "Etch on Bitcoin"}
        </button>
      </div>

      {txId && <p className="mt-3 text-xs" style={{ color: "var(--neu-accent)" }}>Broadcast! Entry will appear after confirmation.</p>}
      {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
    </div>
  );
}
