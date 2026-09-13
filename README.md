# Ivy Homes Assignment

MERN-style property discovery app for the Ivy Homes internship assignment. The React/Vite client talks to an Express adapter, which keeps the API key and refresh-token exchange on the server. The upstream API remains the source of listing, favourite, rental, and project data.

## Run locally

1. Copy `.env.example` to `.env` and add the issued API key.
2. Install dependencies with `npm install`.
3. Start both applications with `npm run dev`.
4. Open `http://localhost:5173` and use one of the three demo accounts.

The backend listens on port 4000. `npm run build` verifies the production client bundle.

## API investigation notes

# Ivy Homes Assignment

A React and Express property discovery application built for the Ivy Homes software engineering assignment. The frontend runs on Vite, while the Express backend keeps the Ivy API key server-side, handles authentication, refreshes expired access tokens, and proxies authenticated property requests.

The Ivy Homes API is the source of truth. MongoDB is not required or used by this project.

## Features

The application implements the six required frontend workflows:

- Login with the real Ivy Homes authentication flow
- Session persistence through page refreshes
- Live token refresh using the upstream refresh token
- Paginated listing browsing with locality, bedroom, furnishing, and price filters
- Local price validation and filtering when the upstream API does not apply a filter
- Clear reset-filters and no-results states
- Listing detail pages with URL-based navigation
- Saved homes with add, remove, list, reload, and re-login persistence through the Ivy API
- Rental browsing
- Builder project browsing with area and source price values
- Insights built from live collection totals because the documented analytics endpoint is unavailable

## Project Structure

```text
backend/
	middleware/       Authentication/session middleware
	routes/           Auth, property, saved, and insights routes
	services/         Authenticated upstream requests and token refresh
	utils/            Ivy API request helpers
	app.js            Express application setup
	server.js         Backend entrypoint

frontend/
	src/
		api/             Frontend API client
		app/             Application routes
		components/      Shared UI components
		features/        Auth, listings, projects, saved, and insights features
		layout/          Application shell, responsive layout, and motion styles
		shared/          Session, formatters, image, and saved-home utilities

scripts/
	audit-data.js      Full live data audit and answer calculation
```

## Run Locally

Requirements: Node.js 20 or newer.

1. Copy `.env.example` to `.env`.
2. Add the issued Ivy API key to `IVY_API_KEY`.
3. Install dependencies:

```bash
npm install
```

4. Start the backend and frontend from the repository root:

```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173).

The frontend uses port `5173`. The Express API uses port `4000`, and Vite proxies `/api` requests to it.

Available commands:

```bash
npm run dev          # Start frontend and backend
npm run build        # Build the frontend
npm run audit:data   # Audit all live collections and calculate answers
npm start            # Start the backend only
```

Use any of the three demo email accounts and the shared password provided in the assignment email. The credentials are intentionally not stored in the repository.

## API Investigation

The supplied API reference was treated as a hypothesis, not as a contract. The live API was probed before implementing the client, and each discrepancy was reproduced before being recorded in `submission.json`.

Important verified differences include:

- The API key must be sent in the `X-API-Key` header, not as the documented `api_key` query parameter.
- Login returns `access_token` and `refresh_token`; access tokens expire in 15 minutes rather than 24 hours.
- Collection responses use `offset`, `count`, `total`, `has_more`, and `results`. The service currently caps requests at 50 records even when a larger limit is requested.
- `/v1/listings` includes records where `is_live` is false, despite the documentation describing active-only results.
- Listing details are served at `/v1/listings/{id}`, not the documented singular `/v1/listing/{id}`.
- Saved homes are served at the undocumented `/v1/saved` resource and accept `{ "listing_id": "..." }`.
- `/v1/analytics/summary` returns 404, so the Insights page uses live collection totals.
- Project prices arrive as decimal crore-like values and must be converted to rupees for comparison.
- Project `total_listings` values do not consistently match the listings grouped by `project_id`.
- The listing collection contains impossible records and deliberate non-genuine records, which are excluded from relevant audit calculations.

## Data Audit

Run:

```bash
npm run audit:data
```

The audit script authenticates with the live API, pages listings, rentals, and projects until `has_more` is false, deduplicates records by their IDs, applies the fixed reference timestamp from the assignment, and calculates all ten answers. It writes the detailed output and evidence candidates to `audit-report.json`.

The latest calculated answers are copied into `submission.json`:

```text
total_listing_records:       4700
unique_properties:            4699
active_listings:              3722
total_monthly_rent:           6626200
avg_price_per_sqft_2bhk:      20975.51
costliest_project:            P10068 / 998000000 INR
listings_last_7_days:         149
projects_with_wrong_count:    394
```

The full corrupt and fake listing ID lists, plus the evidence-backed findings, are in `submission.json`.

## What Checked Out

Several initial hypotheses were tested and did not become findings:

- `/health` was reachable and returned a useful status, timezone, server clock, and reference date.
- The API key correctly scopes responses to the assigned city without requiring a city filter.
- Listing, rental, project, and collection pagination responses expose enough metadata to reach the end of the stream.
- The assigned locality, Electronic City, is present in the live data.
- Listing IDs and project IDs are usable for detail-page and grouping operations.
- Saved homes persist through the upstream account rather than only browser memory.

These checks are documented separately from claims that were reproduced as discrepancies.

## Submission Checklist

Before submitting:

- Replace the blank `repo_url` in `submission.json` with the public GitHub repository URL.
- Deploy the application and replace the blank `demo_url`.
- Confirm the candidate email is correct.
- Run `npm run audit:data` once more before submission if the live dataset has changed.
- Confirm `.env` and `node_modules/` are ignored and are not staged.
- Do not commit the API key outside the required `submission.json` field.

## Remaining Improvements

With another two days I would add automated API contract tests, Playwright coverage for login, refresh, saved homes, filters, empty states, and deep links, and a deployment configuration with separate frontend and backend environment settings.

The documented `/v1/analytics/summary` endpoint returned 404, so Insights uses live collection totals and clearly labels the source. Live project prices arrived as decimal crore-like values rather than integer rupees, and listing responses included `is_live: false`, so the UI preserves those source values instead of silently applying the documentation's claims.

## What checked out

Health returned a useful server status, timezone, and reference date. Listing, rental, project, detail, similar-listing, and favourites resources were reachable after authentication. The service returned truthful pagination metadata and the assigned locality was present in project and listing data. These observations are intentionally kept separate from claims that require a complete audit run.

## Data audit

Run `npm run audit:data` to authenticate and page every live collection until `has_more` is false. The script writes `audit-report.json` and computes the ten answers using the fixed reference timestamp and assigned locality. It also records evidence candidates for duplicate properties, impossible listing values, suspicious records, and project count inconsistencies. The checked-in `submission.json` contains the latest audit output; candidate contact and deployment fields still need to be filled before submission.

With another two days I would add automated API contract tests, stronger error/loading states, Playwright coverage for login, refresh, saved homes, filters, and deep links, and deploy the app with a public demo URL.