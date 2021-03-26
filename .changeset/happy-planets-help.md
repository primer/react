---
'@primer/components': patch
---

Fix type definitions as it was declaring its own node_modules as a module, which is unnecessary, and some IDEs can't interpret it.
