---
"@primer/components": patch
---

Allow custom `children` in `ActionItem`.  `text` and `description` can still be provided as a shortcut, but `children` is now available if you need more control over the rending of the item, without sacrificing benefits from `Item` by using `renderItem`.
