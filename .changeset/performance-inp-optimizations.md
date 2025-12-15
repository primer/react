---
"@primer/react": patch
---

Performance: Optimize CSS `:has()` selectors and JavaScript hooks for improved INP

- Scope CSS `:has()` selectors to direct children across Dialog, PageHeader, ActionList, Banner, ButtonGroup, AvatarStack, Breadcrumbs, SegmentedControl, TreeView, and SelectPanel
- Add requestAnimationFrame throttling to `useResizeObserver` (first callback immediate, subsequent throttled)
- Add anchor element ResizeObserver to `useAnchoredPosition` for repositioning on anchor resize
- Add `useTreeItemCache` hook for caching TreeView DOM queries with MutationObserver invalidation
- Throttle MutationObserver callbacks in AvatarStack and Announce components
- Add rAF throttling to `useOverflow` hook
- Optimize `hasInteractiveNodes` utility with querySelectorAll and attribute-first checks
- Split Autocomplete context to prevent Overlay re-renders during typing
