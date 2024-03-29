---
'@primer/react': patch
---

Button and IconButton only use aria-labelledby to preserve the button label in a loading state OR if aria-labelledBy was explicitly passed.

<!-- Changed components: Button, IconButton -->
