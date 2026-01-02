---
'@primer/react': patch
---

perf(FilteredActionList): Use useDeferredValue to prevent input lag with large lists

FilteredActionList now uses React's useDeferredValue hook to defer expensive list rendering operations while keeping the text input immediately responsive. This prevents input lag when filtering large lists in SelectPanel.
