"use client";

import { useState } from "react";
import { OptionCard } from "./OptionCard";
import { Button, Card, ErrorNote, fitCount, inputClass, Label } from "./ui";
import { api } from "@/lib/client";
import { BUDGETS } from "@/lib/constants";
import type { TripWithParticipants, WhatIfChange, WhatIfResult } from "@/lib/types";

type Kind = WhatIfChange["kind"];

const KINDS: { kind: Kind; emoji: string; title: string; question: string }[] = [
  { kind: "budget", emoji: "💰", title: "Budget", question: "What if our budget increases?" },
  { kind: "dates", emoji: "📅", title: "Dates", question: "What if we move the trip?" },
  { kind: "flights", emoji: "✈️", title: "Flights", question: "What if flights are allowed?" },
  { kind: "dealbreaker", emoji: "🚫", title: "Deal-breaker", question: "What if we remove this restriction?" },
];

export function WhatIfSimulator({ trip, onClose }: { trip: TripWithParticipants; onClose: () => void }) {
  const people = trip.participants.filter((p) => p.submitted && p.preferences);
  const withDealBreakers = people.filter((p) => p.preferences?.deal_breakers);
  const original = trip.recommendations!.options;
  const total = people.length;

  const [kind, setKind] = useState<Kind | null>(null);
  const [budgetWho, setBudgetWho] = useState("__all__");
  const [newBudget, setNewBudget] = useState(BUDGETS[3]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dbWho, setDbWho] = useState(withDealBreakers[0]?.name ?? "");
  const [newDb, setNewDb] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<WhatIfResult | null>(null);

  function buildChange(): WhatIfChange | null {
    switch (kind) {
      case "budget":
        return { kind, participant: budgetWho, newBudget };
      case "dates":
        return startDate && endDate && startDate <= endDate ? { kind, startDate, endDate } : null;
      case "flights":
        return { kind };
      case "dealbreaker":
        return dbWho ? { kind, participant: dbWho, newDealBreakers: newDb } : null;
      default:
        return null;
    }
  }

  async function run() {
    const change = buildChange();
    if (!change) return;
    setError(null);
    setLoading(true);
    try {
      setResult(await api<WhatIfResult>(`/api/trips/${trip.id}/whatif`, { change }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  function pickDealBreakerPerson(name: string) {
    setDbWho(name);
    setNewDb("");
  }

  return (
    <div className="rounded-sm border border-charcoal bg-surface p-4 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">🔄 What If?</h2>
          <p className="mt-1 text-sm text-mute">
            Change <b>one</b> thing and see what happens. This is a temporary scenario — nobody&apos;s saved preferences change.
          </p>
        </div>
        <Button variant="secondary" onClick={onClose}>Back to Original Plan</Button>
      </div>

      {!result && (
        <div className="mt-6 space-y-5">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {KINDS.map((k) => (
              <button
                key={k.kind}
                type="button"
                onClick={() => setKind(k.kind)}
                disabled={k.kind === "dealbreaker" && withDealBreakers.length === 0}
                aria-pressed={kind === k.kind}
                className={`rounded-sm border-2 p-4 text-left transition disabled:opacity-40 ${
                  kind === k.kind ? "border-accent bg-sage" : "border-line bg-surface hover:border-charcoal"
                }`}
              >
                <div className="text-2xl">{k.emoji}</div>
                <div className="mt-2 font-bold">{k.title}</div>
                <div className="text-xs text-mute">{k.question}</div>
              </button>
            ))}
          </div>

          {kind && (
            <Card className="space-y-4">
              {kind === "budget" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Whose budget?</Label>
                    <select className={inputClass} value={budgetWho} onChange={(e) => setBudgetWho(e.target.value)}>
                      <option value="__all__">Everyone</option>
                      {people.map((p) => (
                        <option key={p.id} value={p.name}>{p.name} (now {p.preferences!.budget})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>New budget</Label>
                    <select className={inputClass} value={newBudget} onChange={(e) => setNewBudget(e.target.value)}>
                      {BUDGETS.map((b) => <option key={b}>{b}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {kind === "dates" && (
                <div>
                  <Label hint={`Currently suggested: ${original.map((o) => `${o.destination} ${o.suggested_dates}`).join(" · ")}`}>
                    Move the trip to
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="date" className={inputClass} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    <input type="date" className={inputClass} min={startDate} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                  </div>
                </div>
              )}

              {kind === "flights" && (
                <p className="text-sm text-ink/80">
                  Flight preference: <b>No → Yes</b>. Any &quot;no flights&quot; restriction will be treated as removed for this scenario.
                </p>
              )}

              {kind === "dealbreaker" && (
                <div className="space-y-3">
                  <div>
                    <Label>Whose deal-breaker?</Label>
                    <select className={inputClass} value={dbWho} onChange={(e) => pickDealBreakerPerson(e.target.value)}>
                      {withDealBreakers.map((p) => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="rounded-sm bg-paper p-3 text-sm">
                    <span className="text-mute">Currently: </span>
                    &quot;{withDealBreakers.find((p) => p.name === dbWho)?.preferences?.deal_breakers}&quot;
                  </div>
                  <div>
                    <Label hint="Leave empty to remove the restriction completely, or edit it to relax it.">Change it to</Label>
                    <input className={inputClass} value={newDb} onChange={(e) => setNewDb(e.target.value)} placeholder="Removed" />
                  </div>
                </div>
              )}

              <ErrorNote message={error} />
              <Button onClick={run} loading={loading} disabled={!buildChange()}>
                {loading ? "Comparing scenarios…" : "Run scenario"}
              </Button>
            </Card>
          )}
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-5">
          <Card className="bg-surface">
            <div className="text-xs font-semibold uppercase tracking-wider text-mute">The change</div>
            <p className="mt-1 text-sm">{result.change_description}</p>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <div className="text-xs font-semibold uppercase tracking-wider text-mute">Before</div>
              <ul className="mt-3 space-y-2">
                {original.map((o) => (
                  <li key={o.id} className="flex justify-between text-sm">
                    <span className="font-bold">{o.destination}</span>
                    <span>{fitCount(o)}/{total} fit</span>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="border-charcoal">
              <div className="text-xs font-semibold uppercase tracking-wider text-ink">After</div>
              <ul className="mt-3 space-y-2">
                {result.options.map((o) => {
                  const before = original.find((x) => x.id === o.id || x.destination === o.destination);
                  return (
                    <li key={o.id + o.destination} className="flex justify-between gap-2 text-sm">
                      <span className="font-bold">{o.destination}</span>
                      <span>
                        {!before ? (
                          <span className="mr-2 rounded-full bg-accent px-2 py-0.5 text-xs text-ink">New option</span>
                        ) : (
                          <Delta from={fitCount(before)} to={fitCount(o)} />
                        )}
                        {fitCount(o)}/{total} fit
                      </span>
                    </li>
                  );
                })}
                {result.options_no_longer_suitable.map((o) => (
                  <li key={o.destination} className="flex justify-between text-sm text-soft line-through">
                    <span>{o.destination}</span>
                    <span>not suitable</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card>
            <h3 className="font-semibold">What changed?</h3>
            <p className="mt-1 text-ink/80">{result.what_changed}</p>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <div>
                <div className="text-sm font-bold text-ink">New options unlocked</div>
                {result.new_options_unlocked.length ? (
                  <ul className="mt-1 list-inside list-disc text-sm text-ink/80">
                    {result.new_options_unlocked.map((d) => <li key={d}>{d}</li>)}
                  </ul>
                ) : (
                  <p className="mt-1 text-sm text-mute">None</p>
                )}
              </div>
              <div>
                <div className="text-sm font-bold text-ink">Options no longer suitable</div>
                {result.options_no_longer_suitable.length ? (
                  <ul className="mt-1 space-y-1 text-sm text-ink/80">
                    {result.options_no_longer_suitable.map((o) => (
                      <li key={o.destination}><b>{o.destination}</b> — {o.reason}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-sm text-mute">None</p>
                )}
              </div>
              <div>
                <div className="text-sm font-bold">People affected</div>
                <ul className="mt-1 space-y-1 text-sm text-ink/80">
                  {result.people_affected.map((p) => (
                    <li key={p.name}><b>{p.name}:</b> {p.change}</li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <details className="group">
            <summary className="cursor-pointer text-sm font-bold text-ink">See full scenario options</summary>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {result.options.map((o, i) => (
                <OptionCard key={o.id + i} option={o} letter={String.fromCharCode(65 + i)} total={total} compact />
              ))}
            </div>
          </details>

          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => setResult(null)}>Try another change</Button>
            <Button onClick={onClose}>Back to Original Plan</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function Delta({ from, to }: { from: number; to: number }) {
  if (from === to) return null;
  const up = to > from;
  return (
    <span className={`mr-2 rounded-full px-2 py-0.5 text-xs ${up ? "bg-ink text-white" : "border border-clay/40 bg-clay/10 text-clay"}`}>
      {up ? "▲" : "▼"} {from}→{to}
    </span>
  );
}
