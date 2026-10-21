# Frontend progress

## Current state

The presentation layer has been separated from the original integrated Next.js application. Pages and shared components now use the Fastify backend through server-only HTTP helpers. The backend owns PGlite, authentication, checkout, catalog, onboarding, and tenant authorization.

## Included UI

- Original responsive empowerBiz marketplace landing page, search/filter/pagination, shops, product detail, cart, and checkout.
- Merchant login/dashboard, products, orders and fulfilment UI.
- Platform dashboard, shop onboarding and owner-invitation screens.
- Customer registration, checkout prefill and account-scoped order history.
- HttpOnly cookie forwarding through Next.js server requests.

## Checks

- TypeScript: passed.
- ESLint: passed.
- Vitest: passed, 2 tests.
- Playwright: passed, 6 browser tests against the separate local backend.
- Production build: passed.
- Frontend expects backend at `http://127.0.0.1:4000` and does not run without it.

## Remaining work

- Finish and record typecheck, lint, production build and browser integration checks against the backend repo.
- Keep API response types synchronized with backend contract.
- Improve error/loading states for API unavailable cases.
- Continue the product feature roadmap in the original requirements and plan documents.
