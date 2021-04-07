import React, {useCallback, useRef, useState} from 'react'
import {List, GroupedListProps, ListPropsBase} from '../ActionList/List'
import Overlay from '../Overlay'
import {DropdownButton, DropdownButtonProps} from './DropdownButton'
import {Item} from '../ActionList/Item'

export interface DropdownMenuProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase {
  renderAnchor?: <T extends React.HTMLAttributes<HTMLElement>>(props: T) => JSX.Element
}

export function DropdownMenu({
  renderAnchor = <T extends DropdownButtonProps>(props: T) => <DropdownButton {...props} />,
  renderItem = Item,
  ...listProps
}: DropdownMenuProps): JSX.Element {
  const anchorRef = useRef<HTMLElement>(null)
  const anchorId = `dropdownMenuAnchor-${window.crypto.getRandomValues(new Uint8Array(4)).join('')}`
  const [selection, select] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const onDismiss = useCallback(() => setOpen(false), [setOpen])
  return (
    <>
      {renderAnchor({
        ref: anchorRef,
        id: anchorId,
        'aria-labelledby': anchorId,
        'aria-haspopup': 'listbox',
        children: selection,
        onClick: () => setOpen(!open)
      })}
      {open && (
        <Overlay anchorRef={anchorRef} returnFocusRef={anchorRef} onClickOutside={onDismiss} onEscape={onDismiss}>
          <List
            {...listProps}
            role="listbox"
            renderItem={({onClick, ...itemProps}) =>
              renderItem({
                ...itemProps,
                role: 'option',
                selected: itemProps.text === selection,
                onClick: event => {
                  select(itemProps.text === selection ? '' : itemProps.text ?? '')
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
