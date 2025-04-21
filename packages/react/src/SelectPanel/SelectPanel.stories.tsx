import type {Meta} from '@storybook/react'
import React, {useState} from 'react'

import {SelectPanel} from '../SelectPanel'
import type {ItemInput} from '../deprecated/ActionList/List'
import FormControl from '../FormControl'
import {SquareFillIcon} from '@primer/octicons-react'

const meta: Meta<typeof SelectPanel> = {
  title: 'Components/SelectPanel',
  component: SelectPanel,
} satisfies Meta<typeof SelectPanel>

export default meta

const items: ItemInput[] = [
  {
    leadingVisual: SquareFillIcon,
    text: 'enhancement',
    description: 'New feature or request',
    descriptionVariant: 'block',
    id: 1,
  },
  {
    leadingVisual: SquareFillIcon,
    text: 'bug',
    description: "Something isn't working",
    descriptionVariant: 'block',
    id: 2,
  },
  {
    leadingVisual: SquareFillIcon,
    text: 'good first issue',
    description: 'Good for newcomers',
    descriptionVariant: 'block',
    id: 3,
  },
  {leadingVisual: SquareFillIcon, text: 'design', id: 4},
  {leadingVisual: SquareFillIcon, text: 'blocker', id: 5},
  {leadingVisual: SquareFillIcon, text: 'backend', id: 6},
  {leadingVisual: SquareFillIcon, text: 'frontend', id: 7},
]

export const Default = () => {
  const [selected, setSelected] = useState<ItemInput[]>(items.slice(1, 3))
  const [filter, setFilter] = useState('')
  const filteredItems = items.filter(item => item.text?.toLowerCase().startsWith(filter.toLowerCase()))

  const [open, setOpen] = useState(false)

  return (
    <FormControl>
      <FormControl.Label>Labels</FormControl.Label>
      <SelectPanel
        title="Select labels"
        placeholder="No labels selected"
        subtitle="Use labels to organize issues and pull requests"
        open={open}
        onOpenChange={setOpen}
        items={filteredItems}
        selected={selected}
        onSelectedChange={setSelected}
        onFilterChange={setFilter}
        width="medium"
        message={
          filteredItems.length === 0
            ? {
                variant: 'empty',
                title: `No labels found for \`${filter}\``,
                body: 'Adjust your search term to find other labels.',
              }
            : undefined
        }
      />
    </FormControl>
  )
}
