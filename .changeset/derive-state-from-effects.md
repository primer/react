---
'@primer/react': patch
---

Derive state during render instead of in effects for `useMedia`, `ToggleSwitch`, `SelectPanel`, and the internal validation animation container, removing redundant render passes (no public API changes).
