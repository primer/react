---
"@primer/react": patch
---

Performance: Optimize CSS `:has()` selectors and JavaScript hooks for improved INP

- Scope CSS `:has()` selectors to direct children across Dialog, PageHeader, ActionList, Banner, ButtonGroup, AvatarStack, Breadcrumbs, SegmentedControl, TreeView, and SelectPanel
- Simplify `useResizeObserver` API with automatic requestAnimationFrame throttling and native resize events for window
- Optimize `useAnchoredPosition` to use refs instead of state for non-rendering values
- Add `useTreeItemCache` hook for caching TreeView DOM queries with MutationObserver invalidation
- Throttle MutationObserver callbacks in AvatarStack and Announce components
- Add rAF throttling to `useOverflow` hook
- Optimize `hasInteractiveNodes` utility with querySelectorAll and attribute-first checks
