# Work Done

Last updated: 2026-03-24

## Platform migration completed

- MongoDB/Mongoose has been removed from the app code and replaced with Prisma + Supabase Postgres.
- Prisma client setup exists in [`lib/prisma.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/prisma.ts) with schema definitions in [`prisma/schema.prisma`](/Users/bhavya_agarwal/Desktop/btouch/prisma/schema.prisma).
- Auth now uses [`@auth/prisma-adapter`](/Users/bhavya_agarwal/Desktop/btouch/lib/auth.ts) and persists users/cards in Postgres.
- Environment files now point to Supabase connection pooling and direct URLs.

## Data flow completed

- Card loading now comes from the database in [`lib/card-service.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/card-service.ts).
- Platform cache storage was moved from Mongo fields to Prisma JSON columns in [`lib/dbCache.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/dbCache.ts).
- Card creation uses a Zod-validated API route in [`app/api/card/create/route.ts`](/Users/bhavya_agarwal/Desktop/btouch/app/api/card/create/route.ts).
- Public card routes now 404 cleanly for missing usernames.
- New sign-ins create both the `User` row and the linked `CardConfig` row automatically.

## UI and product flow completed

- Landing page now restores the onboarding form for credential entry in [`app/page.tsx`](/Users/bhavya_agarwal/Desktop/btouch/app/page.tsx).
- `/demo` now renders a sample public flip card in [`app/demo/page.tsx`](/Users/bhavya_agarwal/Desktop/btouch/app/demo/page.tsx).
- Sample/demo card data is isolated in [`lib/demo-card.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/demo-card.ts).
- The public card shell renders live data, refresh banners, and QR/export actions in [`components/card/PublicCardShell.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/card/PublicCardShell.tsx).
- The flip card now supports tap/click to flip instead of hover-to-flip in [`components/card/FlipCard.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/card/FlipCard.tsx).
- Home, dashboard, and error states now use shared copy/constants from [`lib/copy.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/copy.ts).
- Theme and accent values are centralized in [`lib/theme.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/theme.ts).

## Cleanup completed

- Removed the old MongoDB models and connection helper.
- Removed the Google font fetch from the root layout so the app builds offline.
- Added a static-hardcoded audit in [`docs/static-hardcoded-features.md`](/Users/bhavya_agarwal/Desktop/btouch/docs/static-hardcoded-features.md).
- Updated the README to describe the current Supabase/Postgres setup and current routes.

## Verification completed

- `npx prisma generate`
- `npx prisma db push`
- `npm run lint`
- `npx tsc --noEmit`
- `npm run build`
- Clean dev-server relaunch after clearing the broken `.next` cache
