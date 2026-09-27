import type { Fit, GroupType, TripPurpose } from "./types";

export const BUDGETS = [
  "Under ₹10,000",
  "₹10,000–₹15,000",
  "₹15,000–₹20,000",
  "₹20,000–₹30,000",
  "₹30,000+",
];

export const DESTINATION_TYPES = [
  { value: "Beach", emoji: "🏖️" },
  { value: "Mountains", emoji: "🏔️" },
  { value: "City", emoji: "🏙️" },
  { value: "Adventure", emoji: "🧗" },
  { value: "Relaxing", emoji: "🧘" },
  { value: "Cultural", emoji: "🏛️" },
];

export const GROUP_TYPES: { value: GroupType; emoji: string; label: string; hint: string }[] = [
  { value: "family", emoji: "👨‍👩‍👧‍👦", label: "Family", hint: "For family vacations." },
  { value: "friends", emoji: "👫", label: "Friends", hint: "For trips with friends." },
  { value: "business", emoji: "💼", label: "Business", hint: "For work/business travel." },
];

export const PURPOSES: { value: TripPurpose; emoji: string; label: string }[] = [
  { value: "leisure", emoji: "🌴", label: "Leisure" },
  { value: "business", emoji: "💼", label: "Business" },
];

export const FIT_LABEL: Record<Fit, { emoji: string; label: string; className: string }> = {
  good: { emoji: "🟢", label: "Good Fit", className: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
  partial: { emoji: "🟡", label: "Partial Fit", className: "bg-amber-50 text-amber-700 ring-amber-200" },
  poor: { emoji: "🔴", label: "Poor Fit", className: "bg-rose-50 text-rose-700 ring-rose-200" },
};
