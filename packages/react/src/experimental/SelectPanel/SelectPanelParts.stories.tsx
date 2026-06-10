import {useMemo, useRef, useState} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {SelectPanelParts as SelectPanel} from './SelectPanel'
import {Tabs} from '../Tabs'
import {Button} from '../../Button'
import {useFilter, useSelectionState} from '../../hooks/experimental'
import {branches, tags, type Ref} from './mock-refs'

/**
 * Layer 2 — Primer-styled Parts.
 *
 * A Branches / Tags tabbed picker composed entirely from Primer-styled
 * `SelectPanel.*` parts + the `Tabs` primitive. This is the headline artifact:
 * it proves a consumer can **add tabs** to SelectPanel by composition — one
 * shared search input, per-tab counts, a single dynamic panel, and a selection
 * model that persists across tabs — instead of forking the whole component.
 */
const meta: Meta = {
  title: 'Experimental/SelectPanel (Modular)/Parts',
  parameters: {controls: {expanded: true}},
  decorators: [
    Story => (
      <div style={{padding: 24, minHeight: 420}}>
        <Story />
      </div>
    ),
  ],
}
export default meta

const allRefs = [...branches, ...tags]
const nameOf = (id: string | undefined) => allRefs.find(r => r.id === id)?.name

function RefOptions({items, selection}: {items: Ref[]; selection: ReturnType<typeof useSelectionState>}) {
  if (items.length === 0) return <SelectPanel.Empty>No matches</SelectPanel.Empty>
  return (
    <SelectPanel.List aria-label="Results">
      {items.map(item => (
        <SelectPanel.Option
          key={item.id}
          id={item.id}
          selected={selection.isSelected(item.id)}
          onClick={() => selection.toggle(item.id)}
        >
          {item.name}
        </SelectPanel.Option>
      ))}
    </SelectPanel.List>
  )
}

/**
 * Single-select — the canonical `ref-selector` use case. Selecting a ref keeps
 * the panel open so you can switch tabs; the chosen ref stays checked when you
 * navigate away and back.
 */
export const TabbedBranchesAndTags: StoryObj = {
  name: 'Branches / Tags tabbed picker (styled)',
  render: () => {
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('branches')
    const anchorRef = useRef<HTMLButtonElement>(null)

    // One shared search query and one selection model, both owned by the consumer
    // and shared across the two tabs.
    const filter = useFilter()
    const selection = useSelectionState({selectionVariant: 'single', defaultSelectedKeys: ['branch-main']})

    const filteredBranches = useMemo(() => filter.filter(branches, b => b.name), [filter])
    const filteredTags = useMemo(() => filter.filter(tags, t => t.name), [filter])
    const activeItems = activeTab === 'branches' ? filteredBranches : filteredTags

    const selectedName = useMemo(() => nameOf([...selection.selectedKeys][0]) ?? 'main', [selection.selectedKeys])

    return (
      <SelectPanel.Root open={open} onOpenChange={setOpen} selectionVariant="single" returnFocusRef={anchorRef}>
        <SelectPanel.Anchor ref={anchorRef}>Switch ref: {selectedName}</SelectPanel.Anchor>

        <SelectPanel.Overlay>
          <SelectPanel.Header>
            <SelectPanel.Title>Switch branches/tags</SelectPanel.Title>
            <SelectPanel.Input
              autoFocus
              aria-label="Filter branches and tags"
              placeholder="Filter branches and tags"
              value={filter.query}
              onChange={e => filter.setQuery(e.target.value)}
            />
          </SelectPanel.Header>

          <Tabs defaultValue="branches" onValueChange={({value}) => setActiveTab(value)}>
            <SelectPanel.TabList aria-label="Ref type">
              <SelectPanel.Tab value="branches" count={filteredBranches.length}>
                Branches
              </SelectPanel.Tab>
              <SelectPanel.Tab value="tags" count={filteredTags.length}>
                Tags
              </SelectPanel.Tab>
            </SelectPanel.TabList>

            <SelectPanel.Panel value={activeTab}>
              <RefOptions items={activeItems} selection={selection} />
            </SelectPanel.Panel>
          </Tabs>

          <SelectPanel.Footer>
            <Button size="small" variant="primary" onClick={() => setOpen(false)}>
              Done
            </Button>
          </SelectPanel.Footer>
        </SelectPanel.Overlay>
      </SelectPanel.Root>
    )
  },
}

/**
 * Multi-select — makes "one selection model across tabs" obvious: pick branches
 * **and** tags, switch tabs, and every choice stays checked. The footer counts
 * the combined selection drawn from both tabs.
 */
export const MultiSelectAcrossTabs: StoryObj = {
  name: 'Selection persists across tabs (multi-select)',
  render: () => {
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('branches')
    const anchorRef = useRef<HTMLButtonElement>(null)

    const filter = useFilter()
    const selection = useSelectionState({selectionVariant: 'multiple'})

    const filteredBranches = useMemo(() => filter.filter(branches, b => b.name), [filter])
    const filteredTags = useMemo(() => filter.filter(tags, t => t.name), [filter])
    const activeItems = activeTab === 'branches' ? filteredBranches : filteredTags

    const selectedNames = useMemo(
      () => [...selection.selectedKeys].map(nameOf).filter(Boolean).join(', '),
      [selection.selectedKeys],
    )

    return (
      <SelectPanel.Root open={open} onOpenChange={setOpen} selectionVariant="multiple" returnFocusRef={anchorRef}>
        <SelectPanel.Anchor ref={anchorRef}>Refs selected: {selection.selectedKeys.size}</SelectPanel.Anchor>

        <SelectPanel.Overlay>
          <SelectPanel.Header>
            <SelectPanel.Title>Select branches/tags</SelectPanel.Title>
            <SelectPanel.Input
              autoFocus
              aria-label="Filter branches and tags"
              placeholder="Filter branches and tags"
              value={filter.query}
              onChange={e => filter.setQuery(e.target.value)}
            />
          </SelectPanel.Header>

          <Tabs defaultValue="branches" onValueChange={({value}) => setActiveTab(value)}>
            <SelectPanel.TabList aria-label="Ref type">
              <SelectPanel.Tab value="branches" count={filteredBranches.length}>
                Branches
              </SelectPanel.Tab>
              <SelectPanel.Tab value="tags" count={filteredTags.length}>
                Tags
              </SelectPanel.Tab>
            </SelectPanel.TabList>

            <SelectPanel.Panel value={activeTab}>
              <RefOptions items={activeItems} selection={selection} />
            </SelectPanel.Panel>
          </Tabs>

          <SelectPanel.Footer>
            <span style={{flexGrow: 1, alignSelf: 'center', fontSize: 12, color: 'var(--fgColor-muted)'}}>
              {selectedNames || 'Nothing selected'}
            </span>
            <Button size="small" onClick={() => selection.clear()}>
              Clear
            </Button>
            <Button size="small" variant="primary" onClick={() => setOpen(false)}>
              Done
            </Button>
          </SelectPanel.Footer>
        </SelectPanel.Overlay>
      </SelectPanel.Root>
    )
  },
}
