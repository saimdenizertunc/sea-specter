# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (Next.js)
npm run build        # Production build
npm run lint         # ESLint flat config (eslint.config.mjs) — do NOT create .eslintrc.json
npx tsc --noEmit     # Type-check without emitting

npm run prisma:generate   # Regenerate Prisma client after schema changes
npm run prisma:push       # Push schema to DB (run once after DATABASE_URL is set)
```

There are no tests in this project.

## Architecture

**sea-specter** is an editorial/gallery blog. The public-facing side is read-only; all content management happens under `/admin`, protected by Clerk.

### Route Groups

- `app/(public)/` — Wraps pages in `<Nav />`. Contains the homepage (`page.tsx`) and `blog/[slug]/page.tsx`.
- `app/admin/` — Protected admin panel with its own layout (header + `<UserButton />`). The catch-all editor route `app/admin/[id]/page.tsx` handles both create (`id === 'new'`) and edit (any real post ID).
- `app/sign-in/[[...sign-in]]/` and `app/sign-up/[[...sign-up]]/` — Catch-all Clerk auth pages (centered `<SignIn />` / `<SignUp />`).
- `app/api/uploadthing/` — UploadThing file router (Clerk-authenticated, images only, 4 MB max).

### Data Flow

Server Actions in `actions/posts.ts` are the only write path — no API routes for mutations. Each action calls `requireAuth()` (wraps `await auth()` from Clerk), mutates via `prisma`, then calls `revalidatePath` on affected routes. `createPost` and `deletePost` also call `redirect`.

`PostForm` (client component) binds server actions: `updatePost.bind(null, post.id)` or `createPost`, injecting `coverImage` state (managed by UploadThing's `<UploadButton>`) via `formData.set` before calling the action.

### Key Patterns

**Dynamic route params must be awaited** (Next.js 16):
```ts
// app/blog/[slug]/page.tsx — correct pattern
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
}
```

**Clerk middleware** lives in `proxy.ts` (not `middleware.ts`) and uses `auth().protect()` (not `auth.protect()`):
```ts
clerkMiddleware((auth, req) => {
  if (isAdminRoute(req)) auth().protect()
})
```

**UploadThing URL** — uploaded file URL may be `ufsUrl` or `url` depending on version; always use:
```ts
const url = (res[0] as { url?: string; ufsUrl?: string }).ufsUrl ?? res[0].url
```

**Homepage grid** — `PostCard` uses index-based layout: `index % 3 === 0` → `md:col-span-2 aspect-[16/9]` (wide), otherwise `aspect-[3/4]`. Odd-indexed narrow cards get `md:translate-y-12` for the broken-grid offset. Parent uses `grid-flow-dense`.

**MdxRenderer** — uses `next-mdx-remote/rsc` (`MDXRemote` from the `/rsc` import, not the client version). Custom components override all prose elements with Tailwind classes; there is no `@tailwindcss/typography` prose wrapper applied in the renderer.

### Environment Variables

```
DATABASE_URL                          # Neon PostgreSQL pooled connection
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
UPLOADTHING_TOKEN
```

Clerk also needs redirect URLs configured in its dashboard (sign-in/sign-up → `/admin`).

