import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import Link from "next/link";
import "./globals.css";

// Serif italic used for the single editorial keyword in headlines.
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

export const metadata: Metadata = {
  title: "TripSync — decide your group trip",
  description:
    "Collect everyone's preferences. Find what works for everyone. See what changes. Make one decision.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Clash Display + Satoshi are Fontshare fonts (not on Google Fonts) */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500,700&display=swap"
        />
      </head>
      <body className={`${instrumentSerif.variable} flex min-h-screen flex-col font-sans antialiased`}>
        <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
          <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="font-display text-xl font-bold tracking-tight">
              TRIPSYNC<span className="text-accent">.</span>
            </Link>
            <nav className="flex items-center gap-5 text-sm uppercase tracking-wide sm:gap-8">
              <Link href="/join" className="transition-colors duration-[120ms] hover:text-soft">Join a trip</Link>
              <Link
                href="/create"
                className="rounded-full border border-charcoal px-4 py-2 transition-colors duration-200 hover:bg-charcoal hover:text-paper"
              >
                Plan a trip
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 sm:py-14">{children}</main>

        <footer className="border-t border-white/5 bg-charcoal text-paper/60">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
            <div>
              <div className="font-display text-xl font-bold text-paper">TRIPSYNC<span className="text-sand">.</span></div>
              <p className="mt-3 text-sm leading-relaxed">
                One link. Everyone&apos;s preferences. A clear picture of what works — so your group makes one decision.
              </p>
            </div>
            <FooterCol title="Product" links={[["Plan a trip", "/create"], ["Join a trip", "/join"]]} />
            <FooterCol title="How it works" links={[["Collect preferences", "/create"], ["Compare options", "/create"], ["What-If simulator", "/create"]]} />
            <div>
              <div className="text-xs font-bold uppercase tracking-widest text-paper">Good to know</div>
              <ul className="mt-4 space-y-2 text-sm">
                <li>Prices are AI estimates</li>
                <li>Nothing is booked</li>
                <li>Your group decides — not the AI</li>
              </ul>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-widest text-paper">{title}</div>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link href={href} className="transition-colors hover:text-paper">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
