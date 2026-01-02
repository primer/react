---
"@primer/react": patch
---

PageLayout: Optimize drag/resize performance with inline styles and new optimizations

**Refactored:**
- Use direct attribute selectors (`.Pane[data-dragging='true']`) instead of descendant selectors for CSS containment (O(1) vs O(n) selector matching)
- Extract optimization utilities to `paneUtils.ts`
- Apply drag handle visual feedback via inline styles and CSS variables

**Added:**
- `content-visibility: auto` during drag/resize to skip off-screen content rendering
- rAF throttle for drag updates (one update per frame, latest position wins)
- Containment during window resize (parity with drag)

These changes improve style recalculation performance on large DOMs (100k+ nodes) by eliminating descendant selector traversal.
