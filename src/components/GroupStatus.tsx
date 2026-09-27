import { Card } from "./ui";
import type { TripWithParticipants } from "@/lib/types";

export function GroupStatus({ trip }: { trip: TripWithParticipants }) {
  const submitted = trip.participants.filter((p) => p.submitted).length;
  const notJoined = Math.max(0, trip.number_of_people - trip.participants.length);
  const pct = Math.round((submitted / trip.number_of_people) * 100);

  return (
    <Card>
      <div className="flex items-baseline justify-between">
        <h2 className="font-semibold">Group status</h2>
        <span className="text-xs text-stone-500">updates live</span>
      </div>
      <p className="mt-1 text-sm text-stone-600">
        <b className="text-stone-900">{submitted} of {trip.number_of_people}</b> people have submitted
      </p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100">
        <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
      </div>
      <ul className="mt-4 space-y-2 text-sm">
        {trip.participants.map((p) => (
          <li key={p.id} className="flex items-center justify-between">
            <span>
              {p.name}
              {p.name === trip.coordinator_name && <span className="ml-1.5 text-xs text-stone-400">coordinator</span>}
            </span>
            <span title={p.submitted ? "Submitted" : "Joined, not submitted yet"}>{p.submitted ? "✅" : "⏳"}</span>
          </li>
        ))}
        {Array.from({ length: notJoined }).map((_, i) => (
          <li key={`empty-${i}`} className="flex items-center justify-between text-stone-400">
            <span>Not joined yet</span>
            <span>⏳</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
