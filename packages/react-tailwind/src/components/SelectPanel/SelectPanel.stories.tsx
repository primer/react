import type {Meta, StoryObj} from '@storybook/react-vite'
import React from 'react'
import {SelectPanel} from './SelectPanel'

const meta = {
  title: 'React Tailwind/Components/SelectPanel',
  component: SelectPanel,
} satisfies Meta<typeof SelectPanel>

export default meta

type Story = StoryObj<typeof meta>
const items = [
  {id: 'mona', text: 'Mona'},
  {id: 'hubot', text: 'Hubot'},
]

export const Default: Story = {
  args: {items, onSelectedChange: () => {}, selected: undefined},
  render: () => {
    const [selected, setSelected] = React.useState<(typeof items)[number]>()
    return (
      <SelectPanel
        title="Assign"
        items={items}
        selected={selected}
        onSelectedChange={value => setSelected(value as (typeof items)[number])}
      />
    )
  },
}
export const Playground: Story = {
  args: {items, onSelectedChange: () => {}, selected: []},
  render: () => {
    const [selected, setSelected] = React.useState<typeof items>([])
    return (
      <SelectPanel
        title="Labels"
        selectionVariant="multiple"
        items={items}
        selected={selected}
        onSelectedChange={value => setSelected(value as typeof items)}
      />
    )
  },
}
