import React, {useCallback, useMemo} from 'react'
import {List, GroupedListProps, ListPropsBase, ItemInput} from '../ActionList/List'
import {DropdownButton, DropdownButtonProps} from './DropdownButton'
import {ItemProps} from '../ActionList/Item'
import {AnchoredOverlay} from '../AnchoredOverlay'
import {OverlayProps} from '../Overlay'
import {AnchoredOverlayWrapperAnchorProps} from '../AnchoredOverlay/AnchoredOverlay'
import {useProvidedRefOrCreate} from '../hooks/useProvidedRefOrCreate'
import {useProvidedStateOrCreate} from '../hooks/useProvidedStateOrCreate'

interface DropdownMenuBaseProps extends Partial<Omit<GroupedListProps, keyof ListPropsBase>>, ListPropsBase {
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

  /**
   * Props to be spread on the internal `Overlay` component.
   */
  overlayProps?: Partial<OverlayProps>

  /**
   * If defined, will control the open/closed state of the overlay. If not defined, the overlay will manage its own state (in other words, an
   * uncontrolled component). Must be used in conjuction with `onOpenChange`.
   */
  open?: boolean

  /**
   * If defined, will control the open/closed state of the overlay. Must be used in conjuction with `open`.
   */
  onOpenChange?: (open: boolean) => void
}

export type DropdownMenuProps = DropdownMenuBaseProps & AnchoredOverlayWrapperAnchorProps

/**
 * A `DropdownMenu` provides an anchor (button by default) that will open a floating menu of selectable items.  The menu can be
 * opened and navigated using keyboard or mouse.  When an item is selected, the menu will close and the `onChange` callback will be called.
 * If the default anchor button is used, the anchor contents will be updated with the selection.
 */
export function DropdownMenu({
  renderAnchor = <T extends DropdownButtonProps>(props: T) => <DropdownButton {...props} />,
  anchorRef: externalAnchorRef,
  placeholder,
  selectedItem,
  onChange,
  overlayProps,
  items,
  open,
  onOpenChange,
  ...listProps
}: DropdownMenuProps): JSX.Element {
  const [combinedOpenState, setCombinedOpenState] = useProvidedStateOrCreate(open, onOpenChange, false)
  const onOpen = useCallback(() => setCombinedOpenState(true), [setCombinedOpenState])
  const onClose = useCallback(() => setCombinedOpenState(false), [setCombinedOpenState])

  const anchorRef = useProvidedRefOrCreate(externalAnchorRef)

  const renderMenuAnchor = useMemo(() => {
    if (renderAnchor === null) {
      return null
    }
    return <T extends React.HTMLAttributes<HTMLElement>>(props: T) =>
      renderAnchor({
        ...props,
        children: selectedItem?.text ?? placeholder
      })
  }, [placeholder, renderAnchor, selectedItem?.text])

  const itemsToRender = useMemo(() => {
    return items.map(item => {
      return {
        ...item,
        role: 'option',
        selected: item === selectedItem,
        onAction: (itemFromAction, event) => {
          item.onAction?.(itemFromAction, event)

          if (event.defaultPrevented) {
            return
          }

          onClose()
          onChange?.(item === selectedItem ? undefined : item)
        }
      } as ItemProps
    })
  }, [items, onChange, onClose, selectedItem])

  return (
    <AnchoredOverlay
      renderAnchor={renderMenuAnchor}
      anchorRef={anchorRef}
      open={combinedOpenState}
      onOpen={onOpen}
      onClose={onClose}
      overlayProps={overlayProps}
    >
      <List {...listProps} role="listbox" items={itemsToRender} />
    </AnchoredOverlay>
  )
}

DropdownMenu.displayName = 'DropdownMenu'
