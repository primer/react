---
'@primer/react': patch
---

Improve style-recalc performance in Safari by removing expensive `:has()` selectors from ActionList/NavList, Breadcrumbs, SelectPanel, and SegmentedControl, replacing them with cheaper equivalents (data attributes, sibling selectors, or removing dead/no-op rules).
