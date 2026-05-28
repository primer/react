---
'@primer/react': minor
---

Slot system consistency improvements:

- Remove orphan `__SLOT__` markers from root components that no parent scans for: `ActionMenu` (root `Menu`), `UnderlinePanels` (root), `Autocomplete` is unchanged (still used as a `FormControl` child), `PageLayout` (root), `SegmentedControl` (root), `RadioGroup` (root), `CheckboxGroup` (root), and `Dialog` (root). Sub-component markers are intentionally retained so consumers can keep wrapping them.
- Standardize `Symbol(...)` descriptions used as slot markers to the `Parent.Slot` convention: `CheckboxOrRadioGroupLabel` → `CheckboxOrRadioGroup.Label`, `CheckboxOrRadioGroupCaption` → `CheckboxOrRadioGroup.Caption`, `CheckboxOrRadioGroupValidation` → `CheckboxOrRadioGroup.Validation`, `DEPRECATED_Tooltip` → `Tooltip`, and `Table` → `DataTable.Table`.
- Migrate `PageHeader`, `NavList.Item`, and the internal `CheckboxOrRadioGroup` to use the `useSlots` hook instead of hand-rolling `React.Children` traversal with `isSlot`. The `CheckboxOrRadioGroup` migration also removes duplicated work where `useSlots` was already called but slots were re-extracted by hand immediately after.
- Export `useSlots`, `isSlot`, `asSlot`, and the `WithSlotMarker`/`FCWithSlotMarker` types publicly from `@primer/react` so downstream consumers can build their own slot-aware compound components.
- Add `asSlot(component, slotSource)` helper: a typed utility that copies a `__SLOT__` marker from a source slot component onto a wrapper component, replacing the cast-heavy `(Wrapper as typeof Wrapper & {__SLOT__?: symbol}).__SLOT__ = Source.__SLOT__` pattern.
- Add a dev-mode warning in `useSlots` when a child's `displayName` matches a slot component's `displayName` but the child is missing the `__SLOT__` marker — a common footgun when wrapping slot components.
