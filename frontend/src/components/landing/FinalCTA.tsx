import Link from "next/link";
import { finalCTAData } from "@/lib/data";

export default function FinalCTA() {
  const { headline, subheadline, cta } = finalCTAData;

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div
          className="neu-card p-10 md:p-16 text-center"
          style={{ boxShadow: "var(--neu-raised-lg)" }}
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {headline}
          </h2>
          <p
            className="text-base max-w-lg mx-auto leading-relaxed mb-8"
            style={{ color: "var(--text-secondary)" }}
          >
            {subheadline}
          </p>
          <Link href={cta.href} className="inline-block px-10 py-4 text-base font-bold neu-btn-accent">
            {cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
