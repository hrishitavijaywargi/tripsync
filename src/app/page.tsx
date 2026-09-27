import Image from "next/image";
import Link from "next/link";
import { Accent, FitBadge, linkButton } from "@/components/ui";

const img = (id: string, w: number) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}`;

const HERO_FIT = [
  { name: "Riya", fit: "good" as const },
  { name: "Siddharth", fit: "good" as const },
  { name: "Karan", fit: "partial" as const },
];

// Sample options, labelled by trip type (the photos are illustrative, not specific destinations).
const SAMPLES = [
  { id: "photo-1506929562872-bb421503ef21", kind: "Beach + Relaxing", title: "Coastal escape", fit: "4/5", budget: "~₹18,000 pp", note: "Karan wanted quieter evenings", offset: false },
  { id: "photo-1464822759023-fed622ff2c3b", kind: "Mountains + Adventure", title: "Mountain retreat", fit: "3/5", budget: "~₹15,500 pp", note: "Two people ruled out long drives", offset: true },
  { id: "photo-1477587458883-47145ed94245", kind: "Cultural + City", title: "Heritage city", fit: "5/5", budget: "~₹14,000 pp", note: "Fits every budget and date", offset: false },
];

const STEPS = [
  ["Create", "Name the trip, set the group size and trip type."],
  ["Share", "One link. Everyone adds budget, dates and deal-breakers."],
  ["Compare", "2–3 balanced options, with each person's fit."],
  ["What if?", "Test one change without touching anyone's answers."],
  ["Decide", "Everyone picks. TripSync never picks for you."],
];

export default function Home() {
  return (
    <div className="relative">
      {/* HERO */}
      <section className="grid grid-cols-12 items-center gap-8">
        <div className="z-10 col-span-12 lg:col-span-5">
          <h1 className="mb-8 text-5xl leading-[0.95] tracking-tighter sm:text-6xl xl:text-7xl">
            Stop planning your trip in <Accent>1,200</Accent> WhatsApp messages.
          </h1>
          <p className="mb-8 max-w-md text-lg leading-relaxed opacity-70">
            Collect everyone&apos;s preferences. Find what works for everyone. See what changes. Make one decision.
          </p>
          <div className="mb-10 flex flex-wrap items-center gap-8">
            <Link href="/create" className={linkButton.primary}>Plan a Trip</Link>
            <Link href="/join" className={linkButton.secondary}>Join a Trip</Link>
          </div>

          {/* Quick-start panel → prefills the Plan a Trip form */}
          <form action="/create" className="glass-panel relative border border-ink/5 p-2 shadow-2xl">
            <div className="flex flex-col divide-y divide-ink/10 md:flex-row md:divide-x md:divide-y-0">
              <label className="flex-1 p-5">
                <span className="mb-2 block text-[10px] uppercase tracking-widest opacity-50">Trip name</span>
                <input name="name" placeholder="Goa 2026" className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-ink/40" />
              </label>
              <label className="p-5 md:w-36">
                <span className="mb-2 block text-[10px] uppercase tracking-widest opacity-50">People</span>
                <input name="people" type="number" min={2} max={30} defaultValue={5} className="w-full bg-transparent text-sm font-medium outline-none" />
              </label>
              <div className="p-2">
                <button
                  type="submit"
                  aria-label="Start planning"
                  className="flex aspect-square h-full w-full items-center justify-center bg-ink text-2xl text-white transition-colors hover:bg-accent md:w-20"
                >
                  →
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Imagery with a live-looking decision card */}
        <div className="relative col-span-12 h-[480px] sm:h-[600px] lg:col-span-7 lg:h-[700px]">
          <div className="absolute right-0 top-0 h-[90%] w-4/5 overflow-hidden">
            <Image
              src={img("photo-1533105079780-92b9be482077", 1600)}
              alt="Whitewashed coastline above a blue sea"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 80vw"
              className="scale-105 object-cover transition-transform duration-1000 hover:scale-100"
            />
          </div>
          <div className="absolute bottom-0 left-0 z-20 h-2/3 w-2/5 overflow-hidden border-8 border-paper shadow-2xl">
            <Image
              src={img("photo-1544644181-1484b3fdfc62", 900)}
              alt="Lakeside temple under a blue sky"
              fill
              sizes="(min-width: 1024px) 22vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className="glass-panel absolute right-4 top-8 z-30 w-60 border border-ink/5 p-5 shadow-2xl sm:right-8 sm:top-12">
            <div className="text-[10px] uppercase tracking-widest opacity-50">Option A · Beach</div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-display text-3xl">Goa</span>
              <span className="text-sm font-bold text-accent">4/5 fit</span>
            </div>
            <ul className="mt-3 space-y-1.5 text-xs">
              {HERO_FIT.map((p) => (
                <li key={p.name} className="flex items-center justify-between">
                  <span>{p.name}</span>
                  <FitBadge fit={p.fit} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* SAMPLE OPTIONS */}
      <section id="how" className="mt-32 scroll-mt-32 sm:mt-40">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="mb-4 text-4xl">Every option, <Accent>every person.</Accent></h2>
            <p className="max-w-lg opacity-60">
              Not a vote. Each option shows how well it fits each person — and the main conflict — so your group can decide.
            </p>
          </div>
          <Link href="/create" className={linkButton.secondary}>Plan your trip</Link>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {SAMPLES.map((s) => (
            <Link key={s.id} href="/create" className={`group ${s.offset ? "md:mt-12" : ""}`}>
              <div className="relative mb-6 aspect-[4/5] overflow-hidden">
                <Image
                  src={img(s.id, 1000)}
                  alt={s.title}
                  fill
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                />
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="mb-2 block text-[10px] uppercase tracking-widest opacity-50">{s.kind}</span>
                  <h3 className="text-2xl">{s.title}</h3>
                  <p className="mt-2 text-sm opacity-60">{s.note}</p>
                </div>
                <div className="shrink-0 text-right">
                  <div className="mb-1 text-xs font-bold text-accent">★ {s.fit} fit</div>
                  <span className="text-sm font-medium">{s.budget}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* METHOD */}
      <section className="mt-32 grid gap-10 border-t border-line pt-16 sm:grid-cols-5">
        {STEPS.map(([title, text], i) => (
          <div key={title}>
            <div className="font-display text-4xl italic text-accent">0{i + 1}</div>
            <h3 className="mt-3 text-xl">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed opacity-60">{text}</p>
          </div>
        ))}
      </section>

      {/* JOIN SIGN-OFF */}
      <section className="mt-40 border-t border-line pb-10 pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-8 text-4xl leading-tight sm:text-5xl">
            Already invited? <br />
            <span className="italic">Join your group&apos;s trip.</span>
          </h2>
          <form action="/join" className="relative mx-auto max-w-md">
            <input
              name="code"
              placeholder="Paste your trip link"
              className="w-full border-b border-ink/20 bg-transparent px-2 py-4 text-center text-lg transition-colors focus:border-accent focus:outline-none"
            />
            <button type="submit" className="mt-8 text-xs font-bold uppercase tracking-[0.3em] transition-colors hover:text-accent">
              Join trip
            </button>
          </form>
        </div>
      </section>

      {/* Scroll indicator */}
      <div className="pointer-events-none fixed right-12 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-8 xl:flex">
        <span className="origin-center rotate-90 whitespace-nowrap text-[10px] tracking-widest opacity-30">SCROLL TO EXPLORE</span>
        <div className="relative h-32 w-px bg-ink/10">
          <div className="absolute left-0 top-0 h-1/3 w-full bg-accent" />
        </div>
      </div>
    </div>
  );
}
