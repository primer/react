import React, {useCallback, useRef, useState} from 'react'
import {List, GroupedListProps, ListPropsBase, ItemInput} from '../ActionList/List'
import Overlay from '../Overlay'
import {DropdownButton, DropdownButtonProps} from './DropdownButton'
import {Item} from '../ActionList/Item'
import {useFocusTrap} from '../hooks/useFocusTrap'
import {useFocusZone} from '../hooks/useFocusZone'
import {useAnchoredPosition} from '../hooks/useAnchoredPosition'
import {useRenderForcingRef} from '../hooks/useRenderForcingRef'
import {uniqueId} from '../utils/uniqueId'

export interface DropdownMenuProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase {
  /**
   * A custom function component used to render the anchor element.
   * Will receive the selected text as `children` prop when an item is activated.
   * Uses a `DropdownButton` by default.
   */
  renderAnchor?: <T extends React.HTMLAttributes<HTMLElement>>(props: T) => JSX.Element

  /**
   * A placeholder value to display on the trigger button when no selection has been made.
   */
  placeholder?: string

  /**
   * An `ItemProps` item from the list of `items` which is currently selected.  This item will receive a checkmark next to it in the menu.
   */
  selectedItem?: ItemInput

  /**
   * A callback which receives the selected item or `undefined` when an item is activated in the menu.  If the activated item is the same as the current
   * `selectedItem`, `undefined` will be passed.
   */
  onChange?: (item?: ItemInput) => unknown
}

/**
 * A `DropdownMenu` provides an anchor (button by default) that will open a floating menu of selectable items.  The menu can be
 * opened and navigated using keyboard or mouse.  When an item is selected, the menu will close and the `onChange` callback will be called.
 * If the default anchor button is used, the anchor contents will be updated with the selection.
 */
export function DropdownMenu({
  renderAnchor = <T extends DropdownButtonProps>(props: T) => <DropdownButton {...props} />,
  renderItem = Item,
  placeholder,
  selectedItem,
  onChange,
  ...listProps
}: DropdownMenuProps): JSX.Element {
  const anchorRef = useRef<HTMLElement>(null)
  const [overlayRef, updateOverlayRef] = useRenderForcingRef<HTMLDivElement>()

  const anchorId = `dropdownMenuAnchor-${uniqueId()}`

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
          if (['ArrowDown', 'ArrowUp'].includes(event.key)) {
            setFocusType('list')
            setOpen(true)
            event.preventDefault()
          } else if ([' ', 'Enter'].includes(event.key)) {
            setFocusType('anchor')
            setOpen(true)
            event.preventDefault()
          }
        } else if (focusType === 'anchor') {
          if (['ArrowDown', 'ArrowUp', 'Tab', 'Enter'].includes(event.key)) {
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

  const {position} = useAnchoredPosition(
    {
      anchorElementRef: anchorRef,
      floatingElementRef: overlayRef
    },
    [overlayRef.current]
  )

  useFocusZone({containerRef: overlayRef, disabled: !open || focusType !== 'list' || !position})
  useFocusTrap({containerRef: overlayRef, disabled: !open || focusType !== 'list' || !position})

  const renderItemWithCallbacks = useCallback(
    ({onClick, onKeyDown, item, ...itemProps}) => {
      const handleSelection = () => {
        onChange?.(item === selectedItem ? undefined : item)
        onDismiss()
      }

      return renderItem({
        ...itemProps,
        item,
        role: 'option',
        selected: item === selectedItem,
        onClick: event => {
          handleSelection()
          onClick?.(event)
        },
        onKeyDown: event => {
          if (!event.defaultPrevented && [' ', 'Enter'].includes(event.key)) {
            handleSelection()
            // prevent "Enter" event from becoming a click on the anchor as overlay closes
            event.preventDefault()
          }
          onKeyDown?.(event)
        }
      })
    },
    [onChange, onDismiss, renderItem, selectedItem]
  )

  return (
    <>
      {renderAnchor({
        ref: anchorRef,
        id: anchorId,
        'aria-labelledby': anchorId,
        'aria-haspopup': 'listbox',
        children: selectedItem?.text ?? placeholder,
        onClick: onAnchorClick,
        onKeyDown: onAnchorKeyDown
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
          <List {...listProps} role="listbox" renderItem={renderItemWithCallbacks} />
        </Overlay>
      ) : null}
    </>
  )
}

DropdownMenu.displayName = 'DropdownMenu'
