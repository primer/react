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
- `will-change: width` hint during drag for compositor optimization
- rAF throttle for drag updates (one update per frame, latest position wins)
- React.memo on Header, Content, Footer, RootWrapper subcomponents
- Containment during window resize (parity with drag)

**Removed:**
- `[data-dragging]` attribute and associated CSS descendant selectors

These changes improve style recalculation performance on large DOMs (100k+ nodes) by eliminating descendant selector traversal.
