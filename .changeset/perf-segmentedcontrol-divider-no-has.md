---
'@primer/react': patch
---

SegmentedControl: move the inter-item divider from `::after` of each non-last item to `::before` of each non-first item so the "hide divider next to the selected item" rule can be expressed with the adjacent-sibling combinator instead of `:has(+ [data-selected])`. The 1px line sits at the same visual gap between items; no rendered output change.
