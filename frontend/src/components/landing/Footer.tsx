import Link from "next/link";
import { footerData } from "@/lib/data";

export default function Footer() {
  const { tagline, navGroups, copyright } = footerData;

  return (
    <footer
      className="py-16 mt-12"
      style={{
        background: "var(--neu-bg)",
        boxShadow: "var(--neu-inset)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-lg font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              <span style={{ color: "var(--neu-accent)" }}>₿</span> Guestbook
            </Link>
            <p
              className="mt-3 text-sm leading-relaxed"
              style={{ color: "var(--text-muted)" }}
            >
              {tagline}
            </p>
          </div>

          {/* Nav groups */}
          {navGroups.map((group) => (
            <div key={group.title}>
              <h4
                className="text-xs font-bold uppercase tracking-wider mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors duration-200 hover:text-[var(--neu-accent)]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 text-center"
          style={{ borderTop: "1px solid var(--neu-border)" }}
        >
          <p
            className="text-xs"
            style={{ color: "var(--text-muted)", opacity: 0.7 }}
          >
            {copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}
