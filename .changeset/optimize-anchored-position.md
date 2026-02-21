---
"@primer/react": patch
---

Optimized `useAnchoredPosition` hook for improved rendering performance:

- **Reduced layout thrashing**: Batches DOM reads before writes and uses `requestAnimationFrame` to coalesce multiple update triggers
- **Optimized re-renders**: Stores mutable state in refs and only triggers re-renders when position actually changes  
- **ResizeObserver support**: Observes both floating and anchor elements for size changes with fallback to window resize events
- **Better late-mounting handling**: Properly detects when conditionally-rendered elements mount

The `dependencies` parameter is now deprecated and ignored - position updates are handled automatically via ResizeObserver and window resize events. The parameter is still accepted for backwards compatibility.
