import {GroupedListProps, List, ListPropsBase} from './ActionList/List'
import {Item, ItemProps} from './ActionList/Item'
import {Divider} from './ActionList/Divider'
import Button, {ButtonProps} from './Button'
import React, {useCallback, useEffect, useRef} from 'react'
import {AnchoredOverlay} from './AnchoredOverlay'
import {useProvidedStateOrCreate} from './hooks/useProvidedStateOrCreate'
export interface ActionMenuProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderAnchor?: (props: any) => JSX.Element
  anchorContent?: React.ReactNode
  onAction?: (props: ItemProps, event?: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>) => void
  open?: boolean
  setOpen?: (s: boolean) => void
}

const ActionMenuItem = (props: ItemProps) => <Item role="menuitem" {...props} />

ActionMenuItem.displayName = 'ActionMenu.Item'

const ActionMenuBase = ({
  anchorContent,
  renderAnchor = <T extends ButtonProps>(props: T) => <Button {...props} />,
  renderItem = Item,
  onAction,
  open,
  setOpen,
  ...listProps
}: ActionMenuProps): JSX.Element => {
  const pendingActionRef = useRef<() => unknown>()
  const [combinedOpenState, setCombinedOpenState] = useProvidedStateOrCreate(open, setOpen, false)
  const onOpen = useCallback(() => setCombinedOpenState(true), [setCombinedOpenState])
  const onClose = useCallback(() => setCombinedOpenState(false), [setCombinedOpenState])

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
      return renderItem({
        ...itemProps,
        role: 'menuitem',
        onAction: (props, event) => {
          const actionCallback = itemOnAction ?? onAction
          pendingActionRef.current = () => actionCallback?.(props as ItemProps, event)
          actionCallback?.(props as ItemProps, event)
          onClose()
        }
      })
    },
    [onAction, onClose, renderItem]
  )

  useEffect(() => {
    // Wait until menu has re-rendered in a closed state before triggering action.
    // This is needed in scenarios where the action will move focus, which would otherwise be captured by focus trap
    if (!open && pendingActionRef.current) {
      pendingActionRef.current()
      pendingActionRef.current = undefined
    }
  }, [open])

  return (
    <AnchoredOverlay renderAnchor={renderMenuAnchor} open={combinedOpenState} onOpen={onOpen} onClose={onClose}>
      <List {...listProps} role="menu" renderItem={renderMenuItem} />
    </AnchoredOverlay>
  )
}

ActionMenuBase.displayName = 'ActionMenu'

export const ActionMenu = Object.assign(ActionMenuBase, {Divider, Item: ActionMenuItem})
