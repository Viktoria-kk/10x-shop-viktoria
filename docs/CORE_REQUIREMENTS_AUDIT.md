# CORE Requirements Audit

## Overview

I compared 10X Shop with **10X-Shop-Graduation-Project-PRD.docx** (version 1.1) and **დანართი A.docx** (Appendix A), found locally in Downloads for this audit. The PRD's CORE/FULL/BONUS classification governs examples that mix levels. This audit covers the checked-out `main` branch at `4747ce9` before the audit commit. The source contains the main CORE storefront, and I have confirmed that the Vercel site works. That confirmation is narrower than proof of the full shopper journey or every deployment route.

**Status key:** **VERIFIED** means the relevant source, command, recorded focused test, Git history or explicit user confirmation supplies evidence for the stated criterion. **IMPLEMENTED — NOT VERIFIED** means the code is present but its required rendered or live behaviour has not been observed. **PARTIAL** means only part of a criterion is adequately supported. **MISSING** means an expected CORE action or record is absent. **BLOCKED** means the required external state could not be established from available access. A passing build is never used as proof of a browser interaction.

## Audit Method

I read both assignment documents, the current components and configuration, [PLAN.md](../PLAN.md), [README.md](../README.md), [REPORT.md](../REPORT.md), [DEBUG-LOG.md](../DEBUG-LOG.md), [CORE_TEST_CHECKLIST.md](CORE_TEST_CHECKLIST.md), [COMPATIBILITY.md](../COMPATIBILITY.md), [PERFORMANCE_NOTES.md](PERFORMANCE_NOTES.md) and [DEPLOYMENT.md](DEPLOYMENT.md). I compared the three debugging cases with Git history. I ran `npm run typecheck`, `npm run lint` and `npm run build`; all passed. Vite transformed 44 modules and reported 289.45 kB JavaScript (88.77 kB gzip) and 18.33 kB CSS (4.29 kB gzip).

I did not open the app, start a server or run a browser. The local checkout verifies `origin/main` as the remote default branch and shows 32 prior commits. A public GitHub visibility check could not be completed because the external GitHub request was unavailable; a push-capable remote does not prove public access. No final submission form or link receipt is in the available evidence.

## React Requirements

Functional pages and reusable components are separated under [`src/pages`](../src/pages) and [`src/components`](../src/components). [`Layout.tsx`](../src/components/layout/Layout.tsx) composes Header, `Outlet` and Footer; providers and [`ErrorBoundary.tsx`](../src/components/ErrorBoundary.tsx) use `children`. [`CartItemRow.tsx`](../src/components/cart/CartItemRow.tsx) receives typed callback props. [`CataloguePage.tsx`](../src/pages/CataloguePage.tsx) and [`ProductPage.tsx`](../src/pages/ProductPage.tsx) use `useState`, `useEffect`, event handlers and conditional rendering. Their effects have `[]` and `[productId]` dependencies respectively and ignore results after cleanup. [`ProductGrid.tsx`](../src/components/product/ProductGrid.tsx) maps products with `product.id` as the key; the cart maps with `productId`. [`CartContext.tsx`](../src/context/CartContext.tsx) uses immutable updates and shares state with the Header, Cart and Checkout. Login and Checkout use controlled forms. These code concepts are directly inspectable; the rendered journey still needs a browser record.

## TypeScript Requirements

[`tsconfig.json`](../tsconfig.json) enables `strict`, unused checks and `noFallthroughCasesInSwitch`. [`eslint.config.js`](../eslint.config.js) includes TypeScript and React Hooks rules and rejects explicit `any`. [`src/types/product.ts`](../src/types/product.ts), [`cart.ts`](../src/types/cart.ts), [`user.ts`](../src/types/user.ts) and [`checkout.ts`](../src/types/checkout.ts) define the implemented domain data. Component props, form state and `FormEvent<HTMLFormElement>` are typed; [`products.api.ts`](../src/api/products.api.ts) declares `Promise<ProductsResponse>` and `Promise<Product | null>`. `npm run typecheck` passed with no errors. The API functions cast JSON to TypeScript types rather than validating every runtime field. This is a possible malformed-response risk, not a missing FULL-only `ApiClient` or OOP requirement.

## Tailwind CSS Requirements

[`package.json`](../package.json) contains Tailwind CSS v4 and `@tailwindcss/vite`; [`vite.config.ts`](../vite.config.ts) registers the plugin, and [`src/index.css`](../src/index.css) imports Tailwind. The stylesheet centralises charcoal `#2C2C2C`, muted berry `#853953`, deep plum `#612D53` and soft neutral `#F3F4F4`. Header, Catalogue, product, cart, Login and Checkout use spacing, typography, colour, flex or grid utilities. The product grid changes from one column to two at `sm`, three at `lg` and four at `xl`. Buttons and links use hover and visible-focus styles; relevant controls use disabled styles. Build output confirms CSS generation, while actual appearance and 375px overflow remain unverified. `@theme`, dark mode and custom variants are FULL/BONUS, not CORE gaps.

## Application Features

[`AppRoutes.tsx`](../src/routes/AppRoutes.tsx) declares `/`, `/login`, `/products/:id`, `/cart`, protected `/checkout` and `*` within one shared layout. Header navigation uses React Router `Link` and `NavLink`, including active styling. [`ProtectedRoute.tsx`](../src/routes/ProtectedRoute.tsx) sends guests to Login with a Checkout return path. [`LoginPage.tsx`](../src/pages/LoginPage.tsx) validates a trimmed username and a password of at least six characters; [`AuthContext.tsx`](../src/context/AuthContext.tsx) keeps the user in React state and provides logout. The recorded mocked harness passed login validation and the redirect. Real authentication and Sign up are outside CORE.

[`products.api.ts`](../src/api/products.api.ts) requests `https://dummyjson.com/products?limit=12&skip=0` and `/products/{id}`, checks `response.ok`, and treats detail 404 as missing. The API harness passed with mocked responses, but no live request was observed in this audit. Catalogue and Product Details have loading and error branches; Catalogue also has an empty branch. Product cards show images, titles, price, discount, stock and rating. Product Details shows description, selectable images and bounded quantity. Invalid IDs reach [`NotFoundPage.tsx`](../src/pages/NotFoundPage.tsx). An unexpected shape in an HTTP-success JSON response could still reach render code without runtime validation; record a real failure before treating that risk as a confirmed defect.

The shared cart exposes `addItem`, `removeItem`, `setQuantity` and `clearCart`, derives item count and discounted totals, and persists valid entries under `shop_cart`. Focused harness checks passed for operations, totals and mocked storage. [`CartPage.tsx`](../src/pages/CartPage.tsx) and Header use the same Context. [`CheckoutPage.tsx`](../src/pages/CheckoutPage.tsx) controls Full name, Email, Address and City, prevents default submission, validates fields, captures the confirmation before clearing the cart and redirects an empty cart to Cart. The Checkout harness passed. The form also guards duplicate submission with a ref; Appendix A P5.3 asks for a temporarily disabled Place order button, which the current markup does not provide. Because local submission completes synchronously, this is a small specification detail to review, not evidence that duplicate orders occur. No payment or server order is required.

## Optimisation and Debugging

[`ErrorBoundary.tsx`](../src/components/ErrorBoundary.tsx) is a React class with `getDerivedStateFromError`, `componentDidCatch`, “Something went wrong.” and a Reload button. [`main.tsx`](../src/main.tsx) places it around the application. No recorded test deliberately triggered its fallback. Ordinary API failures are handled in page state and are separate from render errors.

[`DEBUG-LOG.md`](../DEBUG-LOG.md) documents three genuine cases with symptoms, reproduction, tools, causes, fixes, commits and lessons. The remaining-stock bug is supported by a before/after Git diff and a focused harness. The missing Product Details headings are supported by source history, but not a screen-reader test. The Error Boundary lint failure is described in recorded session output; the failing draft was fixed before commit, so Git contains only its correction. The log meets a three-case narrative count, but the third case is not independently reproducible from Git alone. I would strengthen that evidence only with a real, separately documented issue, not an invented bug.

Appendix A classifies advanced optimisation and Lighthouse score targets as FULL, but O1 explicitly calls for a **CORE Lighthouse report**. O3 names Chrome and Firefox checks as CORE while describing the richer cross-browser matrix and accessibility audit as FULL. I therefore treat the absent basic Lighthouse measurement and absent Chrome/Firefox observed results as CORE evidence gaps. The absence of lazy routes, memoisation, before/after improvements, Safari/Edge checks and advanced screen-reader audit is not counted as a CORE implementation failure. Basic semantic landmarks, image `alt`, labels and focus styles exist in source, but need visual and keyboard confirmation.

## Documentation and Git

README covers purpose, features, stack, architecture, installation, scripts, demo Login, the live Vercel link and credits. PLAN records scope, work breakdown, risks and a definition of done. REPORT compares planned and delivered work, explains design and technology, records real build metrics and limitations, and discloses AI assistance. The first Git commit contains PLAN before implementation. That commit is dated 24 October, after the assignment's suggested first-week window of 17–23 October; the planning-before-code sequence is evidenced, but the first-week timing is not met literally. Git history has 32 meaningful commits before this audit, with feature, fix, quality and documentation changes. PLAN's aspirational 45-commit target is not an official CORE minimum; Appendix A D2 explicitly has no fixed CORE commit count. FULL Issues, Projects, PR quotas, progress notes and demo video are not CORE requirements.

## Deployment

I have confirmed that [10X Shop on Vercel](https://10x-shop-viktoria.vercel.app/) works. The repository has a root [`vercel.json`](../vercel.json) rewrite from `/(.*)` to `/index.html`; Vite builds to `dist/`. The rewrite supports React Router's deep-link design, but [`DEPLOYMENT.md`](DEPLOYMENT.md) still has no observed `/products/5` direct-open and refresh result. A working homepage does not settle that acceptance criterion. The Git remote is [Viktoria-kk/10x-shop-viktoria](https://github.com/Viktoria-kk/10x-shop-viktoria), and the remote default branch is `main`. Public visibility and submission through the required external form remain unverified. The PRD lists 6 November 2026 at 23:59 Georgia time as the submission deadline, the theoretical test on 5 November, and the defence on 7–8 November.

## Requirements Matrix

Each row is one auditable CORE criterion or a clearly labelled optional addition already present. “Verified” for a code concept means inspection or a successful static command, not a claim about its browser appearance. References to the PRD and Appendix A use their section or step numbers; the DOCX files are local assignment references and are not part of this repository.

| Requirement | Level | Status | Evidence | Remaining action |
| --- | --- | --- | --- | --- |
| Vite, React, scripts and production build | CORE · PRD 1, 23 | VERIFIED | `package.json`; build passed | None |
| Strict TypeScript, lint and no explicit `any` | CORE · T1 | VERIFIED | `tsconfig.json`; `eslint.config.js`; checks passed | None |
| Product, response, cart, Login and Checkout types | CORE · T2 | VERIFIED | `src/types/*`; typed API and forms; typecheck | None |
| Functional components, props, children, callback props | CORE · React | VERIFIED | `Layout`, `ErrorBoundary`, `ProductCard`, `CartItemRow` | None |
| `useState`, `useEffect`, dependencies and cleanup | CORE · React | VERIFIED | `CataloguePage`, `ProductPage`, `CartContext` | None |
| Event handling, conditional rendering, map and stable keys | CORE · React | VERIFIED | `ProductGrid`, `CartPage`, `CheckoutPage` | None |
| Context and immutable cart updates | CORE · React/P4 | VERIFIED | `CartContext`; focused cart harness | None |
| Tailwind v4 integration and CSS build | CORE · TW1 | VERIFIED | `vite.config.ts`, `src/index.css`; build | Confirm visual effect during live review |
| Shared colour variables | CORE design | VERIFIED | `src/index.css` and component classes | None |
| Utility styling, flex/grid and responsive breakpoints | CORE · TW2–TW3 | IMPLEMENTED — NOT VERIFIED | `ProductGrid`, Header, core pages | Observe layout at 375px and desktop |
| Hover, focus and disabled interaction states | CORE · TW4 | IMPLEMENTED — NOT VERIFIED | Header, forms, quantity controls | Observe with mouse and keyboard |
| Required routes and shared Layout | CORE · P0.1 | IMPLEMENTED — NOT VERIFIED | `AppRoutes`, `Layout`, `main` | Navigate each route without reload |
| Header links, active state, badge and logout | CORE · P0.3 | IMPLEMENTED — NOT VERIFIED | `Header`, `AuthContext`, `CartContext` | Observe guest, logged-in and cart states |
| Unknown route and invalid product Not Found | CORE · P0.1/P3 | IMPLEMENTED — NOT VERIFIED | `AppRoutes`, `ProductPage`, `NotFoundPage` | Open unknown URL and invalid IDs |
| Scroll to top on route change | CORE · P0.1 | IMPLEMENTED — NOT VERIFIED | `ScrollToTop` in `main` | Observe navigation scroll position |
| Controlled Login and required validation | CORE · P1 | VERIFIED | `LoginPage`; focused harness pass | Repeat in live journey |
| Protected Checkout and Login return | CORE · P0.2/P1 | VERIFIED | `ProtectedRoute`, `LoginPage`; focused harness pass | Repeat on hosted route |
| Catalogue endpoint and HTTP error handling | CORE · P2.2 | VERIFIED | `products.api.ts`; mocked-fetch harness pass | Observe real DummyJSON response |
| Live catalogue, loading, error and empty views | CORE · P2.2 | IMPLEMENTED — NOT VERIFIED | `CataloguePage`; checklist NOT TESTED | Observe each rendered state |
| ProductGrid/Card, product IDs and card Add to cart | CORE · P2.3 | IMPLEMENTED — NOT VERIFIED | `ProductGrid`, `ProductCard` | Open details and add from card |
| Product Details endpoint and 404 response | CORE · P3.2 | VERIFIED | `products.api.ts`; mocked-fetch harness pass | Observe live product and 404 |
| Product title, images, description, price and stock | CORE · P3 | IMPLEMENTED — NOT VERIFIED | `ProductPage`, `format.ts` | Check live data and display |
| Image choice, quantity limit and details Add to cart | CORE · P3.3 | VERIFIED | `ProductPage`; focused remaining-stock harness | Repeat with a low-stock live product |
| Cart add/repeat add/remove/set quantity/clear | CORE · P4.2 | VERIFIED | `CartContext`; focused cart harness | Repeat through Cart UI |
| Cart rows, quantity buttons, removal and empty state | CORE · P4.1 | IMPLEMENTED — NOT VERIFIED | `CartPage`, `CartItemRow` | Exercise rendered controls |
| Badge, subtotal and discounted total | CORE · P4.3 | VERIFIED | `CartContext`; totals harness | Compare Header, Cart and Checkout live |
| `shop_cart` save, restore and invalid-data handling | Optional CORE addition | VERIFIED | `CartContext`; mocked-storage harness | Confirm same-browser refresh |
| Controlled Checkout fields, validation, total | CORE · P5.2 | VERIFIED | `CheckoutPage`; focused harness | Repeat with invalid live input |
| Local confirmation and cart clearing | CORE · P5.3 | VERIFIED | `CheckoutPage`; focused harness | Complete hosted journey |
| Temporarily disabled Place order control | CORE detail · P5.3 | PARTIAL | Duplicate-submit ref exists; button lacks `disabled` | Review small UI correction |
| Loading/error/empty and request failure safety | CORE · P0.6/P2/P3 | IMPLEMENTED — NOT VERIFIED | Catalogue and Product branches; mocked API failures | Observe rendered failure/empty states |
| Error Boundary fallback and Reload | CORE · O2 | IMPLEMENTED — NOT VERIFIED | `ErrorBoundary`, `main`; no fallback test | Deliberately test in controlled preview |
| Three genuine debugging records | CORE · O2 | PARTIAL | `DEBUG-LOG`: two Git-visible fixes, one session-only draft | Preserve or strengthen third-case evidence |
| 375px usability, no horizontal overflow, touch sizes | CORE · O3/TW3 | IMPLEMENTED — NOT VERIFIED | Responsive classes; no viewport result | Check every CORE page at 375px |
| Basic accessibility landmarks, labels, alt and focus | CORE · O3 | IMPLEMENTED — NOT VERIFIED | `Layout`, images, forms, focus classes | Check rendered focus and contrast |
| Chrome and Firefox observed CORE checks | CORE · O3 | MISSING | `COMPATIBILITY.md`: all NOT TESTED | Run and record both browsers |
| Basic Lighthouse report | CORE report · O1 | MISSING | `PERFORMANCE_NOTES`, `REPORT`: no audit | Run mobile audit; record actual values |
| Full Catalogue → confirmation browser journey | CORE · PRD 21 | IMPLEMENTED — NOT VERIFIED | Pieces in source; checklist NOT TESTED | Run full hosted flow |
| Vite/Vercel configuration and local build | CORE · PRD 24 | VERIFIED | `vercel.json`, `package.json`; build pass | None |
| Public live site availability | CORE · PRD 24 | VERIFIED | My confirmation of the Vercel URL | Preserve live link; no detailed inference |
| Direct `/products/5` open and refresh | CORE · PRD 24 | IMPLEMENTED — NOT VERIFIED | SPA rewrite; hosted checklist pending | Open URL directly and refresh |
| README, PLAN, REPORT and meaningful history | CORE · D1–D3 | VERIFIED | Docs exist; 32 prior Git commits | Keep claims current |
| PLAN created in the stated first week | CORE process · D1 | PARTIAL | First commit `d842b22` precedes code but is dated 24 October; first-week window ends 23 October | Explain timing honestly; do not alter history |
| GitHub repository is public | CORE · PRD submission | BLOCKED | Remote exists; visibility request unavailable | Check unauthenticated repository access |
| Final repository link/form submission | CORE · PRD submission | BLOCKED | No submission receipt or form evidence | Submit before deadline; retain receipt |

## Remaining Gaps

| Priority | Gap and why it matters | Relevant place and smallest next step | Complexity | Manual check? |
| --- | --- | --- | --- | --- |
| P0 | Chrome and Firefox CORE behaviour has no observed result. | `COMPATIBILITY.md`: run the main journey in both browsers and record actual outcomes. | Medium | Yes |
| P0 | Appendix O1 explicitly asks for a basic CORE Lighthouse report despite FULL targets. | `PERFORMANCE_NOTES.md` / `REPORT.md`: run a mobile audit on the deployed site and record real values; no target score is required for CORE. | Small | Yes |
| P1 | Full browser journey, failure states and Error Boundary fallback are untested. | `CORE_TEST_CHECKLIST.md`, `DEBUG-LOG.md`: execute the existing checklist; test the boundary in a controlled preview. | Medium | Yes |
| P1 | 375px usability, visible focus, contrast and `/products/5` refresh remain unverified. | Core pages, `COMPATIBILITY.md`, `DEPLOYMENT.md`: inspect and record results; fix only observed problems. | Medium | Yes |
| P1 | Third debugging case lacks a preserved failing Git revision; the three-case evidence is uneven. | `DEBUG-LOG.md`: retain available session output or document a real newly discovered issue with reproducible evidence and a fix commit. | Medium | Yes, for a browser issue |
| P1 | The Place order button does not expose the temporary disabled state described in P5.3. | `CheckoutPage.tsx`: review whether a small disabled-state correction is needed while keeping the existing duplicate-submit guard. | Small | Yes |
| P1 | Repository public access and the final submission are not evidenced. | GitHub repository and assignment form: check unauthenticated access, submit the repository link before the deadline, and retain confirmation. | Small | Yes |
| P2 | Successful HTTP JSON is asserted as Product/ProductsResponse without runtime shape validation. | `products.api.ts`: note the risk; change only if a real malformed-response failure is found. | Small | Only if observed |
| P2 | PLAN preceded feature code but was committed after the stated first-week window. | `PLAN.md` and first Git commit: explain the actual timing; do not backdate or rewrite history. | Small | No |
| P2 | PLAN proposes 45 commits but the official CORE has no numeric minimum. | `PLAN.md` is historical; explain the actual meaningful history at defence without manufacturing commits. | Small | No |
| OPTIONAL | Search, filtering, sorting, pagination, Orders, Profile, promo codes, dark mode and Sign up. | Separate FULL/BONUS work only after CORE evidence is complete. | Large | Yes if chosen |

## Recommended Next Steps

1. Run the existing CORE shopping checklist on the deployed site in Chrome and Firefox, recording PASS/FAIL only for observed actions. Include Login return, cart totals, invalid product, API error state and the local confirmation.
2. At 375px and desktop width, inspect every CORE page for overflow, touch targets, images and focus visibility. Open `/products/5` directly on Vercel, refresh it, and record the outcome.
3. Run one genuine mobile Lighthouse audit for the CORE report. Keep its actual Performance, Accessibility, Best Practices and CLS values; FULL score targets and before/after optimisation remain optional.
4. Test the Error Boundary fallback in a controlled preview and decide whether the Checkout button needs the small P5.3 disabled-state correction. Strengthen the third debugging case only with genuine evidence.
5. Check the GitHub repository without account access and complete the required external submission form by **6 November 2026, 23:59 Georgia time**. Keep the submission receipt. Prepare for the 5 November theory test and 7–8 November defence separately.

## Submission Readiness

**Final audit summary:** The matrix has 45 rows: **44 CORE criteria** and one clearly labelled optional cart-persistence addition. For the 44 CORE rows, **21 are VERIFIED, 16 IMPLEMENTED — NOT VERIFIED, 3 PARTIAL, 2 MISSING and 2 BLOCKED**. The optional persistence row is VERIFIED. These are row counts, not a grading percentage. The highest-priority gaps are the missing Chrome/Firefox observed checks and basic Lighthouse report, followed by live journey, 375px and deep-link verification. Mandatory manual checks include the full shopper path, browser/viewport review, `/products/5` refresh and the Error Boundary fallback. Implementation is substantially present and the build passes, but I cannot call the project submission-ready while those required checks and the external submission action lack evidence. My confirmation of the Vercel site and the local Git push history do not by themselves prove that the repository is publicly accessible or that the assignment form was submitted.
