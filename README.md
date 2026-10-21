# empowerBiz frontend

The original, responsive empowerBiz storefront and merchant/platform UI, built with Next.js App Router, React, TypeScript and Tailwind CSS. This repository contains presentation, routing, and thin Next.js Server Actions. Authentication, catalogue reads, cart/checkout, tenant authorization and database access live in [EmpowerBiz-backend](https://github.com/Kenshitawa/EmpowerBiz-backend).

## Run locally

Requires Node.js 20 or newer. Start the backend in its repository first. Then:

```sh
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000). `.env.local` sets `NEXT_BACKEND_URL=http://127.0.0.1:4000`. The browser does not call the backend directly; Next.js server components and Server Actions forward requests and the HttpOnly session cookie.

## Demo accounts

- Merchant: `owner@mauahouse.local` / `Karibu123!`
- Platform admin: `admin@empowerbiz.local` / `Karibu123!`

These credentials are for the local preview only.

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

For browser coverage, run the backend separately before `npm run test:e2e`. The frontend does not own the local database. See the backend repository for local data, API and security boundaries.
