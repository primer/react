import {cleanup, render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import {afterEach, describe, expect, it, vi} from 'vitest'
import {DataTable, type Column} from './DataTable'
import {Table, type TableSkeletonProps} from './index'

type Row = {id: number; name: string; stars: number}
const columns: Column<Row>[] = [
  {field: 'name', header: 'Name', rowHeader: true},
  {field: 'stars', header: 'Stars', sortBy: true},
]

afterEach(cleanup)

function mockOverflow() {
  const scrollHeight = vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(200)
  const clientHeight = vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockReturnValue(100)
  return () => {
    scrollHeight.mockRestore()
    clientHeight.mockRestore()
  }
}

describe('DataTable and Table', () => {
  it('passes DataTable columns directly to the skeleton and evaluates header callbacks without rendering cells', () => {
    const header = vi.fn(() => <span>Stars</span>)
    const renderCell = vi.fn((row: Row) => row.stars)
    const sharedColumns: Column<Row>[] = [
      {field: 'name', header: 'Name', align: 'start', width: 'growCollapse', minWidth: 120},
      {id: 'stars', header, renderCell, align: 'end', width: 'auto', minWidth: 80, maxWidth: 120},
    ]
    const props: TableSkeletonProps<Row> = {columns: sharedColumns, rows: 3}
    const {rerender} = render(<Table.Skeleton {...props} aria-label="Repositories" cellPadding="spacious" />)
    const table = screen.getByRole('table', {name: 'Repositories'})
    expect(table).not.toHaveAttribute('aria-busy')
    expect(table.querySelector('[aria-busy]')).toBeNull()
    expect(screen.queryAllByRole('img')).toHaveLength(0)
    expect(screen.getAllByText('Loading')).toHaveLength(sharedColumns.length)
    expect(table).toHaveAttribute('data-cell-padding', 'spacious')
    expect(table.style.getPropertyValue('--grid-template-columns')).toBe('minmax(120px, 1fr) minmax(80px, 120px)')
    expect(screen.getByRole('columnheader', {name: 'Name'})).toHaveAttribute('data-align', 'start')
    expect(screen.getByRole('columnheader', {name: 'Stars'})).toHaveAttribute('data-align', 'end')
    expect(header).toHaveBeenCalled()
    expect(renderCell).not.toHaveBeenCalled()
    const cells = screen.getAllByRole('cell')
    expect(cells[0]).toHaveAttribute('data-align', 'start')
    expect(cells[1]).toHaveAttribute('data-align', 'end')
    for (const cell of cells) {
      expect(cell).toHaveAccessibleName('Loading')
      const placeholders = Array.from(cell.querySelectorAll<HTMLElement>('[data-component="SkeletonText"]'))
      expect(placeholders).toHaveLength(3)
      expect(placeholders[0].closest('[aria-hidden="true"]')).not.toBeNull()
      expect(placeholders[0].style.maxWidth).toBe('85%')
      expect(placeholders[1].style.maxWidth).toBe('67.5%')
    }
    expect(cells[1].querySelector('[data-component="SkeletonText"]')?.parentElement).toHaveClass('primer:justify-end')

    rerender(<DataTable aria-label="Repositories" columns={sharedColumns} data={[{id: 1, name: 'Primer', stars: 7}]} />)
    expect(screen.getByRole('columnheader', {name: 'Stars'})).toHaveAttribute('data-align', 'end')
    expect(screen.getByRole('cell', {name: '7'})).toHaveAttribute('data-align', 'end')
    expect(renderCell).toHaveBeenCalledWith({id: 1, name: 'Primer', stars: 7})
  })

  it('preserves node headers and accepts aligned header-only and full column literals', () => {
    render(
      <Table.Skeleton<Row>
        aria-label="Repositories"
        className="consumer-table"
        columns={[
          {header: <strong>Name</strong>, align: 'start', width: 200},
          {header: () => 'Stars', align: 'end', width: '100px'},
          {field: 'id', header: 'ID', align: 'end', width: 'auto', sortBy: true},
        ]}
      />,
    )
    const table = screen.getByRole('table', {name: 'Repositories'})
    expect(table).toHaveClass('consumer-table')
    expect(table.style.getPropertyValue('--grid-template-columns')).toBe('200px 100px auto')
    expect(screen.getAllByRole('columnheader').map(header => header.textContent)).toEqual(['Name', 'Stars', 'ID'])
    expect(screen.getAllByText('Loading')).toHaveLength(3)
    expect(document.querySelectorAll('[data-component="SkeletonText"]')).toHaveLength(30)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    expect(screen.getByRole('columnheader', {name: 'ID'})).not.toHaveAttribute('aria-sort')
  })

  it('keeps callback headers when no placeholder rows or columns are requested', () => {
    const {rerender} = render(
      <Table.Skeleton aria-label="Empty table" columns={[{header: () => <span>Name</span>}]} rows={0} />,
    )
    expect(screen.getByRole('columnheader', {name: 'Name'})).toBeInTheDocument()
    expect(document.querySelector('[data-component="SkeletonText"]')).toBeNull()
    expect(screen.getByRole('cell', {name: 'Loading'})).toBeInTheDocument()
    rerender(<Table.Skeleton aria-label="Empty table" columns={[]} rows={0} />)
    expect(screen.getByRole('table', {name: 'Empty table'})).not.toHaveAttribute('aria-busy')
    expect(screen.queryByRole('columnheader')).not.toBeInTheDocument()
  })

  it('renders native table semantics and toggles sortable headers', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        data={[
          {id: 1, name: 'Zebra', stars: 1},
          {id: 2, name: 'Ant', stars: 2},
        ]}
      />,
    )
    expect(screen.getByRole('button', {name: 'Stars'})).toHaveAccessibleDescription('Sort ascending')
    expect(screen.getByRole('button', {name: 'Stars'})).not.toHaveAttribute('aria-description')
    await user.click(screen.getByRole('button', {name: 'Stars'}))
    expect(screen.getByRole('columnheader', {name: /Stars/})).toHaveAttribute('aria-sort', 'ascending')
    expect(screen.getAllByRole('rowheader')[0]).toHaveTextContent('Zebra')
  })
  it('forwards table props and its table ref', () => {
    const ref = React.createRef<HTMLTableElement>()
    render(<DataTable ref={ref} aria-label="Repositories" cellPadding="spacious" columns={columns} data={[]} />)
    expect(ref.current).toHaveAttribute('aria-label', 'Repositories')
    expect(ref.current).toHaveAttribute('data-cell-padding', 'spacious')
    expect(ref.current).toHaveClass('primer:group', 'primer:relative')
  })
  it('renders nested fields, column widths, and an initial sort direction', () => {
    render(
      <DataTable
        columns={[
          {field: 'details.name', header: 'Name', rowHeader: true, sortBy: 'alphanumeric', width: '200px'},
          {field: 'updatedAt', header: 'Updated', sortBy: 'datetime', minWidth: '100px'},
        ]}
        data={[
          {id: 1, details: {name: 'Zebra'}, updatedAt: 2},
          {id: 2, details: {name: 'Ant'}, updatedAt: 1},
        ]}
        initialSortColumn="details.name"
        initialSortDirection="DESC"
      />,
    )
    expect(screen.getByRole('columnheader', {name: /Name/})).toHaveAttribute('aria-sort', 'descending')
    expect(screen.getAllByRole('rowheader')[0]).toHaveTextContent('Zebra')
    expect(screen.getByRole('table').style.getPropertyValue('--grid-template-columns')).toBe('200px minmax(100px, 1fr)')
  })
  it('exposes composable table parts', () => {
    render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>Header</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Value</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    )
    expect(screen.getAllByRole('table')).toHaveLength(1)
  })
  it('composes table pagination with a zero-based page index', async () => {
    const user = userEvent.setup()
    let pageIndex = -1
    render(
      <Table.Container>
        <Table.Pagination pageSize={10} totalCount={30} onChange={details => (pageIndex = details.pageIndex)} />
      </Table.Container>,
    )

    const pagination = screen.getByRole('navigation', {name: 'Pagination'})
    expect(pagination).toHaveAttribute('data-component', 'Table.Pagination')
    expect(screen.getByText(/1.*10 of 30/)).toBeInTheDocument()
    await user.click(screen.getByRole('button', {name: 'Page 2'}))
    expect(pageIndex).toBe(1)
    expect(screen.getByRole('button', {name: 'Page 2'})).toHaveAttribute('aria-current', 'page')
    expect(screen.getByText(/11.*20 of 30/)).toBeInTheDocument()
  })

  it('hides numbered pages on narrow viewports unless showPages is set', () => {
    const {rerender} = render(<Table.Pagination pageSize={10} totalCount={30} />)
    expect(screen.getByRole('button', {name: 'Page 2'})).toHaveClass('primer:hidden', 'primer:md:inline-flex')
    expect(screen.getByRole('button', {name: 'Previous page'})).toHaveClass('primer:mr-0', 'primer:md:mr-4')

    rerender(<Table.Pagination pageSize={10} showPages totalCount={30} />)
    expect(screen.getByRole('button', {name: 'Page 2'})).not.toHaveClass('primer:hidden')
    expect(screen.getByRole('button', {name: 'Previous page'})).toHaveClass('primer:mr-4')
  })
})

it('makes an overflowing table wrapper a focusable region named by the table', () => {
  const restore = mockOverflow()
  try {
    render(
      <>
        <h2 id="repos-heading">Repositories</h2>
        <Table aria-labelledby="repos-heading">
          <Table.Body>
            <Table.Row>
              <Table.Cell>Cell</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </>,
    )
    const region = screen.getByRole('region', {name: 'Repositories'})
    expect(region).toHaveAttribute('tabindex', '0')
    expect(region).toHaveAttribute('data-component', 'Table.OverflowWrapper')
  } finally {
    restore()
  }
})
