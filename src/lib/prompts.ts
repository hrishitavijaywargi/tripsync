import type { GroupType, Recommendations, TripPurpose, TripWithParticipants, WhatIfChange } from "./types";

export const SYSTEM_PROMPT = `You are TripSync, an impartial group trip planning assistant for travellers in India.
You help a group reach ONE decision by showing them clear, balanced options. You never make the decision for them.

RULES (follow all of them strictly):
1. Never ignore a stated deal-breaker.
2. Do not recommend an option that directly violates a hard deal-breaker. If an option would violate someone's deal-breaker, either drop it or mark that person as a Poor Fit and name it in the main conflict.
3. Consider everyone's preferences — budget, dates, destination types, must-haves and deal-breakers.
4. Do not simply choose the majority preference. Look for options that balance the whole group.
5. Clearly identify conflicts between people.
6. Give 2–3 options rather than one answer.
7. Explain why each option fits.
8. Show individual fit for EVERY participant on EVERY option: "good", "partial" or "poor", with a one-line reason.
9. Treat travel prices as estimates, not guaranteed prices. Prefix budgets with "~" and give a per-person figure in ₹.
10. Do not invent unavailable information (no specific hotel names, flight numbers, live prices or availability).
11. Trip type and purpose should influence recommendations.
12. Individual preferences always override generic assumptions about a trip type.
13. In What-If mode, compare the original scenario with the temporary scenario.
14. Never permanently modify preferences during What-If mode — the change is hypothetical.
15. Never make the final decision for the group. Do not rank options as "the winner" or say "you should pick X".

The trip name is only a label — do not assume the destination from it. Offer genuinely different destinations (not three areas of the same place) so the group has a real choice.
Suggested dates must fall inside the window where the most people are available; say so if nobody's dates fully overlap.
Keep explanations short and plain (1–2 sentences). Always respond with valid JSON only.`;

const TRIP_TYPE_GUIDANCE: Record<string, string> = {
  "family-leisure":
    "Family leisure trip: consider comfortable schedules, family-friendly activities, suitable accommodation, ease of travel, different age groups and budget compatibility.",
  "friends-leisure":
    "Friends leisure trip: consider shared interests, activities, adventure, entertainment, nightlife only if someone asked for it, flexible schedules and budget compatibility.",
  business:
    "Business trip: consider convenient location, travel time, meeting requirements, work-friendly accommodation, Wi-Fi/work facilities, schedule efficiency and budget.",
};

export function tripTypeGuidance(groupType: GroupType, purpose: TripPurpose): string {
  if (purpose === "business" || groupType === "business") {
    const who = groupType === "business" ? "" : ` The travellers are ${groupType}, so keep that in mind too.`;
    return TRIP_TYPE_GUIDANCE.business + who;
  }
  return TRIP_TYPE_GUIDANCE[`${groupType}-leisure`];
}

type GroupProfile = {
  name: string;
  budget: string;
  available_from: string;
  available_to: string;
  destination_types: string[];
  must_haves: string;
  deal_breakers: string;
}[];

export function buildGroupProfile(trip: TripWithParticipants): GroupProfile {
  return trip.participants
    .filter((p) => p.submitted && p.preferences)
    .map((p) => ({
      name: p.name,
      budget: p.preferences!.budget,
      available_from: p.preferences!.start_date,
      available_to: p.preferences!.end_date,
      destination_types: p.preferences!.destination_types,
      must_haves: p.preferences!.must_haves || "None",
      deal_breakers: p.preferences!.deal_breakers || "None",
    }));
}

function tripHeader(trip: TripWithParticipants) {
  return `Trip: "${trip.trip_name}" (coordinator: ${trip.coordinator_name})
Group type: ${trip.group_type}. Purpose: ${trip.trip_purpose}.
Guidance: ${tripTypeGuidance(trip.group_type, trip.trip_purpose)}
Reminder: trip type is only context — each person's stated preferences and deal-breakers come first.`;
}

const OPTION_SHAPE = `{
      "id": "short-slug",
      "destination": "string",
      "estimated_budget": "~₹X per person",
      "suggested_dates": "e.g. 12–15 Oct 2026",
      "destination_type": "e.g. Beach + Entertainment",
      "why_it_works": "1–2 sentences",
      "main_conflict": "1–2 sentences naming the biggest issue and who it affects",
      "participant_fit": [{ "name": "exact participant name", "fit": "good|partial|poor", "reason": "one line" }]
    }`;

export function buildRecommendationPrompt(trip: TripWithParticipants): string {
  return `${tripHeader(trip)}

Participant preferences (JSON):
${JSON.stringify(buildGroupProfile(trip), null, 2)}

Today's date is ${new Date().toISOString().slice(0, 10)}.

Generate 2–3 trip options that balance the whole group. Return JSON exactly in this shape:
{
  "group_summary": "1–2 sentences on where the group agrees and the key conflicts",
  "options": [
    ${OPTION_SHAPE}
  ]
}`;
}

/** Applies a single hypothetical change to a copy of the group profile. Never touches the database. */
export function applyWhatIf(profile: GroupProfile, change: WhatIfChange): { scenario: GroupProfile; description: string } {
  const scenario = profile.map((p) => ({ ...p }));
  switch (change.kind) {
    case "budget": {
      const targets = change.participant === "__all__" ? scenario : scenario.filter((p) => p.name === change.participant);
      const before = targets.map((p) => `${p.name}: ${p.budget}`).join(", ");
      targets.forEach((p) => (p.budget = change.newBudget));
      const who = change.participant === "__all__" ? "everyone's" : `${change.participant}'s`;
      return { scenario, description: `What if ${who} budget changes to ${change.newBudget}? (was ${before})` };
    }
    case "dates":
      return {
        scenario,
        description: `What if the trip is fixed to ${change.startDate} → ${change.endDate}? Keep each person's own availability as stated and check who can make these dates.`,
      };
    case "flights":
      scenario.forEach((p) => {
        p.deal_breakers = p.deal_breakers.replace(/\b(no|avoid|don'?t want|without)\s+(any\s+)?(flights?|flying|planes?|air travel)\b[,.]?/gi, "").trim() || "None";
      });
      return { scenario, description: "What if flights are allowed? Treat any 'no flights' restriction as removed for everyone." };
    case "dealbreaker": {
      const target = scenario.find((p) => p.name === change.participant);
      const before = target?.deal_breakers ?? "None";
      if (target) target.deal_breakers = change.newDealBreakers.trim() || "None";
      return {
        scenario,
        description: `What if ${change.participant}'s deal-breakers change from "${before}" to "${change.newDealBreakers.trim() || "(removed)"}"?`,
      };
    }
  }
}

export function buildWhatIfPrompt(
  trip: TripWithParticipants,
  original: Recommendations,
  scenario: GroupProfile,
  description: string,
): string {
  return `WHAT-IF MODE. This is a temporary, hypothetical scenario. Do not treat it as anyone's real preference.

${tripHeader(trip)}

ORIGINAL participant preferences:
${JSON.stringify(buildGroupProfile(trip), null, 2)}

ORIGINAL options already shown to the group:
${JSON.stringify(original.options, null, 2)}

THE ONE CHANGE: ${description}

TEMPORARY participant preferences after the change:
${JSON.stringify(scenario, null, 2)}

Re-evaluate. Keep the original options (same "id" and "destination") and update their fit if it changes. You may add up to 2 new options if the change unlocks them. If an original option no longer works, leave it out of "options" and list it under "options_no_longer_suitable".
Return JSON exactly in this shape:
{
  "what_changed": "1–2 sentences explaining the effect of the change, naming people",
  "options": [
    ${OPTION_SHAPE.replace('"id": "short-slug",', '"id": "short-slug",\n      "status": "same|improved|worse|new",')}
  ],
  "options_no_longer_suitable": [{ "destination": "string", "reason": "one line" }],
  "new_options_unlocked": ["destination names that are new in this scenario"],
  "people_affected": [{ "name": "every participant", "change": "e.g. Budget conflict removed / No change" }]
}`;
}
