# EventNest

A venue booking platform built with TanStack Start (SSR React), Supabase, shadcn/ui, and Tailwind CSS v4.

## Stack

- **Framework**: [TanStack Start](https://tanstack.com/start) — SSR React with file-based routing
- **Database**: [Supabase](https://supabase.com) — PostgreSQL + Auth + Storage
- **UI**: [shadcn/ui](https://ui.shadcn.com) + [Tailwind CSS v4](https://tailwindcss.com)
- **Language**: TypeScript
- **Runtime**: [Bun](https://bun.sh)

## Getting Started

```bash
# Install dependencies
bun install

# Copy and fill environment variables
cp .env.example .env

# Start dev server
bun run dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/publishable key |
| `SUPABASE_URL` | Supabase URL (server-side) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service_role key (server-side) |
| `OPENAI_API_KEY` | OpenAI key (optional, estimator falls back to local calculation) |

## Database

Migrations are in `supabase/migrations/`. Run them in your Supabase project's SQL Editor.

```bash
supabase/migrations/20260601090053_initial.sql
```

Sample venue data is in `supabase/seed.sql`. Execute it after signing up so the owner references resolve correctly.

## Scripts

| Script | Description |
|--------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Production build (client + SSR) |
| `bun run preview` | Preview production build |

## Project Structure

```
src/
├── assets/          # Static assets (images)
├── components/      # UI components
│   └── ui/          # shadcn/ui primitives
├── hooks/           # React hooks
├── integrations/    # Third-party integrations
│   └── supabase/    # Supabase client, types
├── lib/             # Server functions & utilities
│   ├── ai.functions.ts
│   ├── enquiries.functions.ts
│   ├── venues.functions.ts
│   └── owner.functions.ts
├── routes/          # File-based TanStack Router routes
├── router.tsx       # Router configuration
├── server.ts        # SSR entry point
├── start.ts         # TanStack Start instance
└── styles.css       # Global styles
```
