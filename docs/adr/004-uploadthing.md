# ADR 004 — UploadThing

**Date:** August 2026  
**Status:** Accepted

## Context
BioCard users need to upload photos (main + secondary). We need file storage that works with Next.js Server Actions and doesn't require us to manage S3 buckets.

## Decision
Use UploadThing for file uploads.

## Reasoning
- **Next.js native** — purpose-built for Next.js App Router
- **No S3 setup** — handles storage, CDN, and URL generation
- **Type-safe** — file router is fully typed
- **Free tier** — covers MVP needs

## Alternatives Considered
- Supabase Storage — possible but less ergonomic with Next.js
- Cloudinary — more features than needed, adds cost earlier
- S3 directly — too much infrastructure overhead for MVP

## Consequences
- Upload integration is deferred to Sprint 2 (placeholder UI in Sprint 1)
- `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID` required in env
