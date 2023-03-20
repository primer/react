---
"@primer/react": minor
---

Adds `tabIndex` and `role="region"` to `PageLayout.Pane` when overflow is detected (scrollHeight > clientHeight). Also requires either `aria-labelledby` or `aria-label` when overflow is detected, and throws an error if neither is defined.
