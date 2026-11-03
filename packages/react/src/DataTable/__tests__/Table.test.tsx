import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
import {DataTable, Table} from '../../DataTable'
import {createColumnHelper} from '../column'
import {TableSortHeader, type TableProps} from '../Table'
import {SortDirection} from '../sorting'
import {implementsClassName} from '../../utils/testing'
import classes from '../Table.module.css'

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
  implementsClassName(Table, classes.Table)

  it('should render an element with role="table" semantics', async () => {
    const columns = ['Column A', 'Column B', 'Column C']
    const rows = [
      ['Cell A1', 'Cell B1', 'Cell C1'],
      ['Cell A2', 'Cell B2', 'Cell C2'],
      ['Cell A3', 'Cell B3', 'Cell C3'],
    ]
    render(createTable({columns, rows}))

    await expect.element(page.getByRole('table')).toBeInTheDocument()
    // The <tr> within <thead> is considered a row so we add it to the list of
    // rows
    expect(page.getByRole('row').elements()).toHaveLength(rows.length + 1)

    for (const column of columns) {
      await expect.element(page.getByRole('columnheader', {name: column, exact: true})).toBeInTheDocument()
    }

    for (const row of rows) {
      for (const cell of row) {
        await expect.element(page.getByRole('cell', {name: cell, exact: true})).toBeInTheDocument()
      }
    }
  })

  it('should use "normal" cellPadding by default', async () => {
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
    await expect.element(page.getByRole('table')).toHaveAttribute('data-cell-padding', 'normal')
  })

  it('should support different padding options through `cellPadding`', async () => {
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

      const table = page.getByRole('table', {name: option, exact: true})
      // Note: `data-cell-padding` is an implementation detail for styling and
      // may change in the future. This test is used to confirm that we are
      // setting that option as it is what triggers the different appearances of
      // the <table>
      await expect.element(table).toHaveAttribute('data-cell-padding', option)
    }
  })

  it('should support labeling through `aria-labelledby`', async () => {
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
    await expect.element(page.getByRole('table', {name: 'test', exact: true})).toBeInTheDocument()
  })

  it('should support describing through `aria-describedby`', async () => {
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
    await expect.element(page.getByRole('table')).toBeInTheDocument()
    await expect.element(page.getByRole('table')).toHaveAccessibleDescription('test')
  })

  describe('Table.Container', () => {
    implementsClassName(Table.Container, classes.TableContainer)

    it('should support additional props on the outermost element', () => {
      const {container} = render(<Table.Container data-testid="test" />)
      expect(container.firstElementChild).toHaveAttribute('data-testid', 'test')
    })
  })

  describe('Table.Title', () => {
    it('should default to rendering a level 2 heading', async () => {
      render(<Table.Title id="test">test</Table.Title>)
      await expect.element(page.getByRole('heading', {name: 'test', level: 2, exact: true})).toBeInTheDocument()
    })

    it('should place the `id` prop on the outermost element', () => {
      const {container} = render(<Table.Title id="test">test</Table.Title>)
      expect(container.firstChild).toHaveAttribute('id', 'test')
    })

    it('should support rendering a custom heading tag', async () => {
      render(
        <Table.Title as="h3" id="test">
          test
        </Table.Title>,
      )
      await expect.element(page.getByRole('heading', {name: 'test', level: 3, exact: true})).toBeInTheDocument()
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
    it('should set scope="col" on the column header', async () => {
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

      await expect.element(page.getByRole('columnheader', {name: 'Column', exact: true})).toBeInTheDocument()
      await expect
        .element(page.getByRole('columnheader', {name: 'Column', exact: true}))
        .toHaveAttribute('scope', 'col')
    })
  })

  describe('Table.SortHeader', () => {
    it('should preserve a consumer-provided aria-label', async () => {
      render(
        <Table>
          <Table.Head>
            <Table.Row>
              <TableSortHeader aria-label="Custom column name" direction={SortDirection.ASC} onToggleSort={() => {}}>
                Visible column name
              </TableSortHeader>
            </Table.Row>
          </Table.Head>
        </Table>,
      )

      const header = page.getByRole('columnheader', {name: 'Custom column name', exact: true})
      const sortButton = page.getByRole('button', {name: 'Visible column name', exact: true})

      await expect.element(header).toHaveAttribute('aria-sort', 'ascending')
      await expect.element(sortButton).toHaveAccessibleDescription('Sort descending')
    })

    it('should preserve a consumer-provided aria-labelledby', async () => {
      render(
        <>
          <span id="custom-column-name">Custom column name</span>
          <Table>
            <Table.Head>
              <Table.Row>
                <TableSortHeader
                  aria-labelledby="custom-column-name"
                  direction={SortDirection.ASC}
                  onToggleSort={() => {}}
                >
                  Visible column name
                </TableSortHeader>
              </Table.Row>
            </Table.Head>
          </Table>
        </>,
      )

      const header = page.getByRole('columnheader', {name: 'Custom column name', exact: true})

      await expect.element(header).toHaveAttribute('aria-labelledby', 'custom-column-name')
      await expect
        .element(page.getByRole('button', {name: 'Visible column name', exact: true}))
        .toHaveAccessibleDescription('Sort descending')
    })
  })

  describe('Table.Cell', () => {
    implementsClassName(
      props => (
        <Table>
          <Table.Body>
            <Table.Row>
              <Table.Cell {...props}>Cell</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      ),
      classes.TableCell,
    )

    it('should set the element to a <th> when `scope` is defined', async () => {
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
      await expect.element(page.getByRole('rowheader', {name: 'Cell', exact: true})).toBeInTheDocument()
    })

    it('should vertically align cell contents', async () => {
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
      await expect.element(page.getByRole('cell')).toHaveStyle('align-items: center')
    })
  })

  describe('Table.Skeleton', () => {
    implementsClassName(props => <Table.Skeleton columns={[]} {...props} />)

    it('should render a table with columns and loading content', async () => {
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

      await expect.element(page.getByRole('table', {name: 'Test', exact: true})).toBeInTheDocument()
      for (const column of columns) {
        await expect
          .element(page.getByRole('columnheader', {name: column.header as string, exact: true}))
          .toBeInTheDocument()
      }

      const cells = page.getByRole('cell').all()
      expect(cells).toHaveLength(columns.length)
      for (const cell of cells) {
        await expect.element(cell).toHaveTextContent('Loading')
      }
    })
  })

  describe('data-component attributes', () => {
    it('should have data-component="Table" on the table element', () => {
      const {container} = render(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header>Column</Table.Header>
            </Table.Row>
          </Table.Head>
        </Table>,
      )
      expect(container.querySelector('[data-component="Table"]')).toBeInTheDocument()
    })

    it('should have data-component="Table.Head" on the thead element', () => {
      const {container} = render(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header>Column</Table.Header>
            </Table.Row>
          </Table.Head>
        </Table>,
      )
      expect(container.querySelector('[data-component="Table.Head"]')).toBeInTheDocument()
    })

    it('should have data-component="Table.Body" on the tbody element', () => {
      const {container} = render(
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
      expect(container.querySelector('[data-component="Table.Body"]')).toBeInTheDocument()
    })

    it('should have data-component="Table.Row" on row elements', () => {
      const {container} = render(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header>Column</Table.Header>
            </Table.Row>
          </Table.Head>
        </Table>,
      )
      expect(container.querySelector('[data-component="Table.Row"]')).toBeInTheDocument()
    })

    it('should have data-component="Table.Header" on header cells', () => {
      const {container} = render(
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Header>Column</Table.Header>
            </Table.Row>
          </Table.Head>
        </Table>,
      )
      expect(container.querySelector('[data-component="Table.Header"]')).toBeInTheDocument()
    })

    it('should have data-component="Table.SortHeader" on sortable header cells', () => {
      const {container} = render(
        <DataTable
          data={[{id: 1, value: 'test'}]}
          columns={[
            {
              header: 'Value',
              field: 'value',
              sortBy: true,
            },
          ]}
        />,
      )
      expect(container.querySelector('[data-component="Table.SortHeader"]')).toBeInTheDocument()
    })

    it('should allow querying nested Button inside Table.SortHeader', () => {
      const {container} = render(
        <DataTable
          data={[{id: 1, value: 'test'}]}
          columns={[
            {
              header: 'Value',
              field: 'value',
              sortBy: true,
            },
          ]}
        />,
      )
      expect(container.querySelector('[data-component="Table.SortHeader.Button"]')).toBeInTheDocument()
    })

    it('should allow querying sort icons inside Table.SortHeader', () => {
      const {container} = render(
        <DataTable
          data={[{id: 1, value: 'test'}]}
          columns={[
            {
              header: 'Value',
              field: 'value',
              sortBy: true,
            },
          ]}
        />,
      )
      expect(
        container.querySelector('[data-component="Table.SortHeader"] [data-component="Octicon"]'),
      ).toBeInTheDocument()
    })

    it('should have data-component="Table.Cell" on cells', () => {
      const {container} = render(
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
      expect(container.querySelector('[data-component="Table.Cell"]')).toBeInTheDocument()
    })

    it('should have data-component="Table.Container" on container element', () => {
      const {container} = render(<Table.Container>Content</Table.Container>)
      expect(container.querySelector('[data-component="Table.Container"]')).toBeInTheDocument()
    })

    it('should have data-component="Table.Title" on title element', () => {
      const {container} = render(<Table.Title id="test">Title</Table.Title>)
      expect(container.querySelector('[data-component="Table.Title"]')).toBeInTheDocument()
    })

    it('should have data-component="Table.Subtitle" on subtitle element', () => {
      const {container} = render(<Table.Subtitle id="test">Subtitle</Table.Subtitle>)
      expect(container.querySelector('[data-component="Table.Subtitle"]')).toBeInTheDocument()
    })

    it('should have data-component="Table.Divider" on divider element', () => {
      const {container} = render(<Table.Divider />)
      expect(container.querySelector('[data-component="Table.Divider"]')).toBeInTheDocument()
    })

    it('should have data-component="Table.Actions" on actions element', () => {
      const {container} = render(<Table.Actions>Actions</Table.Actions>)
      expect(container.querySelector('[data-component="Table.Actions"]')).toBeInTheDocument()
    })
  })
})
