import {IconProps} from '@primer/octicons-react'
import React from 'react'
import {VariantType} from '../Button/types'
import {ResponsiveValue} from '../hooks/useResponsiveValue'
import {useSSRSafeId} from '../utils/ssr'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// TABLE
// I can't get this to work with regular React children because of the generic type.
// A component is a function, so in order for the type of the generic to be picked up and understood by other props, it needs to be passed as a prop.
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
type TableProps<A, B = string, C extends B = B> = {
  /**
   * The ID of the heading used for the table title. Does not need to be provided if using the default table title.
   */
  ariaLabelledBy?: string

  /**
   * The ID of the subtitle that describes more context about the table not covered by the title. Does not need to be provided if using the default table subtitle.
   */
  ariaDescribedBy?: string

  /**
   * The columns that render the table data or controls to interact with the table data
   */
  columns: Array<ColumnProps<A, B>> // MAIN PROBLEM: This needs to be actual children (`Column`, `ActionsColumn`, or `CheckboxColumn`), not just an array of objects
  // Array<ColumnProps<A, B> | ActionsColumnProps<A> | CheckboxColumnProps<A>>

  /**
   * How much space is around the content in each cell
   */
  cellPadding?: 'condensed' | 'normal' | 'spacious'

  /**
   * An array of data for each row
   */
  data: A[]

  /**
   * Which column is sorted and in which direction when the table is first rendered
   */
  initialSort?: {
    by: C
    order: 'asc' | 'desc'
  }

  /**
   * Whether the table data is still being loaded.
   */
  loading?: boolean

  /**
   * How many rows appear on each page. If not defined, no pagination will be rendered.
   */
  rowsPerPage?: number
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// COLUMNS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
type ColumnProps<A, B = string> = {
  /**
   * The horizontal alignment of the content in the column
   */
  align?: 'left' | 'right'

  /**
   * Defines how each cell in the column will be rendered
   */
  renderCell?: (data: A) => React.ReactNode

  /**
   * A custom sort function that may be passed if the column is going to be sorted by something other than what is defined in the `sortType` prop.
   * For example, sorting by the severity of a security alert.
   */
  customSortFn?: (dir: 'asc' | 'desc', a: A, b: A) => number

  /**
   * Whether sorting should be disabled for this column
   */
  disableSort?: boolean

  /**
   * The key of the field that has the data represented in this column.
   */
  field: B

  /**
   * The label that represents the data in the column
   */
  header?: React.ReactNode // should we limit this to `string | React.FC<React.PropsWithChildren<ColumnHeaderProps>>`?

  /**
   * Whether the column should be hidden. Useful for removing less important columns on narrow viewports.
   */
  hide?: ResponsiveValue<boolean>

  /**
   * Whether the cells in the column are used as the header for their rows.
   */
  isRowHeader?: boolean

  /**
   * Number of lines of text to show before truncating. If undefined, the text will wrap.
   */
  lineClamp?: number

  /**
   * The maximum width the column can grow to
   */
  maxWidth?: ResponsiveValue<React.CSSProperties['maxWidth']>

  /**
   * The minimum width the column can shrink to
   */
  minWidth?: ResponsiveValue<React.CSSProperties['minWidth']>

  /**
   * The kind of data rendered in the column
   */
  sortType?: 'string' | 'number' | 'date' | 'boolean'

  /**
   * How the column's width behaves. (will add more info about the options in the actual component docs)
   */
  width?: ResponsiveValue<'grow' | 'shrink' | 'auto' | React.CSSProperties['width']>
}

type ActionsColumnProps<A> = {
  /**
   * The cell that renders up to 2 actions, a menu, or an action and a menu.
   */
  renderCell: (data: A) => React.ReactNode // should be something like (data: A) => React.FC<React.PropsWithChildren<DataTable.RowActionsCellProps>>

  /**
   * Used for creating more accessible screen reader content. By default, the row header will be used. When `itemLabel` is specified, it is used in place of the row header.
   * For example: A button visually labeled as "Download" will be read on screen readers as "Download {itemLabel}"
   */
  itemLabel?: string
}

type CheckboxColumnProps<A> = {
  /**
   * The cell that renders each row's checkbox
   */
  renderCell?: (data: A) => React.ReactNode // should be something like (data: A) => React.FC<React.PropsWithChildren<DataTable.RowCheckboxCellProps>>

  /**
   * An onChange handler that gets called when any of the checkboxes change
   */
  onChange: (selected: string[], e?: React.ChangeEvent<HTMLInputElement>) => void

  /**
   * A function that returns a unique ID that can be used to reference each row
   *
   * We might not need this because we can set the ID internally.
   * OR
   * We could require a `toId` prop on the parent `DataTable` component that gives each row its own ID regardless of whether rows are selectable or not.
   */
  // toId: (data: A) => string
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CELLS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
type CellProps = {
  /**
   * What the screenreader should announce for this cell. This is used to override the default behavior of reading the child content.
   */
  ariaLabel?: string

  /**
   * The cell content
   */
  children: React.ReactNode

  /**
   * The color of the text and SVGs in the cell
   */
  color?: string // Specific @primer/primitives foreground color name strings TBD

  /**
   * Whether the cell content is loading.
   */
  loading?: boolean
}

type ColumnHeaderCellProps = {
  /**
   * The label that represents the data in the column. Usually just a string, but can also render a leading visual.
   */
  children?: React.ReactNode

  /**
   * Number of lines of text to show before truncating. Overrides the `lineClamp` behavior defined in the parent Column.
   */
  lineClamp?: number
}

type RowActionsCellProps = {
  /**
   * A cell that only renders row actions
   */
  children: React.ReactNode // should actually be something like React.FC<React.PropsWithChildren<DataTable.RowActionProps | DataTable.RowMenuProps>>
}

type RowCheckboxCellProps = {
  /**
   * The visually hidden text label used by assistive technologies to identify the checkbox.
   * This should only be used if the row doesn't have a row header or if you want to label the checkbox with a string other than the row header.
   */
  label?: string
} & React.InputHTMLAttributes<HTMLInputElement>

/////////////////////////////////////////////////////////////
// CELL CHILDREN
/////////////////////////////////////////////////////////////
type CellLeadingVisualProps = {
  children?: React.ReactNode
}

type RowActionProps = {
  /**
   * The underlying element to render — either a HTML element name or a React component.
   */
  as?: React.ElementType

  /**
   * Text label for the button
   */
  children: React.ReactNode

  /**
   * Icon to render in the button. Is rendered as IconButton if no text label is passed to children.
   */
  icon?: React.FC<React.PropsWithChildren<IconProps>>

  /**
   * Which button variant to render the action
   */
  variant?: VariantType
}

/////////////////////////////////////////////////////////////
// IMPLEMENTATION
/////////////////////////////////////////////////////////////

export const Cell = ({children}: CellProps) => <td>{children}</td>
export const HeaderCell = ({children}: ColumnHeaderCellProps) => <th>{children}</th>

type RowProps<Data> = {
  columns: Array<ColumnProps<Data>>
  el: Data
}

function Row<Entry>({columns, el}: RowProps<Entry>) {
  const rowId = useSSRSafeId()

  return (
    <tr key={`row-${rowId}`}>
      {columns.map(({field, renderCell}) => (
        <React.Fragment key={`${rowId}${field}`}>
          {renderCell ? renderCell(el) : <Cell>{el[field]}</Cell>}
        </React.Fragment>
      ))}
    </tr>
  )
}

type HeaderRowProps<Data> = {
  columns: Array<ColumnProps<Data>>
}

function HeaderRow<Entry>({columns}: HeaderRowProps<Entry>) {
  return (
    <thead>
      {columns.map(({field, header}) =>
        typeof header === 'string' || typeof header === 'undefined' ? (
          <HeaderCell key={`colHeader-${field}`}>{header || field}</HeaderCell>
        ) : (
          header
        ),
      )}
    </thead>
  )
}

export function DataTable<Entry, Fields extends string, Sort extends Fields>({
  data,
  columns,
}: {
  data: readonly Entry[]
} & TableProps<Entry, Fields, Sort>) {
  return (
    <table>
      <HeaderRow columns={columns} />

      <tbody>
        {data.map((el: Entry, i: number) => (
          <Row key={`row-${i}`} columns={columns} el={el} />
        ))}
      </tbody>
    </table>
  )
}
