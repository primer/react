import React from 'react'
import {SelectPanel} from './SelectPanel'

export default {component: SelectPanel, title: 'Components/SelectPanel'}
const items = [
  {id: 'mona', text: 'Mona'},
  {id: 'hubot', text: 'Hubot'},
]

export const Default = {
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
export const Playground = {
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
