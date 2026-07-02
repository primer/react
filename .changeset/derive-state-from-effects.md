---
'@primer/react': patch
---

Derive state during render instead of in effects for `useMedia`, `ToggleSwitch`, `SelectPanel`, and the internal validation animation container, removing redundant render passes. Note: `useMedia` now returns the live `matchMedia` value on the first client render; `defaultState` is only used for the SSR/hydration snapshot (no public API changes).
