"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { WalletButton } from "@/components/wallet-button";
import { SearchBar } from "@/components/guestbook/SearchBar";
import { navLinks } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobile = () => setMobileOpen((prev) => !prev);
  const closeMobile = () => setMobileOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "neu-navbar-scrolled py-3" : "py-5"
      }`}
      style={{
        background: scrolled ? "rgba(244, 234, 223, 0.9)" : "rgba(244, 234, 223, 0.72)",
        backdropFilter: "blur(18px)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-black"
          style={{ color: "var(--ink)", letterSpacing: 0 }}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-[#fff8ec]" style={{ background: "var(--ink)" }}>₿</span>
          <span>Guestbook</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200"
              style={{
                color: "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "var(--neu-raised-sm)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/wall"
            className="ml-2 px-5 py-2 text-sm font-bold neu-btn-accent"
          >
            Write
          </Link>
          <WalletButton className="ml-2" />
          <SearchBar />
        </div>

        {/* Mobile toggle */}
        <button
          onClick={toggleMobile}
          className="md:hidden neu-icon-circle w-10 h-10"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-4 pb-6 pt-2 space-y-1"
          style={{ background: "var(--neu-bg)" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobile}
              className="block px-4 py-3 text-sm font-semibold neu-card rounded-xl"
              style={{ color: "var(--text-primary)" }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/wall"
            onClick={closeMobile}
            className="block text-center mt-3 px-5 py-3 text-sm font-bold neu-btn-accent"
          >
            Write
          </Link>
          <div className="flex justify-center mt-4">
            <WalletButton />
          </div>
        </div>
      )}
    </nav>
  );
}
