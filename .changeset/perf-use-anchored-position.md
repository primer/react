---
'@primer/react': patch
---

perf(hooks): Optimize useAnchoredPosition to avoid duplicate observers and throttle updates

- Use window resize listener instead of ResizeObserver on documentElement
- Add ResizeObserver for floating element with first-immediate throttling
- Use updatePositionRef to avoid callback identity changes
- Deduplicate observer setup to avoid redundant work
