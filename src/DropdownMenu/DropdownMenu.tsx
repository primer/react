import React, {useCallback, useState} from 'react'
import {List, GroupedListProps, ListPropsBase, ItemInput} from '../ActionList/List'
import {DropdownButton, DropdownButtonProps} from './DropdownButton'
import {Item} from '../ActionList/Item'
import {AnchoredOverlay} from '../AnchoredOverlay'

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
  const [open, setOpen] = useState(false)
  const onOpen = useCallback(() => setOpen(true), [])
  const onClose = useCallback(() => setOpen(false), [])

  const renderMenuAnchor = useCallback(
    <T extends React.HTMLAttributes<HTMLElement>>(props: T) => {
      return renderAnchor({
        ...props,
        children: selectedItem?.text ?? placeholder
      })
    },
    [placeholder, renderAnchor, selectedItem?.text]
  )

  const renderMenuItem: typeof Item = useCallback(
    ({item, onAction: itemOnAction, ...itemProps}) => {
      return renderItem({
        ...itemProps,
        item,
        role: 'option',
        selected: item === selectedItem,
        onAction: (itemFromAction, event) => {
          itemOnAction?.(itemFromAction, event)

          if (event.defaultPrevented) {
            return
          }

          onClose()
          onChange?.(item === selectedItem ? undefined : item)
        }
      })
    },
    [onChange, onClose, renderItem, selectedItem]
  )

  return (
    <AnchoredOverlay renderAnchor={renderMenuAnchor} open={open} onOpen={onOpen} onClose={onClose}>
      <List {...listProps} role="listbox" renderItem={renderMenuItem} />
    </AnchoredOverlay>
  )
}

DropdownMenu.displayName = 'DropdownMenu'
