import {defineComponent} from '../docs/component'

export default defineComponent({
  id: 'data_table',
  name: 'DataTable',
  status: 'alpha',
  a11yReviewed: '2025-01-08',
  stories: [
    'experimental-components-datatable--default',
    'experimental-components-datatable-features--with-title',
    'experimental-components-datatable-features--with-title-and-subtitle',
    'experimental-components-datatable-features--with-sorting',
    'experimental-components-datatable-features--with-actions',
    'experimental-components-datatable-features--with-action',
    'experimental-components-datatable-features--with-row-action',
    'experimental-components-datatable-features--with-row-actions',
    'experimental-components-datatable-features--with-row-action-menu',
    'experimental-components-datatable-features--with-custom-heading',
    'experimental-components-datatable-features--with-no-content',
    'experimental-components-datatable-features--with-loading',
    'experimental-components-datatable-features--with-pagination',
    'experimental-components-datatable-features--with-groups',
    'experimental-components-datatable-features--with-row-selection',
    'experimental-components-datatable-features--with-bulk-actions',
    'experimental-components-datatable-features--with-grouped-row-selection',
    'experimental-components-datatable-features--with-standalone-and-grouped-row-selection',
    'experimental-components-datatable-features--with-paginated-row-selection',
    'experimental-components-datatable-features--with-sortable-groups',
    'experimental-components-datatable-features--with-collapsible-groups',
    'experimental-components-table-features--with-groups',
    'experimental-components-table-features--with-row-selection',
  ],
  importPath: '@primer/react/experimental',
  props: [
    {
      name: 'aria-describedby',
      type: 'string',
      description: 'Provide an id to an element which uniquely describes this table',
      required: false,
    },
    {
      name: 'aria-labelledby',
      type: 'string',
      description: 'Provide an id to an element which uniquely labels this table',
      required: false,
    },
    {
      name: 'data',
      type: 'Array<Data | DataTableRowGroup<Data>>',
      description: 'Provide rows, row groups, or a mixture of both to render in the table, in display order.',
      required: true,
    },
    {
      name: 'columns',
      type: 'Array<Column<Data>>',
      description: 'Provide the columns for the table and the fields in `data` to which they correspond',
      required: true,
    },
    {
      name: 'getRowId',
      type: '(row: Data) => DataTableRowId',
      description: 'Provide a stable row ID. Defaults to row.id. DataTableRowId is an exported string | number type.',
      required: false,
    },
    {
      name: 'rowSelection',
      type: 'boolean',
      description:
        'Render row checkboxes and current-page select-all. Collapsible groups also get a checkbox for their selectable members.',
      required: false,
    },
    {
      name: 'selectedRows',
      type: 'ReadonlySet<DataTableRowId>',
      description:
        'Control selection using stable IDs from `getRowId`. Missing or non-selectable IDs stay stored but do not count as selected.',
      required: false,
    },
    {
      name: 'defaultSelectedRows',
      type: 'ReadonlySet<DataTableRowId>',
      description: 'Set the initial selection for an uncontrolled, static, single-page table.',
      required: false,
    },
    {
      name: 'onSelectionChange',
      type: '({ selectedRows }: { selectedRows: Set<DataTableRowId> }) => void',
      description:
        'Receive a new selection set when a checkbox is toggled. Data changes alone do not trigger this callback.',
      required: false,
    },
    {
      name: 'isRowSelectable',
      type: '(row: Data) => boolean',
      description: 'Determine which rows can be selected and counted by select-all.',
      required: false,
    },
    {
      name: 'collapsibleGroups',
      type: 'boolean',
      defaultValue: 'false',
      description:
        'Enable group disclosures. Collapsing only hides members; selection and select-all still include them.',
      required: false,
    },
    {
      name: 'getGroupRowCountLabel',
      type: '(rowCount: number) => string',
      description:
        'Localize the description shared by each group checkbox and disclosure. The count includes all members, including non-selectable rows, and defaults to 1 row or N rows.',
      required: false,
    },
    {
      name: 'expandedGroups',
      type: 'ReadonlySet<DataTableRowId>',
      description: 'Control expanded groups by stable groupId. String and numeric IDs remain distinct.',
      required: false,
    },
    {
      name: 'defaultExpandedGroups',
      type: 'ReadonlySet<DataTableRowId>',
      description:
        'Initially expanded group IDs. Defaults to all groups in the initial data; subsequently introduced IDs are collapsed.',
      required: false,
    },
    {
      name: 'onExpandedGroupsChange',
      type: '({ expandedGroups }: { expandedGroups: Set<DataTableRowId> }) => void',
      description:
        'Receive a new expansion set on a disclosure request. Sorting and data replacement do not emit this callback or clear stored IDs.',
      required: false,
    },
    {
      name: 'renderBulkActions',
      type: '(context: DataTableBulkActionsContext) => React.ReactNode',
      description:
        'Render actions in place of visible column labels when rowSelection is enabled and selectable rows are selected. Receives selectedRows IDs, selectedCount, and clearSelection, excluding missing and non-selectable rows.',
      required: false,
    },
    {
      name: 'bulkActionsProps',
      type: "Pick<TableBulkActionsProps, 'aria-label' | 'getSelectedCountLabel'>",
      description: 'Localize the bulk-action group name and selected-count announcement (including zero).',
      required: false,
    },
    {
      name: 'bulkActionsReturnFocusRef',
      type: 'React.RefObject<HTMLElement | null>',
      description:
        'Override focus recovery when a focused action disappears. Defaults to select-all, or the table when no selectable rows remain. Does not override focus already moved by the consumer.',
      required: false,
    },
    {
      name: 'cellPadding',
      type: "'condensed' | 'normal' | 'spacious'",
      description: 'Specify the amount of space that should be available around the contents of a cell',
      required: false,
    },
    {
      name: 'aria-describedby',
      type: 'string',
      required: false,
      description: 'Provide an id to an element which uniquely describes this table',
    },
    {
      name: 'aria-labelledby',
      type: 'string',
      required: false,
      description: 'Provide an id to an element which uniquely labels this table',
    },
    {
      name: 'initialSortColumn',
      type: 'string | number',
      required: false,
      description:
        'Provide the id or field of the column by which the table is sorted. When\nusing this `prop`, the input data must be sorted by this column in\nascending order',
    },
    {
      name: 'initialSortDirection',
      type: "'ASC' | 'DESC'",
      required: false,
      description: 'Provide the sort direction that the table should be sorted by on the\ncurrently sorted column',
      defaultValue: '',
    },
    {
      name: 'externalSorting',
      type: 'boolean',
      required: false,
      description:
        'Indicate whether the sorting of the table is managed externally. When `true`, the table will not sort the data internally when a column header is clicked. The `onToggleSort` callback will still be invoked when a column header is clicked.',
      defaultValue: 'false',
    },
    {
      name: 'onToggleSort',
      type: "(columnId: ObjectPaths<Data> | string | number, direction: 'ASC' | 'DESC') => void",
      required: false,
      description:
        'Fires when the user clicks a sortable column header or activates it with Enter or Space. Reports the sorted column ID and the new direction.',
    },
  ],
  subcomponents: [
    {
      name: 'Table.BulkActions',
      props: [
        {
          name: 'selectedCount',
          type: 'number',
          required: true,
          description:
            'The effectively selected row count. Keep the component mounted at zero so count announcements and focus recovery can complete.',
        },
        {
          name: 'onFocusReturn',
          type: '() => void',
          description:
            'Choose the recovery destination when a focused action disappears and focus has not moved elsewhere.',
          required: false,
        },
        {
          name: 'getSelectedCountLabel',
          type: '(selectedCount: number) => string',
          description: 'Localize the visible and announced selected count, including zero.',
          required: false,
        },
        {
          name: 'aria-label',
          type: 'string',
          defaultValue: "'Bulk actions'",
          description: 'Name the action group.',
          required: false,
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          description:
            'Consumer-owned action elements in native Tab order, rendered only when selectedCount is positive.',
          required: false,
        },
      ],
      displayName: 'BulkActions',
    },
    {
      name: 'Table',
      props: [
        {
          name: 'aria-describedby',
          type: 'string',
          description: 'Provide an id to an element which uniquely describes this table',
          required: false,
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          description: 'Provide an id to an element which uniquely labels this table',
          required: false,
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Table sections, such as `Table.Head` and `Table.Body`.',
          required: false,
        },
        {
          name: 'cellPadding',
          type: "'condensed' | 'normal' | 'spacious'",
          description: 'Specify the amount of space that should be available around the contents of a cell',
          required: false,
        },
      ],
      displayName: 'Table',
    },
    {
      name: 'Table.Head',
      props: [{name: 'children', type: 'React.ReactNode', description: 'Header rows for the table.', required: false}],
      displayName: 'Head',
    },
    {
      name: 'Table.Actions',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Controls used to act on the table or its data.',
          required: false,
        },
      ],
      displayName: 'Actions',
    },
    {
      name: 'Table.Body',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Data rows or row groups for the table.',
          required: false,
        },
      ],
      displayName: 'Body',
    },
    {
      name: 'Table.Group',
      props: [
        {
          name: 'collapsible',
          type: 'boolean',
          defaultValue: 'false',
          description: 'Render a disclosure controlling the member body. Without this prop members are always visible.',
          required: false,
        },
        {
          name: 'expanded',
          type: 'boolean',
          description: 'Control whether the member body is visible.',
          required: false,
        },
        {
          name: 'defaultExpanded',
          type: 'boolean',
          defaultValue: 'true',
          description: 'Initial expanded state for an uncontrolled group.',
          required: false,
        },
        {
          name: 'onExpandedChange',
          type: '({ expanded }: { expanded: boolean }) => void',
          description: 'Handle a disclosure request. Controlled groups wait for the expanded prop to update.',
          required: false,
        },
        {
          name: 'selection',
          type: "'all' | 'some' | 'none'",
          description: 'Render a group checkbox with the given selection state.',
          required: false,
        },
        {
          name: 'selectionDisabled',
          type: 'boolean',
          description: 'Disable the group checkbox without disabling its disclosure.',
          required: false,
        },
        {
          name: 'onToggleSelect',
          type: '() => void',
          description:
            'Handle group checkbox activation. Consumers own member selection. When omitted, the group checkbox is disabled.',
          required: false,
        },
        {
          name: 'id',
          type: 'string | number',
          description:
            "A stable identifier exposed on both group sections as `data-group-id`. The group header's DOM id is generated separately so it is safe for use in `headers`.",
          required: true,
        },
        {
          name: 'label',
          type: 'string',
          description:
            'The visible label for the group, shown in the group header and included in its accessible name along with the row count.',
          required: true,
        },
        {
          name: 'rowCount',
          type: 'number',
          description:
            'The total number of member rows, including non-selectable rows. Shown in the header and described separately on the checkbox and disclosure.',
          required: true,
        },
        {
          name: 'getRowCountLabel',
          type: '(rowCount: number) => string',
          description:
            'Localize the count description shared by the checkbox and disclosure. Defaults to 1 row or N rows.',
          required: false,
        },
        {
          name: 'aria-label',
          type: 'string',
          description:
            "Override the group name used by the header, checkbox, and disclosure. Use getRowCountLabel to localize the controls' separate count description.",
          required: false,
        },
        {
          name: 'colSpan',
          type: 'number',
          description: 'The number of columns spanned by the group header.',
          required: true,
        },
        {
          name: 'children',
          type: 'React.ReactNode',
          description:
            "The group's member rows, typically a list of `Table.Row` elements. When composing a grouped table directly, use each `Table.Cell`'s native `headers` prop to reference the corresponding `Table.Header` id. The group header association is added automatically.",
          required: false,
        },
      ],
      displayName: 'Group',
    },
    {
      name: 'Table.Row',
      props: [
        {name: 'children', type: 'React.ReactNode', description: 'Header or data cells in the row.', required: false},
      ],
      displayName: 'Row',
    },
    {
      name: 'Table.Header',
      props: [
        {
          name: 'align',
          type: "'end' | 'start'",
          required: false,
          description: "The horizontal alignment of the cell's content",
        },
        {name: 'children', type: 'React.ReactNode', description: 'Content of the column header cell.', required: false},
      ],
      displayName: 'Header',
    },
    {
      name: 'Table.SelectionHeader',
      props: [
        {
          name: 'selection',
          type: "'all' | 'some' | 'none'",
          required: true,
          description: 'Whether all, some, or none of the selectable rows are selected.',
        },
        {name: 'disabled', type: 'boolean', description: 'Whether row selection is unavailable.', required: false},
        {
          name: 'onToggleSelect',
          type: '() => void',
          description: 'Request toggling selection for all selectable rows.',
          required: false,
        },
        {
          name: 'checkboxRef',
          type: 'React.Ref<HTMLInputElement>',
          description: 'Forward a ref to the native selection checkbox.',
          required: false,
        },
        {
          name: 'aria-label',
          type: 'string',
          defaultValue: "'Select rows'",
          description: "Provide the selection checkbox's accessible name.",
          required: false,
        },
        {
          name: 'aria-description',
          type: 'string',
          description: 'Describe the select-all scope, for example "Select all 10 rows".',
          required: false,
        },
      ],
      displayName: 'SelectionHeader',
    },
    {
      name: 'Table.RowSelection',
      props: [
        {name: 'selected', type: 'boolean', required: true, description: 'Whether the row is selected.'},
        {name: 'disabled', type: 'boolean', description: 'Whether the row cannot be selected.', required: false},
        {
          name: 'onToggleSelect',
          type: '() => void',
          description: 'Request toggling selection for the row.',
          required: false,
        },
        {
          name: 'checkboxRef',
          type: 'React.Ref<HTMLInputElement>',
          description: 'Forward a ref to the native row checkbox.',
          required: false,
        },
        {
          name: 'aria-label',
          type: 'string',
          defaultValue: "'Select row'",
          description: 'Name the row checkbox when `aria-labelledby` is not provided.',
          required: false,
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          description: 'Reference the row header IDs. The checkbox name adds "Select" before their text.',
          required: false,
        },
      ],
      displayName: 'RowSelection',
    },
    {
      name: 'Table.Cell',
      props: [
        {
          name: 'align',
          type: "'end' | 'start'",
          required: false,
          description: "The horizontal alignment of the cell's content",
        },
        {name: 'children', type: 'React.ReactNode', description: 'Content of the table cell.', required: false},
        {
          name: 'scope',
          type: "'row'",
          description: 'Provide the scope for a table cell, useful for defining a row header using `scope="row"`',
          required: false,
        },
      ],
      displayName: 'Cell',
    },
    {name: 'Table.CellPlaceholder', props: [], displayName: 'CellPlaceholder'},
    {
      name: 'Table.Container',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'The table and surrounding content, such as its title and actions.',
          required: false,
        },
      ],
      displayName: 'Container',
    },
    {name: 'Table.Divider', props: [], displayName: 'Divider'},
    {
      name: 'Table.Title',
      props: [
        {name: 'children', type: 'React.ReactNode', description: 'Title content for the table.', required: false},
        {
          name: 'id',
          type: 'string',
          required: true,
          description:
            'Provide a unique id for the table subtitle. This should be used along with\n`aria-labelledby` on `DataTable`',
        },
      ],
      displayName: 'Title',
    },
    {
      name: 'Table.Subtitle',
      props: [
        {name: 'children', type: 'React.ReactNode', description: 'Subtitle content for the table.', required: false},
        {
          name: 'id',
          type: 'string',
          required: true,
          description:
            'Provide a unique id for the table subtitle. This should be used along with\n`aria-describedby` on `DataTable`',
        },
      ],
      displayName: 'Subtitle',
    },
    {
      name: 'Table.Skeleton',
      props: [
        {
          name: 'cellPadding',
          type: "'condensed' | 'normal' | 'spacious'",
          description: 'Specify the amount of space that should be available around the contents of a cell',
          defaultValue: 'normal',
          required: false,
        },
        {
          name: 'columns',
          required: true,
          type: 'Array<Column<Data>>',
          description: 'Provide an array of columns for the table. Columns will render as the headers\nof the table.',
        },
        {
          name: 'rows',
          type: 'number',
          description:
            'Optionally specify the number of rows which should be included in the skeleton state of the component',
          defaultValue: '10',
          required: false,
        },
      ],
      displayName: 'Skeleton',
    },
    {
      name: 'Table.Pagination',
      props: [
        {
          name: 'aria-label',
          type: 'string',
          required: true,
          description:
            'Defines a string value that labels the current element.\nProvide a label for the navigation landmark rendered by this component\n@see aria-labelledby.',
        },
        {
          name: 'defaultPageIndex',
          type: 'string',
          description: 'Provide an optional index to specify the default selected page',
          required: false,
        },
        {
          name: 'id',
          type: 'string',
          description:
            'Optionally provide an `id` that is placed on the navigation landmark\nrendered by this component',
          required: false,
        },
        {
          name: 'onChange',
          type: '({ pageIndex }: { pageIndex: number }) => void',
          description: 'Optionally provide a handler that is called whenever the pagination state\nis updated',
          required: false,
        },
        {
          name: 'pageSize',
          type: 'number',
          description: 'Optionally specify the number of items within a page',
          defaultValue: '25',
          required: false,
        },
        {
          name: 'totalCount',
          type: 'number',
          required: true,
          description: 'Specify the total number of items within the collection',
        },
        {
          name: 'showPages',
          type: 'boolean | { narrow?: boolean; regular?: boolean; wide?: boolean; }',
          required: false,
          description: 'Whether to show the page numbers',
          defaultValue: '{narrow: false}',
        },
      ],
      displayName: 'Pagination',
    },
    {
      name: 'Table.ErrorDialog',
      props: [
        {
          name: 'children',
          required: true,
          type: 'React.ReactNode',
          description: 'The content of the dialog. This is usually a message explaining the error.',
        },
        {
          name: 'title',
          type: 'string',
          defaultValue: "'Error'",
          description: 'The title of the dialog. This is usually a short description of the error.',
          required: false,
        },
        {
          name: 'onRetry',
          type: '() => void',
          description: 'Event handler called when the user clicks the retry button.',
          required: false,
        },
        {
          name: 'onDismiss',
          type: '() => void',
          description: 'Event handler called when the dialog is dismissed.',
          required: false,
        },
      ],
      displayName: 'ErrorDialog',
    },
  ],
  relatedTypes: [
    {
      name: 'Column',
      displayName: 'Column options',
      props: [
        {
          name: 'align',
          type: "'start' | 'end'",
          description: "The horizontal alignment of the column's content",
          required: false,
        },
        {
          name: 'field',
          type: 'ObjectPaths<Data>',
          description:
            'Optionally provide a field to render for this column. This may be the key of the object or a string that accesses nested objects through `.`. For example: `field: a.b.c`\nAlternatively, you may provide a `renderCell` for this column to render the field in a row',
          required: false,
        },
        {
          name: 'header',
          type: 'string | (() => React.ReactNode)',
          required: true,
          description:
            'Provide the name of the column. This will be rendered as a table header within the table itself',
        },
        {
          name: 'maxWidth',
          type: "React.CSSProperties['maxWidth']",
          description: 'The maximum width the column can grow to',
          required: false,
        },
        {
          name: 'minWidth',
          type: "React.CSSProperties['minWidth']",
          description: 'The minimum width the column can shrink to',
          required: false,
        },
        {
          name: 'renderCell',
          type: '(data: Data) => React.ReactNode',
          description: 'Provide a custom component or render prop to render the data for this column in a row',
          required: false,
        },
        {
          name: 'rowHeader',
          type: 'boolean',
          description: 'Specify if the value of this column for a row should be treated as a row header',
          required: false,
        },
        {
          name: 'sortBy',
          type: "boolean | 'alphanumeric' | 'basic' | 'datetime' | (a: Data, b: Data) => number",
          description:
            'Specify if the table should sort by this column and, if applicable, a specific sort strategy or custom sort strategy',
          required: false,
        },
        {
          name: 'width',
          defaultValue: "'grow'",
          type: "'grow' | 'growCollapse' | 'auto' | React.CSSProperties['width']",
          description:
            "Controls the width of the column.\n\n- 'grow': Stretch to fill available space, and min width is the width of the widest cell in the column\n- 'growCollapse': Stretch to fill available space or shrink to fit in the available space. Allows the column to shrink smaller than the cell content's width.\n- 'auto': The column is the width of it’s widest cell. Not intended for use with columns who’s content length varies a lot because a layout shift will occur when the content changes\n- explicit width: Will be exactly that width and will not grow or shrink to fill the parent",
          required: false,
        },
      ],
    },
  ],
})
