# 10X Shop — Final Project Report

## 1. Project Overview

10X Shop is my individual front-end graduation project. I built it as a single-page shopping application to bring the React and TypeScript concepts from the course into one understandable journey: browse products, view details, manage a cart and place a simulated order. Tailwind CSS v4 styles the interface, DummyJSON supplies product information, React Router selects pages, and React Context shares login and cart state. It is a learning project rather than a commercial store; there is no account database, order service or payment processing.

The project gave me a way to connect components and props with state, effects, Context, typed API responses, controlled forms and responsive layouts. Each part has a practical purpose in the shopper journey, so I can explain how data and actions move between pages instead of treating features as isolated exercises.

## 2. Goals and Initial Plan

In [PLAN.md](PLAN.md), I set out to complete the CORE storefront before considering optional features. The planned work covered project setup, routing and shared layout, local authentication, a catalogue and product details, cart state, checkout, styling, quality checks, documentation and deployment. Search, sorting, Orders and Profile were deferred; they were not needed for the main journey.

The plan divided the work into small, reviewable stages. That order mattered: product types and request functions had to exist before the catalogue could display live data, and the cart had to be shared before Checkout could use its totals. The plan's hours were estimates, not a record of time actually spent. I have kept the historical plan as written rather than presenting its proposed schedule as completed dates.

## 3. Planned vs Implemented Features

The statuses below describe what the source and project records support. **Implemented** does not mean that every route and interaction has passed a live browser test. **Not verified** identifies checks that still need an observed result.

| Feature | Level | Status | Notes |
| --- | --- | --- | --- |
| Vite, React and TypeScript setup; strict typing | CORE | Implemented | Build scripts and strict configuration are present. |
| Tailwind CSS v4; shared palette | CORE | Implemented | Vite plugin, utilities and CSS variables are present. |
| Reusable components and shared layout | CORE | Implemented | Header, Footer, product and cart components are separated. |
| React Router navigation and Not Found handling | CORE | Implemented | Required paths and unknown-path fallback are declared. |
| Login and AuthContext | CORE | Implemented | Controlled validation and local login state. |
| Protected Checkout | CORE | Implemented | Guests go to Login and can return to Checkout. |
| DummyJSON catalogue request | CORE | Implemented | Requests 12 products with loading, error and empty branches. |
| Catalogue cards and grid | CORE | Implemented | Reusable components use fetched product data. |
| Product Details and image selection | CORE | Implemented | Dynamic product request and thumbnail state. |
| Stock-aware quantity and Add to cart | CORE | Implemented | Remaining stock bounds selection; focused harness passed. |
| CartContext and persistence | CORE | Implemented | Shared state and guarded `localStorage` restoration. |
| Cart quantity updates, Remove and Clear | CORE | Implemented | Cart actions and empty state are present. |
| Cart item count and totals | CORE | Implemented | Totals derive from discounted prices and quantities. |
| Controlled Checkout and validation | CORE | Implemented | Required fields have inline errors. |
| Local confirmation and cart clearing | CORE | Implemented | Submission records a confirmation before clearing the cart. |
| Responsive layout and interaction states | CORE | Partially implemented | Responsive classes and focus, hover and disabled styles exist; viewport behaviour is not verified. |
| Error Boundary | CORE | Implemented | Render-error fallback offers Reload. |
| Debugging record | CORE | Partially implemented | Three documented cases have different evidence strengths; one failing draft is absent from Git. |
| Production build, README, PLAN and report | CORE | Implemented | Build passes; this report completes the documentation set. |
| Vercel deployment | CORE | Partially implemented | Public site works according to my confirmation; detailed hosted checks remain open. |
| Chrome, Firefox, keyboard and screen-reader checks | CORE quality | Not verified | No completed browser or assistive-technology results are recorded. |
| Search, sorting, Orders and Profile | Optional FULL | Not implemented | Deferred outside CORE scope. |

## 4. Technologies and Architecture

React components divide the interface into pages and smaller pieces, with typed props carrying product and cart information. `useState` holds local values such as the selected product image and form fields. `useEffect` loads product data after a page mounts and saves cart changes to browser storage. Conditional rendering gives the catalogue and product page distinct loading, error and success views.

TypeScript describes product responses, cart items, user state and checkout forms. Strict checking catches incompatible data use before a build. Small functions under `src/api/` use native `fetch` for the DummyJSON catalogue and product details; they check HTTP success and let pages show an error instead of crashing. The catalogue requests 12 products, while `/products/:id` loads a selected product.

React Router handles `/`, `/login`, `/products/:id`, `/cart`, protected `/checkout` and unknown paths. `AuthContext` holds a temporary user in memory. `CartContext` owns item changes and calculates the badge count, subtotal and total from current items. It also reads and writes `shop_cart` in `localStorage`, checking saved values before using them. This keeps related shopping state in one place without a separate state library. Tailwind's responsive grid and flex utilities work alongside CSS variables for the shared colours.

## 5. Visual Design Decisions

I wanted product images and the shopping actions to remain the focus. My chosen direction is restrained and spacious, with typography and whitespace separating content instead of placing every element inside a heavy rectangular card. Softly rounded surfaces appear where they help group content. The same visual hierarchy carries through the catalogue, details, cart and forms.

The palette uses charcoal `#2C2C2C` for readable text, muted berry `#853953` and deep plum `#612D53` for emphasis, and soft neutral `#F3F4F4` for the base. Shared CSS variables keep those choices consistent. Responsive grid and flex layouts let content rearrange for narrower screens; the exact appearance and overflow at 375px still require a recorded browser check. I have not treated source-level styling review as a usability study.

## 6. Development Process

The Git history shows progress from the initial plan and Vite setup through routes, reusable product displays, local login, DummyJSON requests, cart actions and Checkout. Later changes added cart persistence, more consistent visual states, an Error Boundary, debugging and quality documentation, and Vercel configuration. These stages made each change easier to review and gave connected features a stable base.

The code stays relatively direct: request functions fetch data, pages control page-specific state, and Context handles values needed across routes. I kept the CORE journey ahead of optional work. Incremental commits also made it possible to trace the stock-control and heading changes back to their earlier code, although a draft fixed before commit cannot be reconstructed from Git alone.

## 7. Challenges and Debugging

The three genuine cases are described in [DEBUG-LOG.md](DEBUG-LOG.md), with their evidence limits. First, the Product Details `+` control used total stock while Add to cart checked remaining stock. With units already in the cart, the control could offer a quantity the action would refuse. The fix made both use remaining stock; a focused component harness passed. This showed me why a control and its final validation must agree.

Second, Product Details had an `<h1>` in its success view but not in its early loading and request-error returns. Adding a heading to those branches gave each state a clear page structure. This was confirmed from source changes, not by a screen-reader session. Third, an unused parameter in an Error Boundary working draft failed ESLint even though TypeScript and build checks had passed. Removing it resolved the lint error. The failing draft exists in recorded session output but not in a Git commit, so it has weaker reproducibility than the other two cases.

## 8. Testing and Quality

`npm run typecheck`, `npm run lint` and `npm run build` pass for the final documentation change. The [CORE test checklist](docs/CORE_TEST_CHECKLIST.md) records focused mocked harness passes for API responses, remaining-stock controls, cart operations and saved-data handling, local login and route protection, and Checkout validation and confirmation. Those checks are useful evidence for particular behaviours, but they are not a browser test of the full journey. The source also includes loading and error messages, guarded storage access and an Error Boundary.

The [compatibility review](COMPATIBILITY.md) leaves Chrome, Firefox and mobile-sized browser scenarios **NOT TESTED**. Keyboard and screen-reader use, a complete shopping journey, direct-route refreshes and 375px overflow are also unverified in the recorded checklist. The [performance notes](docs/PERFORMANCE_NOTES.md) contain build observations but no measured runtime improvement or Lighthouse audit. This distinction matters because a passing static check cannot prove that the interface behaves correctly in every browser.

## 9. Deployment

I deployed 10X Shop on Vercel. The [live site](https://10x-shop-viktoria.vercel.app/) is public, and the [GitHub repository](https://github.com/Viktoria-kk/10x-shop-viktoria) contains the source. I have confirmed that the deployed website works, while the detailed hosted checklist in the [deployment guide](docs/DEPLOYMENT.md) remains unrecorded. I am not treating that general confirmation as evidence of every route, viewport or browser.

Vite produces static files in `dist/` with `npm run build`. The root `vercel.json` rewrites requests to `/index.html` so React Router can handle application URLs requested directly. The rewrite is configured; refreshing individual hosted routes still needs a documented live check. Hosting the frontend does not add a real account or order server.

## 10. Project Metrics

These values come from the current checks and Git history. Bundle sizes are Vite output sizes, not network transfer or runtime performance measurements.

| Metric | Value | Notes |
| --- | --- | --- |
| TypeScript check | Pass | `npm run typecheck` in this report change. |
| ESLint | Pass | `npm run lint` in this report change. |
| Production build | Pass | `npm run build` in this report change. |
| Main JavaScript bundle | 289.45 kB; 88.77 kB gzip | Current Vite build output. |
| Main CSS bundle | 18.33 kB; 4.29 kB gzip | Current Vite build output. |
| Lighthouse Performance | Not measured | No saved audit. |
| Lighthouse Accessibility | Not measured | No saved audit. |
| Lighthouse Best Practices | Not measured | No saved audit. |
| Lighthouse CLS | Not measured | No saved audit. |
| Total Git commits | 32 | `main`, including this report commit. |
| Pull requests | Not verified | No repository count established. |
| Closed issues | Not verified | No repository count established. |
| Time per workstream | Not tracked | PLAN estimates are not actual time records. |

## 11. Limitations

Authentication is simulated in React state and resets after refresh. There is no registration or user database. Cart contents persist only in the current browser and origin through `localStorage`; a local order confirmation does not create a server order or charge a payment. Catalogue and details pages depend on DummyJSON and network access. Search, filtering, sorting, pagination, Orders and Profile remain outside the implemented CORE scope.

The application has responsive rules and accessible markup choices, but recorded manual browser, assistive-technology and Lighthouse results are still missing. These are limits on what I can claim about verification, not evidence that those scenarios fail.

## 12. What I Would Do Differently

If I repeated the project, I would record manual checks alongside each feature instead of leaving the full browser journey until the quality stage. In particular, I would check the catalogue-to-checkout path, direct route refreshes, narrow viewports and keyboard use as the connected pieces became available. That would give later documentation observed results rather than source-based expectations.

I would also keep a clearer record of bug reproductions and time spent while working. The existing debugging log shows why evidence matters: two fixes can be inspected against earlier commits, while the lint draft depends on session output. I would still favour the straightforward Context and API functions used here over extra abstractions unless a real need appeared.

## 13. AI Assistance

I used AI assistance during the development workflow for implementation suggestions, code review, debugging discussion and documentation drafts. The project history shows assisted work across several stages, so it would be inaccurate to describe AI as only a spelling aid. The available records do not support a precise percentage of AI-written code, and I have not invented one. I remain responsible for the project's scope and design direction, for understanding the final code, and for checking claims against the source and test records. This report states where verification is still needed rather than treating generated suggestions as proof that a feature works.

## 14. Final Reflection

10X Shop brings the course concepts together in one application: typed external data feeds reusable views, shared state connects the cart to multiple pages, routing supports a protected checkout, and controlled forms lead to a local confirmation. The project progressed from a written plan to a public Vercel site with a consistent visual direction. I can now explain how the pieces fit together and where the evidence stops. Completing the remaining browser and accessibility checks would make the final evaluation stronger, but the current CORE implementation already gives me a concrete system to discuss during my graduation defence.
