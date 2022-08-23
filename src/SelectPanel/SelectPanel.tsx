import React, {useCallback, useMemo, useState} from 'react'
import {FilteredActionList, FilteredActionListProps} from '../FilteredActionList'
import {OverlayProps} from '../Overlay'
import {ItemInput} from '../deprecated/ActionList/List'
import Heading from '../Heading'
import {FocusZoneHookSettings} from '../hooks/useFocusZone'
import {DropdownButton} from '../deprecated/DropdownMenu'
import {ItemProps} from '../deprecated/ActionList'
import {AnchoredOverlay, AnchoredOverlayProps} from '../AnchoredOverlay'
import {TextInputProps} from '../TextInput'
import {useProvidedStateOrCreate} from '../hooks/useProvidedStateOrCreate'
import {AnchoredOverlayWrapperAnchorProps} from '../AnchoredOverlay/AnchoredOverlay'
import {useProvidedRefOrCreate} from '../hooks'
import {Button} from '../Button'
import {SearchIcon} from '@primer/octicons-react'
import Box from '../Box'
import {useSSRSafeId} from '@react-aria/ssr'
import VisuallyHidden from '../_VisuallyHidden'
import ButtonClose from '../deprecated/Button/ButtonClose'

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
  // TODO: Make `title` and `inputLabel` required and remove default values
  // in the next major release
  title?: string
  inputLabel?: string
  inputPlaceholder?: string
  overlayProps?: Partial<OverlayProps>
}

export type SelectPanelProps = SelectPanelBaseProps &
  Omit<FilteredActionListProps, 'selectionVariant'> &
  Pick<AnchoredOverlayProps, 'open'> &
  AnchoredOverlayWrapperAnchorProps &
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

export function SelectPanel({
  open,
  onOpenChange,
  renderAnchor = props => <DropdownButton {...props} />,
  anchorRef: externalAnchorRef,
  selected,
  onSelectedChange,
  title = isMultiSelectVariant(selected) ? 'Select items' : 'Select an item',
  inputLabel = 'Filter items',
  inputPlaceholder,
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

  const selectedItems = React.useMemo(
    () => (Array.isArray(selected) ? selected : [...(selected ? [selected] : [])]),
    [selected]
  )

  const [finalItemsSelected, setFinalItemsSelected] = useState(selectedItems)

  // Refresh the selected items state when the prop changes.
  // This is necessary because sometimes the selected items need to be fetched async.
  React.useEffect(() => setFinalItemsSelected(selectedItems), [selectedItems])

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

    return <T extends React.HTMLAttributes<HTMLElement>>(props: T) => {
      return renderAnchor({
        ...props,
        children: selectedItems.length ? selectedItems.map(item => item.text).join(', ') : inputLabel
      })
    }
  }, [inputLabel, renderAnchor, selectedItems])

  const itemsToRender = useMemo(() => {
    return items.map(item => {
      return {
        ...item,
        role: 'option',
        selected: 'selected' in item && item.selected === undefined ? undefined : finalItemsSelected.includes(item),
        onAction: (itemFromAction, event) => {
          item.onAction?.(itemFromAction, event)

          if (event.defaultPrevented) {
            return
          }

          if (isMultiSelectVariant(selected)) {
            const otherSelectedItems = finalItemsSelected.filter(selectedItem => selectedItem !== item)
            const newSelectedItems = finalItemsSelected.includes(item)
              ? otherSelectedItems
              : [...otherSelectedItems, item]

            setFinalItemsSelected(newSelectedItems)
          } else {
            // single select
            setFinalItemsSelected(finalItemsSelected.includes(item) ? [] : [item])
          }
        }
      } as ItemProps
    })
  }, [items, selected, setFinalItemsSelected, finalItemsSelected])

  const onSaveClickHandler = React.useCallback(() => {
    if (isMultiSelectVariant(selected)) {
      const multiSelectOnChange = onSelectedChange as SelectPanelMultiSelection['onSelectedChange']
      multiSelectOnChange(finalItemsSelected)
    } else {
      const singleSelectOnChange = onSelectedChange as SelectPanelSingleSelection['onSelectedChange']
      singleSelectOnChange(finalItemsSelected.length > 0 ? finalItemsSelected[0] : undefined)
    }
    onClose('selection')
  }, [finalItemsSelected, onSelectedChange, onClose, selected])

  const onCloseOverlay = React.useCallback(
    (gesture?: 'anchor-click' | 'click-outside' | 'escape') => {
      setFinalItemsSelected(selectedItems)
      onClose(gesture ?? 'escape')
    },
    [onClose, selectedItems]
  )

  const onCloseClickHandler = React.useCallback(() => {
    setFinalItemsSelected(selectedItems)
    onClose('escape')
  }, [onClose, selectedItems])

  const inputRef = React.useRef<HTMLInputElement>(null)
  const titleId = useSSRSafeId()
  const focusTrapSettings = {
    initialFocusRef: inputRef
  }

  const extendedTextInputProps: Partial<TextInputProps> = useMemo(() => {
    return {
      sx: {m: 2},
      contrast: true,
      leadingVisual: SearchIcon,
      'aria-label': inputLabel,
      placeholder: inputPlaceholder,
      ...textInputProps
    }
  }, [textInputProps, inputLabel, inputPlaceholder])

  const overlayKeyPressHandler = useCallback(
    event => {
      if (!event.defaultPrevented && ['Enter'].includes(event.key)) {
        onSaveClickHandler()
        event.preventDefault()
      }
    },
    [onSaveClickHandler]
  )

  return (
    <AnchoredOverlay
      renderAnchor={renderMenuAnchor}
      anchorRef={anchorRef}
      open={open}
      onOpen={onOpen}
      onClose={onCloseOverlay}
      overlayProps={{...overlayProps, onKeyPress: overlayKeyPressHandler, role: 'dialog', 'aria-labelledby': titleId}}
      focusTrapSettings={focusTrapSettings}
      focusZoneSettings={focusZoneSettings}
    >
      {/* inheriting height and maxHeight ensures that the content is never taller than the Overlay (which would break scrolling the items) */}
      <Box display="flex" flexDirection="column" height="inherit" maxHeight="inherit">
        <VisuallyHidden aria-atomic="true" aria-live="polite">
          {filterValue === ''
            ? 'Showing all items'
            : items.length <= 0
            ? 'No matching items'
            : `${items.length} matching ${items.length === 1 ? 'item' : 'items'}`}
        </VisuallyHidden>
        <Box display="flex" alignItems="center" justifyContent="space-between" pl={3} pr={2} pt={2}>
          <Heading as="h1" id={titleId} sx={{fontSize: 1}}>
            {title}
          </Heading>
          <ButtonClose sx={{padding: '6px 8px'}} onClick={onCloseClickHandler} />
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
          sx={{...sxProp, flex: '1 1 auto'}}
        />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="flex-end"
          gridGap="8px"
          padding="12px"
          borderTopColor="border.default"
          borderTopWidth={1}
          borderTopStyle="solid"
        >
          <Button size="small" onClick={onCloseClickHandler}>
            Cancel
          </Button>
          <Button size="small" variant="primary" onClick={onSaveClickHandler}>
            Save
          </Button>
        </Box>
      </Box>
    </AnchoredOverlay>
  )
}

SelectPanel.displayName = 'SelectPanel'
