# Visual Curation Feed

A two-part visual curation app:

- A private Chrome extension that extracts rendered images from the current page and saves selected visuals.
- A public Next.js feed that displays saved images from Supabase Storage and metadata from Supabase Postgres.

## Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Confirm the public Supabase Storage bucket named `feed-images` was created by the SQL.
4. Copy `.env.example` to `.env.local` and fill in the values. Supabase may call the browser key either `anon` or `publishable`; this app supports both.
5. Install dependencies and run the app:

```bash
npm install
npm run dev
```

In this Codex desktop environment, use the local fallback scripts:

```bash
npm run dev:local -- --port 3002
npm run build:wasm
```

## Extension Setup

1. Open `chrome://extensions`.
2. Enable Developer Mode.
3. Click **Load unpacked** and choose the `extension` folder.
4. Click the extension icon on any page.
5. Open the extension options and set the API base URL plus API key.

For local development, the API base URL is usually `http://localhost:3000`.

## Deployment

Deploy the Next.js app on Vercel and add the same environment variables there. The public feed is `/`; the private dashboard is `/dashboard`.

To keep a free Supabase project awake, create a free cron-job.org job that pings:

```text
https://your-app.vercel.app/api/health
```
