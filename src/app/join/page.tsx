"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Card, ErrorNote, inputClass, Label, PageTitle } from "@/components/ui";

export default function JoinPage() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    // Accept either a full link (…/trip/abc123) or just the code.
    const match = value.trim().match(/trip\/([a-z0-9]+)/i);
    const code = (match ? match[1] : value.trim()).toLowerCase();
    if (!/^[a-z0-9]{4,20}$/.test(code)) {
      setError("That doesn't look like a TripSync link or code.");
      return;
    }
    router.push(`/trip/${code}`);
  }

  return (
    <div className="mx-auto max-w-md">
      <PageTitle eyebrow="Join" title="Join a trip" subtitle="Paste the link your coordinator shared." />
      <Card>
        <form onSubmit={handleJoin} className="space-y-4">
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
