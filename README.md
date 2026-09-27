# TripSync

AI-powered group trip planning. Everyone submits preferences through one link; Gemini compares them and
shows 2–3 balanced options with each person's fit, a **What-If simulator** to test one change, and a
decision view where the group picks — TripSync never decides for them.

**Flow:** Create trip → choose trip type → share link → everyone submits preferences → AI compares →
2–3 options with individual fit → What-If → decide.

## Tech stack

Next.js (App Router) · TypeScript · Tailwind CSS · Supabase (Postgres) · Gemini API · Vercel

## Project structure

```
src/
  app/
    page.tsx                    Landing page
    create/page.tsx             Create a trip + shareable link
    join/page.tsx               Paste a trip link/code
    trip/[id]/page.tsx          Name → preference form → group status
    trip/[id]/results/page.tsx  Recommendation cards + What-If simulator
    trip/[id]/decide/page.tsx   Side-by-side decision view
    api/trips/...               Server routes (Supabase + Gemini live here only)
  components/                   UI pieces (OptionCard, WhatIfSimulator, PreferenceForm, GroupStatus)
  lib/
    prompts.ts                  Gemini system prompt (the 15 rules) + prompt builders
    gemini.ts                   Minimal Gemini REST client
    supabase.ts                 Supabase client + data helpers
supabase/schema.sql             Database tables + row-level security policies
```

## Run locally

1. Create a Supabase project and run `supabase/schema.sql` in its SQL editor.
2. Copy `.env.example` to `.env.local` and fill in the values.
3. `npm install` then `npm run dev` and open http://localhost:3000.

## Deploy to Vercel

Import the repo in Vercel and add the same environment variables from `.env.example`
(`GEMINI_API_KEY`, `GEMINI_MODEL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`). No other configuration is needed.

## How the AI is used

- **Recommendations** (`/api/trips/[id]/recommend`): sends trip type, purpose and every participant's
  budget, dates, destination types, must-haves and deal-breakers to Gemini with the rules in
  `src/lib/prompts.ts`. The result is cached on the trip so everyone sees the same options.
- **What-If** (`/api/trips/[id]/whatif`): applies one change to an in-memory copy of the preferences,
  sends both the original and temporary scenario, and returns a before/after comparison.
  Nothing is written to the database.
- Keys are only read on the server from environment variables — never shipped to the browser.
