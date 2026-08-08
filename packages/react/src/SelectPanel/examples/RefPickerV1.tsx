import type React from 'react'
import {useMemo, useRef, useState} from 'react'
import {GitBranchIcon, TagIcon, TriangleDownIcon} from '@primer/octicons-react'
import {Button} from '../../Button'
import {Tabs, useTab, useTabList} from '../../experimental'
import type {ItemInput} from '../../FilteredActionList'
import {SelectPanel} from '../SelectPanel'
import classes from './RefPickerV1.module.css'

type RefType = 'branches' | 'tags'

export type RefSelection = {
  type: RefType
  name: string
}

export type RefPickerV1Props = {
  /** Branch names to show in the "Branches" tab. */
  branches: string[]
  /** Tag names to show in the "Tags" tab. */
  tags: string[]
  /** Tab shown when the panel first opens. */
  initialTab?: RefType
  /** Pre-selected ref. */
  initialSelection?: RefSelection
  /** Called whenever the user picks a ref. */
  onSelect?: (selection: RefSelection) => void
}

// Encode the tab into the item id so we can recover it from a selected item
// without keeping a parallel lookup table.
const makeId = (type: RefType, name: string) => `${type}:${name}`
const tabFromId = (id: string): RefType => (id.startsWith('tags:') ? 'tags' : 'branches')
const nameFromId = (id: string) => id.slice(id.indexOf(':') + 1)

const toItem = (type: RefType, name: string): ItemInput => ({
  id: makeId(type, name),
  text: name,
  leadingVisual: type === 'branches' ? GitBranchIcon : TagIcon,
})

const filterNames = (names: string[], query: string) => {
  const q = query.trim().toLowerCase()
  if (q === '') return names
  return names.filter(name => name.toLowerCase().includes(q))
}

/**
 * A single tab button wired up with the headless `useTab` hook so we get correct
 * `role="tab"`, `aria-selected`, roving tabindex and activation behaviour.
 */
function RefTab({
  value,
  icon: Icon,
  label,
  count,
}: {
  value: RefType
  icon: React.ElementType
  label: string
  count: number
}) {
  const {tabProps} = useTab({value})
  return (
    <button type="button" {...tabProps} className={classes.Tab}>
      <Icon size={16} />
      {label} <span className={classes.Count}>({count})</span>
    </button>
  )
}

/**
 * Tablist rendered into the stable SelectPanel's `subtitle` slot. The stable
 * SelectPanel exposes no general content slot between its header and its
 * filtered list, so the tabs live in the only ReactElement slot available.
 */
function RefTabs({
  activeTab,
  onTabChange,
  branchCount,
  tagCount,
}: {
  activeTab: RefType
  onTabChange: (tab: RefType) => void
  branchCount: number
  tagCount: number
}) {
  const {tabListProps} = useTabList<HTMLDivElement>({'aria-label': 'Reference type'})
  return (
    <Tabs value={activeTab} onValueChange={({value}) => onTabChange(value as RefType)}>
      {/* @ts-expect-error tabListProps.ref is typed as RefObject<HTMLDivElement | null> */}
      <div {...tabListProps} className={classes.TabList}>
        <RefTab value="branches" icon={GitBranchIcon} label="Branches" count={branchCount} />
        <RefTab value="tags" icon={TagIcon} label="Tags" count={tagCount} />
      </div>
    </Tabs>
  )
}

export function RefPickerV1({branches, tags, initialTab = 'branches', initialSelection, onSelect}: RefPickerV1Props) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState('')
  const [activeTab, setActiveTab] = useState<RefType>(initialTab)
  const [selected, setSelected] = useState<ItemInput | undefined>(() =>
    initialSelection ? toItem(initialSelection.type, initialSelection.name) : undefined,
  )
  const anchorRef = useRef<HTMLButtonElement>(null)

  const filteredBranches = useMemo(() => filterNames(branches, filter), [branches, filter])
  const filteredTags = useMemo(() => filterNames(tags, filter), [tags, filter])

  const activeNames = activeTab === 'branches' ? filteredBranches : filteredTags
  const items = useMemo(() => activeNames.map(name => toItem(activeTab, name)), [activeNames, activeTab])

  const handleSelectedChange = (item: ItemInput | undefined) => {
    setSelected(item)
    if (item && typeof item.id === 'string') {
      onSelect?.({type: tabFromId(item.id), name: nameFromId(item.id)})
    }
  }

  const buttonLabel = selected?.text ?? (activeTab === 'tags' ? 'Select a tag' : 'Select a branch')
  const ButtonIcon =
    selected && typeof selected.id === 'string' && tabFromId(selected.id) === 'tags' ? TagIcon : GitBranchIcon

  const tabs = (
    <RefTabs
      activeTab={activeTab}
      onTabChange={setActiveTab}
      branchCount={filteredBranches.length}
      tagCount={filteredTags.length}
    />
  )

  const noResults =
    activeNames.length === 0
      ? {
          variant: 'empty' as const,
          title: `No ${activeTab} found`,
          body: filter ? `No ${activeTab} match “${filter}”.` : `There are no ${activeTab} to show.`,
        }
      : undefined

  return (
    <SelectPanel
      title="Switch branches/tags"
      subtitle={tabs}
      renderAnchor={({children, ...anchorProps}) => (
        <Button ref={anchorRef} leadingVisual={ButtonIcon} trailingAction={TriangleDownIcon} {...anchorProps}>
          {children}
        </Button>
      )}
      anchorRef={anchorRef}
      placeholder={buttonLabel}
      placeholderText="Filter by name"
      inputLabel={`Filter ${activeTab}`}
      open={open}
      onOpenChange={setOpen}
      items={items}
      selected={selected}
      onSelectedChange={handleSelectedChange}
      filterValue={filter}
      onFilterChange={setFilter}
      message={noResults}
      overlayProps={{width: 'small', height: 'medium'}}
    />
  )
}
