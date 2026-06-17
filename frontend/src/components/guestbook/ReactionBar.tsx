"use client";

import { useCallback, useEffect, useState } from "react";
import { request } from "@stacks/connect";
import { Cl } from "@stacks/transactions";
import { CONTRACT_ADDRESS, CONTRACT_NAME } from "@/lib/stacks";
import { getReactions, getUserReaction, type ReactionCounts } from "@/lib/contracts";
import { useWallet } from "@/components/wallet-provider";

const EMOJIS = [
  { id: 1, emoji: "\u2764\uFE0F", key: "heart", label: "Love" },
  { id: 2, emoji: "\uD83D\uDE4F", key: "pray", label: "Pray" },
  { id: 3, emoji: "\uD83D\uDCAA", key: "strong", label: "Strong" },
  { id: 4, emoji: "\uD83D\uDD25", key: "fire", label: "Fire" },
  { id: 5, emoji: "\uD83D\uDD6F\uFE0F", key: "candle", label: "Candle" },
  { id: 6, emoji: "\uD83C\uDF1F", key: "star", label: "Star" },
] as const;

export function ReactionBar({ entryId, onRefresh }: { entryId: number; onRefresh: () => void }) {
  const { connected, address } = useWallet();
  const [counts, setCounts] = useState<ReactionCounts>({ heart: 0, pray: 0, strong: 0, fire: 0, candle: 0, star: 0 });
  const [myEmoji, setMyEmoji] = useState<number | null>(null);
  const [sending, setSending] = useState(false);

  const loadReactions = useCallback(() => {
    const sender = address || "SP2X9XZZHGXMCV14WZ6FCNPH6JMR0NMASQGA3GAB1";
    getReactions(entryId, sender).then(setCounts);
    if (address) getUserReaction(entryId, address, sender).then(setMyEmoji);
  }, [address, entryId]);

  useEffect(() => {
    void Promise.resolve().then(loadReactions);
  }, [loadReactions]);

  async function handleReact(emojiId: number) {
    if (!address || sending) return;
    setSending(true);
    try {
      const contractId = `${CONTRACT_ADDRESS}.${CONTRACT_NAME}` as `${string}.${string}`;
      const isRemoving = myEmoji === emojiId;
      await request("stx_callContract", {
        contract: contractId,
        functionName: "react",
        functionArgs: [Cl.uint(entryId), isRemoving ? Cl.none() : Cl.some(Cl.uint(emojiId))],
        network: "mainnet",
        postConditionMode: "allow",
      });
      setTimeout(() => { loadReactions(); onRefresh(); }, 4000);
    } catch (e) { console.error(e); }
    setSending(false);
  }

  return (
    <div className="flex items-center gap-1 flex-wrap">
      {EMOJIS.map((e) => {
        const count = counts[e.key as keyof ReactionCounts];
        const isActive = myEmoji === e.id;
        return (
          <button
            key={e.id}
            onClick={() => handleReact(e.id)}
            disabled={!connected || sending}
            title={e.label}
            className="flex items-center gap-1 rounded-full border px-2 py-1 text-xs transition-all duration-150 disabled:opacity-50"
            style={{
              background: isActive ? "rgba(32,25,35,0.92)" : "rgba(255,248,236,0.42)",
              borderColor: isActive ? "rgba(32,25,35,0.92)" : "rgba(32,25,35,0.08)",
            }}
          >
            <span className="text-sm">{e.emoji}</span>
            {count > 0 && (
              <span className="font-black" style={{ color: isActive ? "#fff8ec" : "var(--text-muted)", fontSize: 11 }}>
                {count > 999 ? "1k+" : count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
