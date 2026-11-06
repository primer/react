# DataTable

`DataTable` is a presentational, typed table for stable row data. It owns native table structure, sorting state, and column layout while `Table` exposes structural parts for custom composition.

Import: `import {DataTable, Table} from '@primer/react-tailwind/DataTable'`

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

- `aria-description`: `string` — Accessible description for the selection checkbox, such as how many rows it selects.
- `aria-label`: `string` — Default `'Select rows'`. Accessible name for the selection checkbox.
- `checkboxRef`: `Ref<HTMLElement>` — Ref to the selection checkbox, for returning focus to it.
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
- `columns` (required): `(TableColumnLayout & { header: React.ReactNode; })[]` — Column definitions the placeholder should mirror.
- `gridTemplateColumns`: `GridTemplateColumns<string | number>` — Explicit column track sizes, as a CSS grid template.
- `rows`: `number` — Default `10`. Number of placeholder rows to render while data loads.

## Table.Subtitle

Renders a [`<p>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/p#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Table.Title

Renders a [`<h2>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/h2#attributes) and forwards unrecognized props to it, so it also accepts that element's native attributes.

## Differences from `@primer/react`

- **Intentional:** Fetching, error dialogs, and product action menus are not configuration props on the base table. Compose `Table.Skeleton`, `Table.Pagination`, `ActionMenu`, and error UI in the application instead.
