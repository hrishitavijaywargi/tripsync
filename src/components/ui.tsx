import type { ButtonHTMLAttributes, ReactNode } from "react";
import { FIT_LABEL } from "@/lib/constants";
import type { Fit, TripOption } from "@/lib/types";

type Variant = "primary" | "secondary" | "ghost";

// Pill buttons that invert on hover (Swiss high-contrast style).
const VARIANTS: Record<Variant, string> = {
  primary: "bg-ink text-paper border border-ink hover:bg-paper hover:text-ink",
  secondary: "bg-transparent text-ink border border-charcoal hover:bg-charcoal hover:text-paper",
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
      className={`inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold tracking-wide transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${VARIANTS[variant]} ${className}`}
    >
      {loading && <Spinner />}
      {children}
    </button>
  );
}

export const linkButton = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-full border border-ink bg-ink px-6 py-3 text-sm font-bold tracking-wide text-paper transition-colors duration-200 hover:bg-paper hover:text-ink",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-full border border-charcoal px-6 py-3 text-sm font-bold tracking-wide transition-colors duration-200 hover:bg-charcoal hover:text-paper",
};

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-sm border border-line bg-white p-5 sm:p-7 ${className}`}>{children}</div>;
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
      <div className="text-xs font-bold uppercase tracking-widest text-ink">{children}</div>
      {hint && <div className="mt-0.5 text-xs text-mute">{hint}</div>}
    </div>
  );
}

export const inputClass =
  "w-full rounded-sm border border-charcoal/20 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-soft focus:border-ink";

export function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="border-l-2 border-rose-600 bg-white px-4 py-3 text-sm text-rose-700">{message}</p>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-mute">{children}</div>;
}

export function PageTitle({ eyebrow, title, subtitle }: { eyebrow?: string; title: ReactNode; subtitle?: ReactNode }) {
  return (
    <div className="mb-10">
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h1 className="text-4xl font-bold leading-[0.95] tracking-[-0.02em] sm:text-6xl">{title}</h1>
      {subtitle && <p className="mt-4 max-w-2xl text-mute">{subtitle}</p>}
    </div>
  );
}

/** Single serif-italic keyword inside a Clash Display headline. */
export function Accent({ children }: { children: ReactNode }) {
  return <span className="font-serif font-normal italic tracking-normal">{children}</span>;
}

/** The typographic echo stack: word + 4 fading grey copies behind it. */
export function Echo({ text, className = "" }: { text: string; className?: string }) {
  return (
    <span className={`echo isolate ${className}`}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="echo-layer" aria-hidden>{text}</span>
      ))}
      {text}
    </span>
  );
}
