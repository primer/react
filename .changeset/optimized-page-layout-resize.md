---
"@primer/react": patch
---

PageLayout: Optimize drag resize and window resize performance for large DOMs

- Add CSS containment (`contain`, `content-visibility`, `pointer-events`) during drag and window resize to limit style recalculation to subtrees
- Use simple rAF throttle for drag updates (one update per frame, latest position wins)
- Add `will-change: width` hint during drag for compositor optimization
- Use debounce-only strategy for window resize with immediate containment
- Extract drag/resize optimization utilities to `paneUtils.ts`
- Wrap all PageLayout subcomponents with `React.memo()`
- Use `startTransition()` for non-urgent state updates
- Replace `[data-dragging]` attribute with inline styles and CSS variables

These changes reduce style recalculation time from ~200ms to ~10-20ms on DOMs with 100k+ nodes.
