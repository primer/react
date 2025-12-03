import {DataTable} from '../experimental'
import figma from '@figma/code-connect'

const data = [
  {
    id: 1,
    name: 'Example',
  },
]

figma.connect(DataTable, 'https://www.figma.com/design/GCvY3Qv8czRgZgvl1dG6lp/Primer-Web?node-id=28591%3A24975', {
  example: () => (
    <DataTable
      data={data}
      columns={[
        {
          header: 'Example',
          field: 'name',
          rowHeader: true,
        },
      ]}
    />
  ),
})
