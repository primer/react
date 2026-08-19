---
'@primer/react': patch
---

Bundle the React Compiler runtime (`react-compiler-runtime`) into the published output instead of importing it as an external dependency, so compiled components no longer crash in environments where the consumer cannot resolve a callable runtime.
