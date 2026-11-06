import type {Meta, StoryObj} from '@storybook/react-vite'
import React from 'react'
import {Button} from '../Button'
import {SelectPanel} from './SelectPanel'

const meta = {
  title: 'React Tailwind/Components/SelectPanel/Examples/Composition',
  component: SelectPanel,
} satisfies Meta<typeof SelectPanel>

export default meta
type Story = StoryObj

interface PickerItem {
  id: string
  label: string
  description: string
  count: number
  section: 'Labels' | 'Assignees'
  disabled?: boolean
}

const items: PickerItem[] = [
  {id: 'bug', label: 'bug', description: 'Something is not working', count: 12, section: 'Labels'},
  {id: 'archived', label: 'archived', description: 'No longer available', count: 0, section: 'Labels', disabled: true},
  {id: 'enhancement', label: 'enhancement', description: 'New feature request', count: 5, section: 'Labels'},
  {id: 'mona', label: 'Mona', description: 'Design systems', count: 3, section: 'Assignees'},
  {id: 'hubot', label: 'Hubot', description: 'Automation', count: 8, section: 'Assignees'},
]

export const WithoutFilter = {
  render: function WithoutFilter() {
    const [selected, setSelected] = React.useState<PickerItem | null>(null)
    return (
      <SelectPanel.Root
        filterable={false}
        value={selected}
        onValueChange={setSelected}
        itemToStringLabel={item => item.label}
      >
        <SelectPanel.Trigger aria-label="Choose label">{selected?.label ?? 'Choose label'}</SelectPanel.Trigger>
        <SelectPanel.Portal>
          <SelectPanel.Positioner>
            <SelectPanel.Popup>
              <SelectPanel.Header>
                <SelectPanel.Title>Choose label</SelectPanel.Title>
              </SelectPanel.Header>
              <SelectPanel.List aria-label="Choose label">
                {items
                  .filter(item => item.section === 'Labels')
                  .map(item => (
                    <SelectPanel.Item key={item.id} value={item} label={item.label} disabled={item.disabled}>
                      <SelectPanel.SelectionIndicator />
                      {item.label}
                    </SelectPanel.Item>
                  ))}
              </SelectPanel.List>
            </SelectPanel.Popup>
          </SelectPanel.Positioner>
        </SelectPanel.Portal>
      </SelectPanel.Root>
    )
  },
} satisfies Story

export const CustomRowsAndFooter = {
  render: function CustomRowsAndFooter() {
    const [managed, setManaged] = React.useState(false)
    return (
      <>
        <SelectPanel.Root<PickerItem>
          items={items.filter(item => item.section === 'Assignees')}
          itemToStringLabel={item => item.label}
        >
          <SelectPanel.Trigger aria-label="Choose assignee">Choose assignee</SelectPanel.Trigger>
          <SelectPanel.Portal>
            <SelectPanel.Positioner>
              <SelectPanel.Popup>
                <SelectPanel.Header>
                  <SelectPanel.Title>Choose assignee</SelectPanel.Title>
                </SelectPanel.Header>
                <div className="border-b border-default p-3">
                  <SelectPanel.Filter aria-label="Filter assignees" />
                </div>
                <SelectPanel.List aria-label="Choose assignee">
                  {(item: PickerItem) => (
                    <SelectPanel.Item key={item.id} value={item} className="gap-2">
                      <SelectPanel.SelectionIndicator />
                      <span
                        aria-hidden="true"
                        className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs"
                      >
                        {item.label.slice(0, 1)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">{item.label}</span>
                        <span className="block text-xs text-muted">{item.description}</span>
                      </span>
                      <span className="rounded-full bg-muted px-2 text-xs text-muted">
                        <span className="sr-only">Assigned issues: </span>
                        {item.count}
                      </span>
                    </SelectPanel.Item>
                  )}
                </SelectPanel.List>
                <SelectPanel.Empty>
                  <SelectPanel.Message title="No assignees found" />
                </SelectPanel.Empty>
                <SelectPanel.Footer>
                  <Button onClick={() => setManaged(true)}>Manage people</Button>
                </SelectPanel.Footer>
              </SelectPanel.Popup>
            </SelectPanel.Positioner>
          </SelectPanel.Portal>
        </SelectPanel.Root>
        {managed ? <p role="status">Managing people</p> : null}
      </>
    )
  },
} satisfies Story

export const GroupedPickerWithCreation = {
  render: function GroupedPickerWithCreation() {
    const [options, setOptions] = React.useState(items)
    const [selected, setSelected] = React.useState<PickerItem[]>([])
    const [query, setQuery] = React.useState('')
    const sections = ['Labels', 'Assignees'] as const
    const groups = sections.map(section => ({
      value: section,
      items: options.filter(item => item.section === section),
    }))
    const trimmedQuery = query.trim()
    const canCreate =
      trimmedQuery.length > 0 &&
      !options.some(item => item.section === 'Labels' && item.label.toLowerCase() === trimmedQuery.toLowerCase())
    const createLabel = () => {
      if (!canCreate) return
      const item: PickerItem = {
        id: `label-${trimmedQuery.toLowerCase()}`,
        label: trimmedQuery,
        description: 'New label',
        count: 0,
        section: 'Labels',
      }
      setOptions([...options, item])
      setSelected([...selected, item])
      setQuery('')
    }
    return (
      <SelectPanel.Root
        multiple
        items={groups}
        value={selected}
        onValueChange={setSelected}
        inputValue={query}
        onInputValueChange={setQuery}
        itemToStringLabel={item => item.label}
      >
        <SelectPanel.Trigger aria-label="Labels and assignees">Labels and assignees</SelectPanel.Trigger>
        <SelectPanel.Portal>
          <SelectPanel.Positioner>
            <SelectPanel.Popup>
              <SelectPanel.Header>
                <SelectPanel.Title>Labels and assignees</SelectPanel.Title>
              </SelectPanel.Header>
              <div className="border-b border-default p-3">
                <SelectPanel.Filter aria-label="Filter items" />
              </div>
              <SelectPanel.List aria-label="Labels and assignees">
                {(group: {value: string; items: PickerItem[]}) => (
                  <SelectPanel.Group key={group.value} items={group.items}>
                    <SelectPanel.GroupLabel>{group.value}</SelectPanel.GroupLabel>
                    <SelectPanel.Collection>
                      {(item: PickerItem) => (
                        <SelectPanel.Item key={item.id} value={item} disabled={item.disabled}>
                          <SelectPanel.SelectionIndicator />
                          {item.label}
                        </SelectPanel.Item>
                      )}
                    </SelectPanel.Collection>
                  </SelectPanel.Group>
                )}
              </SelectPanel.List>
              <SelectPanel.Empty>
                <SelectPanel.Message title="No items found" />
              </SelectPanel.Empty>
              <SelectPanel.Footer>
                <Button disabled={!canCreate} onClick={createLabel}>
                  Create &quot;{trimmedQuery}&quot;
                </Button>
              </SelectPanel.Footer>
            </SelectPanel.Popup>
          </SelectPanel.Positioner>
        </SelectPanel.Portal>
      </SelectPanel.Root>
    )
  },
} satisfies Story
