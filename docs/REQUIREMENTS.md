# empowerBiz requirements

## Product goal
Build one multi-tenant commerce SaaS codebase, deployment, and database for Kenyan businesses. Each business can operate a branded online shop and optionally list products in a shared marketplace.

## Actors
- Platform super-admin: provisions tenants, plans, and platform settings.
- Tenant owner: full control of their business space.
- Manager: operational access granted by the owner.
- Staff: limited access based on permissions.
- Customer: browses shops, checks out, and views only their own records.
- Anonymous shopper: browses public catalogues and builds a session cart.

## Core requirements
1. Provision businesses idempotently with unique slugs, owner invitations, plans, trial dates, and setup status.
2. Resolve each request into marketplace or tenant context from canonical host/domain mapping.
3. Provide product, variant, category, inventory, image, customer, address, cart, order, fulfilment, and analytics workflows.
4. Allow tenant storefront, marketplace listing, or both at tenant and product levels.
5. Support shop branding and configuration without separate deployments.
6. Provide safe search, filtering, sorting, pagination, shareable query URLs, KES prices, stock labels, delivery messaging, accessible and responsive pages.
7. Model one customer checkout as an order with seller-scoped sub-orders for marketplace fulfilment.
8. Support COD and an M-Pesa Daraja provider interface. Never accept client claims as payment proof.
9. Track payment attempts, refunds, returns, commissions, settlements, subscription invoices, and an auditable money ledger.
10. Provide delivery zones, fees, shipments, tracking, coupons, reviews, notifications, audit events, and reporting.
11. Enforce least-privilege role checks server-side and row isolation with RLS for every tenant-owned table and storage object.
12. Abstract services that require credentials behind testable provider interfaces; clearly mark mocks and missing credentials.

## Non-functional requirements
- Security: input validation, least privilege, secure secrets, tenant isolation, authenticated callbacks, idempotency, audit history.
- Reliability: explicit state machines, retriable jobs, transaction boundaries, duplicate/replay safety.
- Performance: indexes follow access patterns; cursor or bounded pagination; avoid N+1 queries; use caching only with tenant-aware keys.
- Accessibility: semantic structure, keyboard support, focus handling, contrast, useful labels.
- Operability: migrations, typed database contract, logs/metrics, backup and recovery guide, known issue tracking.
- SEO: canonical URLs and metadata for public marketplace and shop pages.
- Locale: KES defaults and Africa/Nairobi presentation; business configuration may extend locales later.

## Acceptance contract
Features are not claimed complete without implementation and test evidence. Provider mocks are labeled mock only. Real payment, email, SMS, DNS/SSL, and deployment integrations remain credential-gated.
