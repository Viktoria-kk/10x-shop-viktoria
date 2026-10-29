# 10X Shop

## About the Project

10X Shop is my individual front-end graduation project: a single-page shopping application built with React, TypeScript and Tailwind CSS v4. It uses product data from the DummyJSON API and focuses on a clear journey from browsing to a simulated order confirmation.

I use this project to demonstrate routing, reusable components, shared state, controlled forms and responsive layouts. The application has no real account database, payment service or order backend. I have kept the CORE implementation small enough to understand and explain.

## Features

- A storefront homepage with an editorial perfume photograph, featured DummyJSON products and the complete Catalogue below the landing sections.
- A homepage Catalogue with URL-based pagination: 12 products per page, using DummyJSON `limit`, `skip` and the returned total. Search from the Catalogue or expandable Header control uses the same `?q=` value and paginates matching results.
- Product Details with images, thumbnail selection, stock-aware quantity controls and Add to cart.
- A shared cart with quantity changes, Remove and Clear cart actions, discounted totals and a Header item count. Cart items are saved in browser `localStorage`.
- One account link in the Header: it says **Log in** for guests and **Account** for signed-in visitors.
- Local Login and Sign up forms link to each other. Direct sign-in opens Profile; guests who attempted Checkout return there after either form.
- A protected Profile page lets me edit first name, last name, email and optional phone within the current React session. The username remains separate, and shopping, cart and Log out actions remain available.
- My orders and individual Order Details show purchases saved in this browser, with a simulated status and a Reorder action that checks current product availability before adding items to the cart.
- A controlled Checkout form with inline validation and an order summary. A valid submission prevents repeat orders, shows a local confirmation and clears the cart; it does not process a payment.
- Not Found handling for unknown routes or invalid products, and an application Error Boundary with a Reload fallback for unexpected render errors.

## Technologies Used

| Technology | How it is used |
| --- | --- |
| React and React Context | Components and shared cart and login state. |
| TypeScript | Types for product data, cart items, forms and component contracts. |
| Vite | Development tooling and the production build. |
| Tailwind CSS v4 | Responsive layouts and interface styling. |
| React Router | Page routes, product URLs and protected Checkout, Profile and Orders routes. |
| DummyJSON REST API and native `fetch` | Catalogue and Product Details data. |
| Browser `localStorage` | Separate `shop_cart` and `shop_orders` data across refreshes in the same browser and origin. |
| Browser `sessionStorage` | Signed-in profile details across refreshes in the current tab session. |
| ESLint | Static checks for code quality and React hooks. |

## Project Structure

```text
src/
  api/          Product request functions
  components/   Shared layout, product, cart and Error Boundary components
  context/      Cart and local authentication providers
  pages/        Home, Catalogue, Product Details, Login, Sign up, Profile, Cart, Checkout and Orders pages
  routes/       Route definitions and protected-route check
  types/        Product, cart, user and checkout types
  utils/        Price calculation and formatting helpers
  main.tsx      BrowserRouter and provider setup
  index.css     Tailwind import and shared colour variables
```

The API functions fetch product data for the pages. Pages pass products to reusable components; `CartContext` shares cart data with the Header, product views, Cart and Checkout. `AuthContext` holds the local login state, and React Router chooses the page for each URL.

## How It Works

The main route is **Home → Catalogue → Product Details → Add to cart → Cart → Login or Sign up if needed → Checkout → Order confirmation**. Home at `/` introduces the shop with selected API-backed products and the full Catalogue below; its Shop now link jumps to that section. The separate product grid also remains at `/catalogue`. The Header Search expands when selected, and its field and the Catalogue field share the URL's `?q=` value. Searching from another page opens `/?q=...#catalogue`. The homepage Catalogue uses `?page=` for 12-product pages; search results use the same pagination and show the matching total. Changing the query resets to page one, while page changes keep the query and return to the Catalogue section. Product requests go to DummyJSON. The cart lives in React Context and is saved under `shop_cart` in `localStorage`. The Header says Log in for guests and Account for signed-in visitors. Login and Sign up link to each other while carrying an attempted Checkout or Orders destination through router state. Profile edits update `AuthContext` for this session; Log out leaves the cart alone. Neither form verifies credentials against a server or creates a permanent account. Valid Checkout saves a snapshot of the items, prices, shipping fields and total under `shop_orders` before clearing the cart. The confirmation links to its Order Details. Profile links to My orders, where saved purchases appear newest first with simulated Processing, Shipped and Delivered stages based on when they were placed. Reorder checks current products and stock, then adds them to the existing cart at current prices; it does not create another order. No payment or shipping service is involved.

## Getting Started

Install Node.js and npm, then run these commands from the repository root. The project has been checked locally with Node.js 22.16.0 and npm 10.9.2; `package.json` does not specify a separate engine requirement.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Product data needs an internet connection to DummyJSON. No environment variables are required by the current source.

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run typecheck` | Check TypeScript without emitting files. |
| `npm run lint` | Run ESLint. |
| `npm run build` | Run TypeScript checks and build production files in `dist/`. |
| `npm run preview` | Serve an existing production build locally for inspection. |

## Local Login

The Login and Sign up forms require a password of at least eight characters with a letter and a number; neither checks credentials against a server. Direct Login or Sign up opens Profile; an attempted Checkout still takes priority. The Profile change-password form checks the new password and confirmation, but it does not save a credential. The username, any Sign up email and later Profile edits are saved in this tab's `sessionStorage` so a refresh keeps you signed in. Logging out or ending the tab session clears that local sign-in; the cart can still remain in `localStorage`.

## Checkout Prefill

I prefill Checkout's Full name and Email from the current Profile when those details are available. A separate button can copy Address and City from the most recent valid order saved in this browser; it never replaces the current contact details. Every field remains editable and goes through the usual Checkout validation. Profile details come from the current local session, and no shipping details are fetched from a backend.

## Live Demo

The [live Vercel demo](https://10x-shop-viktoria.vercel.app/) is available. See the [deployment guide](docs/DEPLOYMENT.md) for build settings, SPA routing and outstanding hosted checks.

## Testing and Quality

The project has passing `typecheck`, `lint` and `build` checks. [CORE_TEST_CHECKLIST.md](docs/CORE_TEST_CHECKLIST.md) separates mocked harness checks from browser work that is still **NOT TESTED**. [COMPATIBILITY.md](COMPATIBILITY.md) records pending Chrome and Firefox checks. [PERFORMANCE_NOTES.md](docs/PERFORMANCE_NOTES.md) records actual build sizes and explains that runtime performance was not measured. [DEBUG-LOG.md](DEBUG-LOG.md) traces real debugging cases and their evidence limits.

I have not claimed a completed browser journey, screen-reader audit, cross-browser result or Lighthouse score. Those checks still need to be performed in the live preview and recorded accurately.

## Design Approach

I wanted the interface to feel restrained and spacious, with clear typography and product images as the focus. The design uses few unnecessary boxes and softly rounded surfaces where they help. The shared palette is charcoal `#2C2C2C`, muted berry `#853953`, deep plum `#612D53` and soft neutral `#F3F4F4`. I keep these colours in CSS variables in `src/index.css` so the pages use them consistently.

## Current Limitations

- Login and Sign up are simulated locally; Sign up creates no permanent account or user database. A refresh restores the current tab's session, while logging out clears it.
- Cart and order records are stored separately in the current browser and origin. Orders are not linked to a verified customer account or backend, and no payment is processed.
- Product loading depends on DummyJSON being available.
- Homepage search, pagination, local Profile editing and Order History are optional enhancements. Category and price filtering and sorting remain outside the current implementation.
- Browser, responsive and accessibility checks, plus deployed-route refresh checks, still need manual verification.

## Credits

DummyJSON supplies the product data. The editorial hero photograph is by [Kaboompics on Pexels](https://www.pexels.com/photo/close-up-shot-of-a-perfume-bottle-on-the-sand-8361545/), used under the [Pexels Licence](https://www.pexels.com/license/); it does not depict a catalogue product. React, TypeScript, Vite, Tailwind CSS and React Router provide the tools used to build the application. I used AI assistance for implementation suggestions, debugging review and documentation support; I am responsible for reviewing the result and understanding the code. A fuller reflection on that assistance belongs in the separate project report.
