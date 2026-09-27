import type { ButtonHTMLAttributes, ReactNode } from "react";
import { FIT_LABEL } from "@/lib/constants";
import type { Fit, TripOption } from "@/lib/types";

type Variant = "primary" | "secondary" | "ghost";

// Square, tracked-out buttons: black that warms to gold on hover (luxury editorial style).
const VARIANTS: Record<Variant, string> = {
  primary: "bg-ink text-white border border-ink hover:bg-accent hover:border-accent",
  secondary: "bg-transparent text-ink border border-ink/20 hover:border-accent hover:text-accent",
  ghost: "text-mute hover:text-ink",
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
      className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500 disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export const linkButton = {
  primary:
    "inline-flex items-center justify-center gap-2 border border-ink bg-ink px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors duration-500 hover:border-accent hover:bg-accent",
  secondary:
    "inline-flex items-center justify-center gap-2 border-b border-ink pb-1 text-xs font-bold uppercase tracking-widest transition-colors hover:border-accent hover:text-accent",
};

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`border border-line bg-surface p-5 sm:p-8 ${className}`}>{children}</div>;
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
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-bold ${f.className}`}>
      {f.emoji} {f.label.replace(" Fit", "")}
    </span>
  );
}

export function fitCount(option: TripOption) {
  return option.participant_fit.filter((p) => p.fit === "good").length;
}

export function Label({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-2.5">
      <div className="text-[10px] font-medium uppercase tracking-widest text-mute">{children}</div>
      {hint && <div className="mt-0.5 text-xs text-mute">{hint}</div>}
    </div>
  );
}

export const inputClass =
  "w-full border-0 border-b border-ink/20 bg-transparent px-1 py-3 text-sm outline-none transition-colors placeholder:text-soft focus:border-accent";

export function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="border-l-2 border-clay bg-surface px-4 py-3 text-sm text-clay">{message}</p>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="mb-3 text-[10px] font-medium uppercase tracking-[0.4em] text-mute">{children}</div>;
}

export function PageTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: ReactNode; subtitle?: ReactNode }) {
  return (
    <div className="mb-10">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className="text-5xl leading-[0.95] tracking-tighter sm:text-7xl">{title}</h1>
      {subtitle && <p className="mt-4 max-w-2xl text-mute">{subtitle}</p>}
    </div>
  );
}

/** Single gold italic keyword inside a serif headline. */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="font-serif italic text-accent">{children}</span>;
}

