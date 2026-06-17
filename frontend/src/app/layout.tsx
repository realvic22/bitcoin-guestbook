import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { WalletWrapper } from "@/components/wallet-wrapper";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bitcoin Guestbook — Immutable Messages on Bitcoin",
  description:
    "Leave a permanent message on the Bitcoin blockchain via Stacks. Immutable, forever, anchored to the world's most secure ledger.",
  openGraph: {
    title: "Bitcoin Guestbook",
    description: "Immutable messages anchored to Bitcoin forever.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={nunito.className}>
      <body className="min-h-screen neu-bg antialiased">
        <WalletWrapper>{children}</WalletWrapper>
      </body>
    </html>
  );
}
