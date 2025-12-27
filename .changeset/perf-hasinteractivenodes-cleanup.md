---
'@primer/react': patch
---

perf(hasInteractiveNodes): Optimize with combined selector and early attribute checks

- Use combined querySelectorAll selector instead of recursive traversal
- Check attribute-based states (disabled, hidden, inert) before getComputedStyle
- Only call getComputedStyle when CSS-based visibility check is needed
