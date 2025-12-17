---
"@primer/react": patch
---

PageLayout: Refactor drag/resize optimizations to use inline styles instead of data attributes

- Replace `[data-dragging]` attribute and CSS selectors with inline style application
- Extract containment utilities to `paneUtils.ts` for reuse between drag and window resize
- Simplify rAF throttle to basic coalescing pattern
- Use CSS variable `--draggable-handle--drag-opacity` for handle visual feedback
- Add `will-change: width` hint during drag
- Apply containment during window resize (parity with drag behavior)

This refactor improves maintainability and eliminates attribute selector matching during style recalculation.
