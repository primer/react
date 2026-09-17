import type {Meta} from '@storybook/react-vite'
import {useId, useState} from 'react'
import {Table, type DataTableRowId} from '../DataTable'

export default {
  title: 'Experimental/Components/Table/Features',
  component: Table,
} satisfies Meta<typeof Table>

const groups = [
  {
    id: 'internal',
    label: 'Internal',
    rows: [{id: 1, name: 'github/github', visibility: 'internal'}],
  },
  {
    id: 'public',
    label: 'Public',
    rows: [
      {id: 2, name: 'primer/react', visibility: 'public'},
      {id: 3, name: 'primer/css', visibility: 'public'},
    ],
  },
]

export const WithGroups = () => {
  const id = useId()
  const titleId = `${id}-title`
  const nameColumnId = `${id}-name`
  const visibilityColumnId = `${id}-visibility`

  return (
    <Table.Container>
      <Table.Title as="h2" id={titleId}>
        Repositories by visibility
      </Table.Title>
      <Table aria-labelledby={titleId} gridTemplateColumns="minmax(0, 1fr) auto">
        <Table.Head>
          <Table.Row>
            <Table.Header id={nameColumnId}>Name</Table.Header>
            <Table.Header id={visibilityColumnId}>Visibility</Table.Header>
          </Table.Row>
        </Table.Head>
        {groups.map(group => (
          <Table.Group key={group.id} id={group.id} label={group.label} rowCount={group.rows.length} colSpan={2}>
            {group.rows.map(repo => {
              const rowHeaderId = `${id}-row-${repo.id}`

              return (
                <Table.Row key={repo.id}>
                  <Table.Cell id={rowHeaderId} scope="row" headers={nameColumnId}>
                    {repo.name}
                  </Table.Cell>
                  <Table.Cell headers={`${rowHeaderId} ${visibilityColumnId}`}>{repo.visibility}</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Group>
        ))}
      </Table>
    </Table.Container>
  )
}

export const WithRowSelection = () => {
  const id = useId()
  const titleId = `${id}-title`
  const selectionColumnId = `${id}-selection`
  const nameColumnId = `${id}-name`
  const visibilityColumnId = `${id}-visibility`
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<DataTableRowId>>(() => new Set([2]))
  const selectableRows = groups.flatMap(group => group.rows).filter(row => row.id !== 1)
  const selectedCount = selectableRows.filter(row => selectedRows.has(row.id)).length
  const allSelected = selectableRows.length > 0 && selectedCount === selectableRows.length

  return (
    <Table.Container>
      <Table.Title as="h2" id={titleId}>
        Selectable repositories using Table
      </Table.Title>
      <Table aria-labelledby={titleId} gridTemplateColumns="min-content minmax(0, 1fr) auto">
        <Table.Head>
          <Table.Row>
            <Table.SelectionHeader
              id={selectionColumnId}
              selection={allSelected ? 'all' : selectedCount > 0 ? 'some' : 'none'}
              disabled={selectableRows.length === 0}
              aria-label="Select rows"
              aria-description={
                selectableRows.length > 0
                  ? `Select all ${selectableRows.length} ${selectableRows.length === 1 ? 'row' : 'rows'}`
                  : undefined
              }
              onToggleSelect={() => {
                setSelectedRows(allSelected ? new Set() : new Set(selectableRows.map(row => row.id)))
              }}
            />
            <Table.Header id={nameColumnId}>Name</Table.Header>
            <Table.Header id={visibilityColumnId}>Visibility</Table.Header>
          </Table.Row>
        </Table.Head>
        {groups.map(group => (
          <Table.Group key={group.id} id={group.id} label={group.label} rowCount={group.rows.length} colSpan={3}>
            {group.rows.map(repo => {
              const rowHeaderId = `${id}-row-${repo.id}`
              const selectable = repo.id !== 1

              return (
                <Table.Row key={repo.id}>
                  <Table.RowSelection
                    selected={selectable && selectedRows.has(repo.id)}
                    disabled={!selectable}
                    headers={selectionColumnId}
                    aria-labelledby={rowHeaderId}
                    onToggleSelect={() => {
                      setSelectedRows(previous => {
                        const next = new Set(previous)
                        if (next.has(repo.id)) {
                          next.delete(repo.id)
                        } else {
                          next.add(repo.id)
                        }
                        return next
                      })
                    }}
                  />
                  <Table.Cell id={rowHeaderId} scope="row" headers={nameColumnId}>
                    {repo.name}
                  </Table.Cell>
                  <Table.Cell headers={`${rowHeaderId} ${visibilityColumnId}`}>{repo.visibility}</Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Group>
        ))}
      </Table>
    </Table.Container>
  )
}
