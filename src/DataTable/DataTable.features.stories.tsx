import {DownloadIcon, PlusIcon} from '@primer/octicons-react'
import {Meta} from '@storybook/react'
import React from 'react'
import {Button, IconButton} from '../Button'
import {DataTable, Table} from '../DataTable'
import Heading from '../Heading'
import Label from '../Label'
import LabelGroup from '../LabelGroup'
import RelativeTime from '../RelativeTime'

export default {
  title: 'Drafts/Components/DataTable/Features',
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

export const WithTitle = () => (
  <Table.Container>
    <Table.Title as="h2" id="repositories">
      Repositories
    </Table.Title>
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

export const WithTitleAndSubtitle = () => (
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

export const WithSorting = () => {
  const rows = Array.from(data).sort((a, b) => {
    return b.updatedAt - a.updatedAt
  })
  return (
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
        data={rows}
        columns={[
          {
            header: 'Repository',
            field: 'name',
            rowHeader: true,
            sortBy: true,
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
            sortBy: true,
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
        initialSortColumn="updatedAt"
        initialSortDirection="DESC"
      />
    </Table.Container>
  )
}

export const WithAction = () => (
  <Table.Container>
    <Table.Title as="h2" id="repositories">
      Repositories
    </Table.Title>
    <Table.Actions>
      <Button>Action</Button>
    </Table.Actions>
    <Table.Divider />
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

export const WithActionOnly = () => (
  <>
    <Heading as="h2" id="table-title">
      Repositories
    </Heading>
    <Table.Container>
      <Table.Actions>
        <Button>Action</Button>
      </Table.Actions>
      <DataTable
        aria-labelledby="table-title"
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
  </>
)

export const WithActions = () => (
  <Table.Container>
    <Table.Title as="h2" id="repositories">
      Repositories
    </Table.Title>
    <Table.Actions>
      <IconButton aria-label="Download" icon={DownloadIcon} variant="invisible" />
      <IconButton aria-label="Add row" icon={PlusIcon} variant="invisible" />
    </Table.Actions>
    <Table.Divider />
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

export const WithActionsOnly = () => (
  <>
    <Heading as="h2" id="table-title">
      Repositories
    </Heading>
    <Table.Container>
      <Table.Actions>
        <IconButton aria-label="Download" icon={DownloadIcon} variant="invisible" />
        <IconButton aria-label="Add row" icon={PlusIcon} variant="invisible" />
      </Table.Actions>
      <DataTable
        aria-labelledby="table-title"
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
  </>
)

export const MixedColumnWidths = () => (
  <Table.Container>
    <Table.Title as="h2" id="repositories">
      Repositories
    </Table.Title>
    <DataTable
      aria-labelledby="repositories"
      aria-describedby="repositories-subtitle"
      data={data}
      columns={[
        {
          header: 'grow w/ 200px min',
          field: 'name',
          rowHeader: true,
          width: 'grow',
          minWidth: '200px',
        },
        {
          header: 'shrink w/ 100px max',
          field: 'type',
          renderCell: row => {
            return <Label>{uppercase(row.type)}</Label>
          },
          width: 'shrink',
          maxWidth: '100px',
        },
        {
          header: 'auto',
          field: 'updatedAt',
          renderCell: row => {
            return <RelativeTime date={new Date(row.updatedAt)} />
          },
          width: 'auto',
        },
        {
          header: '200px',
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
          width: '200px',
        },
        {
          header: 'undefined',
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

export const AllColumnWidthsGrow = () => (
  <Table.Container>
    <Table.Title as="h2" id="repositories">
      Repositories
    </Table.Title>
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

export const AllColumnWidthsShrink = () => (
  <Table.Container>
    <Table.Title as="h2" id="repositories">
      Repositories
    </Table.Title>
    <DataTable
      aria-labelledby="repositories"
      aria-describedby="repositories-subtitle"
      data={data}
      columns={[
        {
          header: 'Repository',
          field: 'name',
          rowHeader: true,
          width: 'shrink',
        },
        {
          header: 'Type',
          field: 'type',
          renderCell: row => {
            return <Label>{uppercase(row.type)}</Label>
          },
          width: 'shrink',
        },
        {
          header: 'Updated',
          field: 'updatedAt',
          renderCell: row => {
            return <RelativeTime date={new Date(row.updatedAt)} />
          },
          width: 'shrink',
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
          width: 'shrink',
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
          width: 'shrink',
        },
      ]}
    />
  </Table.Container>
)

export const AllColumnWidthsAuto = () => (
  <Table.Container>
    <Table.Title as="h2" id="repositories">
      Repositories
    </Table.Title>
    <DataTable
      aria-labelledby="repositories"
      aria-describedby="repositories-subtitle"
      data={data}
      columns={[
        {
          header: 'Repository',
          field: 'name',
          rowHeader: true,
          width: 'auto',
        },
        {
          header: 'Type',
          field: 'type',
          renderCell: row => {
            return <Label>{uppercase(row.type)}</Label>
          },
          width: 'auto',
        },
        {
          header: 'Updated',
          field: 'updatedAt',
          renderCell: row => {
            return <RelativeTime date={new Date(row.updatedAt)} />
          },
          width: 'auto',
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
          width: 'auto',
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
          width: 'auto',
        },
      ]}
    />
  </Table.Container>
)

export const AllColumnWidthsExplicit = () => (
  <Table.Container>
    <Table.Title as="h2" id="repositories">
      Repositories
    </Table.Title>
    <DataTable
      aria-labelledby="repositories"
      aria-describedby="repositories-subtitle"
      data={data}
      columns={[
        {
          header: 'Repository',
          field: 'name',
          rowHeader: true,
          width: '200px',
        },
        {
          header: 'Type',
          field: 'type',
          renderCell: row => {
            return <Label>{uppercase(row.type)}</Label>
          },
          width: '200px',
        },
        {
          header: 'Updated',
          field: 'updatedAt',
          renderCell: row => {
            return <RelativeTime date={new Date(row.updatedAt)} />
          },
          width: '200px',
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
          width: '200px',
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
          width: '200px',
        },
      ]}
    />
  </Table.Container>
)

export const AllColumnWidthsGrowWithMaxWidth = () => (
  <Table.Container>
    <Table.Title as="h2" id="repositories">
      Repositories
    </Table.Title>
    <DataTable
      aria-labelledby="repositories"
      aria-describedby="repositories-subtitle"
      data={data}
      columns={[
        {
          header: 'Repository',
          field: 'name',
          rowHeader: true,
          maxWidth: '200px',
        },
        {
          header: 'Type',
          field: 'type',
          renderCell: row => {
            return <Label>{uppercase(row.type)}</Label>
          },
          maxWidth: '200px',
        },
        {
          header: 'Updated',
          field: 'updatedAt',
          renderCell: row => {
            return <RelativeTime date={new Date(row.updatedAt)} />
          },
          maxWidth: '200px',
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
          maxWidth: '200px',
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
          maxWidth: '200px',
        },
      ]}
    />
  </Table.Container>
)

export const AllColumnWidthsGrowWithMinWidth = () => (
  <Table.Container>
    <Table.Title as="h2" id="repositories">
      Repositories
    </Table.Title>
    <DataTable
      aria-labelledby="repositories"
      aria-describedby="repositories-subtitle"
      data={data}
      columns={[
        {
          header: 'Repository',
          field: 'name',
          rowHeader: true,
          minWidth: '200px',
        },
        {
          header: 'Type',
          field: 'type',
          renderCell: row => {
            return <Label>{uppercase(row.type)}</Label>
          },
          minWidth: '200px',
        },
        {
          header: 'Updated',
          field: 'updatedAt',
          renderCell: row => {
            return <RelativeTime date={new Date(row.updatedAt)} />
          },
          minWidth: '200px',
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
          minWidth: '200px',
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
          minWidth: '200px',
        },
      ]}
    />
  </Table.Container>
)
