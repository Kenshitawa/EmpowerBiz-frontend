# empowerBiz implementation plan — local-first revision

The user steered the build to run locally before considering Supabase or GitHub. This revision is binding until they change direction. The existing Supabase account and project setup remain deferred; no Supabase or GitHub operations are part of local implementation.

## Phase 0: Project setup and product contract
Completed: Next.js/TypeScript/Tailwind/ui/test foundation, requirements and architecture docs, environment hygiene, local Git repository.

## Phase 1: Local data and identity
Implement persistent PostgreSQL-compatible local schema, deterministic demo shops/catalogue, local password auth/session, migration/seed workflow, server-side tenant scoping, authorization tests, and local database recovery notes.

## Phase 2: Platform admin and business onboarding
Platform shop/plan views, business create/edit/pause workflow, unique slugs, owner invitation/setup tracking, safe retries and onboarding tests.

## Phase 3: Tenant workspace
Role-aware product, inventory, orders, fulfilment, customers, staff, branding, settings, and reporting views. Validate every write and enforce membership scope server-side.

## Phase 4: Storefront and checkout
Independent shop routes, marketplace catalogue, search/category/price filters, sorting and pagination, product stock, persistent cart, customer checkout, seller-split orders, and order history.

## Phase 5: Payment and delivery adapters
COD; provider contracts and safe no-credential adapters for M-Pesa/delivery; payment attempts, explicit pending/paid state transitions, webhook verification contract and replay tests. No live integration without credentials.

## Phase 6: Marketplace operations
Seller profiles/verification, moderation, product approval, multi-seller ordering and split fulfilment, reviews, comparison, marketplace metadata.

## Phase 7: Money operations
Auditable ledger, commissions, settlement/payout and refund/return records, SaaS subscription plans/invoices/limits/renewals, admin controls.

## Phase 8: Hardening
Email/SMS adapters, audit coverage, request limits, fraud hooks, durable job/outbox pattern, backup/recovery, monitoring, accessibility/security/performance review, and deployment documentation.

## Phase gates
Run dependency install (when dependencies change), type-check, lint, unit/integration/e2e tests, production build, and database/schema tests. Keep docs and known issues current. Commit each genuinely completed phase only after its gate. During the local-only phase gates, do not contact remote Supabase, GitHub, or cloud services. Hosted RLS/advisor/deployment gates happen after the user opts into that phase.

## Constraints
- Live M-Pesa, email, SMS, DNS/TLS, hosting, and production auth need external credentials/manual setup.
- The local demo database is single-process and does not yet enforce database RLS; the current application is not a public-production-ready multitenant service.
- Keep SQL PostgreSQL-compatible to reduce the later hosted database migration.
