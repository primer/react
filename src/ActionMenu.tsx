import {List, ListPropsBase, GroupedListProps} from './ActionList/List'
import {Item, ItemProps} from './ActionList/Item'
import {Divider} from './ActionList/Divider'
import Button, {ButtonProps} from './Button'
import React, {useCallback, useRef, useState} from 'react'
import Overlay from './Overlay'
import randomId from './utils/randomId'
import {useFocusTrap} from './hooks/useFocusTrap'
import {useFocusZone} from './hooks/useFocusZone'
import {useAnchoredPosition} from './hooks/useAnchoredPosition'

export interface ActionMenuProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderAnchor?: (props: any) => JSX.Element
  triggerContent?: React.ReactNode
  onActivate?: (props: ItemProps) => void
}

const ActionMenuItem = (props: ItemProps) => <Item role="menuitem" {...props} />

ActionMenuItem.displayName = 'ActionMenu.Item'

const ActionMenuBase = ({
  triggerContent,
  renderAnchor = <T extends ButtonProps>(props: T) => <Button {...props}>{triggerContent}</Button>,
  renderItem = Item,
  onActivate,
  ...listProps
}: ActionMenuProps): JSX.Element => {
  const anchorRef = useRef<HTMLElement>(null)
  const anchorId = `actionMenuAnchor-${randomId()}`
  const [openState, setOpenState] = useState<'closed' | 'open' | 'ready'>('closed')
  const [state, setState] = useState<'closed' | 'buttonFocus' | 'listFocus'>('closed')

  const onDismiss = useCallback(() => {
    setOpenState('closed')
    setState('closed')
  }, [setOpenState])

  const overlayRef = React.useRef<HTMLDivElement>(null)

  const onAnchorKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (!event.defaultPrevented) {
        if (state === 'closed') {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            setState('listFocus')
            setOpenState('open')
            event.preventDefault()
          } else if (event.key === ' ' || event.key === 'Enter') {
            setState('buttonFocus')
            setOpenState('open')
            event.preventDefault()
          }
        } else if (state === 'buttonFocus') {
          if (['ArrowDown', 'ArrowUp', 'Tab', 'Enter'].indexOf(event.key) !== -1) {
            setState('listFocus')
            event.preventDefault()
          } else if (event.key === 'Escape') {
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
      if (!event.defaultPrevented && event.button === 0 && openState === 'closed') {
        setOpenState('open')
        setState('buttonFocus')
      }
    },
    [openState]
  )

  const {position} = useAnchoredPosition({anchorElementRef: anchorRef, floatingElementRef: overlayRef})

  useFocusZone({containerRef: overlayRef, disabled: !(openState === 'ready' && state === 'listFocus')})
  useFocusTrap({containerRef: overlayRef, disabled: !(openState === 'ready' && state === 'listFocus')})
  // states: closed, buttonFocus, listFocus

  return (
    <>
      {renderAnchor({
        ref: anchorRef,
        id: anchorId,
        'aria-labelledby': anchorId,
        'aria-haspopup': 'listbox',
        'aria-label': 'menu',
        onClick: onAnchorClick,
        onkeydown: onAnchorKeyDown,
        children: triggerContent,
        tabIndex: 0
      })}
      {openState !== 'closed' && (
        <Overlay
          initialFocusRef={anchorRef}
          anchorRef={anchorRef}
          returnFocusRef={anchorRef}
          onClickOutside={onDismiss}
          onEscape={onDismiss}
          ref={overlayRef}
          {...position}
        >
          <List
            {...listProps}
            role="menu"
            renderItem={({onClick, ...itemProps}) =>
              renderItem({
                ...itemProps,
                role: 'menuitem',
                onKeyPress: event => {
                  if (event.key == 'Enter' || event.key == 'Space') {
                    onActivate && onActivate(itemProps as ItemProps)
                    onDismiss()
                  }
                },
                onClick: event => {
                  onActivate && onActivate(itemProps as ItemProps)
                  onClick && onClick(event)
                  onDismiss()
                }
              })
            }
          />
        </Overlay>
      )}
    </>
  )
}

ActionMenuBase.displayName = 'ActionMenu'

export const ActionMenu = Object.assign(ActionMenuBase, {Divider: Divider, Item: ActionMenuItem})
