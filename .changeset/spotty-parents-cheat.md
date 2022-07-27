---
"@primer/react": minor
---

* Updated the `divider` prop in `PageLayout.Header`, `PageLayout.Pane`, and `PageLayout.Footer` to use the new responsive prop API introduced in https://github.com/primer/react/pull/2174.
* Deprecated the `dividerWhenNarrow` prop in favor of the new responsive prop API

**Before**

```
divider="line"
dividerWhenNarrow="filled"
```

**After**

```
divider={{regular: 'line', narrow: 'filled'}}
```
