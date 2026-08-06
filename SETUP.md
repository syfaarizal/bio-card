# BioCard — Setup Guide (Sprint 1)

Follow these steps after cloning the repo.

## 1. Install dependencies

```bash
npm install
```

## 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:

```env
# From Supabase → Project Settings → Database
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[PASSWORD]@db.[REF].supabase.co:5432/postgres?pgbouncer=true

# From Supabase → Project Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://[REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[YOUR_ANON_KEY]

# From UploadThing Dashboard
UPLOADTHING_SECRET=sk_live_[YOUR_SECRET]
UPLOADTHING_APP_ID=[YOUR_APP_ID]

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 3. Generate Prisma client

```bash
npx prisma generate
```

This resolves all `@prisma/client` TypeScript types.

## 4. Run database migration

```bash
npx prisma migrate dev --name init
```

This creates all tables in your Supabase PostgreSQL database.

## 5. Configure Supabase Auth

In Supabase Dashboard:
- **Authentication → Email** → Enable "Confirm email"
- **Authentication → URL Configuration** → Set Site URL to `http://localhost:3000`
- Add redirect URL: `http://localhost:3000/auth/callback`

## 6. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 7. Deploy to Vercel

```bash
# Push to GitHub first, then:
vercel deploy
```

Add all environment variables in Vercel Dashboard → Project Settings → Environment Variables.

## What's working in Sprint 1

- ✅ Landing page (`/`)
- ✅ Register with email verification (`/register`)
- ✅ Login / Logout (`/login`)
- ✅ Forgot password (`/forgot-password`)
- ✅ Auth callback (`/auth/callback`)
- ✅ Dashboard with sidebar + header (`/dashboard`)
- ✅ Profile editor with live preview (`/dashboard/profile`)
- ✅ Auto-save (debounce 1.5s) with status indicator
- ✅ Theme picker (5 presets)
- ✅ Social links editor
- ✅ Spotify URL parser (fetches song + artist + album art)
- ✅ Image upload UI (UploadThing integration — Sprint 2)
- ✅ Publish / Unpublish profile
- ✅ Public profile page (`/[slug]`) with SEO + Open Graph
- ✅ Analytics dashboard with anti-spam view counter
- ✅ Settings (change password, soft delete account)
- ✅ robots.txt, sitemap.xml, manifest.webmanifest
- ✅ 404 page
- ✅ Reserved slug validation
- ✅ 5 ADR documents

## Sprint 2 TODO

- [ ] UploadThing file router + upload hooks
- [ ] Image upload in editor (replace placeholder UI)
- [ ] Preview device switcher (Desktop / Tablet / Mobile)
- [ ] Polish animations with Motion
