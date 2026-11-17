import {InfoIcon, TagIcon, TriangleDownIcon} from '@primer/octicons-react'
import type {Meta} from '@storybook/react-vite'
import {useRef, useState, type RefObject} from 'react'
import {ActionList} from '../ActionList'
import {Button} from '../Button'
import {Dialog} from '../Dialog/Dialog'
import {useOnOutsideClick} from '../hooks/useOnOutsideClick'
import FormControl from '../FormControl'
import {SelectPanel, type SelectPanelValue} from '../SelectPanel'
import classes from './SelectPanel.composition.stories.module.css'

const meta = {
  title: 'Components/SelectPanel/Composition',
  component: SelectPanel.Root,
} satisfies Meta<typeof SelectPanel.Root>

export default meta

interface LabelOption {
  id: SelectPanelValue
  name: string
  description: string
  disabled?: boolean
}

const items: LabelOption[] = [
  {id: 'bug', name: 'Bug', description: 'Something is not working'},
  {id: 'enhancement', name: 'Enhancement', description: 'A new feature or request'},
  {id: 'design', name: 'Design', description: 'Interface and interaction design'},
  {id: 'accessibility', name: 'Accessibility', description: 'Usable by everyone'},
  {
    id: 'archived',
    name: 'Archived',
    description: 'This label is no longer available',
    disabled: true,
  },
]

const groups = [
  {label: 'Issue type', items: items.slice(0, 2)},
  {label: 'Area', items: items.slice(2)},
]

function filterItems(options: LabelOption[], filter: string) {
  const query = filter.trim().toLowerCase()
  return options.filter(item => `${item.name} ${item.description}`.toLowerCase().includes(query))
}

function selectionLabel(selected: SelectPanelValue[]) {
  return (
    items
      .filter(item => selected.includes(item.id))
      .map(item => item.name)
      .join(', ') || 'None'
  )
}

function LabelItem({option}: {option: LabelOption}) {
  return (
    <SelectPanel.Item value={option.id} disabled={option.disabled}>
      <ActionList.LeadingVisual>
        <TagIcon />
      </ActionList.LeadingVisual>
      {option.name}
      <ActionList.Description variant="block">{option.description}</ActionList.Description>
    </SelectPanel.Item>
  )
}

function NoResults() {
  return (
    <SelectPanel.Message variant="empty" title="No matching labels" size="inline">
      Try searching for a different name or description.
    </SelectPanel.Message>
  )
}

function CustomLayoutExample({
  transactional = false,
  focusStrategy,
}: {
  transactional?: boolean
  focusStrategy?: React.ComponentProps<typeof SelectPanel.Root>['focusStrategy']
}) {
  const [open, setOpen] = useState(false)
  const [committed, setCommitted] = useState<SelectPanelValue[]>(['bug'])
  const [draft, setDraft] = useState<SelectPanelValue[]>(['bug'])
  const [filter, setFilter] = useState('')
  const filteredGroups = groups
    .map(group => ({...group, items: filterItems(group.items, filter)}))
    .filter(group => group.items.length > 0)
  const resultCount = filteredGroups.reduce((count, group) => count + group.items.length, 0)

  return (
    <div className={classes.Story}>
      <SelectPanel.Root
        focusStrategy={focusStrategy}
        open={open}
        onOpenChange={nextOpen => {
          if (nextOpen) {
            setDraft([...committed])
            setFilter('')
          }
          setOpen(nextOpen)
        }}
        selectionMode="multiple"
        selected={draft}
        onSelectedChange={setDraft}
        onSubmit={values => setCommitted([...values])}
        onCancel={() => setDraft([...committed])}
        onDismiss={() => {
          if (transactional) setDraft([...committed])
          else setCommitted([...draft])
        }}
        filterValue={filter}
        onFilterChange={setFilter}
      >
        <SelectPanel.Trigger render={props => <Button {...props} trailingAction={TriangleDownIcon} />}>
          Labels ({committed.length})
        </SelectPanel.Trigger>
        <SelectPanel.Overlay>
          <SelectPanel.Content>
            <SelectPanel.Form className={classes.Form}>
              <SelectPanel.Header>
                <div>
                  <SelectPanel.Title>Choose labels</SelectPanel.Title>
                  <SelectPanel.Description>
                    {transactional
                      ? 'Changes are only applied when you save.'
                      : 'Changes are applied when you close the picker.'}
                  </SelectPanel.Description>
                </div>
              </SelectPanel.Header>
              <SelectPanel.SearchInput aria-label="Filter labels by name or description" placeholder="Find a label" />
              <SelectPanel.List aria-label="Available labels">
                {filteredGroups.map(group => (
                  <SelectPanel.Group key={group.label} label={group.label}>
                    {group.items.map(item => (
                      <LabelItem key={item.id} option={item} />
                    ))}
                  </SelectPanel.Group>
                ))}
              </SelectPanel.List>
              {resultCount === 0 && <NoResults />}
              <SelectPanel.Footer className={classes.Footer}>
                <SelectPanel.ClearSelectionButton size="small" variant="invisible" disabled={draft.length === 0}>
                  Clear selection
                </SelectPanel.ClearSelectionButton>
                <div className={classes.FooterActions}>
                  {transactional ? (
                    <>
                      <SelectPanel.CancelButton size="small">Cancel</SelectPanel.CancelButton>
                      <SelectPanel.SubmitButton size="small" variant="primary">
                        Save
                      </SelectPanel.SubmitButton>
                    </>
                  ) : (
                    <SelectPanel.SubmitButton size="small">Done</SelectPanel.SubmitButton>
                  )}
                </div>
              </SelectPanel.Footer>
            </SelectPanel.Form>
          </SelectPanel.Content>
        </SelectPanel.Overlay>
      </SelectPanel.Root>
      <p className={classes.Muted}>Saved labels: {selectionLabel(committed)}</p>
    </div>
  )
}

export const CustomLayout = () => <CustomLayoutExample />

CustomLayout.parameters = {
  docs: {
    description: {
      story:
        'V1-style multi-selection: Escape, outside click, and Done apply the current selection. Search keeps focus while the active result changes.',
    },
  },
}

export const ExplicitApplyCancel = () => <CustomLayoutExample transactional />

ExplicitApplyCancel.parameters = {
  docs: {
    description: {
      story:
        'An explicit transactional alternative, not the default: Save commits the draft; Cancel, Escape, and outside click discard it.',
    },
  },
}

export const RovingFocus = () => <CustomLayoutExample focusStrategy="roving" />

RovingFocus.parameters = {
  docs: {
    description: {
      story:
        'Opt into focusStrategy="roving" to move DOM focus into list options. Save-on-dismiss behavior is unchanged.',
    },
  },
}

export const HeaderActions = () => {
  const [selected, setSelected] = useState<SelectPanelValue[]>(['bug'])

  return (
    <div className={classes.Story}>
      <SelectPanel.Root selectionMode="multiple" selected={selected} onSelectedChange={setSelected}>
        <SelectPanel.Trigger trailingAction={TriangleDownIcon}>
          Labels with header actions ({selected.length})
        </SelectPanel.Trigger>
        <SelectPanel.Overlay width="large" displayCloseButton={false}>
          <SelectPanel.Content>
            <SelectPanel.Header className={classes.ActionHeader}>
              <div className={classes.HeaderCopy}>
                <SelectPanel.Title>Choose labels</SelectPanel.Title>
                <SelectPanel.Description>
                  Pick labels individually or select all enabled labels.
                </SelectPanel.Description>
              </div>
              <div className={classes.HeaderActions} role="group" aria-label="Label actions">
                <Button
                  type="button"
                  size="small"
                  variant="invisible"
                  onClick={() => setSelected(items.filter(item => !item.disabled).map(item => item.id))}
                >
                  Select all
                </Button>
                <SelectPanel.CloseButton size="small" aria-label="Close label picker" />
              </div>
            </SelectPanel.Header>
            <SelectPanel.List aria-label="Available labels">
              {items.map(item => (
                <LabelItem key={item.id} option={item} />
              ))}
            </SelectPanel.List>
          </SelectPanel.Content>
        </SelectPanel.Overlay>
      </SelectPanel.Root>
      <p className={classes.Muted}>Selected labels: {selectionLabel(selected)}</p>
    </div>
  )
}

HeaderActions.parameters = {
  docs: {
    description: {
      story:
        'Compose ordinary buttons and SelectPanel.CloseButton inside SelectPanel.Header. Select all updates the selection without dismissing the picker; the close button dismisses it and returns focus to the trigger. No header-actions prop or special slot is needed.',
    },
  },
}

function LabelDetails({item, returnFocusRef}: {item: LabelOption; returnFocusRef: RefObject<HTMLInputElement>}) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <SelectPanel.Item
        value={item.id}
        disabled={item.disabled}
        secondaryActions={[{label: `Details for ${item.name}`, icon: InfoIcon, onClick: () => setOpen(true)}]}
      >
        {item.name}
        <ActionList.Description variant="block">{item.description}</ActionList.Description>
      </SelectPanel.Item>
      {open ? <LabelDetailsDialog item={item} returnFocusRef={returnFocusRef} onClose={() => setOpen(false)} /> : null}
    </>
  )
}

function LabelDetailsDialog({
  item,
  returnFocusRef,
  onClose,
}: {
  item: LabelOption
  returnFocusRef: RefObject<HTMLInputElement>
  onClose: () => void
}) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLButtonElement>(null)
  // Register this portaled dialog above the parent picker's outside-click handler.
  useOnOutsideClick({
    containerRef: dialogRef,
    onClickOutside: event => {
      event.preventDefault()
      onClose()
    },
  })
  return (
    <Dialog
      ref={dialogRef}
      title={`About ${item.name}`}
      subtitle={item.description}
      width="large"
      onClose={onClose}
      returnFocusRef={returnFocusRef}
      initialFocusRef={backRef}
    >
      <p>Inspecting a label does not select it. Close this dialog to return to search with the same active label.</p>
      <Dialog.Footer>
        <Button ref={backRef} size="small" onClick={onClose}>
          Back to labels
        </Button>
      </Dialog.Footer>
    </Dialog>
  )
}

export const ListWithNestedDetails = () => {
  const searchRef = useRef<HTMLInputElement>(null)
  const [selected, setSelected] = useState<SelectPanelValue[]>([])
  const [filter, setFilter] = useState('')
  const filteredItems = filterItems(items, filter)

  return (
    <SelectPanel.Root
      selectionMode="multiple"
      selected={selected}
      onSelectedChange={setSelected}
      filterValue={filter}
      onFilterChange={setFilter}
    >
      <SelectPanel.Trigger trailingAction={TriangleDownIcon}>
        Labels with details ({selected.length})
      </SelectPanel.Trigger>
      <SelectPanel.Overlay width="large" displayCloseButton>
        <SelectPanel.Content>
          <SelectPanel.Header>
            <div>
              <SelectPanel.Title>Choose labels</SelectPanel.Title>
              <SelectPanel.Description>
                Select a label, or press Cmd/Ctrl+Shift+U to open its details. Escape returns to search.
              </SelectPanel.Description>
            </div>
          </SelectPanel.Header>
          <SelectPanel.SearchInput ref={searchRef} aria-label="Filter labels with details" placeholder="Find a label" />
          <SelectPanel.List aria-label="Labels and detail actions">
            {filteredItems.map(item => (
              <LabelDetails key={item.id} item={item} returnFocusRef={searchRef} />
            ))}
          </SelectPanel.List>
          {filteredItems.length === 0 && <NoResults />}
          <SelectPanel.Footer className={classes.Footer}>
            <span className={classes.Muted}>{selected.length} selected</span>
          </SelectPanel.Footer>
        </SelectPanel.Content>
      </SelectPanel.Overlay>
    </SelectPanel.Root>
  )
}

export const WithoutSearchInput = () => {
  const [selected, setSelected] = useState<SelectPanelValue[]>([])

  return (
    <SelectPanel.Root selectionMode="single" closeOnSelect selected={selected} onSelectedChange={setSelected}>
      <SelectPanel.Trigger trailingAction={TriangleDownIcon}>
        {selected.length > 0 ? selectionLabel(selected) : 'Choose a label'}
      </SelectPanel.Trigger>
      <SelectPanel.Overlay>
        <SelectPanel.Content>
          <SelectPanel.Header>
            <SelectPanel.Title>Choose a label</SelectPanel.Title>
          </SelectPanel.Header>
          <SelectPanel.List aria-label="Available labels">
            {items.map(item => (
              <LabelItem key={item.id} option={item} />
            ))}
          </SelectPanel.List>
        </SelectPanel.Content>
      </SelectPanel.Overlay>
    </SelectPanel.Root>
  )
}

export const InlineList = () => {
  const [selected, setSelected] = useState<SelectPanelValue[]>([])
  const [filter, setFilter] = useState('')
  const filteredItems = filterItems(items, filter)

  return (
    <SelectPanel.Root
      selectionMode="single"
      closeOnSelect={false}
      selected={selected}
      onSelectedChange={setSelected}
      filterValue={filter}
      onFilterChange={setFilter}
    >
      <SelectPanel.Content className={classes.InlinePanel}>
        <SelectPanel.Header>
          <div>
            <SelectPanel.Title as="h2">Primary label</SelectPanel.Title>
            <SelectPanel.Description>
              This picker stays in the page without a trigger or overlay.
            </SelectPanel.Description>
          </div>
        </SelectPanel.Header>
        <SelectPanel.SearchInput aria-label="Filter primary labels" placeholder="Find a label" />
        <SelectPanel.List aria-label="Primary label choices">
          {filteredItems.map(item => (
            <LabelItem key={item.id} option={item} />
          ))}
        </SelectPanel.List>
        {filteredItems.length === 0 && <NoResults />}
        <SelectPanel.Footer>
          <span className={classes.Muted}>Selected: {selectionLabel(selected)}</span>
        </SelectPanel.Footer>
      </SelectPanel.Content>
    </SelectPanel.Root>
  )
}

export const ResponsiveImmediateSelection = () => {
  const [selected, setSelected] = useState<SelectPanelValue[]>([])
  const [filter, setFilter] = useState('')
  const filteredItems = filterItems(items, filter)

  return (
    <FormControl>
      <FormControl.Label>Primary label</FormControl.Label>
      <SelectPanel.Root
        selectionMode="single"
        closeOnSelect
        selected={selected}
        onSelectedChange={setSelected}
        filterValue={filter}
        onFilterChange={setFilter}
      >
        <SelectPanel.Trigger trailingAction={TriangleDownIcon}>
          {selected.length > 0 ? selectionLabel(selected) : 'Choose a primary label'}
        </SelectPanel.Trigger>
        <SelectPanel.Overlay variant={{regular: 'modal', narrow: 'bottom-sheet'}}>
          <SelectPanel.Content>
            <SelectPanel.Header>
              <div>
                <SelectPanel.Title>Choose a primary label</SelectPanel.Title>
                <SelectPanel.Description>Selection applies immediately and closes this dialog.</SelectPanel.Description>
              </div>
              <SelectPanel.CloseButton size="small" variant="invisible" />
            </SelectPanel.Header>
            <SelectPanel.SearchInput aria-label="Filter primary labels" placeholder="Find a label" />
            <SelectPanel.List aria-label="Primary label choices">
              {filteredItems.map(item => (
                <LabelItem key={item.id} option={item} />
              ))}
            </SelectPanel.List>
            {filteredItems.length === 0 && <NoResults />}
          </SelectPanel.Content>
        </SelectPanel.Overlay>
      </SelectPanel.Root>
      <FormControl.Caption>The selected label is applied immediately.</FormControl.Caption>
    </FormControl>
  )
}
