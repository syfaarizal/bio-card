# ADR 001 — Next.js 15 (App Router)

**Date:** August 2026  
**Status:** Accepted

## Context
BioCard needs a React framework that supports SSR for public profile SEO, Server Actions for form handling, and easy Vercel deployment.

## Decision
Use Next.js 15 with the App Router.

## Reasoning
- **SSR / RSC** — public profile pages (`/[slug]`) need server-rendered HTML for Open Graph and SEO
- **Server Actions** — removes the need for a separate API layer for CRUD operations
- **App Router** — route groups `(auth)` and `(dashboard)` let us apply different layouts cleanly
- **Vercel-native** — zero-config deployment, edge middleware, automatic image optimization

## Alternatives Considered
- Remix — good SSR story but smaller ecosystem for our needs
- Vite + React SPA — no SSR, bad for SEO on public profiles

## Consequences
- Must be careful with `"use client"` / `"use server"` boundaries
- Server Actions are async — all form mutations go through `actions/` folder
