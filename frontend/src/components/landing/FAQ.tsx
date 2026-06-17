"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqData } from "@/lib/data";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { tag, headline, items } = faqData;

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-20 md:py-28">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <span
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: "var(--neu-accent)" }}
          >
            {tag}
          </span>
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {headline}
          </h2>
        </div>

        <div className="space-y-4">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-2xl transition-all duration-300"
                style={{
                  background: "var(--neu-bg)",
                  boxShadow: isOpen ? "var(--neu-inset)" : "var(--neu-raised-sm)",
                }}
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span
                    className="text-sm font-bold pr-4"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {item.question}
                  </span>
                  <ChevronDown
                    size={18}
                    style={{
                      color: "var(--text-muted)",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s ease",
                      flexShrink: 0,
                    }}
                  />
                </button>
                <div
                  className={`faq-answer ${isOpen ? "open" : ""}`}
                  style={
                    isOpen
                      ? {
                          borderTop: "1px solid var(--neu-border)",
                          paddingLeft: "1.25rem",
                          paddingRight: "1.25rem",
                          paddingBottom: "1.25rem",
                        }
                      : undefined
                  }
                >
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
