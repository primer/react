import {List, ListPropsBase, GroupedListProps} from './ActionList/List'
import {Item, ItemProps} from './ActionList/Item'
import {Divider} from './ActionList/Divider'
import Button, {ButtonProps} from './Button'
import React, {useCallback, useRef, useState} from 'react'
import Overlay from './Overlay'
import {useFocusTrap} from './hooks/useFocusTrap'
import {useFocusZone} from './hooks/useFocusZone'
import {useAnchoredPosition} from './hooks/useAnchoredPosition'
import {useRenderForcingRef} from './hooks/useRenderForcingRef'
import {uniqueId} from './utils/uniqueId'

export interface ActionMenuProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderAnchor?: (props: any) => JSX.Element
  anchorContent?: React.ReactNode
  onAction?: (props: ItemProps) => void
}

const ActionMenuItem = (props: ItemProps) => <Item role="menuitem" {...props} />

ActionMenuItem.displayName = 'ActionMenu.Item'

const ActionMenuBase = ({
  anchorContent,
  renderAnchor = <T extends ButtonProps>(props: T) => <Button {...props}>{anchorContent}</Button>,
  renderItem = Item,
  onAction,
  ...listProps
}: ActionMenuProps): JSX.Element => {
  const anchorRef = useRef<HTMLElement>(null)
  const [overlayRef, updateOverlayRef] = useRenderForcingRef<HTMLDivElement>()
  const anchorId = `dropdownMenuAnchor-${uniqueId()}`
  const [open, setOpen] = useState<boolean>(false)
  const [state, setState] = useState<'closed' | 'buttonFocus' | 'listFocus'>('closed')
  const onDismiss = useCallback(() => {
    setOpen(false)
    setState('closed')
  }, [])

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
            onDismiss()
            event.preventDefault()
          }
        }
      }
    },
    [state, onDismiss]
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

  const {position} = useAnchoredPosition(
    {
      anchorElementRef: anchorRef,
      floatingElementRef: overlayRef
    },
    [overlayRef.current]
  )

  useFocusZone({containerRef: overlayRef, disabled: !open || state !== 'listFocus'}, [position])
  useFocusTrap({containerRef: overlayRef, disabled: !open || state !== 'listFocus'}, [position])

  return (
    <>
      {renderAnchor({
        ref: anchorRef,
        id: anchorId,
        'aria-labelledby': anchorId,
        'aria-haspopup': 'listbox',
        'aria-label': 'menu',
        onClick: onAnchorClick,
        onKeyDown: onAnchorKeyDown,
        children: anchorContent,
        tabIndex: 0
      })}
      {open ? (
        <Overlay
          initialFocusRef={anchorRef}
          returnFocusRef={anchorRef}
          onClickOutside={onDismiss}
          onEscape={onDismiss}
          ref={updateOverlayRef}
          visibility={position ? 'visible' : 'hidden'}
          {...position}
        >
          <List
            {...listProps}
            role="menu"
            renderItem={({onClick, ...itemProps}) =>
              renderItem({
                ...itemProps,
                role: 'menuitem',
                onKeyPress: _event => {
                  onAction?.(itemProps as ItemProps)
                  onDismiss()
                },
                onClick: event => {
                  onAction?.(itemProps as ItemProps)
                  onClick?.(event)
                  onDismiss()
                }
              })
            }
          />
        </Overlay>
      ) : null}
    </>
  )
}

ActionMenuBase.displayName = 'ActionMenu'

export const ActionMenu = Object.assign(ActionMenuBase, {Divider, Item: ActionMenuItem})
