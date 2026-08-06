# BioCard

> One link. Your whole identity.

A platform for developers, creators, and online communities to build beautiful, personalized profile pages.

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI | shadcn/ui + Radix UI |
| Animation | Motion (Framer Motion) |
| Auth | Supabase Auth |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Validation | Zod + React Hook Form |
| File Upload | UploadThing |
| Deployment | Vercel |

## Getting Started

### 1. Clone and install

```bash
git clone <repo-url>
cd biocard
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

On Windows PowerShell, use `Copy-Item .env.example .env.local` instead.

Fill in your values:
- `DATABASE_URL` — from Supabase project settings > Database
- `DIRECT_URL` — same as DATABASE_URL for migrations
- `NEXT_PUBLIC_SUPABASE_URL` — from Supabase project settings > API
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from Supabase project settings > API
- `UPLOADTHING_SECRET` — from UploadThing dashboard
- `UPLOADTHING_APP_ID` — from UploadThing dashboard

### 3. Run database migrations

```bash
npx prisma migrate dev --name init
```

### 4. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
biocard/
├── app/               # Next.js App Router pages
├── components/        # Reusable UI components
├── features/          # Feature modules (auth, editor, preview, analytics)
├── lib/               # Utility functions, clients (Supabase, Prisma)
├── hooks/             # Custom React hooks
├── types/             # TypeScript types
├── actions/           # Next.js Server Actions
├── styles/themes/     # CSS theme variables
├── prisma/            # Database schema + migrations
├── public/            # Static assets
└── docs/adr/          # Architecture Decision Records
```

## Sprint Plan

| Sprint | Focus | Status |
|--------|-------|--------|
| Sprint 1 | Foundation (auth, DB, setup) | ✅ In progress |
| Sprint 2 | Core editor + live preview | 🔲 |
| Sprint 3 | Public profile + SEO | 🔲 |
| Sprint 4 | Analytics + polish | 🔲 |

## Architecture Decisions

See [`docs/adr/`](./docs/adr/) for why each major decision was made.
