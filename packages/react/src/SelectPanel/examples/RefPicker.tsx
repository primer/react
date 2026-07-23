import React from 'react'
import {GitBranchIcon, TagIcon, type Icon} from '@primer/octicons-react'

import {SelectPanel, Tabs, useTab, useTabList, useTabPanel} from '../../experimental'
import {ActionList, CounterLabel} from '../../index'
import classes from './RefPicker.module.css'
import {branches, tags, type GitRef, type RefType} from './ref-picker-data'

/**
 * A reusable reference picker (think: choosing a git ref).
 *
 * A button opens a panel with two tabs — "Branches" and "Tags". A single shared
 * search box at the top filters whichever tab is active; switching tabs keeps the
 * query and re-filters that tab's data. Each tab shows a live result count.
 * Single selection: picking an item closes the panel and updates the button.
 *
 * Built on the experimental, composable `SelectPanel` (v2) for the anchor button,
 * overlay, shared search input and listbox, and on the experimental `Tabs`
 * primitive (via its `useTabList` / `useTab` / `useTabPanel` hooks) for the
 * accessible tablist that lives between the search box and the list.
 */

const tabConfig: Array<{value: RefType; label: string; icon: Icon}> = [
  {value: 'branches', label: 'Branches', icon: GitBranchIcon},
  {value: 'tags', label: 'Tags', icon: TagIcon},
]

const filterRefs = (refs: GitRef[], query: string): GitRef[] => {
  const normalized = query.trim().toLowerCase()
  if (normalized === '') return refs
  return refs.filter(ref => ref.name.toLowerCase().includes(normalized))
}

type RefTabListProps = {'aria-label': string; children: React.ReactNode}

function RefTabList({children, ...rest}: RefTabListProps) {
  const {tabListProps} = useTabList<HTMLDivElement>(rest)
  const {ref, ...listProps} = tabListProps
  return (
    <div ref={ref as React.Ref<HTMLDivElement>} {...listProps} className={classes.TabList}>
      {children}
    </div>
  )
}

type RefTabProps = {value: RefType; count: number; icon: Icon; children: React.ReactNode}

function RefTab({value, count, icon: TabIcon, children}: RefTabProps) {
  const {tabProps} = useTab<HTMLButtonElement>({value})
  return (
    <button type="button" {...tabProps} className={classes.Tab}>
      <TabIcon size={16} />
      <span>{children}</span>
      <CounterLabel>{count}</CounterLabel>
    </button>
  )
}

type RefTabPanelProps = {value: RefType; children: React.ReactNode}

function RefTabPanel({value, children}: RefTabPanelProps) {
  const {tabPanelProps} = useTabPanel<HTMLDivElement>({value})
  return (
    <div {...tabPanelProps} className={classes.TabPanel}>
      {children}
    </div>
  )
}

export type SelectedRef = {type: RefType; name: string}

export type RefPickerProps = {
  /** Controlled selection. */
  value?: SelectedRef
  /** Called when the user picks a ref. */
  onChange?: (selected: SelectedRef) => void
  /** Label shown on the anchor button when nothing is selected. */
  placeholder?: string
}

export function RefPicker({value, onChange, placeholder = 'Switch branches/tags'}: RefPickerProps) {
  const [internalSelected, setInternalSelected] = React.useState<SelectedRef | undefined>(undefined)
  const selected = value ?? internalSelected

  const [activeTab, setActiveTab] = React.useState<RefType>('branches')
  const [query, setQuery] = React.useState('')

  const filtered = React.useMemo<Record<RefType, GitRef[]>>(
    () => ({
      branches: filterRefs(branches, query),
      tags: filterRefs(tags, query),
    }),
    [query],
  )

  const onSelectRef = (ref: GitRef) => {
    const next: SelectedRef = {type: activeTab, name: ref.name}
    setInternalSelected(next)
    onChange?.(next)
  }

  const onClosePanel = () => {
    // Reset the shared query so the next open starts fresh.
    setQuery('')
  }

  const renderList = (refs: GitRef[], type: RefType) => {
    if (refs.length === 0) {
      return (
        <SelectPanel.Message variant="empty" title={`No ${type} found`}>
          {query ? `No ${type} match "${query}".` : `There are no ${type} to show.`}
        </SelectPanel.Message>
      )
    }
    return (
      <ActionList>
        {refs.map(ref => (
          <ActionList.Item
            key={ref.id}
            onSelect={() => onSelectRef(ref)}
            selected={selected?.type === type && selected.name === ref.name}
          >
            <ActionList.LeadingVisual>{type === 'branches' ? <GitBranchIcon /> : <TagIcon />}</ActionList.LeadingVisual>
            {ref.name}
          </ActionList.Item>
        ))}
      </ActionList>
    )
  }

  const anchorIcon = selected?.type === 'tags' ? TagIcon : GitBranchIcon

  return (
    <Tabs value={activeTab} onValueChange={({value: nextValue}) => setActiveTab(nextValue as RefType)}>
      <SelectPanel
        title="Switch branches/tags"
        selectionVariant="instant"
        onSubmit={onClosePanel}
        onCancel={onClosePanel}
      >
        <SelectPanel.Button leadingVisual={anchorIcon}>{selected ? selected.name : placeholder}</SelectPanel.Button>

        <SelectPanel.Header>
          <SelectPanel.SearchInput
            aria-label="Filter branches and tags"
            value={query}
            onChange={event => setQuery(event.currentTarget.value)}
          />
          <RefTabList aria-label="Reference type">
            {tabConfig.map(tab => (
              <RefTab key={tab.value} value={tab.value} count={filtered[tab.value].length} icon={tab.icon}>
                {tab.label}
              </RefTab>
            ))}
          </RefTabList>
        </SelectPanel.Header>

        <RefTabPanel value="branches">
          {activeTab === 'branches' ? renderList(filtered.branches, 'branches') : null}
        </RefTabPanel>
        <RefTabPanel value="tags">{activeTab === 'tags' ? renderList(filtered.tags, 'tags') : null}</RefTabPanel>
      </SelectPanel>
    </Tabs>
  )
}
