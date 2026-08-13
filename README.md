# BioCard

> One link. Your whole identity.

A modern platform for building personalized profile pages with live preview and customizable themes.

## Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **UI Components:** shadcn/ui + Radix UI
- **Animation:** Framer Motion
- **Authentication:** Supabase Auth
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma
- **Validation:** Zod + React Hook Form
- **File Storage:** UploadThing
- **Hosting:** Vercel

## Architecture

This project follows a feature-based structure with clear separation of concerns:

```
app/                  # Routes and pages (Next.js App Router)
components/           # Shared UI components and layouts
features/             # Feature modules (auth, editor, preview, analytics)
lib/                  # Utilities, clients, and helpers
hooks/                # Custom React hooks
types/                # TypeScript type definitions
actions/              # Next.js Server Actions
styles/themes/        # Theme configurations
prisma/               # Database schema and migrations
docs/adr/             # Architecture Decision Records
```

For design rationale and technical decisions, see [Architecture Decision Records](./docs/adr/).

## Development

Refer to `package.json` for available commands and setup requirements.
