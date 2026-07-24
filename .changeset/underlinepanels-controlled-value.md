---
"@primer/react": minor
---

UnderlinePanels: add controlled `value`/`defaultValue`/`onChange` and `activationMode` props, plus per-`Tab`/`Panel` `value`, so data-driven tabs can use the selected value as a single source of truth. `onChange` fires for every selection method (pointer, Enter/Space, and arrow keys), and `activationMode="manual"` moves focus without selecting until Enter/Space/click. The existing `aria-selected`/`onSelect` API is unchanged. The underlying experimental `Tabs` primitive (and `useTab`) also gains the `activationMode` option.
