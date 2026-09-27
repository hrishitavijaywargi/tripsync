"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button, Card, ErrorNote, inputClass, Label, PageTitle } from "@/components/ui";
import { api, saveIdentity } from "@/lib/client";
import { GROUP_TYPES, PURPOSES } from "@/lib/constants";
import type { GroupType, TripPurpose } from "@/lib/types";

// Suspense is required around useSearchParams on a statically rendered page.
export default function CreateTripPage() {
  return (
    <Suspense>
      <CreateTripForm />
    </Suspense>
  );
}

function CreateTripForm() {
  // Optional prefill from the landing page quick-start panel (?name=…&people=…)
  const params = useSearchParams();
  const [tripName, setTripName] = useState(params.get("name") ?? "");
  const [coordinatorName, setCoordinatorName] = useState("");
  const [numberOfPeople, setNumberOfPeople] = useState(() => {
    const n = Number(params.get("people"));
    return Number.isInteger(n) && n >= 2 && n <= 30 ? n : 5;
  });
  const [groupType, setGroupType] = useState<GroupType | null>(null);
  const [tripPurpose, setTripPurpose] = useState<TripPurpose | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<{ id: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const canSubmit = tripName.trim() && coordinatorName.trim() && numberOfPeople >= 2 && groupType && tripPurpose;

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api<{ id: string; participantId: string }>("/api/trips", {
        tripName,
        coordinatorName,
        numberOfPeople,
        groupType,
        tripPurpose,
      });
      saveIdentity(res.id, { participantId: res.participantId, name: coordinatorName.trim(), isCoordinator: true });
      setCreated({ id: res.id });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  if (created) {
    const link = `${window.location.origin}/trip/${created.id}`;
    return (
      <div className="mx-auto max-w-xl">
        <Card className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-paper text-2xl">🎉</div>
          <h1 className="mt-4 text-2xl font-semibold">Your trip is ready!</h1>
          <p className="mt-2 text-mute">Share this link with everyone in your group.</p>
          <div className="mt-6 flex items-center gap-2 rounded-sm border border-line bg-paper p-2 pl-4 text-left">
            <code className="flex-1 truncate text-sm">{link}</code>
            <Button
              onClick={async () => {
                await navigator.clipboard.writeText(link);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
            >
              {copied ? "Copied ✓" : "Copy Link"}
            </Button>
          </div>
          <p className="mt-4 text-xs text-mute">Everyone uses this same link to submit their preferences.</p>
          <div className="mt-6 border-t border-line pt-6">
            <Link
              href={`/trip/${created.id}`}
              className="inline-flex inline-flex items-center justify-center border border-ink bg-ink px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors duration-500 hover:border-accent hover:bg-accent"
            >
              Add my preferences →
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageTitle eyebrow="New trip" title="Plan a trip" subtitle="Set up the basics. Your group adds their preferences next." />
      <form onSubmit={handleCreate} className="space-y-6">
        <Card className="space-y-5">
          <div>
            <Label>Trip name</Label>
            <input className={inputClass} placeholder="Goa 2026" value={tripName} onChange={(e) => setTripName(e.target.value)} maxLength={80} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label>Coordinator name</Label>
              <input className={inputClass} placeholder="Riya" value={coordinatorName} onChange={(e) => setCoordinatorName(e.target.value)} maxLength={60} />
            </div>
            <div>
              <Label hint="Including you">Number of people</Label>
              <div className="flex items-center gap-2">
                <button type="button" className="h-10 w-10 rounded-sm border border-charcoal/20 text-lg hover:bg-paper" onClick={() => setNumberOfPeople((n) => Math.max(2, n - 1))}>−</button>
                <input
                  type="number"
                  min={2}
                  max={30}
                  className={`${inputClass} text-center`}
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(Math.min(30, Math.max(2, Number(e.target.value) || 2)))}
                />
                <button type="button" className="h-10 w-10 rounded-sm border border-charcoal/20 text-lg hover:bg-paper" onClick={() => setNumberOfPeople((n) => Math.min(30, n + 1))}>+</button>
              </div>
            </div>
          </div>
        </Card>

        <div>
          <h2 className="mb-3 font-bold">Who are you planning with?</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {GROUP_TYPES.map((g) => (
              <ChoiceCard key={g.value} selected={groupType === g.value} onClick={() => setGroupType(g.value)} emoji={g.emoji} title={g.label} hint={g.hint} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-bold">What&apos;s the purpose of the trip?</h2>
          <div className="grid grid-cols-2 gap-3">
            {PURPOSES.map((p) => (
              <ChoiceCard key={p.value} selected={tripPurpose === p.value} onClick={() => setTripPurpose(p.value)} emoji={p.emoji} title={p.label} />
            ))}
          </div>
        </div>

        <ErrorNote message={error} />
        <Button type="submit" disabled={!canSubmit} loading={loading} className="w-full py-3 text-base">
          Create trip
        </Button>
      </form>
    </div>
  );
}

function ChoiceCard(props: { selected: boolean; onClick: () => void; emoji: string; title: string; hint?: string }) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      aria-pressed={props.selected}
      className={`rounded-sm border-2 p-5 text-left transition ${
        props.selected ? "border-accent bg-sage" : "border-line bg-surface hover:border-charcoal"
      }`}
    >
      <div className="text-3xl">{props.emoji}</div>
      <div className="mt-3 font-bold">{props.title}</div>
      {props.hint && <div className="mt-0.5 text-sm text-mute">{props.hint}</div>}
    </button>
  );
}
