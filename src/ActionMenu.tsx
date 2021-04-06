import {List, ListPropsBase, GroupedListProps} from './ActionList/List'
import {Item, ItemProps} from './ActionList/Item'
import {Divider} from './ActionList/Divider'
import Button, {ButtonProps} from './Button'
import React, {useCallback, useRef, useState} from 'react'
import Overlay from './Overlay'

export interface ActionMenuProps extends ListPropsBase, GroupedListProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderAnchor?: (props: any) => JSX.Element
  buttonContent?: React.ReactNode
  renderItem?: (props: ItemProps) => JSX.Element
}

const ActionMenuItem = (props: ItemProps) => <Item role="menuitem" {...props} />

ActionMenuItem.displayName = 'ActionMenu.Item'

const ActionMenuBase = ({
  buttonContent,
  renderAnchor = <T extends ButtonProps>(props: T) => <Button {...props}>{buttonContent}</Button>,
  renderItem = ActionMenuItem,
  ...listProps
}: ActionMenuProps): JSX.Element => {
  const anchorRef = useRef<HTMLElement>(null)
  const anchorId = `actionMenuAnchor-${window.crypto.getRandomValues(new Uint8Array(4)).join('')}`
  const [open, setOpen] = useState<boolean>(false)
  const onDismiss = useCallback(() => setOpen(false), [setOpen])
  const onToggle = useCallback(() => setOpen(!open), [setOpen, open])
  return (
    <>
      {renderAnchor({
        ref: anchorRef,
        id: anchorId,
        'aria-labelledby': anchorId,
        'aria-haspopup': 'listbox',
        onClick: onToggle,
        children: buttonContent
      })}
      {open && (
        <Overlay p={2} anchorRef={anchorRef} returnFocusRef={anchorRef} onClickOutside={onDismiss} onEscape={onDismiss}>
          <List role="menu" {...listProps} afterSelect={onDismiss} renderItem={renderItem} />
        </Overlay>
      )}
    </>
  )
}

export const ActionMenu = Object.assign(ActionMenuBase, {Divider: Divider, Item: ActionMenuItem})
