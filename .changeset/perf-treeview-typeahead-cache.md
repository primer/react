---
'@primer/react': patch
---

perf(TreeView): Cache tree items in typeahead for better INP

- Add useTreeItemCache hook to cache DOM queries for tree items
- Update useRovingTabIndex and useTypeahead to use cached items
- Add documentation for acceptable :has() selector usage
