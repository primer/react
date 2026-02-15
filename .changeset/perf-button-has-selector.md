---
'@primer/react': patch
---

perf(Button): Replace :has(.Visual) with data-no-visuals attribute

Replace `:has(.Visual)` selectors with `[data-no-visuals]` attribute checks to avoid descendant DOM scans.
Added documentation comments explaining acceptable :has() usage patterns.
