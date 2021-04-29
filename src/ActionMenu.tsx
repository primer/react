import {List, ListPropsBase, GroupedListProps} from './ActionList/List'
import {Item, ItemProps} from './ActionList/Item'
import {Divider} from './ActionList/Divider'
import Button, {ButtonProps} from './Button'
import React, {useCallback, useState} from 'react'
import {AnchoredOverlay} from './AnchoredOverlay'

export interface ActionMenuProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderAnchor?: (props: any) => JSX.Element
  anchorContent?: React.ReactNode
  onAction?: (props: ItemProps, event?: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void
}

const ActionMenuItem = (props: ItemProps) => <Item role="menuitem" {...props} />

ActionMenuItem.displayName = 'ActionMenu.Item'

const ActionMenuBase = ({
  anchorContent,
  renderAnchor = <T extends ButtonProps>(props: T) => <Button {...props} />,
  renderItem = Item,
  onAction,
  ...listProps
}: ActionMenuProps): JSX.Element => {
  const [open, setOpen] = useState(false)
  const onOpen = useCallback(() => setOpen(true), [])
  const onClose = useCallback(() => setOpen(false), [])

  const renderMenuAnchor = useCallback(
    <T extends React.HTMLAttributes<HTMLElement>>(props: T) => {
      return renderAnchor({
        'aria-label': 'menu',
        children: anchorContent,
        ...props
      })
    },
    [anchorContent, renderAnchor]
  )

  const renderMenuItem: typeof Item = useCallback(
    ({onAction: itemOnAction, ...itemProps}) => {
      const onActionWithClose = (
        props: ItemProps,
        event?: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
      ) => {
        const actionCallback = itemOnAction ?? onAction
        actionCallback?.(props as ItemProps, event)
        onClose()
      }
      return renderItem({
        ...itemProps,
        role: 'menuitem',
        onAction: onActionWithClose
      })
    },
    [onAction, onClose, renderItem]
  )

  return (
    <AnchoredOverlay renderAnchor={renderMenuAnchor} open={open} onOpen={onOpen} onClose={onClose}>
      <List {...listProps} role="menu" renderItem={renderMenuItem} />
    </AnchoredOverlay>
  )
}

ActionMenuBase.displayName = 'ActionMenu'

export const ActionMenu = Object.assign(ActionMenuBase, {Divider, Item: ActionMenuItem})
