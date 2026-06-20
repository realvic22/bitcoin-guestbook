"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Clock3, HeartHandshake, PenLine } from "lucide-react";
import { GuestbookSection } from "@/components/guestbook-section";
import { SearchBar } from "@/components/guestbook/SearchBar";
import { WalletButton } from "@/components/wallet-button";
import type { PageData } from "@/lib/contracts";

type RoomMeta = (PageData & { id: number }) | null;

const guide = [
  {
    icon: BookOpen,
    title: "Pick a room",
    text: "Dreams, memories, apologies, love notes, predictions, and legacy entries each have their own tone.",
  },
  {
    icon: PenLine,
    title: "Write once",
    text: "Keep it clear and intentional. The message is signed by your wallet and cannot be edited later.",
  },
  {
    icon: Clock3,
    title: "Seal it later",
    text: "Use a time capsule when the message should wait for a future block before it can be read.",
  },
  {
    icon: HeartHandshake,
    title: "Respond with meaning",
    text: "Replies, permanent reactions, and gratitude links turn single notes into conversations across time.",
  },
];

export default function WallPage() {
  const [currentRoom, setCurrentRoom] = useState<RoomMeta>(null);

  const handleRoomChange = useCallback((meta: RoomMeta) => {
    setCurrentRoom(meta);
  }, []);

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-[rgba(32,25,35,0.08)] bg-[rgba(244,234,223,0.86)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[rgba(255,248,236,0.8)] shadow-sm"
              aria-label="Back to landing page"
            >
              <ArrowLeft size={18} color="var(--ink)" />
            </Link>
            <Link href="/wall" className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-base font-black leading-tight" style={{ color: "var(--ink)" }}>
                  Guestbook Wall
                </div>
                {currentRoom && (
                  <div
                    className="hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-black transition-all duration-300"
                    style={{ background: `${currentRoom.color}18`, color: currentRoom.color }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: currentRoom.color }} />
                    {currentRoom.name}
                  </div>
                )}
              </div>
          <div className="truncate text-xs font-bold transition-colors duration-300" style={{ color: currentRoom ? currentRoom.color : "var(--text-muted)" }}>
            {currentRoom ? currentRoom.description : "Rooms for permanent messages"}
          </div>
            </Link>
          </div>

          <div className="hidden min-w-72 max-w-sm flex-1 md:block">
            <SearchBar />
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <WalletButton />
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-4 pt-7 sm:px-6 md:pt-10">
        <div className="grid gap-5 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <span
              className="text-xs font-black uppercase tracking-widest transition-colors duration-300"
              style={{ color: currentRoom?.color || "var(--rose)" }}
            >
              {currentRoom ? `The ${currentRoom.name}` : "The live wall"}
            </span>
            <h1 className="mt-2 max-w-3xl text-3xl font-black leading-tight sm:text-5xl" style={{ color: "var(--ink)", letterSpacing: 0 }}>
              {currentRoom
                ? currentRoom.description
                : "Write, browse, reply, and seal messages without leaving the room."}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              This is the working guestbook. Choose an emotional room, compose a note, or browse what others have already anchored to Bitcoin.
            </p>
          </div>

          <div className="block md:hidden">
            <SearchBar />
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {guide.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-lg border bg-[rgba(255,248,236,0.66)] p-3 shadow-sm sm:p-4 transition-colors duration-300" style={{ borderColor: currentRoom ? `${currentRoom.color}33` : "rgba(32,25,35,0.08)" }}>
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-full sm:mb-3 sm:h-9 sm:w-9 transition-colors duration-300" style={{ background: currentRoom ? `${currentRoom.color}18` : "rgba(23,111,117,0.11)" }}>
                  <Icon size={17} color={currentRoom?.color || "var(--teal)"} />
                </div>
                <h2 className="text-sm font-black" style={{ color: "var(--ink)" }}>{item.title}</h2>
                <p className="mt-1 hidden text-xs font-semibold leading-relaxed sm:block" style={{ color: "var(--text-secondary)" }}>{item.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      <GuestbookSection appMode onRoomChange={handleRoomChange} />
    </main>
  );
}
