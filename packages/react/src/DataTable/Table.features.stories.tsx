import type {Meta} from '@storybook/react-vite'
import {useId} from 'react'
import {Table} from '../DataTable'

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
