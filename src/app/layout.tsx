import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TripSync — decide your group trip",
  description:
    "Collect everyone's preferences. Find what works for everyone. See what changes. Make one decision.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen font-sans antialiased`}>
        <header className="border-b border-stone-200 bg-white/80 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-600 text-sm text-white">⇄</span>
              TripSync
            </Link>
            <nav className="flex items-center gap-4 text-sm text-stone-600">
              <Link href="/join" className="hover:text-stone-900">Join a trip</Link>
              <Link href="/create" className="rounded-full bg-stone-900 px-3 py-1.5 text-white hover:bg-stone-700">
                Plan a trip
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8 sm:py-12">{children}</main>
      </body>
    </html>
  );
}
