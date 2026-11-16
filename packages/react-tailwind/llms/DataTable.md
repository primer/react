# DataTable

`DataTable` is a presentational, typed table for stable row data. It owns native table structure, sorting state, and column layout while `Table` exposes structural parts for custom composition.

Import: `import {DataTable, Table} from '@primer/react-tailwind/DataTable'`

Read [package guidance](../AGENTS.md) for setup, styling, and shared composition contracts.

## Usage

```tsx
import {DataTable, type Column} from '@primer/react-tailwind'

const columns: Column<Issue>[] = [{field: 'title', header: 'Title', rowHeader: true}]

<DataTable aria-label="Issues" columns={columns} data={issues} />
```

Use a stable row id and a `rowHeader` column. Preserve native table semantics and give every table an accessible label or caption. Column `field` values may address nested properties such as `securityFeatures.dependabot`; use `renderCell` when a cell needs custom content.

## Sorting and layout

Set `sortBy` to `true`, `'alphanumeric'`, `'datetime'`, or a row comparator to make a column sortable. `initialSortColumn` and `initialSortDirection` describe the initial uncontrolled sort state. Set `externalSorting` when the caller provides sorted rows, and use `onToggleSort` to request the next sort from that caller.

Columns grow by default. Use `width="auto"`, `width="growCollapse"`, an explicit CSS width, and optional `minWidth` or `maxWidth` when the table needs a deliberate layout.

## Loading skeleton

Pass the same `Column<Data>[]` to `Table.Skeleton` and `DataTable`. The skeleton evaluates callback headers and preserves each column's `align`, `width`, `minWidth`, and `maxWidth` without invoking cell renderers or enabling sorting. Header-only definitions remain supported, including rendered React nodes as headers.

Like legacy Primer, each skeleton cell exposes one visually hidden “Loading” label; the placeholder lines are hidden from assistive technology and the table does not set `aria-busy` (prohibited by GitHub accessibility policy). The skeleton does not announce on its own: a status region mounted together with the skeleton is not reliably announced. When loading or completion must be announced, keep a persistent `AriaStatus`/`LiveRegion` outside the swapped content and update its message.

```tsx
const columns: Column<Issue>[] = [
  {field: 'title', header: 'Title', width: 'growCollapse'},
  {field: 'count', header: () => <span>Count</span>, align: 'end', width: 96},
]

loading ? (
  <Table.Skeleton aria-label="Issues" columns={columns} rows={5} />
) : (
  <DataTable aria-label="Issues" columns={columns} data={issues} />
)
```

## Accessibility and composition

Sortable headers use native buttons named by the column title, with the next sort action as a hidden `aria-describedby` description and `aria-sort` on the header; row headers render as `<th scope="row">`. Hand-composed tables can use `Table.SelectionHeader`, `Table.RowSelection`, `Table.Group`, and `Table.BulkActions`. `Table.Title` defaults to `h2` and `Table.Subtitle` to `p`; both accept `as="h1"` through `as="h6"` or `as="p"` to fit the document structure without changing their visual style. Their refs, HTML props, IDs, and classes stay on that native element. Compose table pagination with `Table.Pagination`, which translates its zero-based page index contract onto the shared `Pagination` primitive. Compose loading and error UI and row actions with `Table.Skeleton`, `ActionMenu`, and `Blankslate`.

An overflowing table has a focusable, named scroll region. If it stops overflowing while focused, the region remains focusable until focus leaves. The table establishes a containing block for otherwise unpositioned absolute descendants, keeping visually hidden cell labels inside that region. Give custom positioned content its own containing block when it needs to anchor to a cell; use a portal for overlays that need to escape the scroll region.

The legacy `Table.ErrorDialog` is not exported here. For a retry/dismiss alert dialog, use the controlled `ConfirmationDialog` composition in the migration notes and choose a stable return-focus target for your error flow.

```tsx
<Table.Container>
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

## Row selection and bulk actions

Set `rowSelection` to add a checkbox column. Selection is a set of stable row ids from `getRowId`, which defaults to each row's `id`. Pass `selectedRows` and `onSelectionChange` to own the selection, or `defaultSelectedRows` for static data. Use `isRowSelectable` to disable individual rows; ids for missing or non-selectable rows are ignored but kept in the caller's set, so selection can persist across pages.

```tsx
const [selectedRows, setSelectedRows] = useState<ReadonlySet<DataTableRowId>>(() => new Set())

<DataTable
  aria-labelledby="repositories"
  columns={columns}
  data={rows}
  rowSelection
  selectedRows={selectedRows}
  onSelectionChange={({selectedRows}) => setSelectedRows(selectedRows)}
  renderBulkActions={({selectedCount, clearSelection}) => (
    <Button onClick={clearSelection}>Clear {selectedCount}</Button>
  )}
/>
```

`renderBulkActions` replaces the column headers with a toolbar while any row is selected. Use `bulkActionsProps` to customize its label and selected-count text, and `bulkActionsReturnFocusRef` to choose where focus goes if a focused action disappears.

## Row groups

Include `DataTableRowGroup` items (`{groupId, label, rows}`) in `data` to render labelled groups, optionally mixed with standalone rows. Sorting reorders rows within each group and within each run of standalone rows, keeping groups in place. Set `collapsibleGroups` to add disclosure buttons, and use `expandedGroups`, `defaultExpandedGroups`, and `onExpandedGroupsChange` to control which groups are open. With `rowSelection`, each group header includes a tri-state checkbox for its selectable rows.

Renders a [`<table>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Props

- `bulkActionsProps`: `Pick<TableBulkActionsProps, "aria-label" | "getSelectedCountLabel">` — Labels for the bulk actions toolbar.
- `bulkActionsReturnFocusRef`: `RefObject<HTMLElement | null>` — Element that receives focus when a focused bulk action disappears. Defaults to the select-all checkbox.
- `cellPadding`: `"condensed" | "normal" | "spacious"` — Default `'normal'`. Vertical spacing inside cells, which sets the density of the table.
- `collapsibleGroups`: `boolean` — Default `false`. Adds disclosure buttons that show and hide each group's rows. Groups start expanded.
- `columns` (required): `Column<Data>[]` — Column definitions, giving each column its header, width, and how to read a cell from a row.
- `data` (required): `DataTableData<Data>` — Rows, row groups, or a mixture of both, in display order.
- `defaultExpandedGroups`: `ReadonlySet<DataTableRowId>` — Ids of the groups expanded on first render. Defaults to every group in the initial data.
- `defaultSelectedRows`: `ReadonlySet<DataTableRowId>` — Ids selected on first render, when the table owns its selection. Intended for static, single-page data.
- `expandedGroups`: `ReadonlySet<DataTableRowId>` — Ids of the expanded groups, for when the caller owns the expanded state.
- `externalSorting`: `boolean` — Default `false`. Stops the table sorting `data` itself, for when rows arrive already sorted by a server.
- `getRowId`: `((row: Data) => DataTableRowId)` — Default `row => row.id`. Reads a stable identity from a row. Supply it when rows have no `id` field.
- `gridTemplateColumns`: `GridTemplateColumns<string | number>` — Explicit column track sizes, as a CSS grid template.
- `initialSortColumn`: `string` — Column sorted on first render.
- `initialSortDirection`: `ActiveSortDirection` — Direction sorted on first render.
- `isRowSelectable`: `((row: Data) => boolean)` — Decides whether a row can be selected. Rows are selectable by default.
- `onExpandedGroupsChange`: `((details: { expandedGroups: Set<DataTableRowId>; }) => void)` — Called with the requested expanded groups when a reader shows or hides a group.
- `onSelectionChange`: `((details: { selectedRows: Set<DataTableRowId>; }) => void)` — Called with the requested selection when a reader selects or deselects rows.
- `onToggleSort`: `((columnId: string, direction: ActiveSortDirection) => void)` — Called with the column and new direction when a sortable header is activated.
- `renderBulkActions`: `((context: DataTableBulkActionsContext) => React.ReactNode)` — Renders actions for the selected rows in place of the column headers while any row is selected.
- `rowSelection`: `boolean` — Default `false`. Adds a checkbox column for selecting rows.
- `selectedRows`: `ReadonlySet<DataTableRowId>` — Ids of the selected rows, for when the caller owns the selection.

## Table

Renders a [`<table>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `cellPadding`: `"condensed" | "normal" | "spacious"` — Default `'normal'`. Vertical spacing inside cells, which sets the density of the table.
- `gridTemplateColumns`: `GridTemplateColumns<string | number>` — Explicit column track sizes, as a CSS grid template.

## Table.Actions

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Table.Body

Renders a [`<tbody>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Table.BulkActions

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `aria-label`: `string` — Default `'Bulk actions'`. Accessible name for the group of actions.
- `getSelectedCountLabel`: `((selectedCount: number) => string)` — Default `` selectedCount => `${selectedCount} selected` ``. Formats the announced selection count.
- `onFocusReturn`: `(() => void)` — Called when the focused action is removed, so focus can move somewhere meaningful instead of the page.
- `selectedCount` (required): `number` — Number of selected rows. The actions show only when it is greater than zero.

## Table.Cell

Renders a [`<td>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `align`: `Alignment` — Horizontal alignment of the cell's content.
- `scope`: `"row"` — Marks the cell as a header for its row or column, which assistive technology uses to describe other cells.

## Table.CellPlaceholder

Renders a [`<span>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/span#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Table.Container

Renders a [`<div>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Table.Divider

Takes no props of its own.

## Table.Group

- `aria-label`: `string` — Accessible name for the group header, for when the visible label needs more context.
- `children`: `React.ReactNode` — Member rows of the group.
- `className`: `string` — Class name for the group header section.
- `collapsible`: `boolean` — Default `false`. Adds a disclosure button that shows and hides the member rows.
- `colSpan` (required): `number` — Number of columns the group header spans.
- `defaultExpanded`: `boolean` — Default `true`. Whether the member rows are shown on first render, when the group owns its expanded state.
- `expanded`: `boolean` — Whether the member rows are shown, for when the caller owns the expanded state.
- `id` (required): `string | number` — Stable identifier exposed on both group sections as `data-group-id`.
- `label` (required): `string` — Visible label for the group header.
- `onExpandedChange`: `((details: { expanded: boolean; }) => void)` — Called with the requested expanded state when the disclosure button is activated.
- `onToggleSelect`: `(() => void)` — Called when the reader asks to select or clear every selectable row in the group.
- `rowCount` (required): `number` — Number of member rows in the group, announced alongside the label.
- `selection`: `"all" | "none" | "some"` — Whether all, some, or none of the group's selectable rows are selected. Renders a group checkbox when set.
- `selectionDisabled`: `boolean` — Prevents toggling the group checkbox, for when the group has no selectable rows.

## Table.Head

Renders a [`<thead>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/thead#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Table.Header

Renders a [`<th>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `align`: `Alignment` — Horizontal alignment of the header's content.

## Table.Pagination

Renders a [`<nav>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/nav#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `data-component`: `string` — Overrides the marker used to identify this element in tests and styling.
- `defaultPageIndex`: `number` — Default `0`. Zero-based page shown on first render.
- `hrefBuilder`: `((page: number) => string)` — Default `` page => `#${page}` ``. Builds the URL for a page, so pagination works without JavaScript.
- `marginPageCount`: `number` — How many pages stay visible at each end of the range.
- `onChange`: `((details: { pageIndex: number; }) => void)` — Called with the new page index when the reader pages through the table.
- `pageSize` (required): `number` — Number of rows shown per page.
- `renderPage`: `((props: PageProps) => React.ReactNode)` — Renders each page link yourself, for integrating with a router.
- `showPages`: `ResponsiveValue<boolean>` — Default `{narrow: false}`. Shows the numbered pages. Defaults to hiding them on narrow viewports, keeping only Previous and Next.
- `surroundingPageCount`: `number` — How many pages stay visible on each side of the current one.
- `totalCount` (required): `number` — Total number of rows across all pages.

## Table.Row

Renders a [`<tr>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tr#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Table.RowSelection

Renders a [`<td>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/td#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `aria-label`: `string` — Default `'Select row'`. Accessible name for the checkbox when no row header labels it.
- `aria-labelledby`: `string` — Ids of the row header or headers that label the checkbox. The selection action is prepended automatically.
- `checkboxRef`: `Ref<HTMLElement>` — Ref to the row's selection checkbox.
- `disabled`: `boolean` — Prevents selecting the row.
- `onToggleSelect`: `(() => void)` — Called when the reader asks to select or deselect the row.
- `selected` (required): `boolean` — Whether the row is selected.

## Table.SelectionHeader

Renders a [`<th>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `aria-describedby`: `string` — IDs of elements that describe the selection checkbox.
- `aria-label`: `string` — Default `'Select rows'`. Accessible name for the selection checkbox.
- `checkboxRef`: `Ref<HTMLElement>` — Ref to the selection checkbox, for returning focus to it.
- `description`: `string` — Supplementary description for the selection checkbox, such as how many rows it selects.
- `disabled`: `boolean` — Prevents toggling selection, for when no rows can be selected.
- `onToggleSelect`: `(() => void)` — Called when the reader asks to select or clear every selectable row.
- `selection` (required): `"all" | "none" | "some"` — Whether all, some, or none of the selectable rows are selected.

## Table.SortHeader

Renders a [`<th>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `align`: `Alignment` — Horizontal alignment of the header's content.
- `direction` (required): `SortDirection` — Current sort direction for this column.
- `onToggleSort` (required): `() => void` — Called when the header is activated to change the sort.

## Table.Skeleton

Renders a [`<table>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/table#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `cellPadding`: `"condensed" | "normal" | "spacious"` — Default `'normal'`. Vertical spacing inside cells, which sets the density of the table.
- `columns` (required): `(Column<Data> | (TableColumnLayout & Pick<Column<Data>, "align"> & { header: (() => React.ReactNode) | React.ReactNode; }))[]` — DataTable columns or header-only definitions whose headers, alignment, and layout the placeholder mirrors.
- `gridTemplateColumns`: `GridTemplateColumns<string | number>` — Explicit column track sizes, as a CSS grid template.
- `rows`: `number` — Default `10`. Number of placeholder rows to render while data loads.

## Table.Subtitle

Renders a [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `TableTextElement` — Default `'p'`. Native heading or paragraph element, chosen independently of the subtitle's visual style.

## Table.Title

Renders a [`<h2>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h2#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

- `as`: `TableTextElement` — Default `'h2'`. Native heading or paragraph element, chosen independently of the title's visual style.

## Differences from `@primer/react`

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
