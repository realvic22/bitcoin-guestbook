import { STACKS_TESTNET, STACKS_MAINNET } from "@stacks/network";

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!;
export const CONTRACT_NAME = process.env.NEXT_PUBLIC_CONTRACT_NAME!;
export const ENTRY_FEE = 10000;
export const REACTION_FEE = 1000;
export const PAGE_FEE = 50000;
export const USERNAME_FEE = 50000;

export function getNetwork() {
  const network = process.env.NEXT_PUBLIC_NETWORK || "testnet";
  return network === "mainnet" ? STACKS_MAINNET : STACKS_TESTNET;
}
