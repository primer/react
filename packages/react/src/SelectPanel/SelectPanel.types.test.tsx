import React from 'react'
import {SelectPanel} from './SelectPanel'
import type {SelectPanelRootProps} from '../experimental'

export function acceptsCoreParts(props: SelectPanelRootProps) {
  const inputRef = React.createRef<HTMLInputElement>()
  const listRef = React.createRef<HTMLUListElement>()
  return (
    <SelectPanel.Root {...props}>
      <SelectPanel.Trigger>Choose</SelectPanel.Trigger>
      <SelectPanel.Overlay overlayProps={{'aria-label': 'Options'}}>
        <SelectPanel.Content>
          <SelectPanel.Title as="h3">Options</SelectPanel.Title>
          <SelectPanel.SearchInput ref={inputRef} />
          <SelectPanel.List ref={listRef}>
            <SelectPanel.Item value={1}>One</SelectPanel.Item>
          </SelectPanel.List>
          <SelectPanel.CloseButton />
        </SelectPanel.Content>
      </SelectPanel.Overlay>
    </SelectPanel.Root>
  )
}

export function rejectsCompetingSelection() {
  return (
    // @ts-expect-error The root owns selection.
    <SelectPanel.Item value="one" selected>
      One
    </SelectPanel.Item>
  )
}

export function rejectsCompetingQuery() {
  // @ts-expect-error The root owns query state.
  return <SelectPanel.SearchInput value="query" />
}

export function rejectsRecordValues() {
  // @ts-expect-error Composition uses stable values, not configured records.
  return <SelectPanel.Root selected={[{id: 1}]} />
}
