---
'@primer/react': patch
---

UnderlineNav, ActionBar: Detect item overflow with a single shared IntersectionObserver per component instead of one observer per item, reducing observer churn during resize. No public API changes.
