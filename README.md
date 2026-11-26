# LandsbankIndia 2.0

India-first, land-only discovery and intelligence platform.

## Stack
- Next.js 15 App Router, React 19, TypeScript
- Supabase Auth + PostgreSQL + PostGIS
- OpenAI API for natural-language land-search interpretation
- Google Maps search embed for location preview

## Routes
- `/` — public landing page
- `/search` — database-backed search, AI query interpretation and map preview
- `/login` — Supabase email/password sign-in and registration
- `/dashboard` — authenticated user's listing workspace
- `/list-land` — authenticated land listing submission (pending review)
- `/admin` — admin-only moderation overview

## Setup
1. Install Node.js 20 or later.
2. Copy `.env.example` to `.env.local`.
3. Create a Supabase project and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Run `database/schema.sql` in Supabase SQL Editor, then run `database/phase3-security.sql`.
5. Add `OPENAI_API_KEY` on the server to enable AI search interpretation.
6. Run `npm install` and `npm run dev`.

Never expose a Supabase service-role key in browser code. Never commit real keys into GitHub. Review and test SQL policies in staging before production. The initial database schema and RLS policies are a foundation, not a substitute for a security review.

## Current limitations
A Supabase project must be created and environment variables configured before authentication, listing storage and database search can work. An OpenAI API key is required for AI query interpretation. Map preview is an approximate Google Maps search embed, not a surveyed land boundary. AI does not certify title, legal status, valuation or investment returns. Listings require independent document verification and human moderation.
