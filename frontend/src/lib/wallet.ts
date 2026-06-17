import { getLocalStorage } from "@stacks/connect";

type WalletAddress = { symbol?: string; address: string };

export function getStoredStxAddress(): string {
  const stored = getLocalStorage();
  return stored?.addresses?.stx?.[0]?.address ?? "";
}

export function pickStxAddress(addresses: WalletAddress[]): string {
  const stx = addresses.find((entry) => entry.symbol === "STX");
  return stx?.address ?? addresses[0]?.address ?? getStoredStxAddress();
}
