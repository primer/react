import {SearchIcon, TriangleDownIcon} from '@primer/octicons-react'
import React, {useCallback, useEffect, useMemo, useRef} from 'react'
import type {AnchoredOverlayProps} from '../AnchoredOverlay'
import {AnchoredOverlay} from '../AnchoredOverlay'
import type {AnchoredOverlayWrapperAnchorProps} from '../AnchoredOverlay/AnchoredOverlay'
import Box from '../Box'
import Text from '../Text'
import type {FilteredActionListProps} from '../FilteredActionList'
import {FilteredActionList} from '../FilteredActionList'
import Heading from '../Heading'
import type {OverlayProps} from '../Overlay'
import type {TextInputProps} from '../TextInput'
import type {ItemProps, ItemInput} from './types'

import {Button} from '../Button'
import {useProvidedRefOrCreate} from '../hooks'
import type {FocusZoneHookSettings} from '../hooks/useFocusZone'
import {useId} from '../hooks/useId'
import {useProvidedStateOrCreate} from '../hooks/useProvidedStateOrCreate'
import {LiveRegion, LiveRegionOutlet, Message} from '../internal/components/LiveRegion'
import useSafeTimeout from '../hooks/useSafeTimeout'
import type {FilteredActionListLoadingType} from '../FilteredActionList/FilteredActionListLoaders'
import {FilteredActionListLoadingTypes} from '../FilteredActionList/FilteredActionListLoaders'

interface SelectPanelSingleSelection {
  selected: ItemInput | undefined
  onSelectedChange: (selected: ItemInput | undefined) => void
}

interface SelectPanelMultiSelection {
  selected: ItemInput[]
  onSelectedChange: (selected: ItemInput[]) => void
}

export type InitialLoadingType = 'spinner' | 'skeleton'

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
  initialLoadingType?: InitialLoadingType
}

export type SelectPanelProps = React.PropsWithChildren<
  SelectPanelBaseProps &
    Omit<FilteredActionListProps, 'selectionVariant'> &
    Pick<AnchoredOverlayProps, 'open'> &
    AnchoredOverlayWrapperAnchorProps &
    (SelectPanelSingleSelection | SelectPanelMultiSelection)
>

function isMultiSelectVariant(
  selected: SelectPanelSingleSelection['selected'] | SelectPanelMultiSelection['selected'],
): selected is SelectPanelMultiSelection['selected'] {
  return Array.isArray(selected)
}

const focusZoneSettings: Partial<FocusZoneHookSettings> = {
  // Let FilteredActionList handle focus zone
  disabled: true,
}

export type SelectPanelMessageProps = {
  children: React.ReactNode
  title: string
  variant: 'noitems' | 'nomatches'
}
export const SelectPanelMessage: React.FC<SelectPanelMessageProps> = ({variant = 'noitems', title, children}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        flexGrow: 1,
        height: '100%',
        gap: 1,
        paddingX: 4,
        textAlign: 'center',
        a: {color: 'inherit', textDecoration: 'underline'},
        minHeight: 'min(calc(var(--max-height) - 150px), 324px)',
        //                 maxHeight of dialog - (header & footer)
      }}
    >
      <Text sx={{fontSize: 1, fontWeight: 'semibold'}}>{title}</Text>
      <Text
        sx={{fontSize: 1, color: 'fg.muted', display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center'}}
      >
        {children}
      </Text>
    </Box>
  )
}

function Panel({
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
  loading,
  initialLoadingType = 'spinner',
  children,
  ...listProps
}: SelectPanelProps): JSX.Element {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const titleId = useId()
  const subtitleId = useId()
  const dataLoadedOnce = useRef(false)
  const [isLoading, setIsLoading] = useProvidedStateOrCreate(loading, undefined, false)
  const [filterValue, setInternalFilterValue] = useProvidedStateOrCreate(externalFilterValue, undefined, '')
  const {safeSetTimeout, safeClearTimeout} = useSafeTimeout()
  const loadingDelayTimeoutId = useRef<number | null>(null)
  const onFilterChange: FilteredActionListProps['onFilterChange'] = useCallback(
    (value, e) => {
      if (dataLoadedOnce.current) {
        // If data has already been loaded once, delay the spinner a bit. This also helps
        // not show and then immediately hide the spinner if items are loaded quickly, i.e.
        // not async.

        if (loadingDelayTimeoutId.current) {
          safeClearTimeout(loadingDelayTimeoutId.current)
        }

        loadingDelayTimeoutId.current = safeSetTimeout(() => setIsLoading(true), 1000)
      } else {
        // If this is the first data load and there are no items, show the loading spinner
        // immediately

        if (items.length === 0) {
          setIsLoading(true)
        }
      }

      externalOnFilterChange(value, e)
      setInternalFilterValue(value)
    },
    [externalOnFilterChange, setInternalFilterValue, setIsLoading, safeSetTimeout, safeClearTimeout, items],
  )

  useEffect(() => {
    if (isLoading) {
      setIsLoading(false)
      dataLoadedOnce.current = true
    }
    // Only fire this effect if items have changed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  // Populate panel with items on first open
  useEffect(() => {
    // If data was already loaded once, do nothing
    if (dataLoadedOnce.current) return

    // Only load data when the panel is open
    if (open) {
      // Only trigger filter change event if there are no items
      if (items.length === 0) {
        // Trigger filter event to populate panel on first open
        onFilterChange(filterValue, null)
      }
    }
  }, [open, dataLoadedOnce, onFilterChange, filterValue, items])

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
        },
      } as ItemProps
    })
  }, [onClose, onSelectedChange, items, selected])

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

  const loadingType = (): FilteredActionListLoadingType => {
    if (dataLoadedOnce.current) {
      return FilteredActionListLoadingTypes.input
    } else {
      if (initialLoadingType === 'spinner') {
        return FilteredActionListLoadingTypes.bodySpinner
      } else {
        return FilteredActionListLoadingTypes.bodySkeleton
      }
    }
  }

  const isNoItemsState = items.length === 0 && dataLoadedOnce.current && !loading
  const isNoMatchState = items.length === 0 && filterValue !== '' && dataLoadedOnce.current && !loading

  const deconstructChildren = (children: React.ReactNode) => {
    return React.Children.toArray(children).find(child => {
      if (isNoMatchState) return child.props.variant === 'nomatches' && React.isValidElement(child)
      else if (isNoItemsState) return child.props.variant === 'noitems' && React.isValidElement(child)
      else return []
    })
  }

  const message = deconstructChildren(children)

  return (
    <LiveRegion>
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
      >
        <LiveRegionOutlet />
        <Message
          value={
            filterValue === ''
              ? 'Showing all items'
              : items.length <= 0
              ? 'No matching items'
              : `${items.length} matching ${items.length === 1 ? 'item' : 'items'}`
          }
        />
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
            loading={isLoading}
            loadingType={loadingType()}
            emptyState={isNoItemsState}
            message={message}
            // inheriting height and maxHeight ensures that the FilteredActionList is never taller
            // than the Overlay (which would break scrolling the items)
            sx={{...sx, height: 'inherit', maxHeight: 'inherit'}}
          />

          {footer && !isNoItemsState ? (
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
          ) : null}
        </Box>
      </AnchoredOverlay>
    </LiveRegion>
  )
}

Panel.displayName = 'SelectPanel'

export const SelectPanel = Object.assign(Panel, {
  Message: SelectPanelMessage,
})
