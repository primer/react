---
'@primer/react': patch
---

Fix `useDetails` treating clicks inside nested details elements as outside clicks. Interacting with nested content no longer closes the outer details element or calls its outside-click handler.
