import {defineComponent} from '../docs/components'

export default defineComponent({
  name: 'DataTable',
  displayName: 'DataTable',
  status: 'experimental',
  keywords: [],
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
      description: 'References the element that describes the table.',
      required: false,
    },
    {
      name: 'aria-labelledby',
      type: 'string',
      description: 'References the element that labels the table.',
      required: false,
    },
    {
      name: 'data',
      type: 'Array<Data | DataTableRowGroup<Data>>',
      description:
        'Rows, groups, or a mixture of both. An item with a `groupId` and a `rows` array is treated as a group.',
      required: true,
    },
    {
      name: 'columns',
      type: 'Array<Column<Data>>',
      description: 'Column definitions that determine what the table displays for each row.',
      required: true,
    },
    {
      name: 'getRowId',
      type: '(row: Data) => DataTableRowId',
      description: 'Returns a unique, stable row ID.',
      required: false,
      defaultValue: 'row => row.id',
    },
    {
      name: 'rowSelection',
      type: 'boolean',
      description: 'Shows controls for selecting rows.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'selectedRows',
      type: 'ReadonlySet<DataTableRowId>',
      description: 'Controls which row IDs are selected.',
      required: false,
    },
    {
      name: 'defaultSelectedRows',
      type: 'ReadonlySet<DataTableRowId>',
      description:
        'Initial selected row IDs for an uncontrolled table. Use uncontrolled selection for static, single-page data.',
      required: false,
      defaultValue: 'new Set()',
    },
    {
      name: 'onSelectionChange',
      type: '(value: {selectedRows: Set<DataTableRowId>}) => void',
      description: 'Reports the next set of selected row IDs.',
      required: false,
    },
    {
      name: 'isRowSelectable',
      type: '(row: Data) => boolean',
      description:
        'Determines which rows can be selected. With row selection enabled, all rows are selectable unless this callback excludes them.',
      required: false,
    },
    {
      name: 'collapsibleGroups',
      type: 'boolean',
      description: 'Shows disclosure controls for row groups.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'getGroupRowCountLabel',
      type: '(rowCount: number) => string',
      description:
        'Formats each group’s accessible row-count label. By default, the count is followed by “row” or “rows”.',
      required: false,
    },
    {
      name: 'expandedGroups',
      type: 'ReadonlySet<DataTableRowId>',
      description: 'Controls which group IDs are expanded.',
      required: false,
    },
    {
      name: 'defaultExpandedGroups',
      type: 'ReadonlySet<DataTableRowId>',
      description:
        'Initial expanded group IDs for an uncontrolled table. If omitted, all groups in the initial data are expanded.',
      required: false,
    },
    {
      name: 'onExpandedGroupsChange',
      type: '(value: {expandedGroups: Set<DataTableRowId>}) => void',
      description: 'Reports the next set of expanded group IDs.',
      required: false,
    },
    {
      name: 'renderBulkActions',
      type: '(context: DataTableBulkActionsContext) => React.ReactNode',
      description:
        'Renders actions when row selection is enabled and at least one row is selected. Receives the selected IDs, count, and a function to clear selection.',
      required: false,
    },
    {
      name: 'bulkActionsProps',
      type: "Pick<TableBulkActionsProps, 'aria-label' | 'getSelectedCountLabel'>",
      description: 'Customizes the accessible name and selected-count label of the bulk actions.',
      required: false,
    },
    {
      name: 'bulkActionsReturnFocusRef',
      type: 'React.RefObject<HTMLElement | null>',
      description:
        'Preferred focus target when a focused bulk action disappears. Falls back to the enabled selection header or the table.',
      required: false,
    },
    {
      name: 'cellPadding',
      type: "'condensed' | 'normal' | 'spacious'",
      description: 'Amount of space around the contents of a cell.',
      required: false,
      defaultValue: "'normal'",
    },
    {
      name: 'initialSortColumn',
      type: 'ObjectPaths<Data> | string | number',
      description: 'ID or field of the initially sorted column. Supply data already ordered for the initial sort.',
      required: false,
    },
    {
      name: 'initialSortDirection',
      type: "'ASC' | 'DESC'",
      description:
        'Direction of the initial sort. A supplied column defaults to ascending. If only a direction is supplied, the first sortable column is used.',
      required: false,
    },
    {
      name: 'externalSorting',
      type: 'boolean',
      description: 'Disables client-side sorting without suppressing sort callbacks.',
      required: false,
      defaultValue: 'false',
    },
    {
      name: 'onToggleSort',
      type: "(columnId: ObjectPaths<Data> | string | number, direction: 'ASC' | 'DESC') => void",
      description: 'Reports the column ID and next direction when a user activates a sortable header.',
      required: false,
    },
  ],
  subcomponents: [
    {
      name: 'Table.BulkActions',
      displayName: 'Table.BulkActions',
      props: [
        {
          name: 'selectedCount',
          type: 'number',
          description: 'Number of selected rows. Actions are shown when this is greater than zero.',
          required: true,
        },
        {
          name: 'onFocusReturn',
          type: '() => void',
          description:
            'Handles focus recovery when the focused action is removed and focus falls to the document body.',
          required: false,
        },
        {
          name: 'getSelectedCountLabel',
          type: '(selectedCount: number) => string',
          description: 'Formats the selected count. By default, the number is followed by “selected”.',
          required: false,
        },
        {
          name: 'aria-label',
          type: 'string',
          description: 'Accessible name of the actions group.',
          required: false,
          defaultValue: "'Bulk actions'",
        },
        {name: 'children', type: 'React.ReactNode', description: 'Actions for the selected rows.', required: false},
      ],
    },
    {
      name: 'Table',
      displayName: 'Table',
      props: [
        {
          name: 'aria-describedby',
          type: 'string',
          description: 'References the element that describes the table.',
          required: false,
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          description: 'References the element that labels the table.',
          required: false,
        },
        {name: 'children', type: 'React.ReactNode', description: 'Table sections, groups, and rows.', required: false},
        {
          name: 'cellPadding',
          type: "'condensed' | 'normal' | 'spacious'",
          description: 'Amount of space around the contents of a cell.',
          required: false,
          defaultValue: "'normal'",
        },
        {
          name: 'gridTemplateColumns',
          type: "React.CSSProperties['gridTemplateColumns']",
          description: 'CSS grid track definitions for the table columns.',
          required: false,
        },
      ],
    },
    {
      name: 'Table.Head',
      displayName: 'Table.Head',
      props: [{name: 'children', type: 'React.ReactNode', description: 'Rows in the table header.', required: false}],
    },
    {
      name: 'Table.Actions',
      displayName: 'Table.Actions',
      props: [
        {name: 'children', type: 'React.ReactNode', description: 'Actions that affect the table.', required: false},
      ],
    },
    {
      name: 'Table.Body',
      displayName: 'Table.Body',
      props: [{name: 'children', type: 'React.ReactNode', description: 'Rows in the table body.', required: false}],
    },
    {
      name: 'Table.Group',
      displayName: 'Table.Group',
      props: [
        {
          name: 'collapsible',
          type: 'boolean',
          description: 'Shows a disclosure control for this group.',
          required: false,
          defaultValue: 'false',
        },
        {
          name: 'expanded',
          type: 'boolean',
          description: 'Controls visibility of rows when the group is collapsible.',
          required: false,
        },
        {
          name: 'defaultExpanded',
          type: 'boolean',
          description: 'Initial visibility of rows in an uncontrolled collapsible group.',
          required: false,
          defaultValue: 'true',
        },
        {
          name: 'onExpandedChange',
          type: '(value: {expanded: boolean}) => void',
          description: 'Reports the next expanded state.',
          required: false,
        },
        {
          name: 'selection',
          type: "'all' | 'some' | 'none'",
          description: 'Selection state of the group. Omit to hide the group checkbox.',
          required: false,
        },
        {
          name: 'selectionDisabled',
          type: 'boolean',
          description: 'Disables the group checkbox. The checkbox is also disabled without `onToggleSelect`.',
          required: false,
        },
        {
          name: 'onToggleSelect',
          type: '() => void',
          description: 'Handles requests to toggle selection of the group.',
          required: false,
        },
        {
          name: 'id',
          type: 'string | number',
          description: 'Stable ID shared by the group header and body.',
          required: true,
        },
        {name: 'label', type: 'string', description: 'Visible group name.', required: true},
        {name: 'rowCount', type: 'number', description: 'Number of rows in the group.', required: true},
        {
          name: 'getRowCountLabel',
          type: '(rowCount: number) => string',
          description: 'Formats the accessible row count. By default, the count is followed by “row” or “rows”.',
          required: false,
        },
        {
          name: 'aria-label',
          type: 'string',
          description: 'Overrides the accessible name of the group header.',
          required: false,
        },
        {
          name: 'colSpan',
          type: 'number',
          description: 'Number of columns spanned by the group header.',
          required: true,
        },
        {name: 'children', type: 'React.ReactNode', description: 'Rows in the group.', required: false},
        {name: 'className', type: 'string', description: 'Class name for the group header section.', required: false},
      ],
    },
    {
      name: 'Table.Row',
      displayName: 'Table.Row',
      props: [
        {name: 'children', type: 'React.ReactNode', description: 'Cells or headers in the row.', required: false},
      ],
    },
    {
      name: 'Table.Header',
      displayName: 'Table.Header',
      props: [
        {
          name: 'align',
          type: "'end' | 'start'",
          description: 'Horizontal alignment of the header contents.',
          required: false,
        },
        {name: 'children', type: 'React.ReactNode', description: 'Content of the column header.', required: false},
      ],
    },
    {
      name: 'Table.SelectionHeader',
      displayName: 'Table.SelectionHeader',
      props: [
        {
          name: 'selection',
          type: "'all' | 'some' | 'none'",
          description: 'Whether all, some, or none of the selectable rows are selected.',
          required: true,
        },
        {name: 'disabled', type: 'boolean', description: 'Disables the select-all checkbox.', required: false},
        {
          name: 'onToggleSelect',
          type: '() => void',
          description: 'Handles requests to toggle all selectable rows.',
          required: false,
        },
        {
          name: 'checkboxRef',
          type: 'React.Ref<HTMLInputElement>',
          description: 'Ref to the select-all checkbox input.',
          required: false,
        },
        {
          name: 'aria-label',
          type: 'string',
          description: 'Accessible name of the checkbox.',
          required: false,
          defaultValue: "'Select rows'",
        },
        {
          name: 'aria-description',
          type: 'string',
          description: 'Accessible description of the checkbox.',
          required: false,
        },
      ],
    },
    {
      name: 'Table.RowSelection',
      displayName: 'Table.RowSelection',
      props: [
        {name: 'selected', type: 'boolean', description: 'Whether the row is selected.', required: true},
        {name: 'disabled', type: 'boolean', description: 'Disables selection of the row.', required: false},
        {
          name: 'onToggleSelect',
          type: '() => void',
          description: 'Handles requests to toggle selection of the row.',
          required: false,
        },
        {
          name: 'checkboxRef',
          type: 'React.Ref<HTMLInputElement>',
          description: 'Ref to the row checkbox input.',
          required: false,
        },
        {
          name: 'aria-label',
          type: 'string',
          description: 'Accessible name of the checkbox when `aria-labelledby` is not supplied.',
          required: false,
          defaultValue: "'Select row'",
        },
        {
          name: 'aria-labelledby',
          type: 'string',
          description: 'References labels for the checkbox. The selection action is prepended to those labels.',
          required: false,
        },
        {
          name: 'headers',
          type: 'string',
          description: 'Space-separated header IDs for the cell, in addition to the group header when present.',
          required: false,
        },
      ],
    },
    {
      name: 'Table.Cell',
      displayName: 'Table.Cell',
      props: [
        {
          name: 'align',
          type: "'end' | 'start'",
          description: 'Horizontal alignment of the cell contents.',
          required: false,
        },
        {name: 'children', type: 'React.ReactNode', description: 'Content of the cell.', required: false},
        {
          name: 'scope',
          type: "'row'",
          description: 'Renders the cell as a row header when set to `row`.',
          required: false,
        },
        {
          name: 'headers',
          type: 'string',
          description: 'Space-separated header IDs for the cell, in addition to the group header when present.',
          required: false,
        },
      ],
    },
    {
      name: 'Table.CellPlaceholder',
      displayName: 'Table.CellPlaceholder',
      props: [
        {
          name: 'children',
          type: 'React.ReactNode',
          description: 'Placeholder content inside the cell.',
          required: false,
        },
      ],
    },
    {
      name: 'Table.Container',
      displayName: 'Table.Container',
      props: [
        {name: 'children', type: 'React.ReactNode', description: 'Table and surrounding content.', required: false},
        {
          name: 'as',
          type: 'React.ElementType',
          description: 'Element or component that wraps the content.',
          required: false,
          defaultValue: "'div'",
        },
      ],
    },
    {name: 'Table.Divider', displayName: 'Table.Divider', props: []},
    {
      name: 'Table.Title',
      displayName: 'Table.Title',
      props: [
        {name: 'children', type: 'React.ReactNode', description: 'Title text.', required: false},
        {
          name: 'id',
          type: 'string',
          description: 'Unique ID to reference from the table’s `aria-labelledby`.',
          required: true,
        },
        {
          name: 'as',
          type: 'keyof JSX.IntrinsicElements | React.ComponentType',
          description: 'Element or component that renders the title.',
          required: false,
          defaultValue: "'h2'",
        },
      ],
    },
    {
      name: 'Table.Subtitle',
      displayName: 'Table.Subtitle',
      props: [
        {name: 'children', type: 'React.ReactNode', description: 'Supplemental text about the table.', required: false},
        {
          name: 'id',
          type: 'string',
          description: 'Unique ID to reference from the table’s `aria-describedby`.',
          required: true,
        },
        {
          name: 'as',
          type: 'keyof JSX.IntrinsicElements | React.ComponentType',
          description: 'Element or component that renders the subtitle.',
          required: false,
          defaultValue: "'div'",
        },
      ],
    },
    {
      name: 'Table.Skeleton',
      displayName: 'Table.Skeleton',
      props: [
        {
          name: 'cellPadding',
          type: "'condensed' | 'normal' | 'spacious'",
          description: 'Amount of space around the contents of a cell.',
          required: false,
          defaultValue: "'normal'",
        },
        {
          name: 'columns',
          type: 'Array<Column<Data>>',
          description: 'Column definitions for the visible headers and placeholder layout.',
          required: true,
        },
        {name: 'rows', type: 'number', description: 'Number of placeholder rows.', required: false, defaultValue: '10'},
      ],
    },
    {
      name: 'Table.Pagination',
      displayName: 'Table.Pagination',
      props: [
        {
          name: 'aria-label',
          type: 'string',
          description: 'Accessible name of the pagination navigation landmark.',
          required: true,
        },
        {
          name: 'defaultPageIndex',
          type: 'number',
          description: 'Zero-based index of the initially selected page.',
          required: false,
          defaultValue: '0',
        },
        {name: 'id', type: 'string', description: 'ID of the pagination navigation landmark.', required: false},
        {
          name: 'onChange',
          type: '(state: {pageIndex: number}) => void',
          description: 'Reports the zero-based selected page index when it changes.',
          required: false,
        },
        {
          name: 'pageSize',
          type: 'number',
          description: 'Number of items per page.',
          required: false,
          defaultValue: '25',
        },
        {name: 'totalCount', type: 'number', description: 'Total number of items across all pages.', required: true},
        {
          name: 'showPages',
          type: 'boolean | {narrow?: boolean; regular?: boolean; wide?: boolean}',
          description: 'Controls visibility of page numbers, optionally per viewport.',
          required: false,
          defaultValue: '{narrow: false}',
        },
      ],
    },
    {
      name: 'Table.ErrorDialog',
      displayName: 'Table.ErrorDialog',
      props: [
        {name: 'children', type: 'React.ReactNode', description: 'Content that explains the error.', required: false},
        {
          name: 'title',
          type: 'string',
          description: 'Title of the error dialog.',
          required: false,
          defaultValue: "'Error'",
        },
        {name: 'onRetry', type: '() => void', description: 'Called when the user confirms a retry.', required: false},
        {
          name: 'onDismiss',
          type: '() => void',
          description: 'Called when the user dismisses the dialog.',
          required: false,
        },
      ],
    },
    {
      name: 'Column options',
      displayName: 'Column options',
      props: [
        {
          name: 'align',
          type: "'start' | 'end'",
          description: 'Horizontal alignment of the column contents.',
          required: false,
        },
        {
          name: 'field',
          type: 'ObjectPaths<Data>',
          description: 'Data key or dot-separated path for the cell value. Required if `id` is omitted.',
          required: false,
        },
        {
          name: 'header',
          type: 'string | (() => React.ReactNode)',
          description: 'Column heading text or a function that renders the heading.',
          required: true,
        },
        {
          name: 'maxWidth',
          type: "React.CSSProperties['maxWidth']",
          description: 'Maximum width when using a width preset.',
          required: false,
        },
        {
          name: 'minWidth',
          type: "React.CSSProperties['minWidth']",
          description: 'Minimum width when using a width preset.',
          required: false,
        },
        {
          name: 'renderCell',
          type: '(data: Data) => React.ReactNode',
          description: 'Renders custom cell content from the row data.',
          required: false,
        },
        {
          name: 'rowHeader',
          type: 'boolean',
          description: 'Treats cells in this column as row headers.',
          required: false,
          defaultValue: 'false',
        },
        {
          name: 'sortBy',
          type: "boolean | 'alphanumeric' | 'basic' | 'datetime' | ((a: Data, b: Data) => number)",
          description: 'Enables sorting using the default comparison, a named strategy, or a custom comparator.',
          required: false,
          defaultValue: 'false',
        },
        {
          name: 'width',
          type: "'grow' | 'growCollapse' | 'auto' | React.CSSProperties['width']",
          description:
            'Controls column sizing. Use `grow` to fill space, `growCollapse` to also shrink below the content width, `auto` to size to content, or a fixed CSS width.',
          required: false,
          defaultValue: "'grow'",
        },
        {name: 'id', type: 'string', description: 'Stable column ID. Required if `field` is omitted.', required: false},
      ],
    },
  ],
  usage: {
    // Source: https://primer.style/product/components/data-table/
    description: 'Present comparable details about a collection, with one item per row and one attribute per column.',
    bestPractices: [
      {
        // Source: https://primer.style/product/components/data-table/guidelines/#usage
        guidance: true,
        description: 'Use a data table when people need to scan many items or compare the same details across items.',
      },
      {
        // Source: https://primer.style/product/components/data-table/guidelines/#usage
        guidance: false,
        description:
          'Do not use a data table just to lay out content or when the main task is editing cells like a spreadsheet.',
      },
      {
        // Source: https://primer.style/product/components/data-table/guidelines/#best-practices
        guidance: true,
        description:
          'Start with an order that makes sense for the data, and use short column labels and concise cell content.',
      },
      {
        // Source: https://primer.style/product/components/data-table/guidelines/#best-practices
        guidance: true,
        description: 'Right-align numeric values to make comparisons easier, and use tabular numbers when possible.',
      },
      {
        // Source: https://primer.style/product/components/data-table/guidelines/#best-practices
        guidance: false,
        description:
          'Do not put several unrelated values in one column. The header should identify the specific value shown.',
      },
      {
        // Source: https://primer.style/product/components/data-table/guidelines/#best-practices
        guidance: true,
        description: 'Use loading placeholders that match the expected size and alignment of the real content.',
      },
    ],
    anatomy: [
      {
        // Source: https://primer.style/product/components/data-table/guidelines/#anatomy
        name: 'Table header',
        required: false,
        description: 'Provides context and whole-table controls, such as a title, subtitle, actions, or filter.',
      },
      {
        // Source: https://primer.style/product/components/data-table/guidelines/#anatomy
        name: 'Column headers',
        required: true,
        description: 'Identify the data in each column and offer sorting where applicable.',
      },
      {
        // Source: https://primer.style/product/components/data-table/guidelines/#anatomy
        name: 'Row headers',
        required: false,
        description: 'Identify the item represented by a row, usually in its first cell.',
      },
      {
        // Source: https://primer.style/product/components/data-table/guidelines/#anatomy
        name: 'Row actions',
        required: false,
        description: 'Provide controls that act on the item in one row.',
      },
      {
        // Source: https://primer.style/product/components/data-table/guidelines/#anatomy
        name: 'Data cells',
        required: true,
        description: 'Show values associated with a column header and, if present, a row header.',
      },
      {
        // Source: https://primer.style/product/components/data-table/guidelines/#anatomy
        name: 'Pagination footer',
        required: false,
        description: 'Shows the visible range and lets users move between pages of rows.',
      },
    ],
  },
})
