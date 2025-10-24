import {TriangleDownIcon} from '@primer/octicons-react'
import type {Meta} from '@storybook/react-vite'
import {useState} from 'react'

import {Button} from '../Button'
import {SelectPanel} from '../SelectPanel'
import type {ItemInput} from '../SelectPanel'
import FormControl from '../FormControl'
import classes from './SelectPanel.stories.module.css'

const meta: Meta<typeof SelectPanel> = {
  title: 'Components/SelectPanel',
  component: SelectPanel,
} satisfies Meta<typeof SelectPanel>

export default meta

function getColorCircle(color: string) {
  return function () {
    return (
      <div
        className={classes.ColorCircle}
        style={{
          backgroundColor: color,
          borderColor: color,
        }}
      />
    )
  }
}

const items: ItemInput[] = [
  {
    leadingVisual: getColorCircle('#a2eeef'),
    text: 'enhancement',
    description: 'New feature or request',
    descriptionVariant: 'block',
    id: 1,
  },
  {
    leadingVisual: getColorCircle('#d73a4a'),
    text: 'bug',
    description: "Something isn't working",
    descriptionVariant: 'block',
    id: 2,
  },
  {
    leadingVisual: getColorCircle('#0cf478'),
    text: 'good first issue',
    description: 'Good for newcomers',
    descriptionVariant: 'block',
    id: 3,
  },
  {leadingVisual: getColorCircle('#ffd78e'), text: 'design', id: 4},
  {leadingVisual: getColorCircle('#ff0000'), text: 'blocker', id: 5},
  {leadingVisual: getColorCircle('#a4f287'), text: 'backend', id: 6},
  {leadingVisual: getColorCircle('#8dc6fc'), text: 'frontend', id: 7},
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
        placeholder="Select labels" // button text when no items are selected
        subtitle="Use labels to organize issues and pull requests"
        renderAnchor={({children, ...anchorProps}) => (
          <Button {...anchorProps} trailingAction={TriangleDownIcon} aria-haspopup="dialog">
            {children}
          </Button>
        )}
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
                title: 'No items available',
                body: '',
              }
            : undefined
        }
      />
    </FormControl>
  )
}
