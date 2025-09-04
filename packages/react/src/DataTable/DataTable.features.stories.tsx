import {
  BookIcon,
  DownloadIcon,
  KebabHorizontalIcon,
  PencilIcon,
  PlusIcon,
  RepoIcon,
  TrashIcon,
} from '@primer/octicons-react'
import {action} from 'storybook/actions'
import type {Meta} from '@storybook/react-vite'
import React from 'react'
import {ActionList} from '../ActionList'
import {ActionMenu} from '../ActionMenu'
import {Blankslate} from '../Blankslate'
import {Button, IconButton} from '../Button'
import {DataTable, Table} from '../DataTable'
import Heading from '../Heading'
import Label from '../Label'
import LabelGroup from '../LabelGroup'
import RelativeTime from '../RelativeTime'
import VisuallyHidden from '../_VisuallyHidden'
import {createColumnHelper} from './column'
import {fetchRepos, repos, useFlakeyQuery} from './storybook/data'
import classes from './DataTable.features.stories.module.css'

export default {
  title: 'Experimental/Components/DataTable/Features',
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
    updatedAt: 1725494400000, // '2024-09-05T00:00:00.000Z'
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
          header: 'growCollapse w/ 100px min',
          field: 'type',
          renderCell: row => {
            return <Label>{uppercase(row.type)}</Label>
          },
          width: 'growCollapse',
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

export const WithNoContent = () => {
  const exampleEmptyData: Array<Repo> = []
  return exampleEmptyData.length === 0 ? (
    <Blankslate border>
      <Blankslate.Visual>
        <BookIcon size="medium" />
      </Blankslate.Visual>
      <Blankslate.Heading>Blankslate heading</Blankslate.Heading>
      <Blankslate.Description>Use it to provide information when no dynamic content exists.</Blankslate.Description>
      <Blankslate.PrimaryAction href="#">Primary action</Blankslate.PrimaryAction>
      <Blankslate.SecondaryAction href="#">Secondary action link</Blankslate.SecondaryAction>
    </Blankslate>
  ) : (
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
        data={exampleEmptyData}
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
}

export const WithOverflow = () => (
  <div
    style={{
      width: 500,
    }}
  >
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
  </div>
)

const columnHelper = createColumnHelper<Repo>()
const columns = [
  columnHelper.column({
    header: 'Repository',
    field: 'name',
    rowHeader: true,
  }),
  columnHelper.column({
    header: 'Type',
    field: 'type',
    renderCell: row => {
      return <Label>{uppercase(row.type)}</Label>
    },
  }),
  columnHelper.column({
    header: 'Updated',
    field: 'updatedAt',
    renderCell: row => {
      return <RelativeTime date={new Date(row.updatedAt)} />
    },
  }),
  columnHelper.column({
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
  }),
  columnHelper.column({
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
  }),
]

export const WithLoading = () => {
  const [loading] = React.useState(true)
  return (
    <Table.Container>
      <Table.Title as="h2" id="repositories">
        Repositories
      </Table.Title>
      <Table.Subtitle as="p" id="repositories-subtitle">
        A subtitle could appear here to give extra context to the data.
      </Table.Subtitle>
      {loading ? (
        <Table.Skeleton
          aria-labelledby="repositories"
          aria-describedby="repositories-subtitle"
          columns={columns}
          rows={10}
        />
      ) : (
        <DataTable
          aria-labelledby="repositories"
          aria-describedby="repositories-subtitle"
          data={data}
          columns={columns}
        />
      )}
    </Table.Container>
  )
}

export const WithPlaceholderCells = () => (
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
            ) : (
              <Table.CellPlaceholder>Not configured</Table.CellPlaceholder>
            )
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
            ) : (
              <Table.CellPlaceholder>Not configured</Table.CellPlaceholder>
            )
          },
        },
      ]}
    />
  </Table.Container>
)

export const WithRightAlignedColumns = () => {
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
            header: () => (
              <div className={classes.RepositoryHeader}>
                <RepoIcon size={16} />
                Repository
              </div>
            ),
            field: 'name',
            rowHeader: true,
            sortBy: 'alphanumeric',
            align: 'end',
          },
          {
            header: 'Type',
            field: 'type',
            renderCell: row => {
              return <Label>{uppercase(row.type)}</Label>
            },
            align: 'end',
          },
          {
            header: 'Updated',
            field: 'updatedAt',
            sortBy: 'datetime',
            renderCell: row => {
              return <RelativeTime date={new Date(row.updatedAt)} />
            },
            align: 'end',
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
            align: 'end',
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
            align: 'end',
          },
        ]}
        initialSortColumn="updatedAt"
        initialSortDirection="DESC"
      />
    </Table.Container>
  )
}

export const WithSortEvents = () => (
  <Table.Container>
    <Table.Title as="h2" id="repositories">
      Repositories
    </Table.Title>
    <Table.Subtitle as="p" id="repositories-subtitle">
      Click any sortable header and watch the Actions panel.
    </Table.Subtitle>

    <DataTable
      aria-labelledby="repositories"
      aria-describedby="repositories-subtitle"
      data={data}
      onToggleSort={(columnId, direction) => action('onToggleSort')({columnId, direction})}
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
          renderCell: row => <Label>{uppercase(row.type)}</Label>,
        },
        {
          header: 'Updated',
          field: 'updatedAt',
          sortBy: 'datetime',
          renderCell: row => <RelativeTime date={new Date(row.updatedAt)} />,
        },
        {
          header: 'Dependabot',
          field: 'securityFeatures.dependabot',
          renderCell: row =>
            row.securityFeatures.dependabot.length ? (
              <LabelGroup>
                {row.securityFeatures.dependabot.map(feature => (
                  <Label key={feature}>{uppercase(feature)}</Label>
                ))}
              </LabelGroup>
            ) : null,
        },
        {
          header: 'Code scanning',
          field: 'securityFeatures.codeScanning',
          renderCell: row =>
            row.securityFeatures.codeScanning.length ? (
              <LabelGroup>
                {row.securityFeatures.codeScanning.map(feature => (
                  <Label key={feature}>{uppercase(feature)}</Label>
                ))}
              </LabelGroup>
            ) : null,
        },
      ]}
      initialSortColumn="updatedAt"
      initialSortDirection="DESC"
    />
  </Table.Container>
)

export const WithPagination = () => {
  const pageSize = 10
  const [pageIndex, setPageIndex] = React.useState(0)
  const start = pageIndex * pageSize
  const end = start + pageSize
  const rows = repos.slice(start, end)

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
      <Table.Pagination
        aria-label="Pagination for Repositories"
        pageSize={pageSize}
        totalCount={repos.length}
        onChange={({pageIndex}) => {
          setPageIndex(pageIndex)
        }}
      />
    </Table.Container>
  )
}

export const WithPaginationUsingDefaultPageIndex = () => {
  const pageSize = 10
  const [pageIndex, setPageIndex] = React.useState(0)
  const start = pageIndex * pageSize
  const end = start + pageSize
  const rows = repos.slice(start, end)

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
      <Table.Pagination
        aria-label="Pagination for Repositories"
        pageSize={pageSize}
        totalCount={repos.length}
        onChange={({pageIndex}) => {
          setPageIndex(pageIndex)
        }}
        defaultPageIndex={49}
      />
    </Table.Container>
  )
}

export const WithNetworkError = () => {
  const pageSize = 10
  const [pageIndex, setPageIndex] = React.useState(0)
  const {error, loading, data} = useFlakeyQuery({
    queryKey: ['repos', pageSize, pageIndex],
    queryFn: () => {
      return fetchRepos({
        page: pageIndex,
        perPage: pageSize,
      })
    },
  })

  return (
    <Table.Container>
      <Table.Title as="h2" id="repositories">
        Repositories
      </Table.Title>
      <Table.Subtitle as="p" id="repositories-subtitle">
        A subtitle could appear here to give extra context to the data.
      </Table.Subtitle>
      {loading || error ? <Table.Skeleton columns={columns} /> : null}
      {error ? (
        <Table.ErrorDialog
          onDismiss={() => {
            action('onDismiss')
          }}
          onRetry={() => {
            action('onRetry')
          }}
        />
      ) : null}
      {data ? (
        <DataTable
          aria-labelledby="repositories"
          aria-describedby="repositories-subtitle"
          data={data}
          columns={columns}
        />
      ) : null}
      <Table.Pagination
        aria-label="Pagination for Repositories"
        pageSize={pageSize}
        totalCount={repos.length}
        onChange={({pageIndex}) => {
          setPageIndex(pageIndex)
        }}
      />
    </Table.Container>
  )
}
