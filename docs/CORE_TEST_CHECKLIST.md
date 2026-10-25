# CORE shopping flow test checklist

## Testing environment

- Date: 25 October 2026 (Georgia time).
- Workspace: Windows, Node.js 22.16.0, npm 10.9.2.
- References inspected: the current source, `PLAN.md`, the initial CORE requirements, and the Commit 24 brief. A standalone PRD and Appendix A were not available in the project files or supplied attachments.
- The development server, browser, and live DummyJSON API were not opened for this audit. The shopper journey still needs manual browser verification.

**Status key:** PASS = executed and observed; FAIL = executed and failed; NOT TESTED = no runtime or visual result observed. Source inspection alone is recorded as NOT TESTED.

## Confirmed bug and fix

Product Details previously bounded its quantity increase by total product stock, even when some units were already in the cart. That allowed selecting more than the remaining stock; Add to cart then rejected the selection. The selector now uses remaining stock, adjusts the selected quantity after a successful add, and shows “Unavailable” when the cart holds all units. The focused Product Details harness passed after this correction.

## Catalogue

| Test | Expected result | Status | Notes |
| --- | --- | --- | --- |
| API success and HTTP errors | `fetchProducts` requests `products?limit=12&skip=0`, returns data on success, and throws on failed HTTP responses. | PASS | Executed the API module with mocked fetch responses in a temporary Node harness. No live request. |
| Catalogue display | Twelve live products appear with images, discounts, and links to matching IDs. | NOT TESTED | Source path reviewed; verify against live DummyJSON in the browser. Check request count in the development Network panel because StrictMode may replay the mount effect. |
| Loading, error, and empty states | Each state displays its existing message. | NOT TESTED | Conditional branches inspected, but not rendered in a browser. |
| Card Add to cart | Adds the selected product without following the product link; out-of-stock action stays disabled. | NOT TESTED | Separate button and disabled condition inspected; interaction remains manual. |

## Product Details

| Test | Expected result | Status | Notes |
| --- | --- | --- | --- |
| Detail API responses | Valid IDs request `/products/:id`; 404 returns no product; other HTTP errors throw. | PASS | Executed `fetchProductById` with mocked responses. |
| Detail route states | Invalid IDs and 404s show Not Found; failed requests show an error; stale responses cannot replace a new product. | NOT TESTED | ID guard, keyed component, and effect cleanup inspected; browser navigation remains manual. |
| Remaining-stock quantity | After adding units, selection cannot exceed the stock still available outside the cart. | PASS | Temporary Node component harness exercised Add to cart, the resulting selector value, disabled controls, and exhausted stock after the fix. |
| Images and product changes | Thumbnail selection works; images and selected quantity reset when navigating to a different product. | NOT TESTED | Keyed detail component and image state inspected; verify visually and interactively. |

## Cart operations

| Test | Expected result | Status | Notes |
| --- | --- | --- | --- |
| Add and repeat add | Same product remains one line, quantities increase, and stock limits reject excess units. | PASS | Executed CartProvider operations with two mock products in a temporary Node harness. |
| Totals and removal | Item count sums units; discounted subtotal and total update; removing one line preserves another. | PASS | Observed counts, totals, and remaining line in the CartProvider harness. |
| Cart page controls | Quantity buttons, Remove, clear confirmation/cancel, and empty state behave correctly. | NOT TESTED | Source inspected; native confirmation and rendered controls need browser testing. |

## Cart persistence

| Test | Expected result | Status | Notes |
| --- | --- | --- | --- |
| Save, restore, and clear | `shop_cart` follows React cart updates; restored quantities survive provider recreation; clearing saves empty items. | PASS | Executed CartProvider with mocked localStorage and a simulated provider recreation. |
| Invalid saved data | Missing data, malformed JSON, invalid quantities, duplicate IDs, and blocked storage reads do not crash restoration. | PASS | Executed `readSavedCart` against each case in a temporary Node harness. |
| Browser refresh | Actual refresh restores items, while refresh after Checkout does not restore cleared items. | NOT TESTED | Requires the user's live preview. |

## Authentication

| Test | Expected result | Status | Notes |
| --- | --- | --- | --- |
| Login validation | Blank or whitespace username and short password show the exact existing errors without login. | PASS | Executed LoginPage submission handlers in a temporary Node harness. |
| Protected checkout return | Guests redirect to Login; valid login returns to Checkout; unexpected destinations fall back to Catalogue. | PASS | Executed ProtectedRoute and LoginPage with mocked navigation and auth state. |
| Header and logout | Guest sees Log in, user sees Log out, and logout leaves cart contents intact. | NOT TESTED | Context separation and Header source inspected; verify in browser. |

## Checkout

| Test | Expected result | Status | Notes |
| --- | --- | --- | --- |
| Invalid submission | Required field errors appear; values and cart remain unchanged. | PASS | Executed CheckoutPage validation and submit handler in a temporary Node harness. |
| Valid submission | Confirmation captures the name, item count, and total before clearing; it remains visible after clear. | PASS | Observed CheckoutPage state and confirmation render in the harness. |
| Complete browser flow | Cart and Checkout totals agree; Login return, form editing, Place order, badge reset, and Continue shopping work. | NOT TESTED | Needs end-to-end interaction in the live preview. |

## Navigation

| Test | Expected result | Status | Notes |
| --- | --- | --- | --- |
| Required routes | Catalogue, Login, Product Details, Cart, protected Checkout, and Not Found open correctly. | NOT TESTED | Route declarations inspected; actual navigation not run. |
| Refresh and history | Direct product/checkout URLs, refreshes, back, and forward navigation preserve the intended state. | NOT TESTED | Requires browser and eventual deployed-host route checks. |

## Responsive design

| Test | Expected result | Status | Notes |
| --- | --- | --- | --- |
| 375px, 768px, 1024px, 1440px | Pages remain usable, images scale, controls fit, and no horizontal overflow appears. | NOT TESTED | Tailwind classes inspected; no viewport rendering was performed. |

## Accessibility

| Test | Expected result | Status | Notes |
| --- | --- | --- | --- |
| Keyboard journey | Links, buttons, thumbnails, forms, and confirmation work with keyboard and visible focus. | NOT TESTED | Native controls and focus classes inspected; no keyboard session run. |
| Screen reader feedback | Labels, errors, image descriptions, quantity changes, and status messages are announced clearly. | NOT TESTED | ARIA associations inspected; screen reader testing remains outstanding. |

## Build verification

| Test | Expected result | Status | Notes |
| --- | --- | --- | --- |
| `npm run typecheck` | TypeScript strict check exits successfully. | PASS | Exit code 0 on 25 October 2026. |
| `npm run lint` | ESLint exits successfully. | PASS | Exit code 0 on 25 October 2026. |
| `npm run build` | TypeScript and Vite production build succeed. | PASS | Exit code 0; Vite transformed 43 modules. |

## Commands executed and limitations

Ran `npm run typecheck`, `npm run lint`, and `npm run build`. Also ran temporary, in-memory Node harnesses for the API functions, Product Details stock controls, CartProvider operations and storage safety, Login/ProtectedRoute, and Checkout. These harnesses used mocked dependencies and storage; they did not exercise a real browser, network, or screen reader. The project has no existing `test` script. No test in this checklist failed; unexecuted browser checks remain **NOT TESTED**.

## Outstanding manual tests

1. In the live preview, load Catalogue and a product; switch thumbnails, add units from the card and details page, and check the Header badge.
2. On the Cart page, adjust quantities, remove one product, cancel and then confirm Clear cart, and compare line, subtotal, and total amounts.
3. Refresh with cart items; open Checkout as a guest, log in, submit invalid then valid shipping details, and confirm the completed total and empty cart after another refresh.
4. Check direct URLs, back/forward navigation, keyboard tab order, focus, screen reader messages, and widths of 375px, 768px, 1024px, and 1440px.
