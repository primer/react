import React, {useCallback, useMemo} from 'react'
import {FilteredActionList, FilteredActionListProps} from '../FilteredActionList'
import {OverlayProps} from '../Overlay'
import {ItemInput} from '../ActionList/List'
import {FocusZoneHookSettings} from '../hooks/useFocusZone'
import {DropdownButton} from '../DropdownMenu'
import {ItemProps} from '../ActionList'
import {AnchoredOverlay, AnchoredOverlayProps} from '../AnchoredOverlay'
import Flex from '../Flex'
import {TextInputProps} from '../TextInput'
import {useProvidedStateOrCreate} from '../hooks/useProvidedStateOrCreate'

interface SelectPanelSingleSelection {
  selected: ItemInput | undefined
  onSelectedChange: (selected: ItemInput | undefined) => void
}

interface SelectPanelMultiSelection {
  selected: ItemInput[]
  onSelectedChange: (selected: ItemInput[]) => void
}

interface SelectPanelBaseProps {
  renderAnchor?: <T extends React.HTMLAttributes<HTMLElement>>(props: T) => JSX.Element
  onOpenChange: (
    open: boolean,
    gesture: 'anchor-click' | 'anchor-key-press' | 'click-outside' | 'escape' | 'selection'
  ) => void
  placeholder?: string
  overlayProps?: Partial<OverlayProps>
}

export type SelectPanelProps = SelectPanelBaseProps &
  Omit<FilteredActionListProps, 'selectionVariant'> &
  Pick<AnchoredOverlayProps, 'open'> &
  (SelectPanelSingleSelection | SelectPanelMultiSelection)

function isMultiSelectVariant(
  selected: SelectPanelSingleSelection['selected'] | SelectPanelMultiSelection['selected']
): selected is SelectPanelMultiSelection['selected'] {
  return Array.isArray(selected)
}

const focusZoneSettings: Partial<FocusZoneHookSettings> = {
  // Let FilteredActionList handle focus zone
  disabled: true
}

const textInputProps: Partial<TextInputProps> = {
  mx: 2,
  my: 2,
  contrast: true
}

export function SelectPanel({
  open,
  onOpenChange,
  renderAnchor = props => <DropdownButton {...props} />,
  placeholder,
  selected,
  onSelectedChange,
  filterValue: externalFilterValue,
  onFilterChange: externalOnFilterChange,
  items,
  overlayProps,
  ...listProps
}: SelectPanelProps): JSX.Element {
  const [filterValue, setInternalFilterValue] = useProvidedStateOrCreate(externalFilterValue, undefined, '')
  const onFilterChange: FilteredActionListProps['onFilterChange'] = useCallback(
    (value, e) => {
      externalOnFilterChange(value, e)
      setInternalFilterValue(value)
    },
    [externalOnFilterChange, setInternalFilterValue]
  )

  const onOpen: AnchoredOverlayProps['onOpen'] = useCallback(gesture => onOpenChange(true, gesture), [onOpenChange])
  const onClose = useCallback(
    (gesture: 'click-outside' | 'escape' | 'selection') => {
      onOpenChange(false, gesture)
    },
    [onOpenChange]
  )

  const renderMenuAnchor = useCallback(
    <T extends React.HTMLAttributes<HTMLElement>>(props: T) => {
      const selectedItems = Array.isArray(selected) ? selected : [...(selected ? [selected] : [])]

      return renderAnchor({
        ...props,
        children: selectedItems.length ? selectedItems.map(item => item.text).join(', ') : placeholder
      })
    },
    [placeholder, renderAnchor, selected]
  )

  const itemsToRender = useMemo(() => {
    return items.map(item => {
      const isItemSelected = isMultiSelectVariant(selected) ? selected.includes(item) : selected === item

      return {
        ...item,
        role: 'option',
        selected: 'selected' in item && item.selected === undefined ? undefined : isItemSelected,
        onAction: (itemFromAction, event) => {
          item.onAction?.(itemFromAction, event)

          if (event.defaultPrevented) {
            return
          }

          if (isMultiSelectVariant(selected)) {
            const otherSelectedItems = selected.filter(selectedItem => selectedItem !== item)
            const newSelectedItems = selected.includes(item) ? otherSelectedItems : [...otherSelectedItems, item]

            const multiSelectOnChange = onSelectedChange as SelectPanelMultiSelection['onSelectedChange']
            multiSelectOnChange(newSelectedItems)
            return
          }

          // single select
          const singleSelectOnChange = onSelectedChange as SelectPanelSingleSelection['onSelectedChange']
          singleSelectOnChange(item === selected ? undefined : item)
          onClose('selection')
        }
      } as ItemProps
    })
  }, [onClose, onSelectedChange, items, selected])

  const inputRef = React.useRef<HTMLInputElement>(null)
  const focusTrapSettings = {
    initialFocusRef: inputRef
  }

  return (
    <AnchoredOverlay
      renderAnchor={renderMenuAnchor}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      overlayProps={overlayProps}
      focusTrapSettings={focusTrapSettings}
      focusZoneSettings={focusZoneSettings}
    >
      <Flex flexDirection="column" width="100%" height="100%">
        <FilteredActionList
          filterValue={filterValue}
          onFilterChange={onFilterChange}
          {...listProps}
          role="listbox"
          items={itemsToRender}
          selectionVariant={isMultiSelectVariant(selected) ? 'multiple' : 'single'}
          textInputProps={textInputProps}
          inputRef={inputRef}
        />
      </Flex>
    </AnchoredOverlay>
  )
}

SelectPanel.displayName = 'SelectPanel'
