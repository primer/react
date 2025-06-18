import type {Meta, StoryObj} from '@storybook/react-vite'
import React from 'react'
import type {DataTableProps} from '../DataTable'
import {DataTable, Table} from '../DataTable'
import Label from '../Label'
import LabelGroup from '../LabelGroup'
import RelativeTime from '../RelativeTime'
import type {CellAlignment} from './column'
import type {UniqueRow} from './row'
import type {ColWidthArgTypes} from './storyHelpers'
import {getColumnWidthArgTypes} from './storyHelpers'

export default {
  title: 'Experimental/Components/DataTable',
  component: DataTable,
} as Meta<typeof DataTable>

const now = Date.now()
const Second = 1000
const Minute = 60 * Second
const Hour = 60 * Minute
const Day = 24 * Hour
const Week = 7 * Day
const Month = 4 * Week

interface Repo {
  id: number
  name: string
  type: 'public' | 'internal'
  updatedAt: number
  securityFeatures: {
    dependabot: Array<string>
    codeScanning: Array<string>
  }
}

const data: Array<Repo> = [
  {
    id: 1,
    name: 'codeql-dca-worker',
    type: 'internal',
    updatedAt: now,
    securityFeatures: {
      dependabot: ['alerts', 'security updates'],
      codeScanning: ['report secrets'],
    },
  },
  {
    id: 2,
    name: 'aegir',
    type: 'public',
    updatedAt: now - 5 * Minute,
    securityFeatures: {
      dependabot: ['alerts'],
      codeScanning: ['report secrets'],
    },
  },
  {
    id: 3,
    name: 'strapi',
    type: 'public',
    updatedAt: now - 1 * Hour,
    securityFeatures: {
      dependabot: [],
      codeScanning: [],
    },
  },
  {
    id: 4,
    name: 'codeql-ci-nightlies',
    type: 'public',
    updatedAt: now - 6 * Hour,
    securityFeatures: {
      dependabot: ['alerts'],
      codeScanning: [],
    },
  },
  {
    id: 5,
    name: 'dependabot-updates',
    type: 'public',
    updatedAt: now - 1 * Day,
    securityFeatures: {
      dependabot: [],
      codeScanning: [],
    },
  },
  {
    id: 6,
    name: 'tsx-create-react-app',
    type: 'public',
    updatedAt: now - 1 * Week,
    securityFeatures: {
      dependabot: [],
      codeScanning: [],
    },
  },
  {
    id: 7,
    name: 'bootstrap',
    type: 'public',
    updatedAt: now - 1 * Month,
    securityFeatures: {
      dependabot: ['alerts'],
      codeScanning: [],
    },
  },
  {
    id: 8,
    name: 'docker-templates',
    type: 'public',
    updatedAt: now - 3 * Month,
    securityFeatures: {
      dependabot: ['alerts'],
      codeScanning: [],
    },
  },
]

function uppercase(input: string): string {
  return input[0].toUpperCase() + input.slice(1)
}

export const Default = () => (
  <Table.Container>
    <Table.Title as="h2" id="repositories">
      Repositories
    </Table.Title>
    <Table.Subtitle as="p" id="repositories-subtitle">
      A subtitle could appear here to give extra context to the data.
    </Table.Subtitle>
    <DataTable
      aria-labelledby="repositories"
      aria-describedby="repositories-subtitle"
      data={data}
      columns={[
        {
          header: 'Repository',
          field: 'name',
          rowHeader: true,
        },
        {
          header: 'Type',
          field: 'type',
          renderCell: row => {
            return <Label>{uppercase(row.type)}</Label>
          },
        },
        {
          header: 'Updated',
          field: 'updatedAt',
          renderCell: row => {
            return <RelativeTime date={new Date(row.updatedAt)} />
          },
        },
        {
          header: 'Dependabot',
          field: 'securityFeatures.dependabot',
          renderCell: row => {
            return row.securityFeatures.dependabot.length > 0 ? (
              <LabelGroup>
                {row.securityFeatures.dependabot.map(feature => {
                  return <Label key={feature}>{uppercase(feature)}</Label>
                })}
              </LabelGroup>
            ) : null
          },
        },
        {
          header: 'Code scanning',
          field: 'securityFeatures.codeScanning',
          renderCell: row => {
            return row.securityFeatures.codeScanning.length > 0 ? (
              <LabelGroup>
                {row.securityFeatures.codeScanning.map(feature => {
                  return <Label key={feature}>{uppercase(feature)}</Label>
                })}
              </LabelGroup>
            ) : null
          },
        },
      ]}
    />
  </Table.Container>
)

export const Playground: StoryObj<DataTableProps<UniqueRow> & ColWidthArgTypes> = {
  render: (args: DataTableProps<UniqueRow> & ColWidthArgTypes) => {
    const getColWidth = (colIndex: number) => {
      return args[`colWidth${colIndex}`] !== 'explicit width'
        ? args[`colWidth${colIndex}`]
        : args[`explicitColWidth${colIndex}`]
          ? args[`explicitColWidth${colIndex}`]
          : 'grow'
    }

    const align = args.align as CellAlignment

    const [pageIndex, setPageIndex] = React.useState(0)
    const start = pageIndex * parseInt(args.pageSize, 10)
    const end = start + parseInt(args.pageSize, 10)
    const rows = data.slice(start, end)

    return (
      <Table.Container>
        <Table.Title as="h2" id="repositories">
          Repositories
        </Table.Title>
        <Table.Subtitle as="p" id="repositories-subtitle">
          A subtitle could appear here to give extra context to the data.
        </Table.Subtitle>
        <DataTable
          {...args}
          aria-labelledby="repositories"
          aria-describedby="repositories-subtitle"
          data={rows}
          columns={[
            {
              header: 'Repository',
              field: 'name',
              rowHeader: true,
              width: getColWidth(0),
              minWidth: args.minColWidth0,
              maxWidth: args.maxColWidth0,
              align,
            },
            {
              header: 'Type',
              field: 'type',
              renderCell: row => {
                return <Label>{uppercase(row.type)}</Label>
              },
              width: getColWidth(1),
              minWidth: args.minColWidth1,
              maxWidth: args.maxColWidth1,
              align,
            },
            {
              header: 'Updated',
              field: 'updatedAt',
              renderCell: row => {
                return <RelativeTime date={new Date(row.updatedAt)} />
              },
              width: getColWidth(2),
              minWidth: args.minColWidth2,
              maxWidth: args.maxColWidth2,
              align,
            },
            {
              header: 'Dependabot',
              field: 'securityFeatures.dependabot',
              renderCell: row => {
                return row.securityFeatures.dependabot.length > 0 ? (
                  <LabelGroup>
                    {row.securityFeatures.dependabot.map(feature => {
                      return <Label key={feature}>{uppercase(feature)}</Label>
                    })}
                  </LabelGroup>
                ) : null
              },
              width: getColWidth(3),
              minWidth: args.minColWidth3,
              maxWidth: args.maxColWidth3,
              align,
            },
            {
              header: 'Code scanning',
              field: 'securityFeatures.codeScanning',
              renderCell: row => {
                return row.securityFeatures.codeScanning.length > 0 ? (
                  <LabelGroup>
                    {row.securityFeatures.codeScanning.map(feature => {
                      return <Label key={feature}>{uppercase(feature)}</Label>
                    })}
                  </LabelGroup>
                ) : null
              },
              width: getColWidth(4),
              minWidth: args.minColWidth4,
              maxWidth: args.maxColWidth4,
              align,
            },
          ]}
        />
        <Table.Pagination
          aria-label="Pagination for Repositories"
          pageSize={parseInt(args.pageSize, 10)}
          totalCount={data.length}
          onChange={({pageIndex}) => {
            setPageIndex(pageIndex)
          }}
          defaultPageIndex={parseInt(args.defaultPageIndex, 10)}
        />
      </Table.Container>
    )
  },
  args: {
    cellPadding: 'normal',
    // @ts-expect-error it seems like args is not being correctly inferred
    pageSize: 5,
  },
  // @ts-expect-error it seems like arg types with column helpers are not working as intended
  argTypes: {
    align: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['start', 'end'],
      },
    },
    'aria-describedby': {
      control: false,
      table: {
        disable: true,
      },
    },
    'aria-labelledby': {
      control: false,
      table: {
        disable: true,
      },
    },
    columns: {
      control: false,
      table: {
        disable: true,
      },
    },
    data: {
      control: false,
      table: {
        disable: true,
      },
    },
    pageSize: {
      control: {
        defaultValue: 5,
        type: 'number',
        min: 1,
      },
    },
    defaultPageIndex: {
      control: {
        type: 'number',
      },
    },
    cellPadding: {
      control: {
        type: 'radio',
      },
      type: {
        name: 'enum',
        value: ['condensed', 'normal', 'spacious'],
      },
    },
    ...getColumnWidthArgTypes(5),
  },
}
