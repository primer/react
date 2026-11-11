---
'@primer/react': patch
---

Reduce Tooltip mount and unmount overhead by registering Escape handlers only while tooltips are open, avoiding production-only accessibility scans, and tracking Escape handler registrations in constant time.
