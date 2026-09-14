export interface UniqueRow {
  id: string | number
}

export interface DataTableRowGroup<Data extends UniqueRow> {
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

/**
 * Items with both `groupId` and an array-valued `rows` are treated as groups.
 * This combination is reserved and must not be used for standalone row data.
 */
export type DataTableData<Data extends UniqueRow> = Array<Data | DataTableRowGroup<Data>>
