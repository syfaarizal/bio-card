# ADR 002 — Supabase (Auth + PostgreSQL)

**Date:** August 2026  
**Status:** Accepted

## Context
BioCard needs authentication (email/password, email verification, password reset) and a relational database.

## Decision
Use Supabase for both Auth and PostgreSQL hosting.

## Reasoning
- **Supabase Auth** — handles email verification, password reset, and JWT sessions out of the box
- **PostgreSQL** — relational data model suits our schema (User → Profile → SocialLinks, Music, Images, ViewLog)
- **SSR-compatible** — `@supabase/ssr` package handles cookie-based sessions in Next.js App Router
- **Free tier** — sufficient for MVP launch

## Alternatives Considered
- Firebase — NoSQL (Firestore) doesn't suit our relational schema; Auth is good but less SSR-friendly
- Auth.js (NextAuth) — would need separate DB hosting; more boilerplate

## Consequences
- `DATABASE_URL` for Prisma, `NEXT_PUBLIC_SUPABASE_URL` + `ANON_KEY` for auth client
- Auth state lives in cookies managed by `@supabase/ssr` middleware
