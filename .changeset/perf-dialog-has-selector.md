---
'@primer/react': patch
---

perf(Dialog): Replace body:has() with direct class and scope footer selector

- Replace `body:has(.Dialog.DisableScroll)` with direct `body.DialogScrollDisabled` class
- Scope `:has(.Footer)` to direct child with `>` combinator for O(1) lookup
