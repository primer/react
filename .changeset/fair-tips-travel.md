---
"@primer/react": minor
---

* Updated the `position` prop in `PageLayout.Pane` to use the new responsive prop API introduced in https://github.com/primer/react/pull/2174.
* Deprecated the `positionWhenNarrow` prop in favor of the new responsive prop API

**Before**

```
position="start"
positionWhenNarrow="end"
```

**After**

```
position={{regular: 'start', narrow: 'end'}}
```
