"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { OptionCard } from "@/components/OptionCard";
import { Button, Card, ErrorNote, PageTitle, Spinner } from "@/components/ui";
import { api, getIdentity, useTrip, type Identity } from "@/lib/client";

export default function DecidePage() {
  const { id } = useParams<{ id: string }>();
  const { trip, loading, error, reload } = useTrip(id, 5000);
  // Read on first client render; the page shows a spinner until the trip loads, so SSR markup still matches.
  const [identity] = useState<Identity | null>(() => (typeof window === "undefined" ? null : getIdentity(id)));
  const [saving, setSaving] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);


  if (loading) return <div className="grid min-h-[50vh] place-items-center"><Spinner className="h-6 w-6 text-ink" /></div>;
  if (error || !trip) return <Card>{error ?? "Trip not found."}</Card>;
  if (!trip.recommendations) {
    return (
      <Card className="mx-auto max-w-md text-center">
        <p className="font-bold">No trip options yet.</p>
        <Link href={`/trip/${id}`} className="mt-4 inline-block text-sm font-bold text-ink">← Back to group status</Link>
      </Card>
    );
  }

  const options = trip.recommendations.options;
  const total = trip.participants.filter((p) => p.submitted).length;
  const me = identity ? trip.participants.find((p) => p.id === identity.participantId) : undefined;
  const undecided = trip.participants.filter((p) => !p.chosen_option);

  async function choose(optionId: string | null) {
    if (!me) return;
    setSaveError(null);
    setSaving(optionId ?? "clear");
    try {
      await api(`/api/trips/${id}/choose`, { participantId: me.id, optionId });
      await reload();
    } catch (e) {
      setSaveError((e as Error).message);
    } finally {
      setSaving(null);
    }
  }

  return (
    <div>
      <Link href={`/trip/${id}/results`} className="text-sm text-mute hover:text-ink">← Back to options</Link>
      <div className="mt-3">
        <PageTitle
          title="Ready to decide?"
          subtitle="Compare the options side by side and say which one you prefer. This does not book anything — it just shows the group where everyone stands."
        />
      </div>

      {!me && (
        <div className="mb-6 border-l-2 border-sand bg-sand/15 p-4 text-sm">
          To choose an option, first <Link href={`/trip/${id}`} className="font-bold underline">open the trip and enter your name</Link> on this device.
        </div>
      )}
      <ErrorNote message={saveError} />

      <div className={`mt-2 grid gap-6 ${options.length === 3 ? "lg:grid-cols-3" : "md:grid-cols-2"}`}>
        {options.map((o, i) => {
          const choosers = trip.participants.filter((p) => p.chosen_option === o.id);
          const mine = me?.chosen_option === o.id;
          return (
            <OptionCard
              key={o.id}
              option={o}
              letter={String.fromCharCode(65 + i)}
              total={total}
              badge={mine ? <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] text-surface">Your pick</span> : null}
              footer={
                <div className="space-y-3">
                  <div className="text-sm text-mute">
                    {choosers.length ? (
                      <>Preferred by <b className="text-ink">{choosers.map((c) => c.name).join(", ")}</b></>
                    ) : (
                      "No one has picked this yet"
                    )}
                  </div>
                  {me &&
                    (mine ? (
                      <Button variant="secondary" className="w-full" loading={saving === "clear"} onClick={() => choose(null)}>
                        ✓ Chosen — undo
                      </Button>
                    ) : (
                      <Button className="w-full" loading={saving === o.id} onClick={() => choose(o.id)}>
                        Choose this option
                      </Button>
                    ))}
                </div>
              }
            />
          );
        })}
      </div>

      <Card className="mt-8">
        <div className="text-sm">
          {undecided.length === 0 ? (
            <span>Everyone has shared their pick. Talk it through and make the call together.</span>
          ) : (
            <span>
              Still to pick: <b>{undecided.map((p) => p.name).join(", ")}</b>
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}
