import React from 'react'
import {CheckIcon} from '@primer/octicons-react'
import {useTheme} from '../ThemeProvider'
import {ListContext} from './List'
import {ItemProps} from './Item'
import {LeadingVisualContainer} from './Visuals'

type SelectionProps = Pick<ItemProps, 'selected' | 'disabled'>
export const Selection: React.FC<SelectionProps> = ({selected, disabled}) => {
  const {selectionVariant} = React.useContext(ListContext)
  const {theme} = useTheme()

  if (typeof selected === 'undefined') return null

  if (selectionVariant === 'single') {
    return (
      <LeadingVisualContainer> {selected && <CheckIcon fill={theme?.colors.text.primary} />}</LeadingVisualContainer>
    )
  }

  if (selectionVariant === 'multiple') {
    /**
     * readOnly is required because we are doing a one-way bind to `checked`
     * aria-readonly="false" tells screen that they can still interact with the checkbox
     * TODO: not sure if disabled & aria-label be here or should we apply it on the instance as props
     * TODO: aria-label should come from the text part of the slot
     */
    return (
      <LeadingVisualContainer sx={{input: {margin: 0, pointerEvents: 'none'}}}>
        <input
          type="checkbox"
          checked={selected}
          disabled={disabled}
          aria-label="TODO"
          tabIndex={-1}
          readOnly
          aria-readonly="false"
        />
      </LeadingVisualContainer>
    )
  }

  return null
}
