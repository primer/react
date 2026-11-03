import {describe, expect, it} from 'vitest'
import {render} from '@testing-library/react'
import {page} from 'vitest/browser'
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

  it('renders a native colgroup-scoped header cell spanning every column', async () => {
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

    const groupHeader = page.getByRole('columnheader', {name: /^Admins\s*, 2 rows$/})
    expect(groupHeader.element().tagName).toBe('TH')
    await expect.element(groupHeader).toHaveAttribute('scope', 'colgroup')
    await expect.element(groupHeader).toHaveAttribute('colspan', '2')
  })

  it.each([
    [1, /^Admins\s*, 1 row$/],
    [2, /^Admins\s*, 2 rows$/],
    [0, /^Admins\s*, 0 rows$/],
  ])('builds an accessible name from the label and row count (rowCount=%s)', async (rowCount, expectedName) => {
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

    const groupHeader = page.getByRole('columnheader', {name: expectedName})
    await expect.element(groupHeader).not.toHaveAttribute('aria-label')
    await expect.element(groupHeader).toHaveTextContent(`Admins,${rowCount} ${rowCount === 1 ? 'row' : 'rows'}`)
    expect(groupHeader.element().querySelector('[aria-hidden="true"]')).toBeNull()
  })

  it('exposes visible label/count text while keeping the group header name concise', async () => {
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

    const groupHeader = page.getByRole('columnheader', {name: /^Admins\s*, 2 rows$/})
    await expect.element(groupHeader.getByText(/^Admins\s*,$/)).toBeVisible()
    await expect.element(groupHeader.getByText(/^2\s+rows$/)).toBeVisible()
  })

  it("associates member cells with both the group header and their column's header", async () => {
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

    const groupHeader = page.getByRole('columnheader', {name: /^Admins\s*, 1 row$/})
    const nameCell = page.getByRole('cell', {name: 'Mona', exact: true})
    const roleCell = page.getByRole('cell', {name: 'Admin', exact: true})

    await expect.element(nameCell).toHaveAttribute('headers', `${groupHeader.element().id} col-name`)
    await expect.element(roleCell).toHaveAttribute('headers', `${groupHeader.element().id} col-role`)
  })

  it('preserves explicit header associations for cells rendered by wrapper components', async () => {
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

    const groupHeader = page.getByRole('columnheader', {name: /^Admins\s*, 1 row$/})
    await expect
      .element(page.getByRole('cell', {name: 'Mona', exact: true}))
      .toHaveAttribute('headers', `${groupHeader.element().id} col-name`)
    await expect
      .element(page.getByRole('cell', {name: 'Admin', exact: true}))
      .toHaveAttribute('headers', `${groupHeader.element().id} col-role`)
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

  it('allows the group header accessible name to be localized', async () => {
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

    await expect
      .element(page.getByRole('columnheader', {name: 'Administrateurs, 2 lignes', exact: true}))
      .toBeInTheDocument()
  })

  it('prepends the group header to consumer-supplied `headers` associations', async () => {
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

    const groupHeader = page.getByRole('columnheader', {name: /^Admins\s*, 1 row$/})
    const nameCell = page.getByRole('cell', {name: 'Mona', exact: true})
    await expect.element(nameCell).toHaveAttribute('headers', `${groupHeader.element().id} col-name extra-ref`)
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

    const groupHeaders = page.getByRole('columnheader', {name: /Admins|Owners/}).elements()
    expect(groupHeaders).toHaveLength(3)
    const ids = groupHeaders.map(header => header.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const id of ids) {
      expect(id.length).toBeGreaterThan(0)
      expect(id).not.toMatch(/\s/)
    }
  })

  it('does not add a `headers` attribute to cells in an ungrouped table', async () => {
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

    await expect.element(page.getByRole('cell', {name: 'Mona', exact: true})).not.toHaveAttribute('headers')
    await expect.element(page.getByRole('cell', {name: 'Admin', exact: true})).not.toHaveAttribute('headers')
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
