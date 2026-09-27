import { NextResponse } from "next/server";
import { getSupabase, getTripWithParticipants } from "@/lib/supabase";

// Join a trip by name. If the name already exists, return that participant so people can edit.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { name } = await req.json();
    const cleanName = String(name ?? "").trim().slice(0, 60);
    if (!cleanName) return NextResponse.json({ error: "Please enter your name." }, { status: 400 });

    const trip = await getTripWithParticipants(id);
    if (!trip) return NextResponse.json({ error: "Trip not found." }, { status: 404 });

    const existing = trip.participants.find((p) => p.name.toLowerCase() === cleanName.toLowerCase());
    if (existing) return NextResponse.json({ participant: existing, existing: true });

    if (trip.participants.length >= trip.number_of_people) {
      return NextResponse.json(
        {
          error: `This trip is set up for ${trip.number_of_people} people and everyone has joined. Ask ${trip.coordinator_name} if you should be included.`,
        },
        { status: 409 },
      );
    }

    const { data, error } = await getSupabase()
      .from("participants")
      .insert({ trip_id: id, name: cleanName })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ participant: { ...data, preferences: null }, existing: false });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not join the trip." }, { status: 500 });
  }
}
