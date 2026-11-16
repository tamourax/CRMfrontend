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

Hooks live in `authQueries.ts`, `customerQueries.ts`, `dealQueries.ts`, and `reportQueries.ts`. Login also removes the previous account's private queries. Axios emits the session-expired event on `401`; the session gate clears private data and shows login. The user query revalidates on focus and every foreground minute while authenticated. Laravel's `SessionService` enforces single-device access, absolute expiry and protected renewal; client checks do not grant permissions.

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

## Shared components and styles

`Button`/`ButtonLink` share the `primary`, `secondary`, and `light` variants while preserving native props. `Panel`/`PanelHeading`, `OverviewCover` and `StatCard` remove repeated markup. Existing tags and CSS classes are retained. Features import shared modules; shared UI does not import feature code.

`styles.css` imports `styles/tokens.css` and ordered foundation, layout, component, report, table, detail, assistant, login and responsive files. Tokens centralize font families and matching text sizes. The extraction retained CSS order and resolved property values, including the existing dark/RTL overrides. Keep that cascade order when extending styles.

## Localization and preferences

`LocaleProvider` reads English/Arabic JSON dictionaries, updates document `lang`/`dir`, persists a locale preference, and invalidates cached data when the language changes. Axios sends `Accept-Language`. Laravel selects stored translations for seeded display fields and translated status/stage labels, falling back to canonical fields when missing. Enum codes remain stable for filtering/styles. Not every existing UI phrase has a dictionary entry.

`ThemeProvider` persists light/dark preference and updates the document theme attribute. These preferences can use localStorage; authentication credentials remain in HttpOnly cookies. See the [user journey](USER_GUIDE.md) for visible behavior and the [full setup guide](https://github.com/tamourax/CRMbackend/blob/main/docs/SETUP.md) for configuration.
