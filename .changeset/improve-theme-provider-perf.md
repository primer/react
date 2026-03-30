---
"@primer/react": patch
"@primer/styled-react": patch
---

perf(ThemeProvider): Reduce unnecessary renders and effect cascades

- Replace `useState` + `useEffect` SSR hydration handoff with `useSyncExternalStore` — eliminates post-hydration re-render
- Replace `useState` + `useEffect` in `useSystemColorMode` with `useSyncExternalStore` — eliminates effect gap and stale-then-update flicker
- Cache `getServerHandoff` DOM read + JSON.parse per ID (runs once, not on every call)
- Memoize context value object to prevent unnecessary re-renders of all consumers
