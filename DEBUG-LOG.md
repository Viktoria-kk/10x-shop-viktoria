# Debugging log — 10X Shop CORE

These cases are traced through Git history, the CORE test checklist, and recorded command output. They show project debugging, but do not prove that I personally found each problem or tested it in a browser. The standalone PRD and Appendix A were not available in the repository; `PLAN.md` and the supplied Commit 28 requirements describe the CORE debugging goal.

A practical workflow for me is to make the problem specific, find the state or branch that controls it, change as little as possible, then rerun the relevant check. Git diffs show what changed; TypeScript and ESLint can catch code problems before a browser run. The browser and screen-reader checks below still need my own verification. `docs/CORE_TEST_CHECKLIST.md` records mocked harness results, while `COMPATIBILITY.md` marks browser scenarios **NOT TESTED**.

## Case 1 — Product quantity could exceed remaining stock

**Problem and reproduction.** The recorded CORE audit found that Product Details used total stock to limit its `+` control, even after units were in the cart. For a product with stock 5, adding 4 left only 1 available, but the old selector could still show 4 or increase to 5. The Add to cart handler then rejected that selection. This sequence is supported by the old code and the focused harness reported in `docs/CORE_TEST_CHECKLIST.md`; it has not been repeated in the live browser.

**Investigation and observation.** The checklist records a temporary Node component harness as the tool actually used. Comparing `ProductPage.tsx` before and after the fix shows that the old `+` handler and disabled condition compared `quantity` with `product.stock`, while the Add to cart guard compared it with `remainingStock`. Those rules disagreed.

**Root cause and fix.** `remainingStock` is `product.stock - cartQuantity`. The selector was using a different limit from the Add to cart guard. The fix bounded the selector by `remainingStock`, adjusted the selected quantity after an add, and displayed “Unavailable” when nothing remained. The checklist reports that the focused harness passed after the fix.

**Commit:** [`825cee5`](https://github.com/Viktoria-kk/10x-shop-viktoria/commit/825cee54f8b97cdd591539c11fe04c16fcaa1da9). **Lesson:** controls and validation must use the same source of truth. A button can look usable while a later guard rejects its value.

## Case 2 — Product loading and error views had no page heading

**Problem and reproduction.** Before the accessibility fix, Product Details returned only a status paragraph while loading and only an alert paragraph on request failure. Its normal product heading was farther down, after those early returns. `git show 57f3309^:src/pages/ProductPage.tsx` reproduces the source-level finding. A slow or failed product request would expose these branches, but no browser or screen-reader result was recorded.

**Investigation and observation.** Comparing the parent revision with the fix using `git show` confirms that the two early return branches lacked an `<h1>`; the successful view had a product-title `<h1>`. This is a confirmed markup inconsistency, not a claim that a screen reader was personally tested.

**Root cause and fix.** Each early return replaced the whole page body with a paragraph. The fix wrapped each branch in a section and added a “Product details” heading before its existing status or alert. The API handling itself stayed the same.

**Commit:** [`57f3309`](https://github.com/Viktoria-kk/10x-shop-viktoria/commit/57f33098940c1e3db5d5dadd784f96457a12a341). **Lesson:** loading and failure branches are full page states. They need the same basic structure as the success branch, even when the product data has not arrived.

## Case 3 — Unused Error Boundary parameter blocked lint

**Problem and reproduction.** During Commit 27, a working draft declared `getDerivedStateFromError(_error: Error)` but did not use `_error`. `npm run lint` failed with `@typescript-eslint/no-unused-vars` at `src/components/ErrorBoundary.tsx:14`. This failure and the later passing lint run are preserved in the Commit 27 work-session command output. The intermediate draft was corrected before the commit, so Git alone cannot reproduce that exact failure from the final revision.

**Investigation and observation.** ESLint was the tool actually used. Typecheck and build had passed, but lint reported one unused parameter. Inspecting the method showed that it only needed to return `{ hasError: true }`; `componentDidCatch` separately receives the typed error and `ErrorInfo` for logging.

**Root cause and fix.** Prefixing the unused argument with `_` did not satisfy this project's ESLint rule. The unused parameter was removed, and typecheck, lint, and build all passed afterward. React can still call the static method with an error argument; JavaScript permits a function to ignore extra arguments.

**Commit:** [`4a9aa2d`](https://github.com/Viktoria-kk/10x-shop-viktoria/commit/4a9aa2d93d81ae66dfe0f9b7f976f633e9c859c0) contains the corrected code, not the failing draft. **Lesson:** passing TypeScript does not imply passing ESLint. A small lifecycle method should accept only what its implementation needs.

## Evidence limits and hands-on verification notes

These are three real cases: one harness-confirmed behaviour bug, one source-confirmed page-structure issue, and one recorded ESLint failure. The first two fixes are visible against their Git parent revisions. The third has command-output evidence from the project work session, but its failing draft is not in Git. If the CORE minimum is interpreted as three bugs independently verifiable from Git history alone, that stronger requirement is still incomplete. I still need to confirm my own hands-on involvement and repeat the browser-facing cases before describing them as personally tested. None of these entries is evidence of Chrome, Firefox, or screen-reader compatibility.

In the already-running preview, I can:

1. Add most of a low-stock product to the cart, return to Product Details, and confirm the selector cannot exceed the remaining stock. Compare the Header badge and cart quantity.
2. Throttle or block the product request in the Network panel, then check that the loading or error view still has a “Product details” heading. Record what actually happens without changing the source to manufacture a failure.
3. Inspect `shop_cart` in browser storage, refresh, and check that valid items return. Visit an invalid product ID, and try Checkout as a guest to check the Login return path. These are checks, not additional bugs.

If a real new problem appears, record the exact actions, observed result, tool output, cause, and fix commit before adding another case. I should not mark a browser test PASS merely because the code or a mocked harness looks correct.
