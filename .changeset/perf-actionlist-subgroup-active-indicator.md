---
'@primer/react': patch
---

ActionList: improve rendering performance by replacing an expensive `:has()` selector for the collapsed-parent active indicator with a plain attribute selector. No visual or API changes.
