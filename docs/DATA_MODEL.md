# empowerBiz database schema and ER model

This is the target schema contract. It is a design document only; migrations are not applied until Phase 1 and the project target is verified. Public tenant data must be RLS protected. Use UUID primary keys, UTC timestamptz, integer minor units for money, explicit checks/enums for state, and indexes for FK and tenant access paths.

## Entity groups

### Platform and identity
- tenants: id, name, slug, status, plan_id, trial_ends_at, settings, created_at, updated_at.
- tenant_domains: id, tenant_id nullable for marketplace host, hostname, kind (subdomain/custom/marketplace), verified_at, is_primary, status.
- profiles: auth user id, display_name, phone, created_at, updated_at.
- roles: id, tenant_id nullable for platform roles, name, description, is_system.
- permissions: id, key, description.
- role_permissions: role_id, permission_id.
- memberships: id, tenant_id, user_id, role_id, status, invited_at, joined_at.
- plans: id, code, name, pricing, billing_interval, limits, features, status.
- subscriptions: id, tenant_id, plan_id, status, trial_ends_at, period_start/end, cancel_at.
- invoices: id, tenant_id, subscription_id, number, currency, subtotal_minor, tax_minor, total_minor, status, due_at, paid_at.

### Catalogue and inventory
- categories: id, tenant_id, parent_id, slug, name, status, sort_order.
- products: id, tenant_id, category_id, slug, title, description, brand, currency, publication_status, shop_enabled, marketplace_enabled, approval_state, created_at.
- variants: id, tenant_id, product_id, sku, option_values, price_minor, compare_at_minor, weight, status.
- inventory: id, tenant_id, variant_id, location_id, on_hand, reserved, reorder_level, updated_at.
- inventory_movements: id, tenant_id, variant_id, quantity_delta, reason, reference_type/id, actor_id, created_at.
- product_images: id, tenant_id, product_id, storage_path, alt_text, sort_order.
- branding_config: tenant_id, logo_path, theme_tokens, banners, layout_options, public_config.

### Customer and commerce
- customers: id, tenant_id, auth_user_id nullable, email, phone, display_name.
- addresses: id, tenant_id, customer_id, recipient, phone, country, county, town, address_lines, delivery_instructions.
- wishlists: id, tenant_id, customer_id, name.
- wishlist_items: id, tenant_id, wishlist_id, product_id, variant_id.
- carts: id, tenant_id nullable for marketplace, customer_id nullable, session_id, currency, expires_at.
- cart_items: id, cart_id, tenant_id, product_id, variant_id, quantity, added_at.
- coupons_promotions: id, tenant_id nullable for platform campaign, code, kind, value, rules, starts_at, ends_at, usage_limits, status.
- orders: id, tenant_id nullable for marketplace parent, customer_id, order_number, source, status, currency, totals snapshot, idempotency_key, placed_at.
- sub_orders: id, order_id, tenant_id, seller_order_number, status, item_total_minor, delivery_minor, commission_minor, currency.
- order_items: id, order_id, sub_order_id, tenant_id, product_id, variant_id, title/sku/option snapshots, unit_price_minor, quantity, line_total_minor.
- order_status_history: id, order_id, sub_order_id nullable, tenant_id, old_status, new_status, actor_id, note, created_at.

### Money, delivery, trust, operations
- payments: id, order_id, tenant_id, provider, status, currency, amount_minor, provider_reference, idempotency_key.
- payment_attempts: id, payment_id, tenant_id, attempt_number, request_reference, provider_reference, status, request/response redacted metadata, timestamps.
- refunds: id, payment_id, order_id, tenant_id, amount_minor, status, reason, provider_reference, idempotency_key.
- returns: id, order_item_id, order_id, tenant_id, quantity, reason, status, resolution.
- commissions: id, sub_order_id, tenant_id, rate_basis_points, amount_minor, status.
- settlements: id, tenant_id, period_start/end, amount_minor, status, payout_reference, idempotency_key.
- ledger_accounts: id, owner_type, tenant_id nullable, code, currency.
- ledger_transactions: id, reference_type/id, idempotency_key, status, created_at.
- ledger_entries: id, transaction_id, account_id, debit_minor, credit_minor, currency; each posted transaction balances per currency.
- delivery_zones: id, tenant_id, name, county, town, postal_rules, status.
- delivery_methods: id, tenant_id, name, fee_minor, estimated_days, eligibility_rules, status.
- shipments: id, sub_order_id, tenant_id, carrier, tracking_number, status, dispatched_at, delivered_at.
- reviews: id, tenant_id, product_id, customer_id, order_item_id, rating, body, moderation_status.
- notifications: id, tenant_id nullable, recipient_user_id, channel, template, payload, status, attempts, sent_at.
- audit_events: id, tenant_id nullable, actor_id, action, entity_type/id, redacted metadata, request_id, created_at.

## Relationships
- tenants 1:N domains, memberships, products, customers, orders, inventory, settings, and operational records.
- profiles 1:N memberships; memberships N:1 role; roles N:M permissions.
- tenants 1:N subscriptions; each subscription references one plan and may produce many invoices.
- categories form a tenant-scoped parent tree. Products belong to one tenant and may have variants, images, and reviews.
- inventory is per tenant and variant/location; inventory movements are immutable adjustment history.
- customers own addresses, carts, wishlists, and orders. Cart items point to tenant catalogue products.
- Marketplace orders may have no tenant_id; each is split into seller-owned sub_orders. Every order item is bound to one seller sub_order and tenant.
- Payments/refunds relate to the parent order; attempts are children of payments. Commissions and settlements are seller scoped.
- Ledger transactions aggregate balanced ledger entries. Money tables reference source records rather than becoming the only business state.
- Delivery configuration, shipments, promotions, reviews, notifications, branding, and audit events are tenant scoped where relevant.

## Integrity and security constraints
- Composite unique keys include tenant_id where IDs can be referenced across tenants.
- Composite FKs prevent cross-tenant references for products, customers, orders, variants, and storage metadata.
- Slugs/SKUs/order numbers are unique within their tenant; domain hostname is globally unique after normalization.
- Quantities and monetary values are non-negative except signed inventory movements and balanced journal sides.
- RLS policies distinguish public published reads, self-customer reads, tenant member operations by permission, and platform-only operations.
- Use indexes on tenant_id plus common filters, FK columns, unique idempotency/reference values, order status/date, and normalized search fields.
