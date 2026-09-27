import { NextResponse } from "next/server";
import { getSupabase, getTripWithParticipants } from "@/lib/supabase";

// Records which option a participant prefers. Does not book anything or pick a winner.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { participantId, optionId } = await req.json();
    const trip = await getTripWithParticipants(id);
    if (!trip?.recommendations) return NextResponse.json({ error: "No options to choose from yet." }, { status: 400 });
    if (!trip.participants.some((p) => p.id === participantId)) {
      return NextResponse.json({ error: "Participant not found for this trip." }, { status: 404 });
    }
    if (optionId !== null && !trip.recommendations.options.some((o) => o.id === optionId)) {
      return NextResponse.json({ error: "Unknown option." }, { status: 400 });
    }
    const { error } = await getSupabase()
      .from("participants")
      .update({ chosen_option: optionId, updated_at: new Date().toISOString() })
      .eq("id", participantId);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not save your choice." }, { status: 500 });
  }
}
