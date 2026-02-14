---
'@primer/react': patch
---

Improve UnderlineNav overflow performance by replacing synchronous DOM measurements with CSS `overflow: hidden` + `IntersectionObserver`
