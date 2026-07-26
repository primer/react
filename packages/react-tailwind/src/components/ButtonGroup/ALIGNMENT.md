# Alignment

## From: `@primer/react`

Legacy ButtonGroup is a layout wrapper commonly used with tooltips, menus, loading buttons, links, inactive controls, and split-dropdown examples.

## To: `@primer/react-tailwind`

ButtonGroup is a presentational grouping container that preserves grouped controls and toolbar semantics. It does not own overlay, loading, link, or split-dropdown behavior and does not use Base UI. Tooltip and menu behavior stay with their dedicated local primitives, while Button and LinkButton own their own semantics.

## Migration notes

- Compose a local Tooltip or ActionMenu around grouped controls rather than passing overlay behavior to ButtonGroup.
- Build a split dropdown from sibling Button and ActionMenu trigger controls.
- Retain proper toolbar labels when the group is a command toolbar.
- Use `className` for layout adjustments; `sx` and styled-system props are unsupported.
