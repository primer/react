import {SearchIcon, TriangleDownIcon} from '@primer/octicons-react'
import React, {useCallback, useMemo} from 'react'
import type {AnchoredOverlayProps} from '../AnchoredOverlay'
import Overlay from '../Overlay'
import type {AnchoredOverlayWrapperAnchorProps} from '../AnchoredOverlay/AnchoredOverlay'
import Box from '../Box'
import type {FilteredActionListProps} from '../FilteredActionList'
import {FilteredActionList} from '../FilteredActionList'
import Heading from '../Heading'
import type {OverlayProps} from '../Overlay'
import type {TextInputProps} from '../TextInput'
import type {ItemProps, ItemInput} from './types'

import {Button} from '../Button'
import {useAnchoredPosition, useProvidedRefOrCreate} from '../hooks'
import {useId} from '../hooks/useId'
import {useProvidedStateOrCreate} from '../hooks/useProvidedStateOrCreate'
import {LiveRegion, LiveRegionOutlet, Message} from '../internal/components/LiveRegion'
import {useFeatureFlag} from '../FeatureFlags'

import {useFocusTrap} from '../hooks/useFocusTrap'

interface SelectPanelSingleSelection {
  selected: ItemInput | undefined
  onSelectedChange: (selected: ItemInput | undefined) => void
}

interface SelectPanelMultiSelection {
  selected: ItemInput[]
  onSelectedChange: (selected: ItemInput[]) => void
}

interface SelectPanelBaseProps {
  // TODO: Make `title` required in the next major version
  title?: string | React.ReactElement
  subtitle?: string | React.ReactElement
  onOpenChange: (
    open: boolean,
    gesture: 'anchor-click' | 'anchor-key-press' | 'click-outside' | 'escape' | 'selection',
  ) => void
  placeholder?: string
  // TODO: Make `inputLabel` required in next major version
  inputLabel?: string
  overlayProps?: Partial<OverlayProps>
  footer?: string | React.ReactElement
}

export type SelectPanelProps = SelectPanelBaseProps &
  Omit<FilteredActionListProps, 'selectionVariant'> &
  Pick<AnchoredOverlayProps, 'open'> &
  AnchoredOverlayWrapperAnchorProps &
  (SelectPanelSingleSelection | SelectPanelMultiSelection)

function isMultiSelectVariant(
  selected: SelectPanelSingleSelection['selected'] | SelectPanelMultiSelection['selected'],
): selected is SelectPanelMultiSelection['selected'] {
  return Array.isArray(selected)
}

const areItemsEqual = (itemA: ItemInput, itemB: ItemInput) => {
  // prefer checking equivality by item.id
  if (typeof itemA.id !== 'undefined') return itemA.id === itemB.id
  else return itemA === itemB
}

const doesItemsIncludeItem = (items: ItemInput[], item: ItemInput) => {
  return items.some(i => areItemsEqual(i, item))
}

export function SelectPanel({
  open,
  onOpenChange,
  renderAnchor = props => {
    const {children, ...rest} = props
    return (
      <Button trailingAction={TriangleDownIcon} {...rest}>
        {children}
      </Button>
    )
  },
  anchorRef: externalAnchorRef,
  placeholder,
  placeholderText = 'Filter items',
  inputLabel = placeholderText,
  selected,
  title = isMultiSelectVariant(selected) ? 'Select items' : 'Select an item',
  subtitle,
  onSelectedChange,
  filterValue: externalFilterValue,
  onFilterChange: externalOnFilterChange,
  items,
  footer,
  textInputProps,
  overlayProps,
  sx,
  ...listProps
}: SelectPanelProps): JSX.Element {
  const titleId = useId()
  const subtitleId = useId()
  const [filterValue, setInternalFilterValue] = useProvidedStateOrCreate(externalFilterValue, undefined, '')
  const onFilterChange: FilteredActionListProps['onFilterChange'] = useCallback(
    (value, e) => {
      externalOnFilterChange(value, e)
      setInternalFilterValue(value)
    },
    [externalOnFilterChange, setInternalFilterValue],
  )

  const anchorRef = useProvidedRefOrCreate(externalAnchorRef)
  const onOpen: AnchoredOverlayProps['onOpen'] = useCallback(
    (gesture: Parameters<Exclude<AnchoredOverlayProps['onOpen'], undefined>>[0]) => onOpenChange(true, gesture),
    [onOpenChange],
  )
  const onClose = useCallback(
    (gesture: Parameters<Exclude<AnchoredOverlayProps['onClose'], undefined>>[0] | 'selection') => {
      onOpenChange(false, gesture)
    },
    [onOpenChange],
  )

  const renderMenuAnchor = useMemo(() => {
    if (renderAnchor === null) {
      return null
    }

    const selectedItems = Array.isArray(selected) ? selected : [...(selected ? [selected] : [])]

    return <T extends React.HTMLAttributes<HTMLElement>>(props: T) => {
      return renderAnchor({
        ...props,
        children: selectedItems.length ? selectedItems.map(item => item.text).join(', ') : placeholder,
      })
    }
  }, [placeholder, renderAnchor, selected])

  /* Anchoring logic */
  const overlayRef = React.useRef<HTMLDivElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const {position} = useAnchoredPosition(
    {
      anchorElementRef: anchorRef,
      floatingElementRef: overlayRef,
      side: 'outside-bottom',
      align: 'start',
    },
    [open, anchorRef.current, overlayRef.current],
  )

  const onAnchorClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (event.defaultPrevented || event.button !== 0) {
        return
      }

      if (!open) {
        onOpen('anchor-click')
      } else {
        onClose('anchor-click')
      }
    },
    [open, onOpen, onClose],
  )

  const onAnchorKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      if (!event.defaultPrevented) {
        if (!open && ['ArrowDown', 'ArrowUp', ' ', 'Enter'].includes(event.key)) {
          onOpen('anchor-key-press', event)
          event.preventDefault()
        }
      }
    },
    [open, onOpen],
  )

  const anchorProps = {
    ref: anchorRef,
    'aria-haspopup': true,
    'aria-expanded': open,
    onClick: onAnchorClick,
    onKeyDown: onAnchorKeyDown,
  }
  // TODO: anchor should be called button because it's not an anchor anymore
  const anchor = renderMenuAnchor ? renderMenuAnchor(anchorProps) : null

  const itemsToRender = useMemo(() => {
    return items.map(item => {
      const isItemSelected = isMultiSelectVariant(selected) ? doesItemsIncludeItem(selected, item) : selected === item

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
            const otherSelectedItems = selected.filter(selectedItem => !areItemsEqual(selectedItem, item))
            const newSelectedItems = doesItemsIncludeItem(selected, item)
              ? otherSelectedItems
              : [...otherSelectedItems, item]

            const multiSelectOnChange = onSelectedChange as SelectPanelMultiSelection['onSelectedChange']
            multiSelectOnChange(newSelectedItems)
            return
          }

          // single select
          const singleSelectOnChange = onSelectedChange as SelectPanelSingleSelection['onSelectedChange']
          singleSelectOnChange(item === selected ? undefined : item)
          onClose('selection')
        },
      } as ItemProps
    })
  }, [onClose, onSelectedChange, items, selected])

  /** Focus trap */
  useFocusTrap({
    containerRef: overlayRef,
    disabled: !open || !position,
    initialFocusRef: inputRef,
    returnFocusRef: anchorRef,
  })

  const extendedTextInputProps: Partial<TextInputProps> = useMemo(() => {
    return {
      sx: {m: 2},
      contrast: true,
      leadingVisual: SearchIcon,
      'aria-label': inputLabel,
      ...textInputProps,
    }
  }, [inputLabel, textInputProps])

  const usingModernActionList = useFeatureFlag('primer_react_select_panel_with_modern_action_list')

  return (
    <LiveRegion>
      {anchor}
      {open && (
        <Overlay
          role="dialog"
          aria-labelledby={titleId}
          aria-describedby={subtitle ? subtitleId : undefined}
          ref={overlayRef}
          returnFocusRef={anchorRef}
          onEscape={() => onClose('escape')}
          onClickOutside={() => onClose('click-outside')}
          ignoreClickRefs={
            /* this is required so that clicking the button while the panel is open does not re-open the panel */
            [anchorRef]
          }
          {...position}
          {...overlayProps}
        >
          <LiveRegionOutlet />
          {usingModernActionList ? null : (
            <Message
              value={
                filterValue === ''
                  ? 'Showing all items'
                  : items.length <= 0
                    ? 'No matching items'
                    : `${items.length} matching ${items.length === 1 ? 'item' : 'items'}`
              }
            />
          )}
          <Box sx={{display: 'flex', flexDirection: 'column', height: 'inherit', maxHeight: 'inherit'}}>
            <Box sx={{pt: 2, px: 3}}>
              <Heading as="h1" id={titleId} sx={{fontSize: 1}}>
                {title}
              </Heading>
              {subtitle ? (
                <Box id={subtitleId} sx={{fontSize: 0, color: 'fg.muted'}}>
                  {subtitle}
                </Box>
              ) : null}
            </Box>
            <FilteredActionList
              filterValue={filterValue}
              onFilterChange={onFilterChange}
              placeholderText={placeholderText}
              {...listProps}
              role="listbox"
              // browsers give aria-labelledby precedence over aria-label so we need to make sure
              // we don't accidentally override props.aria-label
              aria-labelledby={listProps['aria-label'] ? undefined : titleId}
              aria-multiselectable={isMultiSelectVariant(selected) ? 'true' : 'false'}
              selectionVariant={isMultiSelectVariant(selected) ? 'multiple' : 'single'}
              items={itemsToRender}
              textInputProps={extendedTextInputProps}
              inputRef={inputRef}
              // inheriting height and maxHeight ensures that the FilteredActionList is never taller
              // than the Overlay (which would break scrolling the items)
              sx={{...sx, height: 'inherit', maxHeight: 'inherit'}}
            />
            {footer && (
              <Box
                sx={{
                  display: 'flex',
                  borderTop: '1px solid',
                  borderColor: 'border.default',
                  padding: 2,
                }}
              >
                {footer}
              </Box>
            )}
          </Box>
        </Overlay>
      )}
    </LiveRegion>
  )
}

SelectPanel.displayName = 'SelectPanel'
