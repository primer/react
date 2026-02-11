---
"@primer/react": patch
---

Fix hydration errors in resizable `PageLayout.Pane` by rounding width values to integers. Floating-point values from `getBoundingClientRect()` could cause mismatches between server and client renders in `aria-valuenow`, `aria-valuemax`, and `aria-valuetext` attributes.
