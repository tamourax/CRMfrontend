# Explore the application — demo journey

Allow 10–15 minutes. Run both applications and seed the backend first: [complete setup](https://github.com/tamourax/CRMbackend/blob/main/docs/SETUP.md).

Records are fictional Egyptian examples, currency is EGP, and calendar calculations use Africa/Cairo. IDs depend on the local database: follow record links rather than assuming an ID. Re-seeding refreshes expected dates, so inspect current totals instead of expecting screenshot values.

## 1. Sign in

Open [http://localhost:5173](http://localhost:5173). Start with `ahmed@7bahmedtamer.example`, password `OrbitDemo!2026`. The second workspace is `nour@7bahmedtamer.example` with the same demo password. Each owns 10 customers and 30 deals.

The sidebar links to Overview, Customers, Deals and AI Assistant. The header provides language/theme controls. On mobile, open the menu drawer; Arabic places it on the right. Signing into the same account again revokes its previous devices, so use different accounts for simultaneous demonstrations.

## 2. Understand the overview

Inspect pipeline, won value, total deals, lost deals, stage distribution and top customers. Follow closing-this-month and overdue links into filtered deal lists.

Laravel calculates every statistic from authorized PostgreSQL records. Pipeline includes Lead, Qualified, Proposal and Negotiation; Won/Lost are separate. EGP display suppresses unnecessary `.00` while retaining meaningful fractional values. Expected close dates are plans, not realized revenue. The report is a current snapshot and cannot establish historical growth.

## 3. Customer management — Story 1

Open Customers, search for **NileBridge Technologies**, and try the status filter. Open its profile and inspect the contact, email, phone, industry, city, status, notes and associated deals.

The cover is a shared Cairo illustration, not an uploaded project photograph. Other seeded records intentionally include missing notes and a customer without deals. Explain the relationship: one user owns many customers; one customer has many deals, whose ownership follows the customer.

## 4. Deal management — Story 2

Follow a deal from the customer profile. Inspect its project overview, EGP value, stage, expected close date, description and linked customer. Lost deals may have a recorded reason; missing reasons stay missing.

Open Deals and try Negotiation, highest value first, closing this month, overdue/open, and pagination. There are six stored stages. Date-only questions may include all stages; the overview's explicit open-closing metric includes only open stages.

## 5. Customer summary — Story 3

On a customer profile, select **Generate summary** in Relationship intelligence. With a valid provider key/model/quota, review customer overview, relationship status, deals, opportunities and risks. Inspect fact cards, source links and limitations.

If configuration or the provider is unavailable, demonstrate the visible error. No fabricated response replaces it. Suggested opportunities require review; they are not promised outcomes.

## 6. Deal assistant — Story 4

Open AI Assistant and try these independently:

| Question | Verify |
| --- | --- |
| What are the highest-value open deals? | Open stages, descending values and accessible sources |
| Which deals are expected to close this month? | Cairo month boundaries and expected dates |
| What is the total value of deals in the Negotiation stage? | Database count/total |
| Which customers have the most active deals? | Ranking by active deal count |
| What are the reasons behind the lost deals? | Recorded reasons and explicit missing information |

Follow source links and compare facts with records. Every question is independent; the previous turns are not model memory. Enter sends, Shift+Enter adds a newline. Retry a failed question through its retry action.

Also request historical growth, another user's records or a nonexistent deal. Expect unsupported/empty results or missing-information statements, without invented records or expanded permissions.

## 7. Sales summary — Story 5

Return to Overview and generate the report narrative. It uses the same Laravel reporting service as the dashboard. Compare counts, amounts, stage concentration and top customers with the visible statistics. Historical trends are unavailable because stage-event history and actual closing dates are not stored.

## 8. Language, theme and mobile

Switch Arabic/English. React translates interface copy, changes document direction and sends `Accept-Language`; queries refresh translated customer/deal data and status/stage labels. Dates and EGP amounts use the selected locale. IDs, email, phone, underlying numeric amounts and internal stage/status codes stay stable. Unknown record translations fall back to canonical text. On mobile, dismiss the navigation drawer by tapping its backdrop or pressing Escape.

Toggle dark/light mode and resize to a phone. Check the drawer, adaptive statistic cards, and tables that scroll inside their containers. Locale/theme preferences persist locally; authentication credentials do not live in browser JavaScript storage.

## 9. Isolation and logout

In a separate browser profile, sign in as Nour. Her lists/reports contain only her records; an authenticated request for Ahmed's record ID returns `404`.

For the single-device demonstration, sign into the same account in another context. The earlier session loses authorization on its next request/session check. Sign out and reload: the login screen remains, and private query data is cleared.

## Technical discussion route

1. Trace page → feature query → Axios → Laravel controller → owner-scoped query → Resource.
2. Trace `AiAssistant` → tool validation/execution → `AiContextBuilder` → provider → grounded response verification.
3. Show shared `Button` variants, `Panel`, `OverviewCover`, `StatCard`, and typography tokens.
4. Show `SessionService`, `HasTranslations`, and domain controllers.
5. Distinguish deterministic offline tests from opt-in live-provider evaluation.

[Frontend architecture](ARCHITECTURE.md) · [Backend architecture](https://github.com/tamourax/CRMbackend/blob/main/docs/ARCHITECTURE.md) · [Arabic discussion guide](https://github.com/tamourax/CRMbackend/blob/main/docs/REVIEW_GUIDE_AR.md).

## Record a current walkthrough

The current [`demo.webm`](demo.webm) is an English, chaptered walkthrough of the main user journey. Its report summary, customer summary and deal answer were generated by the configured provider and accepted by the backend's grounding checks. It uses seeded data, so totals, dates and record IDs can differ in another setup.

To record a fresh walkthrough, run `npm run demo` with both applications running, Chromium installed, seeded records and a working AI provider. The recorder saves over `demo.webm` only after all three live AI requests pass backend verification. Configure your own provider key; developer credentials are not included in the repository.
