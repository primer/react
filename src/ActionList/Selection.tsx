import React from 'react'
import {CheckIcon} from '@primer/octicons-react'
import {ListContext, ActionListProps} from './List'
import {GroupContext, ActionListGroupProps} from './Group'
import {ActionListItemProps} from './shared'
import {LeadingVisualContainer} from './Visuals'

type SelectionProps = Pick<ActionListItemProps, 'selected'>
export const Selection: React.FC<React.PropsWithChildren<SelectionProps>> = ({selected}) => {
  const {selectionVariant: listSelectionVariant} = React.useContext(ListContext)
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

  if (selectionVariant === 'single') {
    return <LeadingVisualContainer>{selected && <CheckIcon />}</LeadingVisualContainer>
  }

  /**
   * selectionVariant is multiple
   * we use a svg instead of an input because there should not
   * be an interactive element inside an option
   * svg copied from primer/css
   */
  return (
    <LeadingVisualContainer
      sx={{
        rect: {
          fill: selected ? 'accent.fg' : 'canvas.default',
          stroke: selected ? 'accent.fg' : 'border.default',
          shapeRendering: 'auto', // this is a workaround to override global style in github/github, see primer/react#1666
        },
        path: {
          fill: 'fg.onEmphasis',
          boxShadow: 'shadow.small',
          opacity: selected ? 1 : 0,
        },
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="2" y="2" width="12" height="12" rx="4"></rect>
        <path
          fillRule="evenodd"
          strokeWidth="0"
          d="M4.03231 8.69862C3.84775 8.20646 4.49385 7.77554 4.95539 7.77554C5.41693 7.77554 6.80154 9.85246 6.80154 9.85246C6.80154 9.85246 10.2631 4.314 10.4938 4.08323C10.7246 3.85246 11.8785 4.08323 11.4169 5.00631C11.0081 5.82388 7.26308 11.4678 7.26308 11.4678C7.26308 11.4678 6.80154 12.1602 6.34 11.4678C5.87846 10.7755 4.21687 9.19077 4.03231 8.69862Z"
        />
      </svg>
    </LeadingVisualContainer>
  )
}
