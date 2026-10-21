# Frontend architecture

## Responsibilities

This repository owns the Next.js App Router experience: public marketplace, independent shop and product pages, cart/checkout screens, customer order history, merchant workspace, platform dashboard, and shared design components. Business rules, session verification, authorization, and persistence belong to the backend repository.

## Request path

Browser -> Next.js route or Server Action -> `src/lib/backend-api.ts` -> loopback Fastify API -> backend service -> PostgreSQL-compatible local database.

Server components call typed helper functions in `src/lib/commerce.ts` and `src/lib/local-auth.ts`. These are API clients only; they contain no SQL and do not make direct browser-to-backend requests. The Next.js Server Action layer validates form shape, forwards the request's origin and HttpOnly cookies, handles redirects, and revalidates the affected page. The backend remains responsible for every authorization decision.

The backend issues `empowerbiz_local_session` with `HttpOnly`, `SameSite=Lax`, and `Path=/`. The frontend server forwards the cookie to the backend. It never reads the session token in browser JavaScript.

## Configuration and local run

Set `NEXT_BACKEND_URL` in `.env.local`, defaulting to `http://127.0.0.1:4000`. Start the backend repository first, then run `npm run dev` here. Next.js listens on `127.0.0.1:3000`.

## Boundaries

- Do not add database drivers, schema, SQL, password hashing, or payment logic to this repo.
- Do not trust UI checks as authorization; the API repeats all access checks.
- Do not put session tokens or private API configuration into client components.
- Keep UI types aligned with the JSON API contract documented in the backend repository.
- API reads are uncached (`cache: no-store`) so current local inventory and authorization state appear promptly.

## Future deployment

This local setup is single-machine development only. A public deployment needs a secure API origin, CSRF/origin handling for deployed domains, shared durable database, hosted auth/session strategy, rate limiting, TLS, observability, backup/recovery, and the security work described in the backend docs.
