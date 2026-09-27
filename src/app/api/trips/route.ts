import { NextResponse } from "next/server";
import { generateTripId, getSupabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const tripName = String(body.tripName ?? "").trim();
    const coordinatorName = String(body.coordinatorName ?? "").trim();
    const numberOfPeople = Number(body.numberOfPeople);
    const groupType = body.groupType;
    const tripPurpose = body.tripPurpose;

    if (!tripName || !coordinatorName) {
      return NextResponse.json({ error: "Trip name and coordinator name are required." }, { status: 400 });
    }
    if (!Number.isInteger(numberOfPeople) || numberOfPeople < 2 || numberOfPeople > 30) {
      return NextResponse.json({ error: "Number of people must be between 2 and 30." }, { status: 400 });
    }
    if (!["family", "friends", "business"].includes(groupType) || !["leisure", "business"].includes(tripPurpose)) {
      return NextResponse.json({ error: "Please choose who you're planning with and the trip purpose." }, { status: 400 });
    }

    const supabase = getSupabase();
    const id = generateTripId();
    const { error } = await supabase.from("trips").insert({
      id,
      trip_name: tripName,
      coordinator_name: coordinatorName,
      group_type: groupType,
      trip_purpose: tripPurpose,
      number_of_people: numberOfPeople,
    });
    if (error) throw error;

    // The coordinator is also a participant who fills in preferences.
    const { data: participant, error: pErr } = await supabase
      .from("participants")
      .insert({ trip_id: id, name: coordinatorName })
      .select()
      .single();
    if (pErr) throw pErr;

    return NextResponse.json({ id, participantId: participant.id });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not create the trip. Please try again." }, { status: 500 });
  }
}
