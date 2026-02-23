# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js, uses webpack explicitly)
npm run build        # Production build (auto-runs prisma generate first)
npm run lint         # ESLint flat config (eslint.config.mjs) — do NOT create .eslintrc.json
npx tsc --noEmit     # Type-check without emitting

npm run prisma:generate   # Regenerate Prisma client after schema changes
npm run prisma:push       # Push schema to DB (run once after DATABASE_URL is set)
npm run verify:deploy -- <url>  # Smoke-check a deployed URL (node scripts/verify-deploy.mjs)
```

There are no tests in this project.

## Architecture

**sea-specter** is an editorial/gallery blog. The public-facing side is read-only; all content management happens under `/admin`, protected by Clerk.

### Route Groups

- `app/(public)/` — Wraps pages in `<Nav />` and `<Footer />`. Contains the homepage (`page.tsx`), the archive listing (`blog/page.tsx`), the about page (`about/page.tsx`), and the post detail page (`blog/[slug]/page.tsx`).
- `app/admin/` — Protected admin panel with its own layout (header + `<UserButton />`). The catch-all editor route `app/admin/[id]/page.tsx` handles both create (`id === 'new'`) and edit (any real post ID).
- `app/sign-in/[[...sign-in]]/` and `app/sign-up/[[...sign-up]]/` — Catch-all Clerk auth pages.
- `app/api/uploadthing/` — UploadThing file router (Clerk-authenticated, images only, 4 MB max).
- `app/sitemap.ts` and `app/robots.ts` — Dynamic sitemap (published posts only) and robots generation; use `absoluteUrl()` from `lib/seo.ts`.

### Data Flow

Server Actions in `actions/posts.ts` are the only write path — no API routes for mutations. Each action calls `requireAuth()` (wraps `await auth()` from Clerk), applies rate limiting via `enforceRateLimit()` from `lib/rate-limit.ts`, validates input with a Zod schema (`postInputSchema`), mutates via `prisma`, then calls `revalidatePath` on affected routes. `createPost`, `deletePost` also call `redirect`. `publishPost` is a **toggle** — it flips `published` and sets `publishedAt` only on first publish.

`PostForm` (client component) binds server actions: `updatePost.bind(null, post.id)` or `createPost`, injecting image state via `formData.set` before calling the action. The form manages **two separate image states** — `coverImage` (used on cards/homepage) and `postCoverImage` (used as the hero in the single-post view) — each with its own `<UploadButton>`.

### Prisma Schema

The `Post` model has two image fields:
- `coverImage` — thumbnail shown in grid cards and OG metadata
- `postCoverImage` — full-bleed hero shown only on the article page

Both are nullable strings. The admin dashboard lists posts ordered by `createdAt DESC`; the public homepage filters by `published: true`.

Blog post pages use `generateStaticParams()` (pre-renders published posts) and `export const revalidate = 60` for ISR.

### Key Patterns

**Dynamic route params must be awaited** (Next.js 16):
```ts
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
}
```

**Clerk middleware** lives in `proxy.ts` (not `middleware.ts`) and uses `await auth.protect()`:
```ts
clerkMiddleware(async (auth, req) => {
  if (isAdminRoute(req)) await auth.protect()
})
```

**UploadThing URL** — uploaded file URL may be `ufsUrl` or `url` depending on version; always use:
```ts
const url = (res[0] as { url?: string; ufsUrl?: string }).ufsUrl ?? res[0].url
```

**Homepage grid** — `PostCard` uses index-based layout: `index % 3 === 0` → `md:col-span-2 aspect-[16/9]` (wide), otherwise `aspect-[3/4]`. Odd-indexed narrow cards get `md:translate-y-12` for the broken-grid offset. Parent uses `grid-flow-dense`.

**MdxRenderer** — uses `next-mdx-remote/rsc` (`MDXRemote` from the `/rsc` import, not the client version). Custom components override all prose elements with Tailwind classes; there is no `@tailwindcss/typography` prose wrapper applied in the renderer. Available custom MDX components: `<BleedImage>` (full-bleed image with caption), `<Callout type="info|warning|success|danger">`, `<StatCard>`, `<BarChart>`, `<CloudImage>`, `<PullQuote>`.

**ArticleLayout** — wraps blog post content in a container with `selection:bg-swaddle-ink` and a fixed sticky "Close" button (links to `/blog`).

**SEO utilities** (`lib/seo.ts`) — `getSiteUrl()` reads `NEXT_PUBLIC_SITE_URL` (falls back to `localhost:3000`); `absoluteUrl(path)` prepends the site URL; `siteConfig` holds the site name/description/keywords.

### Design Tokens

Custom Tailwind colors (defined in `tailwind.config.ts`):
- `swaddle-base` → `#F5F5F5` (background)
- `swaddle-ink` → `#0F0F0F` (text/foreground)

Fonts: `--font-serif` (Playfair Display), `--font-sans` (Inter), `--font-mono` (JetBrains Mono).

Global selection style: `selection:bg-swaddle-ink selection:text-swaddle-base`.

### Environment Variables

```
DATABASE_URL                          # Neon PostgreSQL pooled connection
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
UPLOADTHING_TOKEN
NEXT_PUBLIC_SITE_URL                  # Production URL (e.g. https://sea-specter.vercel.app) — used by sitemap, robots, and OG metadata
```

Clerk also needs redirect URLs configured in its dashboard (sign-in/sign-up → `/admin`).
