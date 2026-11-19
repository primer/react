import React from 'react'
import {isValidElementType} from 'react-is'
import {ActionList} from '../../ActionList'

export interface ActionListItemContentProps {
  text?: string
  description?: string
  descriptionVariant?: 'inline' | 'block'
  leadingVisual?: React.ElementType
  trailingVisual?: React.ElementType | React.ReactNode
  trailingIcon?: React.ElementType
  trailingText?: string
  children?: React.ReactNode
}

// Materialize slots so ActionList.Item can discover them among its direct children.
export function renderActionListItemContent({
  text,
  description,
  descriptionVariant,
  leadingVisual: LeadingVisual,
  trailingVisual: TrailingVisual,
  trailingIcon: TrailingIcon,
  trailingText,
  children,
}: ActionListItemContentProps): React.ReactNode[] {
  return React.Children.toArray([
    LeadingVisual ? (
      <ActionList.LeadingVisual key="leadingVisual">
        <LeadingVisual />
      </ActionList.LeadingVisual>
    ) : null,
    children,
    text,
    description ? (
      <ActionList.Description key="description" variant={descriptionVariant}>
        {description}
      </ActionList.Description>
    ) : null,
    TrailingVisual ? (
      <ActionList.TrailingVisual key="trailingVisual">
        {typeof TrailingVisual !== 'string' && isValidElementType(TrailingVisual) ? <TrailingVisual /> : TrailingVisual}
      </ActionList.TrailingVisual>
    ) : TrailingIcon || trailingText ? (
      <ActionList.TrailingVisual key="trailingVisual">
        {trailingText}
        {TrailingIcon && <TrailingIcon />}
      </ActionList.TrailingVisual>
    ) : null,
  ])
}
