---
'@primer/react': minor
---

`PageLayout.Sidebar` (and `SplitPageLayout.Sidebar`): add controlled-width support via `currentWidth` + `onResizeEnd`, matching the discriminated-union API already on `PageLayout.Pane`. The underlying `usePaneWidth` hook already supported these options; this wires them through the component's prop surface. Existing usage is unchanged — the props are opt-in and the uncontrolled (default or `widthStorageKey`-backed) behavior is preserved exactly.
