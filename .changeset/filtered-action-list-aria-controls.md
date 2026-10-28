---
'@primer/react': patch
---

FilteredActionList: Only reference the list from the filter input while the list is rendered, so `aria-controls` never points at a missing element during body loading or when a message is shown
