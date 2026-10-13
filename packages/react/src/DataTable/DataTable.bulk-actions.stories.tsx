import type {Meta, StoryObj} from '@storybook/react-vite'
import {useId, useRef, useState} from 'react'
import {expect, userEvent} from 'storybook/test'
import {Button} from '../Button'
import {AriaAlert, AriaStatus} from '../live-region'
import {DataTable, Table, type DataTableData, type DataTableRowId} from '.'
import type {Column} from './column'

export default {
  title: 'Experimental/Components/DataTable/Features/Bulk actions',
} satisfies Meta

interface Repository {
  id: number
  name: string
  visibility: string
}

const repositories: Array<Repository> = [
  {id: 1, name: 'primer/react', visibility: 'Public'},
  {id: 2, name: 'primer/css', visibility: 'Public'},
  {id: 3, name: 'github/github', visibility: 'Internal'},
]
const columns: Array<Column<Repository>> = [
  {header: 'Repository', field: 'name', rowHeader: true, sortBy: 'alphanumeric'},
  {header: 'Visibility', field: 'visibility'},
]

function BulkActionsExample({
  mode,
  asyncActions = false,
}: {
  mode: 'flat' | 'grouped' | 'mixed'
  asyncActions?: boolean
}) {
  const titleId = useId()
  const [rows, setRows] = useState(repositories)
  const [selectedRows, setSelectedRows] = useState<ReadonlySet<DataTableRowId>>(() => new Set([1]))
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const addButtonRef = useRef<HTMLButtonElement>(null)
  const publicRows = rows.filter(row => row.visibility === 'Public')
  const internalRows = rows.filter(row => row.visibility === 'Internal')
  const data: DataTableData<Repository> =
    mode === 'flat'
      ? rows
      : mode === 'grouped'
        ? [
            {groupId: 'public', label: 'Public', rows: publicRows},
            {groupId: 'internal', label: 'Internal', rows: internalRows},
          ]
        : [...internalRows, {groupId: 'public', label: 'Public', rows: publicRows}]

  return (
    <Table.Container>
      <Table.Title id={titleId}>Repositories</Table.Title>
      <Table.Actions>
        <Button
          ref={addButtonRef}
          onClick={() => {
            setRows(repositories)
            setSelectedRows(new Set())
            setError('')
            setMessage('')
          }}
        >
          Reset repositories
        </Button>
      </Table.Actions>
      <DataTable
        aria-labelledby={titleId}
        data={data}
        columns={columns}
        rowSelection
        selectedRows={selectedRows}
        onSelectionChange={({selectedRows: next}) => setSelectedRows(next)}
        bulkActionsReturnFocusRef={rows.length === 0 ? addButtonRef : undefined}
        renderBulkActions={({selectedRows: effectiveIds, selectedCount, clearSelection}) => (
          <>
            {asyncActions ? (
              <Button
                disabled={pending}
                onClick={async () => {
                  setPending(true)
                  setError('')
                  await new Promise(resolve => setTimeout(resolve, 500))
                  setPending(false)
                  setError('Unable to delete repositories. Your selection is unchanged; try again.')
                }}
              >
                Simulate failed action
              </Button>
            ) : null}
            <Button
              variant="danger"
              disabled={pending}
              onClick={async () => {
                setError('')
                if (asyncActions) {
                  setPending(true)
                  await new Promise(resolve => setTimeout(resolve, 500))
                  setPending(false)
                }
                setRows(current => current.filter(row => !effectiveIds.has(row.id)))
                if (asyncActions) {
                  setSelectedRows(current => new Set([...current].filter(id => !effectiveIds.has(id))))
                } else {
                  clearSelection()
                }
                setMessage(`${selectedCount} ${selectedCount === 1 ? 'repository' : 'repositories'} deleted`)
              }}
            >
              Delete selected
            </Button>
          </>
        )}
      />
      <AriaAlert>{error}</AriaAlert>
      <AriaStatus>{message}</AriaStatus>
    </Table.Container>
  )
}

export const Flat: StoryObj = {
  render: () => <BulkActionsExample mode="flat" />,
  play: async ({canvas}) => {
    await userEvent.click(canvas.getByRole('button', {name: 'Repository'}))
    await expect(canvas.getByRole('columnheader', {name: 'Repository'})).toHaveAttribute('aria-sort', 'ascending')
    await expect(canvas.getByText('1 row selected')).toBeVisible()
  },
}

export const Grouped: StoryObj = {
  render: () => <BulkActionsExample mode="grouped" />,
}

export const Mixed: StoryObj = {
  render: () => <BulkActionsExample mode="mixed" />,
}

export const AsyncActions: StoryObj = {
  render: () => <BulkActionsExample mode="mixed" asyncActions />,
  play: async ({canvas}) => {
    await userEvent.click(canvas.getByRole('button', {name: 'Repository'}))
    await expect(canvas.getByRole('columnheader', {name: 'Repository'})).toHaveAttribute('aria-sort', 'ascending')
    await expect(canvas.getByRole('checkbox', {name: 'Select primer/react'})).toBeChecked()
    await expect(canvas.getByRole('button', {name: 'Delete selected'})).toBeEnabled()
  },
}

export const ComposedTable: StoryObj = {
  render: function ComposedTable() {
    const titleId = useId()
    const checkboxRef = useRef<HTMLInputElement>(null)
    const [selectedRows, setSelectedRows] = useState<ReadonlySet<DataTableRowId>>(() => new Set([1]))
    const effectiveRows = repositories.filter(row => selectedRows.has(row.id))
    const allSelected = effectiveRows.length === repositories.length
    return (
      <Table.Container>
        <Table.Title id={titleId}>Composed repositories</Table.Title>
        <Table.BulkActions
          selectedCount={effectiveRows.length}
          onClearSelection={() => setSelectedRows(new Set())}
          onFocusReturn={() => checkboxRef.current?.focus()}
        >
          <Button onClick={() => setSelectedRows(new Set())}>Apply to selected</Button>
        </Table.BulkActions>
        <Table aria-labelledby={titleId} gridTemplateColumns="min-content minmax(0, 1fr)">
          <Table.Head>
            <Table.Row>
              <Table.SelectionHeader
                checkboxRef={checkboxRef}
                selection={allSelected ? 'all' : effectiveRows.length > 0 ? 'some' : 'none'}
                onToggleSelect={() =>
                  setSelectedRows(allSelected ? new Set() : new Set(repositories.map(row => row.id)))
                }
              />
              <Table.Header>Repository</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {repositories.map(row => (
              <Table.Row key={row.id}>
                <Table.RowSelection
                  selected={selectedRows.has(row.id)}
                  aria-label={`Select ${row.name}`}
                  onToggleSelect={() =>
                    setSelectedRows(current => {
                      const next = new Set(current)
                      if (next.has(row.id)) {
                        next.delete(row.id)
                      } else {
                        next.add(row.id)
                      }
                      return next
                    })
                  }
                />
                <Table.Cell scope="row">{row.name}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </Table.Container>
    )
  },
}
