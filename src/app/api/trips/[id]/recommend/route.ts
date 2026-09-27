import { NextResponse } from "next/server";
import { askGeminiJSON } from "@/lib/gemini";
import { buildRecommendationPrompt, SYSTEM_PROMPT } from "@/lib/prompts";
import { getSupabase, getTripWithParticipants } from "@/lib/supabase";
import type { Recommendations } from "@/lib/types";

export const maxDuration = 60;

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const trip = await getTripWithParticipants(id);
    if (!trip) return NextResponse.json({ error: "Trip not found." }, { status: 404 });

    const submitted = trip.participants.filter((p) => p.submitted).length;
    if (submitted < trip.number_of_people) {
      return NextResponse.json(
        { error: `Waiting for everyone: ${submitted} of ${trip.number_of_people} have submitted.` },
        { status: 400 },
      );
    }

    const result = await askGeminiJSON<Omit<Recommendations, "generated_at">>(
      SYSTEM_PROMPT,
      buildRecommendationPrompt(trip),
    );
    if (!Array.isArray(result.options) || result.options.length === 0) throw new Error("No options returned");

    const recommendations: Recommendations = {
      generated_at: new Date().toISOString(),
      group_summary: result.group_summary ?? "",
      options: result.options.slice(0, 3).map((o, i) => ({ ...o, id: o.id || `option-${i + 1}` })),
    };

    const supabase = getSupabase();
    const { error } = await supabase.from("trips").update({ recommendations }).eq("id", id);
    if (error) throw error;
    await supabase.from("participants").update({ chosen_option: null }).eq("trip_id", id);

    return NextResponse.json(recommendations);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "The AI couldn't generate options right now. Please try again." }, { status: 500 });
  }
}
