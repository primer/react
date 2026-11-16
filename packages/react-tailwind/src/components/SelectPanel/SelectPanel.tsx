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
import {overlayHeightClassNames, overlayWidthClassNames} from '../../internal/overlaySize'
import {mergeRefs} from '../../internal/refs'
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
  auto: 'primer:min-w-[min(16rem,var(--available-width,100vw))] primer:w-auto',
} as const satisfies Record<OverlayWidth, string>

const panelHeightClasses = {
  ...overlayHeightClassNames,
  initial: 'primer:h-[var(--select-panel-initial-height)]',
} as const satisfies Record<OverlayHeight, string>

const panelMaxHeightClasses = {
  xsmall: 'primer:max-h-[min(12rem,var(--select-panel-available-height))]',
  small: 'primer:max-h-[min(16rem,var(--select-panel-available-height))]',
  medium: 'primer:max-h-[min(20rem,var(--select-panel-available-height))]',
  large: 'primer:max-h-[min(27rem,var(--select-panel-available-height))]',
  xlarge: 'primer:max-h-[min(37.5rem,var(--select-panel-available-height))]',
} as const satisfies Record<Exclude<OverlayMaxHeight, 'fit-content'>, string>

let selectPanelScrollLockCount = 0
let selectPanelPreviousBodyOverflow: string | undefined

type PopoverPositionerProps = React.ComponentPropsWithoutRef<typeof Popover.Positioner>
type SelectPanelValue = {
  item: SelectPanelItem
  label: string
  renderKey: string
}

const SelectPanelActivationContext = React.createContext<React.RefObject<KeyboardEvent | null> | null>(null)

interface SelectPanelNavigationContextValue {
  highlightedIndex: number | null
  onItemMount: (item: SelectPanelItem, node: HTMLElement) => void
  registerScrollElement: (node: HTMLDivElement | null) => void
  registerScrollToIndex: (scrollToIndex: ((index: number) => void) | null) => void
  scrollActiveOption: (event: React.KeyboardEvent<HTMLInputElement>) => boolean
}

const SelectPanelNavigationContext = React.createContext<SelectPanelNavigationContextValue | null>(null)

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

export type SelectPanelRenderItem<TItem extends SelectPanelItem = SelectPanelItem> = (item: TItem) => React.ReactNode

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

interface SelectPanelBaseProps<TItem extends SelectPanelItem> {
  /** Options to choose from. */
  items: readonly TItem[]
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
  /** Moves selected options to the top when the selected-option ordering feature flag is enabled. */
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
  renderItem?: SelectPanelRenderItem<TItem>
  /** Renders only visible options for supported text or noninteractive label content. */
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

/**
 * `TSelectedItem` lets `selected` hold options outside the current `items`, such as selections retained across async
 * filtering. Change callbacks receive options from either list. Single selection also accepts `undefined` so an
 * unselected panel reports the `items` type.
 */
export interface SelectPanelSingleSelectionProps<
  TItem extends SelectPanelItem = SelectPanelItem,
  TSelectedItem extends SelectPanelItem | undefined = TItem,
> {
  /** Selection mode. Defaults to `'multiple'` when `selected` is an array and `'single'` otherwise; when set, it must match the shape of `selected`. */
  selectionVariant?: 'single'
  /** Currently selected option or options: one option or `undefined` for single selection, or an array (`[]` when empty) for multiple selection. */
  selected: TSelectedItem | undefined
  /** Called with the new selection: one option or `undefined` for single selection, or an array for multiple selection. */
  onSelectedChange: (selected: TItem | TSelectedItem | undefined, details?: Combobox.Root.ChangeEventDetails) => void
}

/** Multiple selection. See `SelectPanelSingleSelectionProps` for the type parameters. */
export interface SelectPanelMultipleSelectionProps<
  TItem extends SelectPanelItem = SelectPanelItem,
  TSelectedItem extends SelectPanelItem = TItem,
> {
  /** Selection mode. Defaults to `'multiple'` when `selected` is an array and `'single'` otherwise; when set, it must match the shape of `selected`. */
  selectionVariant?: 'multiple'
  /** Currently selected option or options: one option or `undefined` for single selection, or an array (`[]` when empty) for multiple selection. */
  selected: readonly TSelectedItem[]
  /** Called with the new selection: one option or `undefined` for single selection, or an array for multiple selection. */
  onSelectedChange: (selected: Array<TItem | TSelectedItem>, details?: Combobox.Root.ChangeEventDetails) => void
}

export type SelectPanelSelectionProps<
  TItem extends SelectPanelItem = SelectPanelItem,
  TSelectedItem extends SelectPanelItem = TItem,
> = SelectPanelSingleSelectionProps<TItem, TSelectedItem> | SelectPanelMultipleSelectionProps<TItem, TSelectedItem>

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
  /** Returns one ref-capable trigger element; the panel attaches its trigger behavior to that element. */
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

type SelectPanelSharedProps<TItem extends SelectPanelItem> = SelectPanelBaseProps<TItem> &
  (SelectPanelExternalAnchorProps | SelectPanelInternalAnchorProps) &
  SelectPanelVariantProps

export type SelectPanelSingleProps<
  TItem extends SelectPanelItem = SelectPanelItem,
  TSelectedItem extends SelectPanelItem | undefined = TItem,
> = SelectPanelSharedProps<TItem> & SelectPanelSingleSelectionProps<TItem, TSelectedItem>

export type SelectPanelMultipleProps<
  TItem extends SelectPanelItem = SelectPanelItem,
  TSelectedItem extends SelectPanelItem = TItem,
> = SelectPanelSharedProps<TItem> & SelectPanelMultipleSelectionProps<TItem, TSelectedItem>

export type SelectPanelProps<
  TItem extends SelectPanelItem = SelectPanelItem,
  TSelectedItem extends SelectPanelItem = TItem,
> = SelectPanelSingleProps<TItem, TSelectedItem> | SelectPanelMultipleProps<TItem, TSelectedItem>

/** The runtime accepts either selection shape and reports changes in the shape implied by the selection mode. */
type SelectPanelImplementationProps = SelectPanelBaseProps<SelectPanelItem> & {
  selectionVariant?: 'single' | 'multiple'
  selected: SelectPanelItem | readonly SelectPanelItem[] | undefined
  onSelectedChange: (
    selected: SelectPanelItem | SelectPanelItem[] | undefined,
    details?: Combobox.Root.ChangeEventDetails,
  ) => void
} & (SelectPanelExternalAnchorProps | SelectPanelInternalAnchorProps) &
  SelectPanelVariantProps

/**
 * Separate signatures let an unannotated `onSelectedChange` infer its shape from `selected`. The final signature keeps
 * `React.ComponentProps<typeof SelectPanel>` equal to `SelectPanelProps`. When `selected` is empty or `undefined`,
 * `TSelectedItem` falls back to `never` so callbacks report the `items` type.
 */
export interface SelectPanelComponent {
  <TItem extends SelectPanelItem = SelectPanelItem, TSelectedItem extends SelectPanelItem = never>(
    props: SelectPanelMultipleProps<TItem, TSelectedItem> & React.RefAttributes<HTMLDivElement>,
  ): React.ReactNode
  <TItem extends SelectPanelItem = SelectPanelItem, TSelectedItem extends SelectPanelItem | undefined = never>(
    props: SelectPanelSingleProps<TItem, TSelectedItem> & React.RefAttributes<HTMLDivElement>,
  ): React.ReactNode
  <TItem extends SelectPanelItem = SelectPanelItem, TSelectedItem extends SelectPanelItem = TItem>(
    props: SelectPanelProps<TItem, TSelectedItem> & React.RefAttributes<HTMLDivElement>,
  ): React.ReactNode
  displayName?: string
}

export interface SelectPanelMessageProps extends SelectPanelMessage {
  className?: string
}

function isMultiSelection(
  selected: SelectPanelImplementationProps['selected'],
): selected is readonly SelectPanelItem[] {
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
        ((typeof item.text === 'string' && item.children === undefined) ||
          (item.text === undefined && item.children !== undefined && getItemText(item).length > 0)) &&
        item.className === undefined &&
        item.description === undefined &&
        item.inactiveText === undefined &&
        item.renderItem === undefined &&
        item.style === undefined &&
        item.trailingVisual === undefined,
    )
  )
}

function isMessage(message: SelectPanelImplementationProps['message']): message is SelectPanelMessage {
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
      className={cn(
        'primer:flex primer:flex-1 primer:flex-col primer:items-center primer:justify-center primer:gap-2 primer:px-6 primer:py-8 primer:text-center primer:text-sm',
        className,
      )}
      data-component="SelectPanel.Message"
      data-variant={variant}
      role={messageRole}
    >
      <MessageIcon
        aria-hidden="true"
        className={cn(
          'primer:size-6',
          variant === 'empty' && 'primer:text-muted',
          variant === 'error' && 'primer:text-danger',
          variant === 'warning' && 'primer:text-attention',
        )}
        data-component="SelectPanel.MessageIcon"
      />
      <strong className="primer:text-sm primer:text-default" data-component="SelectPanel.MessageTitle">
        {title}
      </strong>
      {body ? (
        <div className="primer:text-sm primer:text-muted" data-component="SelectPanel.MessageBody">
          {body}
        </div>
      ) : null}
      {action ? (
        <div className="primer:mt-1" data-component="SelectPanel.MessageAction">
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
  const virtualization = React.useContext(SelectPanelNavigationContext)
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
  const onItemMount = virtualization?.onItemMount
  const itemRef = React.useMemo(
    () =>
      mergeRefs<HTMLDivElement>(
        node => {
          if (node) itemNodes.current.set(item, node)
          else itemNodes.current.delete(item)
        },
        ref,
        node => {
          if (node) onItemMount?.(item, node)
        },
      ),
    [item, itemNodes, onItemMount, ref],
  )
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
    <AlertIcon aria-hidden="true" className="primer:size-4 primer:shrink-0 primer:text-attention" />
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
      aria-labelledby={ariaLabelledBy ?? ActionItemContent.optionLabelledBy(resolvedContent, ariaLabel)}
      aria-posinset={optionIndex === undefined ? itemProps['aria-posinset'] : optionIndex + 1}
      aria-setsize={optionCount ?? itemProps['aria-setsize']}
      className={cn(
        // Selection shows only through the indicator, as it does in ActionList listboxes.
        'primer:group primer:relative primer:flex primer:w-full primer:cursor-default primer:items-center primer:rounded-md primer:px-2 primer:py-1.5 primer:text-left primer:text-sm primer:outline-none',
        actionItemPartClassName.content,
        getActionItemStateClassName({disabled, highlightable: true, inactive: Boolean(inactiveText)}),
        showItemDividers &&
          'primer:border-b primer:border-default primer:last:border-b-0 primer:[&[data-highlighted]+[data-highlighted]]:border-transparent',
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
      ref={itemRef}
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
        <span aria-hidden="true" className="primer:sr-only" id={inactiveDescriptionId}>
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

function findVirtualItemIndex(offsets: readonly number[], offset: number) {
  let low = 0
  let high = offsets.length - 1
  while (low < high) {
    const middle = Math.ceil((low + high) / 2)
    if (offsets[middle] <= offset) low = middle
    else high = middle - 1
  }
  return Math.min(low, Math.max(0, offsets.length - 2))
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
  const observerRef = React.useRef<ResizeObserver | null>(null)
  const previousLayoutRef = React.useRef<{
    offsets: readonly number[]
    values: readonly SelectPanelValue[]
  } | null>(null)
  const virtualization = React.useContext(SelectPanelNavigationContext)
  const registerScrollToIndex = virtualization?.registerScrollToIndex
  const registerScrollElement = virtualization?.registerScrollElement
  const reachedEndRef = React.useRef(false)
  const [scrollTop, setScrollTop] = React.useState(0)
  const [viewportHeight, setViewportHeight] = React.useState(288)
  const [rowHeights, setRowHeights] = React.useState<ReadonlyMap<string, number>>(() => new Map())
  const estimatedRowHeight = 36
  const overscan = 8
  const offsets = React.useMemo(() => {
    const result = [0]
    for (const value of values) {
      result.push(result[result.length - 1] + (rowHeights.get(value.renderKey) ?? estimatedRowHeight))
    }
    return result
  }, [rowHeights, values])
  const firstIndex = Math.max(0, findVirtualItemIndex(offsets, scrollTop) - overscan)
  const lastIndex = Math.min(values.length, findVirtualItemIndex(offsets, scrollTop + viewportHeight) + overscan + 1)
  const visibleIndices = Array.from({length: lastIndex - firstIndex}, (_, offset) => firstIndex + offset)
  const highlightedIndex = virtualization?.highlightedIndex
  // An active descendant must remain mounted even if the user scrolls away from it.
  if (highlightedIndex !== null && highlightedIndex !== undefined && highlightedIndex >= 0) {
    if (highlightedIndex < firstIndex) visibleIndices.unshift(highlightedIndex)
    else if (highlightedIndex >= lastIndex && highlightedIndex < values.length) visibleIndices.push(highlightedIndex)
  }
  // clientHeight rounds fractional viewport sizes, so leave a pixel for the final row.
  const virtualStyle: CSSPropertiesWithCustomProperties = {
    '--select-panel-virtual-height': `${offsets[offsets.length - 1] + 1}px`,
  }

  const setScrollElement = React.useMemo(
    () =>
      mergeRefs<HTMLDivElement>(scrollElementRef, registerScrollElement, scrollContainerRef, node => {
        if (node) setViewportHeight(node.clientHeight)
      }),
    [registerScrollElement, scrollContainerRef],
  )

  const measureRows = React.useCallback((elements: readonly Element[]) => {
    const measurements = elements.flatMap(element => {
      const key = element.getAttribute('data-virtual-key')
      const height = element.getBoundingClientRect().height
      return key && height > 0 ? [{key, height}] : []
    })
    setRowHeights(previous => {
      let next: Map<string, number> | undefined
      for (const {key, height} of measurements) {
        if (Math.abs(((next ?? previous).get(key) ?? estimatedRowHeight) - height) > 0.1) {
          if (!next) next = new Map(previous)
          next.set(key, height)
        }
      }
      return next ?? previous
    })
  }, [])

  const observeRow = React.useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    observerRef.current?.observe(node)
    return () => observerRef.current?.unobserve(node)
  }, [])

  React.useLayoutEffect(() => {
    const element = scrollElementRef.current
    if (!element) return

    const measureVisibleRows = () => {
      setViewportHeight(element.clientHeight)
      measureRows(Array.from(element.querySelectorAll('[data-virtual-key]')))
    }
    if (typeof ResizeObserver === 'undefined') {
      measureVisibleRows()
      // eslint-disable-next-line github/prefer-observers -- fallback for environments without ResizeObserver.
      window.addEventListener('resize', measureVisibleRows)
      return () => window.removeEventListener('resize', measureVisibleRows)
    }
    const observer = new ResizeObserver(entries => {
      const rows: Element[] = []
      for (const entry of entries) {
        if (entry.target === element) setViewportHeight(entry.contentRect.height)
        else rows.push(entry.target)
      }
      if (rows.length) measureRows(rows)
    })
    observerRef.current = observer
    observer.observe(element)
    for (const row of element.querySelectorAll('[data-virtual-key]')) observer.observe(row)
    return () => {
      observerRef.current = null
      observer.disconnect()
    }
  }, [measureRows, setScrollElement])

  React.useLayoutEffect(() => {
    if (typeof ResizeObserver !== 'undefined') return
    const element = scrollElementRef.current
    if (element) measureRows(Array.from(element.querySelectorAll('[data-virtual-key]')))
  }, [firstIndex, lastIndex, measureRows, values])

  React.useLayoutEffect(() => {
    const element = scrollElementRef.current
    const previous = previousLayoutRef.current
    if (element && previous?.values === values && previous.offsets !== offsets) {
      const activeIndex = virtualization?.highlightedIndex
      const activeWasVisible =
        activeIndex !== null &&
        activeIndex !== undefined &&
        activeIndex >= 0 &&
        activeIndex < values.length &&
        previous.offsets[activeIndex] >= scrollTop - 1 &&
        previous.offsets[activeIndex + 1] <= scrollTop + element.clientHeight + 1
      if (activeWasVisible) {
        const top = offsets[activeIndex]
        const bottom = offsets[activeIndex + 1]
        if (bottom - top > element.clientHeight) element.scrollTop = top
        else if (top < scrollTop) element.scrollTop = top
        else if (bottom > scrollTop + element.clientHeight - 1) {
          element.scrollTop = bottom - element.clientHeight + 1
        }
      } else {
        // Preserve the first visible row when measurements above it change.
        const anchorIndex = findVirtualItemIndex(previous.offsets, scrollTop)
        element.scrollTop = scrollTop + offsets[anchorIndex] - previous.offsets[anchorIndex]
      }
    }
    previousLayoutRef.current = {offsets, values}
  }, [offsets, scrollTop, values, virtualization?.highlightedIndex])

  React.useLayoutEffect(() => {
    if (!registerScrollToIndex) return
    const scrollToIndex = (index: number) => {
      const element = scrollElementRef.current
      if (!element || index < 0 || index >= values.length) return
      const top = offsets[index]
      const bottom = offsets[index + 1]
      if (bottom - top > element.clientHeight) element.scrollTop = top
      else if (top < element.scrollTop) element.scrollTop = top
      else if (bottom > element.scrollTop + element.clientHeight) {
        element.scrollTop = bottom - element.clientHeight + 1
      }
      setScrollTop(element.scrollTop)
    }
    registerScrollToIndex(scrollToIndex)
    return () => registerScrollToIndex(null)
  }, [offsets, registerScrollToIndex, values.length])

  return (
    <div
      {...actionListProps}
      className={cn(
        'primer:min-h-0 primer:max-h-72 primer:flex-1 primer:overflow-auto primer:overscroll-contain',
        actionListProps?.className,
      )}
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
      <div
        className="primer:relative primer:w-full primer:h-[var(--select-panel-virtual-height)]"
        role="presentation"
        style={virtualStyle}
      >
        {visibleIndices.map(index => {
          const value = values[index]
          const itemStyle: CSSPropertiesWithCustomProperties = {
            '--select-panel-virtual-offset': `${offsets[index]}px`,
          }
          return (
            <div
              className="primer:absolute primer:inset-x-0 primer:top-0 primer:translate-y-[var(--select-panel-virtual-offset)]"
              data-virtual-key={value.renderKey}
              key={value.renderKey}
              ref={observeRow}
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
  const registerScrollElement = React.useContext(SelectPanelNavigationContext)?.registerScrollElement

  const setListRef = React.useMemo(
    () => mergeRefs(registerScrollElement, scrollContainerRef),
    [registerScrollElement, scrollContainerRef],
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
        className={cn(
          'primer:m-0 primer:flex primer:max-h-72 primer:flex-1 primer:list-none primer:flex-col primer:overflow-hidden primer:p-1',
          values.length ? 'primer:min-h-16' : 'primer:min-h-0',
        )}
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
      className={cn(
        'primer:m-0 primer:max-h-72 primer:flex-1 primer:list-none primer:overflow-auto primer:p-1',
        values.length ? 'primer:min-h-16' : 'primer:min-h-0',
        actionListProps?.className,
      )}
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
                    'primer:flex primer:min-h-[30px] primer:items-center primer:px-3 primer:py-1.5 primer:text-xs primer:leading-[18px] primer:font-semibold primer:text-muted',
                    group.variant === 'filled' && 'primer:mb-1 primer:border-y primer:border-muted primer:bg-muted',
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
              <Combobox.Group
                className="primer:block primer:pb-2 primer:last:pb-0"
                items={group.items}
                key={group.groupId}
              >
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
  const navigation = React.useContext(SelectPanelNavigationContext)
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
      <div className="primer:border-b primer:border-default primer:p-3" data-component="SelectPanel.FilterContainer">
        <Combobox.Input
          // The input tracks its own `id`, so it must not be overridden on the render element.
          id={inputId}
          aria-expanded={inputExpanded ?? (open && !loading && !hasMessage)}
          aria-label={inputProps['aria-label'] ?? inputLabel}
          data-component="SelectPanel.Filter"
          placeholder={placeholderText}
          ref={inputRef}
          render={baseProps => {
            const mergedProps = mergeProps<'input'>(
              baseProps,
              {
                onKeyDown: event => {
                  if (navigation?.scrollActiveOption(event)) event.preventBaseUIHandler()
                },
              },
              inputProps,
              props => ({
                ...props,
                onKeyDown: event => handleSelectPanelInputKeyDown(event, props.onKeyDown, activationEventRef),
              }),
            )
            return (
              <TextInput
                {...inputProps}
                {...mergedProps}
                block
                className={cn('primer:w-full', inputClassName)}
                size={inputSize}
              />
            )
          }}
        />
      </div>
      {multiple && showSelectAll ? (
        <Field.Root className="primer:contents">
          <SelectAllRow
            checked={allSelected}
            indeterminate={someSelected}
            label={selectAllLabel}
            onCheckedChange={onSelectAllChange}
          />
        </Field.Root>
      ) : null}
      {loading ? (
        <div
          className="primer:flex primer:flex-1 primer:items-center primer:justify-center primer:gap-2 primer:p-6 primer:text-sm primer:text-muted"
          role="status"
        >
          {initialLoadingType === 'skeleton' ? (
            <div aria-hidden="true" className="primer:w-full primer:space-y-2">
              <div className="primer:h-4 primer:animate-pulse primer:rounded primer:bg-neutral-muted" />
              <div className="primer:h-4 primer:w-4/5 primer:animate-pulse primer:rounded primer:bg-neutral-muted" />
              <div className="primer:h-4 primer:w-3/5 primer:animate-pulse primer:rounded primer:bg-neutral-muted" />
            </div>
          ) : (
            <Spinner size="small" srText={null} />
          )}
          Loading
        </div>
      ) : hasMessage ? (
        <div className="primer:flex primer:flex-1" data-component="SelectPanel.MessageContainer">
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
          <Combobox.Empty
            className={values.length ? 'primer:flex-none' : 'primer:flex primer:flex-1'}
            data-component="SelectPanel.Empty"
          >
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
    <Field.Root className="primer:contents">
      <Field.Root className="primer:contents">{children}</Field.Root>
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
  showCloseButton: boolean
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
  showCloseButton,
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
          'primer:flex primer:min-h-0 primer:flex-1 primer:flex-col primer:overflow-x-hidden primer:overflow-y-auto primer:overscroll-contain primer:bg-default primer:text-default',
          !isDialog && 'primer:rounded-md primer:border-thin primer:border-default primer:shadow-floating-lg',
        )}
        data-component="SelectPanel"
        data-variant={variant}
      >
        <div className="primer:contents" data-component="SelectPanel.Content">
          <header
            className="primer:flex primer:items-start primer:justify-between primer:gap-4 primer:px-2 primer:pt-2"
            data-component="SelectPanel.Header"
          >
            <div className="primer:min-w-0">
              <h2
                className="primer:m-0 primer:ml-2 primer:text-sm primer:leading-normal primer:font-semibold primer:text-default"
                data-component="SelectPanel.Title"
                id={titleId}
              >
                {title}
              </h2>
              {subtitle ? (
                <p
                  className="primer:m-0 primer:mt-1 primer:ml-2 primer:text-xs primer:leading-normal primer:text-muted"
                  data-component="SelectPanel.Subtitle"
                  id={subtitleId}
                >
                  {subtitle}
                </p>
              ) : null}
            </div>
            {showCloseButton ? (
              <CloseIconButton
                aria-label="Cancel and close"
                className="primer:-mr-2 primer:-mt-2"
                data-component="SelectPanel.CloseButton"
                onClick={onCancelRequest}
              />
            ) : null}
          </header>
          {notice ? (
            <Announce
              className="primer:mx-4 primer:mt-3"
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
          <div className="primer:contents">
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
              className="primer:flex primer:flex-wrap primer:items-center primer:gap-2 primer:border-t primer:border-default primer:p-3"
              data-component="SelectPanel.Footer"
            >
              {secondaryAction ? (
                <div className="primer:min-w-0 primer:flex-1" data-component="SelectPanel.SecondaryAction">
                  {secondaryAction}
                </div>
              ) : null}
              {showCancel || showSave || showSaveAndClose ? (
                <div
                  className={cn(
                    'primer:ml-auto primer:flex primer:gap-2',
                    showSaveAndClose && !secondaryAction && 'primer:w-full',
                  )}
                >
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
                    <Button block data-component="SelectPanel.SaveAndCloseButton" onClick={onSave} variant="primary">
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

const SelectPanelImplementation = React.forwardRef<HTMLDivElement, SelectPanelImplementationProps>(function SelectPanel(
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
  const open = controlledOpen ?? uncontrolledOpen
  const multiple = selectionVariant === 'multiple' || isMultiSelection(selected)
  const isSingleSelectModal = variant === 'modal' && !multiple
  const initialDraftSelection = () => ({
    active: open && isSingleSelectModal,
    value: open && isSingleSelectModal && !isMultiSelection(selected) ? selected : undefined,
  })
  const [draftSelection, setDraftSelection] = React.useState<{
    active: boolean
    value: SelectPanelItem | undefined
  }>(initialDraftSelection)
  const [draftScope, setDraftScope] = React.useState({open, isSingleSelectModal})
  if (draftScope.open !== open || draftScope.isSingleSelectModal !== isSingleSelectModal) {
    setDraftScope({open, isSingleSelectModal})
    setDraftSelection(initialDraftSelection())
  }
  const itemNodes = React.useRef(new Map<SelectPanelItem, HTMLElement>())
  const inputRef = React.useRef<HTMLInputElement | null>(null)
  const focusFilter = React.useCallback(() => {
    if (!inputRef.current) return true
    inputRef.current.focus({preventScroll: true})
    return false
  }, [])
  const internalAnchorRef = React.useRef<HTMLElement | null>(null)
  const lastAnchorRef = React.useRef<HTMLElement | null>(null)
  const contentElementRef = React.useRef<HTMLDivElement | null>(null)
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
    const content = contentElementRef.current
    if (lastCloseGestureRef.current === 'click-outside' && !content?.contains(content.ownerDocument.activeElement)) {
      return false
    }
    const anchor = anchorRef?.current ?? internalAnchorRef.current ?? lastAnchorRef.current
    if (anchor && overflowAnchor?.items.includes(anchor)) return overflowAnchor.triggerRef.current ?? true
    return anchor?.isConnected ? anchor : true
  }, [anchorRef, overflowAnchor])
  const previousActiveItem = React.useRef<HTMLElement | undefined>(undefined)
  const scrollableElementRef = React.useRef<HTMLDivElement | null>(null)
  const scrollToVirtualIndex = React.useRef<((index: number) => void) | null>(null)
  const [virtualHighlightedIndex, setVirtualHighlightedIndex] = React.useState<number | null>(null)
  const pendingVirtualHighlight = React.useRef<{
    directlyActivated: boolean
    item: SelectPanelItem
    previous: HTMLElement | undefined
  } | null>(null)
  const titleId = React.useId()
  const subtitleId = React.useId()
  const requiredId = React.useId()
  const formControlContext = useFormControlContext()
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
  const selectedItems = React.useMemo(
    () => (isMultiSelection(selected) ? [...selected] : selected ? [selected] : []),
    [selected],
  )
  const itemsAreEmpty = items.length === 0
  const filterIsEmpty = filterValue.length === 0
  const [sortState, setSortState] = React.useState(() => ({
    filterIsEmpty,
    itemsAreEmpty,
    open,
    selected: selectedItems,
  }))
  if (
    sortState.open !== open ||
    sortState.itemsAreEmpty !== itemsAreEmpty ||
    sortState.filterIsEmpty !== filterIsEmpty
  ) {
    const shouldResetSelection =
      sortState.open !== open ||
      (sortState.itemsAreEmpty && !itemsAreEmpty) ||
      (!sortState.filterIsEmpty && filterIsEmpty)
    setSortState({
      filterIsEmpty,
      itemsAreEmpty,
      open,
      selected: shouldResetSelection ? selectedItems : sortState.selected,
    })
  }
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
  const orderSelectedAtTop = useFeatureFlag('primer_react_select_panel_order_selected_at_top')
  const useMobileDialog = variant === 'anchored' && fullscreenOnNarrow && !disableFullscreenOnNarrow && isNarrowViewport
  const isDialog = variant === 'modal' || useMobileDialog
  const showFullscreenCancelSave = useMobileDialog && multiple && Boolean(onCancel)
  const isRadio = isSingleSelectModal
  useDocumentScrollLock(isDialog && open)
  const usesExternalFiltering = controlledFilterValue !== undefined || onFilterChange !== undefined
  const visibleItems = React.useMemo(() => {
    const normalizedFilter = filterValue.trim().toLocaleLowerCase()
    const filtered =
      !usesExternalFiltering && normalizedFilter
        ? items.filter(item => getItemLabel(item).toLocaleLowerCase().includes(normalizedFilter))
        : [...items]

    if (!orderSelectedAtTop || !showSelectedOptionsFirst) return filtered

    return filtered.toSorted((first, second) => {
      const firstSelected = sortState.selected.some(selectedItem => areItemsEqual(selectedItem, first))
      const secondSelected = sortState.selected.some(selectedItem => areItemsEqual(selectedItem, second))
      if (firstSelected === secondSelected) return 0
      return firstSelected ? -1 : 1
    })
  }, [filterValue, items, orderSelectedAtTop, showSelectedOptionsFirst, sortState.selected, usesExternalFiltering])
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
      if (!isControlled) setUncontrolledOpen(nextOpen)
      onOpenChange?.(nextOpen, gesture)
    },
    [isControlled, onOpenChange],
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

  const onVirtualItemMount = React.useCallback(
    (item: SelectPanelItem, node: HTMLElement) => {
      const pending = pendingVirtualHighlight.current
      if (!pending || !areItemsEqual(pending.item, item)) return
      pendingVirtualHighlight.current = null
      onActiveDescendantChanged?.(node, pending.previous, pending.directlyActivated)
      previousActiveItem.current = node
    },
    [onActiveDescendantChanged],
  )
  const registerVirtualScroll = React.useCallback((scrollToIndex: ((index: number) => void) | null) => {
    scrollToVirtualIndex.current = scrollToIndex
  }, [])
  const registerScrollElement = React.useCallback((node: HTMLDivElement | null) => {
    scrollableElementRef.current = node
  }, [])
  const scrollActiveOption = React.useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.nativeEvent.isComposing ||
      (event.key !== 'PageDown' && event.key !== 'PageUp')
    ) {
      return false
    }

    const active = previousActiveItem.current
    const scrollElement = scrollableElementRef.current
    if (!active || !scrollElement || !scrollElement.contains(active)) return false
    const optionBounds = active.getBoundingClientRect()
    const scrollBounds = scrollElement.getBoundingClientRect()
    const viewportTop = scrollBounds.top + scrollElement.clientTop
    const viewportBottom = viewportTop + scrollElement.clientHeight
    if (
      optionBounds.height <= scrollElement.clientHeight ||
      optionBounds.bottom <= viewportTop ||
      optionBounds.top >= viewportBottom
    ) {
      return false
    }

    const remaining = event.key === 'PageDown' ? optionBounds.bottom - viewportBottom : optionBounds.top - viewportTop
    if ((event.key === 'PageDown' && remaining <= 1) || (event.key === 'PageUp' && remaining >= -1)) return false
    const step = Math.max(1, scrollElement.clientHeight / 2)
    const previousScrollTop = scrollElement.scrollTop
    scrollElement.scrollTop += Math.sign(remaining) * Math.min(step, Math.abs(remaining))
    if (scrollElement.scrollTop === previousScrollTop) return false
    event.preventDefault()
    return true
  }, [])

  const onHighlighted = React.useCallback(
    (value: SelectPanelValue | undefined, details: Combobox.Root.HighlightEventDetails) => {
      const current = value ? itemNodes.current.get(value.item) : undefined
      if (usesBuiltInVirtualization) setVirtualHighlightedIndex(value && details.index >= 0 ? details.index : null)
      if (value && usesBuiltInVirtualization && details.index >= 0) {
        pendingVirtualHighlight.current = current
          ? null
          : {directlyActivated: details.reason === 'keyboard', item: value.item, previous: previousActiveItem.current}
        if (!current || details.reason === 'keyboard') scrollToVirtualIndex.current?.(details.index)
        if (!current) return
      } else {
        pendingVirtualHighlight.current = null
      }
      onActiveDescendantChanged?.(current, previousActiveItem.current, details.reason === 'keyboard')
      previousActiveItem.current = current
    },
    [onActiveDescendantChanged, usesBuiltInVirtualization],
  )

  const requestCancel = React.useCallback(() => {
    onCancel?.()
    setPanelOpen(false, 'cancel')
  }, [onCancel, setPanelOpen])

  const saveSelection = React.useCallback(() => {
    if (isSingleSelectModal) {
      onSelectedChange(draftSelection.value)
    }
    setPanelOpen(false, useMobileDialog ? 'click-outside' : 'selection')
  }, [draftSelection.value, isSingleSelectModal, onSelectedChange, setPanelOpen, useMobileDialog])

  const onComboboxOpenChange = React.useCallback(
    (nextOpen: boolean, details: Combobox.Root.ChangeEventDetails) => {
      if (!nextOpen && details.reason === 'item-press' && !isSingleSelectModal) {
        setPanelOpen(false, 'selection')
      }
    },
    [isSingleSelectModal, setPanelOpen],
  )

  const contentRef = React.useMemo(
    () =>
      mergeRefs<HTMLDivElement>(contentElementRef, forwardedRef, node => {
        if (node && panelHeight === 'initial') {
          node.style.setProperty('--select-panel-initial-height', `${node.getBoundingClientRect().height}px`)
        }
      }),
    [forwardedRef, panelHeight],
  )

  const panelClasses = cn(
    'primer:flex primer:min-h-0 primer:flex-col',
    isDialog
      ? 'primer:[--select-panel-available-height:calc(100dvh-4rem)]'
      : 'primer:[--select-panel-available-height:var(--available-height)]',
    panelWidthClasses[panelWidth],
    panelHeightClasses[panelHeight],
    panelHeight === 'auto'
      ? 'primer:max-h-[min(37.5rem,var(--select-panel-available-height))]'
      : 'primer:max-h-[var(--select-panel-available-height)]',
    maxHeight && panelMaxHeightClasses[maxHeight],
    !isDialog && 'primer:max-w-[var(--available-width)] primer:p-0 primer:shadow-none',
    className,
    overlayClassName,
    isDialog && 'primer:max-w-[calc(100vw-var(--base-size-32))]',
    useMobileDialog &&
      'primer:[--select-panel-available-height:100dvh] primer:h-[100dvh] primer:max-h-[100dvh] primer:w-screen primer:max-w-none primer:rounded-none',
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
          <SelectPanelNavigationContext.Provider
            value={{
              highlightedIndex: virtualHighlightedIndex,
              onItemMount: onVirtualItemMount,
              registerScrollElement,
              registerScrollToIndex: registerVirtualScroll,
              scrollActiveOption,
            }}
          >
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
                showCancel={variant === 'modal' || showFullscreenCancelSave}
                showCloseButton={variant === 'modal' || (useMobileDialog && (!multiple || Boolean(onCancel)))}
                showItemDividers={showItemDividers}
                showSave={variant === 'modal' || showFullscreenCancelSave}
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
          </SelectPanelNavigationContext.Provider>
        </SelectPanelFieldBoundary>
      </FormControlValidationStatusProvider>
    </FormControlContextProvider>
  )
  const popoverContent = (
    <Popover.Positioner
      align={align}
      alignOffset={alignOffset}
      anchor={overflowAnchor ? getPositionAnchor : renderAnchor === null ? anchorRef : undefined}
      className={cn('primer:z-popover', positionerClassName)}
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
        initialFocus={focusFilter}
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
              <span className="primer:sr-only" id={requiredId}>
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
          <Dialog.Viewport className={cn(useMobileDialog && 'primer:p-0', positionerClassName)}>
            <Dialog.Popup
              {...overlayDomProps}
              aria-describedby={subtitle ? subtitleId : undefined}
              aria-labelledby={titleId}
              className={panelClasses}
              finalFocus={overflowAnchor ? getFinalFocus : (anchorRef ?? true)}
              initialFocus={focusFilter}
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
            <span className="primer:sr-only" id={requiredId}>
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

// forwardRef cannot preserve the item generic. The implementation only returns caller-provided items, in the shape
// selected by `selectionVariant` or an array `selected` value.
const SelectPanelConfig = SelectPanelImplementation as SelectPanelComponent

export const SelectPanel = Object.assign(SelectPanelConfig, {
  Message: SelectPanelMessageComponent,
  SecondaryActionButton: SelectPanelSecondaryActionButton,
  SecondaryActionLink: SelectPanelSecondaryActionLink,
})

SelectPanel.displayName = 'SelectPanel'
markFormControlInput(SelectPanel, {baseUiAccessibleLabel: true})
