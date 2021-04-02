import {List, GroupedListProps, UngroupedListProps} from './ActionList/List'
import {Item} from './ActionList/Item'
import Button, {ButtonProps} from './Button'
import React, {useCallback, useRef, useState} from 'react'
import Overlay from './Overlay'

export interface ActionMenuProps extends Partial<Omit<GroupedListProps, keyof UngroupedListProps>>, UngroupedListProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderAnchor?: (props: any) => JSX.Element
  buttonContent?: React.ReactNode
}

export function ActionMenu({
  buttonContent,
  renderAnchor = <T extends ButtonProps>(props: T) => <Button {...props}>{buttonContent}</Button>,
  renderItem = Item,
  ...listProps
}: ActionMenuProps): JSX.Element {
  const anchorRef = useRef<HTMLElement>(null)
  const anchorId = `actionMenuAnchor-${window.crypto.getRandomValues(new Uint8Array(4)).join('')}`
  const [open, setOpen] = useState<boolean>(false)
  const onDismiss = useCallback(() => setOpen(false), [setOpen])
  return (
    <>
      {renderAnchor({
        ref: anchorRef,
        id: anchorId,
        'aria-labelledby': anchorId,
        'aria-haspopup': 'listbox',
        onClick: () => setOpen(!open)
      })}
      {open && (
        <Overlay anchorRef={anchorRef} returnFocusRef={anchorRef} onClickOutside={onDismiss} onEscape={onDismiss}>
          <List
            {...listProps}
            renderItem={({onClick, ...itemProps}) =>
              renderItem({
                ...itemProps,
                onClick: event => {
                  console.log('test renderItem onClick')
                  setOpen(false)
                  onClick && onClick(event)
                }
              })
            }
          />
        </Overlay>
      )}
    </>
  )
}
