# btouch

Animated developer identity cards built with Next.js 14. Public cards live at `btouch.dev/username` and show a LinkedIn-style front face plus live coding stats on the back face.

## Stack

- Next.js 14 App Router
- TypeScript with strict typing
- Tailwind CSS v3
- Framer Motion
- TanStack Query
- Auth.js / NextAuth v5 beta
- Supabase Postgres + Prisma
- Upstash Redis
- Zod

## Current state

The repo currently includes:

- Landing page with onboarding credentials entry
- `/demo` sample card route for the public flip-card preview
- Public shareable card route
- Auth-protected dashboard for editing profile and handles
- Prisma-backed data layer for users, cards, caches, and refresh logs
- Google sign-in and manual email/password auth with Prisma adapter
- Google sign-in and manual email/password signup
- QR and copy-link share actions
- Shared markdown tracking for completed work and next steps

Track progress here:

- [Work done](./docs/work-done.md)
- [Next up](./docs/next-up.md)
- [Static / hardcoded audit](./docs/static-hardcoded-features.md)

## Project structure

```text
app/
components/
hooks/
lib/
prisma/
types/
docs/
```

## Environment

Create `.env.local` with the following values:

```bash
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-1-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-1-ap-south-1.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://ghseacduihpopturkzlj.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="replace-with-your-anon-key"

UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."

GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

GITHUB_TOKEN="..."

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

You can start from [`.env.example`](/Users/bhavya_agarwal/Desktop/btouch/.env.example).

## Local setup

```bash
npm install
npx prisma generate
npx prisma db push
npm run dev
```

## Useful scripts

```bash
npm run dev
npm run build
npm run lint
```

## Notes

- Platform aggregation uses `Promise.allSettled()` so one provider failure does not break the card.
- Cache writes are non-blocking and Redis failures degrade gracefully.
- The public demo card lives on `/demo`; the home page stays focused on onboarding and real card creation.
- The app is built to work with live database data rather than hardcoded demo user records.
