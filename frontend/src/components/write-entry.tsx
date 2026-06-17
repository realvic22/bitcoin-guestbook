"use client";

import { useState } from "react";
import { request } from "@stacks/connect";
import { Cl } from "@stacks/transactions";
import { CONTRACT_ADDRESS, CONTRACT_NAME, ENTRY_FEE } from "@/lib/stacks";
import { useWallet } from "./wallet-provider";
import { WalletButton } from "./wallet-button";

export function WriteEntry({ onEntryWritten }: { onEntryWritten: () => void }) {
  const { connected } = useWallet();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [txId, setTxId] = useState("");
  const [error, setError] = useState("");
  const MAX_CHARS = 200;

  const handleSubmit = async () => {
    if (!message.trim()) return;

    try {
      setSending(true);
      setError("");
      setTxId("");
      const contractId = `${CONTRACT_ADDRESS}.${CONTRACT_NAME}` as `${string}.${string}`;
      const result = await request("stx_callContract", {
        contract: contractId,
        functionName: "write",
        functionArgs: [Cl.stringAscii(message.trim())],
        network:
          process.env.NEXT_PUBLIC_NETWORK === "mainnet" ? "mainnet" : "testnet",
        postConditionMode: "allow",
      });

      const id = (result as { txid?: string; txId?: string }).txid
        ?? (result as { txid?: string; txId?: string }).txId
        ?? "";
      setTxId(id);
      setMessage("");
      onEntryWritten();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Transaction failed. Please try again.";
      setError(msg);
    } finally {
      setSending(false);
    }
  };

  if (!connected) {
    return (
      <div className="neu-card p-8 text-center">
        <h3
          className="text-lg font-bold mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Connect to write
        </h3>
        <p
          className="text-sm mb-6 max-w-sm mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Connect your Stacks wallet to leave a permanent message on the wall.
        </p>
        <WalletButton />
      </div>
    );
  }

  return (
    <div className="neu-card p-6 md:p-8">
      <div className="flex items-baseline justify-between gap-4 mb-4">
        <h3
          className="text-lg font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          Write a message
        </h3>
        <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
          {ENTRY_FEE / 1_000_000} STX fee
        </span>
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={MAX_CHARS}
        placeholder="What would you want to last forever?"
        rows={4}
        disabled={sending}
        className="neu-input w-full resize-none disabled:opacity-50"
      />

      <div className="flex justify-between items-center mt-4 gap-4">
        <span
          className="text-xs font-semibold"
          style={{
            color:
              message.length > MAX_CHARS * 0.9
                ? "var(--neu-accent)"
                : "var(--text-muted)",
          }}
        >
          {message.length}/{MAX_CHARS}
        </span>
        <button
          onClick={handleSubmit}
          disabled={!message.trim() || sending}
          className="neu-btn-accent px-6 py-2.5 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {sending ? "Sending..." : "Etch on Bitcoin"}
        </button>
      </div>

      {txId && (
        <p className="mt-4 text-xs leading-relaxed" style={{ color: "var(--neu-accent)" }}>
          Transaction broadcast! Your entry will appear on the wall after confirmation.
        </p>
      )}
      {error && (
        <p className="mt-4 text-xs leading-relaxed text-red-500">{error}</p>
      )}
    </div>
  );
}
