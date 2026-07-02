---
'@primer/react': patch
---

Fix invalid HTML nesting in `ActionList.Heading` by applying the visually-hidden styles directly to the heading element instead of wrapping it in a `span`.
