import type React from 'react'
import {useCallback, useMemo, useRef, useState} from 'react'
import {CheckIcon, GitBranchIcon, TagIcon, TriangleDownIcon} from '@primer/octicons-react'
import {AnchoredOverlay} from '../../AnchoredOverlay'
import {Button} from '../../Button'
import TextInput from '../../TextInput'
import {useFocusZone, FocusKeys} from '../../hooks/useFocusZone'
import {useId} from '../../hooks/useId'
import classes from './RefPickerV1Correct.module.css'

type RefKind = 'branches' | 'tags'

export type SelectedRef = {kind: RefKind; name: string}

export type RefPickerV1CorrectProps = {
  branches: string[]
  tags: string[]
  initialSelected?: SelectedRef
  onSelect?: (selected: SelectedRef) => void
}

const TABS: Array<{kind: RefKind; label: string; icon: React.ComponentType}> = [
  {kind: 'branches', label: 'Branches', icon: GitBranchIcon},
  {kind: 'tags', label: 'Tags', icon: TagIcon},
]

function filterRefs(values: string[], query: string): string[] {
  const q = query.trim().toLowerCase()
  if (!q) return values
  return values.filter(value => value.toLowerCase().includes(q))
}

/**
 * A reference picker (choose a git ref) built as a self-contained component.
 *
 * Why this is NOT built on the stable `SelectPanel`:
 * The stable `SelectPanel` renders a fixed internal layout — title/subtitle →
 * notice → an internally-owned `FilteredActionList` — and exposes no content slot
 * between the header and the list. The `FilteredActionList`'s `role="listbox"` is
 * created internally, its id is generated internally (not exposed), and its
 * `aria-labelledby` is hardwired to the panel title. There is therefore no way to
 * (a) insert a `role="tablist"` of tabs, (b) wrap the listbox in a `role="tabpanel"`,
 * or (c) point a tab's `aria-controls` at the listbox / panel. Meeting the
 * APG Tabs accessibility-correctness requirement is impossible through that closed
 * API, so the overlay, shared filter input, listbox and its focus management are
 * re-implemented here on the public `AnchoredOverlay` primitive + `useFocusZone`.
 *
 * The tab → tabpanel → listbox relationship is fully wired:
 *   - tab:      role="tab",      id=tabId,   aria-controls=panelId, aria-selected
 *   - tabpanel: role="tabpanel", id=panelId, aria-labelledby=tabId
 *   - listbox:  role="listbox",  id=listboxId, aria-labelledby=tabId, inside the tabpanel
 *   - options:  role="option",   id=optionId, aria-selected
 *   - the shared filter input is a role="combobox" whose aria-controls points at the
 *     active tab's listbox, with aria-activedescendant managed by the focus zone.
 */
export function RefPickerV1Correct({branches, tags, initialSelected, onSelect}: RefPickerV1CorrectProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<RefKind>('branches')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<SelectedRef | undefined>(initialSelected)

  const inputRef = useRef<HTMLInputElement>(null)
  const [listContainerElement, setListContainerElement] = useState<HTMLUListElement | null>(null)
  const activeOptionNameRef = useRef<string | undefined>(undefined)

  const baseId = useId()
  const titleId = `${baseId}-title`
  const tabId = (kind: RefKind) => `${baseId}-tab-${kind}`
  const panelId = (kind: RefKind) => `${baseId}-panel-${kind}`
  const listboxId = (kind: RefKind) => `${baseId}-listbox-${kind}`
  const optionId = (kind: RefKind, index: number) => `${baseId}-option-${kind}-${index}`

  const filtered = useMemo(
    () => ({
      branches: filterRefs(branches, query),
      tags: filterRefs(tags, query),
    }),
    [branches, tags, query],
  )

  const activeItems = filtered[activeTab]

  // Re-implemented listbox focus management: keeps DOM focus on the shared filter
  // input while moving aria-activedescendant across the active listbox's options.
  useFocusZone(
    {
      containerRef: {current: listContainerElement},
      bindKeys: FocusKeys.ArrowVertical | FocusKeys.HomeAndEnd | FocusKeys.PageUpDown,
      focusOutBehavior: 'wrap',
      activeDescendantFocus: inputRef,
      focusInStrategy: 'first',
      focusableElementFilter: element => !(element instanceof HTMLInputElement),
      onActiveDescendantChanged: current => {
        activeOptionNameRef.current = current?.getAttribute('data-ref-name') ?? undefined
      },
    },
    [listContainerElement, activeTab],
  )

  const commitSelection = useCallback(
    (name: string) => {
      const next: SelectedRef = {kind: activeTab, name}
      setSelected(next)
      onSelect?.(next)
      setOpen(false)
    },
    [activeTab, onSelect],
  )

  const onInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        const name = activeOptionNameRef.current ?? activeItems[0]
        if (name) {
          event.preventDefault()
          commitSelection(name)
        }
      }
    },
    [activeItems, commitSelection],
  )

  const selectTab = useCallback((kind: RefKind) => {
    setActiveTab(kind)
    activeOptionNameRef.current = undefined
    inputRef.current?.focus()
  }, [])

  const onTabListKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const order = TABS.map(tab => tab.kind)
      const currentIndex = order.indexOf(activeTab)
      let nextIndex: number
      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          nextIndex = (currentIndex + 1) % order.length
          break
        case 'ArrowLeft':
        case 'ArrowUp':
          nextIndex = (currentIndex - 1 + order.length) % order.length
          break
        case 'Home':
          nextIndex = 0
          break
        case 'End':
          nextIndex = order.length - 1
          break
        default:
          return
      }
      event.preventDefault()
      selectTab(order[nextIndex])
    },
    [activeTab, selectTab],
  )

  const anchorIcon = selected?.kind === 'tags' ? TagIcon : GitBranchIcon
  const anchorLabel = selected ? selected.name : 'Select a ref'

  return (
    <AnchoredOverlay
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      width="small"
      focusTrapSettings={{initialFocusRef: inputRef}}
      overlayProps={{role: 'dialog', 'aria-labelledby': titleId}}
      renderAnchor={anchorProps => (
        <Button {...anchorProps} leadingVisual={anchorIcon} trailingVisual={TriangleDownIcon}>
          {anchorLabel}
        </Button>
      )}
    >
      <div className={classes.Panel}>
        <div className={classes.Header}>
          <h1 id={titleId} className={classes.Title}>
            Switch branches/tags
          </h1>
        </div>

        <div className={classes.Search}>
          <TextInput
            ref={inputRef}
            value={query}
            onChange={event => {
              setQuery(event.target.value)
              activeOptionNameRef.current = undefined
            }}
            onKeyDown={onInputKeyDown}
            leadingVisual={GitBranchIcon}
            placeholder="Filter branches and tags"
            aria-label="Filter branches and tags"
            role="combobox"
            aria-expanded
            aria-autocomplete="list"
            aria-controls={listboxId(activeTab)}
            block
          />
        </div>

        {}
        <div role="tablist" aria-label="Reference type" className={classes.TabList} onKeyDown={onTabListKeyDown}>
          {TABS.map(({kind, label, icon: Icon}) => {
            const isActive = kind === activeTab
            return (
              <button
                key={kind}
                type="button"
                role="tab"
                id={tabId(kind)}
                aria-selected={isActive}
                aria-controls={panelId(kind)}
                tabIndex={isActive ? 0 : -1}
                className={classes.Tab}
                onClick={() => selectTab(kind)}
              >
                <Icon />
                <span>{label}</span>
                <span className={classes.Count}>({filtered[kind].length})</span>
              </button>
            )
          })}
        </div>

        {TABS.map(({kind}) => {
          const isActive = kind === activeTab
          const items = filtered[kind]
          return (
            <div
              key={kind}
              role="tabpanel"
              id={panelId(kind)}
              aria-labelledby={tabId(kind)}
              hidden={!isActive}
              tabIndex={-1}
              className={classes.TabPanel}
            >
              <div className={classes.ListContainer}>
                {items.length === 0 ? (
                  <div className={classes.Empty}>No {kind} match your filter.</div>
                ) : (
                  <ul
                    role="listbox"
                    id={listboxId(kind)}
                    aria-labelledby={tabId(kind)}
                    className={classes.Listbox}
                    ref={isActive ? setListContainerElement : undefined}
                  >
                    {items.map((name, index) => {
                      const isSelected = selected?.kind === kind && selected.name === name
                      return (
                        <li
                          key={name}
                          role="option"
                          id={optionId(kind, index)}
                          data-ref-name={name}
                          aria-selected={isSelected}
                          tabIndex={-1}
                          className={classes.Option}
                          onClick={() => commitSelection(name)}
                        >
                          <span className={classes.OptionLeading}>
                            {kind === 'branches' ? <GitBranchIcon /> : <TagIcon />}
                          </span>
                          <span className={classes.OptionText}>{name}</span>
                          <span className={classes.OptionCheck}>
                            <CheckIcon />
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </AnchoredOverlay>
  )
}
