# Ivy Homes Assignment

MERN-style property discovery app for the Ivy Homes internship assignment. The React/Vite client talks to an Express adapter, which keeps the API key and refresh-token exchange on the server. The upstream API remains the source of listing, favourite, rental, and project data.

## Run locally

1. Copy `.env.example` to `.env` and add the issued API key.
2. Install dependencies with `npm install`.
3. Start both applications with `npm run dev`.
4. Open `http://localhost:5173` and use one of the three demo accounts.

The backend listens on port 4000. `npm run build` verifies the production client bundle.

## API investigation notes

The live service was treated as authoritative. The documented query parameter and response examples were not assumed to be correct. In particular, live requests require `X-API-Key`, login is `/auth/login` with that header, access tokens expire in 15 minutes and are refreshed through `/auth/refresh`, and collection responses use `limit`, `offset`, `count`, `total`, `has_more`, and `results`. The client uses those live collection shapes and filters through the upstream parameters where supported.

The documented `/v1/analytics/summary` endpoint returned 404, so Insights uses live collection totals and clearly labels the source. Live project prices arrived as decimal crore-like values rather than integer rupees, and listing responses included `is_live: false`, so the UI preserves those source values instead of silently applying the documentation's claims.

## What checked out

Health returned a useful server status, timezone, and reference date. Listing, rental, project, detail, similar-listing, and favourites resources were reachable after authentication. The service returned truthful pagination metadata and the assigned locality was present in project and listing data. These observations are intentionally kept separate from claims that require a complete audit run.

## Data audit

Run `npm run audit:data` to authenticate and page every live collection until `has_more` is false. The script writes `audit-report.json` and computes the ten answers using the fixed reference timestamp and assigned locality. It also records evidence candidates for duplicate properties, impossible listing values, suspicious records, and project count inconsistencies. The checked-in `submission.json` contains the latest audit output; candidate contact and deployment fields still need to be filled before submission.

With another two days I would add automated API contract tests, stronger error/loading states, Playwright coverage for login, refresh, saved homes, filters, and deep links, and deploy the app with a public demo URL.