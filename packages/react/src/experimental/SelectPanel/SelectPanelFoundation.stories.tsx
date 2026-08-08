import {useMemo, useRef, useState} from 'react'
import type {Meta, StoryObj} from '@storybook/react-vite'
import {SelectPanel} from '../../foundations/experimental/SelectPanel'
import {Tabs, useTab, useTabList, useTabPanel} from '../Tabs'
import {useFilter, useSelectionState} from '../../hooks/experimental'
import {branches, tags, type Ref} from './mock-refs'

/**
 * Headline story — a Branches / Tags tabbed picker built by composing the
 * **unstyled** SelectPanel foundation with the existing `Tabs` primitive and
 * consumer-owned L0 hooks (`useFilter`, `useSelectionState`).
 *
 * This proves the thesis: tabs become possible the moment the list is a placeable
 * part and selection/filter state are hooks the consumer owns — no fork required.
 * The real-world fork this replaces (`github/github-ui` RefSelectorV1) is 561 LOC.
 */
const meta: Meta = {
  title: 'Experimental/SelectPanel (Modular)/Foundation',
  parameters: {controls: {expanded: true}},
}
export default meta

// --- Minimal inline styles (foundation ships no visual opinion) ---

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  marginTop: 4,
  width: 320,
  border: '1px solid #d1d9e0',
  borderRadius: 12,
  background: 'white',
  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
  overflow: 'hidden',
}
const headerStyle: React.CSSProperties = {padding: 12, borderBottom: '1px solid #d1d9e0'}
const inputStyle: React.CSSProperties = {width: '100%', padding: '6px 8px', boxSizing: 'border-box'}
const tabListStyle: React.CSSProperties = {display: 'flex', gap: 4, padding: '8px 12px 0'}
const listStyle: React.CSSProperties = {listStyle: 'none', margin: 0, padding: 4, maxHeight: 240, overflowY: 'auto'}

function tabButtonStyle(selected: boolean): React.CSSProperties {
  return {
    appearance: 'none',
    border: 'none',
    background: 'transparent',
    padding: '6px 8px',
    borderBottom: selected ? '2px solid #0969da' : '2px solid transparent',
    fontWeight: selected ? 600 : 400,
    cursor: 'pointer',
  }
}
function optionStyle(active: boolean, selected: boolean): React.CSSProperties {
  return {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '6px 8px',
    borderRadius: 6,
    cursor: 'pointer',
    background: active ? '#ddf4ff' : 'transparent',
    fontWeight: selected ? 600 : 400,
  }
}

// --- Tab strip built on the Tabs primitive's hooks (no tabs rebuilt) ---

function Tab({value, count, children}: {value: string; count: number; children: React.ReactNode}) {
  const {tabProps} = useTab({value})
  return (
    <button {...tabProps} type="button" style={tabButtonStyle(tabProps['aria-selected'] === true)}>
      {children} <span aria-hidden>({count})</span>
    </button>
  )
}

function TabStrip({children}: {children: React.ReactNode}) {
  const {tabListProps} = useTabList<HTMLDivElement>({'aria-label': 'Ref type'})
  return (
    // @ts-expect-error Tabs primitive expects a non-nullable ref
    <div {...tabListProps} style={tabListStyle}>
      {children}
    </div>
  )
}

// Single dynamic tab panel — one panel, aria-labelledby tracks the active tab.
function Panel({value, children}: {value: string; children: React.ReactNode}) {
  const {tabPanelProps} = useTabPanel({value})
  return <div {...tabPanelProps}>{children}</div>
}

// --- The list region (re-used for whichever tab is active) ---

function RefList({items, selection}: {items: Ref[]; selection: ReturnType<typeof useSelectionState>}) {
  return (
    <SelectPanel.List style={listStyle} aria-label="Results">
      {items.length === 0 ? (
        <li role="option" id="empty" aria-disabled style={{padding: 8, color: '#656d76'}}>
          No matches
        </li>
      ) : (
        items.map(item => {
          const selected = selection.isSelected(item.id)
          return (
            <SelectPanel.Option
              key={item.id}
              id={item.id}
              selected={selected}
              onClick={() => selection.toggle(item.id)}
              style={optionStyle(false, selected)}
            >
              <span>{item.name}</span>
              {selected ? <span aria-hidden>✓</span> : null}
            </SelectPanel.Option>
          )
        })
      )}
    </SelectPanel.List>
  )
}

export const BranchesAndTags: StoryObj = {
  name: 'Branches / Tags tabbed picker',
  render: () => {
    const [open, setOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('branches')
    const anchorRef = useRef<HTMLButtonElement>(null)

    // One shared search query across both tabs.
    const filter = useFilter()
    // One selection model shared across both tabs (single-select ref).
    const selection = useSelectionState({selectionVariant: 'single'})

    const filteredBranches = useMemo(() => filter.filter(branches, b => b.name), [filter])
    const filteredTags = useMemo(() => filter.filter(tags, t => t.name), [filter])
    const activeItems = activeTab === 'branches' ? filteredBranches : filteredTags

    const selectedName = useMemo(() => {
      const id = [...selection.selectedKeys][0]
      return [...branches, ...tags].find(r => r.id === id)?.name ?? 'main'
    }, [selection.selectedKeys])

    return (
      <SelectPanel.Root open={open} onOpenChange={next => setOpen(next)} returnFocusRef={anchorRef}>
        <div style={{position: 'relative', display: 'inline-block'}}>
          <SelectPanel.Anchor ref={anchorRef}>Switch ref: {selectedName}</SelectPanel.Anchor>

          <SelectPanel.Overlay style={overlayStyle}>
            <div style={headerStyle}>
              <SelectPanel.Title style={{margin: '0 0 8px', fontSize: 14, fontWeight: 600}}>
                Switch branches/tags
              </SelectPanel.Title>
              <SelectPanel.Input
                autoFocus
                placeholder="Filter branches and tags"
                value={filter.query}
                onChange={e => filter.setQuery(e.target.value)}
                style={inputStyle}
              />
            </div>

            <Tabs defaultValue="branches" onValueChange={({value}) => setActiveTab(value)}>
              <TabStrip>
                <Tab value="branches" count={filteredBranches.length}>
                  Branches
                </Tab>
                <Tab value="tags" count={filteredTags.length}>
                  Tags
                </Tab>
              </TabStrip>
              <Panel value={activeTab}>
                <RefList items={activeItems} selection={selection} />
              </Panel>
            </Tabs>
          </SelectPanel.Overlay>
        </div>
      </SelectPanel.Root>
    )
  },
}
