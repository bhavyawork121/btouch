# Work Done

Last updated: 2026-03-18

## Product baseline already implemented

- Next.js 14 App Router project scaffold is in place with TypeScript, Tailwind, MongoDB Atlas, Mongoose, NextAuth beta, React Query, Framer Motion, Lucide, Upstash Redis, Zod, Cheerio, and `qrcode.react`.
- Root app shell is set up with `Inter`, `Space Grotesk`, and `JetBrains Mono` loaded through `next/font/google`.
- Landing page exists and already presents the btouch concept with a live preview card and QR block.
- Public route [`app/[username]/page.tsx`](/Users/bhavya_agarwal/Desktop/btouch/app/[username]/page.tsx) exists and renders a shareable card page with copy-link and QR actions.
- Dashboard route [`app/dashboard/page.tsx`](/Users/bhavya_agarwal/Desktop/btouch/app/dashboard/page.tsx) exists with a server action-backed edit form and live preview.
- Dashboard protection is enforced server-side in [`app/dashboard/page.tsx`](/Users/bhavya_agarwal/Desktop/btouch/app/dashboard/page.tsx).

## Card UI implemented

- 3D flip card wrapper exists in [`components/card/FlipCard.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/card/FlipCard.tsx).
- Flip interactions are implemented for hover delay, click/tap lock, and keyboard activation.
- Ambient glow follows pointer position through CSS custom properties.
- Flip particle burst is already present as an optional vibe effect.
- Front face exists in [`components/card/CardFront.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/card/CardFront.tsx) with staggered entry motion.
- Back face exists in [`components/card/CardBack.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/card/CardBack.tsx) with stat badge pop-in, heatmap reveal, and streak count-up.
- Supporting UI exists for avatar, copy button, QR export, stat badge, and skeleton card.

## Data layer implemented

- Strict card types exist in [`types/card.ts`](/Users/bhavya_agarwal/Desktop/btouch/types/card.ts) with per-platform status fields.
- Normalization and preview/mock builders exist in [`lib/normalize.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/normalize.ts).
- Redis cache wrapper exists in [`lib/cache.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/cache.ts) with per-platform TTLs and graceful degradation.
- Rate limiting exists in [`lib/rateLimit.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/rateLimit.ts) with Upstash plus in-memory fallback.
- MongoDB models exist in [`lib/models/User.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/models/User.ts), [`lib/models/CardConfig.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/models/CardConfig.ts), and [`lib/models/RefreshLog.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/models/RefreshLog.ts).
- Card aggregation service exists in [`lib/card-service.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/card-service.ts) and uses `Promise.allSettled()` to avoid full-card failure from one platform.
- Platform fetchers exist for GitHub, LeetCode, Codeforces, and GFG under [`lib/fetchers/`](/Users/bhavya_agarwal/Desktop/btouch/lib/fetchers).

## API and auth implemented

- Card API route exists in [`app/api/card/[username]/route.ts`](/Users/bhavya_agarwal/Desktop/btouch/app/api/card/%5Busername%5D/route.ts) with Zod validation, rate limiting, and cache headers.
- Refresh endpoint exists in [`app/api/refresh/route.ts`](/Users/bhavya_agarwal/Desktop/btouch/app/api/refresh/route.ts) to clear cached platform data for the signed-in user.
- Auth.js handler exists in [`app/api/auth/[...nextauth]/route.ts`](/Users/bhavya_agarwal/Desktop/btouch/app/api/auth/%5B...nextauth%5D/route.ts).
- GitHub OAuth is configured in [`lib/auth.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/auth.ts).

## Work completed in this pass

- Replaced unsupported [`next.config.ts`](/Users/bhavya_agarwal/Desktop/btouch/next.config.ts) with [`next.config.mjs`](/Users/bhavya_agarwal/Desktop/btouch/next.config.mjs) so Next tooling can run.
- Fixed a client-side hook misuse in [`components/card/CardBack.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/card/CardBack.tsx) by moving idle heatmap setup from `useMemo` to `useEffect`.
- Updated card API rate limiting to key off client IP headers instead of username in [`app/api/card/[username]/route.ts`](/Users/bhavya_agarwal/Desktop/btouch/app/api/card/%5Busername%5D/route.ts).
- Replaced the broken lint path with flat-config ESLint in [`package.json`](/Users/bhavya_agarwal/Desktop/btouch/package.json) and repaired the repo ESLint config in [`eslint.config.mjs`](/Users/bhavya_agarwal/Desktop/btouch/eslint.config.mjs).
- Fixed TypeScript issues across dashboard actions, card animation variants, Mongo connection typing, and platform stat assignment.
- Added [`.env.example`](/Users/bhavya_agarwal/Desktop/btouch/.env.example) for runtime setup.
- Public card rendering now hydrates into a client shell in [`components/card/PublicCardShell.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/card/PublicCardShell.tsx) and uses React Query via [`hooks/useCardData.ts`](/Users/bhavya_agarwal/Desktop/btouch/hooks/useCardData.ts) for revalidation and retry.
- Added targeted per-platform retry support by extending [`app/api/card/[username]/route.ts`](/Users/bhavya_agarwal/Desktop/btouch/app/api/card/%5Busername%5D/route.ts), [`lib/card-service.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/card-service.ts), and [`lib/cache.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/cache.ts) to bypass one platform cache on demand.
- Public stale/error UI now offers per-platform retry actions in [`components/card/PublicCardShell.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/card/PublicCardShell.tsx).
- Back-face stat badges now render clearer degraded-state messaging in [`components/card/StatBadge.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/card/StatBadge.tsx) using richer summary data from [`lib/normalize.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/normalize.ts).
- Added route fallbacks with [`app/not-found.tsx`](/Users/bhavya_agarwal/Desktop/btouch/app/not-found.tsx), [`app/[username]/error.tsx`](/Users/bhavya_agarwal/Desktop/btouch/app/%5Busername%5D/error.tsx), [`app/dashboard/error.tsx`](/Users/bhavya_agarwal/Desktop/btouch/app/dashboard/error.tsx), and reusable UI in [`components/ui/RouteErrorState.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/ui/RouteErrorState.tsx).
- Dashboard editing now uses a client wrapper in [`components/dashboard/DashboardEditor.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/dashboard/DashboardEditor.tsx) with explicit save success/error feedback and a manual stats refresh button.
- Saving card config now clears relevant cache keys and returns structured results from [`app/dashboard/actions.ts`](/Users/bhavya_agarwal/Desktop/btouch/app/dashboard/actions.ts).
- Stored `theme` and `accentColor` now affect rendering through [`lib/theme.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/theme.ts), [`components/card/FlipCard.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/card/FlipCard.tsx), [`components/card/CardFront.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/card/CardFront.tsx), [`components/card/CardBack.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/card/CardBack.tsx), and [`components/card/PublicCardShell.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/card/PublicCardShell.tsx).
- Dashboard preview now updates live from form edits in [`components/dashboard/DashboardEditor.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/dashboard/DashboardEditor.tsx) instead of waiting for a full route refresh.
- Accent color is now constrained and validated through swatches in [`components/dashboard/DashboardEditor.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/dashboard/DashboardEditor.tsx), shared options in [`lib/theme.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/theme.ts), and server validation in [`lib/validation.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/validation.ts).
- The repo has been migrated off Prisma/Postgres and onto MongoDB Atlas + Mongoose with [`lib/mongodb.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/mongodb.ts), [`lib/dbCache.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/dbCache.ts), and the new Mongoose models under [`lib/models/`](/Users/bhavya_agarwal/Desktop/btouch/lib/models).
- Added living project-tracking markdowns under [`docs/`](/Users/bhavya_agarwal/Desktop/btouch/docs).
- Verification now passes with `npm run lint`, `npx tsc --noEmit`, and `npm run build`.

## Known gaps relative to the master prompt

- README and `.env.example` are updated, but some sections still need cleanup for the Mongo/GitHub migration.
- Theme toggle, PNG export, and richer polish items from Phase 5 are not implemented yet.
- LinkedIn profile hydration is still effectively manual via dashboard fields rather than a true imported profile sync.
