import React from 'react'
import {clsx} from 'clsx'
import classes from './List.module.css'
import {useSlots} from '../../hooks/useSlots'
import {Description} from './Description'
import {Label} from './Label'
import {LeadingVisual, TrailingVisual} from './Visual'

type ListItemProps = {
  className?: string
  children: React.ReactNode
}

function ListItem({className, children}: ListItemProps) {
  const baseSlots = {
    description: Description,
    label: Label,
    leadingVisual: LeadingVisual,
    trailingVisual: TrailingVisual,
  }

  const [slots] = useSlots(children, {
    ...baseSlots,
  })

  return (
    <li className={clsx(classes.ListItem, className)}>
      <span>{slots.leadingVisual}</span>
      <span>
        {slots.label}
        {slots.description}
      </span>
      <span>{slots.trailingVisual}</span>
    </li>
  )
}

ListItem.Description = Description
ListItem.Label = Label
ListItem.LeadingVisual = LeadingVisual
ListItem.TrailingVisual = TrailingVisual

export {ListItem}
export type {ListItemProps}
