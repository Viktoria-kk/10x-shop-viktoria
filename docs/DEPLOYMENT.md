# Deployment

## Overview

10X Shop is a React single-page application. Vite builds its HTML, CSS and JavaScript into static files, so it can be hosted without an application server. The project records identify [10x-shop-viktoria.vercel.app](https://10x-shop-viktoria.vercel.app/) as the Vercel URL. A previous general site confirmation is recorded, but the detailed hosted checks below have not been completed. On 10 November 2026, this workspace could not resolve the host, so current availability was not independently verified.

## Hosting Platform

I use **Vercel** for the public site. The source is in the [GitHub repository](https://github.com/Viktoria-kk/10x-shop-viktoria). The repository files do not establish whether automatic GitHub-to-Vercel deployment is configured.

## Production Build

Run `npm run build` from the repository root. The script runs `tsc --noEmit` and then `vite build`, writing output to `dist/`. The local build passed and produced `dist/index.html`, a JavaScript bundle and a CSS bundle. Current asset sizes are recorded in [REPORT.md](../REPORT.md); they change as the application changes. Product images are requested from DummyJSON URLs rather than copied into the build. `dist/` is generated and ignored by Git.

## Deployment Configuration

The only hosting-specific rule is in the root-level [`vercel.json`](../vercel.json), following [Vercel's Vite SPA guidance](https://vercel.com/docs/frameworks/frontend/vite):

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Vercel reads this file from the repository root when it deploys. Its rewrites check for existing files first, so the built CSS and JavaScript under `/assets/` can still be served normally. The configuration is not copied into `dist/` by Vite.

## SPA Routing

React Router handles `/`, `/login`, `/products/:id`, `/cart`, `/checkout` and unknown paths in the browser. If someone requests `/products/5` directly, a static host would otherwise look for a matching server file. The rewrite serves `index.html`, after which React Router selects `ProductPage`. An unknown URL still reaches the app and shows its Not Found page.

`/checkout` remains protected. A guest is redirected to `/login`; after local login, the app returns to Checkout when the cart has items. An empty cart redirects to `/cart`. `AuthContext` restores the local user from `sessionStorage` on refresh in the same tab. Logging out or ending the tab session clears that local sign-in; this is still simulated authentication.

## Build Settings for Redeployment

The repository's Vite build settings are:

- Framework preset: Vite.
- Project root: repository root.
- Build command: `npm run build`.
- Output directory: `dist`.

These are the required project settings for a Vercel redeployment; the repository does not record the hosted dashboard settings. Run the live checks below and record each observed result before claiming that a particular route or interaction has passed.

The current source does not require environment variables. If Vercel's build fails, check its Node.js version against the project tooling; the local build used Node.js 22.16.0.

## Verification Checklist

**Detailed hosted checks are PENDING.** A previous general website confirmation does not establish the individual scenarios below. On 10 November 2026, requests for `/` and `/products/5` from this workspace failed at DNS resolution; this is an access limit, not evidence that the site itself is down. Tick an item only after observing it on the deployed URL.

- [ ] The root URL loads the application and Catalogue products appear.
- [ ] Product images load without broken links.
- [ ] Product cards open the matching Product Details pages.
- [ ] `/products/5` opens when entered directly in the address bar.
- [ ] Refreshing `/products/5` still loads Product Details.
- [ ] `/login` opens directly.
- [ ] `/cart` opens directly and shows its current empty or populated state.
- [ ] `/checkout` opens the application and follows the existing guest redirect.
- [ ] After adding an item and logging in, the visitor can return to Checkout.
- [ ] An unknown URL shows the React Not Found page.
- [ ] Add to cart works from a product card and Product Details.
- [ ] Cart items persist after a refresh in the same browser and origin.
- [ ] The Header cart badge changes with cart quantity.
- [ ] Login and Logout work as local actions.
- [ ] Checkout validation shows the expected field errors.
- [ ] A valid Checkout submission shows the local order confirmation.
- [ ] The completed order clears the cart and badge.
- [ ] The site remains usable at a narrow mobile viewport, including 375px.
- [ ] CSS and JavaScript assets load without missing-file responses.
- [ ] The browser console shows no unexpected deployment-related errors.

## Known Limitations

Static hosting does not add a backend. Login is local state, cart data is browser `localStorage`, Checkout is a local simulation, and no payment is processed. The application needs client-side JavaScript and access to DummyJSON for product data. The SPA rewrite is configured locally, but direct-route behaviour on Vercel still needs live verification.

## Deployment Status

**Recorded Vercel URL:** [https://10x-shop-viktoria.vercel.app/](https://10x-shop-viktoria.vercel.app/). The production build and root-level `vercel.json` were verified locally. Current live availability and the detailed hosted checklist remain unverified from this workspace.
