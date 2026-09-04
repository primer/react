import {render, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {act} from 'react'
import {hydrateRoot, type Root} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {describe, expect, it, vi} from 'vitest'
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

    const {container} = render(<DataTable data={data} columns={columns} />)

    expect(screen.getByRole('columnheader', {name: 'Administrateurs, aucune ligne'})).toHaveAttribute('colspan', '2')
    expect(screen.getAllByRole('row')).toHaveLength(2)
    const groupSections = container.querySelectorAll<HTMLTableSectionElement>('tbody[data-group-id="empty"]')
    expect(groupSections).toHaveLength(2)
    expect(groupSections[0]).toHaveAttribute('data-component', 'Table.Group')
    expect(groupSections[1]).toHaveAttribute('data-component', 'Table.Group.Body')
    expect(groupSections[1].querySelectorAll('tr')).toHaveLength(0)
  })

  it('recognizes row groups with additional properties', () => {
    const groupWithId: DataTableRowGroup<Repository> & {id: string} = {
      id: 'consumer-defined-id',
      type: 'row-group',
      groupId: 'internal',
      label: 'Internal',
      rows: [{id: 1, name: 'primer/react', visibility: 'internal'}],
    }

    render(<DataTable data={[groupWithId]} columns={columns} />)

    expect(screen.getByRole('columnheader', {name: 'Internal, 1 row'})).toBeInTheDocument()
    expect(screen.getByRole('rowheader', {name: 'primer/react'})).toBeInTheDocument()
  })

  it('sorts rows within each group while preserving group order', async () => {
    const user = userEvent.setup()
    render(<DataTable data={groups} columns={columns} />)

    const sortButton = screen.getByRole('button', {name: 'Repository'})
    const repositoryHeader = screen.getByRole('columnheader', {name: 'Repository'})
    expect(repositoryHeader).not.toHaveAttribute('aria-sort')
    expect(sortButton).toHaveAccessibleDescription('Sort ascending')
    expectGroupedHeaderAssociations('zeta')

    await user.click(sortButton)

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
    expect(repositoryHeader).toHaveAccessibleName('Repository')
    expect(repositoryHeader).toHaveAttribute('aria-sort', 'ascending')
    expect(sortButton).toHaveAccessibleDescription('Sort descending')
    expectGroupedHeaderAssociations('alpha')

    await user.click(sortButton)

    expect(repositoryHeader).toHaveAccessibleName('Repository')
    expect(repositoryHeader).toHaveAttribute('aria-sort', 'descending')
    expect(sortButton).toHaveAccessibleDescription('Sort ascending')
    expectGroupedHeaderAssociations('zeta')

    function expectGroupedHeaderAssociations(rowHeaderName: string) {
      const columnHeaders = screen.getAllByRole('columnheader').filter(header => header.getAttribute('scope') === 'col')
      const groupHeader = screen.getByRole('columnheader', {name: 'Internal, 2 rows'})
      const rowHeader = screen.getByRole('rowheader', {name: rowHeaderName})
      const row = rowHeader.closest('tr')
      const cell = within(row as HTMLTableRowElement).getByRole('cell')

      expect(rowHeader).toHaveAttribute('headers', `${groupHeader.id} ${columnHeaders[0].id}`)
      expect(cell).toHaveAttribute('headers', `${groupHeader.id} ${rowHeader.id} ${columnHeaders[1].id}`)
    }
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

  it('preserves complete, non-colliding header associations through server rendering and hydration', async () => {
    const tables = (
      <>
        <DataTable data={groups} columns={columns} />
        <DataTable data={groups} columns={columns} />
      </>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(tables)
    document.body.appendChild(container)
    const recoverableErrors: unknown[] = []
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    let root: Root | undefined

    try {
      const serverAssociations = getAssociationGraph(container)
      expectCompleteAssociationGraph(container)

      await act(async () => {
        root = hydrateRoot(container, tables, {
          onRecoverableError: error => recoverableErrors.push(error),
        })
      })

      expect(recoverableErrors).toEqual([])
      expect(consoleErrorSpy).not.toHaveBeenCalled()
      expect(getAssociationGraph(container)).toEqual(serverAssociations)
      expectCompleteAssociationGraph(container)
    } finally {
      consoleErrorSpy.mockRestore()
      await act(async () => root?.unmount())
      container.remove()
    }
  })
})

function getAssociationGraph(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>('[id], [headers]')).map(element => ({
    id: element.id,
    headers: element.getAttribute('headers'),
  }))
}

function expectCompleteAssociationGraph(container: HTMLElement) {
  const allIds = Array.from(container.querySelectorAll<HTMLElement>('[id]'), element => element.id)
  expect(new Set(allIds).size).toBe(allIds.length)

  for (const table of container.querySelectorAll('table')) {
    const columnHeaders = table.querySelectorAll<HTMLElement>('thead th[scope="col"]')

    for (const groupBody of table.querySelectorAll<HTMLElement>('tbody[data-component="Table.Group.Body"]')) {
      const groupId = groupBody.getAttribute('data-group-id')
      const groupHeader = table.querySelector<HTMLElement>(
        `tbody[data-component="Table.Group"][data-group-id="${groupId}"] th[scope="colgroup"]`,
      )
      expect(groupHeader?.id).toBeTruthy()

      for (const row of groupBody.querySelectorAll('tr')) {
        const rowHeaders = Array.from(row.querySelectorAll<HTMLElement>('th[scope="row"]'))

        for (const [index, cell] of Array.from(row.children).entries()) {
          const expectedHeaders =
            cell.getAttribute('scope') === 'row'
              ? [groupHeader?.id, columnHeaders[index].id]
              : [groupHeader?.id, ...rowHeaders.map(header => header.id), columnHeaders[index].id]
          expect(cell.getAttribute('headers')?.split(' ')).toEqual(expectedHeaders)
          expect(expectedHeaders.every(id => id && allIds.includes(id))).toBe(true)
        }
      }
    }
  }
}
