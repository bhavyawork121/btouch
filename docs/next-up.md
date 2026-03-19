# Next Up

Last updated: 2026-03-18

## Current priority order

1. Verification and repo hygiene
2. Data freshness and error recovery
3. Dashboard completion
4. Share/polish features

## Immediate next tasks

- Decide whether cache refresh should support per-platform refresh from the dashboard as well.
- Add LinkedIn data import/hydration beyond manual entry.
- Decide whether LinkedIn hydration should be true OAuth profile sync or a lighter server-side enrichment flow from stored URL/handle data.

## Near-term engineering work

- Improve rate limiting to separate identifiers per route family and preserve clearer retry metadata.
- Decide whether platform cache should fall back to stale cached values when a fresh fetch fails.
- Expand theme behavior from card surfaces to more of the surrounding app shell where appropriate.

## Product gaps against the prompt

- Expand the new theme system so more of the surrounding app shell responds to saved appearance settings.
- Add OG image generation hardening and verify [`app/[username]/opengraph-image.tsx`](/Users/bhavya_agarwal/Desktop/btouch/app/%5Busername%5D/opengraph-image.tsx) output.
- Add QR export/download behavior that exports the QR itself rather than only linking to the public page.
- Evaluate LinkedIn profile import flow beyond manual entry so front-face data is less manual.

## Stretch work after stability

- Language-derived palette from GitHub top language.
- Rank aura and streak-fire effects.
- PNG card export.
- Activity pulse driven by recent GitHub heatmap density.
