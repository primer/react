import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {renderToString} from 'react-dom/server'
import {describe, expect, it} from 'vitest'
import {DataTable} from '../DataTable'
import type {Column} from '../column'
import type {DataTableRowGroup} from '../row'

interface Repository {
  id: number
  name: string
  visibility: string
}

const columns: Array<Column<Repository>> = [
  {
    header: 'Repository',
    field: 'name',
    rowHeader: true,
    sortBy: true,
  },
  {
    header: 'Visibility',
    field: 'visibility',
  },
]

const groups: Array<DataTableRowGroup<Repository>> = [
  {
    type: 'row-group',
    groupId: 'internal',
    label: 'Internal',
    rows: [
      {id: 1, name: 'zeta', visibility: 'internal'},
      {id: 2, name: 'alpha', visibility: 'internal'},
    ],
  },
  {
    type: 'row-group',
    groupId: 'public',
    label: 'Public',
    rows: [
      {id: 3, name: 'gamma', visibility: 'public'},
      {id: 4, name: 'beta', visibility: 'public'},
    ],
  },
]

describe('DataTable grouping', () => {
  it('renders config-driven groups through Table.Group', () => {
    const {container} = render(<DataTable data={groups} columns={columns} />)

    const table = screen.getByRole('table')
    const groupHeaders = screen
      .getAllByRole('columnheader')
      .filter(header => header.getAttribute('scope') === 'colgroup')
    const groupBodies = table.querySelectorAll(':scope > tbody[data-component="Table.Group.Body"]')

    expect(groupHeaders).toHaveLength(2)
    expect(groupBodies).toHaveLength(2)
    expect(groupHeaders[0]).toHaveAccessibleName('Internal, 2 rows')
    expect(groupHeaders[0]).toHaveAttribute('colspan', '2')
    expect(container.querySelector(':scope tbody[data-component="Table.Body"]')).not.toBeInTheDocument()
  })

  it('associates grouped row headers and cells with their group and column headers', () => {
    render(<DataTable data={groups} columns={columns} />)

    const columnHeaders = screen.getAllByRole('columnheader').filter(header => header.getAttribute('scope') === 'col')
    const groupHeader = screen.getByRole('columnheader', {name: 'Internal, 2 rows'})
    const rowHeader = screen.getByRole('rowheader', {name: 'zeta'})
    const cell = screen.getAllByRole('cell', {name: 'internal'})[0]

    expect(rowHeader).toHaveAttribute('headers', `${groupHeader.id} ${columnHeaders[0].id}`)
    expect(cell).toHaveAttribute('headers', `${groupHeader.id} ${rowHeader.id} ${columnHeaders[1].id}`)
  })

  it('renders empty groups and localized group names', () => {
    const data: Array<DataTableRowGroup<Repository>> = [
      {
        type: 'row-group',
        groupId: 'empty',
        label: 'Administrateurs',
        'aria-label': 'Administrateurs, aucune ligne',
        rows: [],
      },
    ]

    render(<DataTable data={data} columns={columns} />)

    expect(screen.getByRole('columnheader', {name: 'Administrateurs, aucune ligne'})).toHaveAttribute('colspan', '2')
    expect(screen.getAllByRole('row')).toHaveLength(2)
  })

  it('sorts rows within each group while preserving group order', async () => {
    const user = userEvent.setup()
    render(<DataTable data={groups} columns={columns} />)

    await user.click(screen.getByRole('button', {name: /Repository/}))

    const groupBodies = screen
      .getByRole('table')
      .querySelectorAll<HTMLTableSectionElement>(':scope > tbody[data-component="Table.Group.Body"]')
    expect(
      Array.from(groupBodies).map(body =>
        within(body)
          .getAllByRole('rowheader')
          .map(rowHeader => rowHeader.textContent),
      ),
    ).toEqual([
      ['alpha', 'zeta'],
      ['beta', 'gamma'],
    ])
    expect(
      screen
        .getAllByRole('columnheader', {name: /Internal|Public/})
        .map(header => header.closest('tbody')?.getAttribute('data-group-id')),
    ).toEqual(['internal', 'public'])
  })

  it('preserves grouped row order when sorting is external', async () => {
    const user = userEvent.setup()
    render(<DataTable data={groups} columns={columns} externalSorting />)

    await user.click(screen.getByRole('button', {name: /Repository/}))

    const groupBodies = screen
      .getByRole('table')
      .querySelectorAll<HTMLTableSectionElement>(':scope > tbody[data-component="Table.Group.Body"]')
    expect(
      Array.from(groupBodies).map(body =>
        within(body)
          .getAllByRole('rowheader')
          .map(rowHeader => rowHeader.textContent),
      ),
    ).toEqual([
      ['zeta', 'alpha'],
      ['gamma', 'beta'],
    ])
  })

  it('sorts replacement groups with the active sort state', async () => {
    const user = userEvent.setup()
    const {rerender} = render(<DataTable data={groups} columns={columns} />)
    await user.click(screen.getByRole('button', {name: /Repository/}))

    const replacementGroups: Array<DataTableRowGroup<Repository>> = [
      {
        type: 'row-group',
        groupId: 'private',
        label: 'Private',
        rows: [
          {id: 5, name: 'omega', visibility: 'private'},
          {id: 6, name: 'delta', visibility: 'private'},
        ],
      },
    ]
    rerender(<DataTable data={replacementGroups} columns={columns} />)

    const groupBody = screen
      .getByRole('table')
      .querySelector<HTMLTableSectionElement>(':scope > tbody[data-component="Table.Group.Body"]')
    expect(
      within(groupBody as HTMLTableSectionElement)
        .getAllByRole('rowheader')
        .map(cell => cell.textContent),
    ).toEqual(['delta', 'omega'])
  })

  it('updates header associations when columns change', () => {
    const {rerender} = render(<DataTable data={groups} columns={columns} />)
    const originalRepositoryHeaderId = screen.getByRole('columnheader', {name: /Repository/}).id

    const updatedColumns = [columns[1], columns[0]]
    rerender(<DataTable data={groups} columns={updatedColumns} />)

    const repositoryHeader = screen.getByRole('columnheader', {name: /Repository/})
    expect(repositoryHeader.id).not.toBe(originalRepositoryHeaderId)
    expect(screen.getByRole('rowheader', {name: 'zeta'})).toHaveAttribute(
      'headers',
      expect.stringContaining(repositoryHeader.id),
    )
  })

  it('generates non-colliding header IDs across tables during server rendering', () => {
    const markup = renderToString(
      <>
        <DataTable data={groups} columns={columns} />
        <DataTable data={groups} columns={columns} />
      </>,
    )
    const ids = Array.from(markup.matchAll(/\sid="([^"]+)"/g), match => match[1])

    expect(ids.length).toBeGreaterThan(0)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
