import {clsx} from 'clsx'
import classes from '../ActionList/ActionList.module.css'
import styles from '../FilteredActionList/FilteredActionList.module.css'
import React from 'react'
import {MappedActionListItem} from '../FilteredActionList/components/MappedActionListItem'
import {ActionList} from '../ActionList'
import {ListContext} from '../ActionList/shared'

export type ListboxProps = {
  children?: React.ReactNode
  /** Defines the keyboard navigation mode for the Listbox */
  focusMode?: 'roving' | 'active-descendant'
}

export const List = React.forwardRef<HTMLUListElement, ListboxProps & {className?: string}>(function Listbox(
  {className, children, focusMode, ...rest},
  ref,
) {
  // TODO: Add conditional logic for focusMode prop

  return (
    <ListContext.Provider
      value={{
        selectionVariant: 'single',
      }}
    >
      <ul role="listbox" ref={ref} className={clsx(classes.ActionList, className)} data-variant="inset" {...rest}>
        {children}
      </ul>
    </ListContext.Provider>
  )
})

type ListItemProps = {
  className?: string
  children?: React.ReactNode
} & React.ComponentPropsWithoutRef<typeof MappedActionListItem>

export const ListItem = ({className, children = 'List Item', ...rest}: ListItemProps) => {
  return (
    <MappedActionListItem className={clsx(styles.ActionListItem, className)} {...rest}>
      {children}
    </MappedActionListItem>
  )
}

type ListGroupProps = {
  children: React.ReactNode
  groupLabel: string
  className?: string // TODO: modify
}

export const ListGroup = ({children = 'List Group', groupLabel, className, ...rest}: ListGroupProps) => {
  return (
    <ActionList.Group className={clsx(classes.ActionListGroup, className)} {...rest}>
      <ActionList.GroupHeading as="h2">{groupLabel}</ActionList.GroupHeading>
      {children}
    </ActionList.Group>
  )
}
