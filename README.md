<div align="center">

# sea-specter

**A modern editorial blog built with Next.js 16, React 19, and the App Router.**

Minimal. Typographic. Server-first.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat-square&logo=clerk)](https://clerk.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

---

[Features](#features) &middot; [Tech Stack](#tech-stack) &middot; [Architecture](#architecture) &middot; [Getting Started](#getting-started) &middot; [Deployment](#deployment) &middot; [Project Structure](#project-structure)

</div>

## Overview

**sea-specter** is a full-stack editorial and gallery blog platform designed for writers, designers, and creative professionals. The public-facing site is a read-only, server-rendered experience optimized for performance and SEO. All content management happens through a protected admin panel with a rich MDX editor, dual image uploads, and one-click publishing.

Built entirely with the **Next.js 16 App Router**, it showcases modern React patterns including Server Components, Server Actions, Incremental Static Regeneration (ISR), and streaming — with zero API routes for mutations.

## Features

### Public Site
- **Broken-grid post layout** — Alternating wide and narrow cards with staggered vertical offsets using CSS Grid and `grid-flow-dense`
- **MDX-powered articles** — Rich content with custom components: `<BleedImage>`, `<Callout>`, `<StatCard>`, `<BarChart>`, `<CloudImage>`, `<PullQuote>`
- **Framer Motion animations** — Staggered fade-in effects on page load with `FadeIn`, `FadeInStagger`, and `FadeInItem` components
- **Full-bleed article layout** — Sticky close button, custom text selection styling, and responsive typography
- **Dynamic sitemap & robots.txt** — Auto-generated from published posts using `app/sitemap.ts` and `app/robots.ts`
- **SEO-optimized metadata** — Open Graph, Twitter Cards, JSON-LD structured data, and canonical URLs on every page

### Admin Panel
- **Clerk-protected dashboard** — Role-based access with middleware-level route protection
- **Create / Edit / Publish / Delete** — Full CRUD via Next.js Server Actions with Zod validation
- **Dual image uploads** — Separate cover image (for cards/OG) and post hero image via UploadThing
- **Server-side rate limiting** — In-memory sliding window rate limiter on all write operations
- **MDX live content** — Write MDX directly in the editor with custom component support

### Performance & Architecture
- **ISR with 60s revalidation** — Blog posts are statically generated and incrementally updated
- **Server Actions only** — No API routes for mutations; all writes go through `actions/posts.ts`
- **Edge middleware** — Clerk authentication at the edge for `/admin` routes
- **Prisma singleton** — Prevents connection exhaustion during development HMR

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) |
| **Animation** | [Framer Motion 11](https://www.framer.com/motion/) |
| **Database** | [PostgreSQL](https://www.postgresql.org/) via [Neon](https://neon.tech/) (serverless) |
| **ORM** | [Prisma 5](https://www.prisma.io/) |
| **Authentication** | [Clerk](https://clerk.com/) |
| **File Uploads** | [UploadThing](https://uploadthing.com/) |
| **Content** | [MDX](https://mdxjs.com/) via [next-mdx-remote 6](https://github.com/hashicorp/next-mdx-remote) (RSC) |
| **Validation** | [Zod](https://zod.dev/) |
| **Deployment** | [Vercel](https://vercel.com/) |

## Architecture

```
                        ┌─────────────────────────┐
                        │     Clerk Middleware      │
                        │   (Edge: proxy.ts)        │
                        └────────────┬────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
   ┌──────────▼──────────┐ ┌────────▼────────┐ ┌───────────▼──────────┐
   │   (public) Routes    │ │  Admin Routes   │ │    API Routes        │
   │                      │ │                 │ │                      │
   │  / (homepage)        │ │  /admin         │ │  /api/uploadthing    │
   │  /blog               │ │  /admin/[id]    │ │                      │
   │  /blog/[slug]        │ │  (create/edit)  │ └──────────────────────┘
   │  /about              │ │                 │
   └──────────┬───────────┘ └────────┬────────┘
              │                      │
              │              ┌───────▼────────┐
              │              │ Server Actions  │
              │              │ (actions/*.ts)  │
              │              │                 │
              │              │ • requireAuth() │
              │              │ • rateLimit()   │
              │              │ • zod.parse()   │
              └──────┬───────┤ • prisma.*()    │
                     │       │ • revalidate()  │
                     │       └────────┬────────┘
                     │                │
              ┌──────▼────────────────▼──────┐
              │         Prisma ORM           │
              │    (PostgreSQL / Neon)        │
              └──────────────────────────────┘
```

### Data Flow

1. **Read path** — Server Components fetch data directly from Prisma. Published posts use `generateStaticParams()` + ISR (`revalidate = 60`).
2. **Write path** — `PostForm` (client component) calls bound Server Actions → `requireAuth()` → `enforceRateLimit()` → Zod validation → Prisma mutation → `revalidatePath()`.
3. **Image uploads** — UploadThing React component uploads directly to UploadThing's CDN. The returned URL is injected into form data before the Server Action fires.

### Database Schema

```prisma
model Post {
  id             String    @id @default(cuid())
  title          String
  slug           String    @unique
  excerpt        String
  content        String    @db.Text          // MDX content
  coverImage     String?                     // Card thumbnail + OG image
  postCoverImage String?                     // Full-bleed article hero
  published      Boolean   @default(false)
  publishedAt    DateTime?
  authorId       String
  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt

  @@index([published])
}
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18.17 or later
- A [Neon](https://neon.tech/) PostgreSQL database (or any PostgreSQL instance)
- A [Clerk](https://clerk.com/) application
- An [UploadThing](https://uploadthing.com/) project

### Installation

```bash
# Clone the repository
git clone https://github.com/saimdenizertunc/sea-specter.git
cd sea-specter

# Install dependencies
npm install
```

### Environment Setup

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```

```env
# .env.local
DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/DB_NAME?sslmode=require
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
UPLOADTHING_TOKEN=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Database Setup

```bash
# Generate the Prisma client
npm run prisma:generate

# Push the schema to your database
npm run prisma:push
```

### Development

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server (webpack) |
| `npm run build` | Production build (auto-runs `prisma generate`) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint (flat config) |
| `npx tsc --noEmit` | Type-check without emitting |
| `npm run prisma:generate` | Regenerate Prisma client |
| `npm run prisma:push` | Push schema to database |
| `npm run verify:deploy -- <url>` | Smoke-test a deployed URL |

## Deployment

### Vercel (Recommended)

1. **Import** the repository in [Vercel](https://vercel.com/new)
2. **Set environment variables** (Preview + Production):
   - `DATABASE_URL`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `UPLOADTHING_TOKEN`
   - `NEXT_PUBLIC_SITE_URL` — your production URL (e.g., `https://sea-specter.vercel.app`)
3. **Deploy** — push to `main` to trigger production deployment

### Post-Deploy Verification

```bash
npm run verify:deploy -- https://your-app.vercel.app
```

This runs automated smoke checks against all critical routes:

```
PASS 200 https://your-app.vercel.app/
PASS 200 https://your-app.vercel.app/blog
PASS 200 https://your-app.vercel.app/sign-in
PASS 200 https://your-app.vercel.app/sign-up
PASS 307 https://your-app.vercel.app/admin
PASS 200 https://your-app.vercel.app/sitemap.xml
PASS 200 https://your-app.vercel.app/robots.txt
All smoke checks passed.
```

## Project Structure

```
sea-specter/
├── app/
│   ├── layout.tsx                    # Root layout: ClerkProvider + fonts
│   ├── globals.css                   # Global styles, selection, scrollbar
│   ├── sitemap.ts                    # Dynamic sitemap generation
│   ├── robots.ts                     # Dynamic robots.txt
│   ├── (public)/
│   │   ├── layout.tsx                # Nav + Footer wrapper
│   │   ├── page.tsx                  # Homepage: broken-grid post cards
│   │   ├── about/page.tsx            # About page
│   │   └── blog/
│   │       ├── page.tsx              # Blog archive listing
│   │       └── [slug]/page.tsx       # Post detail: MDX rendering + ISR
│   ├── admin/
│   │   ├── layout.tsx                # Admin header + UserButton
│   │   ├── page.tsx                  # Dashboard: list all posts
│   │   └── [id]/page.tsx             # Create (id=new) / Edit post
│   ├── api/uploadthing/
│   │   ├── core.ts                   # UploadThing file router (Clerk-protected)
│   │   └── route.ts                  # GET/POST handler
│   ├── sign-in/[[...sign-in]]/       # Clerk sign-in
│   └── sign-up/[[...sign-up]]/       # Clerk sign-up
├── actions/
│   └── posts.ts                      # Server Actions: CRUD + auth + rate limit
├── components/
│   ├── Nav.tsx                       # Hamburger menu + full-screen overlay
│   ├── Footer.tsx                    # Site footer
│   ├── PostCard.tsx                  # Broken-grid card component
│   ├── PostForm.tsx                  # Admin form: dual image upload
│   ├── ArticleLayout.tsx             # Article wrapper with sticky close
│   ├── FadeIn.tsx                    # Framer Motion fade-in system
│   ├── MdxRenderer.tsx               # MDX renderer with custom components
│   ├── MdxErrorBoundary.tsx          # Error boundary for MDX content
│   ├── BleedImage.tsx                # Full-bleed image with caption
│   ├── Callout.tsx                   # Info/warning/success/danger callout
│   ├── StatCard.tsx                  # Large number stat display
│   ├── BarChart.tsx                  # Horizontal bar chart
│   ├── CloudImage.tsx                # Cloud-hosted image component
│   └── ui/
│       ├── Button.tsx                # Variant button (default/outline/ghost/danger)
│       ├── Input.tsx                 # Labeled input with focus ring
│       └── Textarea.tsx              # Labeled textarea
├── lib/
│   ├── prisma.ts                     # Prisma singleton client
│   ├── utils.ts                      # cn() utility (clsx + tailwind-merge)
│   ├── seo.ts                        # SEO helpers: getSiteUrl, absoluteUrl, siteConfig
│   └── rate-limit.ts                 # In-memory sliding window rate limiter
├── prisma/
│   └── schema.prisma                 # Database schema
├── public/
│   ├── logo.png                      # Site logo / favicon
│   ├── about-hero.png                # About page hero image
│   └── author.png                    # Author photo
├── scripts/
│   ├── verify-deploy.mjs             # Post-deploy smoke test
│   └── vercel-deploy.ps1             # PowerShell Vercel deployment script
├── proxy.ts                          # Clerk edge middleware
├── tailwind.config.ts                # Tailwind: custom colors + fonts
├── eslint.config.mjs                 # ESLint 9 flat config
├── next.config.js                    # Next.js config: image domains
├── tsconfig.json                     # TypeScript configuration
└── .env.example                      # Environment variable template
```

## Design

### Typography

- **Playfair Display** — Serif headings (`--font-serif`)
- **Inter** — Sans-serif body text (`--font-sans`)
- **JetBrains Mono** — Code blocks (`--font-mono`)

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `swaddle-base` | `#F5F5F5` | Background |
| `swaddle-ink` | `#0F0F0F` | Text / Foreground |

Global text selection uses inverted colors: `selection:bg-swaddle-ink selection:text-swaddle-base`.

### Custom MDX Components

| Component | Description |
|---|---|
| `<BleedImage>` | Full-width image that breaks out of the content column, with optional caption |
| `<CloudImage>` | Responsive cloud-hosted image with optional caption |
| `<Callout>` | Styled callout box — `info`, `warning`, `success`, or `danger` variants |
| `<StatCard>` | Large-number statistic display card |
| `<BarChart>` | Horizontal bar chart with labeled data points |
| `<PullQuote>` | Typographic pull quote for editorial emphasis |

## Key Implementation Details

### Next.js 16 Async Params

Dynamic route params are `Promise`-based in Next.js 16 and must be awaited:

```tsx
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
}
```

### Server Actions Pattern

All mutations flow through Server Actions — no API routes:

```
PostForm (client) → Server Action → requireAuth() → enforceRateLimit() → Zod parse → Prisma → revalidatePath()
```

### UploadThing URL Handling

Handles both legacy and current UploadThing URL formats:

```ts
const url = (res[0] as { url?: string; ufsUrl?: string }).ufsUrl ?? res[0].url
```

## License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Built with Next.js, Tailwind CSS, and Framer Motion.

</div>
