---
'@primer/react': patch
---

Breadcrumbs: fix "Maximum update depth exceeded" crash with multi-part crumbs (a link plus sibling content) in `menu` / `menu-with-root` overflow modes — a regression from #8748. The fit check now compares each crumb's width measured in the layout it is rendered in. Fixes #8790.
