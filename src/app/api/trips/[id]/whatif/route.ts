import { NextResponse } from "next/server";
import { askGeminiJSON } from "@/lib/gemini";
import { applyWhatIf, buildGroupProfile, buildWhatIfPrompt, SYSTEM_PROMPT } from "@/lib/prompts";
import { getTripWithParticipants } from "@/lib/supabase";
import type { WhatIfChange, WhatIfResult } from "@/lib/types";

export const maxDuration = 60;

// Runs a temporary scenario. Nothing here writes to the database.
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const { change } = (await req.json()) as { change: WhatIfChange };
    if (!change || !["budget", "dates", "flights", "dealbreaker"].includes(change.kind)) {
      return NextResponse.json({ error: "Please choose one thing to change." }, { status: 400 });
    }

    const trip = await getTripWithParticipants(id);
    if (!trip) return NextResponse.json({ error: "Trip not found." }, { status: 404 });
    if (!trip.recommendations) {
      return NextResponse.json({ error: "Generate trip options first." }, { status: 400 });
    }

    const { scenario, description } = applyWhatIf(buildGroupProfile(trip), change);
    const result = await askGeminiJSON<Omit<WhatIfResult, "change_description">>(
      SYSTEM_PROMPT,
      buildWhatIfPrompt(trip, trip.recommendations, scenario, description),
    );

    const response: WhatIfResult = {
      change_description: description,
      what_changed: result.what_changed ?? "",
      options: result.options ?? [],
      options_no_longer_suitable: result.options_no_longer_suitable ?? [],
      new_options_unlocked: result.new_options_unlocked ?? [],
      people_affected: result.people_affected ?? [],
    };
    return NextResponse.json(response);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "The AI couldn't run this scenario. Please try again." }, { status: 500 });
  }
}
