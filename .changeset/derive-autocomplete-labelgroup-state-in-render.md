---
'@primer/react': patch
---

Derive `AutocompleteMenu` close-time re-sorting and `LabelGroup` numeric truncation during render instead of in effects, removing redundant render passes. No public API or visual changes.
