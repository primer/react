import {DataTable} from './DataTable'
export default {title: 'Data/DataTable', component: DataTable}
export const Default = () => (
  <DataTable
    data={[{id: 1, name: 'Primer', stars: 42}]}
    columns={[
      {field: 'name', header: 'Repository', rowHeader: true},
      {field: 'stars', header: 'Stars', sortBy: true},
    ]}
  />
)
