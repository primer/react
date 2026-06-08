import {SearchIcon} from '@primer/octicons-react'
import type {Meta} from '@storybook/react-vite'
import React from 'react'
import {ActionList} from '../ActionList'
import {FilteredActionList, FilteredActionListLoadingTypes, type RenderItemFn} from '../FilteredActionList'
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

const noop = () => undefined

function getTrailingVisualContent(trailingVisual: Parameters<RenderItemFn>[0]['trailingVisual']): React.ReactNode {
  if (
    typeof trailingVisual === 'string' ||
    typeof trailingVisual === 'number' ||
    React.isValidElement(trailingVisual)
  ) {
    return trailingVisual
  }

  return null
}

const customRenderItem: RenderItemFn = item => {
  const {
    description,
    leadingVisual: LeadingVisual,
    selected,
    text,
    trailingVisual,
    onAction,
    id,
    children,
    ...rest
  } = item

  const trailingVisualContent = getTrailingVisualContent(trailingVisual)

  return (
    <ActionList.Item
      role="option"
      selected={selected}
      data-id={id}
      onSelect={e => {
        if (typeof onAction === 'function') {
          onAction(item, e as unknown as React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>)
        }
      }}
      {...rest}
    >
      {LeadingVisual ? (
        <ActionList.LeadingVisual>
          <LeadingVisual />
        </ActionList.LeadingVisual>
      ) : null}
      {children}
      <span className={classes.CustomItemText}>
        {text}
        {description ? <span className={classes.CustomItemDescription}>{description}</span> : null}
      </span>
      {trailingVisualContent ? <ActionList.TrailingVisual>{trailingVisualContent}</ActionList.TrailingVisual> : null}
    </ActionList.Item>
  )
}

function useBodyLoaderReady() {
  return true
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

export function SingleSelect() {
  const [filter, setFilter] = React.useState('')
  const [selectedId, setSelectedId] = React.useState('bug')

  const visibleItems = labelItems
    .filter(item => item.text.toLowerCase().includes(filter.toLowerCase()))
    .map(item => ({
      ...item,
      selected: item.id === selectedId,
      onAction: () => {
        setSelectedId(item.id)
      },
    }))

  return (
    <>
      <h1>Single selection</h1>
      <div>Select one label from the filtered list.</div>
      <FilteredActionList
        aria-label="Labels"
        className={classes.FeatureListContainer}
        items={visibleItems}
        onFilterChange={setFilter}
        placeholderText="Filter labels"
        selectionVariant="single"
        showItemDividers
        textInputProps={{leadingVisual: SearchIcon}}
      />
    </>
  )
}

export function SelectAllSelected() {
  const [filter, setFilter] = React.useState('')
  const [selectedIds, setSelectedIds] = React.useState<string[]>(labelItems.map(item => item.id))

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
      <h1>Select all selected</h1>
      <div>Show the select-all control when every visible item is selected.</div>
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

export function WithDisabledItems() {
  const [filter, setFilter] = React.useState('')
  const visibleItems = labelItems
    .filter(item => item.text.toLowerCase().includes(filter.toLowerCase()))
    .map(item => {
      if (item.id === 'design') {
        return {...item, disabled: true, description: 'Disabled until design review is complete'}
      }

      return item
    })

  return (
    <>
      <h1>Disabled items</h1>
      <div>Disable options that are visible but unavailable.</div>
      <FilteredActionList
        aria-label="Labels"
        className={classes.FeatureListContainer}
        items={visibleItems}
        onFilterChange={setFilter}
        placeholderText="Filter labels"
        showItemDividers
        textInputProps={{leadingVisual: SearchIcon}}
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

export function DefaultEmptyState() {
  return (
    <>
      <h1>Default empty state</h1>
      <div>Render an empty list when there are no items and no custom message.</div>
      <FilteredActionList
        aria-label="Labels"
        className={classes.FeatureListContainer}
        items={[]}
        onFilterChange={noop}
        placeholderText="Filter labels"
        textInputProps={{leadingVisual: SearchIcon}}
      />
    </>
  )
}

export function CustomItemRendering() {
  const [filter, setFilter] = React.useState('')
  const visibleItems = labelItems
    .filter(item => item.text.toLowerCase().includes(filter.toLowerCase()))
    .map(item => ({
      ...item,
      renderItem: customRenderItem,
      trailingVisual: item.id === 'bug' ? 'Required' : undefined,
    }))

  return (
    <>
      <h1>Custom item rendering</h1>
      <div>Use renderItem to customize how each item is displayed.</div>
      <FilteredActionList
        aria-label="Labels"
        className={classes.FeatureListContainer}
        items={visibleItems}
        onFilterChange={setFilter}
        placeholderText="Filter labels"
        showItemDividers
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
