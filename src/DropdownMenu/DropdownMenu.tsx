import React, {useCallback, useRef, useState} from 'react'
import {List, GroupedListProps, UngroupedListProps} from '../ActionList/List'
import Overlay from '../Overlay'
import Button, {ButtonProps} from '../Button'
import {Item} from '../ActionList/Item'

export interface DropdownMenuProps extends Partial<Omit<GroupedListProps, 'items'>>, UngroupedListProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderAnchor?: (props: any) => JSX.Element
}

export function DropdownMenu({
  renderAnchor = (props: ButtonProps) => <Button {...props} />,
  renderItem = Item,
  ...listProps
}: DropdownMenuProps): JSX.Element {
  const anchorRef = useRef<HTMLElement>(null)
  const [selection, select] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const onDismiss = useCallback(() => setOpen(false), [setOpen])
  return (
    <>
      {renderAnchor({ref: anchorRef, children: selection, onClick: () => setOpen(!open)})}
      {open && (
        <Overlay anchorRef={anchorRef} returnFocusRef={anchorRef} onClickOutside={onDismiss} onEscape={onDismiss}>
          <List
            {...listProps}
            renderItem={({onClick, ...itemProps}) =>
              renderItem({
                ...itemProps,
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
