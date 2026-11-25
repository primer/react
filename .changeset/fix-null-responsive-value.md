---
'@primer/react': patch
---

Fix `useResponsiveValue` throwing when passed `null` as a non-responsive value. The hook now returns `null` unchanged, just like other non-responsive values.
