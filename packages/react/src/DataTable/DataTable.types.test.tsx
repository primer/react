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

export function shouldAcceptMixedData() {
  const mixed = [{id: 2, name: 'primer/css'}, ...groups]
  const props: DataTableProps<Repository> = {
    columns,
    data: mixed,
  }
  const explicit = <DataTable<Repository> data={mixed} columns={columns} />
  const inferred = <DataTable data={mixed} columns={columns} />
  const spread = <DataTable {...props} />
  return {props, explicit, inferred, spread}
}

export function useTableModelTypeChecks() {
  useTable({data: [{id: 2, name: 'primer/css'}, ...groups], columns, getRowId: row => row.id})
  const table = useTable({data: groups, columns, getRowId: row => row.id})
  const item = table.rows[0]
  if (item.type === 'row-group') {
    const name: string = item.rows[0].getValue().name
    // @ts-expect-error Group models are not member row models.
    item.getCells()
    return name
  }
  const name: string = item.getValue().name
  // @ts-expect-error Flat row models do not contain member rows.
  item.rows
  return name
}

export function shouldInferInlineMixedData() {
  return (
    <DataTable
      data={[
        {id: 1, name: 'Standalone', owner: {login: 'primer'}},
        {
          groupId: 'public',
          label: 'Public',
          rows: [{id: 2, name: 'primer/react', owner: {login: 'primer'}}],
        },
      ]}
      columns={[
        {header: 'Name', field: 'name', renderCell: row => row.name.toUpperCase()},
        {header: 'Owner', field: 'owner.login', renderCell: row => row.owner.login},
      ]}
      getRowId={row => row.id}
    />
  )
}

export function shouldRejectInvalidData() {
  const invalidProps: DataTableProps<Repository> = {
    columns,
    // @ts-expect-error Group members must have the required row fields.
    data: [{...groups[0], rows: [{id: 3}]}],
  }
  const nestedGroups: DataTableProps<Repository> = {
    columns,
    // @ts-expect-error Nested groups are not supported.
    data: [{...groups[0], rows: groups}],
  }
  const invalidColumns: DataTableProps<Repository> = {
    data: [{id: 2, name: 'Standalone'}, ...groups],
    // @ts-expect-error Column fields must refer to row data, not group metadata.
    columns: [{header: 'Group', field: 'groupId'}],
  }
  return {invalidProps, nestedGroups, invalidColumns}
}

export function shouldPreserveBusinessTypeInference() {
  const data = [
    {id: 1, type: 'repository', name: 'Standalone'},
    {
      id: 'extra-group-id',
      type: 'business-group',
      groupId: 'public',
      label: 'Public',
      rows: [{id: 2, type: 'repository', name: 'primer/react'}],
    },
  ]
  return (
    <DataTable
      data={data}
      columns={[
        {header: 'Type', field: 'type', renderCell: row => row.type.toUpperCase()},
        {header: 'Name', field: 'name', renderCell: row => row.name.toUpperCase()},
      ]}
      getRowId={row => {
        const id: number = row.id
        return id
      }}
    />
  )
}
