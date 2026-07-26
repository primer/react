'use client'

import {Combobox} from '@base-ui/react/combobox'
import {AlertIcon, CheckIcon, SearchIcon, StopIcon, TriangleDownIcon, XIcon} from '@primer/octicons-react'
import React from 'react'
import {cn} from '../../internal/cn'
import {assignRef} from '../../internal/refs'
import type {CSSPropertiesWithCustomProperties} from '../../utils/types'
import {ActionList, ActionItemContent} from '../ActionList/ActionList'
import {Banner} from '../Banner'
import {Button, type ButtonProps} from '../Button'
import {Checkbox} from '../Checkbox'
import {Dialog} from '../Dialog'
import {useFormControlContext} from '../FormControl/useFormControlForwardedProps'
import {IconButton} from '../IconButton'
import {Announce} from '../LiveRegion'
import {Popover} from '../Popover'
import {Spinner} from '../Spinner'
import {TextInput, type TextInputProps} from '../TextInput'

const panelWidthClasses = {
  auto: 'min-w-64 w-auto',
  small: 'w-64',
  medium: 'w-80',
  large: 'w-[30rem]',
  xlarge: 'w-[40rem]',
  xxlarge: 'w-[60rem]',
} as const

const panelHeightClasses = {
  auto: 'h-auto max-h-[min(37.5rem,var(--available-height))]',
  xsmall: 'h-48',
  small: 'h-64',
  medium: 'h-80',
  large: 'h-[27rem]',
  xlarge: 'h-[37.5rem]',
  'fit-content': 'h-fit',
  initial: 'h-[var(--select-panel-initial-height)]',
} as const

const panelMaxHeightClasses = {
  xsmall: 'max-h-48',
  small: 'max-h-64',
  medium: 'max-h-80',
  large: 'max-h-[27rem]',
  xlarge: 'max-h-[37.5rem]',
} as const

let selectPanelScrollLockCount = 0
let selectPanelPreviousBodyOverflow: string | undefined

type PanelWidth = keyof typeof panelWidthClasses
type PanelHeight = keyof typeof panelHeightClasses
type PopoverPositionerProps = React.ComponentPropsWithoutRef<typeof Popover.Positioner>
type SelectPanelValue = {
  item: SelectPanelItem
  label: string
  renderKey: string
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
  onAction?: (item: SelectPanelItem, event: React.SyntheticEvent<HTMLDivElement>) => void
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
}

export interface SelectPanelOverlayProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children' | 'className' | 'style'> {
  [dataAttribute: `data-${string}`]: string | number | boolean | undefined
  alignOffset?: PopoverPositionerProps['alignOffset']
  className?: string
  collisionBoundary?: PopoverPositionerProps['collisionBoundary']
  collisionPadding?: PopoverPositionerProps['collisionPadding']
  height?: PanelHeight
  maxHeight?: Exclude<PanelHeight, 'auto' | 'initial' | 'fit-content'>
  portal?: boolean
  positionerClassName?: string
  side?: PopoverPositionerProps['side']
  sideOffset?: PopoverPositionerProps['sideOffset']
  style?: React.CSSProperties
  width?: PanelWidth
}

export interface SelectPanelAnchorProps extends Omit<React.ButtonHTMLAttributes<HTMLElement>, 'children' | 'id'> {
  children: React.ReactNode
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
  items: readonly SelectPanelItem[]
  selected: SelectPanelItem | readonly SelectPanelItem[] | undefined
  onSelectedChange: (
    selected: SelectPanelItem | SelectPanelItem[] | undefined,
    details?: Combobox.Root.ChangeEventDetails,
  ) => void
  onOpenChange?: (open: boolean, gesture: SelectPanelOpenChangeGesture) => void
  open?: boolean
  defaultOpen?: boolean
  title?: React.ReactNode
  subtitle?: React.ReactNode
  placeholder?: string
  placeholderText?: string
  inputLabel?: string
  selectionVariant?: 'single' | 'multiple'
  filterValue?: string
  defaultFilterValue?: string
  onFilterChange?: (filter: string, details: Combobox.Root.ChangeEventDetails) => void
  className?: string
  overlayProps?: SelectPanelOverlayProps
  textInputProps?: Partial<Omit<TextInputProps, 'onChange' | 'value' | 'defaultValue'>>
  'aria-label'?: string
  align?: PopoverPositionerProps['align']
  anchorId?: string
  id?: string
  loading?: boolean
  initialLoadingType?: 'spinner' | 'skeleton'
  message?: React.ReactNode | SelectPanelMessage
  notice?: SelectPanelNotice
  secondaryAction?: React.ReactElement
  showSelectAll?: boolean
  showSelectedOptionsFirst?: boolean
  showItemDividers?: boolean
  groupMetadata?: readonly SelectPanelGroupMetadata[]
  renderGroup?: SelectPanelRenderGroup
  height?: PanelHeight
  renderItem?: SelectPanelRenderItem
  virtualized?: boolean
  width?: PanelWidth
  scrollContainerRef?: React.Ref<HTMLDivElement>
  actionListProps?: SelectPanelActionListProps
  onScrollEnd?: () => void
  onActiveDescendantChanged?: (
    current: HTMLElement | undefined,
    previous: HTMLElement | undefined,
    directlyActivated: boolean,
  ) => void
  focusOutBehavior?: 'start' | 'stop' | 'wrap'
  focusPrependedElements?: boolean
  disableSelectOnHover?: boolean
  setInitialFocus?: boolean
  displayInViewport?: boolean
  disableFullscreenOnNarrow?: boolean
  cssAnchorPositioningSettings?: {
    fallbackStrategy?: 'default' | 'none' | 'opposite-side'
  }
}

type SelectPanelExternalAnchorProps = {
  anchorRef: React.RefObject<HTMLElement | null>
  renderAnchor: null
}

type SelectPanelInternalAnchorProps = {
  anchorRef?: React.RefObject<HTMLElement | null>
  renderAnchor?: (props: SelectPanelAnchorProps) => React.ReactElement
}

type SelectPanelVariantProps = {variant?: 'anchored'; onCancel?: () => void} | {variant: 'modal'; onCancel: () => void}

export type SelectPanelProps = SelectPanelBaseProps &
  (SelectPanelExternalAnchorProps | SelectPanelInternalAnchorProps) &
  SelectPanelVariantProps

export interface SelectPanelMessageProps extends SelectPanelMessage {
  className?: string
}

function areItemsEqual(first: SelectPanelItem, second: SelectPanelItem) {
  if (first.id !== undefined || second.id !== undefined) {
    return (
      first.id !== undefined &&
      second.id !== undefined &&
      typeof first.id === typeof second.id &&
      first.id === second.id
    )
  }

  return first === second
}

function isMultiSelection(selected: SelectPanelProps['selected']): selected is readonly SelectPanelItem[] {
  return Array.isArray(selected)
}

function getItemLabel(item: SelectPanelItem) {
  if (item.filterValue !== undefined) return item.filterValue
  if (typeof item.text === 'string') return item.text
  if (typeof item.children === 'string') return item.children
  return item.id === undefined ? '' : String(item.id)
}

function getRenderKey(item: SelectPanelItem, index: number) {
  if (item.id !== undefined) return `id:${typeof item.id}:${String(item.id)}`
  if (item.key !== undefined) return `key:${typeof item.key}:${String(item.key)}`
  return `item:${index}`
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

function renderVisual(visual: React.ElementType | React.ReactNode) {
  return typeof visual === 'function' ? React.createElement(visual) : visual
}

function SelectPanelMessageComponent({
  action,
  body,
  className,
  icon: Icon,
  title,
  variant = 'empty',
}: SelectPanelMessageProps) {
  const DefaultIcon = variant === 'error' ? StopIcon : variant === 'warning' ? AlertIcon : SearchIcon
  const MessageIcon = Icon ?? DefaultIcon
  const role = variant === 'error' ? 'alert' : 'status'

  return (
    <div
      className={cn('flex flex-1 flex-col items-center justify-center gap-2 px-6 py-8 text-center text-sm', className)}
      data-component="SelectPanel.Message"
      data-variant={variant}
      role={role}
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

function SelectPanelSecondaryActionButton({children, ...props}: ButtonProps) {
  return (
    <Button {...props} block data-component="SelectPanel.SecondaryActionButton">
      {children}
    </Button>
  )
}

export interface SelectPanelSecondaryActionLinkProps extends Omit<ButtonProps, 'children' | 'render' | 'nativeButton'> {
  children?: React.ReactNode
  href: string
}

function SelectPanelSecondaryActionLink({children, href, ...props}: SelectPanelSecondaryActionLinkProps) {
  return (
    <Button
      {...props}
      block
      data-component="SelectPanel.SecondaryActionLink"
      nativeButton={false}
      render={<a href={href}>{children}</a>}
      variant="invisible"
    >
      {children}
    </Button>
  )
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
  key?: React.Key
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

function renderSelectPanelOption({
  itemNodes,
  itemRenderer,
  key,
  multiple,
  optionIndex,
  optionCount,
  radio,
  showItemDividers,
  value,
  virtualized = false,
}: SelectPanelOptionProps) {
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
  const renderedContent =
    React.isValidElement<{children?: React.ReactNode}>(renderedItem) && renderedItem.type === ActionList.Item
      ? renderedItem.props.children
      : renderedItem
  const selection = inactiveText ? (
    <AlertIcon aria-hidden="true" className="size-4 shrink-0 text-attention" />
  ) : multiple ? (
    <span
      aria-hidden="true"
      className="grid size-4 shrink-0 place-items-center rounded-sm border border-[var(--control-borderColor-emphasis)] bg-default group-data-[selected]:border-[var(--control-checked-bgColor-rest)] group-data-[selected]:bg-[var(--control-checked-bgColor-rest)] group-data-[selected]:text-[var(--control-checked-fgColor-rest)]"
    >
      <Combobox.ItemIndicator>
        <CheckIcon className="size-3" />
      </Combobox.ItemIndicator>
    </span>
  ) : radio ? (
    <span
      aria-hidden="true"
      className="grid size-4 shrink-0 place-items-center rounded-full border border-[var(--control-borderColor-emphasis)] group-data-[selected]:border-[var(--control-checked-bgColor-rest)]"
    >
      <Combobox.ItemIndicator>
        <span className="size-2 rounded-full bg-[var(--control-checked-bgColor-rest)]" />
      </Combobox.ItemIndicator>
    </span>
  ) : (
    <span aria-hidden="true" className="grid size-4 shrink-0 place-items-center">
      <Combobox.ItemIndicator>
        <CheckIcon className="size-4" />
      </Combobox.ItemIndicator>
    </span>
  )

  return (
    <Combobox.Item
      {...itemProps}
      aria-posinset={optionIndex === undefined ? itemProps['aria-posinset'] : optionIndex + 1}
      aria-setsize={optionCount ?? itemProps['aria-setsize']}
      className={cn(
        'group flex w-full cursor-default items-center rounded-md px-2 py-1.5 text-left text-sm text-default outline-none data-[highlighted]:bg-neutral-muted data-[selected]:bg-accent-muted data-[disabled]:cursor-not-allowed data-[disabled]:text-disabled',
        virtualized && 'h-9 overflow-hidden whitespace-nowrap',
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
      index={optionIndex}
      key={key}
      onClick={event => {
        onAction?.(item, event)
        if (event.defaultPrevented) event.preventBaseUIHandler()
      }}
      ref={node => assignItemNode(itemNodes, item, ref, node)}
      value={value}
    >
      {renderedContent ?? (
        <ActionItemContent
          description={description}
          descriptionVariant={descriptionVariant}
          leadingVisual={leadingVisual ? renderVisual(leadingVisual) : undefined}
          selection={selection}
          supportingText={inactiveText}
          trailingVisual={trailingVisual ? renderVisual(trailingVisual) : undefined}
        >
          {children}
          {text}
        </ActionItemContent>
      )}
      {inactiveText ? <span className="sr-only">{inactiveText}</span> : null}
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
              {renderSelectPanelOption({
                itemNodes,
                itemRenderer,
                multiple,
                optionIndex: index,
                optionCount: values.length,
                radio,
                showItemDividers,
                value,
                virtualized: true,
              })}
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
                  {(value: SelectPanelValue, index: number) =>
                    renderSelectPanelOption({
                      itemNodes,
                      itemRenderer: group.renderItem ?? itemRenderer,
                      key: value.renderKey,
                      multiple,
                      optionCount: values.length,
                      optionIndex: groupOptionOffset + index,
                      radio,
                      showItemDividers,
                      value,
                    })
                  }
                </Combobox.Collection>
              </>
            )

            return (
              <Combobox.Group className="block pb-2 last:pb-0" items={group.items} key={group.groupId}>
                {(group.renderGroup ?? renderGroup)?.(groupMetadata, groupContent) ?? groupContent}
              </Combobox.Group>
            )
          }
        : (value: SelectPanelValue, index: number) =>
            renderSelectPanelOption({
              itemNodes,
              itemRenderer,
              key: value.renderKey,
              multiple,
              optionCount: values.length,
              optionIndex: index,
              radio,
              showItemDividers,
              value,
            })}
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
  const {className: inputClassName, ...inputProps} = textInputProps ?? {}

  return (
    <>
      <div className="border-b border-default p-3" data-component="SelectPanel.FilterContainer">
        <Combobox.Input
          aria-label={inputProps['aria-label'] ?? inputLabel}
          autoFocus
          data-component="SelectPanel.Filter"
          placeholder={placeholderText}
          ref={inputRef}
          render={<TextInput {...inputProps} block className={cn('w-full', inputClassName)} />}
        />
      </div>
      {multiple && showSelectAll ? (
        <div className="flex items-center gap-2 border-b border-default px-3 py-1.5 text-sm text-default">
          <Checkbox
            aria-label={selectAllLabel}
            checked={allSelected}
            indeterminate={someSelected}
            onCheckedChange={onSelectAllChange}
          />
          <span>{selectAllLabel}</span>
        </div>
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
  return (
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
            <h2 className="m-0 text-base font-semibold text-default" data-component="SelectPanel.Title" id={titleId}>
              {title}
            </h2>
            {subtitle ? (
              <p className="mt-1 text-sm text-muted" data-component="SelectPanel.Subtitle" id={subtitleId}>
                {subtitle}
              </p>
            ) : null}
          </div>
          {isDialog ? (
            <IconButton
              aria-label="Cancel and close"
              className="-mr-2 -mt-2"
              data-component="SelectPanel.CloseButton"
              icon={XIcon}
              onClick={onCancelRequest}
              variant="invisible"
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
  )
}

const SelectPanelConfig = React.forwardRef<HTMLDivElement, SelectPanelProps>(function SelectPanel(
  {
    'aria-label': ariaLabel,
    actionListProps,
    align = 'start',
    anchorId,
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
  const inlinePortalContainerRef = React.useRef<HTMLDivElement | null>(null)
  const previousActiveItem = React.useRef<HTMLElement | undefined>(undefined)
  const titleId = React.useId()
  const subtitleId = React.useId()
  const formControlContext = useFormControlContext()
  const open = controlledOpen ?? uncontrolledOpen
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
  const useMobileDialog = variant === 'anchored' && !disableFullscreenOnNarrow && isNarrowViewport
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
        renderKey: getRenderKey(item, index),
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
        renderKey: getRenderKey(item, index),
      })),
    [effectiveSelectedItems],
  )
  const {
    alignOffset,
    className: overlayClassName,
    collisionBoundary,
    collisionPadding,
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
    maxHeight && panelHeight !== 'initial' && panelMaxHeightClasses[maxHeight],
    className,
    overlayClassName,
    isDialog && 'max-w-[calc(100vw-var(--base-size-32))]',
    useMobileDialog && 'h-[100dvh] w-screen max-w-none rounded-none',
  )
  const contentStyle = overlayStyle
  const triggerLabel = selectedItems.length
    ? selectedItems.map((item, index) => (
        <React.Fragment key={getRenderKey(item, index)}>
          {index > 0 ? ', ' : null}
          {item.text ?? item.children ?? getItemLabel(item)}
        </React.Fragment>
      ))
    : (placeholder ?? panelTitle)
  const anchorElement =
    renderAnchor === null ? null : renderAnchor ? (
      renderAnchor({children: triggerLabel, id: panelAnchorId})
    ) : (
      <Button data-component="SelectPanel.Trigger" trailingVisual={<TriangleDownIcon aria-hidden="true" />}>
        {triggerLabel}
      </Button>
    )

  const panel = (
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
  )
  const popoverContent = (
    <Popover.Positioner
      align={align}
      alignOffset={alignOffset}
      anchor={renderAnchor === null ? anchorRef : undefined}
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
        data-component="SelectPanel.Content"
        finalFocus={anchorRef ?? true}
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
        onOpenChange={(nextOpen, details) => {
          if (nextOpen) {
            setPanelOpen(true, details.event.type === 'keydown' ? 'anchor-key-press' : 'anchor-click')
            return
          }

          onCancel?.()
          setPanelOpen(false, details.reason === 'escape-key' ? 'escape' : 'click-outside')
        }}
      >
        {anchorElement ? (
          <Dialog.Trigger
            id={panelAnchorId}
            nativeButton={!isLinkAnchor(anchorElement)}
            ref={anchorRef}
            render={anchorElement}
          />
        ) : null}
        {open ? (
          <Dialog.Content
            {...overlayDomProps}
            aria-describedby={subtitle ? subtitleId : undefined}
            aria-labelledby={titleId}
            className={panelClasses}
            finalFocus={anchorRef ?? true}
            initialFocus={inputRef}
            portal={portal}
            ref={contentRef}
            style={contentStyle}
            viewportClassName={cn(useMobileDialog && 'p-0', positionerClassName)}
          >
            {panel}
          </Dialog.Content>
        ) : null}
      </Dialog.Root>
    )
  }

  return (
    <Popover.Root
      open={open}
      onOpenChange={(nextOpen, details) => {
        const gesture =
          details.reason === 'escape-key'
            ? 'escape'
            : details.reason === 'outside-press'
              ? 'click-outside'
              : details.reason === 'trigger-press' && details.event.type === 'keydown'
                ? 'anchor-key-press'
                : 'anchor-click'
        setPanelOpen(nextOpen, gesture)
      }}
    >
      {anchorElement ? (
        <Popover.Trigger
          id={panelAnchorId}
          nativeButton={!isLinkAnchor(anchorElement)}
          ref={anchorRef}
          render={anchorElement}
        />
      ) : null}
      {!portal ? <div className="contents" ref={inlinePortalContainerRef} /> : null}
      {open ? (
        <Popover.Portal container={portal ? undefined : inlinePortalContainerRef}>{popoverContent}</Popover.Portal>
      ) : null}
    </Popover.Root>
  )
})

export const SelectPanel = Object.assign(SelectPanelConfig, {
  Message: SelectPanelMessageComponent,
  SecondaryActionButton: SelectPanelSecondaryActionButton,
  SecondaryActionLink: SelectPanelSecondaryActionLink,
})

SelectPanel.displayName = 'SelectPanel'
;('use client')
