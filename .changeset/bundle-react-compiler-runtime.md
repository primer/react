---
'@primer/react': patch
---

Bundle the React Compiler memo helper (`c`) into `@primer/react` instead of importing it from an external `react-compiler-runtime` module. This prevents a runtime crash (`TypeError: (0, t.c) is not a function`) that could occur when a consumer's bundle resolved a skewed or stale `react-compiler-runtime` across independently-cached chunks.
