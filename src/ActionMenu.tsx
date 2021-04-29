import {List, ListPropsBase, GroupedListProps} from './ActionList/List'
import {Item, ItemProps} from './ActionList/Item'
import {Divider} from './ActionList/Divider'
import Button, {ButtonProps} from './Button'
import React, {useCallback} from 'react'
import {AnchoredOverlay} from './AnchoredOverlay'
import {useAwaitableState} from './hooks/useAwaitableState'

export interface ActionMenuProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderAnchor?: (props: any) => JSX.Element
  anchorContent?: React.ReactNode
  onAction?: (props: ItemProps) => void
  restoreFocusOnClose?: HTMLElement | boolean | (() => HTMLElement | boolean)
}

const ActionMenuItem = (props: ItemProps) => <Item role="menuitem" {...props} />

ActionMenuItem.displayName = 'ActionMenu.Item'

const ActionMenuBase = ({
  anchorContent,
  renderAnchor = <T extends ButtonProps>(props: T) => <Button {...props} />,
  renderItem = Item,
  onAction,
  restoreFocusOnClose,
  ...listProps
}: ActionMenuProps): JSX.Element => {
  const [open, setOpen] = useAwaitableState(false)
  const onOpen = useCallback(() => setOpen(true), [setOpen])
  const onClose = useCallback(async () => {
    await setOpen(false)
  }, [setOpen])

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
    ({onClick, ...itemProps}) =>
      renderItem({
        ...itemProps,
        role: 'menuitem',
        onKeyPress: async _event => {
          await onClose()
          onAction?.(itemProps as ItemProps)
        },
        onClick: async event => {
          onClick?.(event)
          await onClose()
          onAction?.(itemProps as ItemProps)
        }
      }),
    [onAction, onClose, renderItem]
  )

  return (
    <AnchoredOverlay
      renderAnchor={renderMenuAnchor}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      restoreFocusOnClose={restoreFocusOnClose}
    >
      <List {...listProps} role="menu" renderItem={renderMenuItem} />
    </AnchoredOverlay>
  )
}

ActionMenuBase.displayName = 'ActionMenu'

export const ActionMenu = Object.assign(ActionMenuBase, {Divider, Item: ActionMenuItem})
