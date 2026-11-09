# Alignment

## From: `@primer/react`

Legacy DataTable combines table rendering with query loading/error state, pagination, action menus, grid-based column sizing, sorting, and a product-oriented error dialog.

## To: `@primer/react-tailwind`

DataTable preserves native table semantics, nested field paths, columns, caller-owned row identity (`getRowId`), column widths, initial and external sorting, and `onToggleSort`. It ports legacy row selection (`rowSelection`, `selectedRows`, `defaultSelectedRows`, `onSelectionChange`, `isRowSelectable`), config-driven row groups (`DataTableRowGroup` items in `data`), collapsible groups with controllable expansion (`collapsibleGroups`, `expandedGroups`, `defaultExpandedGroups`, `onExpandedGroupsChange`), and bulk actions (`renderBulkActions`, `bulkActionsProps`, `bulkActionsReturnFocusRef`) with the same names and semantics. It exposes composable head, body, row, header, sortable header, selection header, row selection, group, bulk actions, cell, container, title, subtitle, action, skeleton, and pagination parts.

## Migration notes

- **Intentional:** Fetching, error dialogs, and product action menus are not configuration props on the base table. Compose `Table.Skeleton`, `Table.Pagination`, `ActionMenu`, and error UI in the application instead.
- **`Table.ErrorDialog` migration:** This package does not export that legacy part. Use the existing `ConfirmationDialog` with `title="Error"`, `confirmButtonContent="Retry"`, `cancelButtonContent="Dismiss"`, `onConfirm={onRetry}`, and `onCancel={onDismiss}`. Unlike the legacy part, the application must own its open state. Put a concise error message in `description` so it is associated with the alert dialog; arbitrary additional content can remain in `children`. Set `finalFocus` to a stable control when the previously focused table content may disappear, and verify focus restoration in the actual loading/error flow.

  ```tsx
  const [errorOpen, setErrorOpen] = React.useState(true)

  <ConfirmationDialog
    open={errorOpen}
    onOpenChange={setErrorOpen}
    title="Error"
    description="The table could not be loaded."
    confirmButtonContent="Retry"
    cancelButtonContent="Dismiss"
    onConfirm={onRetry}
    onCancel={onDismiss}
  />
  ```

  Open the dialog when the application detects an error, and let `onOpenChange` commit closure. `onCancel` covers the Dismiss button and accepted Escape or outside dismissal; `onConfirm` covers Retry. The application remains responsible for retrying or clearing its error state.

- `Table.Title` and `Table.Subtitle` preserve native heading and paragraph `as` values (`h1` through `h6`, or `p`) while defaulting to `h2` and `p`, respectively. Keep existing `as="h3"`/`as="h4"` choices to preserve the document outline; default `as="h2"` on Title and `as="p"` on Subtitle may be omitted. `Table.Title as="p"` remains a paragraph, not an ARIA heading. Element choice does not change table-title/subtitle layout or typography, and refs, IDs, event handlers, and HTML props remain on the selected native element. Keep the table's `aria-labelledby` and `aria-describedby` pointing to those IDs.

  ```tsx
  // Before
  import {DataTable, Table} from '@primer/react/experimental'
  ;<Table.Container>
    <Table.Title as="h3" id="components">
      Components
    </Table.Title>
    <Table.Subtitle as="p" id="components-description">
      Components available in this project
    </Table.Subtitle>
    <DataTable
      aria-labelledby="components"
      aria-describedby="components-description"
      data={components}
      columns={columns}
    />
  </Table.Container>

  // After
  import {DataTable, Table} from '@primer/react-tailwind'
  ;<Table.Container>
    <Table.Title as="h3" id="components">
      Components
    </Table.Title>
    <Table.Subtitle id="components-description">Components available in this project</Table.Subtitle>
    <DataTable
      aria-labelledby="components"
      aria-describedby="components-description"
      data={components}
      columns={columns}
    />
  </Table.Container>
  ```

- **Unsupported:** Arbitrary non-heading/non-paragraph `as` elements and custom render components are not supported by these simple presentational parts. Compose consumer-authored labelled content for those structures; do not substitute `role="heading"` for a native heading when only its level needs changing.
- Legacy `Table.Subtitle` defaulted to `div`; this package defaults to `p`. Keep descriptive text as a paragraph and choose a heading only when it introduces a real subsection, not just to obtain a visual size. Subtitle weight continues to inherit from its container regardless of the selected native element, and an explicit consumer font utility can override it.
- `Table.Pagination` composes the shared `Pagination` model and controls while preserving DataTable's zero-based page index, visible item range, responsive page visibility, and footer geometry.
- Column sizing uses a single CSS Grid template with nested subgrids on native table groups and rows, so `width`, `minWidth`, and `maxWidth` preserve the legacy distribution without duplicating width styles on cells.
- Pass the same `Column<Data>[]` directly to `Table.Skeleton`; callback headers are evaluated as in DataTable, and `align`, `width`, `minWidth`, and `maxWidth` are preserved. The skeleton also accepts header-only definitions with React node or callback headers. It does not invoke cell renderers or enable sorting. End-aligned columns align their headers and loading placeholders to the logical end in both LTR and RTL.
- `Table.Skeleton` matches legacy accessibility: one visually hidden “Loading” per cell, decorative placeholder lines hidden from assistive technology, and no `aria-busy` on the table or skeletons. Earlier canaries (including `afdf7e9`) exposed every line as an image named “Loading” (`rows` × columns) and set `aria-busy`; hosts patching that build can drop the patch once on a build with this fix.
- Use `externalSorting` and `onToggleSort` when sorting is owned by the caller. Use `className` instead of `sx` or styled-system props.
- **Breaking:** `sortBy: 'basic'` is removed. `SortStrategy` accepts `true`, `'alphanumeric'`, `'datetime'`, or a row comparator. `true` and `'alphanumeric'` stringify field values and compare them with numeric collation, so they order non-negative integers such as `2, 9, 10` correctly but not negative numbers (`-5` sorts before `-10`), decimals (`1.5` sorts before `1.25`), or the legacy code-unit string order. Replace `'basic'` with an ascending row comparator whenever values are numeric (unless they are always non-negative integers), boolean, or otherwise not plain text. The comparator receives whole rows, not field values; DataTable swaps its arguments for descending order, and it does not move blank values last as the built-in strategies do.

  ```tsx
  // Before
  {header: 'ID', field: 'id', sortBy: 'basic'}

  // After
  {header: 'ID', field: 'id', sortBy: (a, b) => a.id - b.id}
  ```

- Selection is a `ReadonlySet` of stable row ids. The effective selection ignores ids for rows that are missing or not selectable while keeping them in the owning set, so callers can retain selection across pages. With `Table.Pagination`, pass only the current page's rows; the select-all checkbox then selects or clears the current page and keeps selections from other pages.
- Group headers render as their own `<tbody>` with a `<th scope="colgroup">` header that labels the member rows. With `rowSelection`, group headers gain a tri-state checkbox that selects the group's selectable rows; with `collapsibleGroups`, they gain a disclosure button that reports `aria-expanded` and controls the member body through `aria-controls`. `Table.Group` is exported for hand-composed tables.
- While any row is selected, `renderBulkActions` replaces the column headers with a `Table.BulkActions` toolbar that announces the selected count. When a focused bulk action disappears, focus moves to `bulkActionsReturnFocusRef` or the select-all checkbox.
- Sortable headers name the button with the column title only and expose the next sort action through a hidden `aria-describedby` description rather than `aria-description`, which GitHub accessibility policy prohibits. `Table.SelectionHeader` takes the select-all count through `description`, and collapsible group toggles describe their row count the same way without `aria-controls`. Sort icons are decorative.
- `Table.Pagination` hides numbered pages on narrow viewports by default, matching the legacy footer. Pass `showPages` to change this.
- When a table overflows its `Table.OverflowWrapper`, the wrapper becomes a focusable `region` named by the table's `aria-labelledby` or `aria-label`, so keyboard users can scroll it. If overflow ends while the region is focused, its name and focusability remain until focus leaves.
- Table establishes a positioned containing block inside that wrapper. This keeps absolutely positioned, visually hidden cell content from escaping the scroll region, but custom absolute descendants that previously anchored to an outer ancestor may move. Give such content a positioned cell wrapper or render an escaping overlay in a portal.
