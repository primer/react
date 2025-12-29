---
'@primer/react': patch
---

perf(Dialog): Add feature flag for CSS :has() selector performance optimization

- Add `primer_react_css_has_selector_perf` feature flag (default: false)
- When flag is OFF: uses legacy `body:has(.Dialog.DisableScroll)` selector
- When flag is ON: uses optimized direct `body[data-dialog-scroll-disabled]` data attribute with ref counting
- Enables gradual rollout and easy rollback of performance optimization
