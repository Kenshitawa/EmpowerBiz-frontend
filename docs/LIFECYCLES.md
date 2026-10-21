# Lifecycle state machines

Only documented transitions are allowed. Every transition records actor, timestamp, source, and idempotency key where a request may replay.

## Order
Draft -> pending_payment or confirmed_cod -> confirmed -> processing -> fulfilled -> completed. Allowed side paths: pending_payment -> cancelled/expired; confirmed/processing -> cancellation_requested -> cancelled or processing; fulfilled -> completed or return_requested. Terminal cancellation is immutable except a compensating recovery event.

## Split order / sub-order
Created -> awaiting_seller_confirmation -> accepted -> processing -> ready_for_dispatch -> shipped -> delivered -> completed. Side paths: rejected, cancellation_requested, cancelled, return_requested. Seller transition cannot change another seller's sub-order.

## Payment
Created -> pending -> succeeded | failed | cancelled | expired. Pending may receive only verified, matching provider callbacks. Succeeded is immutable; refunds are separate records. Duplicate callbacks are no-ops.

## Refund and return
Return: requested -> approved | rejected -> item_received -> inspected -> refund_pending -> refunded | closed. Direct refund for a non-return case: requested -> approved -> processing -> succeeded | failed. Amount and remaining refundable balance are checked transactionally.

## Commission
Calculated -> pending -> earned -> payable -> settled. Reversal uses a separate compensating entry; settled records are not edited.

## Settlement
Draft -> validated -> approved -> processing -> paid | failed. Retry creates a new attempt against the same idempotent settlement intent; ledger records reconcile to payout response.

## Subscription
Trialing -> active -> past_due -> suspended -> active or cancelled. Also supports scheduled cancellation at period end and expired trial -> active/past_due/suspended. Access limits are enforced server-side.

## Tenant onboarding
Requested -> validated -> tenant_created -> defaults_applied -> owner_invited -> ready. Failure creates a resumable step record; retries reuse an idempotency key and never create duplicate tenant/domain/subscription records. Deactivation moves active -> suspended -> reactivated or closed.

## Transition enforcement
- Store current status and append-only history in the same transaction.
- Validate allowed from/to pairs in domain code and database constraints/functions as appropriate.
- Require privileged authorization and audit records for exceptional transitions.
- Use compare-and-set/version checks for concurrent state changes.
