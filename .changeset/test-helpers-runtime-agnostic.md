---
'@primer/react': patch
---

Make the published `@primer/react/test-helpers` entry runtime-agnostic so it works with both Jest and Vitest consumers.

Previously the file hard-referenced the `jest` global to create mock functions for its JSDOM polyfills (`ResizeObserver`, `HTMLDialogElement.showModal/close`, `HTMLCanvasElement.getContext`, `Element.scrollIntoView`, `matchMedia`, `CSS.escape/supports`). Importing the helper from a Vitest test threw `ReferenceError: jest is not defined`.

The polyfills now detect `globalThis.jest?.fn` or `globalThis.vi?.fn` at runtime and fall back to a plain no-op function if neither is present. Mock-style introspection (`toHaveBeenCalled` etc.) still works for both Jest and Vitest consumers; consumers without a test runtime get a silent no-op which is sufficient for the polyfill use case.

Also removes a stale `// jest function` comment from `SelectPanel.test.tsx` (the test actually uses `vi.fn()`).