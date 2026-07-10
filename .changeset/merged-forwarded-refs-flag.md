---
'@primer/react': patch
---

Put the migration of forwarded refs from `useProvidedRefOrCreate` to `useMergedRefs` behind the `primer_react_merged_forwarded_refs` feature flag (enabled by default), allowing consumers to fall back to the previous behavior if needed. Affects ActionList, AnchoredOverlay, ButtonGroup, Checkbox, Dialog, FilteredActionList, PageHeader, TextInput, Tooltip, and the experimental Tabs.
