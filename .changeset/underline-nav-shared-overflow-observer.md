---
"@primer/react": patch
---

Internal: `UnderlineNav` and `ActionBar` overflow detection now uses a shared root-scoped `IntersectionObserver` per component, and the registry coalesces same-frame rebuilds. This reduces observer churn during resize with no public API changes.
