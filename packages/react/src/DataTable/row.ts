export interface UniqueRow {
  id: string | number
}

export interface DataTableRowGroup<Data extends UniqueRow> {
  /**
   * Identify this item as a group of rows.
   */
  type: 'row-group'

  /**
   * Provide a stable identifier for the group.
   */
  groupId: string | number

  /**
   * Provide a visible label for the group.
   */
  label: string

  /**
   * Provide the rows that belong to the group.
   */
  rows: Array<Data>

  /**
   * Provide an accessible name for the group header.
   */
  'aria-label'?: string
}

export type DataTableData<Data extends UniqueRow> = Array<Data> | Array<DataTableRowGroup<Data>>
