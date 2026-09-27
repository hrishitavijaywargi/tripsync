"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Button, Card, ErrorNote, inputClass, Label, PageTitle } from "@/components/ui";

// Accept either a full link (…/trip/abc123) or just the code.
function parseTripCode(value: string): string | null {
  const match = value.trim().match(/trip\/([a-z0-9]+)/i);
  const code = (match ? match[1] : value.trim()).toLowerCase();
  return /^[a-z0-9]{4,20}$/.test(code) ? code : null;
}

// Suspense is required around useSearchParams on a statically rendered page.
export default function JoinPage() {
  return (
    <Suspense>
      <JoinForm />
    </Suspense>
  );
}

function JoinForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("code") ?? "");
  const [error, setError] = useState<string | null>(null);

  // Link pasted on the landing page (?code=…): go straight to the trip if it parses.
  useEffect(() => {
    const code = parseTripCode(params.get("code") ?? "");
    if (code) router.replace(`/trip/${code}`);
  }, [params, router]);

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const code = parseTripCode(value);
    if (!code) {
      setError("That doesn't look like a TripSync link or code.");
      return;
    }
    router.push(`/trip/${code}`);
  }

  return (
    <div className="mx-auto max-w-md">
      <PageTitle eyebrow="Join" title="Join a trip" subtitle="Paste the link your coordinator shared." />
      <Card>
        <form onSubmit={handleJoin} className="space-y-6">
          <div>
            <Label>Trip link or code</Label>
            <input className={inputClass} placeholder="https://…/trip/abc123" value={value} onChange={(e) => setValue(e.target.value)} />
          </div>
          <ErrorNote message={error} />
          <Button type="submit" className="w-full" disabled={!value.trim()}>
            Continue
          </Button>
        </form>
      </Card>
    </div>
  );
}
