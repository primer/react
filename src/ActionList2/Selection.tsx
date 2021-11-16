import React from 'react'
import {CheckIcon} from '@primer/octicons-react'
import {ListContext} from './List'
import {GroupContext} from './Group'
import {ItemProps} from './Item'
import {LeadingVisualContainer} from './Visuals'

type SelectionProps = Pick<ItemProps, 'selected' | 'disabled'>
export const Selection: React.FC<SelectionProps> = ({selected, disabled}) => {
  const {selectionVariant: listSelectionVariant} = React.useContext(ListContext)
  const {selectionVariant: groupSelectionVariant} = React.useContext(GroupContext)

  /** selectionVariant in Group can override the selectionVariant in List root */
  const selectionVariant = typeof groupSelectionVariant !== 'undefined' ? groupSelectionVariant : listSelectionVariant

  // if selectionVariant is not set on List, don't show selection
  if (!selectionVariant) {
    // to avoid confusion, fail loudly instead of silently ignoring
    if (selected)
      throw new Error(
        'For Item to be selected, ActionList or ActionList.Group needs to have a selectionVariant defined'
      )
    return null
  }

  if (selectionVariant === 'single') {
    return <LeadingVisualContainer>{selected && <CheckIcon />}</LeadingVisualContainer>
  }

  /**
   * selectionVariant is multiple
   * readOnly is required because we are doing a one-way bind to `checked`
   * aria-readonly="false" tells screen that they can still interact with the checkbox
   */
  return (
    <LeadingVisualContainer sx={{input: {margin: 0, pointerEvents: 'none'}}}>
      <input type="checkbox" checked={selected} disabled={disabled} tabIndex={-1} readOnly aria-readonly="false" />
    </LeadingVisualContainer>
  )
}
