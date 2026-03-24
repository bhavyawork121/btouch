# Static / Hardcoded Features Audit

Date: 2026-03-24

This file tracks static literals and fixed rendering constants that still exist in the codebase.
Some are intentional defaults. Others are acceptable for now but should be revisited if the product needs to become fully user-configurable.

## Resolved

- The `rahul-s` demo shortcut has been removed.
- MongoDB/Mongoose model usage has been removed from the app code.
- The Google font fetch from the root layout has been removed.
- The landing page now uses onboarding form copy instead of a fixed preview profile.
- The `/demo` route now uses explicit sample data isolated in [`lib/demo-card.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/demo-card.ts).

## Still fixed by design

- [`lib/card-service.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/card-service.ts) still uses a fixed platform processing order for GitHub, LeetCode, Codeforces, and GFG.
- [`app/api/card/[username]/route.ts`](/Users/bhavya_agarwal/Desktop/btouch/app/api/card/%5Busername%5D/route.ts) still refreshes the same known platform keys.
- [`components/card/FlipCard.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/card/FlipCard.tsx) still defines the card mode labels and platform tabs in code.
- [`components/card/FlipCard.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/card/FlipCard.tsx) still uses a 91-day heatmap window and a fixed particle burst count.
- [`lib/theme.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/theme.ts) still defines the accent palette and theme surfaces as constants.

## Intentional defaults

- [`lib/normalize.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/normalize.ts) still sets the empty-card defaults for theme, accent, and blank profile fields.
- [`app/api/card/create/route.ts`](/Users/bhavya_agarwal/Desktop/btouch/app/api/card/create/route.ts) still defaults new cards to `dark` and `indigo` when the request does not provide values.
- [`components/card/PublicCardShell.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/card/PublicCardShell.tsx) still uses fixed banner strings for stale/error states.
- [`components/ui/RouteErrorState.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/ui/RouteErrorState.tsx) still has default error copy and button labels.

## Remaining review points

- [`components/card/FlipCard.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/card/FlipCard.tsx) still contains a few hardcoded rendering constants for layout sizing and timeline display.
- [`app/[username]/opengraph-image.tsx`](/Users/bhavya_agarwal/Desktop/btouch/app/[username]/opengraph-image.tsx) still uses fixed fallback copy when no profile fields are available.
- [`components/dashboard/DashboardEditor.tsx`](/Users/bhavya_agarwal/Desktop/btouch/components/dashboard/DashboardEditor.tsx) still contains some copy-driven UI strings that are intentionally centralized in [`lib/copy.ts`](/Users/bhavya_agarwal/Desktop/btouch/lib/copy.ts).

## Notes

- The app is now database-backed and no longer relies on the old demo username shortcut.
- The remaining hardcoded values are mostly product defaults, display labels, or layout constants rather than fake user data.
