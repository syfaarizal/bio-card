# ADR 003 — Prisma ORM

**Date:** August 2026  
**Status:** Accepted

## Context
We need a way to interact with PostgreSQL from Next.js Server Actions with type safety.

## Decision
Use Prisma as the ORM with a singleton client pattern.

## Reasoning
- **Type safety** — generated types from schema match our TypeScript types exactly
- **Schema as source of truth** — `prisma/schema.prisma` documents the entire database structure
- **Migrations** — `prisma migrate dev` gives us reproducible, version-controlled schema changes
- **Relations** — `include: { links: true, music: true }` makes eager loading readable

## Alternatives Considered
- Drizzle — lighter, but less mature ecosystem
- Raw SQL — too verbose, no type safety
- Supabase client directly — bypasses Prisma's type system

## Consequences
- `lib/prisma.ts` uses a global singleton to avoid connection pool exhaustion in development
- Schema changes require running `prisma migrate dev`
- `DIRECT_URL` needed for migrations (bypasses Supabase connection pooler)
