import React, {useCallback, useRef, useState} from 'react'
import {List, GroupedListProps, ListPropsBase} from '../ActionList/List'
import Overlay from '../Overlay'
import {DropdownButton, DropdownButtonProps} from './DropdownButton'
import {Item} from '../ActionList/Item'
import {useFocusTrap} from '../hooks/useFocusTrap'
import {useFocusZone} from '../hooks/useFocusZone'
import {useAnchoredPosition} from '../hooks/useAnchoredPosition'

export interface DropdownMenuProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase {
  renderAnchor?: <T extends React.HTMLAttributes<HTMLElement>>(props: T) => JSX.Element
}

export function DropdownMenu({
  renderAnchor = <T extends DropdownButtonProps>(props: T) => <DropdownButton {...props} />,
  renderItem = Item,
  ...listProps
}: DropdownMenuProps): JSX.Element {
  const anchorRef = useRef<HTMLElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  const anchorId = `dropdownMenuAnchor-${window.crypto.getRandomValues(new Uint8Array(4)).join('')}`
  const [selection, select] = useState<string>('')
  const [open, setOpen] = useState<boolean>(false)
  const onDismiss = useCallback(() => setOpen(false), [setOpen])

  const [state, setState] = useState<'closed' | 'buttonFocus' | 'listFocus'>('closed')
  const onAnchorKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (!event.defaultPrevented) {
        if (state === 'closed') {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            setState('listFocus')
            setOpen(true)
            event.preventDefault()
          } else if (event.key === ' ' || event.key === 'Enter') {
            setState('buttonFocus')
            setOpen(true)
            event.preventDefault()
          }
        } else if (state === 'buttonFocus') {
          if (['ArrowDown', 'ArrowUp', 'Tab', 'Enter'].indexOf(event.key) !== -1) {
            setState('listFocus')
            event.preventDefault()
          } else if (event.key === 'Escape') {
            setState('closed')
            setOpen(false)
            event.preventDefault()
          }
        }
      }
    },
    [state]
  )
  const onAnchorClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!event.defaultPrevented && event.button === 0 && !open) {
        setOpen(true)
        setState('buttonFocus')
      }
    },
    [open]
  )

  const {position} = useAnchoredPosition({anchorElementRef: anchorRef, floatingElementRef: overlayRef})

  useFocusZone({containerRef: overlayRef, disabled: !open || state !== 'listFocus'}, [position])
  useFocusTrap({containerRef: overlayRef, disabled: !open || state !== 'listFocus'}, [position])

  return (
    <>
      {renderAnchor({
        ref: anchorRef,
        id: anchorId,
        'aria-labelledby': anchorId,
        'aria-haspopup': 'listbox',
        children: selection,
        onClick: onAnchorClick,
        onKeyDown: onAnchorKeyDown
      })}
      {open && (
        <Overlay
          returnFocusRef={anchorRef}
          onClickOutside={onDismiss}
          onEscape={onDismiss}
          ref={overlayRef}
          {...position}
        >
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
