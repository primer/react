---
'@primer/react': patch
---

Button: Replace the icon-only-with-counter `:has(...):not(:has(...))` selector with a `data-icon-only-counter` attribute computed from props. Reduces style-recalculation cost on pages that render many Buttons. No visual or behavioral changes.
