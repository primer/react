import {SearchIcon, TriangleDownIcon, XIcon} from '@primer/octicons-react'
import React, {useCallback, useMemo} from 'react'
import type {AnchoredOverlayProps} from '../AnchoredOverlay'
import {AnchoredOverlay} from '../AnchoredOverlay'
import type {AnchoredOverlayWrapperAnchorProps} from '../AnchoredOverlay/AnchoredOverlay'
import Box from '../Box'
import type {FilteredActionListProps} from '../FilteredActionList'
import {FilteredActionList} from '../FilteredActionList'
import Heading from '../Heading'
import type {OverlayProps} from '../Overlay'
import type {TextInputProps} from '../TextInput'
import type {ItemProps, ItemInput} from './types'

import {Button, IconButton} from '../Button'
import {useProvidedRefOrCreate} from '../hooks'
import type {FocusZoneHookSettings} from '../hooks/useFocusZone'
import {useId} from '../hooks/useId'
import {useProvidedStateOrCreate} from '../hooks/useProvidedStateOrCreate'
import {LiveRegion, LiveRegionOutlet, Message} from '../internal/components/LiveRegion'
import {useFeatureFlag} from '../FeatureFlags'
import {useResponsiveValue} from '../hooks/useResponsiveValue'
import {StyledOverlay} from '../Overlay/Overlay'

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

const focusZoneSettings: Partial<FocusZoneHookSettings> = {
  // Let FilteredActionList handle focus zone
  disabled: true,
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

  const inputRef = React.useRef<HTMLInputElement>(null)
  const focusTrapSettings = {
    initialFocusRef: inputRef,
  }

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

  const responsiveVariants = Object.assign({regular: 'anchored', narrow: 'full-screen'}) // defaults

  const currentVariant = useResponsiveValue(responsiveVariants, 'anchored')

  /* Dialog */
  const dialogRef = React.useRef<HTMLDialogElement>(null)

  const ConditionalOverlay: React.FC<React.PropsWithChildren<{isAnchored: boolean}>> = props => {
    const {isAnchored, ...rest} = props

    if (isAnchored)
      return (
        <AnchoredOverlay
          renderAnchor={renderMenuAnchor}
          anchorRef={anchorRef}
          open={open}
          onOpen={onOpen}
          onClose={onClose}
          overlayProps={{
            role: 'dialog',
            'aria-labelledby': titleId,
            'aria-describedby': subtitle ? subtitleId : undefined,
            ...overlayProps,
          }}
          focusTrapSettings={focusTrapSettings}
          focusZoneSettings={focusZoneSettings}
          {...rest}
        >
          {props.children}
        </AnchoredOverlay>
      )
    // This variant can be used for full-screen, bottom-sheet, modal, etc.
    else {
      const anchorProps = {
        ref: anchorRef,
        onClick: onOpen,
        'aria-haspopup': true,
        'aria-expanded': open,
      }
      const anchor = renderMenuAnchor ? renderMenuAnchor(anchorProps) : null

      return (
        <>
          {anchor}
          {open ? (
            <StyledOverlay
              open={open}
              ref={dialogRef}
              as="dialog"
              aria-labelledby={titleId}
              aria-describedby={subtitle ? subtitleId : undefined}
              data-variant={currentVariant}
              sx={{
                // reset dialog default styles
                border: 'none',
                display: 'flex',
                padding: 0,
                color: 'fg.default',
                '&[open]': {display: 'flex'},
                '&[data-variant="full-screen"]': {
                  margin: 0,
                  top: 0,
                  left: 0,
                  width: '100%',
                  maxWidth: '100vw',
                  height: '100%',
                  maxHeight: '100vh',
                  borderRadius: 'unset',
                },
              }}
              {...rest}
            >
              {props.children}
            </StyledOverlay>
          ) : null}
        </>
      )
    }
  }

  return (
    <LiveRegion>
      <ConditionalOverlay isAnchored={currentVariant === 'anchored'}>
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
        <Box sx={{display: 'flex', flexDirection: 'column', height: 'inherit', maxHeight: 'inherit', width: '100%'}}>
          <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, px: 3}}>
            <Box>
              <Heading as="h1" id={titleId} sx={{fontSize: 1}}>
                {title}
              </Heading>
              {subtitle ? (
                <Box id={subtitleId} sx={{fontSize: 0, color: 'fg.muted'}}>
                  {subtitle}
                </Box>
              ) : null}
            </Box>
            <IconButton
              type="button"
              variant="invisible"
              icon={XIcon}
              aria-label="Close"
              onClick={() => onClose('anchor-click')}
            />
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
      </ConditionalOverlay>
    </LiveRegion>
  )
}

SelectPanel.displayName = 'SelectPanel'
