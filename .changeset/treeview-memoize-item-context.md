---
'@primer/react': patch
---

`TreeView`: memoize the `ItemContext` value so focusing or blurring a parent item does not re-render its entire expanded subtree.
