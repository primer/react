---
'@primer/react-tailwind': major
---

SelectPanel: Infer the item type and selection mode from `items` and `selected`, so `onSelectedChange` receives one item or `undefined` for single selection and an array for multiple selection. `selectionVariant` must now match the shape of `selected`; pass `[]` for an empty multiple selection.
