# Permission matrix

Legend: Own = own account/records; Assigned = explicit scoped permission; All = platform-wide; Public = published data.

| Capability | Super-admin | Owner | Manager | Staff | Customer | Anonymous |
| --- | --- | --- | --- | --- | --- | --- |
| Manage tenants/plans/platform | All | No | No | No | No | No |
| Manage tenant profile/branding/domains | All | All | Assigned | No | No | No |
| Invite members/change roles | All | All | Assigned | No | No | No |
| View/manage products/categories | All | All | Assigned | Assigned | Public | Public |
| Set prices, stock, visibility | All | All | Assigned | Assigned | No | No |
| View customers | All | All | Assigned | Assigned | Own | No |
| View orders | All | All | Assigned | Assigned | Own | No |
| Fulfil/cancel/refund order | All | All | Assigned | Assigned | Request only | No |
| Configure payment/delivery | All | All | Assigned | No | No | No |
| View financial ledger/settlements | All | All | Assigned | No | Own receipts | No |
| Manage subscriptions/invoices | All | All | Assigned | No | Own bills | No |
| Browse shop / marketplace | All | All | All | All | Public | Public |
| Create cart / checkout | All | All | All | All | Own | Session |
| Review product | Moderate | Moderate | Moderate | No | Verified purchase | No |
| Read audit events | All | All | Assigned | No | No | No |

## Enforcement notes
- Roles map to permission keys; route handlers and domain services check permission keys.
- Database policies bind user id to active membership in the row's tenant and required role/permission.
- Super-admin status is stored in protected server-controlled data and must not be derived from editable user metadata.
- Customers are scoped to their verified identity and tenant. Guest sessions may write only their own cart using unguessable server-issued session tokens; they cannot read order or customer data.
- Platform-wide catalogue and tenancy operations are separate from tenant roles. Tenant owners cannot grant platform permissions.
- Every high-impact change to membership, payment setup, refunds, payouts, plan status, and domains writes an audit event.
