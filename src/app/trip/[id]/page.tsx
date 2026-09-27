"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { GroupStatus } from "@/components/GroupStatus";
import { PreferenceForm } from "@/components/PreferenceForm";
import { Button, Card, ErrorNote, inputClass, Label, Spinner } from "@/components/ui";
import { api, clearIdentity, getIdentity, saveIdentity, useTrip, type Identity } from "@/lib/client";
import { GROUP_TYPES, PURPOSES } from "@/lib/constants";
import type { Participant } from "@/lib/types";

export default function TripPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { trip, error, loading, reload } = useTrip(id, 5000);
  // Read on first client render; the page shows a spinner until the trip loads, so SSR markup still matches.
  const [identity, setIdentity] = useState<Identity | null>(() => (typeof window === "undefined" ? null : getIdentity(id)));
  const [editing, setEditing] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);


  if (loading) return <Centered><Spinner className="h-6 w-6 text-emerald-600" /></Centered>;
  if (error || !trip) {
    return (
      <Centered>
        <Card className="max-w-md text-center">
          <div className="text-3xl">🧭</div>
          <h1 className="mt-3 text-lg font-semibold">Trip not found</h1>
          <p className="mt-1 text-sm text-stone-600">{error ?? "Check the link and try again."}</p>
          <Link href="/join" className="mt-4 inline-block text-sm font-medium text-emerald-700">Try another link →</Link>
        </Card>
      </Centered>
    );
  }

  const me = identity ? trip.participants.find((p) => p.id === identity.participantId) : undefined;
  const group = GROUP_TYPES.find((g) => g.value === trip.group_type);
  const purpose = PURPOSES.find((p) => p.value === trip.trip_purpose);
  // No login: whoever is the coordinator-named participant on this device gets the coordinator controls.
  const isCoordinator = !!me && me.name.toLowerCase() === trip.coordinator_name.toLowerCase();

  async function generate() {
    setGenError(null);
    setGenerating(true);
    try {
      await api(`/api/trips/${id}/recommend`, {});
      router.push(`/trip/${id}/results`);
    } catch (e) {
      setGenError((e as Error).message);
      setGenerating(false);
    }
  }

  let main: React.ReactNode;
  if (!identity || !me) {
    main = (
      <JoinStep
        tripId={id}
        coordinator={trip.coordinator_name}
        onJoined={(p) => {
          const ident = { participantId: p.id, name: p.name, isCoordinator: p.name.toLowerCase() === trip.coordinator_name.toLowerCase() };
          saveIdentity(id, ident);
          setIdentity(ident);
          reload();
        }}
      />
    );
  } else if (!me.submitted || editing) {
    main = (
      <PreferenceForm
        tripId={id}
        participant={me}
        onSaved={() => {
          setEditing(false);
          reload();
        }}
        onCancel={me.submitted ? () => setEditing(false) : undefined}
      />
    );
  } else {
    main = (
      <Card className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-2xl">✅</div>
        <h2 className="mt-4 text-xl font-semibold">Your preferences are saved.</h2>
        <p className="mt-1 text-stone-600">
          {trip.participants.filter((p) => p.submitted).length >= trip.number_of_people
            ? "Everyone has submitted — see the panel for next steps."
            : "Waiting for the rest of the group."}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button variant="secondary" onClick={() => setEditing(true)}>Edit my preferences</Button>
          <Button
            variant="ghost"
            onClick={() => {
              clearIdentity(id);
              setIdentity(null);
            }}
          >
            Not {me.name}?
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="mb-2 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-stone-700">{group?.emoji} {group?.label}</span>
          <span className="rounded-full bg-stone-100 px-2.5 py-1 text-stone-700">{purpose?.emoji} {purpose?.label}</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">{trip.trip_name}</h1>
        <p className="mt-1 text-stone-600">Coordinated by {trip.coordinator_name}</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div>{main}</div>
        <aside className="space-y-4">
          <GroupStatus trip={trip} />
          <ReadyPanel
            tripId={id}
            allReady={trip.participants.filter((p) => p.submitted).length >= trip.number_of_people}
            hasResults={!!trip.recommendations}
            isCoordinator={isCoordinator}
            coordinator={trip.coordinator_name}
            generating={generating}
            onGenerate={generate}
          />
          <ErrorNote message={genError} />
        </aside>
      </div>
    </div>
  );
}

function ReadyPanel(props: {
  tripId: string;
  allReady: boolean;
  hasResults: boolean;
  isCoordinator: boolean;
  coordinator: string;
  generating: boolean;
  onGenerate: () => void;
}) {
  if (props.hasResults) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/50">
        <p className="font-medium">Trip options are ready.</p>
        <div className="mt-3 flex flex-col gap-2">
          <Link href={`/trip/${props.tripId}/results`} className="rounded-full bg-emerald-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-700">
            View options
          </Link>
          {props.isCoordinator && (
            <Button variant="secondary" loading={props.generating} onClick={props.onGenerate}>Regenerate options</Button>
          )}
        </div>
      </Card>
    );
  }
  if (!props.allReady) return null;
  return (
    <Card className="border-emerald-200 bg-emerald-50/50">
      <p className="font-medium">All preferences are ready.</p>
      {props.isCoordinator ? (
        <>
          <Button className="mt-3 w-full" loading={props.generating} onClick={props.onGenerate}>
            {props.generating ? "Comparing everyone's preferences…" : "Generate Trip Options"}
          </Button>
          {props.generating && <p className="mt-2 text-xs text-stone-500">This usually takes 10–30 seconds.</p>}
        </>
      ) : (
        <p className="mt-1 text-sm text-stone-600">Waiting for {props.coordinator} to generate trip options.</p>
      )}
    </Card>
  );
}

function JoinStep({ tripId, coordinator, onJoined }: { tripId: string; coordinator: string; onJoined: (p: Participant) => void }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api<{ participant: Participant }>(`/api/trips/${tripId}/participants`, { name });
      onJoined(res.participant);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold">Hi! What&apos;s your name?</h2>
      <p className="mt-1 text-sm text-stone-600">{coordinator} invited you to share your trip preferences.</p>
      <form onSubmit={submit} className="mt-5 space-y-4">
        <div>
          <Label hint="Already submitted? Enter the same name to edit.">Your name</Label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="Siddharth" maxLength={60} autoFocus />
        </div>
        <ErrorNote message={error} />
        <Button type="submit" disabled={!name.trim()} loading={loading}>Continue</Button>
      </form>
    </Card>
  );
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="grid min-h-[50vh] place-items-center">{children}</div>;
}
