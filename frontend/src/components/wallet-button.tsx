"use client";

import { useWallet } from "./wallet-provider";

function truncateAddress(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function WalletButton({ className = "" }: { className?: string }) {
  const { connected, address, connectWallet, disconnectWallet } = useWallet();

  if (connected && address) {
    return (
      <button
        onClick={disconnectWallet}
        className={`neu-btn px-4 py-2 text-sm font-semibold ${className}`}
        style={{ color: "var(--text-secondary)" }}
        title={address}
      >
        {truncateAddress(address)}
      </button>
    );
  }

  return (
    <button
      onClick={connectWallet}
      className={`neu-btn-accent px-5 py-2 text-sm font-bold ${className}`}
    >
      Connect Wallet
    </button>
  );
}
