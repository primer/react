import {SelectPanel} from '../SelectPanel'
import {createRef} from 'react'
import {Button} from '../Button'
import {ActionList} from '../ActionList'
import {InfoIcon} from '@primer/octicons-react'
import type {SelectPanelItemAction} from '.'
import type {SelectPanelValue} from './useSelectPanel'

export function shouldAcceptCallWithNoProps() {
  return (
    <SelectPanel
      placeholderText=""
      open={false}
      onOpenChange={() => null}
      items={[]}
      selected={[]}
      onSelectedChange={() => null}
      onFilterChange={() => null}
    />
  )
}

export function shouldAcceptDOMPropsOnOverlay() {
  return (
    <SelectPanel
      placeholderText=""
      open={false}
      onOpenChange={() => null}
      items={[]}
      selected={[]}
      onSelectedChange={() => null}
      onFilterChange={() => null}
      overlayProps={{onMouseDown: () => null}}
    />
  )
}

export function shouldAcceptComposableParts() {
  const item = {id: 'one', text: 'Item one'}
  const triggerRef = createRef<HTMLButtonElement>()
  const inputRef = createRef<HTMLInputElement>()
  const listRef = createRef<HTMLUListElement>()
  const itemRef = createRef<HTMLLIElement>()
  return (
    <SelectPanel.Root
      defaultSelected={[item.id]}
      selectionMode="multiple"
      focusStrategy="active-descendant"
      onSelectedChange={selected => selected.map(value => String(value))}
      onSubmit={selected => selected.map(value => String(value))}
    >
      <SelectPanel.Trigger ref={triggerRef} render={props => <Button {...props} />}>
        Choose items
      </SelectPanel.Trigger>
      <SelectPanel.Overlay overlayProps={{'aria-label': 'Choose items', onMouseDown: () => {}}}>
        <SelectPanel.Content>
          <SelectPanel.SearchInput ref={inputRef} aria-label="Filter items" />
          <SelectPanel.List ref={listRef} aria-label="Items">
            <SelectPanel.Item ref={itemRef} value={item.id}>
              {item.text}
              <ActionList.Description>Item description</ActionList.Description>
            </SelectPanel.Item>
          </SelectPanel.List>
        </SelectPanel.Content>
      </SelectPanel.Overlay>
    </SelectPanel.Root>
  )
}

export function shouldAcceptRovingFocus() {
  return <SelectPanel.Root focusStrategy="roving" />
}

export function shouldRejectUnknownFocusStrategies() {
  // @ts-expect-error Focus strategies must match a supported input/list contract.
  return <SelectPanel.Root focusStrategy="automatic" />
}

export function shouldAcceptSecondaryActions() {
  const actions: readonly SelectPanelItemAction[] = [
    {label: 'Details', icon: InfoIcon, onClick: () => {}},
    {label: 'Unavailable action', icon: InfoIcon, onClick: () => {}, disabled: true},
  ]
  return (
    <SelectPanel.Root>
      <SelectPanel.List aria-label="Items and actions">
        <SelectPanel.Item value={1} secondaryActions={actions} onSelect={event => event.preventDefault()}>
          Item one
        </SelectPanel.Item>
      </SelectPanel.List>
    </SelectPanel.Root>
  )
}

export function shouldRejectNonArrayCompoundSelection() {
  // @ts-expect-error Root selection is always an array; the legacy component retains its single-item API.
  return <SelectPanel.Root selected={{id: 1, text: 'Item one'}} />
}

export function shouldRejectRecordBasedCompoundSelection() {
  // @ts-expect-error The composable API uses stable values, not legacy presentation records.
  return <SelectPanel.Root selected={[{id: 1, text: 'Item one'}]} />
}

export function shouldRejectCompetingItemSelection() {
  return (
    // @ts-expect-error Root is the only selection owner.
    <SelectPanel.Item value="one" selected>
      Item one
    </SelectPanel.Item>
  )
}

export function shouldRejectCompetingQueryState() {
  // @ts-expect-error Root is the only query owner.
  return <SelectPanel.SearchInput value="query" />
}

export function shouldRejectTextCloseButtons() {
  // @ts-expect-error The close control is icon-only; customize its accessible name with aria-label.
  return <SelectPanel.CloseButton>Close picker</SelectPanel.CloseButton>
}

export function shouldAcceptExplicitActionsAndFormRefs() {
  const formRef = createRef<HTMLFormElement>()
  const buttonRef = createRef<HTMLButtonElement>()
  const selected: SelectPanelValue[] = [1, 'two']
  return (
    <SelectPanel.Root selected={selected} selectionMode="multiple" onDismiss={reason => String(reason)}>
      <SelectPanel.Form ref={formRef} onSubmit={event => event.preventDefault()}>
        <SelectPanel.SubmitButton ref={buttonRef}>Apply</SelectPanel.SubmitButton>
        <SelectPanel.CancelButton />
        <SelectPanel.CloseButton ref={buttonRef} aria-label="Close picker" />
        <SelectPanel.BackButton />
        <SelectPanel.ClearSearchButton />
        <SelectPanel.ClearSelectionButton />
      </SelectPanel.Form>
    </SelectPanel.Root>
  )
}
