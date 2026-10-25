# 10X Shop

## About the Project

10X Shop is my individual front-end graduation project: a single-page shopping application built with React, TypeScript and Tailwind CSS v4. It uses product data from the DummyJSON API and focuses on a clear journey from browsing to a simulated order confirmation.

I use this project to demonstrate routing, reusable components, shared state, controlled forms and responsive layouts. The application has no real account database, payment service or order backend. I have kept the CORE implementation small enough to understand and explain.

## Features

- A storefront homepage with an editorial perfume photograph, featured DummyJSON products and the complete Catalogue below the landing sections.
- A Catalogue that requests 12 DummyJSON products, with a responsive grid, product cards and loading, error and empty states.
- Product Details with images, thumbnail selection, stock-aware quantity controls and Add to cart.
- A shared cart with quantity changes, Remove and Clear cart actions, discounted totals and a Header item count. Cart items are saved in browser `localStorage`.
- A local Login form with validation, plus a protected Checkout route that sends guests to Login and returns them to Checkout afterwards.
- An optional local Sign up demonstration with four validated fields. It uses the same temporary login state and can return guests to Checkout.
- A controlled Checkout form with inline validation and an order summary. A valid submission prevents repeat orders, shows a local confirmation and clears the cart; it does not process a payment.
- Not Found handling for unknown routes or invalid products, and an application Error Boundary with a Reload fallback for unexpected render errors.

## Technologies Used

| Technology | How it is used |
| --- | --- |
| React and React Context | Components and shared cart and login state. |
| TypeScript | Types for product data, cart items, forms and component contracts. |
| Vite | Development tooling and the production build. |
| Tailwind CSS v4 | Responsive layouts and interface styling. |
| React Router | Page routes, product URLs and the protected Checkout route. |
| DummyJSON REST API and native `fetch` | Catalogue and Product Details data. |
| Browser `localStorage` | Cart persistence across refreshes in the same browser and origin. |
| ESLint | Static checks for code quality and React hooks. |

## Project Structure

```text
src/
  api/          Product request functions
  components/   Shared layout, product, cart and Error Boundary components
  context/      Cart and local authentication providers
  pages/        Home, Catalogue, Product Details, Login, Sign up, Cart and Checkout pages
  routes/       Route definitions and protected-route check
  types/        Product, cart, user and checkout types
  utils/        Price calculation and formatting helpers
  main.tsx      BrowserRouter and provider setup
  index.css     Tailwind import and shared colour variables
```

The API functions fetch product data for the pages. Pages pass products to reusable components; `CartContext` shares cart data with the Header, product views, Cart and Checkout. `AuthContext` holds the local login state, and React Router chooses the page for each URL.

## How It Works

The main route is **Home → Catalogue → Product Details → Add to cart → Cart → Login or Sign up if needed → Checkout → Order confirmation**. Home at `/` introduces the shop with selected API-backed products and the full Catalogue below; its Shop now link jumps to that section. The complete product grid also remains at `/catalogue`. Product requests go to DummyJSON. The cart lives in React Context and is also saved under `shop_cart` in `localStorage`. Login and Sign up only change local React state; neither verifies credentials against a server nor creates a permanent account. Checkout reads the cart totals, validates the form, shows a confirmation and clears the cart without sending an order to a server.

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

## Demo Login

The Login form accepts any non-empty username and a password of at least six characters. For example, `emilys` and `emilyspass` are valid form inputs, **not registered credentials**. Login is held only in React state, so a refresh resets it; the saved cart can still remain in `localStorage`.

## Live Demo

The [live Vercel demo](https://10x-shop-viktoria.vercel.app/) is available. See the [deployment guide](docs/DEPLOYMENT.md) for build settings, SPA routing and outstanding hosted checks.

## Testing and Quality

The project has passing `typecheck`, `lint` and `build` checks. [CORE_TEST_CHECKLIST.md](docs/CORE_TEST_CHECKLIST.md) separates mocked harness checks from browser work that is still **NOT TESTED**. [COMPATIBILITY.md](COMPATIBILITY.md) records pending Chrome and Firefox checks. [PERFORMANCE_NOTES.md](docs/PERFORMANCE_NOTES.md) records actual build sizes and explains that runtime performance was not measured. [DEBUG-LOG.md](DEBUG-LOG.md) traces real debugging cases and their evidence limits.

I have not claimed a completed browser journey, screen-reader audit, cross-browser result or Lighthouse score. Those checks still need to be performed in the live preview and recorded accurately.

## Design Approach

I wanted the interface to feel restrained and spacious, with clear typography and product images as the focus. The design uses few unnecessary boxes and softly rounded surfaces where they help. The shared palette is charcoal `#2C2C2C`, muted berry `#853953`, deep plum `#612D53` and soft neutral `#F3F4F4`. I keep these colours in CSS variables in `src/index.css` so the pages use them consistently.

## Current Limitations

- Login and Sign up are simulated locally; Sign up creates no permanent account or user database. Refreshing resets login state.
- Cart data is stored in the current browser and origin, while orders are only local confirmations. No payment is processed.
- Product loading depends on DummyJSON being available.
- Search, filtering, sorting, pagination, Orders and Profile are outside the current CORE implementation.
- Browser, responsive and accessibility checks, plus deployed-route refresh checks, still need manual verification.

## Credits

DummyJSON supplies the product data. The editorial hero photograph is by [Kaboompics on Pexels](https://www.pexels.com/photo/close-up-shot-of-a-perfume-bottle-on-the-sand-8361545/), used under the [Pexels Licence](https://www.pexels.com/license/); it does not depict a catalogue product. React, TypeScript, Vite, Tailwind CSS and React Router provide the tools used to build the application. I used AI assistance for implementation suggestions, debugging review and documentation support; I am responsible for reviewing the result and understanding the code. A fuller reflection on that assistance belongs in the separate project report.
