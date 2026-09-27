import { NextResponse } from "next/server";
import { getTripWithParticipants } from "@/lib/supabase";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const trip = await getTripWithParticipants(id);
    if (!trip) return NextResponse.json({ error: "Trip not found." }, { status: 404 });
    return NextResponse.json(trip);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Could not load the trip." }, { status: 500 });
  }
}
