import type { ButtonHTMLAttributes, ReactNode } from "react";
import { FIT_LABEL } from "@/lib/constants";
import type { Fit, TripOption } from "@/lib/types";

type Variant = "primary" | "secondary" | "ghost";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/20",
  secondary: "bg-white text-stone-900 ring-1 ring-stone-300 hover:bg-stone-50",
  ghost: "text-stone-600 hover:bg-stone-100",
};

export function Button({
  variant = "primary",
  className = "",
  loading,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; loading?: boolean }) {
  return (
    <button
      {...props}
      disabled={props.disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${VARIANTS[variant]} ${className}`}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-stone-200 bg-white p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent ${className}`}
      aria-hidden
    />
  );
}

export function FitBadge({ fit }: { fit: Fit }) {
  const f = FIT_LABEL[fit] ?? FIT_LABEL.partial;
  return (
    <span className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${f.className}`}>
      {f.emoji} {f.label.replace(" Fit", "")}
    </span>
  );
}

export function fitCount(option: TripOption) {
  return option.participant_fit.filter((p) => p.fit === "good").length;
}

export function Label({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-2">
      <div className="text-sm font-medium text-stone-900">{children}</div>
      {hint && <div className="text-xs text-stone-500">{hint}</div>}
    </div>
  );
}

export const inputClass =
  "w-full rounded-xl border border-stone-300 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

export function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{message}</p>;
}

export function PageTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: ReactNode }) {
  return (
    <div className="mb-8">
      {eyebrow && <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">{eyebrow}</div>}
      <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-2 text-stone-600">{subtitle}</p>}
    </div>
  );
}
