---
"@primer/react": patch
---

Internal: `UnderlineNav` and `ActionBar` overflow detection now shares a single `IntersectionObserver` per component (owned by the descendant registry) instead of creating one observer per item, and the registry coalesces rebuilds so multiple items crossing the overflow boundary in the same frame trigger a single rebuild. This reduces re-render churn and observer allocations during resize. No public API changes.
