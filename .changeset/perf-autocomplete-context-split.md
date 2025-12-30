---
'@primer/react': patch
---

perf(Autocomplete): Split context to reduce unnecessary re-renders

Split AutocompleteContext into separate contexts for static values, setters, and dynamic state.
Components now subscribe only to the context slices they need, reducing re-renders.
