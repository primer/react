import {describe, expect, it} from 'vitest'
import {render, screen} from '@testing-library/react'
import {Table} from '../../DataTable'
import {createColumnHelper} from '../column'
import type {TableProps} from '../Table'

function createTable({columns, rows}: {columns: Array<string>; rows: Array<Array<string>>}) {
  return (
    <Table>
      <Table.Head>
        <Table.Row>
          {columns.map(column => {
            return <Table.Header key={column}>{column}</Table.Header>
          })}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {rows.map((row, index) => {
          return (
            <Table.Row key={index}>
              {row.map(cell => (
                <Table.Cell key={cell}>{cell}</Table.Cell>
              ))}
            </Table.Row>
          )
        })}
      </Table.Body>
    </Table>
  )
}

describe('Table', () => {
  it('should render an element with role="table" semantics', () => {
    const columns = ['Column A', 'Column B', 'Column C']
    const rows = [
      ['Cell A1', 'Cell B1', 'Cell C1'],
      ['Cell A2', 'Cell B2', 'Cell C2'],
      ['Cell A3', 'Cell B3', 'Cell C3'],
    ]
    render(createTable({columns, rows}))

    expect(screen.getByRole('table')).toBeInTheDocument()
    // The <tr> within <thead> is considered a row so we add it to the list of
    // rows
    expect(screen.getAllByRole('row')).toHaveLength(rows.length + 1)

    for (const column of columns) {
      expect(screen.getByRole('columnheader', {name: column})).toBeInTheDocument()
    }

    for (const row of rows) {
      for (const cell of row) {
        expect(screen.getByRole('cell', {name: cell})).toBeInTheDocument()
      }
    }
  })

  it('should use "normal" cellPadding by default', () => {
    render(
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Header>Column</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Cell</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    )
    expect(screen.getByRole('table')).toHaveAttribute('data-cell-padding', 'normal')
  })

  it('should support different padding options through `cellPadding`', () => {
    const options: Array<Exclude<TableProps['cellPadding'], undefined>> = ['condensed', 'normal', 'spacious']

    for (const option of options) {
      render(
        <>
          <Table.Title id={option}>{option}</Table.Title>
          <Table aria-labelledby={option} cellPadding={option}>
            <Table.Head>
              <Table.Row>
                <Table.Header>Column</Table.Header>
              </Table.Row>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell>Cell</Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </>,
      )

      const table = screen.getByRole('table', {name: option})
      // Note: `data-cell-padding` is an implementation detail for styling and
      // may change in the future. This test is used to confirm that we are
      // setting that option as it is what triggers the different appearances of
      // the <table>
      expect(table).toHaveAttribute('data-cell-padding', option)
    }
  })

  it('should support labeling through `aria-labelledby`', () => {
    render(
      <>
        <Table.Title id="test">test</Table.Title>
        <Table aria-labelledby="test">
          <Table.Head>
            <Table.Row>
              <Table.Header>Column</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell scope="row">Cell</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </>,
    )
    expect(screen.getByRole('table', {name: 'test'})).toBeInTheDocument()
  })

  it('should support describing through `aria-describedby`', () => {
    render(
      <>
        <Table.Subtitle id="test">test</Table.Subtitle>
        <Table aria-describedby="test">
          <Table.Head>
            <Table.Row>
              <Table.Header>Column</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell scope="row">Cell</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      </>,
    )
    expect(screen.getByRole('table', {description: 'test'})).toBeInTheDocument()
  })

  describe('Table.Container', () => {
    it('should support additional props on the outermost element', () => {
      const {container} = render(<Table.Container data-testid="test" />)
      expect(container.firstElementChild).toHaveAttribute('data-testid', 'test')
    })

    it('should support a custom `className` through the `className` prop', () => {
      const {container} = render(<Table.Container className="test" />)
      expect(container.firstElementChild).toHaveClass('test')
    })
  })

  describe('Table.Title', () => {
    it('should default to rendering a level 2 heading', () => {
      render(<Table.Title id="test">test</Table.Title>)
      expect(screen.getByRole('heading', {name: 'test', level: 2})).toBeInTheDocument()
    })

    it('should place the `id` prop on the outermost element', () => {
      const {container} = render(<Table.Title id="test">test</Table.Title>)
      expect(container.firstChild).toHaveAttribute('id', 'test')
    })

    it('should support rendering a custom heading tag', () => {
      render(
        <Table.Title as="h3" id="test">
          test
        </Table.Title>,
      )
      expect(screen.getByRole('heading', {name: 'test', level: 3})).toBeInTheDocument()
    })
  })

  describe('Table.Subtitle', () => {
    it('should support changing the outermost element through the `as` prop', () => {
      const {container} = render(
        <Table.Subtitle id="test" as="p">
          test
        </Table.Subtitle>,
      )
      expect(container.firstElementChild?.tagName).toBe('P')
    })

    it('should place the `id` prop on the outermost element', () => {
      const {container} = render(<Table.Subtitle id="test">test</Table.Subtitle>)
      expect(container.firstChild).toHaveAttribute('id', 'test')
    })
  })

  describe('Table.Header', () => {
    it('should set scope="col" on the column header', () => {
      render(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header>Column</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell scope="row">Cell</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      )

      expect(screen.getByRole('columnheader', {name: 'Column'})).toBeInTheDocument()
      expect(screen.getByRole('columnheader', {name: 'Column'})).toHaveAttribute('scope', 'col')
    })
  })

  describe('Table.Cell', () => {
    it('should set the element to a <th> when `scope` is defined', () => {
      render(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header>Column</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell scope="row">Cell</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      )
      expect(screen.getByRole('rowheader', {name: 'Cell'})).toBeInTheDocument()
    })

    it('should vertically align cell contents', () => {
      render(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header>Column</Table.Header>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Cell</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>,
      )
      expect(screen.getByRole('cell')).toHaveStyle('align-items: center')
    })
  })

  describe('Table.Skeleton', () => {
    it('should render a table with columns and loading content', () => {
      const columnHelper = createColumnHelper()
      const columns = [
        columnHelper.column({
          header: 'Column A',
        }),
        columnHelper.column({
          header: 'Column B',
        }),
        columnHelper.column({
          header: 'Column C',
        }),
      ]
      render(
        <>
          <h2 id="test">Test</h2>
          <Table.Skeleton aria-labelledby="test" columns={columns} />
        </>,
      )

      expect(screen.getByRole('table', {name: 'Test'})).toBeInTheDocument()
      for (const column of columns) {
        expect(screen.getByRole('columnheader', {name: column.header as string})).toBeInTheDocument()
      }

      for (const cell of screen.getAllByRole('cell')) {
        expect(cell).toHaveTextContent('Loading')
      }
    })
  })
})
