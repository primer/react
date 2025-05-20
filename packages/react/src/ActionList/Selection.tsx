import React from 'react'
import {CheckIcon} from '@primer/octicons-react'
import type {ActionListGroupProps} from './Group'
import {GroupContext} from './Group'
import {type ActionListProps, type ActionListItemProps, ListContext} from './shared'
import {VisualContainer} from './Visuals'
import classes from './ActionList.module.css'
import Radio from '../Radio'

type SelectionProps = Pick<ActionListItemProps, 'selected' | 'className'>
export const Selection: React.FC<React.PropsWithChildren<SelectionProps>> = ({selected, className}) => {
  const {selectionVariant: listSelectionVariant, role: listRole} = React.useContext(ListContext)
  const {selectionVariant: groupSelectionVariant} = React.useContext(GroupContext)

  /** selectionVariant in Group can override the selectionVariant in List root */
  /** fallback to selectionVariant from container menu if any (ActionMenu, SelectPanel ) */
  let selectionVariant: ActionListProps['selectionVariant'] | ActionListGroupProps['selectionVariant']
  if (typeof groupSelectionVariant !== 'undefined') selectionVariant = groupSelectionVariant
  else selectionVariant = listSelectionVariant

  if (!selectionVariant) {
    // if selectionVariant is not set on List, but Item is selected
    // fail loudly instead of silently ignoring
    if (selected) {
      throw new Error(
        'For Item to be selected, ActionList or ActionList.Group needs to have a selectionVariant defined',
      )
    } else {
      return null
    }
  }

  if (selectionVariant === 'radio') {
    return (
      <VisualContainer className={className} data-component="ActionList.Selection">
        {/* This is just a way to get the visuals from Radio, but it should be ignored in terms of accessibility */}
        <Radio value="unused" checked={selected} aria-hidden tabIndex={-1} />
      </VisualContainer>
    )
  }

  if (selectionVariant === 'single' || listRole === 'menu') {
    return (
      <VisualContainer className={className} data-component="ActionList.Selection">
        <CheckIcon className={classes.SingleSelectCheckmark} />
      </VisualContainer>
    )
  }

  return (
    <VisualContainer className={className} data-component="ActionList.Selection">
      <div className={classes.MultiSelectCheckbox} />
    </VisualContainer>
  )
}
