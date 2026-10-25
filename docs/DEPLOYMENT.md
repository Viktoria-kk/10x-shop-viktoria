# Deployment

## Overview

10X Shop is a React single-page application. Vite builds its HTML, CSS and JavaScript into static files, so it can be hosted without an application server. This document records preparation, not a completed deployment.

## Hosting Platform

I prepared the repository for **Netlify** because no hosting provider was previously configured. The source remains in the existing GitHub repository; Netlify can build and publish it when I connect the repository later. No hosting account was accessed for this commit.

## Production Build

Run `npm run build` from the repository root. The script runs `tsc --noEmit` and then `vite build`, writing output to `dist/`. The local build passed and produced `dist/index.html`, a JavaScript bundle and a CSS bundle. Vite reported **289.45 kB JavaScript** (**88.77 kB gzip**) and **18.31 kB CSS** (**4.28 kB gzip**). Product images are requested from DummyJSON URLs rather than copied into the build. `dist/` is generated and ignored by Git.

## Deployment Configuration

The only hosting-specific rule is in [`public/_redirects`](../public/_redirects):

```text
/* /index.html 200
```

Vite copies files from `public/` into the root of `dist/`. The local build confirmed that `dist/_redirects` exists with this exact rule. It is an unforced Netlify rewrite, so existing files such as `/assets/...` are served normally.

## SPA Routing

React Router handles `/`, `/login`, `/products/:id`, `/cart`, `/checkout` and unknown paths in the browser. If someone requests `/products/5` directly, a static host would otherwise look for a matching server file. The rewrite serves `index.html`, after which React Router selects `ProductPage`. An unknown URL still reaches the app and shows its Not Found page.

`/checkout` remains protected. A guest is redirected to `/login`; after local login, the app returns to Checkout when the cart has items. An empty cart redirects to `/cart`. Refreshing resets the simulated login state because it is held only in React Context.

## Deployment Steps

When I am ready to publish:

1. In Netlify, import the existing GitHub repository `Viktoria-kk/10x-shop-viktoria` from its `main` branch.
2. Use the repository root as the base directory, `npm run build` as the build command, and `dist` as the publish directory.
3. Deploy the site, then record its real public URL in `README.md`.
4. Run the live checks below before describing the deployment as working.

The current source does not require environment variables. If Netlify's build fails, check its Node.js version against the project tooling; the local build used Node.js 22.16.0.

## Verification Checklist

**All hosted checks are PENDING.** Tick an item only after observing it on the deployed URL.

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

Static hosting does not add a backend. Login is local state, cart data is browser `localStorage`, Checkout is a local simulation, and no payment is processed. The application needs client-side JavaScript and access to DummyJSON for product data. The SPA rewrite is configured locally, but direct-route behaviour on Netlify still needs live verification.

## Deployment Status

**Prepared, not deployed.** The production build and copied `_redirects` file were verified locally. There is no verified public URL or hosted test result yet.
