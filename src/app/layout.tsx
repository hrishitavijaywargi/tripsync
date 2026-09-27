import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "TripSync — decide your group trip",
  description:
    "Collect everyone's preferences. Find what works for everyone. See what changes. Make one decision.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Zodiak + Satoshi are Fontshare fonts (not on Google Fonts) */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=zodiak@400,700&f[]=satoshi@300,400,500,700&display=swap"
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans antialiased">
        <header className="fixed inset-x-0 top-0 z-50 bg-gradient-to-b from-paper via-paper/90 to-transparent">
          <div className="mx-auto flex max-w-7xl items-end justify-between px-5 py-6 sm:px-12 sm:py-8">
            <Link href="/" className="flex flex-col">
              <span className="mb-1 text-[10px] uppercase tracking-[0.4em] opacity-60">Group trip decisions</span>
              <span className="font-display text-2xl tracking-tight sm:text-3xl">TRIPSYNC</span>
            </Link>
            <nav className="hidden gap-12 text-sm font-medium uppercase tracking-widest lg:flex">
              <Link href="/create" className="nav-item py-1">Plan a trip</Link>
              <Link href="/join" className="nav-item py-1">Join a trip</Link>
              <Link href="/#how" className="nav-item py-1">How it works</Link>
            </nav>
            <div className="flex items-center gap-6">
              <Link href="/join" className="text-xs font-medium uppercase tracking-widest hover:text-accent lg:hidden">Join</Link>
              <Link
                href="/create"
                className="bg-ink px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-500 hover:bg-accent sm:px-8"
              >
                Plan a trip
              </Link>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-5 pb-20 pt-32 sm:px-12 sm:pt-40">{children}</main>

        <footer className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-4 border-t border-line px-5 py-10 text-[10px] uppercase tracking-[0.2em] opacity-50 sm:px-12 md:flex-row">
          <div>© 2026 TripSync</div>
          <div className="flex gap-8">
            <Link href="/create" className="hover:text-accent">Plan</Link>
            <Link href="/join" className="hover:text-accent">Join</Link>
            <Link href="/#how" className="hover:text-accent">How it works</Link>
          </div>
          <div>Prices are AI estimates · Nothing is booked</div>
        </footer>
      </body>
    </html>
  );
}
