---
'@primer/react': patch
---

Fix TreeView PageUp and PageDown navigation targeting items hidden inside collapsed subtrees. Paging now counts only visible tree items and moves at least one item when the scroll container is shorter than a row.
