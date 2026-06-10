import type React from 'react'
import {useMemo, useRef, useState} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {SelectPanelParts as SelectPanel} from './SelectPanel'
import {Tabs, useTab, useTabList, useTabPanel} from '../Tabs'
import {Button} from '../../Button'
import {useFilter, useSelectionState} from '../../hooks/experimental'
import {branches, tags, type Ref} from './mock-refs'
import classes from './SelectPanel.module.css'

/**
 * Layer 2 — Primer-styled Parts.
 *
 * A Branches / Tags tabbed picker composed entirely from Primer-styled
 * `SelectPanel.*` parts + the generic experimental `Tabs` primitive. This is the
 * headline artifact: it proves the "compose, don't depend" thesis. SelectPanel no
 * longer owns tabs — it provides the overlay/search/list/options, and the consumer
 * brings `Tabs`. One shared search input, per-tab counts, a single dynamic panel,
 * and a selection model that persists across tabs — instead of forking the whole
 * component.
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

// --- Local Tabs convenience components ---
//
// The `Tabs` primitive exports only the `useTab`/`useTabList`/`useTabPanel` hooks,
// not ready-made `Tab`/`TabList`/`TabPanel` components, so we wrap them here. These
// small wrappers are the only "glue" the recipe needs; ideally the Tabs primitive
// would export styleable `Tab`/`TabList`/`TabPanel` convenience components (a real
// follow-up) which would remove this local boilerplate. They reuse SelectPanel's
// existing `.TabList`/`.Tab`/`.TabCount` CSS so the strip matches the panel.

interface RefTabListProps extends React.HTMLAttributes<HTMLDivElement> {
  'aria-label': string
}

function RefTabList({className, children, ...props}: RefTabListProps) {
  const {tabListProps} = useTabList<HTMLDivElement>(props)
  return (
    // @ts-expect-error Tabs primitive expects a non-nullable ref
    <div {...props} {...tabListProps} className={[className, classes.TabList].filter(Boolean).join(' ')}>
      {children}
    </div>
  )
}

interface RefTabProps {
  value: string
  count?: number
  disabled?: boolean
  children: React.ReactNode
}

function RefTab({value, count, disabled, children}: RefTabProps) {
  const {tabProps} = useTab({value, disabled})
  return (
    <button {...tabProps} type="button" className={classes.Tab}>
      {children}
      {count !== undefined ? (
        <span className={classes.TabCount} aria-hidden>
          {count}
        </span>
      ) : null}
    </button>
  )
}

interface RefTabPanelProps {
  value: string
  children: React.ReactNode
}

// Single dynamic tab panel. Deliberately NON-focusable: we do not set tabIndex
// (useTabPanel imposes none), so the list inside is reached via the input's
// aria-activedescendant rather than the panel being a keyboard dead-end.
function RefTabPanel({value, children}: RefTabPanelProps) {
  const {tabPanelProps} = useTabPanel({value})
  return (
    <div {...tabPanelProps} className={classes.Panel}>
      {children}
    </div>
  )
}

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
 * Single-select — the canonical `ref-selector` use case, composed from SelectPanel
 * parts + the `Tabs` primitive.
 *
 * Accessibility model (the point of this example):
 * - The tabpanel is NOT focusable (no tabIndex) — no keyboard dead-end.
 * - The list is driven by the input's `aria-activedescendant`; focus stays on the
 *   input while Arrow keys move the active option (handled by `useSelectPanel`).
 * - The tabs are a roving-tabindex zone (from `useTabList`/`useTab`).
 * - Switching a tab returns focus to the input (see `onValueChange`), so the user
 *   can Tab to the tablist, switch, and immediately keep arrowing through options.
 * - One shared search filters the active tab's data; per-tab counts on the tabs.
 */
export const TabbedBranchesAndTags: StoryObj = {
  name: 'Branches / Tags tabbed picker (styled)',
  render: () => {
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('branches')
    const anchorRef = useRef<HTMLButtonElement>(null)
    const rootRef = useRef<HTMLDivElement>(null)

    // Return focus to the shared search input so the user never gets trapped in
    // the (non-focusable) panel after switching tabs.
    const focusInput = () => {
      rootRef.current?.querySelector<HTMLInputElement>('[role="combobox"]')?.focus()
    }

    // One shared search query and one selection model, both owned by the consumer
    // and shared across the two tabs.
    const filter = useFilter()
    const selection = useSelectionState({selectionVariant: 'single', defaultSelectedKeys: ['branch-main']})

    const filteredBranches = useMemo(() => filter.filter(branches, b => b.name), [filter])
    const filteredTags = useMemo(() => filter.filter(tags, t => t.name), [filter])
    const activeItems = activeTab === 'branches' ? filteredBranches : filteredTags

    const selectedName = useMemo(() => nameOf([...selection.selectedKeys][0]) ?? 'main', [selection.selectedKeys])

    return (
      <SelectPanel.Root
        ref={rootRef}
        open={open}
        onOpenChange={setOpen}
        selectionVariant="single"
        returnFocusRef={anchorRef}
      >
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

          <Tabs
            value={activeTab}
            onValueChange={({value}) => {
              setActiveTab(value)
              focusInput()
            }}
          >
            <RefTabList aria-label="Ref type">
              <RefTab value="branches" count={filteredBranches.length}>
                Branches
              </RefTab>
              <RefTab value="tags" count={filteredTags.length}>
                Tags
              </RefTab>
            </RefTabList>

            <RefTabPanel value={activeTab}>
              <RefOptions items={activeItems} selection={selection} />
            </RefTabPanel>
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
 * the combined selection drawn from both tabs. Composed the same way: SelectPanel
 * parts + the `Tabs` primitive, with `selectionVariant="multiple"`.
 */
export const MultiSelectAcrossTabs: StoryObj = {
  name: 'Selection persists across tabs (multi-select)',
  render: () => {
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('branches')
    const anchorRef = useRef<HTMLButtonElement>(null)
    const rootRef = useRef<HTMLDivElement>(null)

    const focusInput = () => {
      rootRef.current?.querySelector<HTMLInputElement>('[role="combobox"]')?.focus()
    }

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
      <SelectPanel.Root
        ref={rootRef}
        open={open}
        onOpenChange={setOpen}
        selectionVariant="multiple"
        returnFocusRef={anchorRef}
      >
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

          <Tabs
            value={activeTab}
            onValueChange={({value}) => {
              setActiveTab(value)
              focusInput()
            }}
          >
            <RefTabList aria-label="Ref type">
              <RefTab value="branches" count={filteredBranches.length}>
                Branches
              </RefTab>
              <RefTab value="tags" count={filteredTags.length}>
                Tags
              </RefTab>
            </RefTabList>

            <RefTabPanel value={activeTab}>
              <RefOptions items={activeItems} selection={selection} />
            </RefTabPanel>
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
