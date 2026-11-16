'use client'

import {KebabHorizontalIcon} from '@primer/octicons-react'
import React from 'react'
import {flattenChildren} from '../../internal/children'
import {cn} from '../../internal/cn'
import {getFocusableChild, isAvailableFocusTarget} from '../../internal/getFocusableChild'
import {mergeRefs} from '../../internal/refs'
import {useIsomorphicLayoutEffect} from '../../internal/useIsomorphicLayoutEffect'
import type {BroadAsProps, PolymorphicPropsWithDefaultRef} from '../../utils/types/component'
import {ActionMenu} from '../ActionMenu'
import {getIconButtonClassName} from '../IconButton/iconButtonClassName'

export interface BreadcrumbsProps extends React.ComponentPropsWithoutRef<'nav'> {
  /** How the trail behaves when it is too wide: wrap onto another line, or collapse the middle into a menu. */
  overflow?: 'wrap' | 'menu' | 'menu-with-root'
  /** Use `spacious` to increase the spacing between items. */
  variant?: 'normal' | 'spacious'
}

interface OverflowResult {
  menuItemCount: number
  hideRoot: boolean
}

interface FocusRequest {
  source: Element
  target: 'trigger' | 'menu' | 'visible'
  itemIndex?: number
}

interface LastFocused {
  element: Element
  overflowControl: boolean
}

const NARROW_BREAKPOINT = 544
const SEPARATOR_WIDTH = 16
const MENU_BUTTON_FALLBACK_WIDTH = 28
// Storybook can use React 18, which drops the JSX inert attribute.
const supportsInertProp = Number.parseInt(React.version, 10) >= 19

function setMeasurementInert(element: HTMLOListElement | null) {
  if (element) element.inert = true
}

// Mirrors Primer React's collapse rules so both packages fold the same items
// at the same widths.
function calculateOverflow(
  widths: number[],
  availableWidth: number,
  hideRoot: boolean,
  menuButtonWidth: number,
): OverflowResult {
  let effectiveHideRoot = hideRoot
  const rootWidth = widths[0] ?? 0
  let minimumVisibleItems = 4
  if (!hideRoot) minimumVisibleItems = 3
  else if (availableWidth < NARROW_BREAKPOINT && widths.length > 2) minimumVisibleItems = 1

  const measure = (items: number[]) => {
    const total = items.reduce((sum, width) => sum + width + SEPARATOR_WIDTH, 0)
    return effectiveHideRoot ? total : rootWidth + total
  }

  let visible = widths
  let menuItemCount = 0
  let total = measure(visible)
  while (visible.length > 1 && (total > availableWidth || visible.length > minimumVisibleItems)) {
    menuItemCount += 1
    visible = visible.slice(1)
    total = measure(visible) + menuButtonWidth
    if (visible.length === 1 && total > availableWidth) {
      effectiveHideRoot = true
      break
    }
    effectiveHideRoot = hideRoot
  }
  return {menuItemCount, hideRoot: effectiveHideRoot}
}

function useOverflow(
  ref: React.RefObject<HTMLElement | null>,
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  menuRef: React.RefObject<HTMLDivElement | null>,
  lastFocused: React.RefObject<LastFocused | null>,
  pendingFocusRef: React.RefObject<FocusRequest | null>,
  children: React.ReactNode,
  enabled: boolean,
  hideRoot: boolean,
  measureLiveLeaf: boolean,
  recoverRemovedFocus: boolean,
): OverflowResult {
  const [result, setResult] = React.useState<OverflowResult>({menuItemCount: 0, hideRoot})

  useIsomorphicLayoutEffect(() => {
    const last = lastFocused.current
    const source = last?.element
    const request: FocusRequest | null =
      pendingFocusRef.current ??
      ((recoverRemovedFocus || last?.overflowControl) &&
      source &&
      !source.isConnected &&
      source.ownerDocument.activeElement === source.ownerDocument.body
        ? {source, target: 'visible'}
        : null)
    pendingFocusRef.current = null
    if (
      !request ||
      request.source.isConnected ||
      request.source.ownerDocument.activeElement !== request.source.ownerDocument.body
    ) {
      return
    }

    const list = ref.current?.querySelector<HTMLOListElement>('[data-breadcrumb-visible]') ?? null
    if (request.target === 'trigger') {
      triggerRef.current?.focus({preventScroll: true})
    } else if (request.target === 'menu') {
      const remaining = menuRef.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]:not([data-disabled])') ?? []
      const target = Array.from(remaining).reverse().find(isAvailableFocusTarget) ?? menuRef.current
      target?.focus({preventScroll: true})
    } else {
      const item =
        request.itemIndex === undefined
          ? null
          : (list?.querySelector<HTMLElement>(`[data-breadcrumb-index="${request.itemIndex}"]`) ?? null)
      ;(getFocusableChild(item) ?? getFocusableChild(list))?.focus({preventScroll: true})
    }
  }, [children, lastFocused, menuRef, pendingFocusRef, recoverRemovedFocus, ref, result, triggerRef])

  React.useEffect(() => {
    if (!enabled || !ref.current || typeof window === 'undefined') return
    const container = ref.current
    const items = Array.from(container.querySelectorAll<HTMLElement>('[data-breadcrumb-measurement] > li'))
    const liveLeaf = measureLiveLeaf ? container.querySelector<HTMLElement>('[data-breadcrumb-live-leaf]') : null
    const menuButton = triggerRef.current
    if (measureLiveLeaf && !liveLeaf) return
    if (liveLeaf) items.push(liveLeaf)
    const update = () => {
      if (items.length === 0 || container.clientWidth === 0) return
      const next = calculateOverflow(
        items.map(item => item.offsetWidth),
        container.clientWidth,
        hideRoot,
        menuButton?.offsetWidth || MENU_BUTTON_FALLBACK_WIDTH,
      )
      if (result.menuItemCount === next.menuItemCount && result.hideRoot === next.hideRoot) return

      const active = container.ownerDocument.activeElement
      const visibleList = container.querySelector<HTMLOListElement>('[data-breadcrumb-visible]')
      const visibleItem = Array.from(visibleList?.children ?? []).find(item => item.contains(active))
      const visibleIndex = visibleItem?.getAttribute('data-breadcrumb-index')
      const menuItem = menuRef.current?.contains(active) ? active?.closest('[data-breadcrumb-index]') : null
      const menuIndex = menuItem?.getAttribute('data-breadcrumb-index')
      const menuCount = Math.max(0, next.menuItemCount - (next.hideRoot ? 0 : 1))
      const isInNextMenu = (index: number) => index < next.menuItemCount && (index !== 0 || next.hideRoot)

      pendingFocusRef.current = null
      if (active && visibleIndex !== null && visibleIndex !== undefined && isInNextMenu(Number(visibleIndex))) {
        pendingFocusRef.current = {source: active, target: 'trigger'}
      } else if (active && menuIndex !== null && menuIndex !== undefined && !isInNextMenu(Number(menuIndex))) {
        pendingFocusRef.current = {
          source: active,
          target: menuCount > 0 ? 'menu' : 'visible',
          itemIndex: Number(menuIndex),
        }
      } else if (active && menuCount === 0 && (triggerRef.current === active || menuRef.current?.contains(active))) {
        pendingFocusRef.current = {source: active, target: 'visible'}
      }

      setResult(next)
    }
    update()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update)
    observer.observe(container)
    for (const item of items) observer.observe(item)
    if (menuButton) observer.observe(menuButton)
    return () => observer.disconnect()
  }, [children, enabled, hideRoot, measureLiveLeaf, menuRef, pendingFocusRef, ref, result, triggerRef])
  return enabled ? result : {menuItemCount: 0, hideRoot}
}

function Separator({compact = false}: {compact?: boolean}) {
  if (compact) {
    return (
      <span
        aria-hidden="true"
        // One `transform` (not `rotate-*`/`translate-*`) so the offset follows the rotated axis, as upstream does.
        className="primer:mx-[0.5em] primer:inline-block primer:h-[0.8em] primer:transform-[rotate(15deg)_translateY(0.0625em)] primer:border-r-[0.1em] primer:border-r-[color:var(--fgColor-muted)]"
      />
    )
  }

  return (
    <span
      aria-hidden="true"
      className="primer:inline-flex primer:size-4 primer:shrink-0 primer:items-center primer:justify-center primer:text-muted"
    >
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.956 1.27994L6.06418 14.7201L5 14.7201L9.89181 1.27994L10.956 1.27994Z" fill="currentColor" />
      </svg>
    </span>
  )
}

const BreadcrumbsRoot = React.forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  {children, className, onBlurCapture, onFocusCapture, overflow = 'wrap', variant = 'normal', ...rest},
  forwardedRef,
) {
  const localRef = React.useRef<HTMLElement | null>(null)
  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const menuRef = React.useRef<HTMLDivElement | null>(null)
  const lastFocused = React.useRef<LastFocused | null>(null)
  const pendingFocusRef = React.useRef<FocusRequest | null>(null)
  const childrenArray = flattenChildren(children).filter(React.isValidElement)
  const hideRoot = overflow !== 'menu-with-root'
  const measureLiveLeaf = childrenArray.length > 0
  const overflowState = useOverflow(
    localRef,
    triggerRef,
    menuRef,
    lastFocused,
    pendingFocusRef,
    children,
    overflow !== 'wrap' && childrenArray.length > 1,
    hideRoot,
    measureLiveLeaf,
    overflow !== 'wrap',
  )
  const menuItemCount = Math.min(overflowState.menuItemCount, childrenArray.length - (measureLiveLeaf ? 1 : 0))
  const collapsed = childrenArray.slice(0, menuItemCount)
  const menuItems = overflowState.hideRoot ? collapsed : collapsed.slice(1)
  const visible = childrenArray.slice(menuItemCount)
  const showRoot = menuItemCount > 0 && !overflowState.hideRoot
  const displayItems = showRoot ? [childrenArray[0], ...visible] : visible
  // Until items collapse, menu modes share the wrap layout and compact separator.
  const compact = overflow === 'wrap' || menuItemCount === 0
  const renderedItems = displayItems.map((item, index) => {
    const isLiveLeaf = measureLiveLeaf && index === displayItems.length - 1
    return (
      <li
        key={`item:${item.key ?? index}`}
        data-breadcrumb-index={childrenArray.indexOf(item)}
        data-breadcrumb-live-leaf={isLiveLeaf ? '' : undefined}
        className={cn(
          'primer:min-w-0 primer:list-none',
          compact && 'primer:text-[length:var(--text-body-size-medium)]',
          overflow === 'wrap' && 'primer:wrap-anywhere',
          overflow !== 'wrap' && isLiveLeaf
            ? 'primer:flex primer:shrink primer:flex-wrap primer:items-center primer:whitespace-normal primer:wrap-anywhere'
            : compact
              ? 'primer:inline-block'
              : 'primer:inline-grid primer:shrink-0 primer:auto-cols-max primer:grid-flow-col primer:items-center primer:whitespace-nowrap',
        )}
      >
        {item}
        {index < displayItems.length - 1 ? <Separator compact={compact} /> : null}
      </li>
    )
  })
  const menu =
    menuItems.length > 0 ? (
      <li key="overflow-menu" className="primer:flex primer:shrink-0 primer:items-center">
        <ActionMenu>
          <ActionMenu.Trigger
            ref={triggerRef}
            aria-label={`${menuItems.length} more breadcrumb items`}
            className={cn(
              getIconButtonClassName({size: 'small'}),
              'primer:min-h-0 primer:border-0 primer:bg-transparent primer:hover:bg-muted',
            )}
          >
            <KebabHorizontalIcon aria-hidden="true" />
          </ActionMenu.Trigger>
          <ActionMenu.Content
            ref={menuRef}
            className="primer:overflow-hidden primer:rounded-lg primer:px-2 primer:py-1.5 primer:shadow-floating-sm"
          >
            {menuItems.map((item, index) => (
              <ActionMenu.Item
                key={item.key ?? index}
                data-breadcrumb-index={index + (overflowState.hideRoot ? 0 : 1)}
                render={item}
                className="primer:leading-5"
              />
            ))}
          </ActionMenu.Content>
        </ActionMenu>
        <Separator />
      </li>
    ) : null
  const listItems = menu
    ? showRoot
      ? [renderedItems[0], menu, ...renderedItems.slice(1)]
      : [menu, ...renderedItems]
    : renderedItems
  const ref = mergeRefs(localRef, forwardedRef)

  return (
    <nav
      {...rest}
      ref={ref}
      aria-label={rest['aria-label'] ?? 'Breadcrumbs'}
      className={cn('primer:group primer:flex primer:min-w-0 primer:w-full primer:justify-between', className)}
      data-component="Breadcrumbs"
      data-overflow={overflow}
      data-variant={variant}
      onBlurCapture={event => {
        const next = event.relatedTarget
        if (!next || (!event.currentTarget.contains(next) && !menuRef.current?.contains(next))) {
          lastFocused.current = null
          if (event.target.isConnected) pendingFocusRef.current = null
        }
        onBlurCapture?.(event)
      }}
      onFocusCapture={event => {
        if (pendingFocusRef.current?.source !== event.target) pendingFocusRef.current = null
        lastFocused.current = {
          element: event.target,
          overflowControl: event.target === triggerRef.current || Boolean(menuRef.current?.contains(event.target)),
        }
        onFocusCapture?.(event)
      }}
    >
      {overflow !== 'wrap' && childrenArray.length > 1 ? (
        <ol
          aria-hidden="true"
          inert={supportsInertProp || undefined}
          ref={setMeasurementInert}
          className="primer:flex primer:list-none primer:items-center primer:whitespace-nowrap primer:p-0"
          data-breadcrumb-measurement=""
          style={{overflow: 'hidden', pointerEvents: 'none', position: 'absolute', visibility: 'hidden', width: 0}}
        >
          {childrenArray.slice(0, -1).map((item, index) => (
            <li
              key={item.key ?? index}
              className="primer:inline-block primer:min-w-0 primer:shrink-0 primer:text-[length:var(--text-body-size-medium)]"
            >
              {item}
              {index < childrenArray.length - 1 ? <Separator compact /> : null}
            </li>
          ))}
        </ol>
      ) : null}
      <ol
        data-breadcrumb-visible=""
        className={cn(
          'primer:m-0 primer:flex primer:w-full primer:min-w-0 primer:list-none primer:flex-wrap primer:p-0',
          overflow !== 'wrap' && 'primer:whitespace-nowrap',
        )}
      >
        {listItems}
      </ol>
    </nav>
  )
})

interface BreadcrumbsItemOwnProps {
  /** Element to render. Use a non-anchor element for an item that does not link anywhere. */
  as?: React.ElementType
  /** Marks the item as the current page, which is announced to assistive technology. */
  selected?: boolean
}

export type BreadcrumbsItemProps<As extends React.ElementType = never> = PolymorphicPropsWithDefaultRef<
  As,
  BreadcrumbsItemOwnProps,
  'a',
  HTMLElement
>

const BreadcrumbsItemRoot = React.forwardRef<
  HTMLElement,
  BreadcrumbsItemOwnProps & React.AnchorHTMLAttributes<HTMLAnchorElement>
>(function BreadcrumbsItem({as: Component = 'a', className, selected, ...rest}, ref) {
  return (
    <Component
      {...rest}
      ref={ref}
      aria-current={selected ? 'page' : undefined}
      className={cn(
        'primer:inline-block primer:min-h-[max(28px,var(--control-small-size,28px))] primer:min-w-[max(28px,var(--control-small-size,28px))] primer:py-1 primer:text-[length:var(--text-body-size-medium)] primer:leading-[var(--text-body-lineHeight-medium)] primer:text-accent primer:no-underline primer:focus-visible:outline-2 primer:focus-visible:outline-offset-2 primer:focus-visible:outline-focus',
        'primer:group-data-[variant=normal]:focus-visible:rounded-sm primer:group-data-[variant=normal]:focus-visible:no-underline primer:group-data-[variant=normal]:[&:not([aria-current])]:hover:underline',
        'primer:group-data-[variant=spacious]:rounded-md primer:group-data-[variant=spacious]:px-1.5 primer:group-data-[variant=spacious]:text-default primer:group-data-[variant=spacious]:hover:bg-[var(--control-transparent-bgColor-hover)]',
        selected && 'primer:text-default primer:group-data-[variant=spacious]:font-semibold',
        className,
      )}
      data-component="Breadcrumbs.Item"
    />
  )
})

BreadcrumbsRoot.displayName = 'Breadcrumbs'
BreadcrumbsItemRoot.displayName = 'Breadcrumbs.Item'
const BreadcrumbsItem = BreadcrumbsItemRoot as {
  <As extends React.ElementType>(props: BreadcrumbsItemProps<As> & {as: As}): React.ReactElement | null
  (props: BreadcrumbsItemProps<'a'>): React.ReactElement | null
  <As extends React.ElementType>(props: BroadAsProps<As, BreadcrumbsItemProps>): React.ReactElement | null
  displayName?: string
}
export const Breadcrumbs = Object.assign(BreadcrumbsRoot, {Item: BreadcrumbsItem})
