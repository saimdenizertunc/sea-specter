# sea-specter

Next.js 16 app using Prisma, Clerk, and UploadThing.

## Deploy to Vercel (Git Integration)

This repo is ready for Vercel deployment from `main`.

### 1. Import project

1. In Vercel, click `Add New -> Project`.
2. Import `saimdenizertunc/sea-specter`.
3. Keep framework auto-detected as `Next.js`.
4. Keep defaults:
- Install: `npm install`
- Build: `npm run build`
- Output: default
- Production branch: `main`

### 2. Configure environment variables (Preview + Production)

Required:
- `DATABASE_URL`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `UPLOADTHING_TOKEN`
- `NEXT_PUBLIC_SITE_URL`

Set `NEXT_PUBLIC_SITE_URL` to your Vercel production URL:
- `https://<project>.vercel.app`

### 3. Deploy

Push to `main` to trigger production deployment.
Open the Vercel deployment logs and verify build passes.

### 4. Post-deploy checks

Run smoke checks against your production URL:

```bash
npm run verify:deploy -- https://<project>.vercel.app
```

Manual checks:
- `/`
- `/blog`
- `/sign-in`
- `/sign-up`
- `/admin` (should require auth when signed out)
- `/sitemap.xml`
- `/robots.txt`

## Optional CLI flow

If you want Vercel CLI deployment:

```bash
npx vercel login
npx vercel link
npx vercel
npx vercel --prod
```

### Automated CLI deploy from this repo

You can run the included PowerShell script after exporting required env vars:

```powershell
$env:DATABASE_URL="..."
$env:CLERK_SECRET_KEY="..."
$env:NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="..."
$env:UPLOADTHING_TOKEN="..."
$env:NEXT_PUBLIC_SITE_URL="https://<project>.vercel.app"
.\scripts\vercel-deploy.ps1 -VercelToken "<your_vercel_token>"
```
