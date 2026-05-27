---
'@primer/react': patch
---

UnderlinePanels: Eliminate the empty-tablist frame on mount and the cascading
re-render when icons toggle. Tabs and panels are now derived in render
(previously stored in state synced via `useEffect`), the list width is kept
in a ref instead of state, and `iconsVisible` / `loadingCounters` flow to
each tab via context — combined with `React.memo(Tab)`, that makes
resize-driven icon toggles update only the part of each tab that depends on
the change, not the whole tablist subtree. Behavior is unchanged.
