import React, {useCallback, useRef, useState} from 'react'
import {List, GroupedListProps, ListPropsBase} from '../ActionList/List'
import Overlay from '../Overlay'
import {DropdownButton, DropdownButtonProps} from './DropdownButton'
import {Item} from '../ActionList/Item'
import {useFocusTrap} from '../hooks/useFocusTrap'
import {useFocusZone} from '../hooks/useFocusZone'
import {useAnchoredPosition} from '../hooks/useAnchoredPosition'
import {useRenderForcingRef} from '../hooks/useRenderForcingRef'

export interface DropdownMenuProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase {
  renderAnchor?: <T extends React.HTMLAttributes<HTMLElement>>(props: T) => JSX.Element
}

export function DropdownMenu({
  renderAnchor = <T extends DropdownButtonProps>(props: T) => <DropdownButton {...props} />,
  renderItem = Item,
  ...listProps
}: DropdownMenuProps): JSX.Element {
  const anchorRef = useRef<HTMLElement>(null)
  const [overlayRef, updateOverlayRef] = useRenderForcingRef<HTMLDivElement>()

  const anchorId = `dropdownMenuAnchor-${window.crypto.getRandomValues(new Uint8Array(4)).join('')}`

  const [selection, select] = useState<string>('')

  const [open, setOpen] = useState<boolean>(false)
  const [focusType, setFocusType] = useState<null | 'anchor' | 'list'>(null)
  const onDismiss = useCallback(() => {
    setOpen(false)
    setFocusType(null)
  }, [])

  const onAnchorKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (!event.defaultPrevented) {
        if (!open) {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            setFocusType('list')
            setOpen(true)
            event.preventDefault()
          } else if (event.key === ' ' || event.key === 'Enter') {
            setFocusType('anchor')
            setOpen(true)
            event.preventDefault()
          }
        } else if (focusType === 'anchor') {
          if (['ArrowDown', 'ArrowUp', 'Tab', 'Enter'].indexOf(event.key) !== -1) {
            setFocusType('list')
            event.preventDefault()
          } else if (event.key === 'Escape') {
            onDismiss()
            event.preventDefault()
          }
        }
      }
    },
    [open, focusType, onDismiss]
  )
  const onAnchorClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!event.defaultPrevented && event.button === 0 && !open) {
        setOpen(true)
        setFocusType('anchor')
      }
    },
    [open]
  )

  const {position} = useAnchoredPosition({anchorElementRef: anchorRef, floatingElementRef: overlayRef})

  useFocusZone({containerRef: overlayRef, disabled: !open || focusType !== 'list' || !position})
  useFocusTrap({containerRef: overlayRef, disabled: !open || focusType !== 'list' || !position})

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
          initialFocusRef={anchorRef}
          returnFocusRef={anchorRef}
          onClickOutside={onDismiss}
          onEscape={onDismiss}
          ref={updateOverlayRef}
          {...position}
        >
          <List
            {...listProps}
            role="listbox"
            renderItem={({onClick, onKeyDown, ...itemProps}) => {
              const itemActivated = () => {
                select(itemProps.text === selection ? '' : itemProps.text ?? '')
                onDismiss()
              }

              return renderItem({
                ...itemProps,
                role: 'option',
                selected: itemProps.text === selection,
                onClick: event => {
                  itemActivated()
                  onClick && onClick(event)
                },
                onKeyDown: event => {
                  if (!event.defaultPrevented && [' ', 'Enter'].includes(event.key)) {
                    itemActivated()
                    // prevent "Enter" event from becoming a click on the anchor as overlay closes
                    event.preventDefault()
                  }
                  onKeyDown && onKeyDown(event)
                }
              })
            }}
          />
        </Overlay>
      )}
    </>
  )
}
