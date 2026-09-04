import type {Column} from './column'
import {DataTable, type DataTableProps} from './DataTable'
import type {DataTableRowGroup} from './row'

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
