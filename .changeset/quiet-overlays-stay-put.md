---
'@primer/react': patch
---

useAnchoredPosition: Skip re-renders when the overlay position is unchanged, and reposition when `side` or `align` changes while open. This reduces re-renders in ActionMenu, SelectPanel, Autocomplete and AnchoredOverlay.
