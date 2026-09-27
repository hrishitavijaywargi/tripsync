import Link from "next/link";
import { FitBadge } from "@/components/ui";

const STEPS = [
  { n: "1", title: "Create a trip", text: "Name it, set the group size and trip type." },
  { n: "2", title: "Share one link", text: "Everyone adds budget, dates, must-haves and deal-breakers." },
  { n: "3", title: "Compare 2–3 options", text: "AI balances the whole group, not just the majority." },
  { n: "4", title: "Ask “What if?”", text: "Test one change and see who it helps, without editing anyone's answers." },
  { n: "5", title: "Decide together", text: "Everyone picks an option. TripSync never picks for you." },
];

const PREVIEW = [
  { name: "Riya", fit: "good" as const },
  { name: "Siddharth", fit: "good" as const },
  { name: "Karan", fit: "partial" as const },
  { name: "Aisha", fit: "good" as const },
  { name: "Preethi", fit: "good" as const },
];

export default function Home() {
  return (
    <div className="space-y-20">
      <section className="grid items-center gap-10 pt-4 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
            Group decisions, not group chats
          </div>
          <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-stone-900 sm:text-5xl">
            Stop planning your trip in <span className="text-emerald-600">1,200</span> WhatsApp messages.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-stone-600">
            Collect everyone&apos;s preferences. Find what works for everyone. See what changes. Make one decision.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/create"
              className="rounded-full bg-emerald-600 px-6 py-3 font-medium text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700"
            >
              Plan a Trip
            </Link>
            <Link
              href="/join"
              className="rounded-full bg-white px-6 py-3 font-medium text-stone-900 ring-1 ring-stone-300 hover:bg-stone-50"
            >
              Join a Trip
            </Link>
          </div>
        </div>

        {/* Product preview: what the group sees at the end */}
        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-200/60">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-stone-500">Option A</div>
              <div className="mt-1 text-2xl font-semibold">Goa</div>
              <div className="mt-1 text-sm text-stone-500">~₹18,000 · 12–15 Oct · Beach + Entertainment</div>
            </div>
            <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-center">
              <div className="text-lg font-semibold text-emerald-700">4/5</div>
              <div className="text-[10px] uppercase tracking-wide text-emerald-700">good fit</div>
            </div>
          </div>
          <ul className="mt-5 divide-y divide-stone-100 text-sm">
            {PREVIEW.map((p) => (
              <li key={p.name} className="flex items-center justify-between py-2">
                <span>{p.name}</span>
                <FitBadge fit={p.fit} />
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
            <b>Main conflict:</b> Karan wants a quieter trip than the rest of the group.
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-stone-500">How it works</h2>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s) => (
            <li key={s.n} className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="grid h-8 w-8 place-items-center rounded-full bg-stone-900 text-sm font-semibold text-white">
                {s.n}
              </div>
              <div className="mt-4 font-medium">{s.title}</div>
              <p className="mt-1 text-sm text-stone-600">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
