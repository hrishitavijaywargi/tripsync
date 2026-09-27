export type GroupType = "family" | "friends" | "business";
export type TripPurpose = "leisure" | "business";
export type Fit = "good" | "partial" | "poor";

export interface Trip {
  id: string;
  trip_name: string;
  coordinator_name: string;
  group_type: GroupType;
  trip_purpose: TripPurpose;
  number_of_people: number;
  recommendations: Recommendations | null;
  created_at: string;
}

export interface Preference {
  id: string;
  participant_id: string;
  budget: string;
  start_date: string;
  end_date: string;
  destination_types: string[];
  must_haves: string | null;
  deal_breakers: string | null;
  updated_at: string;
}

export interface Participant {
  id: string;
  trip_id: string;
  name: string;
  submitted: boolean;
  chosen_option: string | null;
  created_at: string;
  updated_at: string;
  preferences: Preference | null;
}

export interface TripWithParticipants extends Trip {
  participants: Participant[];
}

export interface ParticipantFit {
  name: string;
  fit: Fit;
  reason: string;
}

export interface TripOption {
  id: string;
  destination: string;
  estimated_budget: string;
  suggested_dates: string;
  destination_type: string;
  why_it_works: string;
  main_conflict: string;
  participant_fit: ParticipantFit[];
}

export interface Recommendations {
  generated_at: string;
  group_summary: string;
  options: TripOption[];
}

export type WhatIfChange =
  | { kind: "budget"; participant: string; newBudget: string }
  | { kind: "dates"; startDate: string; endDate: string }
  | { kind: "flights" }
  | { kind: "dealbreaker"; participant: string; newDealBreakers: string };

export interface WhatIfResult {
  change_description: string;
  what_changed: string;
  options: (TripOption & { status: "same" | "improved" | "worse" | "new" })[];
  options_no_longer_suitable: { destination: string; reason: string }[];
  new_options_unlocked: string[];
  people_affected: { name: string; change: string }[];
}
