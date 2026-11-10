# 10X Shop requirements audit

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
