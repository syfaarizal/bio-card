# BioCard

> One link. Your whole identity.

A platform for building personalized profile pages — avatar, banner, bio, links, gallery,
now-playing, birthday and theme — with a live preview that matches the public page exactly.

## Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** Motion (`motion/react`)
- **Authentication:** Supabase Auth (email/password, SSR via `@supabase/ssr`)
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma 7 (`@prisma/adapter-pg` driver adapter)
- **Validation:** Zod + React Hook Form
- **File Storage:** UploadThing
- **Hosting:** Vercel

## Features

- **One card, one layout.** The public page and the editor preview render the same
  `ProfileLayout`, so what you edit is exactly what visitors see.
- **Seven themes.** Default, Midnight, Rose, Cyber, Cyber Red, Soft Green and Glass. A theme is
  a set of CSS custom properties (`--theme-panel`, `--theme-accent`, `--theme-ring`, …) defined
  once in `styles/themes/index.css`.
- **Avatar decorations.** Six rings — Plain, Sakura, Cyber, Red Angel, Ember and Moon — drawn
  as SVG overlays that *are* the avatar border. The photo is inset to meet each ring exactly.
- **Image focal point.** Every framed image (avatar, banner, gallery) can be re-cropped by
  dragging a focal point, with zoom applied by resizing the clipping stage rather than
  transforming the raster.
- **Spotify now-playing.** Picked from the Spotify embed and stored per profile.
- **Analytics.** Profile views broken down by day, referrer and period.
- **Public SEO.** Per-profile metadata, Open Graph tags and a generated sitemap.

## Architecture

Feature-based, with a shared layer for anything the card and the editor both need:

```
app/                  # Routes and pages (Next.js App Router)
  (auth)/             # Login, register, password reset
  (dashboard)/        # Dashboard, profile editor, analytics, settings
  [slug]/             # Public profile page
  preview-frame/      # The editor's live-preview iframe
actions/              # Next.js Server Actions (auth, profile, analytics)
components/
  layout/             # Dashboard chrome
  shared/             # Card-level pieces (avatar decoration, focused image, brand icon)
features/
  auth/ editor/ preview/ public/ analytics/ shared/
lib/                  # Prisma client, Supabase clients, validation, image & theme helpers
hooks/                # use-auto-save, use-debounce
types/                # Prisma-backed types and the theme registry
styles/themes/        # Theme token definitions
prisma/schema.prisma  # Database schema
docs/adr/             # Architecture Decision Records
```

### Things worth knowing

- **Themes are one file.** `styles/themes/index.css` defines every token per theme; the card
  reads them through arbitrary Tailwind values like `bg-[var(--theme-panel)]`.
- **The preview is an iframe.** `app/preview-frame/` runs the real card in a 390px frame, so
  container queries inside resolve against the frame, not the editor window.
- **Container queries, not viewport breakpoints.** The card sizes itself with `@container` /
  `@sm:` so it adapts to the space it is given.
- **Focal points resize the stage.** `lib/image-focus.ts` explains why `transform: scale()` is
  wrong here and what the offsets mean.

For design rationale and technical decisions, see [Architecture Decision Records](./docs/adr/).

## Development

```bash
npm install
npx prisma db push   # apply schema.prisma to the database
npm run dev
```

Refer to `package.json` for the remaining scripts and setup requirements.
