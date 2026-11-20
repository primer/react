---
'@primer/react': patch
---

`useMedia`: share one `MediaQueryList` and one `change` listener per distinct media query instead of allocating a new list and listener for every hook instance.
