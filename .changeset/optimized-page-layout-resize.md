---
"@primer/react": patch
---

PageLayout: Optimize drag/resize performance with inline styles and new optimizations

**Refactored:**
- Apply CSS containment via inline styles instead of `[data-dragging]` attribute selectors (O(1) vs O(n) selector matching)
- Extract optimization utilities to `paneUtils.ts`
- Use CSS variable for drag handle visual feedback

**Added:**
- `content-visibility: auto` during drag/resize to skip off-screen content rendering

- rAF throttle for drag updates (one update per frame, latest position wins)
- Containment during window resize (parity with drag)

**Removed:**
- `[data-dragging]` attribute and associated CSS descendant selectors

These changes improve style recalculation performance on large DOMs (100k+ nodes) by eliminating descendant selector traversal.
