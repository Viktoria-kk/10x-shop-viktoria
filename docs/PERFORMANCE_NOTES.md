# CORE performance review

## Purpose and scope

Review the current storefront for avoidable work without changing CORE behaviour. On 25 October 2026, I inspected the Catalogue, product grid and cards, product details, cart and checkout, authentication, Header, API functions, pricing helpers, effects, routing, and Vite configuration. No standalone PRD or Appendix A was available in the repository; the current source and `PLAN.md` informed this review.

## Findings and actions

| Area | Finding | Action | Reason |
| --- | --- | --- | --- |
| API requests | Catalogue and details fetch in `useEffect`, never during rendering. Details validates the route ID, uses `[productId]`, and remounts on ID changes. Both effects ignore late responses after cleanup and handle errors. | No change | No production duplicate or stale-response bug was confirmed. React StrictMode may repeat an effect cycle during development. |
| State and cart calculations | Cart count and subtotal are derived from cart items in `CartContext`; total currently equals subtotal. Checkout, Cart, and Header reuse these values. Login status is derived from `user`. Saved cart entries are validated before use. | No change | These short reductions do not justify memoisation or a provider rewrite without profiling evidence. |
| Rendering | Context consumers may render when context values change, but no React Profiler measurements are available. | No change | A costly render has not been demonstrated. |
| Images | Catalogue cards use DummyJSON thumbnails with lazy loading, dimensions, an aspect-square wrapper, and `object-contain`. Cart uses saved thumbnails with dimensions. Details uses product images for the main view and gallery with `object-contain`; the main image has dimensions. | No change | The existing sources suit their roles. Gallery images may be larger than thumbnails, but no suitable per-image small URLs or measured bottleneck were established. |
| Build and dependencies | The production build succeeds with 43 transformed modules and one application JavaScript and CSS asset. | No change | Vite reported no warning. Its summary does not provide a per-dependency size breakdown. |

**Confirmed performance issues:** none from source review and build inspection. **Applied optimisations:** none; no source files or dependencies changed. The image and render observations above are potential areas to measure, not measured problems.

## Production build measurements

`npm run build` passed (Vite 8.3.5). Vite reported `dist/assets/index-_rdB8aII.js` at **288.41 kB** (**88.53 kB gzip**) and `dist/assets/index-ejpnInMU.css` at **18.22 kB** (**4.27 kB gzip**). `dist/index.html` was **0.39 kB** (**0.26 kB gzip**). The build reported no warnings. `npm run typecheck` and `npm run lint` also passed.

## Kept unchanged and future work

StrictMode, current fetch effects, cart persistence and calculations, image presentation, routes, styles, and Vite configuration remain unchanged. Route splitting, selective memoisation, or more detailed image handling are possible FULL-level work only if later profiling shows a real cost. No caching, new dependencies, or other FULL features were added.

## Testing limits

The app, server, and browser were not launched. There are no existing automated tests or React Profiler/Lighthouse results for this review. Vite's output gives generated asset sizes and gzip estimates, not page-load time, rendering speed, network request count, or user-perceived responsiveness. Runtime behaviour and performance improvements therefore remain unmeasured; no speedup is claimed.
