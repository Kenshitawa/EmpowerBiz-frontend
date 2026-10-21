# Known issues

## KI-001 — Local database does not yet enforce row-level security
- PGlite/PostgreSQL-compatible data persists locally, but RLS policies are not implemented.
- Merchant writes derive tenant scope from the server-verified local session and membership, and merchant reads include tenant filters. Authorization tests are still required.
- Impact: do not expose the app as a public multitenant service or connect a hosted database before RLS, adversarial cross-tenant tests, and review are complete.

## KI-002 — Local database runtime boundary
- PGlite is an embedded single-process local development database, not a shared or serverless production datastore.
- Database files are stored under ignored .local/database. Keep a backup if local orders/catalogue changes matter.
- No reset command is supplied.

## KI-003 — External integrations deferred
- M-Pesa checkout is a preview choice that creates a pending order and does not send a payment request or mark paid.
- Delivery, email/SMS, cloud storage, domain DNS/TLS, subscriptions and deployment are not connected.

## KI-004 — Development dependency advisories
- Full npm audit previously reported 9 high advisories in development/build dependencies; production dependency audit reported zero.
- npm audit fix proposed a forced Next 14 eslint config downgrade, which was rejected to avoid a framework-version mismatch. Recheck upstream compatible releases.

## KI-005 — Visual reference unavailable
- The Techsmart reference page could not be opened by the previous available web tool, and no reference screenshots existed. The original design is based on product requirements, not claimed observation.

## KI-006 — Supabase MCP target mismatch (deferred)
- Prior Supabase app tools reported a project other than the configured project. No remote writes were made.
- User subsequently requested local-first work. Supabase tool authentication/target synchronization is deferred and does not block the local preview.
