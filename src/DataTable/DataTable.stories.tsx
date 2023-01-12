import {Table, TableHead, TableHeader, TableCell, TableBody, TableRow} from '../DataTable'

export default {
  title: 'Drafts/Components/DataTable',
  component: Table,
  subcomponents: {
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
  },
}

const data = [
  {
    id: 1,
    repository: 'codegl-dca-worker',
    type: 'private',
    updated: Date.now(),
    dependabot: [],
    codeScanning: [],
  },
  {
    id: 2,
    repository: 'aegir',
    type: 'public',
    updated: Date.now(),
    dependabot: [],
    codeScanning: [],
  },
  {
    id: 3,
    repository: 'codeql-ci-nightlies',
    type: 'public',
    updated: Date.now(),
    dependabot: [],
    codeScanning: [],
  },
  {
    id: 4,
    repository: 'dependabot-updates',
    type: 'public',
    updated: Date.now(),
    dependabot: [],
    codeScanning: [],
  },
  {
    id: 5,
    repository: 'tsx-create-react-app',
    type: 'public',
    updated: Date.now(),
    dependabot: [],
    codeScanning: [],
  },
  {
    id: 6,
    repository: 'bootstrap',
    type: 'public',
    updated: Date.now(),
    dependabot: [],
    codeScanning: [],
  },
  {
    id: 7,
    repository: 'docker-templates',
    type: 'public',
    updated: Date.now(),
    dependabot: [],
    codeScanning: [],
  },
]

export const Default = () => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Repository</TableHeader>
          <TableHeader>Type</TableHeader>
          <TableHeader>Updated</TableHeader>
          <TableHeader>Dependabot</TableHeader>
          <TableHeader>Code scanning</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {data.map(row => {
          return (
            <TableRow key={row.id}>
              <TableCell scope="row">{row.repository}</TableCell>
              <TableCell>{row.type}</TableCell>
              <TableCell>{row.updated}</TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
