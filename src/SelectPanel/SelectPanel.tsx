import React, {useCallback, useMemo} from 'react'
import {FilteredActionList, FilteredActionListProps} from '../FilteredActionList'
import {OverlayProps} from '../Overlay'
import {ItemInput} from '../ActionList/List'
import {FocusZoneSettings} from '../behaviors/focusZone'
import {DropdownButton} from '../DropdownMenu'
import {ItemProps} from '../ActionList'
import {AnchoredOverlay, AnchoredOverlayProps} from '../AnchoredOverlay'
import Flex from '../Flex'
import {TextInputProps} from '../TextInput'

interface SelectPanelSingleSelection {
  selected: ItemInput | undefined
  setSelected: (selected: ItemInput | undefined) => void
}

interface SelectPanelMultiSelection {
  selected: ItemInput[]
  setSelected: (selected: ItemInput[]) => void
}

interface SelectPanelBaseProps {
  renderAnchor?: AnchoredOverlayProps['renderAnchor']
  setOpen: (
    open: boolean,
    gesture: 'anchor-click' | 'anchor-key-press' | 'click-outside' | 'escape' | 'selection'
  ) => void
  placeholder?: string
  setFilter: (value: string, e?: React.ChangeEvent<HTMLInputElement>) => void
  overlayProps?: Partial<OverlayProps>
}

export type SelectPanelProps = SelectPanelBaseProps &
  Omit<FilteredActionListProps, 'setFilter' | 'selectionVariant'> &
  Pick<AnchoredOverlayProps, 'open'> &
  (SelectPanelSingleSelection | SelectPanelMultiSelection)

function isMultiSelectVariant(
  selected: SelectPanelSingleSelection['selected'] | SelectPanelMultiSelection['selected']
): selected is SelectPanelMultiSelection['selected'] {
  return Array.isArray(selected)
}

const focusZoneSettings: Partial<FocusZoneSettings> = {
  focusOutBehavior: 'wrap',
  focusableElementFilter: element => {
    return !(element instanceof HTMLInputElement) || element.type !== 'checkbox'
  }
}

const textInputProps: Partial<TextInputProps> = {
  mx: 2,
  my: 2,
  contrast: true
}

export function SelectPanel({
  open,
  setOpen,
  renderAnchor = props => <DropdownButton {...props} />,
  placeholder,
  selected,
  setSelected,
  setFilter,
  items,
  overlayProps,
  ...listProps
}: SelectPanelProps): JSX.Element {
  const onOpen: AnchoredOverlayProps['onOpen'] = useCallback(gesture => setOpen(true, gesture), [setOpen])
  const onClose = useCallback(
    (gesture: 'click-outside' | 'escape' | 'selection') => {
      setOpen(false, gesture)
      // ensure consuming component clears filter since the input will be blank on next open
      setFilter('')
    },
    [setFilter, setOpen]
  )

  const renderMenuAnchor: AnchoredOverlayProps['renderAnchor'] = useCallback(
    props => {
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
            // multi select
            const otherSelectedItems = selected.filter(selectedItem => selectedItem !== item)
            const newSelectedItems =
              !item || selected.includes(item) ? otherSelectedItems : [...otherSelectedItems, item]

            const multiSelectOnChange = setSelected as SelectPanelMultiSelection['setSelected']
            multiSelectOnChange(newSelectedItems)
            return
          }

          // single select
          const singleSelectOnChange = setSelected as SelectPanelSingleSelection['setSelected']
          singleSelectOnChange(item === selected ? undefined : item)
          onClose('selection')
        }
      } as ItemProps
    })
  }, [onClose, items, selected, setSelected])

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
          setFilter={setFilter}
          {...listProps}
          role="listbox"
          items={itemsToRender}
          selectionVariant={isMultiSelectVariant(selected) ? 'multiple' : 'single'}
          textInputProps={textInputProps}
        />
      </Flex>
    </AnchoredOverlay>
  )
}

SelectPanel.displayName = 'SelectPanel'
