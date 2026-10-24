# 10X Shop — Project Plan

## Project overview

10X Shop is an English-language, responsive single-page storefront for an individual front-end graduation project. It gives a shopper a simple way to browse products, inspect one product, manage a cart, and place a simulated order. The main journey is catalog → product details → cart → protected checkout → local confirmation. The graduation goal is to demonstrate clear React and TypeScript architecture, reliable interaction and validation, responsive design, and an explainable development process. No real payment or authentication service is involved.

## Scope and priorities

**CORE comes first.** The required release includes:

- A shared Header and Footer; routes for `/`, `/login`, `/products/:id`, `/cart`, `/checkout`, and `*`; a Not Found page for invalid routes and products.
- Local authentication in `AuthContext`; a controlled Username and Password form with required validation; a protected checkout route that returns the shopper to checkout after login.
- A DummyJSON catalog loaded with native `fetch` in `useEffect`; typed API data; loading, error, and empty states; reusable `ProductCard` and `ProductGrid` components.
- A product details request to `GET /products/:id`, product images and information, and basic quantity selection.
- A shared `CartContext` with immutable add, remove, and quantity updates, plus subtotal and total calculations.
- A controlled checkout form for Full name, Email, Address, and City; required inline validation; local order confirmation; cart clearing after success.
- Responsive Tailwind layouts and interaction states; accessibility checks; an Error Boundary; documented real debugging work; passing typecheck, lint, and production build; accurate README and REPORT; deployment with working direct route refreshes.

**FULL (deferred):** Orders and Profile pages. Search, category filters, sorting, and pagination are possible later enhancements only after separate direction and a complete CORE. They are not active tasks in this plan.

**BONUS (deferred):** Reviews, related products, or a theme switch could be considered only if time remains and separate requirements justify them. Real login and payment are outside this project's planned scope.

## Technology stack

| Technology | Purpose in 10X Shop |
| --- | --- |
| Vite | Local development server and production bundling. |
| React 19 | Functional components, local state, effects, and Context providers. |
| TypeScript, strict mode | Types for API responses, props, forms, and shared state; early error detection. |
| React Router | Client-side pages, product IDs, Not Found handling, and protected checkout navigation. |
| Tailwind CSS v4 and `@tailwindcss/vite` | Responsive layout and interactive styling through Vite. |
| DummyJSON products API | Remote catalog and product detail data. |
| Native browser `fetch` | Direct API requests without an extra HTTP library. |
| React Context | Shared authentication and cart state where multiple pages need it. |

Keep pages, reusable components, contexts, API functions, and domain types separate. Use straightforward hooks and immutable updates; add no abstraction or dependency without a concrete need.

## Work breakdown structure

Each row is a coherent, reviewable change that can support a meaningful commit. Hours are estimates for implementation and focused verification, not a claim that work has already happened. `W2` and `W3` refer to the dates below. The rows provide more than 45 legitimate commit opportunities, including this initial planning change; actual commits should follow the work performed, not a quota-driven script.

### 1. Project Setup

| Task | Hours | Phase | Done when |
| --- | ---: | --- | --- |
| Write and review this project plan | 1.5 | W2 | Scope, schedule, risks, and completion criteria are explicit. |
| Scaffold Vite with React 19 and TypeScript | 1.5 | W2 | Starter app runs locally. |
| Enable and verify strict TypeScript checking | 1 | W2 | Strict settings and a working `typecheck` command exist. |
| Add Tailwind CSS v4 through its Vite plugin | 1 | W2 | A responsive utility renders correctly. |
| Establish focused folders and domain types | 1.5 | W2 | Pages, components, contexts, API code, and types have clear locations. |
| Set up lint and build scripts | 1 | W2 | `npm run lint` and `npm run build` execute. |

### 2. Layout and Routing

| Task | Hours | Phase | Done when |
| --- | ---: | --- | --- |
| Create the shared application shell | 1 | W2 | Pages render inside one layout. |
| Build an accessible responsive Header | 1.5 | W2 | Navigation works by keyboard and at narrow widths. |
| Add Footer and main content landmarks | 0.75 | W2 | Shared structure is present on pages. |
| Register the required routes | 1.5 | W2 | Every required path resolves to its intended page. |
| Add invalid-route and invalid-product handling | 1.5 | W2 | Unknown URLs and missing products show Not Found. |

### 3. Authentication

| Task | Hours | Phase | Done when |
| --- | ---: | --- | --- |
| Create local `AuthContext` state and actions | 1.5 | W2 | Components can read login state and log in or out. |
| Build controlled Login fields | 1 | W2 | Username and Password values remain in React state. |
| Add required validation and inline messages | 1 | W2 | Blank submission is blocked with clear feedback. |
| Protect checkout and preserve return destination | 1.5 | W2 | Signed-out checkout redirects to login, then returns. |
| Show authentication state in the Header | 0.75 | W2 | Login/logout controls reflect current state. |

### 4. Product Catalog

| Task | Hours | Phase | Done when |
| --- | ---: | --- | --- |
| Define typed DummyJSON product responses | 1 | W2 | Catalog data is handled without `any`. |
| Add a small native-fetch products function | 1 | W2 | Non-success responses surface as errors. |
| Load catalog data in the home page effect | 1.5 | W2 | Products appear after a successful request. |
| Add catalog loading and error states | 1 | W2 | Waiting and failed requests are understandable. |
| Add catalog empty state | 0.75 | W2 | An empty response has a useful message. |
| Build reusable `ProductCard` and `ProductGrid` | 2 | W2 | Typed cards form a responsive catalog grid. |

### 5. Product Details

| Task | Hours | Phase | Done when |
| --- | ---: | --- | --- |
| Fetch `GET /products/:id` with typed data | 1.5 | W2 | Valid IDs load the matching product. |
| Show product information and images | 1.5 | W2 | Key details and an image display render accessibly. |
| Add loading, request error, and missing-product states | 1.25 | W2 | Each outcome has the correct feedback or Not Found page. |
| Add bounded quantity selection | 1 | W2 | Shopper can choose a valid positive quantity. |

### 6. Shopping Cart

| Task | Hours | Phase | Done when |
| --- | ---: | --- | --- |
| Define cart item types and `CartContext` | 1.5 | W2 | Cart data is shared and typed. |
| Add product and selected quantity to cart | 1.25 | W2 | Repeat adds update the existing item immutably. |
| Render cart items and an empty state | 1.5 | W3 | Both populated and empty carts are useful. |
| Change item quantities | 1 | W3 | Valid edits update the cart immutably. |
| Remove a cart item | 0.75 | W3 | Only the selected item is removed. |
| Calculate subtotal and total | 1 | W3 | Displayed amounts match cart quantities and prices. |

### 7. Checkout

| Task | Hours | Phase | Done when |
| --- | ---: | --- | --- |
| Build controlled checkout fields | 1.5 | W3 | Full name, Email, Address, and City are editable state. |
| Validate required fields with inline errors | 1.25 | W3 | Invalid submissions are blocked and explained. |
| Show order summary from cart totals | 1 | W3 | Checkout amounts match the cart. |
| Add local confirmation flow | 1.5 | W3 | Valid submission shows a clear confirmation without payment. |
| Clear cart after a successful order | 0.75 | W3 | A confirmed order leaves an empty cart. |

### 8. Quality, Responsiveness, and Debugging

| Task | Hours | Phase | Done when |
| --- | ---: | --- | --- |
| Add an Error Boundary and fallback | 1.5 | W3 | A render failure shows a recoverable fallback. |
| Check keyboard, labels, focus, and feedback | 1.5 | W3 | Main journey is usable without a mouse. |
| Verify layouts at 375px and desktop widths | 1.5 | W3 | Core pages have no unintended horizontal scroll. |
| Exercise loading, error, empty, and invalid-ID paths | 1.5 | W3 | Each required edge state behaves as planned. |
| Record and fix genuine debugging issues | 1.5 | W3 | Reproducible issues, causes, and fixes are recorded. |
| Run final typecheck, lint, build, and journey checks | 2 | W3 | Commands pass and the complete shopper journey works. |

### 9. Documentation and Deployment

| Task | Hours | Phase | Done when |
| --- | ---: | --- | --- |
| Write setup and usage README | 1.5 | W3 | Another student can run and understand the project. |
| Write an accurate graduation REPORT | 2 | W3 | Architecture, decisions, testing, and real debugging are described. |
| Configure and deploy to Vercel or Netlify | 2 | W3 | Public production URL serves the built app. |
| Verify direct SPA route refreshes | 1 | W3 | Reloading `/products/5` and other routes works. |
| Review docs, repository, and submission package | 1 | W3 | Links, instructions, and actual implementation agree. |

## Implementation schedule

| Official week | Dates | Priority |
| --- | --- | --- |
| Week 1 | October 17–23, 2026 | The official first week has elapsed. No completed work is claimed here because the repository does not show it. |
| Week 2 | October 24–30, 2026 | Write the plan, establish the app foundation, then implement routes, local login, catalog, product details, and initial cart state. |
| Week 3 | October 31–November 6, 2026 | Complete cart and checkout, then reserve time for responsive and accessibility checks, bug fixes, docs, deployment, and route-refresh verification. |

**Submission deadline:** November 6, 2026 at 23:59 Georgia time. As of October 24, protect the final days for verification and submission. If estimates slip, reduce polish and defer all FULL/BONUS ideas before cutting CORE behavior or quality gates.

## Risks and mitigation

| Risk | Practical mitigation |
| --- | --- |
| DummyJSON fails, changes shape, or is unavailable | Handle failed and empty responses visibly; keep the typed fetch code small; test success and failure paths; retry verification when the API returns. |
| Limited time until November 6 | Finish the required journey before optional work; review progress daily; leave Week 3 capacity for fixes and deployment. |
| Deployment serves 404 on a direct SPA route refresh | Configure the host's rewrite/fallback to the app entry point and test direct loads of `/products/5`, `/cart`, and `/checkout`. |
| Narrow screens or browser differences break the layout | Check 375px and desktop widths during implementation, use semantic controls, and test at least two current browsers before submission. |

## CORE definition of done

CORE is complete only when the catalog → detail → cart → protected checkout → confirmation journey works; every required page and interaction works; loading, error, empty, invalid-route, and invalid-product states behave correctly; and the Error Boundary displays its fallback when needed. `npm run typecheck`, `npm run lint`, and `npm run build` must pass. The app must work at 375px and desktop widths with no unintended horizontal scrolling. README.md and REPORT.md must accurately describe the implementation and genuine debugging issues. The Git history must reflect real development. A deployed Vercel or Netlify version must work, including direct URL refresh on routes such as `/products/5`.

## Version control strategy

Plan for at least **45 small, meaningful commits**, each representing one coherent change that can be reviewed and explained. Use `feat:`, `fix:`, `refactor:`, `perf:`, `docs:`, and `test:` where they truthfully describe the change. Commit work in authentic chronological order. Do not invent past dates, fake defects, or split one trivial edit into several commits merely to reach a number. The first commit contains only this plan; implementation begins afterward.
