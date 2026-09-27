import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { TripWithParticipants } from "./types";

// Server-side only: used inside API routes so keys never reach the browser.
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY environment variables.");
  }
  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

/** Loads a trip with all participants and their preferences. */
export async function getTripWithParticipants(tripId: string): Promise<TripWithParticipants | null> {
  const supabase = getSupabase();
  const { data: trip, error } = await supabase.from("trips").select("*").eq("id", tripId).maybeSingle();
  if (error) throw error;
  if (!trip) return null;

  const { data: participants, error: pErr } = await supabase
    .from("participants")
    .select("*, preferences(*)")
    .eq("trip_id", tripId)
    .order("created_at", { ascending: true });
  if (pErr) throw pErr;

  return {
    ...trip,
    participants: (participants ?? []).map((p) => ({
      ...p,
      // preferences is a one-to-one relation (unique participant_id)
      preferences: Array.isArray(p.preferences) ? (p.preferences[0] ?? null) : (p.preferences ?? null),
    })),
  };
}

/** Short, URL-friendly, hard-to-guess trip id like "k3x9ab2q". */
export function generateTripId(): string {
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}
