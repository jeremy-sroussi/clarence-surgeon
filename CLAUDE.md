# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `pnpm dev` (uses `--turbopack`)
- **Build:** `pnpm build`
- **Start prod:** `pnpm start`
- **Prisma migrate:** `pnpm exec prisma migrate dev --name <name>`
- **Prisma generate:** `pnpm exec prisma generate`
- No test runner or linter configured. TypeScript checking: `pnpm exec tsc --noEmit`

## Environment

Requires these variables in `.env` (see `.env.example`):
- `ANTHROPIC_API_KEY` — Anthropic SDK reads it automatically
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase Auth (browser + server)
- `DATABASE_URL` — Supabase pooled connection (port 6543, `?pgbouncer=true`) for Prisma runtime
- `DIRECT_URL` — Supabase direct connection (port 5432) for Prisma migrations

## Code Style

4-space indent, single quotes. Path alias: `@/*` maps to `./src/*`. TypeScript strict mode with `noUncheckedIndexedAccess: true` — indexed access returns `T | undefined`, so always narrow or assert after bracket access.

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + Framer Motion
- Anthropic SDK (`@anthropic-ai/sdk`) calling `claude-sonnet-4-5-20250929`
- Supabase Auth (`@supabase/ssr`) — email/password login, session management, middleware token refresh
- Prisma 7 (`@prisma/client` + `@prisma/adapter-pg`) — database ORM for Supabase Postgres
- Package manager: pnpm

## Tailwind v4

No `tailwind.config.ts`. Styles use `@import 'tailwindcss'` + `@theme {}` block in `src/app/globals.css`. PostCSS plugin is `@tailwindcss/postcss` (not `tailwindcss`). Custom colors are CSS variables (`--color-bg-primary`, `--color-accent-blue`, etc.) used as Tailwind classes like `bg-bg-primary`, `text-accent-blue`.

## Prisma 7

Schema in `prisma/schema.prisma`. Config in `prisma/prisma.config.ts` (provides `datasource.url` for CLI commands). At runtime, `src/lib/prisma.ts` uses `@prisma/adapter-pg` with `DATABASE_URL`. After schema changes: `pnpm exec prisma migrate dev --name <name>` then `pnpm exec prisma generate`.

## Architecture

### Auth Flow

Supabase Auth handles email/password sign-up/sign-in. `src/middleware.ts` refreshes tokens on every request and redirects unauthenticated users to `/login`. `AuthProvider` (React context in layout) exposes `{ user, loading }` to all client components. All API routes verify the session via server-side Supabase client.

### Data Flow

Speech input (French, Web Speech API) → `useSpeechRecognition` hook → user presses stop → accumulated transcript sent to `useBuilder.sendMessage()` → POST to `/api/analyze` SSE endpoint → Claude outputs `---JSON---` delimiter + structured JSON → client parses SSE events and updates state via `useReducer` → debounced PATCH to `/api/agents/[id]` persists to DB.

### Data Persistence

Client hooks (`useAgents`, `useBuilder`) call REST API routes (`/api/agents`, `/api/agents/[id]`) which use `src/lib/db.ts` (Prisma queries). The `useBuilder` hook debounces saves (1.5s) to avoid hammering the DB during rapid speech input. Agent data (policy as JSONB, conversation history as JSONB) is stored in a single `agents` table scoped by `user_id`.

### Routes

- `/login` — email/password sign-in/sign-up
- `/` — redirects to `/agents`
- `/agents` — agent list (create, archive, delete). Layout includes `Sidebar`.
- `/agents/[id]` — builder page: loads agent async, renders `BuilderView`
- `/api/agents` — GET (list) + POST (create)
- `/api/agents/[id]` — GET + PATCH + DELETE
- `/api/analyze` — Claude SSE streaming endpoint (auth-protected)

### Key Modules

- **`src/lib/supabase/client.ts`** — Browser Supabase client (auth only, no DB queries).
- **`src/lib/supabase/server.ts`** — Server Supabase client (auth only, cookie-based).
- **`src/lib/supabase/middleware.ts`** — Token refresh + redirect logic for middleware.
- **`src/lib/prisma.ts`** — Prisma client singleton with `@prisma/adapter-pg`.
- **`src/lib/db.ts`** — Prisma-based CRUD: `getAgents`, `getAgent`, `createAgent`, `updateAgent`, `deleteAgent`. Maps between Prisma types and app `Agent` type.
- **`src/hooks/useBuilder.ts`** — Core state machine. Accepts `Agent` prop (loaded by parent page). `useReducer` with `BuilderState`/`BuilderAction`. Handles 4-step onboarding flow, then normal conversation. Debounced persistence via PATCH API.
- **`src/hooks/useSpeechRecognition.ts`** — Web Speech API wrapper (`fr-FR`). Auto-restarts on Chrome's ~60s timeout via `onend`.
- **`src/hooks/useAgents.ts`** — Agent list CRUD via fetch to `/api/agents`.
- **`src/lib/prompts-v1.ts`** — System prompt and message builder. Defines the consultation policy structure (4 blocks: highPotentialPatients, lowPotentialPatients, inBetween, forNonQualified) and 3 dimensions (scope, readiness, urgency).
- **`src/lib/types.ts`** — All TypeScript types: `Agent`, `ConsultationPolicy`, `PolicyBlock`, `PolicyRule`, `BuilderMessage`, `BuilderState`, `BuilderAction`, `V2AnalysisResponse`.
- **`src/lib/claude.ts`** — Anthropic SDK client singleton.
- **`src/app/api/analyze/route.ts`** — SSE streaming endpoint with prompt caching and auth check. Streams `thinking` events, then parses JSON after `---JSON---` delimiter.

### Component Structure

- `builder/` — BuilderView, BuilderHeader, BuilderConversation, MessageBubble, DictationZone, ClarificationChips, PolicyPanel, PolicyBlockView
- `agents/` — AgentList, AgentCard, CreateAgentModal
- `providers/` — AuthProvider
- `ui/` — Sidebar, Drawer, Modal

### Onboarding Flow

New agents go through 4 questions (steps 0-3). During steps 0-2, user answers are stored locally without API calls. On step 3, all 4 answers are bundled into a single message and sent to the API with `isOnboarding: true`. After that, normal conversational policy refinement begins.
