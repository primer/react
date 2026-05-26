---
'@primer/react': patch
---

Dev-only effects (the `if (__DEV__) { useEffect(...) }` pattern with an
`eslint-disable react-hooks/rules-of-hooks` comment at every call site) are
now expressed via a new internal `useDevOnlyEffect` hook. The lint
suppression lives in the wrapper, the effect is dropped from production by
the consumer's `process.env.NODE_ENV` replacement, and call sites get
`react-hooks/exhaustive-deps` lint via `additionalEffectHooks`. No public
API changes.
