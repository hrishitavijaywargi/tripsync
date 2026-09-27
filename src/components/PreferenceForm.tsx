"use client";

import { useState } from "react";
import { Button, Card, ErrorNote, inputClass, Label } from "./ui";
import { api } from "@/lib/client";
import { BUDGETS, DESTINATION_TYPES } from "@/lib/constants";
import type { Participant } from "@/lib/types";

export function PreferenceForm({
  tripId,
  participant,
  onSaved,
  onCancel,
}: {
  tripId: string;
  participant: Participant;
  onSaved: () => void;
  onCancel?: () => void;
}) {
  const prefs = participant.preferences;
  const [budget, setBudget] = useState(prefs?.budget ?? "");
  const [startDate, setStartDate] = useState(prefs?.start_date ?? "");
  const [endDate, setEndDate] = useState(prefs?.end_date ?? "");
  const [types, setTypes] = useState<string[]>(prefs?.destination_types ?? []);
  const [mustHaves, setMustHaves] = useState(prefs?.must_haves ?? "");
  const [dealBreakers, setDealBreakers] = useState(prefs?.deal_breakers ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const valid = budget && startDate && endDate && startDate <= endDate && types.length > 0;

  function toggle(t: string) {
    setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api(`/api/trips/${tripId}/preferences`, {
        participantId: participant.id,
        budget,
        startDate,
        endDate,
        destinationTypes: types,
        mustHaves,
        dealBreakers,
      });
      onSaved();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">{participant.name}, what works for you?</h2>
      <p className="mt-1 text-sm text-stone-600">Be honest — the AI balances everyone, so your deal-breakers are respected.</p>

      <form onSubmit={submit} className="mt-6 space-y-6">
        <div>
          <Label hint="Per person, including travel and stay">Budget</Label>
          <div className="flex flex-wrap gap-2">
            {BUDGETS.map((b) => (
              <Chip key={b} selected={budget === b} onClick={() => setBudget(b)}>{b}</Chip>
            ))}
          </div>
        </div>

        <div>
          <Label hint="The window when you're free to travel">Available dates</Label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="mb-1 text-xs text-stone-500">Start date</div>
              <input type="date" className={inputClass} min={today} value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <div className="mb-1 text-xs text-stone-500">End date</div>
              <input type="date" className={inputClass} min={startDate || today} value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
          {startDate && endDate && startDate > endDate && (
            <p className="mt-1 text-xs text-rose-600">End date must be after the start date.</p>
          )}
        </div>

        <div>
          <Label hint="Pick all that you'd enjoy">Destination type</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {DESTINATION_TYPES.map((d) => (
              <Chip key={d.value} selected={types.includes(d.value)} onClick={() => toggle(d.value)} block>
                <span className="mr-1">{d.emoji}</span>{d.value}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <Label hint='e.g. "Good nightlife", "Pool at the hotel"'>Must-haves</Label>
          <textarea className={`${inputClass} min-h-20`} value={mustHaves} onChange={(e) => setMustHaves(e.target.value)} maxLength={500} placeholder="Good nightlife" />
        </div>

        <div>
          <Label hint='e.g. "No flights", "No hostels", "Maximum 4 days"'>Deal-breakers</Label>
          <textarea className={`${inputClass} min-h-20`} value={dealBreakers} onChange={(e) => setDealBreakers(e.target.value)} maxLength={500} placeholder="No flights" />
        </div>

        <ErrorNote message={error} />
        <div className="flex gap-2">
          <Button type="submit" disabled={!valid} loading={loading}>Submit Preferences</Button>
          {onCancel && <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>}
        </div>
      </form>
    </Card>
  );
}

function Chip({ selected, onClick, children, block }: { selected: boolean; onClick: () => void; children: React.ReactNode; block?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-full border px-4 py-2 text-sm transition ${block ? "w-full" : ""} ${
        selected ? "border-emerald-500 bg-emerald-50 font-medium text-emerald-800" : "border-stone-300 bg-white hover:border-stone-400"
      }`}
    >
      {children}
    </button>
  );
}
