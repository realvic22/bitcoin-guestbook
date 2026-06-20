import { STACKS_TESTNET, STACKS_MAINNET } from "@stacks/network";

const rawAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
const rawName = process.env.NEXT_PUBLIC_CONTRACT_NAME!;

// Defensive: if the address accidentally includes the contract name suffix
// (e.g. "SP...guestbook-v2"), strip it so API URLs won't double-include it.
export const CONTRACT_ADDRESS = rawAddress.endsWith(`.${rawName}`)
  ? rawAddress.slice(0, -(rawName.length + 1))
  : rawAddress;
export const CONTRACT_NAME = rawName;
export const ENTRY_FEE = 10000;
export const REACTION_FEE = 1000;
export const PAGE_FEE = 50000;
export const USERNAME_FEE = 50000;

export function getNetwork() {
  const network = process.env.NEXT_PUBLIC_NETWORK || "testnet";
  return network === "mainnet" ? STACKS_MAINNET : STACKS_TESTNET;
}
