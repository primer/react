---
'@primer/react': patch
---

Bundle the React Compiler memo helper (`c`) into `@primer/react` via a local ESM shim instead of importing it from the external `react-compiler-runtime` package. This prevents a runtime crash (`TypeError: (0, l.c) is not a function`) when a consumer's bundle cannot resolve a callable `c`.
