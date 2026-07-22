import {useState} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {SelectPanel} from './ReadyMadeSelectPanel'
import {branches} from './mock-refs'

/**
 * Layer 3 — Ready-made (no-tabs).
 *
 * The props-based drop-in for the simple case: pass `items`, get a filterable
 * single-select panel. Tabbed pickers are deliberately out of scope here — use
 * the Layer 2 Parts + `Tabs` for those (see the Parts story).
 */
const meta: Meta = {
  title: 'Experimental/SelectPanel (Modular)/Ready-made',
  parameters: {controls: {expanded: true}},
}
export default meta

const items = branches.map(b => ({id: b.id, text: b.name}))

export const SingleSelect: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<Set<string>>(() => new Set(['branch-main']))
    const selectedName = items.find(i => selected.has(i.id))?.text ?? 'main'

    return (
      <SelectPanel
        open={open}
        onOpenChange={setOpen}
        title="Switch branches"
        anchor={`Branch: ${selectedName}`}
        items={items}
        selectionVariant="single"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        placeholder="Filter branches"
      />
    )
  },
}

export const MultiSelect: StoryObj = {
  render: () => {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState<Set<string>>(() => new Set())

    return (
      <SelectPanel
        open={open}
        onOpenChange={setOpen}
        title="Select branches"
        anchor={`Branches selected: ${selected.size}`}
        items={items}
        selectionVariant="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
        placeholder="Filter branches"
      />
    )
  },
}
