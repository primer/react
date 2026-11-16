import type {Meta, StoryObj} from '@storybook/react-vite'
import React from 'react'
import {FormControl} from '../FormControl'
import {SelectPanel, type SelectPanelItem} from './SelectPanel'

const meta = {
  title: 'React Tailwind/Components/SelectPanel',
  component: SelectPanel,
} satisfies Meta<typeof SelectPanel>

export default meta
type Story = StoryObj

function ColorCircle({color}: {color: string}) {
  return (
    <span
      aria-hidden="true"
      className="size-3 rounded-full border-thin"
      style={{backgroundColor: color, borderColor: color}}
    />
  )
}

const items: SelectPanelItem[] = [
  {
    description: 'New feature or request',
    descriptionVariant: 'block',
    id: 1,
    leadingVisual: <ColorCircle color="#a2eeef" />,
    text: 'enhancement',
  },
  {
    description: "Something isn't working",
    descriptionVariant: 'block',
    id: 2,
    leadingVisual: <ColorCircle color="#d73a4a" />,
    text: 'bug',
  },
  {
    description: 'Good for newcomers',
    descriptionVariant: 'block',
    id: 3,
    leadingVisual: <ColorCircle color="#0cf478" />,
    text: 'good first issue',
  },
  {id: 4, leadingVisual: <ColorCircle color="#ffd78e" />, text: 'design'},
  {id: 5, leadingVisual: <ColorCircle color="#ff0000" />, text: 'blocker'},
  {id: 6, leadingVisual: <ColorCircle color="#a4f287" />, text: 'backend'},
  {id: 7, leadingVisual: <ColorCircle color="#8dc6fc" />, text: 'frontend'},
]

function textOf(item: SelectPanelItem) {
  return typeof item.text === 'string' ? item.text : ''
}

export const Default: Story = {
  args: {items, onSelectedChange: () => {}, selected: items.slice(1, 3)},
  render: () => {
    const [filterValue, setFilterValue] = React.useState('')
    const [open, setOpen] = React.useState(false)
    const [selected, setSelected] = React.useState<SelectPanelItem[]>(items.slice(1, 3))
    const filteredItems = items.filter(item => textOf(item).toLowerCase().startsWith(filterValue.toLowerCase()))

    return (
      <FormControl>
        <FormControl.Label>Labels</FormControl.Label>
        <SelectPanel
          filterValue={filterValue}
          items={filteredItems}
          onFilterChange={setFilterValue}
          onOpenChange={setOpen}
          onSelectedChange={setSelected}
          open={open}
          placeholder="Select labels"
          selected={selected}
          selectionVariant="multiple"
          subtitle="Use labels to organize issues and pull requests"
          title="Select labels"
          width="medium"
        />
      </FormControl>
    )
  },
}

export const Playground: Story = {
  args: {items, onSelectedChange: () => {}, selected: []},
  render: () => {
    const [selected, setSelected] = React.useState<SelectPanelItem[]>([])
    return (
      <FormControl>
        <FormControl.Label>Labels</FormControl.Label>
        <SelectPanel
          items={items}
          onSelectedChange={setSelected}
          selected={selected}
          selectionVariant="multiple"
          title="Labels"
        />
      </FormControl>
    )
  },
}
