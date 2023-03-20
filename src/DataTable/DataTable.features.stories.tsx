import {DownloadIcon, KebabHorizontalIcon, PencilIcon, PlusIcon, TrashIcon} from '@primer/octicons-react'
import {action} from '@storybook/addon-actions'
import {Meta} from '@storybook/react'
import React from 'react'
import {ActionList} from '../ActionList'
import {ActionMenu} from '../ActionMenu'
import {Button, IconButton} from '../Button'
import {DataTable, Table} from '../DataTable'
import Heading from '../Heading'
import Label from '../Label'
import LabelGroup from '../LabelGroup'
import RelativeTime from '../RelativeTime'
import VisuallyHidden from '../_VisuallyHidden'

export default {
  title: 'Components/DataTable/Features',
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
            sortBy: 'alphanumeric',
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
            sortBy: 'datetime',
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

export const WithCustomSorting = () => {
  const rows = Array.from(data).sort((a, b) => {
    return b.updatedAt - a.updatedAt
  })
  const sortByDependabotFeatures = (a: Repo, b: Repo): number => {
    if (a.securityFeatures.dependabot.length > b.securityFeatures.dependabot.length) {
      return -1
    } else if (b.securityFeatures.dependabot.length < a.securityFeatures.dependabot.length) {
      return 1
    }
    return 0
  }
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
            sortBy: 'alphanumeric',
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
            sortBy: 'datetime',
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
            sortBy: sortByDependabotFeatures,
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

export const WithRowAction = () => (
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
        {
          id: 'actions',
          header: () => <VisuallyHidden>Actions</VisuallyHidden>,
          renderCell: row => {
            return (
              <IconButton
                aria-label={`Download: ${row.name}`}
                title={`Download: ${row.name}`}
                icon={DownloadIcon}
                variant="invisible"
                onClick={() => {
                  action('Download')(row)
                }}
              />
            )
          },
        },
      ]}
    />
  </Table.Container>
)

export const WithRowActions = () => (
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
        {
          id: 'actions',
          header: () => <VisuallyHidden>Actions</VisuallyHidden>,
          renderCell: row => {
            return (
              <>
                <IconButton
                  aria-label={`Edit: ${row.name}`}
                  title={`Edit: ${row.name}`}
                  icon={PencilIcon}
                  variant="invisible"
                  onClick={() => {
                    action('Edit')(row)
                  }}
                />
                <IconButton
                  aria-label={`Delete: ${row.name}`}
                  title={`Delete: ${row.name}`}
                  icon={TrashIcon}
                  variant="invisible"
                  onClick={() => {
                    action('Delete')(row)
                  }}
                />
              </>
            )
          },
        },
      ]}
    />
  </Table.Container>
)

export const WithRowActionMenu = () => (
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
        {
          id: 'actions',
          header: () => <VisuallyHidden>Actions</VisuallyHidden>,
          renderCell: row => {
            return (
              <ActionMenu>
                <ActionMenu.Anchor>
                  <IconButton
                    aria-label={`Actions: ${row.name}`}
                    title={`Actions: ${row.name}`}
                    icon={KebabHorizontalIcon}
                    variant="invisible"
                  />
                </ActionMenu.Anchor>
                <ActionMenu.Overlay>
                  <ActionList>
                    <ActionList.Item
                      onSelect={() => {
                        action('Copy')(row)
                      }}
                    >
                      Copy row
                    </ActionList.Item>
                    <ActionList.Item>Edit row</ActionList.Item>
                    <ActionList.Item>Export row as CSV</ActionList.Item>
                    <ActionList.Divider />
                    <ActionList.Item variant="danger">Delete row</ActionList.Item>
                  </ActionList>
                </ActionMenu.Overlay>
              </ActionMenu>
            )
          },
        },
      ]}
    />
  </Table.Container>
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
          header: 'grow w/ 200px max',
          field: 'name',
          rowHeader: true,
          width: 'grow',
          maxWidth: '200px',
        },
        {
          header: 'shrink w/ 100px min',
          field: 'type',
          renderCell: row => {
            return <Label>{uppercase(row.type)}</Label>
          },
          width: 'shrink',
          minWidth: '100px',
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
          header: 'undefined (defaults to grow)',
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

export const WithCustomHeading = () => (
  <>
    <Heading as="h2" id="repositories">
      Security coverage
    </Heading>
    <p id="repositories-subtitle">
      Organization members can only see data for the most recently-updated repositories. To see all repositories, talk
      to your organization administrator about becoming a security manager.
    </p>
    <Table.Container>
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
  </>
)
