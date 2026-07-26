# Alignment

## From: `@primer/react`

Legacy PageLayout provides responsive slots, sticky and resizable panes, and application examples containing filters, action menus, and bottom sheets.

## To: `@primer/react-tailwind`

PageLayout keeps `Header`, `Content`, `Pane`, `Sidebar`, and `Footer` slots plus container, padding, gap, width, sticky, divider, hidden, responsive pane position, and resize configuration. `Sidebar` is extracted into a root-level region while the other regions remain in the content wrapper, matching the legacy responsive structure. Pane dividers are horizontal at narrow widths and vertical from the regular range. Sticky positioning and resize widths activate from the regular range; resize uses the local `widthStorageKey`, `currentWidth`, and `onResizeEnd` contract. It does not use Base UI.

## Migration notes

- Keep bottom sheets and filter/menu controls in application composition.
- Use the documented width storage and resize callback contract; do not assume legacy persistence behavior.
- Preserve start/end pane and Sidebar ordering across responsive ranges.
- Compose slots in the intended visual order. PageLayout identifies Sidebar as a root-level region without exposing Primer's internal slot marker system.
- `sx` and styled-system props are unsupported; use `className`.
