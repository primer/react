/** Stable identity for a row, used to key rows and track selection. */
export type DataTableRowId = string | number

/** A row with a stable `id`. */
export type UniqueRow = {id: DataTableRowId}

/** A labelled group of rows rendered under its own header. */
export interface DataTableRowGroup<Data extends UniqueRow> {
  /** Stable identifier for the group, used to track its expanded state. */
  groupId: string | number
  /** Visible label for the group header. */
  label: string
  /** Rows that belong to the group. */
  rows: Data[]
  /** Accessible name for the group header, for when the visible label needs more context. */
  'aria-label'?: string
}

/**
 * Rows and row groups, in display order. Items with both `groupId` and an array-valued `rows` are treated as
 * groups, so that combination is reserved and must not be used for standalone row data.
 */
export type DataTableData<Data extends UniqueRow> = Array<Data | DataTableRowGroup<Data>>

export function isDataTableRowGroup<Data extends UniqueRow>(
  item: Data | DataTableRowGroup<Data>,
): item is DataTableRowGroup<Data> {
  return 'groupId' in item && 'rows' in item && Array.isArray(item.rows)
}
