# Next Up

Last updated: 2026-03-24

## Current priority order

1. Production deployment and environment wiring
2. LinkedIn data import or sync
3. Platform data refresh hardening
4. UX polish and export improvements

## Immediate next tasks

- Decide whether LinkedIn should stay manual-only or become an import/sync flow.
- Wire production environment variables for Supabase, GitHub OAuth, and Redis.
- Confirm the app works in a production host, not just local dev.

## Near-term engineering work

- Make refresh flows more explicit in the dashboard for individual platforms.
- Tighten stale/error recovery so a failed fetch can optionally keep older cached data.
- Expand the theme system across more of the surrounding shell if desired.

## Product gaps against the prompt

- Add richer LinkedIn hydration so the front face is less manual.
- Harden OG image generation and confirm the public preview rendering path.
- Improve QR export so it can export the QR artifact directly if needed.

## Stretch work after stability

- Language-derived palette from GitHub top language.
- Rank aura and streak-fire effects.
- PNG card export.
- Activity pulse driven by recent GitHub heatmap density.
