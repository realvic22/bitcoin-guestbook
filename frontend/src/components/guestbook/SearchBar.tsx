"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { getPrincipal } from "@/lib/contracts";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const router = useRouter();

  async function handleSearch() {
    const q = query.trim().toLowerCase();
    if (!q || q.length < 3) return;
    setLoading(true);
    setNotFound(false);
    const sender = "SP2X9XZZHGXMCV14WZ6FCNPH6JMR0NMASQGA3GAB1";
    const principal = await getPrincipal(q, sender);
    setLoading(false);
    if (principal) {
      router.push(`/user/${q}`);
    } else {
      setNotFound(true);
    }
  }

  return (
    <div className="relative">
      <div className="flex items-center neu-input px-3 py-2 gap-2">
        <Search size={15} style={{ color: "var(--text-muted)" }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search username..."
          className="bg-transparent border-none outline-none text-sm flex-1 placeholder-gray-500"
          style={{ color: "var(--text-primary)" }}
        />
        {loading && <span className="text-xs animate-pulse" style={{ color: "var(--text-muted)" }}>...</span>}
      </div>
      {notFound && (
        <div className="absolute left-3 top-full mt-2 rounded-md bg-[rgba(32,25,35,0.92)] px-3 py-2 text-xs font-bold text-[#fff8ec] shadow-lg">
          No username found
        </div>
      )}
    </div>
  );
}
