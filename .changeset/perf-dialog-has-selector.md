---
'@primer/react': patch
---

perf(Dialog): Add feature flag for CSS :has() selector performance optimization

- Add `primer_react_css_has_selector_perf` feature flag (default: false)
- When flag is OFF: uses legacy `body:has(.Dialog.DisableScroll)` selector
- When flag is ON: uses optimized direct `body.DialogScrollDisabled` class with ref counting
- Scope footer `:has(.Footer)` to direct child with `>` combinator for O(1) lookup
- Enables gradual rollout and easy rollback of performance optimization
