"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { connect, isConnected, disconnect } from "@stacks/connect";
import { getStoredStxAddress, pickStxAddress } from "@/lib/wallet";

interface WalletContextValue {
  connected: boolean;
  address: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextValue>({
  connected: false,
  address: "",
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (isConnected()) {
      const storedAddress = getStoredStxAddress();
      setConnected(!!storedAddress);
      setAddress(storedAddress);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    try {
      const result = await connect();
      const stxAddress = pickStxAddress(result.addresses);
      setConnected(!!stxAddress);
      setAddress(stxAddress);
    } catch (err) {
      console.error("Wallet connection failed:", err);
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    disconnect();
    setConnected(false);
    setAddress("");
  }, []);

  return (
    <WalletContext.Provider
      value={{ connected, address, connectWallet, disconnectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  return useContext(WalletContext);
}
