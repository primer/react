---
'@primer/react': patch
---

SegmentedControl: improve rendering performance by removing an expensive `:has()` selector used for the inter-item divider. No visual or API changes.
