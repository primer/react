---
'@primer/react': patch
---

Defer `useAnchoredPosition` initial mount setState from useLayoutEffect to useEffect when overlay is closed, eliminating unnecessary cascading re-renders that block paint.
