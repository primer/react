import React from 'react'
import {Meta} from '@storybook/react'

import {BaseStyles, ThemeProvider} from '..'
import {Cell, DataTable} from '.'

const tableData = [
  {
    name: 'codeql-dca-worker',
    type: 'internal',
    updated: 3145749445955,
    securityFeatures: {
      dependabot: ['alerts', 'security updates'],
      codeScanning: ['report secrets'],
    },
  },
  {
    name: 'aegir',
    type: 'public',
    updated: 3153353249088,
    securityFeatures: {
      dependabot: ['alerts'],
      codeScanning: ['report secrets'],
    },
  },
  {
    name: 'strapi',
    type: 'public',
    updated: 2020718162170,
    securityFeatures: {
      dependabot: [],
      codeScanning: [],
    },
  },
  {
    name: 'codeql-ci-nightlies',
    type: 'public',
    updated: 2421561914446,
    securityFeatures: {
      dependabot: ['alerts'],
      codeScanning: [],
    },
  },
  {
    name: 'dependabot-updates',
    type: 'public',
    updated: 2155167276558,
    securityFeatures: {
      dependabot: [],
      codeScanning: [],
    },
  },
  {
    name: 'tsx-create-react-app',
    type: 'public',
    updated: 2743119050744,
    securityFeatures: {
      dependabot: [],
      codeScanning: [],
    },
  },
  {
    name: 'bootstrap',
    type: 'public',
    updated: 1969672358093,
    securityFeatures: {
      dependabot: ['alerts'],
      codeScanning: [],
    },
  },
  {
    name: 'docker-templates',
    type: 'public',
    updated: 2566726175026,
    securityFeatures: {
      dependabot: ['alerts'],
      codeScanning: [],
    },
  },
]

export default {
  title: 'DataTable',
  decorators: [
    Story => {
      return (
        <ThemeProvider>
          <BaseStyles>
            <Story />
          </BaseStyles>
        </ThemeProvider>
      )
    },
  ],
} as Meta

export const Basic = () => (
  <DataTable
    data={tableData}
    initialSort={{by: 'name', order: 'asc'}}
    columns={[
      {field: 'name'},
      {field: 'type'},
      {field: 'updated', renderCell: data => <Cell>{new Date(data.updated).toUTCString()}</Cell>},
      {
        field: 'securityFeatures.dependabot',
        renderCell: data => <Cell>{data.securityFeatures.dependabot.join(', ')}</Cell>,
        header: 'Dependabot',
      },
      {
        field: 'securityFeatures.codeScanning',
        renderCell: data => <Cell>{data.securityFeatures.dependabot.join(', ')}</Cell>,
        header: 'Code Scanning',
      },
    ]}
  />
)

// // Basic usage where a cell renders nested data
// export const BasicNestedData = () => (
//   <DataTable data={tableData} initialSort={{by: 'name', order: 'asc'}}>
//     {[{field: 'name'}, {field: 'type'}, {field: 'securityFeatures.codeScanning'}]}
//   </DataTable>
// )

// // Basic usage where a cell renders formatted data
// export const BasicCustomRenderCell = () => (
//   <DataTable data={tableData} initialSort={{by: 'name', order: 'asc'}}>
//     {[
//       {field: 'name'},
//       {field: 'type'},
//       {children: a => <Cell>{new Date(a.updated).toUTCString()}</Cell>, field: 'updated', sortType: 'number'}, // `sortType` is 'number' because the data for `updated` is a unix timestamp, not an actual date
//     ]}
//   </DataTable>
// )

// With an action column

// With a cell that has a leading visual

// With a custom sort fn

// With a checkbox column

// With a table header
