import {
  FilterIcon,
  GearIcon,
  NoteIcon,
  ProjectIcon,
  SearchIcon,
  TypographyIcon,
  VersionsIcon,
} from '@primer/octicons-react'
import type {Meta} from '@storybook/react-vite'
import React from 'react'
import {FilteredActionList, FilteredActionListLoadingTypes, type GroupedListProps} from '../FilteredActionList'
import classes from './FilteredActionList.stories.module.css'

const meta: Meta<typeof FilteredActionList> = {
  title: 'Components/FilteredActionList/Features',
  component: FilteredActionList,
  parameters: {
    controls: {
      disable: true,
    },
  },
} satisfies Meta<typeof FilteredActionList>

export default meta

function getColorCircle(color: string) {
  return function ColorCircle() {
    return (
      <span
        className={classes.ColorCircle}
        style={{
          backgroundColor: color,
          borderColor: color,
        }}
      />
    )
  }
}

const labelItems = [
  {
    leadingVisual: getColorCircle('#a2eeef'),
    text: 'enhancement',
    id: 'enhancement',
    description: 'New feature or request',
  },
  {
    leadingVisual: getColorCircle('#d73a4a'),
    text: 'bug',
    id: 'bug',
    description: 'Something is not working',
  },
  {
    leadingVisual: getColorCircle('#0cf478'),
    text: 'good first issue',
    id: 'good-first-issue',
    description: 'Good for newcomers',
  },
  {
    leadingVisual: getColorCircle('#ffd78e'),
    text: 'design',
    id: 'design',
    description: 'Needs design feedback',
  },
  {
    leadingVisual: getColorCircle('#ff0000'),
    text: 'blocker',
    id: 'blocker',
    description: 'Blocking other work',
  },
  {
    leadingVisual: getColorCircle('#a4f287'),
    text: 'backend',
    id: 'backend',
    description: 'Server-side changes',
  },
  {
    leadingVisual: getColorCircle('#8dc6fc'),
    text: 'frontend',
    id: 'frontend',
    description: 'Client-side changes',
  },
]

const groupedItems: GroupedListProps['items'] = [
  {
    id: 'repo-settings',
    leadingVisual: GearIcon,
    text: 'Repository settings',
    description: 'Update branch protection and visibility',
    descriptionVariant: 'block',
    groupId: 'repositories',
  },
  {
    id: 'saved-search',
    leadingVisual: SearchIcon,
    text: 'Saved search',
    description: 'Reuse issue and pull request filters',
    descriptionVariant: 'block',
    groupId: 'repositories',
  },
  {
    id: 'view-settings',
    leadingVisual: FilterIcon,
    text: 'View settings',
    groupId: 'repositories',
  },
  {
    id: 'project-board',
    leadingVisual: ProjectIcon,
    text: 'Project board',
    description: 'Plan and track work across repositories',
    descriptionVariant: 'block',
    groupId: 'planning',
  },
  {
    id: 'release-notes',
    leadingVisual: NoteIcon,
    text: 'Release notes',
    groupId: 'planning',
  },
  {
    id: 'rename-view',
    leadingVisual: TypographyIcon,
    text: 'Rename view',
    groupId: 'views',
  },
  {
    id: 'duplicate-view',
    leadingVisual: VersionsIcon,
    text: 'Duplicate view',
    groupId: 'views',
  },
]

const groupMetadata: GroupedListProps['groupMetadata'] = [
  {groupId: 'repositories', header: {title: 'Repositories', variant: 'filled'}},
  {groupId: 'planning', header: {title: 'Planning', variant: 'filled'}},
  {groupId: 'views', header: {title: 'Views', variant: 'filled'}},
]

const repositoryItems = Array.from({length: 150}, (_, index) => {
  const number = index + 1

  return {
    id: `repository-${number}`,
    text: `primer/react example repository ${number}`,
    description: number % 3 === 0 ? 'Updated recently' : 'Available to add as context',
    descriptionVariant: 'block' as const,
    leadingVisual: ProjectIcon,
    trailingVisual: number % 5 === 0 ? 'Private' : 'Public',
  }
})

const noop = () => undefined

function useBodyLoaderReady() {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    const animationFrameId = window.requestAnimationFrame(() => {
      setReady(true)
    })

    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return ready
}

export function MultiSelectWithSelectAll() {
  const [filter, setFilter] = React.useState('')
  const [selectedIds, setSelectedIds] = React.useState<string[]>(['bug', 'design'])

  const visibleItems = labelItems
    .filter(item => item.text.toLowerCase().includes(filter.toLowerCase()))
    .map(item => ({
      ...item,
      selected: selectedIds.includes(item.id),
      onAction: () => {
        setSelectedIds(current => {
          if (current.includes(item.id)) {
            return current.filter(id => id !== item.id)
          }

          return [...current, item.id]
        })
      },
    }))

  return (
    <>
      <h1>Multiple selection</h1>
      <div>Select labels that describe your issue.</div>
      <FilteredActionList
        aria-label="Labels"
        className={classes.FeatureListContainer}
        items={visibleItems}
        onFilterChange={setFilter}
        onSelectAllChange={checked => {
          setSelectedIds(checked ? visibleItems.map(item => item.id) : [])
        }}
        placeholderText="Filter labels"
        selectionVariant="multiple"
        showItemDividers
        textInputProps={{leadingVisual: SearchIcon}}
      />
    </>
  )
}

export function WithGroups() {
  const [filter, setFilter] = React.useState('')
  const visibleItems = groupedItems.filter(item => item.text?.toLowerCase().includes(filter.toLowerCase()))

  return (
    <>
      <h1>Grouped options</h1>
      <div>Group related options under headings.</div>
      <FilteredActionList
        aria-label="Options"
        className={classes.GroupedListContainer}
        groupMetadata={groupMetadata}
        items={visibleItems}
        onFilterChange={setFilter}
        placeholderText="Filter options"
        showItemDividers
        textInputProps={{leadingVisual: SearchIcon}}
        variant="horizontal-inset"
      />
    </>
  )
}

export function WithNoResultsMessage() {
  const [filter, setFilter] = React.useState('archived')
  const visibleItems = labelItems.filter(item => item.text.toLowerCase().includes(filter.toLowerCase()))
  const hasNoResults = visibleItems.length === 0

  return (
    <>
      <h1>No results message</h1>
      <div>Provide a custom message when filtering removes every item.</div>
      <FilteredActionList
        aria-label="Labels"
        className={classes.FeatureListContainer}
        filterValue={filter}
        items={visibleItems}
        message={
          hasNoResults ? (
            <div className={classes.Message}>
              <h2 className={classes.MessageTitle}>No labels found</h2>
              <p className={classes.MessageDescription}>Try another search term or create a new label.</p>
            </div>
          ) : undefined
        }
        messageText={{
          title: 'No labels found',
          description: 'Try another search term or create a new label.',
        }}
        onFilterChange={setFilter}
        placeholderText="Filter labels"
        textInputProps={{leadingVisual: SearchIcon}}
      />
    </>
  )
}

export function LoadingInInput() {
  const [filter, setFilter] = React.useState('fea')
  const visibleItems = labelItems.filter(item => item.text.toLowerCase().includes(filter.toLowerCase()))

  return (
    <>
      <h1>Input loading</h1>
      <div>Show progress in the input while filtering existing results.</div>
      <FilteredActionList
        aria-label="Labels"
        className={classes.FeatureListContainer}
        filterValue={filter}
        items={visibleItems}
        loading
        loadingType={FilteredActionListLoadingTypes.input}
        onFilterChange={setFilter}
        placeholderText="Filter labels"
        showItemDividers
        textInputProps={{leadingVisual: SearchIcon}}
      />
    </>
  )
}

export function LoadingWithBodySpinner() {
  const ready = useBodyLoaderReady()

  return (
    <>
      <h1>Body spinner loading</h1>
      <div>Use the body spinner while fetching the initial list.</div>
      <FilteredActionList
        aria-label="Labels"
        className={classes.FeatureListContainer}
        items={[]}
        loading={ready}
        loadingType={FilteredActionListLoadingTypes.bodySpinner}
        onFilterChange={noop}
        placeholderText="Filter labels"
        textInputProps={{leadingVisual: SearchIcon}}
      />
    </>
  )
}

export function LoadingWithBodySkeleton() {
  const ready = useBodyLoaderReady()

  return (
    <>
      <h1>Body skeleton loading</h1>
      <div>Use the body skeleton to reserve space for the incoming list.</div>
      <FilteredActionList
        aria-label="Labels"
        className={classes.FeatureListContainer}
        items={[]}
        loading={ready}
        loadingType={FilteredActionListLoadingTypes.bodySkeleton}
        onFilterChange={noop}
        placeholderText="Filter labels"
        textInputProps={{leadingVisual: SearchIcon}}
      />
    </>
  )
}

export function VirtualizedList() {
  const [filter, setFilter] = React.useState('')
  const visibleItems = repositoryItems.filter(item => item.text.toLowerCase().includes(filter.toLowerCase()))

  return (
    <>
      <h1>Virtualized list</h1>
      <div>Use virtualization for large client-side lists.</div>
      <FilteredActionList
        aria-label="Repositories"
        className={classes.VirtualizedListContainer}
        items={visibleItems}
        onFilterChange={setFilter}
        placeholderText="Filter repositories"
        showItemDividers
        textInputProps={{leadingVisual: SearchIcon}}
        virtualized
      />
    </>
  )
}
