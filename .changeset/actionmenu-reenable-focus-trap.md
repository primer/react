---
'@primer/react': patch
---

ActionMenu: Fix keyboard navigation for ActionMenu inside Overlay by re-enabling focus trap. It was disabled in v35.6.0, that led to a regression for ActionMenu within focus zones (example: AnchoredOverlay)
