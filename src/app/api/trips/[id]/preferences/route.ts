import { NextResponse } from "next/server";
import { BUDGETS, DESTINATION_TYPES } from "@/lib/constants";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { participantId, budget, startDate, endDate, mustHaves, dealBreakers } = body;
    const destinationTypes: string[] = Array.isArray(body.destinationTypes) ? body.destinationTypes : [];

    if (!BUDGETS.includes(budget)) return NextResponse.json({ error: "Please choose a budget." }, { status: 400 });
    if (!startDate || !endDate || startDate > endDate) {
      return NextResponse.json({ error: "Please choose a valid start and end date." }, { status: 400 });
    }
    const allowed = DESTINATION_TYPES.map((d) => d.value);
    if (destinationTypes.length === 0 || destinationTypes.some((d) => !allowed.includes(d))) {
      return NextResponse.json({ error: "Please pick at least one destination type." }, { status: 400 });
    }

    const supabase = getSupabase();
    const { data: participant } = await supabase
      .from("participants")
      .select("id")
      .eq("id", participantId)
      .eq("trip_id", id)
      .maybeSingle();
    if (!participant) return NextResponse.json({ error: "Participant not found for this trip." }, { status: 404 });

    const now = new Date().toISOString();
    const { error } = await supabase.from("preferences").upsert(
      {
        participant_id: participantId,
        budget,
        start_date: startDate,
        end_date: endDate,
        destination_types: destinationTypes,
        must_haves: String(mustHaves ?? "").trim().slice(0, 500),
        deal_breakers: String(dealBreakers ?? "").trim().slice(0, 500),
        updated_at: now,
      },
      { onConflict: "participant_id" },
    );
    if (error) throw error;

    const { error: uErr } = await supabase
      .from("participants")
      .update({ submitted: true, updated_at: now })
      .eq("id", participantId);
    if (uErr) throw uErr;

    // Preferences changed, so any earlier recommendations and choices are out of date.
    await supabase.from("trips").update({ recommendations: null }).eq("id", id);
    await supabase.from("participants").update({ chosen_option: null }).eq("trip_id", id);

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not save your preferences." }, { status: 500 });
  }
}
