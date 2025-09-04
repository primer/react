import React from 'react'
import type {Meta, StoryFn} from '@storybook/react-vite'
import type {SelectPanelProps} from './SelectPanel'
import {SelectPanel} from './SelectPanel'
import {ActionList} from '../../index'
import data from './mock-story-data'

import classes from './SelectPanel.stories.module.css'

const getCircle = (color: string) => <div className={classes.Circle} style={{backgroundColor: `#${color}`}} />

export default {
  title: 'Deprecated/Components/SelectPanel/Playground',
  component: SelectPanel,

  args: {
    title: 'Select labels',
    selectionVariant: 'multiple',
    secondaryActionVariant: 'button',
    variant: {regular: 'anchored', narrow: 'full-screen'},
  },
  argTypes: {
    secondaryActionVariant: {
      name: 'Secondary action variant',
      type: 'enum',
      options: ['button', 'link', 'checkbox'],
    },
    secondaryActionText: {
      name: 'Secondary action text',
      type: 'string',
    },
  },
} as Meta<typeof SelectPanel>

export const Playground: StoryFn = args => {
  const initialSelectedLabels = [data.issue.labelIds[0]] // mock initial state: has selected labels
  const [selectedLabelIds, setSelectedLabelIds] = React.useState<string[]>(initialSelectedLabels)

  /* Selection */
  const onLabelSelect = (labelId: string) => {
    if (args.selectionVariant === 'single' || args.selectionVariant === 'instant') {
      setSelectedLabelIds([labelId])
    } else {
      if (!selectedLabelIds.includes(labelId)) setSelectedLabelIds([...selectedLabelIds, labelId])
      else setSelectedLabelIds(selectedLabelIds.filter(id => id !== labelId))
    }
  }

  const onClearSelection = () => {
    setSelectedLabelIds([])
    args.onClearSelection() // call storybook action
  }

  const onSubmit: SelectPanelProps['onSubmit'] = event => {
    data.issue.labelIds = selectedLabelIds // pretending to persist changes
    args.onSubmit(event) // call storybook action
  }

  const onCancel = () => args.onCancel() // call storybook action

  /* Filtering */
  const [filteredLabels, setFilteredLabels] = React.useState(data.labels)
  const [query, setQuery] = React.useState('')

  const onSearchInputChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    const query = event.currentTarget.value
    setQuery(query)

    if (query === '') setFilteredLabels(data.labels)
    else {
      // Note: in the future, we should probably add a highlight for matching text
      setFilteredLabels(
        data.labels
          .map(label => {
            if (label.name.toLowerCase().startsWith(query)) return {priority: 1, label}
            else if (label.name.toLowerCase().includes(query)) return {priority: 2, label}
            else if (label.description?.toLowerCase().includes(query)) return {priority: 3, label}
            else return {priority: -1, label}
          })
          .filter(result => result.priority > 0)
          .map(result => result.label),
      )
    }
  }

  const sortingFn = (itemA: {id: string}, itemB: {id: string}) => {
    const initialSelectedIds = data.issue.labelIds
    if (initialSelectedIds.includes(itemA.id) && initialSelectedIds.includes(itemB.id)) return 1
    else if (initialSelectedIds.includes(itemA.id)) return -1
    else if (initialSelectedIds.includes(itemB.id)) return 1
    else return 1
  }

  const itemsToShow = query ? filteredLabels : data.labels.sort(sortingFn)

  return (
    <>
      <SelectPanel
        title={args.title}
        description={args.description}
        variant={args.variant}
        selectionVariant={args.selectionVariant}
        onSubmit={onSubmit}
        onCancel={onCancel}
        onClearSelection={onClearSelection}
        width={args.width}
        height={args.height}
      >
        <SelectPanel.Button>Assign label</SelectPanel.Button>

        <SelectPanel.Header>
          <SelectPanel.SearchInput onChange={onSearchInputChange} />
        </SelectPanel.Header>

        {itemsToShow.length === 0 ? (
          <SelectPanel.Message variant="empty" title={`No labels found for "${query}"`}>
            Try a different search term
          </SelectPanel.Message>
        ) : (
          <ActionList>
            {itemsToShow.map(label => (
              <ActionList.Item
                key={label.id}
                onSelect={() => onLabelSelect(label.id)}
                selected={selectedLabelIds.includes(label.id)}
              >
                <ActionList.LeadingVisual>{getCircle(label.color)}</ActionList.LeadingVisual>
                {label.name}
                <ActionList.Description variant="block">{label.description}</ActionList.Description>
              </ActionList.Item>
            ))}
          </ActionList>
        )}

        <SelectPanel.Footer>
          {args.secondaryActionText ? (
            <SelectPanel.SecondaryAction variant={args.secondaryActionVariant}>
              {args.secondaryActionText}
            </SelectPanel.SecondaryAction>
          ) : null}
        </SelectPanel.Footer>
      </SelectPanel>
    </>
  )
}
