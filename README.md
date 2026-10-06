# Vamoose Trip

Everyone in a group privately shares home airport, budget and vibe. The app ranks destinations that work for the whole group, then the group votes (approval voting, up to 3 each).

## Stack

Next.js (App Router, server actions), Neon Postgres, deployed on Vercel.

## Run it

1. Create a Neon project and copy its pooled connection string.
2. `cp .env.example .env.local` and set `DATABASE_URL`.
3. `npm install`
4. `npm run db:migrate` (needs `DATABASE_URL` in the environment)
5. `npm run dev`

## How matching works (`src/lib/matching.ts`)

- Per person: 55% vibe fit, 45% budget fit, where cost is an estimated round-trip flight plus nights times a typical daily spend.
- Per group: half the average happiness, half the unhappiest person, scaled by how good the season is. This keeps one person from being dragged somewhere they would hate.
- Destination data lives in `src/lib/cities.ts` (about 125 hand-curated cities across seven regions); scores are editorial and meant to be tuned.
- Home airports live in `src/lib/airports.ts` (about 285 airports, name and position only).

## Known limits of this first version

- Flight prices are a distance-based heuristic, not live fares.
- Home airport is chosen from a searchable list of major airports; people without one nearby pick the closest.
- No accounts: people are remembered by a cookie on their device.

## Next steps

See the roadmap in the conversation: live prices and affiliate links, a shareable result card, more cities, then a paid tier.
