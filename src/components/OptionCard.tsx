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
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-mute">
            Option {letter} {badge}
          </div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight">{option.destination}</h2>
        </div>
        <div className={`shrink-0 rounded-sm px-3 py-2 text-center ${allGood ? "bg-ink text-paper" : "border border-charcoal text-ink"}`}>
          <div className="text-lg font-semibold leading-tight">{good}/{total}</div>
          <div className="text-[10px] uppercase tracking-wide">group fit</div>
        </div>
      </div>

      <dl className={`mt-4 grid grid-cols-1 gap-2 text-sm sm:grid-cols-3 ${compact ? "lg:grid-cols-1" : ""}`}>
        <Fact label="Estimated budget" value={option.estimated_budget} />
        <Fact label="Dates" value={option.suggested_dates} />
        <Fact label="Type" value={option.destination_type} />
      </dl>

      <div className="mt-5 overflow-hidden rounded-sm border border-line">
        <table className="w-full text-sm">
          <thead className="bg-paper text-left text-xs text-mute">
            <tr>
              <th className="px-3 py-2 font-bold">Person</th>
              <th className="px-3 py-2 font-bold">Fit</th>
              {!compact && <th className="hidden px-3 py-2 font-bold sm:table-cell">Why</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {option.participant_fit.map((p) => (
              <tr key={p.name}>
                <td className="px-3 py-2 font-bold">{p.name}</td>
                <td className="px-3 py-2"><FitBadge fit={p.fit} /></td>
                {!compact && <td className="hidden px-3 py-2 text-mute sm:table-cell">{p.reason}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 space-y-3 text-sm">
        <div>
          <div className="font-bold text-ink">Why it works</div>
          <p className="mt-0.5 text-ink/80">{option.why_it_works}</p>
        </div>
        <div className="border-l-2 border-ink bg-paper p-3">
          <div className="font-bold text-ink">Main conflict</div>
          <p className="mt-0.5 text-mute">{option.main_conflict}</p>
        </div>
      </div>

      {footer && <div className="mt-auto pt-5">{footer}</div>}
    </Card>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-sm bg-paper px-3 py-2">
      <dt className="text-xs text-mute">{label}</dt>
      <dd className="font-bold">{value}</dd>
    </div>
  );
}
