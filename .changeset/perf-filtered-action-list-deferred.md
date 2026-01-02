---
'@primer/react': patch
---

perf(FilteredActionList): Use useDeferredValue to improve typing responsiveness with large lists

- Add `useDeferredValue` for items to defer expensive list re-rendering
- Keep text input immediately responsive during typing
- Use deferred items for rendering while maintaining immediate items for user interactions
