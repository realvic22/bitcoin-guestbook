"use client";

import { WalletProvider } from "@/components/wallet-provider";
import type { ReactNode } from "react";

export function WalletWrapper({ children }: { children: ReactNode }) {
  return <WalletProvider>{children}</WalletProvider>;
}
