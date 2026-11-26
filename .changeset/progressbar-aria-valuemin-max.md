---
'@primer/react': patch
---

ProgressBar: Respect `aria-valuemin` and `aria-valuemax` instead of always overriding them with `0` and `100`, so progress that isn't a percentage (for example "3 of 12 tasks") is announced correctly.
