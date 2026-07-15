---
'@primer/react': patch
---

Add `contain: layout` to high-churn overflow containers (`ActionBar`, `UnderlineNav`, `UnderlinePanels`, and `LabelGroup`) so their frequent reflows no longer invalidate ancestor layout.
