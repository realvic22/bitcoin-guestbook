import Link from "next/link";
import { Bitcoin, Clock3, HeartHandshake, LockKeyhole, MessageCircle, Sparkles } from "lucide-react";
import { heroData } from "@/lib/data";

const rooms = [
  { name: "Memory Wall", note: "Moments you refuse to let the internet forget.", color: "var(--teal)" },
  { name: "Forgiveness Wall", note: "Leave the apology somewhere it cannot be edited.", color: "#6e8f5d" },
  { name: "Love Notes", note: "For the person who should find it again later.", color: "var(--rose)" },
  { name: "Predictions", note: "Seal a version of yourself for a future block.", color: "var(--gold)" },
];

export default function Hero() {
  const { badge, headline, subheadline, cta } = heroData;

  return (
    <section className="relative overflow-hidden pt-28 pb-14 md:pt-36 md:pb-20">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[rgba(32,25,35,0.08)] to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-14 items-center min-h-[calc(100vh-8rem)]">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 neu-badge mb-6">
              <Sparkles size={14} color="var(--gold)" />
              <span className="text-xs font-bold tracking-wide" style={{ color: "var(--ink)" }}>
                {badge}
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.02] mb-6 animate-fade-in-up"
              style={{ color: "var(--ink)", letterSpacing: 0 }}
            >
              {headline}
            </h1>

            <p
              className="text-base sm:text-lg max-w-2xl leading-relaxed mb-8 animate-fade-in-up-delay-1"
              style={{ color: "var(--text-secondary)" }}
            >
              {subheadline}
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 animate-fade-in-up-delay-2">
              <Link href={cta.primary.href} className="px-8 py-4 text-base font-bold neu-btn-accent">
                {cta.primary.label}
              </Link>
              <Link
                href={cta.secondary.href}
                className="px-8 py-4 text-base font-bold neu-btn"
                style={{ color: "var(--ink)" }}
              >
                {cta.secondary.label}
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-3 max-w-xl">
              {[
                ["7", "rooms"],
                ["6", "reactions"],
                ["0.01", "STX"],
              ].map(([value, label]) => (
                <div key={label} className="border-l-2 pl-3" style={{ borderColor: "rgba(201,142,47,0.7)" }}>
                  <div className="text-2xl font-black" style={{ color: "var(--ink)" }}>{value}</div>
                  <div className="text-xs font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[650px] lg:min-h-[640px]">
            <div className="absolute inset-0 rounded-[18px] border border-[rgba(32,25,35,0.08)] bg-[rgba(255,248,236,0.35)] shadow-[0_30px_80px_rgba(77,58,43,0.18)]" />
            <div className="absolute left-6 right-6 top-6 flex items-center justify-between rounded-lg border border-[rgba(32,25,35,0.08)] bg-[rgba(255,248,236,0.78)] px-4 py-3 backdrop-blur">
              <div className="flex items-center gap-2 text-sm font-black" style={{ color: "var(--ink)" }}>
                <Bitcoin size={18} color="var(--gold)" /> Guestbook Rooms
              </div>
              <div className="text-xs font-bold" style={{ color: "var(--text-muted)" }}>anchored to Bitcoin</div>
            </div>

            <div className="absolute left-6 right-6 top-24 grid grid-cols-2 gap-3">
              {rooms.map((room) => (
                <div key={room.name} className="rounded-lg border bg-[rgba(255,248,236,0.76)] p-4 shadow-sm" style={{ borderColor: `${room.color}40` }}>
                  <div className="mb-3 h-1.5 w-12 rounded-full" style={{ background: room.color }} />
                  <h3 className="text-sm font-black" style={{ color: "var(--ink)" }}>{room.name}</h3>
                  <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{room.note}</p>
                </div>
              ))}
            </div>

            <div className="memory-card absolute left-3 top-[360px] w-[78%] rounded-lg border border-[rgba(191,71,111,0.24)] bg-[#fff8ec] p-5 shadow-[0_22px_45px_rgba(85,58,54,0.18)] [--rotate:-2deg] sm:top-[330px] sm:w-[72%]">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-[rgba(191,71,111,0.12)] px-3 py-1 text-xs font-black" style={{ color: "var(--rose)" }}>Love Notes</span>
                <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>#142</span>
              </div>
              <p className="text-lg font-bold leading-snug" style={{ color: "var(--ink)" }}>
                I saved this here because one day ordinary texts will be gone. This one should still find you.
              </p>
              <div className="mt-4 flex items-center gap-3 text-xs font-bold" style={{ color: "var(--text-muted)" }}>
                <span>❤️ 18</span><span>🕯️ 7</span><span className="flex items-center gap-1"><MessageCircle size={13} /> 2 replies</span>
              </div>
            </div>

            <div className="memory-card absolute bottom-20 left-12 right-3 rounded-lg border border-[rgba(201,142,47,0.28)] bg-[#2e3142] p-5 text-[#fff8ec] shadow-[0_22px_50px_rgba(32,25,35,0.22)] [--rotate:3deg] sm:left-auto sm:w-[56%] sm:bottom-24" style={{ animationDelay: "1.2s" }}>
              <div className="mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-black text-[#f4d08c]"><LockKeyhole size={14} /> Time Capsule</span>
                <span className="wax-seal flex h-9 w-9 items-center justify-center rounded-full bg-[#c98e2f] text-xs font-black text-[#2e3142]">₿</span>
              </div>
              <p className="select-none text-sm leading-relaxed blur-[3px] opacity-60">
                Open this after the hard thing is over. You were braver than you knew.
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs font-bold text-[#f4d08c]">
                <Clock3 size={14} /> opens at block 900,000
              </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 rounded-lg border border-[rgba(23,111,117,0.24)] bg-[rgba(255,248,236,0.82)] p-4 backdrop-blur">
              <div className="flex items-start gap-3">
                <HeartHandshake size={20} color="var(--teal)" />
                <div>
                  <div className="text-sm font-black" style={{ color: "var(--ink)" }}>This touched someone</div>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    &quot;I read this before calling my brother. It changed the conversation.&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
