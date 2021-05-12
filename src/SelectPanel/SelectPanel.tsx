import React, {useCallback, useMemo} from 'react'

import {FilteredActionList, FilteredActionListProps} from '../FilteredActionList'
import {OverlayProps} from '../Overlay'
import {ItemInput} from '../ActionList/List'
import {FocusZoneSettings} from '../behaviors/focusZone'
import {DropdownButton, DropdownButtonProps} from '../DropdownMenu'
import {ItemProps} from '../ActionList'
import {AnchoredOverlay} from '../AnchoredOverlay'
import Flex from '../Flex'

export interface SelectPanelProps extends Omit<FilteredActionListProps, 'onChange'> {
  open: boolean
  onOpen: (gesture: 'anchor-click' | 'anchor-key-press') => unknown
  onClose: (gesture: 'click-outside' | 'escape') => unknown
  renderAnchor?: <T extends React.HTMLAttributes<HTMLElement>>(props: T) => JSX.Element
  placeholder?: string
  selectedItems: ItemInput[]
  selectionVariant?: 'single' | 'multiple'
  onChange?: (selectedItems: ItemInput[]) => unknown
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => unknown
  overlayProps?: Partial<OverlayProps>
}

const focusZoneSettings: Partial<FocusZoneSettings> = {
  focusOutBehavior: 'wrap',
  focusableElementFilter: element => {
    return !(element instanceof HTMLInputElement) || element.type !== 'checkbox'
  }
}

export function SelectPanel({
  open,
  onOpen,
  onClose,
  renderAnchor = <T extends DropdownButtonProps>(props: T) => <DropdownButton {...props} />,
  placeholder,
  selectedItems,
  selectionVariant = 'single',
  onChange,
  onFilterChange,
  items,
  overlayProps,
  ...listProps
}: SelectPanelProps): JSX.Element {
  const renderMenuAnchor = useCallback(
    <T extends React.HTMLAttributes<HTMLElement>>(props: T) => {
      return renderAnchor({
        ...props,
        children: selectedItems.length ? selectedItems.map(item => item.text).join(', ') : placeholder
      })
    },
    [placeholder, renderAnchor, selectedItems]
  )

  const itemsToRender = useMemo(() => {
    return items.map(item => {
      return {
        ...item,
        role: 'option',
        selected: 'selected' in item && item.selected === undefined ? undefined : selectedItems.includes(item),
        onAction: (itemFromAction, event) => {
          item.onAction?.(itemFromAction, event)

          if (event.defaultPrevented) {
            return
          }

          if (selectionVariant === 'single') {
            const newSelectedItems = !item || selectedItems.includes(item) ? [] : [item]
            onChange?.(newSelectedItems)
            return
          }

          const otherSelectedItems = selectedItems.filter(selectedItem => selectedItem !== item)
          const newSelectedItems =
            !item || selectedItems.includes(item) ? otherSelectedItems : [...otherSelectedItems, item]

          onChange?.(newSelectedItems)
        }
      } as ItemProps
    })
  }, [items, onChange, selectedItems, selectionVariant])

  return (
    <AnchoredOverlay
      renderAnchor={renderMenuAnchor}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      overlayProps={overlayProps}
      focusZoneSettings={focusZoneSettings}
    >
      <Flex flexDirection="column" width="100%" height="100%">
        <FilteredActionList
          onChange={onFilterChange}
          {...listProps}
          role="listbox"
          items={itemsToRender}
          selectionVariant={selectionVariant}
        />
      </Flex>
    </AnchoredOverlay>
  )
}

SelectPanel.displayName = 'SelectPanel'
