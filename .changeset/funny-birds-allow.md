---
"@primer/components": patch
---

Focus zones will now update active-descendant on `mousemove` over focusable elements.  ActionList has been updated to handle direct (key press) vs indirect (`mousemove`, DOM change, etc.) changes to active-descendant, and will use a distinct background color for the directly activated items.
