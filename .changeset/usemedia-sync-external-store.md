---
'@primer/react': patch
---

`useMedia` now reads the live `matchMedia` value on the first client render instead of after an effect, removing a redundant render pass. `defaultState` is only used for the SSR/hydration snapshot (no public API changes).
