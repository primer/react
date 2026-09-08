import type {Column} from './column'
import {DataTable, type DataTableProps} from './DataTable'
import type {DataTableRowGroup} from './row'
import {useTable} from './useTable'

interface Repository {
  id: number
  name: string
}

const columns: Array<Column<Repository>> = [
  {
    header: 'Repository',
    field: 'name',
  },
]

const groups: Array<DataTableRowGroup<Repository>> = [
  {
    type: 'row-group',
    groupId: 'public',
    label: 'Public',
    rows: [{id: 1, name: 'primer/react'}],
  },
]

export function shouldAcceptGroupedDataTableProps() {
  const props: DataTableProps<Repository> = {
    columns,
    data: groups,
  }

  return <DataTable {...props} />
}

export function shouldAcceptExplicitRowType() {
  return <DataTable<Repository> data={groups} columns={columns} />
}

export function shouldInferRowTypeFromInlineGroups() {
  return (
    <DataTable
      data={[
        {
          type: 'row-group',
          groupId: 'public',
          label: 'Public',
          rows: [{id: 1, name: 'primer/react'}],
        },
      ]}
      columns={[
        {
          header: 'Repository',
          field: 'name',
        },
      ]}
    />
  )
}

export function shouldRejectMixedData() {
  const mixed = [{id: 2, name: 'primer/css'}, ...groups]
  const props: DataTableProps<Repository> = {
    columns,
    // @ts-expect-error Rows and groups cannot be mixed in a single array.
    data: mixed,
  }
  // @ts-expect-error Explicit row generics must reject mixed arrays.
  const explicit = <DataTable<Repository> data={mixed} columns={columns} />
  // @ts-expect-error Inferred row generics must also reject mixed arrays.
  const inferred = <DataTable data={mixed} columns={columns} />
  return {props, explicit, inferred}
}

export function useTableModelTypeChecks() {
  // @ts-expect-error The hook also rejects arrays mixing rows and groups.
  useTable({data: [{id: 2, name: 'primer/css'}, ...groups], columns, getRowId: row => row.id})
  const table = useTable({data: groups, columns, getRowId: row => row.id})
  if (table.isGrouped) {
    const name: string = table.rows[0].rows[0].getValue().name
    // @ts-expect-error Group models are not member row models.
    table.rows[0].getCells()
    return name
  }
  const name: string = table.rows[0].getValue().name
  // @ts-expect-error Flat row models do not contain member rows.
  table.rows[0].rows
  return name
}
