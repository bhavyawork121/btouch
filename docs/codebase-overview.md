# btouch Codebase Overview

Last reviewed: 2026-04-20

`btouch` is a Next.js 14 App Router app for building and sharing developer identity cards. The public card is a flip card: the front is profile/LinkedIn-oriented, the back shows live coding stats fetched from supported platforms.

## At A Glance

- Framework: Next.js 14 + React 18 + TypeScript strict mode
- Styling: Tailwind CSS v3 plus a large amount of inline/CSS-module-like page styling
- Auth: NextAuth v5 beta with Prisma adapter, Google OAuth, and email/password credentials
- Data: Supabase Postgres via Prisma
- Caching: Prisma JSON cache columns plus an Upstash Redis utility layer
- Stats sources: GitHub, LeetCode, Codeforces, GFG, and a partially wired CodeChef path
- Media: Next image remote patterns for external avatars/logos
- Motion: Framer Motion, CSS animations, and reduced-motion handling in most interactive surfaces

## Core Product Flow

```text
/                 -> marketing landing page
/auth             -> sign in or register
/dashboard        -> edit your card
/api/auth/*       -> NextAuth handlers
/api/auth/register -> email/password onboarding
/api/card/[username] -> public card JSON
/[username]       -> public card page
/demo             -> sample flip-card demo
/api/stats/*      -> platform verification endpoints
/api/refresh      -> clears cached stats for the signed-in user
/api/parse-experience -> Anthropic-backed text parsing
```

The main runtime loop is:

1. A user authenticates through `/auth`.
2. `/dashboard` loads the user card from Postgres through `lib/card-service.ts`.
3. The dashboard edits `CardConfig` and clears caches when saved.
4. The public route `/[username]` fetches normalized card data and live platform stats.
5. Stats are cached in Prisma JSON columns and refreshed on demand.

## Route Map

### `app/page.tsx`

The landing page is the current home route. It is an async server component that reads the session with `auth()` and conditionally sends the user to `/dashboard` or `/auth?callbackUrl=/dashboard`.

It is self-contained and does not import the alternate `components/home/HomeHero.tsx` implementation.

### `app/auth/page.tsx`

The auth page redirects already-authenticated users back to the dashboard. Otherwise it renders `components/auth/AuthPage.tsx`, which supports:

- Google sign-in when Google env vars are present
- email/password registration through `/api/auth/register`
- credentials sign-in via NextAuth

### `app/dashboard/page.tsx`

This is the active dashboard route. It:

- requires `session.user.email`
- loads preview data with `getDashboardPreviewData(email)`
- renders `components/dashboard/DashboardEditor.tsx`

This is important because the repo contains a second, more modular dashboard shell, but it is not the one currently mounted here.

### `app/[username]/page.tsx`

The public card route:

- loads the current session
- fetches the card with `getCardDataByUsername(username)`
- returns `notFound()` if the username does not exist
- passes an `isOwner` flag when the session card username matches the route username
- renders `components/card/FlipCard.tsx`

### `app/demo/page.tsx`

The demo route renders a hardcoded example card from `lib/demo-card.ts` inside the same `FlipCard` UI. It is a safe sample route for showing the product without real account data.

### Supporting route files

- `app/[username]/loading.tsx` and `app/dashboard/loading.tsx` provide skeleton/loading states
- `app/[username]/error.tsx` and `app/dashboard/error.tsx` provide route-level error recovery
- `app/not-found.tsx` is the generic 404 page
- `app/btouch/page.tsx` is just a redirect alias back to `/`
- `middleware.ts` only matches `/dashboard/:path*` and currently just passes through

## Server Endpoints

### `app/api/auth/[...nextauth]/route.ts`

This is just the NextAuth handler export from `lib/auth.ts`.

### `app/api/auth/register/route.ts`

Registration uses `signupSchema` from `lib/auth-forms.ts`, hashes passwords with `lib/password.ts`, ensures a unique username via `lib/username.ts`, creates a `User`, then creates the linked `CardConfig`.

It also handles the case where the email already belongs to a Google-only account.

### `app/api/card/create/route.ts`

This is a guest/onboarding creation endpoint. It validates payloads with Zod, creates a synthetic `User` and `CardConfig`, and revalidates `/dashboard` and `/{username}`.

This route exists, but the current active landing page does not mount the onboarding UI that would call it.

### `app/api/card/[username]/route.ts`

This is the public JSON endpoint used by the client-side public card shell. It:

- validates the username
- rate limits by client IP using `lib/rateLimit.ts`
- optionally refreshes one platform via `?refreshPlatform=...`
- loads normalized card data through `getCardDataByUsername()`
- returns cache-control headers for CDN/edge reuse

### `app/api/refresh/route.ts`

This authenticated endpoint clears all cached platform data for the signed-in user’s card.

### `app/api/stats/[platform]/[username]/route.ts`

This is the platform verification endpoint used by dashboard tooling. It:

- validates platform and username
- checks the Prisma-backed cache first
- fetches fresh platform stats if the cache is stale
- normalizes the response into a `PlatformData` shape
- returns `404` for likely user-not-found cases and `502` for generic failures

### `app/api/parse-experience/route.ts`

This route accepts free-form text and sends it to Anthropic via `lib/experience-parser.ts`, which asks Claude to return a JSON array of parsed work history entries.

## Data Model

The Prisma schema in `prisma/schema.prisma` is the source of truth.

### `User`

- identity record for auth and ownership
- includes `email`, `name`, `username`, optional `passwordHash`, avatar fields, and OAuth fields
- has one optional `CardConfig`
- owns sessions, accounts, authenticators, and refresh logs

### `CardConfig`

This is the main product record. It stores:

- public username
- LinkedIn/profile text fields
- current role/company
- theme and accent settings
- platform handles
- cached platform JSON blobs plus timestamps
- work experience data
- onboarding and display flags

Important detail: the schema includes `codechefUsername`, `codechefData`, and `codechefCachedAt`, but the primary public card service does not yet surface CodeChef in the main card flow.

### `RefreshLog`

Audit-style log for refresh activity. It records user, username, platform, status, duration, and timestamp.

### Auth tables

- `Account`
- `Session`
- `VerificationToken`
- `Authenticator`

These are standard NextAuth/Auth.js persistence tables used by the Prisma adapter.

## Service Layer

### `lib/auth.ts`

This is the authentication brain of the app.

- Uses `NextAuth`
- Configures Google OAuth when env vars exist
- Configures email/password login with the credentials provider
- Wraps the Prisma adapter so OAuth sign-in always creates or updates a `User` and matching `CardConfig`
- Puts `id`, `username`, and `cardUsername` onto the session object

The helper `ensureCardForUser()` is what keeps `User` and `CardConfig` synchronized after sign-in.

### `lib/card-service.ts`

This is the main card data orchestrator.

- Loads card config by username
- Resolves platform handles
- Loads cached platform stats from `lib/dbCache.ts`
- Fetches fresh data from the platform fetchers if needed
- Calls `normalizeCard()` to produce the app’s `CardData` shape

The active platform order is fixed to GitHub, LeetCode, Codeforces, and GFG.

### `lib/dbCache.ts`

Prisma-based cache layer for platform JSON columns.

- `getCachedPlatform()` checks JSON + timestamp and enforces TTL
- `savePlatformCache()` writes data and timestamps back into `CardConfig`
- `clearPlatformCache()` and `clearAllCaches()` wipe cache columns

This is the cache layer used by the active card service and refresh endpoints.

### `lib/cache.ts`

There is also an Upstash Redis cache helper here. It provides generic `getCachedJson`, `setCachedJson`, and `clearCardCache` helpers, but nothing in the current app imports it.

That makes it a present-but-unused cache utility rather than the active cache path.

### `lib/normalize.ts`

This file converts raw database rows and raw platform payloads into the app’s shared data shapes.

- `normalizeCard()` builds the full `CardData`
- `normalizePlatformData()` maps each provider into a `PlatformData`
- `createEmptyCardData()` and `createEmptyPlatformData()` define defaults
- `summarizeStats()` provides compact summary rows

It is also where legacy `experience` and `workExperience` formats are normalized into a unified experience array.

### Fetchers

- `lib/fetchers/github.ts` queries GitHub REST + GraphQL when a token is present
- `lib/fetchers/leetcode.ts` queries LeetCode GraphQL
- `lib/fetchers/codeforces.ts` queries the Codeforces API
- `lib/fetchers/gfg.ts` tries a community API first, then falls back to scraping if needed
- `lib/codechef.ts` scrapes CodeChef and caches results in memory

The important mismatch: CodeChef exists in the fetch stack and stats route, but the main public card service does not currently include it in `CardData.stats`.

### Validation and identity helpers

- `lib/validation.ts` validates dashboard form saves
- `lib/auth-forms.ts` validates sign-up/login fields
- `lib/username.ts` creates slugified unique usernames across both users and cards
- `lib/password.ts` hashes and verifies credentials with `scrypt`
- `lib/platforms.ts` defines platform metadata, URLs, colors, and labels
- `lib/theme.ts` defines theme surfaces and accent colors
- `lib/experience-parser.ts` turns raw text into structured experience entries using Anthropic
- `lib/rateLimit.ts` enforces a simple per-identifier request window, using Redis when available and in-memory fallback otherwise

## UI Layer

### Public card system

The active public card view is built from:

- `components/card/FlipCard.tsx`
- `components/card/CardFront.tsx`
- `components/card/CardBack.tsx`
- `components/card/StatWidget.tsx`
- `components/card/RadarChart.tsx`
- `components/card/ParticleBackground.tsx`
- `components/ui/FlipButton.tsx`

How they connect:

- `FlipCard` manages the flip state and touch/keyboard interaction
- `CardFront` renders the LinkedIn-style profile side
- `CardBack` renders platform widgets and radar chart
- `StatWidget` shows one platform’s metric set
- `RadarChart` summarizes platform stats when enough platforms are present

`CardFront` also supports copy/share affordances and optional particle effects. `CardBack` renders an empty state when no platform data exists.

### Public sharing and preview utilities

- `components/card/SharePanel.tsx` builds copy-link, QR, embed, social share, and PNG export flows
- `components/ui/CopyButton.tsx` is the reusable clipboard button
- `components/ui/QRExport.tsx` renders QR code blocks
- `components/ui/RouteErrorState.tsx` is shared by route error boundaries
- `components/ui/CountUp.tsx`, `components/ui/Skeleton.tsx`, and `components/ui/SkeletonCard.tsx` provide animation and loading primitives
- `components/ui/Avatar.tsx` is a simple avatar fallback

### Dashboard UI

The dashboard has two separate implementations in the tree.

Active path:

- `components/dashboard/DashboardEditor.tsx` is the component used by `/dashboard`

Alternate path, currently not mounted:

- `components/dashboard/DashboardShell.tsx`
- `components/dashboard/EditCardForm.tsx`
- `components/dashboard/Sidebar.tsx`
- `components/dashboard/LivePreview.tsx`
- `components/dashboard/PlatformVerifier.tsx`
- `components/dashboard/AppearancePicker.tsx`
- `components/dashboard/AccentPicker.tsx`
- `components/dashboard/sections/*`

The active `DashboardEditor` is a large single-page editor with:

- editable username and profile fields
- inline platform handle editing
- live local preview via `LivePreviewCard`
- save and refresh actions wired to `app/dashboard/actions.ts`

The alternate shell is more modular and uses `useCardForm()`, but it is not the component currently rendered by the dashboard route.

### Home and onboarding UI

- `components/auth/AuthPage.tsx` powers sign-in and manual registration
- `components/home/HomeHero.tsx` is a large hero/onboarding composition
- `components/card/OnboardingCard.tsx` is a multi-step onboarding form
- `components/card/PublicCardShell.tsx` is a public card wrapper with live refetch, banners, copy, and QR/export support
- `components/card/LivePreviewCard.tsx` renders a compact preview card

These files are present and working in isolation, but the current route tree does not mount the onboarding hero or the public shell. The live routes use the simpler page implementations instead.

### Documented but not mounted

These files are in the repo but currently look like alternate product paths or older scaffolding:

- `components/home/HomeHero.tsx`
- `components/card/OnboardingCard.tsx`
- `components/card/PublicCardShell.tsx`
- `components/dashboard/DashboardShell.tsx`
- `components/dashboard/EditCardForm.tsx`
- `components/dashboard/PlatformVerifier.tsx`
- `components/dashboard/AppearancePicker.tsx`
- `components/dashboard/AccentPicker.tsx`
- `components/dashboard/sections/*`
- `lib/cache.ts`

## Styling And Build Plumbing

- `app/globals.css` defines the global dark theme, grid overlays, scrollbar styling, page enter animation, and mobile layout adjustments
- `tailwind.config.ts` extends colors, font families, shadows, keyframes, and background images
- `next.config.mjs` whitelists remote image hosts for avatars, logos, and platform images
- `app/layout.tsx` sets metadata, imports Space Grotesk, wires `Providers`, and places the Sonner toaster
- `app/providers.tsx` wraps the app in `SessionProvider` and `QueryClientProvider`
- `tsconfig.json` uses `@/*` path aliases and strict TypeScript

## What Is Present Versus What Is Missing

### Present

- Full auth flow with Google and email/password
- Persistent user + card records in Postgres
- Live public card pages
- Demo route with a stable sample card
- Per-platform fetchers and Prisma-backed caching
- QR/copy/share/export primitives
- Loading and error boundaries
- Anthropic-backed experience parsing endpoint

### Present But Partially Wired

- CodeChef support in fetchers, stats API, cache schema, and normalization utilities
- Redis helper utilities in `lib/cache.ts`
- The alternate modular dashboard stack
- The onboarding hero and onboarding card flow

### Missing Or Still Soft Spots

- The current dashboard route does not use the more modular shell/section architecture
- The home page does not mount the onboarding hero or onboarding card flow
- The main public card service does not yet expose CodeChef in the active `CardData` stats model
- LinkedIn data is still mostly manual rather than true import/sync
- Production deployment wiring and environment setup still need validation, per `docs/next-up.md`

## Best Files To Read First

- [app/page.tsx](/Users/bhavya_agarwal/Desktop/btouch/app/page.tsx)
- [app/dashboard/page.tsx](/Users/bhavya_agarwal/Desktop/btouch/app/dashboard/page.tsx)
- [app/[username]/page.tsx](/Users/bhavya_agarwal/Desktop/btouch/app/[username]/page.tsx)
- [lib/auth.ts](/Users/bhavya_agarwal/Desktop/btouch/lib/auth.ts)
- [lib/card-service.ts](/Users/bhavya_agarwal/Desktop/btouch/lib/card-service.ts)
- [prisma/schema.prisma](/Users/bhavya_agarwal/Desktop/btouch/prisma/schema.prisma)
- [components/card/FlipCard.tsx](/Users/bhavya_agarwal/Desktop/btouch/components/card/FlipCard.tsx)
- [components/dashboard/DashboardEditor.tsx](/Users/bhavya_agarwal/Desktop/btouch/components/dashboard/DashboardEditor.tsx)

## Notes

- The repo has already moved away from the old MongoDB/Mongoose path described in the docs.
- The current codebase is intentionally more database-driven than demo-driven.
- Several files are present because the product appears to have two overlapping generations of dashboard and onboarding UI. The active route wiring favors the newer, simpler page-level components.
