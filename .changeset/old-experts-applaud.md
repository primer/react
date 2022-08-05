---
'@primer/react': patch
---

- Fixes `role` and keyboard behavior for SegmentedControl.
- Fixes a bug where icon-only SegmentedControl buttons did not fill the parent width when the `fullWidth` prop was set
- Fixes a bug where click handlers were not passed correctly when the responsive variant was set to `'hideLabels'`
