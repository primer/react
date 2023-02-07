---
"@primer/react": patch
---

Fix `useDynamicTextareaHeight` not taking into account top padding of `textarea`

Also makes the hook accept a `RefObject` instead of an element instance
