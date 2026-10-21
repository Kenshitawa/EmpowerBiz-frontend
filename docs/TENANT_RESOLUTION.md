# Tenant resolution

## Context types
1. Marketplace: canonical platform host; catalogue reads only show approved marketplace-enabled products.
2. Tenant shop: verified mapped subdomain or custom domain with an active tenant.
3. Platform console: canonical platform control-plane route, never inferred from a shop slug.

## Resolution order
1. Normalize Host: lowercase, remove port and trailing dot, IDNA-normalize, reject malformed/ambiguous values.
2. Match exact hostname against tenant_domains. Marketplace host maps to marketplace context.
3. Tenant host must be active, verified where custom, and not suspended. Reject unknown or conflicting mappings.
4. Load the tenant's public config from a server-side cache keyed by hostname and tenant id. Never trust a client-supplied tenant identifier.
5. For protected routes, validate the Supabase session and membership server-side. Recheck the membership status and permissions for the resolved tenant.
6. Pass a typed immutable RequestContext into domain services. Each database write carries the server-resolved tenant id.
7. RLS independently verifies the caller's membership and resource relationship. Route authorization and RLS are both mandatory.

## Custom domain lifecycle
Requested -> DNS challenge issued -> ownership verified -> TLS provisioned -> active -> suspended or removed. A pending/unverified hostname never serves tenant data. Domain moves are audited and invalidate host caches.

## Safety
- Reject Host header injection and wildcard matching that can cross tenant boundaries.
- Do not select a tenant from query parameters, form fields, local storage, user metadata, or arbitrary subdomain suffixes.
- Cross-tenant routes return not found or denied without leaking existence.
- Marketplace carts can contain multiple tenant items; each line preserves seller identity for checkout validation.
