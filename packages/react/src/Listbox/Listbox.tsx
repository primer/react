import {clsx} from 'clsx'
// import classes from '../ActionList/ActionList.module.css'
// import styles from '../FilteredActionList/FilteredActionList.module.css'
import styles from './Listbox.module.css'
import React from 'react'
import {MappedActionListItem} from '../FilteredActionList/components/MappedActionListItem'
import {ActionList} from '../ActionList'

export type ListboxProps = {
  children?: React.ReactNode
  /** Defines the keyboard navigation mode for the Listbox */
  focusMode?: 'roving' | 'active-descendant'
}

export const List = React.forwardRef<HTMLUListElement, ListboxProps & {className?: string}>(function Listbox(
  {className, children, focusMode},
  ref,
) {
  // TODO: Add conditional logic for focusMode prop

  return (
    <div className={clsx(className, styles.Container)}>
      <ActionList ref={ref} variant="inset" disableFocusZone={true} role="listbox" selectionVariant="multiple">
        {children}
      </ActionList>
    </div>
  )
})

type ListItemProps = {
  className?: string
  children?: React.ReactNode
  onClick?: () => void
} & React.ComponentPropsWithoutRef<typeof MappedActionListItem>

export const ListItem = ({className, children = 'List Item', ...rest}: ListItemProps) => {
  const [selected, setSelected] = React.useState(false)

  // TODO: Should only apply when uncontrolled
  const onClick = () => {
    if (rest.onClick) {
      rest.onClick()
    }

    setSelected(!selected)
  }

  return (
    <MappedActionListItem
      selected={selected}
      className={clsx(styles.ActionListItem, className)}
      onClick={onClick}
      {...rest}
    >
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
    <ActionList.Group className={className} {...rest}>
      <ActionList.GroupHeading>{groupLabel}</ActionList.GroupHeading>
      {children}
    </ActionList.Group>
  )
}
