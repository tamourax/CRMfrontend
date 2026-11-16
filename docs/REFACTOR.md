# Frontend refactor record

## Before and after

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

Work is grouped on `refactor/feature-modules` and `docs/developer-readme`. The code branch contains separate commits for module extraction, query/session hooks, and regression tests. Integration uses `git merge --no-ff`, preserving these branches and merge points instead of rewriting published history.

## Verification

- 15 frontend integration tests pass, including new URL-filter, prefilled-question, and retry-without-duplication cases.
- The production build and formatting checks pass.
- Desktop/mobile browser flows cover real API data, CSRF, relationships, logout, and two-account isolation.
- Live AI verification remains opt-in because it uses external quota and availability.

The existing demo/screen captures remain representative: the refactor changes code organization, not the intended interface.
