import { Card, FitBadge, fitCount } from "./ui";
import type { TripOption } from "@/lib/types";

export function OptionCard({
  option,
  letter,
  total,
  compact,
  badge,
  footer,
}: {
  option: TripOption;
  letter: string;
  total: number;
  compact?: boolean;
  badge?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  const good = fitCount(option);
  const allGood = good === total;

  return (
    <Card className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
            Option {letter} {badge}
          </div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">{option.destination}</h2>
        </div>
        <div className={`shrink-0 rounded-2xl px-3 py-2 text-center ${allGood ? "bg-emerald-600 text-white" : "bg-emerald-50 text-emerald-800"}`}>
          <div className="text-lg font-semibold leading-tight">{good}/{total}</div>
          <div className="text-[10px] uppercase tracking-wide">group fit</div>
        </div>
      </div>

      <dl className={`mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3 ${compact ? "lg:grid-cols-1" : ""}`}>
        <Fact label="Estimated budget" value={option.estimated_budget} />
        <Fact label="Dates" value={option.suggested_dates} />
        <Fact label="Type" value={option.destination_type} />
      </dl>

      <div className="mt-5 overflow-hidden rounded-xl border border-stone-200">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-left text-xs text-stone-500">
            <tr>
              <th className="px-3 py-2 font-medium">Person</th>
              <th className="px-3 py-2 font-medium">Fit</th>
              {!compact && <th className="hidden px-3 py-2 font-medium sm:table-cell">Why</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {option.participant_fit.map((p) => (
              <tr key={p.name}>
                <td className="px-3 py-2 font-medium">{p.name}</td>
                <td className="px-3 py-2"><FitBadge fit={p.fit} /></td>
                {!compact && <td className="hidden px-3 py-2 text-stone-600 sm:table-cell">{p.reason}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <div>
          <div className="font-medium text-emerald-800">Why it works</div>
          <p className="mt-0.5 text-stone-700">{option.why_it_works}</p>
        </div>
        <div className="rounded-xl bg-amber-50 p-3">
          <div className="font-medium text-amber-900">Main conflict</div>
          <p className="mt-0.5 text-amber-900/80">{option.main_conflict}</p>
        </div>
      </div>

      {footer && <div className="mt-auto pt-5">{footer}</div>}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-stone-50 px-3 py-2">
      <dt className="text-xs text-stone-500">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
