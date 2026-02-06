# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- **Dev server:** `pnpm dev` (uses `--turbopack`)
- **Build:** `pnpm build`
- **Start prod:** `pnpm start`
- No test runner or linter configured. TypeScript checking: `pnpm exec tsc --noEmit`

## Environment

Requires `ANTHROPIC_API_KEY` in `.env` (see `.env.example`). The Anthropic SDK reads it automatically.

## Code Style

4-space indent, single quotes. Path alias: `@/*` maps to `./src/*`. TypeScript strict mode with `noUncheckedIndexedAccess: true` — indexed access returns `T | undefined`, so always narrow or assert after bracket access.

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + Framer Motion
- Anthropic SDK (`@anthropic-ai/sdk`) calling `claude-sonnet-4-5-20250929`
- Package manager: pnpm

## Tailwind v4

No `tailwind.config.ts`. Styles use `@import 'tailwindcss'` + `@theme {}` block in `src/app/globals.css`. PostCSS plugin is `@tailwindcss/postcss` (not `tailwindcss`). Custom colors are CSS variables (`--color-bg-primary`, `--color-accent-blue`, etc.) used as Tailwind classes like `bg-bg-primary`, `text-accent-blue`.

## Architecture

### Data Flow

Speech input (French, Web Speech API) → `useSpeechRecognition` hook → user presses stop → accumulated transcript sent to `useBuilder.sendMessage()` → POST to `/api/analyze` SSE endpoint → Claude outputs `---JSON---` delimiter + structured JSON → client parses SSE events and updates state via `useReducer`.

### Routes

- `/` — redirects to `/agents`
- `/agents` — agent list (create, archive, delete). Layout includes `Sidebar`.
- `/agents/[id]` — builder page: conversation + dictation + policy drawer

### Key Modules

- **`src/hooks/useBuilder.ts`** — Core state machine. `useReducer` with `BuilderState`/`BuilderAction`. Handles 4-step onboarding flow (questions 0-3), then switches to normal conversation mode. Bundles onboarding answers into one API call. Uses `stateRef` pattern to avoid stale closures. Persists agent state to localStorage on every change.
- **`src/hooks/useSpeechRecognition.ts`** — Web Speech API wrapper (`fr-FR`). Auto-restarts on Chrome's ~60s timeout via `onend`. Uses `shouldListenRef` to control restart behavior.
- **`src/hooks/useAgents.ts`** — CRUD for agents list via localStorage.
- **`src/lib/prompts-v1.ts`** — System prompt and message builder. Defines the consultation policy structure (4 blocks: highPotentialPatients, lowPotentialPatients, inBetween, forNonQualified) and 3 dimensions (scope, readiness, urgency). Claude outputs `---JSON---` then a `V2AnalysisResponse` JSON object. Uses prompt caching for the system prompt.
- **`src/lib/types.ts`** — All TypeScript types: `Agent`, `ConsultationPolicy`, `PolicyBlock`, `PolicyRule`, `BuilderMessage`, `BuilderState`, `BuilderAction`, `V2AnalysisResponse`.
- **`src/lib/storage.ts`** — localStorage persistence for agents (key: `surgeon-logic-agents`).
- **`src/lib/claude.ts`** — Anthropic SDK client singleton.
- **`src/app/api/analyze/route.ts`** — SSE streaming endpoint with prompt caching (`cache_control: ephemeral`). Streams `thinking` events (pre-delimiter text) and a `status` event, then parses final JSON after `---JSON---` delimiter and sends a `result` event.

### Component Structure

- `builder/` — BuilderHeader, BuilderConversation, MessageBubble, DictationZone, ClarificationChips, PolicyPanel, PolicyBlockView
- `agents/` — AgentList, AgentCard, CreateAgentModal
- `ui/` — Sidebar, Drawer, Modal

### Onboarding Flow

New agents go through 4 questions (steps 0-3). During steps 0-2, user answers are stored locally without API calls. On step 3, all 4 answers are bundled into a single message and sent to the API with `isOnboarding: true`. After that, normal conversational policy refinement begins.
