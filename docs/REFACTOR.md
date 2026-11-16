# Frontend refactor record

## Before and after

The shared UI refactor adds typed button variants, panels, overview covers, and statistic cards. Their rendered tags/classes match the existing pages. Font families and text sizes now come from `styles/tokens.css`; the former single stylesheet is split into ordered files while preserving CSS rule order and resolved values. Feature query modules now have domain-specific filenames instead of repeated `queries.ts` filenames.

| Before | After | Benefit |
|---|---|---|
| `App.tsx` combined login, layout, routing, and session requests | Session gate, LoginPage, WorkspaceLayout, WorkspaceRoutes, auth hooks | Each responsibility has a clear home |
| One Records file contained four pages | Separate customer and deal feature pages | Smaller files and feature ownership |
| One UI file mixed tables, feedback, and AI output | Named shared components with an index export | Reuse without a large mixed module |
| Pages embedded query/mutation implementations | Feature query modules and assistant hook | UI is easier to read and test |
| HTTP, formatting, and stages shared one module | `api.ts`, `format.ts`, `constants.ts` | Clear transport/presentation separation |
| Deep links read global window location | React Router search parameters | Correct behavior under both browser and test routers |

Query cancellation now reaches Axios. Chat retry state lives in one hook, and the existing session-cache clearing behavior remains intact. No new dependency, endpoint, database field, or visual redesign was introduced.

## Branches and commits

Earlier extraction work is grouped on `refactor/feature-modules` and `docs/developer-readme`. Shared UI/style extraction is on `refactor/shared-ui-and-styles`. Branch references are retained; integration includes fast-forward updates as well as earlier merge commits. Inspect the actual graph with `git log --graph --oneline --decorate --all`; published history is not rewritten.

## Verification

- 16 frontend integration tests cover session revocation, URL filters, prefilled questions, retry without duplication, and shared UI consumers.
- The production build and formatting checks pass.
- Desktop/mobile browser flows cover real API data, CSRF, relationships, logout, and two-account isolation.
- Live AI verification remains opt-in because it uses external quota and availability.

The existing demo/screen captures remain representative: the refactor changes code organization, not the intended interface.
