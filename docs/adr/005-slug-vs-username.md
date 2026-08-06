# ADR 005 — Slug Separated from Username

**Date:** August 2026  
**Status:** Accepted

## Context
Early design had `slug = username` as a hard rule. This creates flexibility problems for the future.

## Decision
`username` (account identity) and `slug` (public URL) are stored separately in the database.

## Reasoning
- **Flexibility** — a user with username `syfa` can have their public URL as `/frontend-builder`
- **Future multi-profile** — when we support multiple profiles per user (V2), each profile needs its own slug independent of the username
- **Theme marketplace** — if we ever allow transferring profiles, slug can be reassigned without touching the auth username
- **Default behavior** — slug defaults to username on registration, so V1 UX is identical; flexibility is structural, not surfaced yet

## Consequences
- `Profile.slug` is a separate `@unique` field from `User.username`
- Slug is editable before first publish; locked after publish (V1)
- Both `username` and `slug` are validated against the same reserved list
- `User` table: `username` field. `Profile` table: `slug` field. Never conflated.
