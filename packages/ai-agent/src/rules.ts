export const defaultRules = {
  cursorrules: `
You are working on an ohmynextjs project.

Tech Stack:
- Next.js 15 (App Router)
- Supabase (Auth + DB)
- Drizzle ORM
- TypeScript
- Tailwind CSS

Conventions:
- Use server components by default
- Use 'use client' only when needed
- Follow the modular package structure under packages/
- Use Drizzle for all DB operations
- Use Supabase for auth
`,
  agentsMd: `
# AGENTS.md

## Project: ohmynextjs
Modular full-stack starter kit.

## Structure
- packages/core — base config
- packages/db — Drizzle schema
- packages/auth — Supabase auth
- packages/admin — admin dashboard
- packages/payment — TossPayments/PortOne
- packages/ai-agent — this module

## Rules
- Keep modules independent
- Export everything from index.ts
- Type everything
`,
};
