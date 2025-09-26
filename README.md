This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project setup (env + QStash)

- Copy `.env.example` to `.env.local` and fill values for local dev (do not commit real secrets).
- On Vercel, set Environment Variables:
	- `QSTASH_CURRENT_SIGNING_KEY`, `QSTASH_NEXT_SIGNING_KEY` (required for QStash signature verification)
	- `QSTASH_TOKEN` (optional; only if creating schedules programmatically)
	- Other secrets like database and Stripe keys
- Schedule on Upstash QStash:
	- Target: `POST https://<your-app>.vercel.app/api/monitor-pending-payments`
	- Cron: `*/5 * * * *` (or your desired cadence)
	- The route validates QStash signatures via `verifySignatureAppRouter`.

### Local testing with ngrok + QStash
- Start Next.js: `npm run dev`
- Start ngrok via Docker Compose: `docker compose up -d ngrok`
- Open `http://localhost:4040` and copy the HTTPS forwarding URL
- One-off publish from QStash:
	- `curl -X POST -H "Authorization: Bearer <QSTASH_TOKEN>" "https://qstash.upstash.io/v2/publish/https://<ngrok-url>/api/monitor-pending-payments"`
- Optional schedule test (requires persistent tunnel): add header `Upstash-Cron: */5 * * * *`

### Production checklist
- Set `QSTASH_CURRENT_SIGNING_KEY` and `QSTASH_NEXT_SIGNING_KEY` in Vercel
- Point QStash schedule to production URL (POST)
- Keep GET with `CRON_SECRET` only for manual tests
- Do not commit real secrets; use `.env.local` for dev and Vercel env vars for prod
