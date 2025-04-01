import {TriangleDownIcon} from '@primer/octicons-react'
import type {Meta} from '@storybook/react'
import React, {useState} from 'react'

import Box from '../Box'
import {Button} from '../Button'
import {SelectPanel} from '../SelectPanel'
import type {ItemInput} from '../deprecated/ActionList/List'
import FormControl from '../FormControl'

const meta: Meta<typeof SelectPanel> = {
  title: 'Components/SelectPanel',
  component: SelectPanel,
} satisfies Meta<typeof SelectPanel>

export default meta

const items: ItemInput[] = [
  {
    text: 'enhancement',
    id: 1,
  },
  {
    text: 'bug',
    id: 2,
  },
  {
    text: 'good first issue',
    id: 3,
  },
  {
    text: 'design',
    id: 4,
  },
  {
    text: 'blocker',
    id: 5,
  },
  {
    text: 'backend',
    id: 6,
  },
  {
    text: 'frontend',
    id: 7,
  },
]

export const Default = () => {
  const [selected, setSelected] = useState<ItemInput[]>(items.slice(1, 3))
  const [filter, setFilter] = useState('')
  const filteredItems = items.filter(
    item =>
      // design guidelines say to always show selected items in the list
      selected.some(selectedItem => selectedItem.text === item.text) ||
      // then filter the rest
      item.text?.toLowerCase().startsWith(filter.toLowerCase()),
  )
  // design guidelines say to sort selected items first
  const selectedItemsSortedFirst = filteredItems.sort((a, b) => {
    const aIsSelected = selected.some(selectedItem => selectedItem.text === a.text)
    const bIsSelected = selected.some(selectedItem => selectedItem.text === b.text)
    if (aIsSelected && !bIsSelected) return -1
    if (!aIsSelected && bIsSelected) return 1
    return 0
  })

  return (
    <FormControl>
      <FormControl.Label>Labels</FormControl.Label>
      <SelectPanel
        title="Select labels"
        placeholder="Select labels" // button text when no items are selected
        subtitle="Use labels to organize issues and pull requests"
        renderAnchor={({children, ...anchorProps}) => (
          <Button trailingAction={TriangleDownIcon} {...anchorProps} aria-haspopup="dialog">
            {children}
          </Button>
        )}
        items={selectedItemsSortedFirst}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        width="medium"
        message={
          selectedItemsSortedFirst.length === 0
            ? {
                variant: 'empty',
                title: `No language found for \`${filter}\``,
                body: 'Adjust your search term to find other languages',
              }
            : undefined
        }
      />
    </FormControl>
  )
}
