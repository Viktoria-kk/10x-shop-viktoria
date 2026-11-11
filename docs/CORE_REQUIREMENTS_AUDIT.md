# 10X Shop requirements audit

## Implementation update after the 11 November audit

The owner requested Header logout, flow verification, commit and push. Signed-in visitors now have Account and Log out in the Header; logout returns Home through AuthContext and preserves the cart. Shared discounted unit prices are rounded to cents before quantity calculations; product views apply discounts below 1% consistently with Cart/Checkout. Adding fresh product data to an existing cart line now updates its price and discount, including Reorder's path.

Four repeatable `npm test` scenarios passed against current modules with controlled hooks, routing, fetch and storage; see `CORE_TEST_CHECKLIST.md`. Typecheck, lint and build also passed. The updated build produced JavaScript at 336.90 kB (98.20 kB gzip) and CSS at 28.11 kB (5.69 kB gzip). These are logic checks, not rendered end-to-end verification. Search placeholder contrast, actual browser/responsive checks and Lighthouse remain open. The findings below record the pre-fix baseline and must be read with this update.

## 11 November 2026 follow-up

The CORE screens and shopping actions are implemented, but the project is not ready to claim that every acceptance criterion has passed. This review found price inconsistencies, the missing Header logout entry described by Appendix A, low-contrast search placeholders, and missing observed browser/performance evidence. The previous conclusion that the flow is assembled in source still holds; it does not establish correct behaviour in all cases.

**Sources:** `10X-Shop-Graduation-Project-PRD (1).docx` and `დანართი A (1).docx`, read from the owner's Downloads folder. References below use their section identifiers, not unverified page numbers. The PRD's CORE/FULL classification takes priority over mixed-level implementation examples. Earlier owner decisions are recorded separately from literal agreement with the assignment.

**Baseline:** `5761b02` on `main`, 48 commits. A fresh `git ls-remote origin refs/heads/main` returned `5761b0216e81b320d1f8cc011f241ed7e1fa4a63`, exactly matching local HEAD. Vercel returned HTTP 200; its JavaScript and CSS were byte-for-byte identical to the local production assets. A fresh build reproduced those asset filenames. This confirms the push and matching application assets, without claiming access to Vercel's deployment metadata or an observed browser session.

### Confirmed code issues and assignment differences

| Priority | Finding | Requirement and evidence | Proposed correction |
| --- | --- | --- | --- |
| P1 | Unit prices and totals use different rounding stages | Appendix A P2.3 specifies the discounted price to two decimal places; CORE Cart/Checkout require correct totals. `src/utils/format.ts:6` returns an unrounded value, then Cart and Checkout multiply it. An executed fixture using the actual helper, price 9.99, discount 10.48%, quantity 2, displays **$8.94 each but $17.89 for the line**. Two displayed units total $17.88. Saved order unit prices have the same issue. | Round the shared discounted unit price to cents before multiplying; derive Cart, Checkout and new order snapshots from that same unit price. Verify multi-unit and multi-line totals. |
| P2 | Discounts below 1% change between product and cart | `ProductCard.tsx:15` and `ProductPage.tsx:70` show the original price when the discount is below 1%, but Cart/Checkout always call `discountedPrice`. An executed fixture with price 100 and discount 0.5% shows **$100.00 in the catalogue/details and $99.50 in the cart**. | Apply one pricing rule everywhere. Keep the 1% threshold for the promotional badge separately from the actual unit-price calculation. |
| P2 | The Header has no Log out action | Appendix A P0.3 explicitly lists Header Log in/Log out. `Header.tsx:24` reads only `isLoggedIn`, and line 68 shows Account after sign-in. The working logout handler/button is on `ProfilePage.tsx:91` and line 237. Commit `c5bcf3c` moved it there. The previous audit records this as an owner-requested single account entry; it remains a literal assignment difference, not a deployment failure. | To match Appendix A, expose Log out in the signed-in Header while retaining Account. Reuse AuthContext logout, return to `/`, and preserve the cart. |
| P2 | Reorder can retain an old cart price | Optional FULL behaviour already implemented. `OrderDetailsPage.tsx` fetches fresh products and promises current prices; the existing-item branch in `CartContext.tsx` updates quantity and stock only. A focused execution of the actual CartProvider with mocked hooks/storage added a $10 item, then added the same ID fetched at $12: the two units retained a $10 unit price and a $20 total. | Refresh price and discount in the existing cart line when accepting freshly fetched product data; verify the displayed Reorder promise against the result. |
| P2 | Search placeholder contrast is below the 4.5:1 normal-text target | Appendix A O3 requires basic colour contrast. From the declared CSS colours and alpha values, `HomeCatalogue.tsx:124` produces approximately **3.41:1** on white; `HeaderSearch.tsx:114` produces approximately **3.79:1** on the declared light background. These are calculations from source, not Lighthouse or screenshot measurements. | Increase placeholder opacity or use the existing text token at full opacity, preserving the palette; confirm computed styles and contrast during preview QA. |

The pricing examples use controlled fixtures to reproduce the code paths; they are not claims about a particular current DummyJSON product. No app source was changed during this audit.

### Missing verification and submission evidence

| Item | Current status | Completion evidence |
| --- | --- | --- |
| Full CORE shopping journey | Implemented in source; current browser journey unverified. The 25 October mocked checks are historical. | Observe Catalogue → Product → Cart → guest Login return → invalid and valid Checkout → confirmation and cleared cart. Include quantity changes, removal and matching amounts. |
| Responsive CORE pages at 375px and desktop | Responsive utilities and appropriately sized main controls exist; no observed overflow result. | Check Home/Catalogue, Product, Cart, Login and Checkout at 375px and desktop; record overflow, wrapping and usable controls. |
| Chrome and Firefox | Both are explicitly named in Appendix A O3. Every current matrix row remains NOT TESTED. | Run the required journey in both browsers; update `COMPATIBILITY.md` only with observed results. The expanded report/screenshot matrix is FULL-level in the section heading; it is not a reason to skip basic browser checks. |
| Deployed route refresh and error states | Direct HTTP routes were checked previously; live application assets match today. Rendering, route refresh, API loading/error/empty and Error Boundary fallback remain unobserved. | Refresh `/products/5` and protected routes, visit invalid product/route IDs, exercise failed/empty requests and confirm the Error Boundary fallback in the owner's preview. |
| Lighthouse report | No `docs/lighthouse/` evidence and no measured scores. The prior PageSpeed request returned 429. | Save a genuine mobile report and record its date/URL/results. Appendix A O1 explicitly calls a basic report CORE, while PRD step 26 classifies before/after optimisation as FULL; obtain the basic report without treating FULL score targets or before/after comparisons as CORE gates. |
| Debugging evidence | Three cases are documented, but the third failing draft exists only in the recorded work session, not Git. This is weaker evidence, not proof the case is false. | Preserve the actual command evidence if available. The newly reproduced pricing defects can become additional genuine cases after fixes, with reproductions and real fix commit links. Do not invent history. |
| Assignment submission | The repository is public and current code is pushed; no submission receipt is available. | Retain the receipt for the submitted repository. Git/Vercel cannot prove that the assignment form was submitted. |

The PRD records a 6 November 2026, 23:59 Georgia-time cutoff and says later changes do not count toward that assessment. This audit verifies the present code, not what was submitted by the historical cutoff.

### Existing design choices and optional work

The earlier audit records explicit owner decisions for an 8-character password with a letter and number, direct Login landing on Profile, one Header account entry, removal of demo-account copy, and a validation-only change-password form. These should not be silently reversed or described as exact matches to Appendix A. Header logout is the specific discrepancy raised in this review.

The current Home includes the catalogue, while the Header Catalogue link and several return links open a separate `/catalogue` route; Appendix A's examples use `/`. The grid currently changes to two columns at 640px, three at 1024px and four at 1280px, rather than Appendix A O3's literal mobile/tablet/desktop ranges. These are layout/navigation differences to reconcile if exact Appendix A presentation is required; they do not demonstrate failure of the PRD's minimum responsive-breakpoint criterion or missing access to products.

**Optional FULL features still absent:** category filtering, sorting, reviews, related products, promo codes, theme switching and Profile's Clear local data. Route-level lazy loading, Formik/Yup Login, expanded generic/OOP architecture and `@theme` customisation are also not implemented. FULL process evidence such as a demo video, weekly progress notes and the requested PR/Issues workflow is not established by this repository audit. These are not CORE blockers, and dependencies should not be added merely to complete optional examples. Search, pagination, editable Profile, Orders and Reorder already exist and should keep working when CORE defects are fixed.

Real authentication, a backend, real payments, card collection and password persistence are not missing assignment requirements. The project is intentionally a local simulation.

### Verification performed for this follow-up

- `npm run typecheck`, `npm run lint` and `npm run build` all passed on 11 November.
- Vite transformed 56 modules: JavaScript 336.58 kB / 98.14 kB gzip; CSS 28.11 kB / 5.69 kB gzip. Bundle size is a build measurement, not a runtime-performance score.
- Temporary in-memory Node checks executed the actual pricing helper and CartProvider logic with controlled fixtures and mocked React hooks/storage. They reproduced the issues above; they were not browser or end-to-end tests.
- The Impeccable technical-audit guidance informed the source review. Its context launcher could not initialise its managed cache, so its detector did not run. No PRODUCT.md or DESIGN.md was found. Existing components, palette and AGENTS.md provided the project context. No visual/compliance score is claimed without rendered verification.
- Accessibility: semantic layout, labels, focus styles and status/error messages are present; placeholder contrast needs correction. Performance: paged product loading and lazy card images are present; runtime speed is unmeasured. Theming: shared colour variables are consistent; dark mode is optional. Responsiveness: wrapping and breakpoints are present; actual viewport behaviour is unverified. Implementation integrity: source remains straightforward, with pricing consistency the main confirmed shared-logic defect.
- No app, development server or browser was started, in accordance with `AGENTS.md`. No new dependencies were installed.

**Recommended order:** fix shared unit-price calculation and product/cart consistency; restore Header logout to match the stated requirement; correct placeholder contrast and Reorder repricing; then observe and record the CORE journey, responsive/browser checks and basic Lighthouse report. Update the debugging log with actual fix commits. Optional feature expansion comes afterward.

The sections below retain the 10 November audit as historical context; this follow-up takes priority where a new finding changes its conclusion.

## Scope and evidence

Reviewed on 10 November 2026 against the supplied **10X-Shop-Graduation-Project-PRD (1).docx** and **დანართი A (1).docx**. The PRD separates mandatory CORE from optional FULL and BONUS work; its classification takes priority over mixed-level examples in Appendix A. Later, explicit project-owner requests take priority over document examples. The source baseline was `d5a116a` on `main` (46 commits before this update).

This audit distinguishes **implemented in source**, **checked by a command or focused harness**, and **observed in a browser or on the hosted site**. Code inspection and a passing build cannot prove visual appearance or an end-to-end journey. The owner manages the preview; `AGENTS.md` prohibits starting the app, development server or browser here.

On 10 November, `npm run typecheck`, `npm run lint` and `npm run build` passed. Vite 8.3.5 transformed 56 modules; the final build reported 336.58 kB JavaScript (98.14 kB gzip) and 28.11 kB CSS (5.69 kB gzip). A temporary in-memory Node check of the current modules passed for the catalogue URL and skip value, HTTP failure, product 404, password rules and simulated order stages. It mocked `fetch` and did not exercise a browser. Initial sandboxed requests failed at DNS resolution; later read-only requests outside that sandbox reached the Vercel site, DummyJSON and GitHub. Direct site routes and current build assets returned HTTP 200, and DummyJSON returned 12 products. Those HTTP results do not establish rendered behaviour.

## CORE requirements

| Requirement | Source or recorded evidence | Status |
| --- | --- | --- |
| Vite, React, strict TypeScript, Tailwind CSS v4 and required scripts | [`package.json`](../package.json), [`tsconfig.json`](../tsconfig.json), [`vite.config.ts`](../vite.config.ts), [`src/index.css`](../src/index.css); current commands pass | Checked locally |
| Shared Layout, Header, Footer, routing and Not Found | [`AppRoutes.tsx`](../src/routes/AppRoutes.tsx), [`Layout.tsx`](../src/components/layout/Layout.tsx), [`NotFoundPage.tsx`](../src/pages/NotFoundPage.tsx); the exact “Go to catalog” link now opens `/` | Implemented; navigation not browser-tested |
| Controlled Login, local AuthContext and protected Checkout return | [`LoginPage.tsx`](../src/pages/LoginPage.tsx), [`AuthContext.tsx`](../src/context/AuthContext.tsx), [`ProtectedRoute.tsx`](../src/routes/ProtectedRoute.tsx); older focused harness covers a prior revision | Implemented; current journey not browser-tested |
| DummyJSON catalogue, 12-product request, typed response and HTTP failure handling | [`products.api.ts`](../src/api/products.api.ts), [`CataloguePage.tsx`](../src/pages/CataloguePage.tsx); current mocked-fetch check and live 12-product HTTP response passed | API checked; rendered catalogue unverified |
| ProductCard/Grid, stable product IDs, responsive grid and Add to cart | [`ProductGrid.tsx`](../src/components/product/ProductGrid.tsx), [`ProductCard.tsx`](../src/components/product/ProductCard.tsx) | Implemented; rendered behaviour not browser-tested |
| Product Details, invalid-ID handling, stock-aware quantity and Add to cart | [`ProductPage.tsx`](../src/pages/ProductPage.tsx); older focused stock-control harness | Implemented; current live behaviour not browser-tested |
| Shared cart add, remove, quantity, totals, badge and empty state | [`CartContext.tsx`](../src/context/CartContext.tsx), [`CartPage.tsx`](../src/pages/CartPage.tsx), [`Header.tsx`](../src/components/layout/Header.tsx); older focused cart harness | Implemented; current browser flow not tested |
| Four-field controlled Checkout, inline errors, order total, duplicate guard, temporary disabled button, confirmation and cart clearing | [`CheckoutPage.tsx`](../src/pages/CheckoutPage.tsx); the button has `disabled={isSubmitting}` and a ref also prevents repeat submissions | Implemented; current browser flow not tested |
| Loading, error, empty and invalid-route states | Catalogue, Home, Product Details and Not Found branches; API failures do not require a successful response | Implemented; visual states not browser-tested |
| Error Boundary and three genuine debugging cases | [`ErrorBoundary.tsx`](../src/components/ErrorBoundary.tsx), [`DEBUG-LOG.md`](../DEBUG-LOG.md); two fixes are visible in Git history, one lint draft only in recorded session output | Implemented; fallback untested in browser; third bug has weaker evidence |
| Responsive 375px and desktop layout, focus, keyboard and basic accessibility | Tailwind breakpoints, labels, semantic elements and focus classes in source | **Not verified visually or with assistive technology** |
| Chrome and Firefox CORE behaviour and basic Lighthouse report | [`COMPATIBILITY.md`](../COMPATIBILITY.md) marks both browsers untested; a remote PageSpeed Insights request returned HTTP 429, with no score | **Missing observed results** |
| README, PLAN, REPORT, meaningful Git history | [`README.md`](../README.md), [`PLAN.md`](../PLAN.md), [`REPORT.md`](../REPORT.md); first commit is the plan, dated 24 October | Present; historical first-week target was missed |
| Vercel production build and SPA fallback | [`vercel.json`](../vercel.json) rewrites routes to `/index.html`; local build passes; direct HTTP GET for `/` and `/products/5` returned the same SPA HTML and built assets returned 200 | Configured and HTTP-checked; browser route rendering and refresh unverified |
| Public repository and submission by 6 November 2026, 23:59 Georgia time | GitHub repository page returned HTTP 200 without a Git login; no assignment submission receipt is available here | Public access checked; **submission unverified** |

The full **catalogue → details → cart → Login if needed → Checkout → confirmation** journey is assembled in source. It still needs one observed browser run to establish that all pieces work together. The 375px no-overflow criterion and direct hosted-route refresh also need observed results.

## Owner decisions that supersede document examples

- All password forms use at least 8 characters, a letter and a number. The owner explicitly replaced Appendix A's 6-character Login example.
- Direct Login and Sign up open Profile; Checkout or Orders intent still takes priority. The owner explicitly requested this account flow after the assignment was written.
- The Header has one Log in/Account entry, with Log out on Profile. The owner explicitly requested one account navigation entry and a Profile log-out action. Appendix A describes a Header Log out link; the logout action exists but is located differently by that later design choice.
- Demo-account notes were removed at the owner's request. This supersedes Appendix A's suggested test-account text and avoids claiming that credentials are checked against a server.
- The Profile change-password form is a later owner-requested, validation-only interaction. It does not save a credential or implement real authentication, although Appendix A originally lists password change as outside Profile scope.

## Existing optional features

Homepage search and URL pagination, Sign up, editable Profile, Orders, simulated status and Reorder are implemented. Category/price filtering, sorting, theme switching, Clear local data, product reviews, related products and promotional codes are not implemented. The PRD does not make these the CORE pass minimum. Optional features already present still need live interaction checks. No real authentication, payment, shipping or order backend is required.

## Remaining checks and limits

1. On the owner's running preview, complete and record the CORE journey, including invalid form values, API error and empty states, cart persistence after refresh, invalid products, and the Error Boundary fallback.
2. At 375px and desktop width, check every CORE page for horizontal overflow, image sizing, visible focus, keyboard operation and readable contrast. Record Chrome and Firefox outcomes in [`COMPATIBILITY.md`](../COMPATIBILITY.md).
3. On the deployed Vercel URL, open `/`, `/login`, `/cart` and `/products/5` in a browser, refresh `/products/5`, and check rendered content, product images and the browser console. The HTTP route and asset checks are already recorded in [`DEPLOYMENT.md`](DEPLOYMENT.md).
4. Run a genuine mobile Lighthouse audit and record its values. The remote PageSpeed Insights request on 10 November returned HTTP 429 and supplied no score. The document asks for a basic CORE report; FULL score targets and before/after optimisation remain optional.
5. Retain the assignment submission receipt if one exists. Public GitHub visibility was checked, but the repository or local Git history cannot prove that the submission form was completed on time.

These checks remain open until their results are observed. Do not mark them PASS from source inspection, a static build or a previous general site confirmation.
