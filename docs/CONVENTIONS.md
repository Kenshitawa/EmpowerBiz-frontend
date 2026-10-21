# empowerBiz frontend conventions

## Product identity

- Product name: empowerBiz.
- Brand name and host configuration live in `src/config/brand.ts`.
- Display prices in KES using integer amounts from the backend.
- Format database timestamps for Africa/Nairobi.

## Application boundaries

- `src/app`: route composition, layouts, and thin Server Actions.
- `src/components`: shared presentation components and UI primitives.
- `src/lib/backend-api.ts`: server-only HTTP transport and cookie/origin forwarding.
- `src/lib/commerce.ts`: typed response helpers and display formatting; no SQL.
- `src/lib/local-auth.ts`: current-user lookup through the backend API; no password/session implementation.
- Backend database schema, authorization, authentication and business workflows live only in the EmpowerBiz-backend repository.

## Data and security rules

- Enforce every permission in the backend API. A hidden link or disabled button is never authorization.
- Forward the browser's HttpOnly session cookie only from server-side Next.js code.
- Do not include session cookies, private service credentials, SQL, or backend-only modules in Client Components.
- Validate form input in Server Actions for user feedback; backend validation is still required.
- Do not put remote integration secrets in this repository. Local configuration belongs in ignored `.env.local`; commit placeholders only in `.env.example`.

## Code quality

- TypeScript strict mode; avoid `any` and unsafe casts.
- Prefer small page components and explicit API response types.
- Use kebab-case files, PascalCase React components, and camelCase variables.
- Pin direct dependencies and commit `package-lock.json`.
- Run TypeScript, ESLint, Vitest, Playwright (with backend running), and production build before a frontend release.
- Use semantic HTML, keyboard-accessible controls, responsive layouts, and clear loading/empty/error states.
