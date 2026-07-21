---
'@primer/react': patch
---

Autocomplete: the input's blur handler now uses the blur event's `relatedTarget` to decide whether to close the menu, so the menu reliably stays open when focus moves into it and closes when focus leaves.
