# LandsbankIndia 2.0

Land-first discovery and intelligence platform. India-first architecture, designed to support multilingual experiences and web/mobile clients over time.

## Current starter
- Next.js App Router + React + TypeScript
- Responsive landing page
- Search interface with clearly labelled illustrative demo listings and client-side filters
- Tailwind CSS v4

## Run locally
1. Install Node.js 20 or later.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open `http://localhost:3000`.

## Current routes
- `/` — public landing page
- `/search` — search UI using sample data only

## Important status
Search results currently use demo data. No live property database, map provider, authentication, AI model, valuation service, or legal-record integration is connected yet. Do not present demo listings as real properties. Title/legal checks and valuation outputs will require independent professional verification.

## Planned implementation phases
1. Core UI and responsive navigation
2. Authentication, user roles and profiles
3. Land listing database, moderation and document uploads
4. Search API, filters, geospatial queries and maps
5. AI assistant and document intelligence with human review
6. Buyer/seller/investor workflows, admin tools, audit logs and security
7. Android/iOS client and multilingual rollout

## Security
Never commit API keys, passwords, private land documents, or personal data. Use environment variables and server-side access controls for integrations.
