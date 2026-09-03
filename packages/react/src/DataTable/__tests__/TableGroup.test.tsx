import {describe, expect, it} from 'vitest'
import {render, screen, within} from '@testing-library/react'
import {renderToString} from 'react-dom/server'
import {Table} from '../../DataTable'
import {implementsClassName} from '../../utils/testing'
import classes from '../Table.module.css'

const columnHeaderIds = ['col-name', 'col-role']

function ColumnHeaders() {
  return (
    <Table.Head>
      <Table.Row>
        <Table.Header id={columnHeaderIds[0]}>Name</Table.Header>
        <Table.Header id={columnHeaderIds[1]}>Role</Table.Header>
      </Table.Row>
    </Table.Head>
  )
}

function MemberCells() {
  return (
    <>
      {null}
      <Table.Cell headers={columnHeaderIds[0]}>Mona</Table.Cell>
      <Table.Cell headers={columnHeaderIds[1]}>Admin</Table.Cell>
    </>
  )
}

describe('Table.Group', () => {
  implementsClassName(
    props => (
      <Table>
        <Table.Group id="admins" label="Admins" rowCount={0} colSpan={columnHeaderIds.length} {...props} />
      </Table>
    ),
    classes.TableGroupHeaderBody,
  )

  it('renders the group header and member rows as two sibling <tbody> elements', () => {
    const {container} = render(
      <Table>
        <ColumnHeaders />
        <Table.Group id="admins" label="Admins" rowCount={1} colSpan={columnHeaderIds.length}>
          <Table.Row>
            <Table.Cell>Mona</Table.Cell>
            <Table.Cell>Admin</Table.Cell>
          </Table.Row>
        </Table.Group>
      </Table>,
    )

    const table = container.querySelector('table')
    const tbodies = table?.querySelectorAll(':scope > tbody')
    expect(tbodies).toHaveLength(2)
    expect(tbodies?.[0].querySelectorAll('tr')).toHaveLength(1)
    expect(tbodies?.[1].querySelectorAll('tr')).toHaveLength(1)
    expect(tbodies?.[0]).toHaveAttribute('data-group-id', 'admins')
    expect(tbodies?.[1]).toHaveAttribute('data-group-id', 'admins')
  })

  it('renders a native colgroup-scoped header cell spanning every column', () => {
    render(
      <Table>
        <ColumnHeaders />
        <Table.Group id="admins" label="Admins" rowCount={2} colSpan={columnHeaderIds.length}>
          <Table.Row>
            <Table.Cell>Mona</Table.Cell>
            <Table.Cell>Admin</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell>Hubot</Table.Cell>
            <Table.Cell>Admin</Table.Cell>
          </Table.Row>
        </Table.Group>
      </Table>,
    )

    const groupHeader = screen.getByRole('columnheader', {name: 'Admins, 2 rows'})
    expect(groupHeader.tagName).toBe('TH')
    expect(groupHeader).toHaveAttribute('scope', 'colgroup')
    expect(groupHeader).toHaveAttribute('colspan', '2')
  })

  it.each([
    [1, 'Admins, 1 row'],
    [2, 'Admins, 2 rows'],
    [0, 'Admins, 0 rows'],
  ])('builds an accessible name from the label and row count (rowCount=%s)', (rowCount, expectedName) => {
    render(
      <Table>
        <ColumnHeaders />
        <Table.Group id="admins" label="Admins" rowCount={rowCount} colSpan={columnHeaderIds.length}>
          <Table.Row>
            <Table.Cell>Mona</Table.Cell>
            <Table.Cell>Admin</Table.Cell>
          </Table.Row>
        </Table.Group>
      </Table>,
    )

    expect(screen.getByRole('columnheader', {name: expectedName})).toBeInTheDocument()
  })

  it('exposes visible label/count text while keeping the group header name concise', () => {
    render(
      <Table>
        <ColumnHeaders />
        <Table.Group id="admins" label="Admins" rowCount={2} colSpan={columnHeaderIds.length}>
          <Table.Row>
            <Table.Cell>Mona</Table.Cell>
            <Table.Cell>Admin</Table.Cell>
          </Table.Row>
        </Table.Group>
      </Table>,
    )

    const groupHeader = screen.getByRole('columnheader', {name: 'Admins, 2 rows'})
    expect(within(groupHeader).getByText('Admins')).toBeInTheDocument()
    expect(within(groupHeader).getByText('2')).toBeInTheDocument()
    expect(groupHeader.firstElementChild).not.toHaveAttribute('aria-hidden')
  })

  it("associates member cells with both the group header and their column's header", () => {
    render(
      <Table>
        <ColumnHeaders />
        <Table.Group id="admins" label="Admins" rowCount={1} colSpan={columnHeaderIds.length}>
          <Table.Row>
            <Table.Cell headers={columnHeaderIds[0]}>Mona</Table.Cell>
            <Table.Cell headers={columnHeaderIds[1]}>Admin</Table.Cell>
          </Table.Row>
        </Table.Group>
      </Table>,
    )

    const groupHeader = screen.getByRole('columnheader', {name: 'Admins, 1 row'})
    const nameCell = screen.getByRole('cell', {name: 'Mona'})
    const roleCell = screen.getByRole('cell', {name: 'Admin'})

    expect(nameCell).toHaveAttribute('headers', `${groupHeader.id} col-name`)
    expect(roleCell).toHaveAttribute('headers', `${groupHeader.id} col-role`)
  })

  it('preserves explicit header associations for cells rendered by wrapper components', () => {
    render(
      <Table>
        <ColumnHeaders />
        <Table.Group id="admins" label="Admins" rowCount={1} colSpan={columnHeaderIds.length}>
          <Table.Row>
            <MemberCells />
          </Table.Row>
        </Table.Group>
      </Table>,
    )

    const groupHeader = screen.getByRole('columnheader', {name: 'Admins, 1 row'})
    expect(screen.getByRole('cell', {name: 'Mona'})).toHaveAttribute('headers', `${groupHeader.id} col-name`)
    expect(screen.getByRole('cell', {name: 'Admin'})).toHaveAttribute('headers', `${groupHeader.id} col-role`)
  })

  it('does not leak group header associations into nested tables', () => {
    const {container} = render(
      <Table>
        <ColumnHeaders />
        <Table.Group id="admins" label="Admins" rowCount={1} colSpan={columnHeaderIds.length}>
          <Table.Row>
            <Table.Cell headers={columnHeaderIds[0]}>
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Header id="nested-column">Nested column</Table.Header>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>Nested value</Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            </Table.Cell>
            <Table.Cell headers={columnHeaderIds[1]}>Admin</Table.Cell>
          </Table.Row>
        </Table.Group>
      </Table>,
    )

    const nestedCell = container.querySelector<HTMLElement>(
      '[data-component="Table"] [data-component="Table"] [data-component="Table.Cell"]',
    )
    expect(nestedCell).not.toHaveAttribute('headers')
  })

  it('allows the group header accessible name to be localized', () => {
    render(
      <Table>
        <ColumnHeaders />
        <Table.Group
          id="admins"
          label="Administrateurs"
          rowCount={2}
          aria-label="Administrateurs, 2 lignes"
          colSpan={columnHeaderIds.length}
        />
      </Table>,
    )

    expect(screen.getByRole('columnheader', {name: 'Administrateurs, 2 lignes'})).toBeInTheDocument()
  })

  it('prepends the group header to consumer-supplied `headers` associations', () => {
    render(
      <Table>
        <ColumnHeaders />
        <Table.Group id="admins" label="Admins" rowCount={1} colSpan={columnHeaderIds.length}>
          <Table.Row>
            <Table.Cell headers={`${columnHeaderIds[0]} extra-ref`}>Mona</Table.Cell>
            <Table.Cell>Admin</Table.Cell>
          </Table.Row>
        </Table.Group>
      </Table>,
    )

    const groupHeader = screen.getByRole('columnheader', {name: 'Admins, 1 row'})
    const nameCell = screen.getByRole('cell', {name: 'Mona'})
    expect(nameCell).toHaveAttribute('headers', `${groupHeader.id} col-name extra-ref`)
  })

  it('gives each group header a non-colliding id, even with duplicate consumer-supplied group ids', () => {
    render(
      <>
        <Table>
          <ColumnHeaders />
          <Table.Group id="admins" label="Admins" rowCount={1} colSpan={columnHeaderIds.length}>
            <Table.Row>
              <Table.Cell>Mona</Table.Cell>
              <Table.Cell>Admin</Table.Cell>
            </Table.Row>
          </Table.Group>
          <Table.Group id="admins" label="Owners" rowCount={1} colSpan={columnHeaderIds.length}>
            <Table.Row>
              <Table.Cell>Hubot</Table.Cell>
              <Table.Cell>Owner</Table.Cell>
            </Table.Row>
          </Table.Group>
        </Table>
        <Table>
          <ColumnHeaders />
          <Table.Group id="admins" label="Admins" rowCount={1} colSpan={columnHeaderIds.length}>
            <Table.Row>
              <Table.Cell>Octocat</Table.Cell>
              <Table.Cell>Admin</Table.Cell>
            </Table.Row>
          </Table.Group>
        </Table>
      </>,
    )

    const groupHeaders = screen.getAllByRole('columnheader', {name: /Admins|Owners/})
    const ids = groupHeaders.map(header => header.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) {
      expect(id.length).toBeGreaterThan(0)
      expect(id).not.toMatch(/\s/)
    }
  })

  it('does not add a `headers` attribute to cells in an ungrouped table', () => {
    render(
      <Table>
        <ColumnHeaders />
        <Table.Body>
          <Table.Row>
            <Table.Cell>Mona</Table.Cell>
            <Table.Cell>Admin</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>,
    )

    expect(screen.getByRole('cell', {name: 'Mona'})).not.toHaveAttribute('headers')
    expect(screen.getByRole('cell', {name: 'Admin'})).not.toHaveAttribute('headers')
  })

  it('includes complete group and column associations in server-rendered markup', () => {
    const markup = renderToString(
      <Table>
        <ColumnHeaders />
        <Table.Group id="admins" label="Admins" rowCount={1} colSpan={columnHeaderIds.length}>
          <Table.Row>
            <Table.Cell headers={columnHeaderIds[0]}>Mona</Table.Cell>
            <Table.Cell headers={columnHeaderIds[1]}>Admin</Table.Cell>
          </Table.Row>
        </Table.Group>
      </Table>,
    )
    const container = document.createElement('div')
    container.innerHTML = markup

    const groupHeader = container.querySelector<HTMLElement>('[data-component="Table.Group.Header"]')
    const cells = container.querySelectorAll<HTMLElement>(
      '[data-component="Table.Group.Body"] [data-component="Table.Cell"]',
    )

    expect(groupHeader?.id).toBeTruthy()
    expect(cells[0]).toHaveAttribute('headers', `${groupHeader?.id} ${columnHeaderIds[0]}`)
    expect(cells[1]).toHaveAttribute('headers', `${groupHeader?.id} ${columnHeaderIds[1]}`)
  })
})
