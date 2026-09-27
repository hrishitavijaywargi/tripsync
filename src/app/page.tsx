import Link from "next/link";
import { Accent, Echo, FitBadge, linkButton } from "@/components/ui";

const PREVIEW = [
  { name: "Riya", fit: "good" as const },
  { name: "Siddharth", fit: "good" as const },
  { name: "Karan", fit: "partial" as const },
  { name: "Aisha", fit: "good" as const },
  { name: "Preethi", fit: "good" as const },
];

const PILLARS = [
  { title: "Collect", text: "One link. Everyone adds budget, dates, destination types, must-haves and deal-breakers." },
  { title: "Compare", text: "AI balances the whole group — not just the majority — and shows each person's fit." },
  { title: "Decide", text: "Test a What-If, see who it helps, then pick together. TripSync never picks for you." },
];

const SERVICES = [
  { n: "01", title: "Plan a trip", text: "Name it, set the group size, choose family, friends or business.", href: "/create", cta: "Start planning", shape: "rounded-none" },
  { n: "02", title: "Share one link", text: "No polls that collapse. Preferences are saved and editable any time.", href: "/join", cta: "Join a trip", shape: "rounded-full" },
  { n: "03", title: "Ask “What if?”", text: "Change one thing — budget, dates, flights — without touching anyone's answers.", href: "/create", cta: "Try it", shape: "rotate-45" },
];

export default function Home() {
  return (
    <div className="-mt-10 sm:-mt-14">
      {/* HERO — pure typographic weight */}
      <section className="flex min-h-[70vh] flex-col items-center justify-center overflow-hidden py-16 text-center">
        <div className="reveal font-display text-[17vw] font-bold leading-[0.9] tracking-[-0.05em] sm:text-[13vw] lg:text-[180px]">
          <Echo text="DECIDE." />
        </div>
        <h1 className="mt-10 max-w-3xl text-3xl font-bold leading-[0.95] tracking-[-0.005em] sm:text-5xl">
          Stop planning your trip in <Accent>1,200</Accent> WhatsApp messages.
        </h1>
        <p className="mt-6 max-w-xl text-mute">
          Collect everyone&apos;s preferences. Find what works for everyone. See what changes. Make one decision.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link href="/create" className={linkButton.primary}>Plan a Trip →</Link>
          <Link href="/join" className={linkButton.secondary}>Join a Trip</Link>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="py-20 text-center">
        <div className="mx-auto h-24 w-px bg-charcoal/10" />
        <p className="mx-auto mt-12 max-w-4xl font-display text-4xl font-bold leading-[1] tracking-[-0.005em] sm:text-6xl">
          Five people. Five budgets. <Accent>One</Accent> decision.
        </p>
        <div className="mx-auto mt-16 grid max-w-5xl gap-8 text-left sm:grid-cols-3">
          {PILLARS.map((p) => (
            <div key={p.title} className="border-t border-charcoal pt-5">
              <h3 className="text-xl font-bold">{p.title}</h3>
              <p className="mt-2 text-sm font-normal leading-relaxed text-mute">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ASYMMETRICAL SHOWCASE — the product, instead of photos */}
      <section className="grid grid-cols-1 gap-4 py-10 md:grid-cols-12">
        <div className="group rounded-sm border border-line bg-surface p-7 transition duration-700 ease-[var(--ease-swiss)] hover:scale-[1.01] md:col-span-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-mute">Option A</div>
              <div className="mt-1 font-display text-5xl font-bold tracking-[-0.04em]">Goa</div>
              <div className="mt-2 text-sm text-mute">~₹18,000 · 12–15 Oct · Beach + Entertainment</div>
            </div>
            <div className="text-right">
              <div className="font-display text-5xl font-bold tracking-[-0.04em]">4/5</div>
              <div className="text-xs font-bold uppercase tracking-widest text-mute">group fit</div>
            </div>
          </div>
          <ul className="mt-6 divide-y divide-line text-sm">
            {PREVIEW.map((p) => (
              <li key={p.name} className="flex items-center justify-between py-2.5">
                <span className="font-bold">{p.name}</span>
                <FitBadge fit={p.fit} />
              </li>
            ))}
          </ul>
        </div>

        <div className="group relative flex min-h-[420px] flex-col items-center justify-center overflow-hidden rounded-full bg-accent px-6 text-center text-surface md:col-span-4">
          <div className="font-display text-7xl font-bold tracking-[-0.05em] transition duration-700 ease-[var(--ease-swiss)] group-hover:scale-105">5/5</div>
          <div className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-sage">after “What if?”</div>
          <div className="absolute inset-x-8 bottom-16 rounded-full border border-paper/30 py-2 text-xs opacity-0 transition duration-500 group-hover:opacity-100">
            Budget +₹5k → Aisha fits
          </div>
        </div>

        <div className="group flex aspect-square flex-col items-center justify-center rounded-full border border-charcoal/15 bg-sage text-center transition duration-700 ease-[var(--ease-swiss)] hover:bg-surface md:col-span-5">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-mute">The unique bit</div>
          <div className="mt-3 font-display text-6xl font-bold tracking-[-0.05em] transition duration-700 group-hover:scale-105">What <Accent>if?</Accent></div>
          <p className="mt-3 max-w-[16rem] text-sm text-mute">Test one change. Nobody&apos;s real answers move.</p>
        </div>

        <div className="rounded-sm border border-line bg-surface p-7 md:col-span-7">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-mute">Before → After</div>
          <div className="mt-6 grid grid-cols-2 gap-6">
            {[
              ["Before", [["Goa", "3/5"], ["Jaipur", "5/5"]]],
              ["After", [["Goa", "5/5"], ["Jaipur", "5/5"], ["Pondicherry", "new"]]],
            ].map(([label, rows]) => (
              <div key={label as string}>
                <div className="border-b border-charcoal pb-2 font-display text-2xl font-bold">{label as string}</div>
                <ul className="mt-3 space-y-2 text-sm">
                  {(rows as string[][]).map(([d, f]) => (
                    <li key={d} className="flex justify-between">
                      <span>{d}</span>
                      <span className={f === "new" ? "rounded-full bg-accent px-2 text-xs leading-5 text-surface" : "font-bold"}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-mute">“Increasing the budget removed Aisha&apos;s budget conflict, making Goa suitable for all five.”</p>
        </div>
      </section>

      {/* SERVICE CARDS */}
      <section className="grid gap-4 py-16 sm:grid-cols-3">
        {SERVICES.map((s) => (
          <Link key={s.n} href={s.href} className="group rounded-sm border border-line p-7 transition-colors duration-300 hover:bg-surface">
            <div className="grid h-16 w-16 place-items-center border border-charcoal transition-transform duration-500 group-hover:rotate-12 group-hover:border-accent">
              <span className={`block h-6 w-6 bg-accent ${s.shape}`} />
            </div>
            <div className="mt-8 text-xs font-bold tracking-widest text-mute">{s.n}</div>
            <h3 className="mt-1 text-2xl font-bold">{s.title}</h3>
            <p className="mt-2 text-sm font-normal leading-relaxed text-mute">{s.text}</p>
            <div className="mt-6 text-xs font-bold uppercase tracking-widest">
              {s.cta} <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
