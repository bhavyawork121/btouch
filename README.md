# btouch

Animated developer identity cards built with Next.js 14. A public card at `btouch.dev/username` shows a LinkedIn-style front face and live coding-platform stats on the back face.

## Stack

- Next.js 14 App Router
- TypeScript with strict typing
- Tailwind CSS v3
- Framer Motion
- TanStack Query
- Auth.js / NextAuth v5 beta
- MongoDB Atlas + Mongoose
- Upstash Redis
- Zod

## Current state

The repo already contains:

- Landing page with a live preview card
- Public shareable card route
- Auth-protected dashboard for editing profile and handles
- Card aggregation service with per-platform fetchers
- Redis cache wrapper and rate limiting
- GitHub auth wiring
- QR and copy-link share actions

Track progress here:

- [Work done](./docs/work-done.md)
- [Next up](./docs/next-up.md)

## Project structure

```text
app/
components/
hooks/
lib/
lib/models/
types/
docs/
```

## Environment

Create `.env.local` with the following values:

```bash
MONGODB_URI="mongodb+srv://btouch-admin:wRFYno1kuZXZOpDp@btouchluster.4phjh3n.mongodb.net/btouch?retryWrites=true&w=majority&appName=btouchluster"

UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="..."

GITHUB_CLIENT_ID="..."
GITHUB_CLIENT_SECRET="..."

GITHUB_TOKEN="..."

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

You can start from [`.env.example`](/Users/bhavya_agarwal/Desktop/btouch/.env.example).

## Local setup

```bash
npm install
npm run dev
```

## Useful scripts

```bash
npm run dev
npm run build
npm run lint
```

## Implementation notes

- Platform aggregation uses `Promise.allSettled()` so one provider failure does not break the card.
- Cache writes are non-blocking and Redis failures degrade gracefully.
- Card pages are server-rendered today; client refresh/error-retry work is still on the near-term roadmap.
