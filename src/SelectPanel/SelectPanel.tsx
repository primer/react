import React, {useCallback, useMemo} from 'react'
import styled from 'styled-components'
import {get} from '../constants'
import {FilteredActionList, FilteredActionListProps} from '../FilteredActionList'
import {OverlayProps} from '../Overlay'
import sx, {SxProp} from '../sx'
import {ItemInput} from '../deprecated/ActionList/List'
import Box from '../Box'
import {FocusZoneHookSettings} from '../hooks/useFocusZone'
import {DropdownButton} from '../deprecated/DropdownMenu'
import {ItemProps} from '../deprecated/ActionList'
import {AnchoredOverlay, AnchoredOverlayProps} from '../AnchoredOverlay'
import {TextInputProps} from '../TextInput'
import {useProvidedStateOrCreate} from '../hooks/useProvidedStateOrCreate'
import {AnchoredOverlayWrapperAnchorProps} from '../AnchoredOverlay/AnchoredOverlay'
import {useProvidedRefOrCreate} from '../hooks'
import {useSSRSafeId} from '@react-aria/ssr'

interface SelectPanelSingleSelection {
  selected: ItemInput | undefined
  onSelectedChange: (selected: ItemInput | undefined) => void
}

interface SelectPanelMultiSelection {
  selected: ItemInput[]
  onSelectedChange: (selected: ItemInput[]) => void
}

interface SelectPanelBaseProps {
  onOpenChange: (
    open: boolean,
    gesture: 'anchor-click' | 'anchor-key-press' | 'click-outside' | 'escape' | 'selection'
  ) => void
  title: string
  placeholder?: string
  overlayProps?: Partial<OverlayProps>
}

export type SelectPanelProps = SelectPanelBaseProps &
  Omit<FilteredActionListProps, 'selectionVariant'> &
  Pick<AnchoredOverlayProps, 'open'> &
  AnchoredOverlayWrapperAnchorProps &
  (SelectPanelSingleSelection | SelectPanelMultiSelection)

const Title = styled.h1<SxProp>`
  font-size: ${get('fontSizes.1')};
  font-weight: ${get('fontWeights.bold')};
  margin: 0; /* override default margin */
  ${sx};
`

function isMultiSelectVariant(
  selected: SelectPanelSingleSelection['selected'] | SelectPanelMultiSelection['selected']
): selected is SelectPanelMultiSelection['selected'] {
  return Array.isArray(selected)
}

const focusZoneSettings: Partial<FocusZoneHookSettings> = {
  // Let FilteredActionList handle focus zone
  disabled: true
}

export function SelectPanel({
  open,
  onOpenChange,
  renderAnchor = props => <DropdownButton {...props} />,
  anchorRef: externalAnchorRef,
  title,
  placeholder,
  selected,
  onSelectedChange,
  filterValue: externalFilterValue,
  onFilterChange: externalOnFilterChange,
  items,
  textInputProps,
  overlayProps,
  sx: sxProp,
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

  const anchorRef = useProvidedRefOrCreate(externalAnchorRef)
  const onOpen: AnchoredOverlayProps['onOpen'] = useCallback(gesture => onOpenChange(true, gesture), [onOpenChange])
  const onClose = useCallback(
    (gesture: Parameters<Exclude<AnchoredOverlayProps['onClose'], undefined>>[0] | 'selection') => {
      onOpenChange(false, gesture)
    },
    [onOpenChange]
  )

  const renderMenuAnchor = useMemo(() => {
    if (renderAnchor === null) {
      return null
    }

    const selectedItems = Array.isArray(selected) ? selected : [...(selected ? [selected] : [])]

    return <T extends React.HTMLAttributes<HTMLElement>>(props: T) => {
      return renderAnchor({
        ...props,
        children: selectedItems.length ? selectedItems.map(item => item.text).join(', ') : placeholder
      })
    }
  }, [placeholder, renderAnchor, selected])

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

  const titleId = useSSRSafeId()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const focusTrapSettings = {
    initialFocusRef: inputRef
  }

  const extendedTextInputProps: Partial<TextInputProps> = useMemo(() => {
    return {
      sx: {m: 2},
      contrast: true,
      ...textInputProps
    }
  }, [textInputProps])

  return (
    <AnchoredOverlay
      renderAnchor={renderMenuAnchor}
      anchorRef={anchorRef}
      open={open}
      onOpen={onOpen}
      onClose={onClose}
      overlayProps={overlayProps}
      focusTrapSettings={focusTrapSettings}
      focusZoneSettings={focusZoneSettings}
    >
      <Box px={3} pt={2}>
        <Title id={titleId}>{title}</Title>
      </Box>
      <FilteredActionList
        filterValue={filterValue}
        onFilterChange={onFilterChange}
        {...listProps}
        role="listbox"
        aria-multiselectable={isMultiSelectVariant(selected) ? 'true' : 'false'}
        aria-labelledby={titleId}
        selectionVariant={isMultiSelectVariant(selected) ? 'multiple' : 'single'}
        items={itemsToRender}
        textInputProps={extendedTextInputProps}
        inputRef={inputRef}
        // inheriting height and maxHeight ensures that the FilteredActionList is never taller
        // than the Overlay (which would break scrolling the items)
        sx={{...sxProp, height: 'inherit', maxHeight: 'inherit'}}
      />
    </AnchoredOverlay>
  )
}

SelectPanel.displayName = 'SelectPanel'
