# External services

The frontend currently uses one local Fastify backend over `NEXT_BACKEND_URL`. It does not access Supabase or any third-party payment, delivery, email, SMS, analytics, or hosting provider.

| Service | Purpose | Status |
| --- | --- | --- |
| empowerBiz backend API | Authentication, catalogue, cart, checkout, dashboard data | Local API at `127.0.0.1:4000` |
| Supabase | Future hosted database/auth/storage option | Deferred; no credentials required by this frontend |
| M-Pesa Daraja | Live payment | Needs sandbox/production credentials; current UI is preview only |
| Email/SMS | Invitations and notifications | Not connected; credentials needed later |
| Delivery carrier | Fees and shipment tracking | Not connected; local manual confirmation only |
| Hosting/custom domains | Public deployment | Not configured |

Do not add provider secrets to frontend environment variables or client bundles. See the backend repository for API and local database boundaries.
