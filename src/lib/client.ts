"use client";

import { useCallback, useEffect, useState } from "react";
import type { TripWithParticipants } from "./types";

// Remembers who you are on this device for a given trip (there is no login).
export interface Identity {
  participantId: string;
  name: string;
  isCoordinator: boolean;
}

const key = (tripId: string) => `tripsync:${tripId}`;

export function getIdentity(tripId: string): Identity | null {
  try {
    const raw = localStorage.getItem(key(tripId));
    return raw ? (JSON.parse(raw) as Identity) : null;
  } catch {
    return null;
  }
}

export function saveIdentity(tripId: string, identity: Identity) {
  try {
    localStorage.setItem(key(tripId), JSON.stringify(identity));
  } catch {
    // Storage can be unavailable (private mode) — the app still works for this visit.
  }
}

export function clearIdentity(tripId: string) {
  try {
    localStorage.removeItem(key(tripId));
  } catch {}
}

export async function api<T>(url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data as T;
}

/** Loads a trip and optionally re-polls it so group status stays live. */
export function useTrip(tripId: string, pollMs = 0) {
  const [trip, setTrip] = useState<TripWithParticipants | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(
    () =>
      api<TripWithParticipants>(`/api/trips/${tripId}`)
        .then(
          (t) => {
            setTrip(t);
            setError(null);
          },
          (e: Error) => setError(e.message),
        )
        .finally(() => setLoading(false)),
    [tripId],
  );

  useEffect(() => {
    reload();
    if (!pollMs) return;
    const t = setInterval(reload, pollMs);
    return () => clearInterval(t);
  }, [reload, pollMs]);

  return { trip, error, loading, reload, setTrip };
}
