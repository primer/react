---
"@primer/react": patch
---

AnchoredOverlay accessibility fixes
- `aria-expanded` attribute is removed from anchor when overlay is not open
- `tabIndex=0` is removed from anchor because it should only be used with interactive elements

