---
'@primer/react': patch
---

perf(ActionList): Optimize CSS `:has()` selectors for better INP

**Performance improvements:**
- Replace `:has([aria-disabled], [disabled])` with `[data-disabled]` attribute on `<li>` - avoids descendant scan
- Replace `:has([data-loading])` with `[data-loading]` on `<li>` - avoids descendant scan  
- Scope TrailingAction loading selector to direct child: `:has(> .TrailingAction[data-loading])`
- Add documentation comments explaining acceptable `:has()` patterns (mixed descriptions, SubGroup active state)

**Why this matters:**
CSS `:has()` selectors that scan descendants can cause expensive style recalculations during user interactions, impacting INP (Interaction to Next Paint). By using data attributes set via JS on the parent `<li>`, we eliminate descendant traversal.

Part of #7312
