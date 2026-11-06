'use client'

import {Combobox} from '@base-ui/react/combobox'
import {Field} from '@base-ui/react/field'
import {mergeProps} from '@base-ui/react/merge-props'
import {AlertIcon, SearchIcon, StopIcon, TriangleDownIcon} from '@primer/octicons-react'
import React from 'react'
import {CloseIconButton} from '../../internal/CloseIconButton'
import {cn} from '../../internal/cn'
import {areItemsEqual, getItemRenderKey, getItemText, renderItemVisual} from '../../internal/collectionItem'
import {FloatingPortal} from '../../internal/FloatingPortal'
import {markFormControlInput} from '../../internal/formControlParts'
import {joinIdRefs} from '../../internal/idRefs'
import {OverflowAnchorContext} from '../../internal/overflow'
import {overlayHeightClassNames, overlayMaxHeightClassNames, overlayWidthClassNames} from '../../internal/overlaySize'
import {assignRef} from '../../internal/refs'
import type {CSSPropertiesWithCustomProperties, OverlayHeight, OverlayMaxHeight, OverlayWidth} from '../../utils/types'
import {ActionList, ActionItemContent, type ActionListItemProps} from '../ActionList/ActionList'
import {
  actionItemPartClassName,
  getActionItemStateAttributes,
  getActionItemStateClassName,
} from '../ActionList/itemState'
import {Banner} from '../Banner'
import {Button, type ButtonProps} from '../Button'
import {LinkButton, type LinkButtonProps} from '../LinkButton'
import {Dialog} from '../Dialog'
import {useFeatureFlag} from '../FeatureFlags/useFeatureFlag'
import {ComboboxSelectionIndicator, SelectAllRow} from '../FilteredActionList/FilteredActionListParts'
import {
  FormControlContextProvider,
  FormControlValidationStatusProvider,
  useFormControlContext,
} from '../FormControl/useFormControlForwardedProps'
import {Announce} from '../LiveRegion'
import {Popover} from '../Popover'
import {Spinner} from '../Spinner'
import {TextInput, type TextInputProps} from '../TextInput'

const panelWidthClasses = {
  ...overlayWidthClassNames,
  auto: 'min-w-64 w-auto',
} as const satisfies Record<OverlayWidth, string>

const panelHeightClasses = {
  ...overlayHeightClassNames,
  auto: 'h-auto max-h-[min(37.5rem,var(--available-height))]',
  initial: 'h-[var(--select-panel-initial-height)]',
} as const satisfies Record<OverlayHeight, string>

let selectPanelScrollLockCount = 0
let selectPanelPreviousBodyOverflow: string | undefined

type PopoverPositionerProps = React.ComponentPropsWithoutRef<typeof Popover.Positioner>
type SelectPanelValue = {
  item: SelectPanelItem
  label: string
  renderKey: string
}

const SelectPanelActivationContext = React.createContext<React.RefObject<KeyboardEvent | null> | null>(null)

function handleSelectPanelInputKeyDown(
  event: React.KeyboardEvent<HTMLInputElement>,
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement> | undefined,
  activationEventRef: React.RefObject<KeyboardEvent | null> | null,
) {
  const previousEvent = activationEventRef?.current ?? null
  if (activationEventRef && event.key === 'Enter' && !event.nativeEvent.isComposing) {
    activationEventRef.current = event.nativeEvent
  }
  try {
    onKeyDown?.(event)
  } finally {
    if (activationEventRef) activationEventRef.current = previousEvent
  }
}

interface SelectPanelGroupValue {
  groupId: string
  items: readonly SelectPanelValue[]
  renderGroup?: SelectPanelRenderGroup
  renderItem?: SelectPanelRenderItem
  title: React.ReactNode
  variant?: 'subtle' | 'filled'
}

export type SelectPanelOpenChangeGesture =
  | 'anchor-click'
  | 'anchor-key-press'
  | 'click-outside'
  | 'escape'
  | 'selection'
  | 'cancel'

export type SelectPanelRenderItem = (item: SelectPanelItem) => React.ReactNode

export type SelectPanelRenderGroup = (group: SelectPanelGroupMetadata, children: React.ReactNode) => React.ReactNode

export interface SelectPanelActionDetails {
  /** The original keyboard or click event. Use the callback's React event to cancel activation. */
  sourceEvent: KeyboardEvent | MouseEvent
}

export interface SelectPanelItem
  extends Omit<
    React.HTMLAttributes<HTMLDivElement>,
    'children' | 'className' | 'id' | 'onClick' | 'onKeyDown' | 'role'
  > {
  /**
   * An optional stable identity. Numbers and strings remain distinct identities.
   * Items without an id are matched by object identity.
   */
  id?: number | string
  key?: React.Key
  text?: React.ReactNode
  filterValue?: string
  children?: React.ReactNode
  className?: string
  description?: React.ReactNode
  descriptionVariant?: 'block' | 'inline'
  leadingVisual?: React.ElementType | React.ReactNode
  trailingVisual?: React.ElementType | React.ReactNode
  disabled?: boolean
  inactiveText?: React.ReactNode
  groupId?: string
  ref?: React.Ref<HTMLDivElement>
  /** Called on activation. Prevent the React event to cancel selection; `details.sourceEvent` identifies the original event. */
  onAction?: (
    item: SelectPanelItem,
    event: React.SyntheticEvent<HTMLDivElement>,
    details: SelectPanelActionDetails,
  ) => void
  renderItem?: SelectPanelRenderItem
}

export interface SelectPanelGroupMetadata {
  groupId: string
  header?: {
    title?: React.ReactNode
    variant?: 'subtle' | 'filled'
  }
  renderItem?: SelectPanelRenderItem
  renderGroup?: SelectPanelRenderGroup
}

export interface SelectPanelNotice {
  text: React.ReactNode
  variant: 'info' | 'warning' | 'error'
}

export interface SelectPanelMessage {
  title: React.ReactNode
  body?: React.ReactNode
  variant?: 'empty' | 'error' | 'warning'
  icon?: React.ElementType
  action?: React.ReactNode
  /** Defaults to `status`, or `alert` for errors. Use `none` when announcements are handled separately. */
  role?: React.AriaRole
}

export interface SelectPanelOverlayProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'className' | 'style'> {
  [dataAttribute: `data-${string}`]: string | number | boolean | undefined
  /** Shift in pixels along the anchor's edge. */
  alignOffset?: PopoverPositionerProps['alignOffset']
  className?: string
  /** Element the panel stays within when it would otherwise overflow. */
  collisionBoundary?: PopoverPositionerProps['collisionBoundary']
  /** Gap kept between the panel and the edge of its collision boundary. */
  collisionPadding?: PopoverPositionerProps['collisionPadding']
  /** Portal destination. Pass `null` to wait for a container; ignored when `portal` is false. */
  container?: React.ComponentPropsWithoutRef<typeof Popover.Portal>['container']
  /** Height of the panel. */
  height?: OverlayHeight
  /** Largest height the panel may grow to before its list scrolls. */
  maxHeight?: Exclude<OverlayMaxHeight, 'fit-content'>
  /** Where the panel is rendered in the DOM. Set `false` to keep it in place. */
  portal?: boolean
  /** Classes applied to the element that positions the panel. */
  positionerClassName?: string
  /** Side of the anchor the panel opens on. */
  side?: PopoverPositionerProps['side']
  /** Distance in pixels between the panel and its anchor. */
  sideOffset?: PopoverPositionerProps['sideOffset']
  style?: React.CSSProperties
  /** Width of the panel. */
  width?: OverlayWidth
}

export interface SelectPanelAnchorProps extends Omit<React.ButtonHTMLAttributes<HTMLElement>, 'children' | 'id'> {
  children: React.ReactNode
  /** Identifier for the anchor, used to associate it with the panel. */
  id?: string
}

function isLinkAnchor(element: React.ReactElement) {
  return typeof element.props === 'object' && element.props !== null && 'href' in element.props
}

export interface SelectPanelActionListProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'className' | 'role'> {
  className?: string
}

interface SelectPanelBaseProps {
  /** Options to choose from. */
  items: readonly SelectPanelItem[]
  /** Currently selected option or options. */
  selected: SelectPanelItem | readonly SelectPanelItem[] | undefined
  /** Called with the new selection whenever it changes. */
  onSelectedChange: (
    selected: SelectPanelItem | SelectPanelItem[] | undefined,
    details?: Combobox.Root.ChangeEventDetails,
  ) => void
  /** Called when the panel opens or closes, with the gesture that caused it. */
  onOpenChange?: (open: boolean, gesture: SelectPanelOpenChangeGesture) => void
  /** Controls whether the panel is open. Supply it with `onOpenChange` to own the state. */
  open?: boolean
  /** Whether the panel starts open when it owns its own state. */
  defaultOpen?: boolean
  /** Heading shown at the top of the panel. */
  title?: React.ReactNode
  /** Supporting text shown below the title. */
  subtitle?: React.ReactNode
  /** Text shown on the anchor when nothing is selected. */
  placeholder?: string
  /** Placeholder shown in the filter input. */
  placeholderText?: string
  /** Accessible name for the filter input. */
  inputLabel?: string
  /** Whether one option or several may be selected. */
  selectionVariant?: 'single' | 'multiple'
  /** Controls the filter query. Supply it with `onFilterChange` to own the state. */
  filterValue?: string
  /** Initial filter query when the panel owns its own state. */
  defaultFilterValue?: string
  /** Called with the new query whenever the filter input changes. */
  onFilterChange?: (filter: string, details: Combobox.Root.ChangeEventDetails) => void
  className?: string
  /** Size and positioning of the panel overlay. */
  overlayProps?: SelectPanelOverlayProps
  /** Extra props forwarded to the filter input. */
  textInputProps?: Partial<Omit<TextInputProps, 'onChange' | 'value' | 'defaultValue'>>
  /** Accessible name for the panel. */
  'aria-label'?: string
  /** Alignment of the panel along the anchor's edge. */
  align?: PopoverPositionerProps['align']
  /** Id of the element the panel is anchored to. */
  anchorId?: string
  /** Identifier for the panel, used to associate it with its anchor. */
  id?: string
  /** Shows a loading affordance in place of the options. */
  loading?: boolean
  /** Which affordance the first load shows. */
  initialLoadingType?: 'spinner' | 'skeleton'
  /** Content shown in place of the options, for an error or other terminal state. */
  message?: React.ReactNode | SelectPanelMessage
  /** Banner shown above the options, for a warning that does not replace them. */
  notice?: SelectPanelNotice
  /** Extra control shown in the panel's footer. */
  secondaryAction?: React.ReactElement
  /** Shows a control that selects or clears every option at once. */
  showSelectAll?: boolean
  /** Moves selected options to the top of the list. */
  showSelectedOptionsFirst?: boolean
  /** Draws a divider between options. */
  showItemDividers?: boolean
  /** Group headers, matched to options by their group id. */
  groupMetadata?: readonly SelectPanelGroupMetadata[]
  /** Renders each group yourself. */
  renderGroup?: SelectPanelRenderGroup
  /** Height of the panel. */
  height?: OverlayHeight
  /** Renders each option yourself. */
  renderItem?: SelectPanelRenderItem
  /** Renders only the visible options, for a long uniform list. */
  virtualized?: boolean
  /** Width of the panel. */
  width?: OverlayWidth
  /** Ref to the scrolling options container. */
  scrollContainerRef?: React.Ref<HTMLDivElement>
  /** Extra props forwarded to the underlying list. */
  actionListProps?: SelectPanelActionListProps
  /** Called when the options are scrolled to the end, for loading another page. */
  onScrollEnd?: () => void
  /** Called when keyboard focus moves to a different option. */
  onActiveDescendantChanged?: (
    current: HTMLElement | undefined,
    previous: HTMLElement | undefined,
    directlyActivated: boolean,
  ) => void
  /** Whether keyboard navigation stops or wraps at the first and last option. */
  focusOutBehavior?: 'start' | 'stop' | 'wrap'
  /** Enables automatic highlighting as the filter changes; it does not re-highlight items prepended to an unchanged filter. */
  focusPrependedElements?: boolean
  /** Stops hovering an option from making it the active descendant. */
  disableSelectOnHover?: boolean
  /** Suppresses filter-change highlighting unless focusPrependedElements is enabled. Initial item highlighting is not yet supported. */
  setInitialFocus?: boolean
  /** Keeps the panel within the viewport rather than its nearest scrolling ancestor. */
  displayInViewport?: boolean
  /** Keeps the panel anchored on narrow viewports when the fullscreen feature flag is enabled. */
  disableFullscreenOnNarrow?: boolean
  /** How the panel falls back when CSS anchor positioning cannot place it. */
  cssAnchorPositioningSettings?: {
    fallbackStrategy?: 'default' | 'none' | 'opposite-side'
  }
}

type SelectPanelExternalAnchorProps = {
  /** Ref to your own anchor element, when you render the anchor yourself. */
  anchorRef: React.RefObject<HTMLElement | null>
  /** Not supported when the anchor is rendered externally. */
  anchorProps?: never
  /** Set to null when the anchor is rendered outside the panel and referenced by `anchorRef`. */
  renderAnchor: null
}

type SelectPanelInternalAnchorProps = {
  /** Ref to the anchor element the panel renders. */
  anchorRef?: React.RefObject<HTMLElement | null>
  /** Configure a custom anchor's element and, when needed, its role inside a composite widget. */
  anchorProps?: Pick<React.ComponentPropsWithoutRef<typeof Popover.Trigger>, 'nativeButton' | 'role'>
  /** Renders the anchor yourself, receiving the props that make it control the panel. */
  renderAnchor?: (props: SelectPanelAnchorProps) => React.ReactElement
}

type SelectPanelVariantProps =
  | {
      /** How the panel presents itself. `anchored` attaches it to its anchor. */
      variant?: 'anchored'
      /** Called when the panel is dismissed without a selection. */
      onCancel?: () => void
    }
  | {
      /** How the panel presents itself. `modal` presents it over the page and requires `onCancel`. */
      variant: 'modal'
      /** Called when the panel is dismissed without a selection. Required for a modal panel. */
      onCancel: () => void
    }

export type SelectPanelProps = SelectPanelBaseProps &
  (SelectPanelExternalAnchorProps | SelectPanelInternalAnchorProps) &
  SelectPanelVariantProps

export interface SelectPanelMessageProps extends SelectPanelMessage {
  className?: string
}

function isMultiSelection(selected: SelectPanelProps['selected']): selected is readonly SelectPanelItem[] {
  return Array.isArray(selected)
}

function getItemLabel(item: SelectPanelItem) {
  return getItemText(item) || (item.id === undefined ? '' : String(item.id))
}

function supportsBuiltInVirtualization(items: readonly SelectPanelItem[], itemRenderer?: SelectPanelRenderItem) {
  return (
    itemRenderer === undefined &&
    items.every(
      item =>
        typeof item.text === 'string' &&
        item.children === undefined &&
        item.className === undefined &&
        item.description === undefined &&
        item.inactiveText === undefined &&
        item.leadingVisual === undefined &&
        item.renderItem === undefined &&
        item.style === undefined &&
        item.trailingVisual === undefined,
    )
  )
}

function isMessage(message: SelectPanelProps['message']): message is SelectPanelMessage {
  return Boolean(message && typeof message === 'object' && !React.isValidElement(message) && 'title' in message)
}

function SelectPanelMessageComponent({
  action,
  body,
  className,
  icon: Icon,
  role,
  title,
  variant = 'empty',
}: SelectPanelMessageProps) {
  const DefaultIcon = variant === 'error' ? StopIcon : variant === 'warning' ? AlertIcon : SearchIcon
  const MessageIcon = Icon ?? DefaultIcon
  const messageRole = role ?? (variant === 'error' ? 'alert' : 'status')

  return (
    <div
      className={cn('flex flex-1 flex-col items-center justify-center gap-2 px-6 py-8 text-center text-sm', className)}
      data-component="SelectPanel.Message"
      data-variant={variant}
      role={messageRole}
    >
      <MessageIcon
        aria-hidden="true"
        className={cn(
          'size-6',
          variant === 'empty' && 'text-muted',
          variant === 'error' && 'text-danger',
          variant === 'warning' && 'text-attention',
        )}
        data-component="SelectPanel.MessageIcon"
      />
      <strong className="text-sm text-default" data-component="SelectPanel.MessageTitle">
        {title}
      </strong>
      {body ? (
        <div className="text-sm text-muted" data-component="SelectPanel.MessageBody">
          {body}
        </div>
      ) : null}
      {action ? (
        <div className="mt-1" data-component="SelectPanel.MessageAction">
          {action}
        </div>
      ) : null}
    </div>
  )
}

export type SelectPanelSecondaryActionButtonProps = ButtonProps

function SelectPanelSecondaryActionButton({block = true, children, ...props}: SelectPanelSecondaryActionButtonProps) {
  return (
    <Button {...props} block={block} data-component="SelectPanel.SecondaryActionButton">
      {children}
    </Button>
  )
}

// A secondary link always fills the footer and reads as a quiet action, so `block` and `variant` are fixed.
export interface SelectPanelSecondaryActionLinkProps extends Omit<LinkButtonProps, 'block' | 'variant'> {
  /** URL the secondary action navigates to. */
  href: string
}

function SelectPanelSecondaryActionLink(props: SelectPanelSecondaryActionLinkProps) {
  return <LinkButton {...props} block data-component="SelectPanel.SecondaryActionLink" variant="invisible" />
}

function useNarrowViewport() {
  return React.useSyncExternalStore(
    listener => {
      if (typeof window.matchMedia !== 'function') return () => {}
      const media = window.matchMedia('(max-width: 767px)')
      media.addEventListener('change', listener)
      return () => media.removeEventListener('change', listener)
    },
    () => typeof window.matchMedia === 'function' && window.matchMedia('(max-width: 767px)').matches,
    () => false,
  )
}

function useDocumentScrollLock(locked: boolean) {
  React.useLayoutEffect(() => {
    if (!locked) return

    if (selectPanelScrollLockCount === 0) {
      selectPanelPreviousBodyOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    }
    selectPanelScrollLockCount += 1

    return () => {
      selectPanelScrollLockCount -= 1
      if (selectPanelScrollLockCount === 0) {
        document.body.style.overflow = selectPanelPreviousBodyOverflow ?? ''
        selectPanelPreviousBodyOverflow = undefined
      }
    }
  }, [locked])
}

interface SelectPanelOptionProps {
  itemNodes: React.RefObject<Map<SelectPanelItem, HTMLElement>>
  itemRenderer?: SelectPanelRenderItem
  multiple: boolean
  optionIndex?: number
  optionCount?: number
  radio: boolean
  showItemDividers: boolean
  value: SelectPanelValue
  virtualized?: boolean
}

function assignItemNode(
  itemNodes: React.RefObject<Map<SelectPanelItem, HTMLElement>>,
  item: SelectPanelItem,
  ref: React.Ref<HTMLElement> | undefined,
  node: HTMLElement | null,
) {
  if (node) {
    itemNodes.current.set(item, node)
  } else {
    itemNodes.current.delete(item)
  }
  assignRef(ref ?? null, node)
}

function SelectPanelOption({
  itemNodes,
  itemRenderer,
  multiple,
  optionIndex,
  optionCount,
  radio,
  showItemDividers,
  value,
  virtualized = false,
}: SelectPanelOptionProps) {
  const accessibilityId = React.useId()
  const activationEventRef = React.useContext(SelectPanelActivationContext)
  const item = value.item
  const {
    children,
    className,
    description,
    descriptionVariant,
    disabled,
    inactiveText,
    id: itemId,
    key: itemKey,
    filterValue,
    groupId,
    leadingVisual,
    onAction,
    ref,
    renderItem,
    text,
    trailingVisual,
    ...itemProps
  } = item
  const optionDisabled = Boolean(disabled || inactiveText)
  const renderer = renderItem ?? itemRenderer
  const renderedItem = renderer?.(item)
  const renderedActionListItem =
    React.isValidElement<ActionListItemProps>(renderedItem) && renderedItem.type === ActionList.Item
      ? renderedItem
      : undefined
  const resolvedContent = ActionItemContent.resolveOption(
    {
      children: (
        <>
          {children}
          {text}
        </>
      ),
      description,
      descriptionVariant,
      leadingVisual: leadingVisual ? renderItemVisual(leadingVisual) : undefined,
      trailingVisual: trailingVisual ? renderItemVisual(trailingVisual) : undefined,
    },
    renderedItem,
    renderedActionListItem,
    accessibilityId,
  )
  const ariaLabel = itemProps['aria-label'] ?? renderedActionListItem?.props['aria-label']
  const ariaLabelledBy = itemProps['aria-labelledby'] ?? renderedActionListItem?.props['aria-labelledby']
  const inactiveDescriptionId = inactiveText ? `${accessibilityId}-inactive` : undefined
  const selection = inactiveText ? (
    <AlertIcon aria-hidden="true" className="size-4 shrink-0 text-attention" />
  ) : (
    <ComboboxSelectionIndicator disabled={disabled} variant={multiple ? 'multiple' : radio ? 'radio' : 'single'} />
  )

  return (
    <Combobox.Item
      {...itemProps}
      {...getActionItemStateAttributes({disabled, inactive: Boolean(inactiveText)})}
      aria-describedby={joinIdRefs(
        itemProps['aria-describedby'],
        renderedActionListItem?.props['aria-describedby'],
        ...(resolvedContent?.descriptionIds ?? []),
        inactiveDescriptionId,
      )}
      aria-label={ariaLabel}
      aria-labelledby={
        ariaLabelledBy ??
        (ariaLabel === undefined ? joinIdRefs(resolvedContent?.labelId, resolvedContent?.trailingVisualId) : undefined)
      }
      aria-posinset={optionIndex === undefined ? itemProps['aria-posinset'] : optionIndex + 1}
      aria-setsize={optionCount ?? itemProps['aria-setsize']}
      className={cn(
        // Selection shows only through the indicator, as it does in ActionList listboxes.
        'group relative flex w-full cursor-default items-center rounded-md px-2 py-1.5 text-left text-sm outline-none',
        actionItemPartClassName.content,
        getActionItemStateClassName({disabled, highlightable: true, inactive: Boolean(inactiveText)}),
        // Rows clip only vertically, so the accent line beside a highlighted row stays visible.
        virtualized && 'h-9 overflow-y-clip whitespace-nowrap',
        showItemDividers &&
          'border-b border-default last:border-b-0 [&[data-highlighted]+[data-highlighted]]:border-transparent',
        className,
      )}
      data-component="SelectPanel.Item"
      data-filter-value={filterValue}
      data-group-id={groupId}
      data-item-id={itemId === undefined ? undefined : `${typeof itemId}:${String(itemId)}`}
      data-item-key={itemKey === undefined ? undefined : `${typeof itemKey}:${String(itemKey)}`}
      disabled={optionDisabled}
      index={virtualized ? optionIndex : undefined}
      onClick={event => {
        onAction?.(item, event, {sourceEvent: activationEventRef?.current ?? event.nativeEvent})
        if (event.defaultPrevented) event.preventBaseUIHandler()
      }}
      ref={node => assignItemNode(itemNodes, item, ref, node)}
      value={value}
    >
      {resolvedContent ? (
        <ActionItemContent
          resolvedContent={resolvedContent}
          selection={selection}
          supportingText={inactiveText}
          supportingTextId={inactiveDescriptionId}
        />
      ) : (
        renderedItem
      )}
      {inactiveText && !resolvedContent ? (
        <span aria-hidden="true" className="sr-only" id={inactiveDescriptionId}>
          {inactiveText}
        </span>
      ) : null}
    </Combobox.Item>
  )
}

interface SelectPanelVirtualizedListProps {
  actionListProps?: SelectPanelActionListProps
  itemNodes: React.RefObject<Map<SelectPanelItem, HTMLElement>>
  itemRenderer?: SelectPanelRenderItem
  multiple: boolean
  onScrollEnd?: () => void
  radio: boolean
  scrollContainerRef?: React.Ref<HTMLDivElement>
  showItemDividers: boolean
  values: readonly SelectPanelValue[]
}

function SelectPanelVirtualizedList({
  actionListProps,
  itemNodes,
  itemRenderer,
  multiple,
  onScrollEnd,
  radio,
  scrollContainerRef,
  showItemDividers,
  values,
}: SelectPanelVirtualizedListProps) {
  const scrollElementRef = React.useRef<HTMLDivElement | null>(null)
  const reachedEndRef = React.useRef(false)
  const [scrollTop, setScrollTop] = React.useState(0)
  const [viewportHeight, setViewportHeight] = React.useState(288)
  const rowHeight = 36
  const overscan = 8
  const firstIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
  const lastIndex = Math.min(values.length, Math.ceil((scrollTop + viewportHeight) / rowHeight) + overscan)
  const totalHeight = values.length * rowHeight
  const visibleValues = values.slice(firstIndex, lastIndex)
  const virtualStyle: CSSPropertiesWithCustomProperties = {'--select-panel-virtual-height': `${totalHeight}px`}

  const setScrollElement = React.useCallback(
    (node: HTMLDivElement | null) => {
      scrollElementRef.current = node
      assignRef(scrollContainerRef ?? null, node)
      if (node) setViewportHeight(node.clientHeight)
    },
    [scrollContainerRef],
  )

  React.useEffect(() => {
    const element = scrollElementRef.current
    if (!element || typeof ResizeObserver === 'undefined') return

    const observer = new ResizeObserver(entries => {
      const entry = entries[0]
      setViewportHeight(entry.contentRect.height)
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      {...actionListProps}
      className={cn('max-h-72 overflow-auto overscroll-contain', actionListProps?.className)}
      data-component="SelectPanel.VirtualizedList"
      onScroll={event => {
        actionListProps?.onScroll?.(event)
        const target = event.currentTarget
        const atEnd = target.scrollTop + target.clientHeight >= target.scrollHeight - 1
        if (atEnd && !reachedEndRef.current) {
          reachedEndRef.current = true
          onScrollEnd?.()
        } else if (!atEnd) {
          reachedEndRef.current = false
        }
        setScrollTop(target.scrollTop)
      }}
      ref={setScrollElement}
      role="presentation"
    >
      <div className="relative w-full h-[var(--select-panel-virtual-height)]" role="presentation" style={virtualStyle}>
        {visibleValues.map((value, offset) => {
          const index = firstIndex + offset
          const itemStyle: CSSPropertiesWithCustomProperties = {
            '--select-panel-virtual-offset': `${index * rowHeight}px`,
          }
          return (
            <div
              className="absolute inset-x-0 top-0 translate-y-[var(--select-panel-virtual-offset)]"
              key={value.renderKey}
              role="presentation"
              style={itemStyle}
            >
              <SelectPanelOption
                itemNodes={itemNodes}
                itemRenderer={itemRenderer}
                multiple={multiple}
                optionIndex={index}
                optionCount={values.length}
                radio={radio}
                showItemDividers={showItemDividers}
                value={value}
                virtualized
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface SelectPanelListProps {
  actionListProps?: SelectPanelActionListProps
  ariaLabel: string | undefined
  groupedValues: readonly SelectPanelGroupValue[] | undefined
  itemNodes: React.RefObject<Map<SelectPanelItem, HTMLElement>>
  itemRenderer?: SelectPanelRenderItem
  multiple: boolean
  onScrollEnd?: () => void
  radio: boolean
  renderGroup?: SelectPanelRenderGroup
  scrollContainerRef?: React.Ref<HTMLDivElement>
  showItemDividers: boolean
  values: readonly SelectPanelValue[]
  virtualized: boolean
}

function SelectPanelList({
  actionListProps,
  ariaLabel,
  groupedValues,
  itemNodes,
  itemRenderer,
  multiple,
  onScrollEnd,
  radio,
  renderGroup,
  scrollContainerRef,
  showItemDividers,
  values,
  virtualized,
}: SelectPanelListProps) {
  const reachedEndRef = React.useRef(false)

  const setListRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      assignRef(scrollContainerRef ?? null, node)
    },
    [scrollContainerRef],
  )

  const onScroll = React.useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      actionListProps?.onScroll?.(event)
      const target = event.currentTarget
      const atEnd = target.scrollTop + target.clientHeight >= target.scrollHeight - 1
      if (atEnd && !reachedEndRef.current) {
        reachedEndRef.current = true
        onScrollEnd?.()
      } else if (!atEnd) {
        reachedEndRef.current = false
      }
    },
    [actionListProps, onScrollEnd],
  )

  if (virtualized) {
    return (
      <Combobox.List
        aria-label={ariaLabel}
        aria-multiselectable={multiple || undefined}
        className="m-0 min-h-0 flex-1 list-none overflow-hidden p-1"
        data-component="SelectPanel.List"
      >
        <SelectPanelVirtualizedList
          actionListProps={actionListProps}
          itemNodes={itemNodes}
          itemRenderer={itemRenderer}
          multiple={multiple}
          onScrollEnd={onScrollEnd}
          radio={radio}
          scrollContainerRef={scrollContainerRef}
          showItemDividers={showItemDividers}
          values={values}
        />
      </Combobox.List>
    )
  }

  return (
    <Combobox.List
      {...actionListProps}
      aria-label={ariaLabel}
      aria-multiselectable={multiple || undefined}
      className={cn('m-0 min-h-0 max-h-72 flex-1 list-none overflow-auto p-1', actionListProps?.className)}
      data-component="SelectPanel.List"
      onScroll={onScroll}
      ref={setListRef}
    >
      {groupedValues
        ? (group: SelectPanelGroupValue, groupIndex: number) => {
            const groupOptionOffset = groupedValues
              .slice(0, groupIndex)
              .reduce((optionCount, previousGroup) => optionCount + previousGroup.items.length, 0)
            const groupMetadata: SelectPanelGroupMetadata = {
              groupId: group.groupId,
              header: {title: group.title, variant: group.variant},
              renderGroup: group.renderGroup,
              renderItem: group.renderItem,
            }
            const groupContent = (
              <>
                <Combobox.GroupLabel
                  className={cn(
                    'flex min-h-[30px] items-center px-3 py-1.5 text-xs leading-[18px] font-semibold text-muted',
                    group.variant === 'filled' && 'mb-1 border-y border-muted bg-muted',
                  )}
                  data-component="SelectPanel.GroupHeading"
                >
                  {group.title}
                </Combobox.GroupLabel>
                <Combobox.Collection>
                  {(value: SelectPanelValue, index: number) => (
                    <SelectPanelOption
                      itemNodes={itemNodes}
                      itemRenderer={group.renderItem ?? itemRenderer}
                      key={value.renderKey}
                      multiple={multiple}
                      optionCount={values.length}
                      optionIndex={groupOptionOffset + index}
                      radio={radio}
                      showItemDividers={showItemDividers}
                      value={value}
                    />
                  )}
                </Combobox.Collection>
              </>
            )

            return (
              <Combobox.Group className="block pb-2 last:pb-0" items={group.items} key={group.groupId}>
                {(group.renderGroup ?? renderGroup)?.(groupMetadata, groupContent) ?? groupContent}
              </Combobox.Group>
            )
          }
        : (value: SelectPanelValue, index: number) => (
            <SelectPanelOption
              itemNodes={itemNodes}
              itemRenderer={itemRenderer}
              key={value.renderKey}
              multiple={multiple}
              optionCount={values.length}
              optionIndex={index}
              radio={radio}
              showItemDividers={showItemDividers}
              value={value}
            />
          )}
    </Combobox.List>
  )
}

interface SelectPanelBodyProps {
  actionListProps?: SelectPanelActionListProps
  ariaLabel: string | undefined
  groupedValues: readonly SelectPanelGroupValue[] | undefined
  inputLabel: string
  inputRef: React.RefObject<HTMLInputElement | null>
  initialLoadingType: NonNullable<SelectPanelProps['initialLoadingType']>
  itemNodes: React.RefObject<Map<SelectPanelItem, HTMLElement>>
  loading: boolean
  message: SelectPanelProps['message']
  multiple: boolean
  open: boolean
  onScrollEnd?: () => void
  placeholderText: string
  radio: boolean
  renderGroup?: SelectPanelRenderGroup
  scrollContainerRef?: React.Ref<HTMLDivElement>
  showItemDividers: boolean
  showSelectAll: boolean
  textInputProps?: SelectPanelProps['textInputProps']
  values: readonly SelectPanelValue[]
  virtualized: boolean
  visibleItems: readonly SelectPanelItem[]
  selectedItems: readonly SelectPanelItem[]
  onSelectAllChange: (selected: boolean) => void
  renderItem?: SelectPanelRenderItem
}

function SelectPanelBody({
  actionListProps,
  ariaLabel,
  groupedValues,
  inputLabel,
  initialLoadingType,
  inputRef,
  itemNodes,
  loading,
  message,
  multiple,
  open,
  onScrollEnd,
  placeholderText,
  radio,
  renderGroup,
  renderItem,
  scrollContainerRef,
  selectedItems,
  showItemDividers,
  showSelectAll,
  textInputProps,
  values,
  virtualized,
  visibleItems,
  onSelectAllChange,
}: SelectPanelBodyProps) {
  const activationEventRef = React.useContext(SelectPanelActivationContext)
  const selectableItems = visibleItems.filter(item => !item.disabled && !item.inactiveText)
  const allSelected =
    selectableItems.length > 0 &&
    selectableItems.every(item => selectedItems.some(selectedItem => areItemsEqual(selectedItem, item)))
  const someSelected =
    !allSelected && selectableItems.some(item => selectedItems.some(selectedItem => areItemsEqual(selectedItem, item)))
  const selectAllLabel = allSelected ? 'Deselect all' : 'Select all'
  const hasMessage = message !== null && message !== undefined
  const messageContent: React.ReactNode = isMessage(message) ? (
    <SelectPanelMessageComponent {...message} />
  ) : (
    (message as React.ReactNode)
  )
  const {
    'aria-expanded': inputExpanded,
    className: inputClassName,
    id: inputId,
    size: inputSize,
    ...inputProps
  } = textInputProps ?? {}

  return (
    <>
      <div className="border-b border-default p-3" data-component="SelectPanel.FilterContainer">
        <Combobox.Input
          // The input tracks its own `id`, so it must not be overridden on the render element.
          id={inputId}
          aria-expanded={inputExpanded ?? (open && !loading && !hasMessage)}
          aria-label={inputProps['aria-label'] ?? inputLabel}
          autoFocus
          data-component="SelectPanel.Filter"
          placeholder={placeholderText}
          ref={inputRef}
          render={baseProps => {
            const mergedProps = mergeProps<'input'>(baseProps, inputProps, props => ({
              ...props,
              onKeyDown: event => handleSelectPanelInputKeyDown(event, props.onKeyDown, activationEventRef),
            }))
            return (
              <TextInput
                {...inputProps}
                {...mergedProps}
                block
                className={cn('w-full', inputClassName)}
                size={inputSize}
              />
            )
          }}
        />
      </div>
      {multiple && showSelectAll ? (
        <Field.Root className="contents">
          <SelectAllRow
            checked={allSelected}
            indeterminate={someSelected}
            label={selectAllLabel}
            onCheckedChange={onSelectAllChange}
          />
        </Field.Root>
      ) : null}
      {loading ? (
        <div className="flex flex-1 items-center justify-center gap-2 p-6 text-sm text-muted" role="status">
          {initialLoadingType === 'skeleton' ? (
            <div aria-hidden="true" className="w-full space-y-2">
              <div className="h-4 animate-pulse rounded bg-neutral-muted" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-neutral-muted" />
              <div className="h-4 w-3/5 animate-pulse rounded bg-neutral-muted" />
            </div>
          ) : (
            <Spinner size="small" srText={null} />
          )}
          Loading
        </div>
      ) : hasMessage ? (
        <div className="flex flex-1" data-component="SelectPanel.MessageContainer">
          {messageContent}
        </div>
      ) : (
        <>
          <SelectPanelList
            actionListProps={actionListProps}
            ariaLabel={ariaLabel}
            groupedValues={groupedValues}
            itemNodes={itemNodes}
            itemRenderer={renderItem}
            multiple={multiple}
            onScrollEnd={onScrollEnd}
            radio={radio}
            renderGroup={renderGroup}
            scrollContainerRef={scrollContainerRef}
            showItemDividers={showItemDividers}
            values={values}
            virtualized={virtualized && !groupedValues}
          />
          <Combobox.Empty className="flex flex-1" data-component="SelectPanel.Empty">
            <SelectPanelMessageComponent title="No items available" variant="empty" />
          </Combobox.Empty>
        </>
      )}
    </>
  )
}

function SelectPanelFieldBoundary({children}: {children: React.ReactNode}) {
  // Base UI fields inherit their parent's description IDs; the extra boundary keeps popup controls independent.
  return (
    <Field.Root className="contents">
      <Field.Root className="contents">{children}</Field.Root>
    </Field.Root>
  )
}

interface SelectPanelContentProps {
  actionListProps?: SelectPanelActionListProps
  ariaLabel: string | undefined
  groupedValues: readonly SelectPanelGroupValue[] | undefined
  initialLoadingType: NonNullable<SelectPanelProps['initialLoadingType']>
  inputLabel: string
  inputRef: React.RefObject<HTMLInputElement | null>
  isDialog: boolean
  itemNodes: React.RefObject<Map<SelectPanelItem, HTMLElement>>
  loading: boolean
  message: SelectPanelProps['message']
  multiple: boolean
  notice?: SelectPanelNotice
  open: boolean
  onCancelRequest: () => void
  onSave: () => void
  onScrollEnd?: () => void
  placeholderText: string
  radio: boolean
  renderGroup?: SelectPanelRenderGroup
  renderItem?: SelectPanelRenderItem
  secondaryAction?: React.ReactElement
  selectedItems: readonly SelectPanelItem[]
  showCancel: boolean
  showItemDividers: boolean
  showSave: boolean
  showSaveAndClose: boolean
  showSelectAll: boolean
  scrollContainerRef?: React.Ref<HTMLDivElement>
  subtitle?: React.ReactNode
  subtitleId: string
  textInputProps?: SelectPanelProps['textInputProps']
  title: React.ReactNode
  titleId: string
  values: readonly SelectPanelValue[]
  variant: 'anchored' | 'modal'
  virtualized: boolean
  visibleItems: readonly SelectPanelItem[]
  onSelectAllChange: (selected: boolean) => void
}

function SelectPanelContent({
  actionListProps,
  ariaLabel,
  groupedValues,
  initialLoadingType,
  inputLabel,
  inputRef,
  isDialog,
  itemNodes,
  loading,
  message,
  multiple,
  notice,
  open,
  onCancelRequest,
  onSave,
  onScrollEnd,
  placeholderText,
  radio,
  renderGroup,
  renderItem,
  scrollContainerRef,
  secondaryAction,
  selectedItems,
  showCancel,
  showItemDividers,
  showSave,
  showSaveAndClose,
  showSelectAll,
  subtitle,
  subtitleId,
  textInputProps,
  title,
  titleId,
  values,
  variant,
  virtualized,
  visibleItems,
  onSelectAllChange,
}: SelectPanelContentProps) {
  const activationEventRef = React.useRef<KeyboardEvent | null>(null)
  return (
    <SelectPanelActivationContext.Provider value={activationEventRef}>
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col overflow-hidden bg-default text-default',
          !isDialog && 'rounded-md border border-default shadow-floating-lg',
        )}
        data-component="SelectPanel"
        data-variant={variant}
      >
        <div className="contents" data-component="SelectPanel.Content">
          <header className="flex items-start justify-between gap-4 px-4 pt-4" data-component="SelectPanel.Header">
            <div className="min-w-0">
              <h2 className="m-0 font-semibold text-default" data-component="SelectPanel.Title" id={titleId}>
                {title}
              </h2>
              {subtitle ? (
                <p className="mt-1 text-sm text-muted" data-component="SelectPanel.Subtitle" id={subtitleId}>
                  {subtitle}
                </p>
              ) : null}
            </div>
            {isDialog ? (
              <CloseIconButton
                aria-label="Cancel and close"
                className="-mr-2 -mt-2"
                data-component="SelectPanel.CloseButton"
                onClick={onCancelRequest}
              />
            ) : null}
          </header>
          {notice ? (
            <Announce
              className="mx-4 mt-3"
              data-component="SelectPanel.Notice"
              politeness={notice.variant === 'error' ? 'assertive' : 'polite'}
            >
              <Banner
                description={notice.text}
                hideTitle
                layout="compact"
                title="Notice"
                variant={notice.variant === 'error' ? 'critical' : notice.variant}
              />
            </Announce>
          ) : null}
          <div className="flex min-h-0 flex-1 flex-col">
            <SelectPanelBody
              actionListProps={actionListProps}
              ariaLabel={ariaLabel}
              groupedValues={groupedValues}
              inputLabel={inputLabel}
              initialLoadingType={initialLoadingType}
              inputRef={inputRef}
              itemNodes={itemNodes}
              loading={loading}
              message={message}
              multiple={multiple}
              open={open}
              onScrollEnd={onScrollEnd}
              placeholderText={placeholderText}
              radio={radio}
              renderGroup={renderGroup}
              renderItem={renderItem}
              scrollContainerRef={scrollContainerRef}
              selectedItems={selectedItems}
              showItemDividers={showItemDividers}
              showSelectAll={showSelectAll}
              textInputProps={textInputProps}
              values={values}
              virtualized={virtualized}
              visibleItems={visibleItems}
              onSelectAllChange={onSelectAllChange}
            />
          </div>
          {secondaryAction || showCancel || showSave || showSaveAndClose ? (
            <footer
              className="flex flex-wrap items-center gap-2 border-t border-default p-3"
              data-component="SelectPanel.Footer"
            >
              {secondaryAction ? (
                <div className="min-w-0 flex-1" data-component="SelectPanel.SecondaryAction">
                  {secondaryAction}
                </div>
              ) : null}
              {showCancel || showSave || showSaveAndClose ? (
                <div className="ml-auto flex gap-2">
                  {showCancel ? (
                    <Button data-component="SelectPanel.CancelButton" onClick={onCancelRequest}>
                      Cancel
                    </Button>
                  ) : null}
                  {showSave ? (
                    <Button data-component="SelectPanel.SaveButton" onClick={onSave} variant="primary">
                      Save
                    </Button>
                  ) : null}
                  {showSaveAndClose ? (
                    <Button data-component="SelectPanel.SaveAndCloseButton" onClick={onSave} variant="primary">
                      Save and close
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </footer>
          ) : null}
        </div>
      </div>
    </SelectPanelActivationContext.Provider>
  )
}

const SelectPanelConfig = React.forwardRef<HTMLDivElement, SelectPanelProps>(function SelectPanel(
  {
    'aria-label': ariaLabel,
    actionListProps,
    align = 'start',
    anchorId,
    anchorProps,
    anchorRef,
    className,
    cssAnchorPositioningSettings,
    defaultFilterValue = '',
    defaultOpen = false,
    disableFullscreenOnNarrow = false,
    disableSelectOnHover = false,
    displayInViewport = false,
    filterValue: controlledFilterValue,
    focusOutBehavior = 'wrap',
    focusPrependedElements = false,
    groupMetadata,
    height: heightProp,
    id,
    initialLoadingType = 'spinner',
    inputLabel,
    items,
    loading = false,
    message,
    notice,
    onActiveDescendantChanged,
    onCancel,
    onFilterChange,
    onOpenChange,
    onScrollEnd,
    onSelectedChange,
    open: controlledOpen,
    overlayProps,
    placeholder,
    placeholderText = 'Filter items',
    renderAnchor,
    renderGroup,
    renderItem,
    scrollContainerRef,
    secondaryAction,
    selected,
    selectionVariant,
    setInitialFocus = false,
    showItemDividers = false,
    showSelectAll = false,
    showSelectedOptionsFirst = true,
    subtitle,
    textInputProps,
    title,
    variant = 'anchored',
    virtualized = false,
    width: widthProp,
  },
  forwardedRef,
) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const [uncontrolledFilterValue, setUncontrolledFilterValue] = React.useState(defaultFilterValue)
  const [draftSelection, setDraftSelection] = React.useState<{
    active: boolean
    value: SelectPanelItem | undefined
  }>({active: false, value: undefined})
  const itemNodes = React.useRef(new Map<SelectPanelItem, HTMLElement>())
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const internalAnchorRef = React.useRef<HTMLElement | null>(null)
  const lastAnchorRef = React.useRef<HTMLElement | null>(null)
  const lastCloseGestureRef = React.useRef<SelectPanelOpenChangeGesture | null>(null)
  const overflowAnchor = React.useContext(OverflowAnchorContext)
  const setAnchorRef = React.useCallback(
    (element: HTMLElement | null) => {
      internalAnchorRef.current = element
      if (element) lastAnchorRef.current = element
      if (anchorRef) anchorRef.current = element
    },
    [anchorRef],
  )
  const getPositionAnchor = React.useCallback(() => {
    const anchor = anchorRef?.current ?? internalAnchorRef.current ?? lastAnchorRef.current
    return anchor && overflowAnchor?.items.includes(anchor) ? (overflowAnchor.triggerRef.current ?? anchor) : anchor
  }, [anchorRef, overflowAnchor])
  const getFinalFocus = React.useCallback(() => {
    if (lastCloseGestureRef.current === 'click-outside') return false
    const anchor = anchorRef?.current ?? internalAnchorRef.current ?? lastAnchorRef.current
    if (anchor && overflowAnchor?.items.includes(anchor)) return overflowAnchor.triggerRef.current ?? true
    return anchor?.isConnected ? anchor : true
  }, [anchorRef, overflowAnchor])
  const previousActiveItem = React.useRef<HTMLElement | undefined>(undefined)
  const titleId = React.useId()
  const subtitleId = React.useId()
  const requiredId = React.useId()
  const formControlContext = useFormControlContext()
  const open = controlledOpen ?? uncontrolledOpen
  const [keepPortalMounted, setKeepPortalMounted] = React.useState(open)
  const releasePortalFrame = React.useRef<number | null>(null)
  if (open && !keepPortalMounted) setKeepPortalMounted(true)
  React.useEffect(() => {
    return () => {
      if (releasePortalFrame.current !== null) cancelAnimationFrame(releasePortalFrame.current)
    }
  }, [])
  const onOpenChangeComplete = (nextOpen: boolean) => {
    if (nextOpen) lastCloseGestureRef.current = null
    if (releasePortalFrame.current !== null) cancelAnimationFrame(releasePortalFrame.current)
    if (!nextOpen) {
      // Base UI restores focus in a microtask; do not remove the focused portal before it runs.
      releasePortalFrame.current = requestAnimationFrame(() => {
        releasePortalFrame.current = null
        setKeepPortalMounted(false)
      })
    }
  }
  const filterValue = controlledFilterValue ?? uncontrolledFilterValue
  const multiple = selectionVariant === 'multiple' || isMultiSelection(selected)
  const selectedItems = React.useMemo(
    () => (isMultiSelection(selected) ? [...selected] : selected ? [selected] : []),
    [selected],
  )
  const isSingleSelectModal = variant === 'modal' && !multiple
  const effectiveSelectedItems = React.useMemo(() => {
    if (!isSingleSelectModal) return selectedItems
    const selectedItem = draftSelection.active
      ? draftSelection.value
      : isMultiSelection(selected)
        ? undefined
        : selected
    return selectedItem ? [selectedItem] : []
  }, [draftSelection, isSingleSelectModal, selected, selectedItems])
  const panelTitle = title ?? (multiple ? 'Select items' : 'Select an item')
  const panelAnchorId = anchorId ?? id ?? formControlContext?.id
  const isNarrowViewport = useNarrowViewport()
  const fullscreenOnNarrow = useFeatureFlag('primer_react_select_panel_fullscreen_on_narrow')
  const useMobileDialog = variant === 'anchored' && fullscreenOnNarrow && !disableFullscreenOnNarrow && isNarrowViewport
  const isDialog = variant === 'modal' || useMobileDialog
  const isRadio = isSingleSelectModal
  useDocumentScrollLock(isDialog && open)
  const usesExternalFiltering = controlledFilterValue !== undefined || onFilterChange !== undefined
  const visibleItems = React.useMemo(() => {
    const normalizedFilter = filterValue.trim().toLocaleLowerCase()
    const filtered =
      !usesExternalFiltering && normalizedFilter
        ? items.filter(item => getItemLabel(item).toLocaleLowerCase().includes(normalizedFilter))
        : [...items]

    if (!showSelectedOptionsFirst) return filtered

    return filtered.toSorted((first, second) => {
      const firstSelected = effectiveSelectedItems.some(selectedItem => areItemsEqual(selectedItem, first))
      const secondSelected = effectiveSelectedItems.some(selectedItem => areItemsEqual(selectedItem, second))
      if (firstSelected === secondSelected) return 0
      return firstSelected ? -1 : 1
    })
  }, [effectiveSelectedItems, filterValue, items, showSelectedOptionsFirst, usesExternalFiltering])
  const values = React.useMemo(
    () =>
      visibleItems.map((item, index) => ({
        item,
        label: getItemLabel(item),
        renderKey: getItemRenderKey(item, index),
      })),
    [visibleItems],
  )
  const groupedValues = React.useMemo(() => {
    if (!groupMetadata?.length) return undefined

    return groupMetadata
      .map(group => ({
        groupId: group.groupId,
        items: values.filter(value => value.item.groupId === group.groupId),
        renderGroup: group.renderGroup,
        renderItem: group.renderItem,
        title: group.header?.title ?? `Group ${group.groupId}`,
        variant: group.header?.variant,
      }))
      .filter(group => group.items.length > 0)
  }, [groupMetadata, values])
  const usesBuiltInVirtualization =
    virtualized && groupedValues === undefined && supportsBuiltInVirtualization(visibleItems, renderItem)
  const selectedValues = React.useMemo(
    () =>
      effectiveSelectedItems.map((item, index) => ({
        item,
        label: getItemLabel(item),
        renderKey: getItemRenderKey(item, index),
      })),
    [effectiveSelectedItems],
  )
  const {
    alignOffset,
    className: overlayClassName,
    collisionBoundary,
    collisionPadding,
    container: portalContainer,
    height: overlayHeight,
    maxHeight,
    portal = true,
    positionerClassName,
    side = 'bottom',
    sideOffset = 4,
    style: overlayStyle,
    width: overlayWidth,
    ...overlayDomProps
  } = overlayProps ?? {}
  const panelWidth = widthProp ?? overlayWidth ?? 'medium'
  const panelHeight = heightProp ?? overlayHeight ?? 'auto'
  const listAriaLabel =
    actionListProps?.['aria-label'] ?? ariaLabel ?? (typeof panelTitle === 'string' ? panelTitle : undefined)
  const isControlled = controlledOpen !== undefined
  const positionerCollisionAvoidance =
    cssAnchorPositioningSettings?.fallbackStrategy === 'none'
      ? {side: 'none' as const, align: 'none' as const}
      : cssAnchorPositioningSettings?.fallbackStrategy === 'opposite-side'
        ? {side: 'flip' as const, align: 'none' as const, fallbackAxisSide: 'none' as const}
        : undefined

  const setPanelOpen = React.useCallback(
    (nextOpen: boolean, gesture: SelectPanelOpenChangeGesture) => {
      lastCloseGestureRef.current = nextOpen ? null : gesture
      if (isSingleSelectModal) {
        setDraftSelection({
          active: nextOpen,
          value: nextOpen && !isMultiSelection(selected) ? selected : undefined,
        })
      }
      if (!isControlled) setUncontrolledOpen(nextOpen)
      onOpenChange?.(nextOpen, gesture)
    },
    [isControlled, isSingleSelectModal, onOpenChange, selected],
  )

  const onFilterValueChange = React.useCallback(
    (nextFilterValue: string, details: Combobox.Root.ChangeEventDetails) => {
      if (controlledFilterValue === undefined) setUncontrolledFilterValue(nextFilterValue)
      onFilterChange?.(nextFilterValue, details)
    },
    [controlledFilterValue, onFilterChange],
  )

  const onSelectAllChange = React.useCallback(
    (nextSelected: boolean) => {
      const selectableItems = visibleItems.filter(item => !item.disabled && !item.inactiveText)
      const selectedOutsideVisibleItems = selectedItems.filter(
        selectedItem => !selectableItems.some(item => areItemsEqual(item, selectedItem)),
      )
      const nextItems = nextSelected
        ? [...selectedOutsideVisibleItems, ...selectableItems]
        : selectedOutsideVisibleItems

      onSelectedChange(nextItems)
    },
    [onSelectedChange, selectedItems, visibleItems],
  )

  const onValueChange = React.useCallback(
    (nextValue: SelectPanelValue | SelectPanelValue[] | null, details: Combobox.Root.ChangeEventDetails) => {
      const nextValues = Array.isArray(nextValue) ? nextValue : nextValue ? [nextValue] : []
      const nextItems = nextValues.map(value => value.item)

      if (isSingleSelectModal) {
        details.cancel()
        const nextItem = nextItems[0]
        const currentItem = draftSelection.active
          ? draftSelection.value
          : isMultiSelection(selected)
            ? undefined
            : selected
        setDraftSelection({
          active: true,
          value: currentItem && areItemsEqual(currentItem, nextItem) ? undefined : nextItem,
        })
        return
      }

      if (multiple) {
        onSelectedChange(nextItems, details)
        return
      }

      const nextItem = nextItems[0]
      onSelectedChange(
        selectedItems.some(selectedItem => areItemsEqual(selectedItem, nextItem)) ? undefined : nextItem,
        details,
      )
    },
    [draftSelection, isSingleSelectModal, multiple, onSelectedChange, selected, selectedItems],
  )

  const onHighlighted = React.useCallback(
    (value: SelectPanelValue | undefined, details: Combobox.Root.HighlightEventDetails) => {
      const current = value ? itemNodes.current.get(value.item) : undefined
      onActiveDescendantChanged?.(current, previousActiveItem.current, details.reason === 'keyboard')
      previousActiveItem.current = current
    },
    [onActiveDescendantChanged],
  )

  const requestCancel = React.useCallback(() => {
    onCancel?.()
    setPanelOpen(false, 'cancel')
  }, [onCancel, setPanelOpen])

  const saveSelection = React.useCallback(() => {
    if (isSingleSelectModal) {
      onSelectedChange(draftSelection.value)
    }
    setPanelOpen(false, 'selection')
  }, [draftSelection.value, isSingleSelectModal, onSelectedChange, setPanelOpen])

  const onComboboxOpenChange = React.useCallback(
    (nextOpen: boolean, details: Combobox.Root.ChangeEventDetails) => {
      if (!nextOpen && details.reason === 'item-press' && !isSingleSelectModal) {
        setPanelOpen(false, 'selection')
      }
    },
    [isSingleSelectModal, setPanelOpen],
  )

  const contentRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      assignRef(forwardedRef, node)
      if (node && panelHeight === 'initial') {
        node.style.setProperty('--select-panel-initial-height', `${node.getBoundingClientRect().height}px`)
      }
    },
    [forwardedRef, panelHeight],
  )

  const panelClasses = cn(
    'flex min-h-0 flex-col',
    panelWidthClasses[panelWidth],
    panelHeightClasses[panelHeight],
    maxHeight && panelHeight !== 'initial' && overlayMaxHeightClassNames[maxHeight],
    className,
    overlayClassName,
    isDialog && 'max-w-[calc(100vw-var(--base-size-32))]',
    useMobileDialog && 'h-[100dvh] w-screen max-w-none rounded-none',
  )
  const contentStyle = overlayStyle
  const selectedLabels = selectedItems.map(item => item.text ?? item.children ?? getItemLabel(item))
  // Upstream hands `renderAnchor` a joined string, so keep plain-text labels as one string and only
  // fall back to fragments when an item label is a node.
  const triggerLabel = selectedLabels.length
    ? selectedLabels.every(label => typeof label === 'string')
      ? selectedLabels.join(', ')
      : selectedLabels.map((label, index) => (
          <React.Fragment key={getItemRenderKey(selectedItems[index], index)}>
            {index > 0 ? ', ' : null}
            {label}
          </React.Fragment>
        ))
    : (placeholder ?? panelTitle)
  const anchorElement =
    renderAnchor === null ? null : renderAnchor ? (
      renderAnchor({children: triggerLabel, id: panelAnchorId})
    ) : (
      <Button data-component="SelectPanel.Trigger" trailingAction={TriangleDownIcon}>
        {triggerLabel}
      </Button>
    )
  const nativeAnchor = anchorElement ? (anchorProps?.nativeButton ?? !isLinkAnchor(anchorElement)) : true
  const anchorDisabled =
    formControlContext?.disabled ||
    (React.isValidElement<SelectPanelAnchorProps>(anchorElement) ? anchorElement.props.disabled : undefined)
  let fieldAnchor = anchorElement
  if (formControlContext && React.isValidElement<SelectPanelAnchorProps>(anchorElement)) {
    const description = joinIdRefs(
      formControlContext['aria-describedby'],
      anchorElement.props['aria-describedby'],
      formControlContext.required && requiredId,
    )
    const invalid = formControlContext['aria-invalid'] ?? anchorElement.props['aria-invalid']
    const labelledBy =
      anchorElement.props['aria-labelledby'] ??
      (anchorElement.props['aria-label'] ? undefined : formControlContext['aria-labelledby'])
    fieldAnchor = React.cloneElement(anchorElement, {
      ...(description ? {'aria-describedby': description} : {}),
      ...(invalid !== undefined ? {'aria-invalid': invalid} : {}),
      ...(labelledBy ? {'aria-labelledby': labelledBy} : {}),
      ...(formControlContext.disabled && nativeAnchor ? {disabled: true} : {}),
    })
  }

  const panel = (
    // The trigger belongs to the enclosing field; the popup contains independent controls.
    <FormControlContextProvider value={null}>
      <FormControlValidationStatusProvider value={undefined}>
        <SelectPanelFieldBoundary>
          <Combobox.Root<SelectPanelValue, boolean>
            autoHighlight={focusPrependedElements || !setInitialFocus}
            defaultInputValue={defaultFilterValue}
            filteredItems={groupedValues ?? values}
            highlightItemOnHover={!disableSelectOnHover}
            inputValue={filterValue}
            inline
            isItemEqualToValue={(itemValue, selectedValue) => areItemsEqual(itemValue.item, selectedValue.item)}
            itemToStringLabel={value => value.label}
            items={groupedValues ?? values}
            loopFocus={focusOutBehavior !== 'stop'}
            multiple={multiple}
            onInputValueChange={onFilterValueChange}
            onItemHighlighted={onHighlighted}
            onOpenChange={onComboboxOpenChange}
            onValueChange={onValueChange}
            open={open}
            value={multiple ? selectedValues : (selectedValues[0] ?? null)}
            virtualized={usesBuiltInVirtualization}
          >
            <SelectPanelContent
              actionListProps={actionListProps}
              ariaLabel={listAriaLabel}
              groupedValues={groupedValues}
              initialLoadingType={initialLoadingType}
              inputLabel={inputLabel ?? placeholderText}
              inputRef={inputRef}
              isDialog={isDialog}
              itemNodes={itemNodes}
              loading={loading}
              message={message}
              multiple={multiple}
              notice={notice}
              open={open}
              onCancelRequest={requestCancel}
              onSave={saveSelection}
              onScrollEnd={onScrollEnd}
              placeholderText={placeholderText}
              radio={isRadio}
              renderGroup={renderGroup}
              renderItem={renderItem}
              scrollContainerRef={scrollContainerRef}
              secondaryAction={secondaryAction}
              selectedItems={effectiveSelectedItems}
              showCancel={variant === 'modal' || (useMobileDialog && Boolean(onCancel))}
              showItemDividers={showItemDividers}
              showSave={variant === 'modal'}
              showSaveAndClose={useMobileDialog && multiple && !onCancel}
              showSelectAll={showSelectAll}
              subtitle={subtitle}
              subtitleId={subtitleId}
              textInputProps={textInputProps}
              title={panelTitle}
              titleId={titleId}
              values={values}
              variant={variant}
              virtualized={usesBuiltInVirtualization}
              visibleItems={visibleItems}
              onSelectAllChange={onSelectAllChange}
            />
          </Combobox.Root>
        </SelectPanelFieldBoundary>
      </FormControlValidationStatusProvider>
    </FormControlContextProvider>
  )
  const popoverContent = (
    <Popover.Positioner
      align={align}
      alignOffset={alignOffset}
      anchor={overflowAnchor ? getPositionAnchor : renderAnchor === null ? anchorRef : undefined}
      className={cn('z-popover', positionerClassName)}
      collisionAvoidance={positionerCollisionAvoidance}
      collisionBoundary={collisionBoundary}
      collisionPadding={collisionPadding ?? (displayInViewport ? 8 : undefined)}
      positionMethod={displayInViewport ? 'fixed' : undefined}
      side={side}
      sideOffset={sideOffset}
    >
      <Popover.Popup
        {...overlayDomProps}
        aria-describedby={subtitle ? subtitleId : undefined}
        aria-labelledby={titleId}
        className={panelClasses}
        finalFocus={overflowAnchor ? getFinalFocus : (anchorRef ?? true)}
        initialFocus={inputRef}
        ref={contentRef}
        role="dialog"
        style={contentStyle}
      >
        {panel}
      </Popover.Popup>
    </Popover.Positioner>
  )

  if (isDialog) {
    return (
      <Dialog.Root
        open={open}
        onOpenChangeComplete={onOpenChangeComplete}
        onOpenChange={(nextOpen, details) => {
          if (nextOpen) {
            setPanelOpen(true, details.event.type === 'keydown' ? 'anchor-key-press' : 'anchor-click')
            return
          }

          onCancel?.()
          setPanelOpen(false, details.reason === 'escape-key' ? 'escape' : 'click-outside')
        }}
      >
        {fieldAnchor ? (
          <>
            <Dialog.Trigger
              {...anchorProps}
              disabled={anchorDisabled}
              id={panelAnchorId}
              nativeButton={nativeAnchor}
              ref={setAnchorRef}
              render={fieldAnchor}
            />
            {formControlContext?.required ? (
              <span className="sr-only" id={requiredId}>
                Required
              </span>
            ) : null}
          </>
        ) : null}
        <FloatingPortal
          container={portalContainer}
          keepMounted={keepPortalMounted}
          part={Dialog.Portal}
          portal={portal}
        >
          <Dialog.Backdrop />
          <Dialog.Viewport className={cn(useMobileDialog && 'p-0', positionerClassName)}>
            <Dialog.Popup
              {...overlayDomProps}
              aria-describedby={subtitle ? subtitleId : undefined}
              aria-labelledby={titleId}
              className={panelClasses}
              finalFocus={overflowAnchor ? getFinalFocus : (anchorRef ?? true)}
              initialFocus={inputRef}
              ref={contentRef}
              style={contentStyle}
            >
              {panel}
            </Dialog.Popup>
          </Dialog.Viewport>
        </FloatingPortal>
      </Dialog.Root>
    )
  }

  return (
    <Popover.Root
      open={open}
      onOpenChangeComplete={onOpenChangeComplete}
      onOpenChange={(nextOpen, details) => {
        const gesture =
          details.reason === 'escape-key'
            ? 'escape'
            : details.reason === 'outside-press' || details.reason === 'focus-out'
              ? 'click-outside'
              : details.reason === 'trigger-press' && details.event.type === 'keydown'
                ? 'anchor-key-press'
                : 'anchor-click'
        setPanelOpen(nextOpen, gesture)
      }}
    >
      {fieldAnchor ? (
        <>
          <Popover.Trigger
            {...anchorProps}
            disabled={anchorDisabled}
            id={panelAnchorId}
            nativeButton={nativeAnchor}
            ref={setAnchorRef}
            render={fieldAnchor}
          />
          {formControlContext?.required ? (
            <span className="sr-only" id={requiredId}>
              Required
            </span>
          ) : null}
        </>
      ) : null}
      <FloatingPortal container={portalContainer} keepMounted={keepPortalMounted} part={Popover.Portal} portal={portal}>
        {popoverContent}
      </FloatingPortal>
    </Popover.Root>
  )
})

export const SelectPanel = Object.assign(SelectPanelConfig, {
  Message: SelectPanelMessageComponent,
  SecondaryActionButton: SelectPanelSecondaryActionButton,
  SecondaryActionLink: SelectPanelSecondaryActionLink,
})

SelectPanel.displayName = 'SelectPanel'
markFormControlInput(SelectPanel, {baseUiAccessibleLabel: true})
