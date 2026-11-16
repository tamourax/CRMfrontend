# Frontend architecture

## Responsibilities

| Layer | Owns | Does not own |
|---|---|---|
| `App.tsx` | Session loading, login vs workspace | Feature markup or data calculations |
| `routes` | Page composition and not-found route | HTTP requests |
| `layout` | Navigation and responsive workspace shell | Page selection or query implementation |
| `features/*` pages | Filters, forms, and feature presentation | Direct database/provider access |
| Feature hooks | Query keys, HTTP requests, mutation lifecycle | Business statistics or authorization rules |
| Shared components/hooks | Reusable UI and on-demand summary behavior | Feature-specific routing decisions |
| `lib` | Axios configuration, error messages, display formatting, stage constants | Session credentials or sales calculations |

Dependencies point from pages/layout toward shared modules. Shared UI does not depend on a feature. Feature query modules use the common Axios client so credentials, CSRF, timeout, and JSON headers stay consistent.

## Authentication lifecycle

`useCurrentUser` retrieves the session. `useLogin` initializes CSRF, posts credentials, and updates the session query. `useLogout` invalidates the server session, cancels in-flight queries, removes private cache entries, and returns to login. Query functions forward TanStack Query's AbortSignal to Axios.

Keeping the observed session query matters: clearing the whole query client previously left a stale authenticated shell. The logout integration test protects that behavior.

## Feature state

- Server state belongs to TanStack Query hooks, with feature-specific query keys.
- Search fields, page selection, mobile navigation, and the draft chat question remain local UI state.
- The chat hook owns message results/errors and retries an existing message without duplicating its question.
- Initial deal filters and prefilled questions use `useSearchParams`, so browser and MemoryRouter behavior agree.
- Deal stages have one shared constant; the Stage type derives from it.

## Data correctness and security

Amounts arrive as decimal strings. Frontend helpers format them for display; Laravel calculates aggregates. AI responses include server facts and record citations. React renders strings as text, without executing provider HTML. Keys never enter the frontend environment. Cookies and CORS are backend concerns; client-side guards are only UI controls, not authorization boundaries.

The HTTP API, routes, visual design, metric definitions, and independent-chat scope were preserved by the refactor. API contract types remain in `types.ts`.
