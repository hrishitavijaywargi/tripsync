"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { OptionCard } from "@/components/OptionCard";
import { WhatIfSimulator } from "@/components/WhatIfSimulator";
import { Button, Card, PageTitle, Spinner } from "@/components/ui";
import { useTrip } from "@/lib/client";

export default function ResultsPage() {
  const { id } = useParams<{ id: string }>();
  const { trip, loading, error } = useTrip(id);
  const [whatIf, setWhatIf] = useState(false);

  if (loading) return <div className="grid min-h-[50vh] place-items-center"><Spinner className="h-6 w-6 text-emerald-600" /></div>;
  if (error || !trip) return <Card>{error ?? "Trip not found."}</Card>;
  if (!trip.recommendations) {
    return (
      <Card className="mx-auto max-w-md text-center">
        <p className="font-medium">No trip options yet.</p>
        <p className="mt-1 text-sm text-stone-600">Once everyone has submitted, the coordinator can generate them.</p>
        <Link href={`/trip/${id}`} className="mt-4 inline-block text-sm font-medium text-emerald-700">← Back to group status</Link>
      </Card>
    );
  }

  const recs = trip.recommendations;
  const total = trip.participants.filter((p) => p.submitted).length;

  return (
    <div>
      <Link href={`/trip/${id}`} className="text-sm text-stone-500 hover:text-stone-900">← {trip.trip_name}</Link>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <PageTitle title="Here's what works for your group." subtitle={recs.group_summary} />
      </div>

      <div className="mb-8 flex flex-wrap gap-3">
        {!whatIf && (
          <Button onClick={() => setWhatIf(true)} className="px-6 py-3 text-base">🔄 What If?</Button>
        )}
        <Link
          href={`/trip/${id}/decide`}
          className="rounded-full bg-stone-900 px-6 py-3 text-base font-medium text-white hover:bg-stone-700"
        >
          Ready to decide →
        </Link>
      </div>

      {whatIf && (
        <div className="mb-10">
          <WhatIfSimulator trip={trip} onClose={() => setWhatIf(false)} />
        </div>
      )}

      <div className={`grid gap-6 ${recs.options.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
        {recs.options.map((o, i) => (
          <OptionCard key={o.id} option={o} letter={String.fromCharCode(65 + i)} total={total} compact={recs.options.length === 3} />
        ))}
      </div>

      <p className="mt-8 text-center text-xs text-stone-400">
        Budgets are AI estimates, not live prices. TripSync doesn&apos;t book anything or decide for you.
      </p>
    </div>
  );
}
