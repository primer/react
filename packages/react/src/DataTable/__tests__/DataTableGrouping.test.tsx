import {render, renderHook, screen, within} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {act} from 'react'
import {hydrateRoot, type Root} from 'react-dom/client'
import {renderToString} from 'react-dom/server'
import {describe, expect, it, vi} from 'vitest'
import {DataTable} from '../DataTable'
import type {Column} from '../column'
import type {DataTableData, DataTableRowGroup} from '../row'
import {useTable} from '../useTable'

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
    groupId: 'internal',
    label: 'Internal',
    rows: [
      {id: 1, name: 'zeta', visibility: 'internal'},
      {id: 2, name: 'alpha', visibility: 'internal'},
    ],
  },
  {
    groupId: 'public',
    label: 'Public',
    rows: [
      {id: 3, name: 'gamma', visibility: 'public'},
      {id: 4, name: 'beta', visibility: 'public'},
    ],
  },
]

const mixedData: DataTableData<Repository> = [
  {id: 5, name: 'outside-z', visibility: 'standalone'},
  {id: 6, name: 'outside-a', visibility: 'standalone'},
  {...groups[0], groupId: 5},
  groups[1],
  {id: 7, name: 'middle-z', visibility: 'standalone'},
  {id: 8, name: 'middle-a', visibility: 'standalone'},
  {groupId: 'empty', label: 'Empty', rows: []},
  {id: 9, name: 'tail-z', visibility: 'standalone'},
  {id: 10, name: 'tail-a', visibility: 'standalone'},
]

describe('DataTable grouping', () => {
  it('requires both groupId and array-valued rows to classify an input as a group', () => {
    const data = [
      {id: 1, type: 'row-group', groupId: 'business-group'},
      {id: 2, type: 'repository', rows: []},
      {id: 3, type: 'report', groupId: 'business-group', rows: 12},
    ]
    const {result} = renderHook(() =>
      useTable({data, columns: [{header: 'Type', field: 'type'}], getRowId: row => row.id}),
    )

    expect(result.current.bodies).toHaveLength(1)
    expect(result.current.bodies[0].type).toBe('row-body')
    for (const [index, model] of result.current.bodies[0].rows.entries()) {
      expect(model.type).toBe('row')
      expect(model.getValue()).toBe(data[index])
      expect(model.getValue().type).toBe(data[index].type)
    }
  })

  it('preserves business type fields through mixed rendering and sorting without modifying input', async () => {
    const user = userEvent.setup()
    const standalone = Object.freeze({id: 1, type: 'standalone', name: 'outside'})
    const members = [
      Object.freeze({id: 2, type: 'repository', name: 'zeta'}),
      Object.freeze({id: 3, type: 'report', name: 'alpha'}),
    ]
    Object.freeze(members)
    const group = Object.freeze({groupId: 'public', label: 'Public', type: 'business-group', rows: members})
    const data = [standalone, group]
    Object.freeze(data)
    const renderCell = vi.fn((row: {id: number; type: string; name: string}) => row.type)
    render(
      <DataTable
        data={data}
        columns={[
          {header: 'Name', field: 'name', rowHeader: true, sortBy: true},
          {header: 'Type', field: 'type', renderCell},
        ]}
      />,
    )

    expect(screen.getAllByRole('cell').map(cell => cell.textContent)).toEqual(['standalone', 'repository', 'report'])
    await user.click(screen.getByRole('button', {name: 'Name'}))
    expect(screen.getAllByRole('cell').map(cell => cell.textContent)).toEqual(['standalone', 'report', 'repository'])
    expect(renderCell.mock.calls.some(([row]) => row === standalone)).toBe(true)
    for (const member of members) {
      expect(renderCell.mock.calls.some(([row]) => row === member)).toBe(true)
    }
    expect(group.type).toBe('business-group')
    expect(group.rows.map(row => row.name)).toEqual(['zeta', 'alpha'])
  })

  it('renders mixed rows and adjacent or empty groups as sibling bodies without leaking group headers', () => {
    const {container} = render(<DataTable data={mixedData} columns={columns} />)
    const bodies = container.querySelectorAll('table > tbody')
    expect(Array.from(bodies, body => body.getAttribute('data-component'))).toEqual([
      'Table.Body',
      'Table.Group',
      'Table.Group.Body',
      'Table.Group',
      'Table.Group.Body',
      'Table.Body',
      'Table.Group',
      'Table.Group.Body',
      'Table.Body',
    ])
    expect(bodies[0].querySelectorAll('tr')).toHaveLength(2)
    expect(bodies[7].querySelectorAll('tr')).toHaveLength(0)
    expect(container.querySelector('tbody tbody')).toBeNull()
    expectCompleteAssociationGraph(container)
  })

  it('sorts each contiguous row run and each group independently without remounting rows', async () => {
    const user = userEvent.setup()
    const {container} = render(<DataTable data={mixedData} columns={columns} />)
    const originalRows = new Map(screen.getAllByRole('rowheader').map(header => [header.textContent, header]))
    const sortButton = screen.getByRole('button', {name: 'Repository'})
    await user.click(sortButton)
    expect(screen.getAllByRole('rowheader').map(header => header.textContent)).toEqual([
      'outside-a',
      'outside-z',
      'alpha',
      'zeta',
      'beta',
      'gamma',
      'middle-a',
      'middle-z',
      'tail-a',
      'tail-z',
    ])
    expectCompleteAssociationGraph(container)
    await user.click(sortButton)
    expect(screen.getAllByRole('rowheader').map(header => header.textContent)).toEqual([
      'outside-z',
      'outside-a',
      'zeta',
      'alpha',
      'gamma',
      'beta',
      'middle-z',
      'middle-a',
      'tail-z',
      'tail-a',
    ])
    expectCompleteAssociationGraph(container)
    for (const header of screen.getAllByRole('rowheader')) {
      expect(header).toBe(originalRows.get(header.textContent))
    }
    expect(
      screen
        .getAllByRole('columnheader', {name: /Internal|Public|Empty/})
        .map(header => header.closest('tbody')?.getAttribute('data-group-id')),
    ).toEqual(['5', 'public', 'empty'])
  })

  it.each([false, true])('adopts replacement mixed data with externalSorting=%s', async externalSorting => {
    const user = userEvent.setup()
    const {container, rerender} = render(
      <DataTable data={groups} columns={columns} externalSorting={externalSorting} />,
    )
    await user.click(screen.getByRole('button', {name: 'Repository'}))
    rerender(<DataTable data={mixedData} columns={columns} externalSorting={externalSorting} />)
    expect(screen.getAllByRole('rowheader').map(header => header.textContent)).toEqual(
      externalSorting
        ? ['outside-z', 'outside-a', 'zeta', 'alpha', 'gamma', 'beta', 'middle-z', 'middle-a', 'tail-z', 'tail-a']
        : ['outside-a', 'outside-z', 'alpha', 'zeta', 'beta', 'gamma', 'middle-a', 'middle-z', 'tail-a', 'tail-z'],
    )
    expectCompleteAssociationGraph(container)
    const flatRows = groups[0].rows
    rerender(<DataTable data={flatRows} columns={columns} externalSorting={externalSorting} />)
    expect(container.querySelector('[headers]')).toBeNull()
    expect(container.querySelector('th[id]')).toBeNull()
    expect(container.querySelectorAll('table > tbody')).toHaveLength(1)
  })

  it('prepares bodies and header associations for flat, grouped, mixed, and empty data', () => {
    const getRowId = (row: Repository) => row.id
    const initialProps: {data: DataTableData<Repository>} = {data: groups}
    const {result, rerender} = renderHook(
      ({data}: {data: DataTableData<Repository>}) => useTable({data, columns, getRowId}),
      {initialProps},
    )
    const groupedModel = result.current
    expect(groupedModel.bodies[0].type).toBe('row-group')
    expect(groupedModel.bodies[0].rows[0].getValue().name).toBe('zeta')
    expect(groupedModel.headers.every(header => header.domId)).toBe(true)

    rerender({data: mixedData})
    expect(result.current.bodies.map(body => body.type)).toEqual([
      'row-body',
      'row-group',
      'row-group',
      'row-body',
      'row-group',
      'row-body',
    ])
    expect(result.current.bodies.map(body => body.key)).toEqual([
      'rows:start',
      'group:5',
      'group:public',
      'rows:after:public',
      'group:empty',
      'rows:after:empty',
    ])
    expect(result.current.bodies.map(body => body.rows.length)).toEqual([2, 2, 2, 2, 0, 2])
    const rowHeaderIds: string[] = []
    for (const body of result.current.bodies) {
      for (const row of body.rows) {
        const [rowHeader, cell] = row.getCells()
        expect(rowHeader.domId).toBeTruthy()
        expect(rowHeader.headers).toBe(result.current.headers[0].domId)
        expect(cell.domId).toBeUndefined()
        expect(cell.headers).toBe(`${rowHeader.domId} ${result.current.headers[1].domId}`)
        if (rowHeader.domId) rowHeaderIds.push(rowHeader.domId)
      }
    }
    expect(new Set(rowHeaderIds).size).toBe(10)

    rerender({data: groups[0].rows})
    const flatModel = result.current
    expect(flatModel.bodies[0].type).toBe('row-body')
    expect(flatModel.bodies[0].rows[0].getValue().name).toBe('zeta')
    expect(flatModel.headers.every(header => header.domId === undefined)).toBe(true)
    for (const cell of flatModel.bodies[0].rows[0].getCells()) {
      expect(cell.domId).toBeUndefined()
      expect(cell.headers).toBeUndefined()
    }

    rerender({data: []})
    expect(result.current.bodies).toEqual([{type: 'row-body', key: 'rows:start', rows: []}])

    rerender({data: [{...groups[0], rows: []}]})
    expect(result.current.bodies[0].type).toBe('row-group')
    expect(result.current.bodies[0].rows).toEqual([])
    expect(result.current.headers.every(header => header.domId)).toBe(true)
  })

  it.each([
    {grouped: false, externalSorting: false, direction: 'ASC'},
    {grouped: false, externalSorting: false, direction: 'DESC'},
    {grouped: false, externalSorting: true, direction: 'ASC'},
    {grouped: false, externalSorting: true, direction: 'DESC'},
    {grouped: true, externalSorting: false, direction: 'ASC'},
    {grouped: true, externalSorting: false, direction: 'DESC'},
    {grouped: true, externalSorting: true, direction: 'ASC'},
    {grouped: true, externalSorting: true, direction: 'DESC'},
  ])(
    'adopts replacement data ($grouped grouped, $externalSorting external, $direction)',
    async ({grouped, externalSorting, direction}) => {
      const user = userEvent.setup()
      const data = grouped ? groups : groups.flatMap(group => group.rows)
      const {rerender} = render(<DataTable data={data} columns={columns} externalSorting={externalSorting} />)
      await user.click(screen.getByRole('button', {name: 'Repository'}))
      if (direction === 'DESC') await user.click(screen.getByRole('button', {name: 'Repository'}))

      const rows: Repository[] = [
        {id: 5, name: 'omega', visibility: 'private'},
        {id: 6, name: 'alpha', visibility: 'private'},
        {id: 7, name: 'delta', visibility: 'private'},
      ]
      const replacement = grouped ? [{...groups[0], rows}] : rows
      rerender(<DataTable data={replacement} columns={columns} externalSorting={externalSorting} />)

      expect(screen.getAllByRole('rowheader').map(cell => cell.textContent)).toEqual(
        externalSorting
          ? ['omega', 'alpha', 'delta']
          : direction === 'ASC'
            ? ['alpha', 'delta', 'omega']
            : ['omega', 'delta', 'alpha'],
      )
      expect(rows.map(row => row.name)).toEqual(['omega', 'alpha', 'delta'])
      expect(screen.getByRole('columnheader', {name: 'Repository'})).toHaveAttribute(
        'aria-sort',
        direction === 'ASC' ? 'ascending' : 'descending',
      )
    },
  )

  it('renders config-driven groups through Table.Group', () => {
    const {container} = render(<DataTable data={groups} columns={columns} />)

    const table = screen.getByRole('table')
    const groupHeaders = screen
      .getAllByRole('columnheader')
      .filter(header => header.getAttribute('scope') === 'colgroup')
    const groupBodies = table.querySelectorAll(':scope > tbody[data-component="Table.Group.Body"]')

    expect(groupHeaders).toHaveLength(2)
    expect(groupBodies).toHaveLength(2)
    expect(groupHeaders[0]).toHaveAccessibleName(/^Internal\s*, 2 rows$/)
    expect(groupHeaders[0]).toHaveAttribute('colspan', '2')
    expect(container.querySelector(':scope tbody[data-component="Table.Body"]')).not.toBeInTheDocument()
  })

  it('associates grouped row headers and cells with their group and column headers', () => {
    render(<DataTable data={groups} columns={columns} />)

    const columnHeaders = screen.getAllByRole('columnheader').filter(header => header.getAttribute('scope') === 'col')
    const groupHeader = screen.getByRole('columnheader', {name: /^Internal\s*, 2 rows$/})
    const rowHeader = screen.getByRole('rowheader', {name: 'zeta'})
    const cell = screen.getAllByRole('cell', {name: 'internal'})[0]

    expect(rowHeader).toHaveAttribute('headers', `${groupHeader.id} ${columnHeaders[0].id}`)
    expect(cell).toHaveAttribute('headers', `${groupHeader.id} ${rowHeader.id} ${columnHeaders[1].id}`)
  })

  it('renders empty groups and localized group names', () => {
    const data: Array<DataTableRowGroup<Repository>> = [
      {
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
    const groupWithId: DataTableRowGroup<Repository> & {id: string; type: string} = {
      id: 'consumer-defined-id',
      type: 'consumer-group',
      groupId: 'internal',
      label: 'Internal',
      rows: [{id: 1, name: 'primer/react', visibility: 'internal'}],
    }

    render(<DataTable data={[groupWithId]} columns={columns} />)

    expect(screen.getByRole('columnheader', {name: /^Internal\s*, 1 row$/})).toBeInTheDocument()
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
      const groupHeader = screen.getByRole('columnheader', {name: /^Internal\s*, 2 rows$/})
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

  it.each([0, 2])('prepares complete mixed-table associations with %s row-header columns', rowHeaderCount => {
    const mixedColumns: Array<Column<Repository>> = [
      ...columns.map((column, index) => ({...column, rowHeader: index < rowHeaderCount})),
      {header: 'ID', field: 'id'},
    ]
    const {container} = render(<DataTable data={mixedData} columns={mixedColumns} />)

    expect(screen.queryAllByRole('rowheader')).toHaveLength(10 * rowHeaderCount)
    expectCompleteAssociationGraph(container)
  })

  it.each([
    {name: 'groups', data: groups},
    {name: 'mixed rows and groups', data: mixedData},
  ])('preserves complete header associations through server rendering and hydration for $name', async ({data}) => {
    const tables = (
      <>
        <DataTable data={data} columns={columns} />
        <DataTable data={data} columns={columns} />
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

    for (const groupBody of table.querySelectorAll<HTMLElement>(
      'tbody[data-component="Table.Group.Body"], tbody[data-component="Table.Body"]',
    )) {
      const groupId = groupBody.getAttribute('data-group-id')
      const groupHeader =
        groupId === null
          ? null
          : table.querySelector<HTMLElement>(
              `tbody[data-component="Table.Group"][data-group-id="${groupId}"] th[scope="colgroup"]`,
            )
      if (groupId !== null) expect(groupHeader?.id).toBeTruthy()
      const groupHeaders = groupHeader ? [groupHeader.id] : []

      for (const row of groupBody.querySelectorAll('tr')) {
        const rowHeaders = Array.from(row.querySelectorAll<HTMLElement>('th[scope="row"]'))

        for (const [index, cell] of Array.from(row.children).entries()) {
          const expectedHeaders =
            cell.getAttribute('scope') === 'row'
              ? [...groupHeaders, columnHeaders[index].id]
              : [...groupHeaders, ...rowHeaders.map(header => header.id), columnHeaders[index].id]
          expect(cell.getAttribute('headers')?.split(' ')).toEqual(expectedHeaders)
          expect(expectedHeaders.every(id => id && allIds.includes(id))).toBe(true)
        }
      }
    }
  }
}
