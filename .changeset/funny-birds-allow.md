---
"@primer/components": patch
---

Focus zones will now update active-descendant on `mousemove` over focusable elements.  ActionList has been updated to handle direct (key press) vs inderect (`mousemove`, DOM change, etc.) changes to active-descendant, and will use a slightly darker background color for the directly activated items.
