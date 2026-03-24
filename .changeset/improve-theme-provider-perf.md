---
"@primer/react": patch
"@primer/styled-react": patch
---

perf(ThemeProvider): Reduce unnecessary renders and effect cascades

- Replace per-render DOM read + JSON.parse for SSR handoff with a lazy `useState` initializer (runs once)
- Replace complex SSR hydration effect (`setTimeout` → `flushSync` → two cascading `setColorMode` calls) with a single `setServerColorMode(undefined)` on mount
- Memoize context value object to prevent unnecessary re-renders of all consumers
- Guard `setSystemColorMode` in `useSystemColorMode` to avoid redundant state update on mount
