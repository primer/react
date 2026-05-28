---
'@primer/react': patch
---

Eliminate nested-update cascades in `useFocus`, `PageLayout.Pane`, and
`AnchoredOverlay`:

- `useFocus` no longer produces a second re-render after focusing; one
  `focus()` call now results in exactly one render instead of two.
- `PageLayout.Pane` (resizable) no longer triggers a forced re-render
  before paint on mount. The CSS variable and ARIA attributes are still
  updated synchronously in the layout effect; the React state sync is
  wrapped in `startTransition` so it runs in the transition lane rather
  than as part of the layout-effect commit.
- `AnchoredOverlay` no longer keeps `useAnchoredPosition`'s scroll
  listeners and `ResizeObserver` attached while it is closed. After an
  open→close cycle, the first scroll/resize event no longer fires a
  spurious `setPosition(undefined)` that re-renders the closed overlay.

Also adds a profiler-based test harness at
`src/utils/testing/profiler.tsx` so future regressions can be pinned with
`counter.updateCount` and `counter.nestedUpdateCount` assertions.
