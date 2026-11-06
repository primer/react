# Alignment

## From: `@primer/react`

Legacy DataTable combines table rendering with query loading/error state, pagination, action menus, grid-based column sizing, sorting, and a product-oriented error dialog.

## To: `@primer/react-tailwind`

DataTable preserves native table semantics, nested field paths, columns, caller-owned row identity (`getRowId`), column widths, initial and external sorting, and `onToggleSort`. It ports legacy row selection (`rowSelection`, `selectedRows`, `defaultSelectedRows`, `onSelectionChange`, `isRowSelectable`), config-driven row groups (`DataTableRowGroup` items in `data`), collapsible groups with controllable expansion (`collapsibleGroups`, `expandedGroups`, `defaultExpandedGroups`, `onExpandedGroupsChange`), and bulk actions (`renderBulkActions`, `bulkActionsProps`, `bulkActionsReturnFocusRef`) with the same names and semantics. It exposes composable head, body, row, header, sortable header, selection header, row selection, group, bulk actions, cell, container, title, subtitle, action, skeleton, and pagination parts.

## Migration notes

- **Intentional:** Fetching, error dialogs, and product action menus are not configuration props on the base table. Compose `Table.Skeleton`, `Table.Pagination`, `ActionMenu`, and error UI in the application instead.
- **Intentional:** Legacy `Table.Title` and `Table.Subtitle` accepted arbitrary `as` elements. Tailwind's parts preserve predictable native `h2` and `p` semantics; use `Heading` or consumer-authored labelled content for another structure.
- `Table.Pagination` composes the shared `Pagination` model and controls while preserving DataTable's zero-based page index, visible item range, responsive page visibility, and footer geometry.
- Column sizing uses a single CSS Grid template with nested subgrids on native table groups and rows, so `width`, `minWidth`, and `maxWidth` preserve the legacy distribution without duplicating width styles on cells.
- Use `externalSorting` and `onToggleSort` when sorting is owned by the caller. Use `className` instead of `sx` or styled-system props.
- Selection is a `ReadonlySet` of stable row ids. The effective selection ignores ids for rows that are missing or not selectable while keeping them in the owning set, so callers can retain selection across pages. With `Table.Pagination`, pass only the current page's rows; the select-all checkbox then selects or clears the current page and keeps selections from other pages.
- Group headers render as their own `<tbody>` with a `<th scope="colgroup">` header that labels the member rows. With `rowSelection`, group headers gain a tri-state checkbox that selects the group's selectable rows; with `collapsibleGroups`, they gain a disclosure button that reports `aria-expanded` and controls the member body through `aria-controls`. `Table.Group` is exported for hand-composed tables.
- While any row is selected, `renderBulkActions` replaces the column headers with a `Table.BulkActions` toolbar that announces the selected count. When a focused bulk action disappears, focus moves to `bulkActionsReturnFocusRef` or the select-all checkbox.
- Sortable headers name the button with the column title only and expose the next sort action through `aria-description`, matching the legacy accessibility fix. Sort icons are decorative.
- `Table.Pagination` hides numbered pages on narrow viewports by default, matching the legacy footer. Pass `showPages` to change this.
- When a table overflows its `Table.OverflowWrapper`, the wrapper becomes a focusable `region` named by the table's `aria-labelledby` or `aria-label`, so keyboard users can scroll it.
