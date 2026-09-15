import {lazy} from 'react'
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

const LazyDataTable = lazy(async () => ({
  default: (await import('../experimental')).DataTable,
})) as typeof DataTable

export function shouldAcceptLazyDataTable() {
  const flat = <LazyDataTable data={[{id: 1, name: 'primer/react'}]} columns={columns} />
  const grouped = <LazyDataTable data={groups} columns={columns} />
  const mixed = <LazyDataTable data={[{id: 2, name: 'primer/css'}, ...groups]} columns={columns} />
  const explicit = <LazyDataTable<Repository> data={groups} columns={columns} />
  const props: DataTableProps<Repository> = {data: groups, columns}
  const spread = <LazyDataTable {...props} />
  return {flat, grouped, mixed, explicit, spread}
}

export function shouldInferLazyDataTableRows() {
  return (
    <LazyDataTable
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

export function shouldRejectInvalidLazyDataTableProps() {
  // @ts-expect-error Column fields must refer to row data, not group metadata.
  const invalidField = <LazyDataTable<Repository> data={groups} columns={[{header: 'Group', field: 'groupId'}]} />
  // @ts-expect-error Group members must have the required row fields.
  const invalidRow = <LazyDataTable<Repository> data={[{...groups[0], rows: [{id: 3}]}]} columns={columns} />
  // @ts-expect-error Nested groups are not supported.
  const nestedGroups = <LazyDataTable<Repository> data={[{...groups[0], rows: groups}]} columns={columns} />
  return {invalidField, invalidRow, nestedGroups}
}

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
  const item = table.bodies[0]
  if (item.type === 'row-group') {
    const name: string = item.rows[0].getValue().name
    // @ts-expect-error Group models are not member row models.
    item.getCells()
    return name
  }
  const name: string = item.rows[0].getValue().name
  // @ts-expect-error Ungrouped bodies do not have group labels.
  item.label
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

export function shouldAcceptRowSelectionProps() {
  const selectedRows: ReadonlySet<string | number> = new Set([1, 'repository'])

  return (
    <DataTable
      data={[{id: 1, name: 'primer/react'}]}
      columns={columns}
      rowSelection
      selectedRows={selectedRows}
      defaultSelectedRows={new Set([1])}
      isRowSelectable={row => row.name !== ''}
      onSelectionChange={({selectedRows: nextSelectedRows}) => {
        nextSelectedRows.add('repository')
      }}
    />
  )
}

export function shouldInferMixedSelectionCallbacks() {
  return (
    <DataTable
      data={[
        {id: 1, name: 'Standalone'},
        {groupId: 'public', label: 'Public', rows: [{id: 2, name: 'primer/react'}]},
      ]}
      columns={columns}
      rowSelection
      getRowId={row => {
        const id: number = row.id
        return id
      }}
      isRowSelectable={row => {
        const name: string = row.name
        // @ts-expect-error Selection predicates receive member rows, not group metadata.
        row.groupId
        return name !== ''
      }}
      onSelectionChange={({selectedRows}) => {
        const ids: Set<string | number> = selectedRows
        return ids
      }}
    />
  )
}

export function shouldInferLazyFlatSelectionCallbacks() {
  return (
    <LazyDataTable
      data={[{id: 1, name: 'primer/react'}]}
      columns={[{header: 'Name', field: 'name', renderCell: row => row.name.toUpperCase()}]}
      rowSelection
      selectedRows={new Set<string | number>([1, 'repository'])}
      getRowId={row => {
        const id: number = row.id
        return id
      }}
      isRowSelectable={row => {
        // @ts-expect-error Selection predicates must retain the inferred row type.
        row.missing
        return row.name !== ''
      }}
      onSelectionChange={({selectedRows}) => {
        const ids: Set<string | number> = selectedRows
        // @ts-expect-error Selected IDs cannot contain objects.
        selectedRows.add({id: 1})
        return ids
      }}
    />
  )
}

export function shouldInferLazyGroupedSelectionCallbacks() {
  return (
    <LazyDataTable
      data={[{groupId: 'public', label: 'Public', rows: [{id: 1, name: 'primer/react'}]}]}
      columns={[{header: 'Name', field: 'name', renderCell: row => row.name.toUpperCase()}]}
      rowSelection
      defaultSelectedRows={new Set([1])}
      getRowId={row => {
        const id: number = row.id
        return id
      }}
      isRowSelectable={row => {
        // @ts-expect-error Selection predicates receive rows, not group metadata.
        row.groupId
        return row.name !== ''
      }}
      onSelectionChange={({selectedRows}) => {
        const ids: Set<string | number> = selectedRows
        // @ts-expect-error Selected IDs cannot contain booleans.
        selectedRows.add(true)
        return ids
      }}
    />
  )
}

export function shouldInferLazyMixedSelectionCallbacks() {
  return (
    <LazyDataTable
      data={[
        {id: 1, name: 'Standalone'},
        {groupId: 'public', label: 'Public', rows: [{id: 2, name: 'primer/react'}]},
      ]}
      columns={[{header: 'Name', field: 'name', renderCell: row => row.name.toUpperCase()}]}
      rowSelection
      selectedRows={new Set([1])}
      getRowId={row => {
        const id: number = row.id
        return id
      }}
      isRowSelectable={row => {
        // @ts-expect-error Selection predicates receive rows, not group metadata.
        row.rows
        return row.name !== ''
      }}
      onSelectionChange={({selectedRows}) => {
        const ids: Set<string | number> = selectedRows
        // @ts-expect-error The callback provides a Set, not an array.
        selectedRows.push(1)
        return ids
      }}
    />
  )
}

export function shouldAcceptLazySelectionProps() {
  const selectedRows: ReadonlySet<string | number> = new Set([1])
  const props: DataTableProps<Repository> = {
    data: groups,
    columns,
    rowSelection: true,
    selectedRows,
    isRowSelectable: row => row.name !== '',
    onSelectionChange: ({selectedRows: next}) => {
      const ids: Set<string | number> = next
      return ids
    },
  }
  const explicit = <LazyDataTable<Repository> {...props} />
  const spread = <LazyDataTable {...props} />
  return {explicit, spread}
}

export function shouldRejectInvalidLazySelectionProps() {
  // @ts-expect-error Selection values must be sets of string or number IDs.
  const invalidSelectedRows = <LazyDataTable<Repository> data={groups} columns={columns} selectedRows={[1]} />
  const invalidDefault = (
    // @ts-expect-error Default selection cannot contain boolean IDs.
    <LazyDataTable<Repository> data={groups} columns={columns} defaultSelectedRows={new Set([true])} />
  )
  const invalidCallback = (
    // @ts-expect-error The callback receives an object containing a Set, not an array.
    <LazyDataTable<Repository> data={groups} columns={columns} onSelectionChange={(_rows: number[]) => {}} />
  )
  const invalidPredicate = (
    <LazyDataTable<Repository>
      data={groups}
      columns={columns}
      // @ts-expect-error Selection predicates receive member rows, not groups.
      isRowSelectable={(_group: DataTableRowGroup<Repository>) => true}
    />
  )
  return {invalidSelectedRows, invalidDefault, invalidCallback, invalidPredicate}
}
