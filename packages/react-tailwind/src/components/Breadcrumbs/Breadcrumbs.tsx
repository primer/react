'use client'

import {KebabHorizontalIcon} from '@primer/octicons-react'
import React from 'react'
import {flattenChildren} from '../../internal/children'
import {cn} from '../../internal/cn'
import {ActionMenu} from '../ActionMenu'

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

const NARROW_BREAKPOINT = 544
const SEPARATOR_WIDTH = 16
// Matches the small overflow trigger (`size-7`).
const MENU_BUTTON_WIDTH = 28

// Mirrors Primer React's collapse rules so both packages fold the same items
// at the same widths.
function calculateOverflow(widths: number[], availableWidth: number, hideRoot: boolean): OverflowResult {
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
  while (visible.length > 0 && (total > availableWidth || visible.length > minimumVisibleItems)) {
    menuItemCount += 1
    visible = visible.slice(1)
    total = measure(visible) + MENU_BUTTON_WIDTH
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
  count: number,
  enabled: boolean,
  hideRoot: boolean,
): OverflowResult {
  const [result, setResult] = React.useState<OverflowResult>({menuItemCount: 0, hideRoot})
  React.useEffect(() => {
    if (!enabled || !ref.current || typeof window === 'undefined') return
    const container = ref.current
    const update = () => {
      const items = Array.from(container.querySelectorAll('[data-breadcrumb-measurement] > li')) as HTMLElement[]
      if (items.length === 0 || container.clientWidth === 0) return
      const next = calculateOverflow(
        items.map(item => item.offsetWidth),
        container.clientWidth,
        hideRoot,
      )
      setResult(previous =>
        previous.menuItemCount === next.menuItemCount && previous.hideRoot === next.hideRoot ? previous : next,
      )
    }
    update()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update)
    observer.observe(container)
    return () => observer.disconnect()
  }, [count, enabled, hideRoot, ref])
  return enabled ? result : {menuItemCount: 0, hideRoot}
}

function Separator({compact = false}: {compact?: boolean}) {
  if (compact) {
    return (
      <span
        aria-hidden="true"
        className="mx-[0.5em] inline-block h-[0.8em] translate-y-[0.0625em] rotate-[15deg] border-r-[0.1em] border-r-[color:var(--fgColor-muted)] align-middle"
      />
    )
  }

  return (
    <span aria-hidden="true" className="inline-flex size-4 shrink-0 items-center justify-center text-muted">
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M10.956 1.27994L6.06418 14.7201L5 14.7201L9.89181 1.27994L10.956 1.27994Z" fill="currentColor" />
      </svg>
    </span>
  )
}

const BreadcrumbsRoot = React.forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  {children, className, overflow = 'wrap', variant = 'normal', ...rest},
  forwardedRef,
) {
  const localRef = React.useRef<HTMLElement | null>(null)
  const childrenArray = flattenChildren(children).filter(React.isValidElement)
  const hideRoot = overflow !== 'menu-with-root'
  const overflowState = useOverflow(localRef, childrenArray.length, overflow !== 'wrap', hideRoot)
  const {menuItemCount} = overflowState
  const collapsed = childrenArray.slice(0, menuItemCount)
  const menuItems = overflowState.hideRoot ? collapsed : collapsed.slice(1)
  const visible = childrenArray.slice(menuItemCount)
  const showRoot = menuItemCount > 0 && !overflowState.hideRoot
  const displayItems = showRoot ? [childrenArray[0], ...visible] : visible
  // Until items collapse, menu modes share the wrap layout and compact separator.
  const compact = overflow === 'wrap' || menuItemCount === 0
  const renderedItems = displayItems.map((item, index) => (
    <li
      key={index}
      className={cn(
        'min-w-0 list-none',
        compact
          ? 'inline-block text-[length:var(--text-body-size-medium)]'
          : 'inline-grid shrink-0 auto-cols-max grid-flow-col items-center whitespace-nowrap',
      )}
    >
      {item}
      {index < displayItems.length - 1 ? <Separator compact={compact} /> : null}
    </li>
  ))
  const preserveRootOrder = showRoot
  const ref = (node: HTMLElement | null) => {
    localRef.current = node
    if (typeof forwardedRef === 'function') forwardedRef(node)
    else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLElement | null>).current = node
  }

  return (
    <nav
      {...rest}
      ref={ref}
      aria-label={rest['aria-label'] ?? 'Breadcrumbs'}
      className={cn('group flex min-w-0 w-full justify-between', className)}
      data-component="Breadcrumbs"
      data-overflow={overflow}
      data-variant={variant}
    >
      {/*
        This list is only measured after hydration. It is visually hidden so
        it neither changes SSR output nor participates in the tab order.
      */}
      {overflow !== 'wrap' ? (
        <ol
          aria-hidden="true"
          className="pointer-events-none invisible absolute flex list-none items-center whitespace-nowrap p-0"
          data-breadcrumb-measurement=""
        >
          {childrenArray.map((item, index) => (
            <li key={index} className="inline-block min-w-0 text-[length:var(--text-body-size-medium)]">
              {item}
              {index < childrenArray.length - 1 ? <Separator compact /> : null}
            </li>
          ))}
        </ol>
      ) : null}
      <ol className={cn('m-0 list-none p-0', overflow === 'wrap' ? 'block' : 'flex flex-nowrap whitespace-nowrap')}>
        {preserveRootOrder ? renderedItems[0] : null}
        {menuItems.length ? (
          <li className="flex shrink-0 items-center">
            <ActionMenu>
              <ActionMenu.Trigger
                aria-label={`${menuItems.length} more breadcrumb items`}
                className="size-7 min-h-7 border-0 bg-transparent p-0 text-muted hover:bg-muted"
              >
                <KebabHorizontalIcon aria-hidden="true" />
              </ActionMenu.Trigger>
              <ActionMenu.Content className="overflow-hidden rounded-lg px-2 py-1.5 shadow-floating-sm">
                {menuItems.map((item, index) => (
                  <ActionMenu.Item key={index} render={item} className="leading-5" />
                ))}
              </ActionMenu.Content>
            </ActionMenu>
            <Separator />
          </li>
        ) : null}
        {preserveRootOrder ? renderedItems.slice(1) : renderedItems}
      </ol>
    </nav>
  )
})

export interface BreadcrumbsItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Element to render. Use a non-anchor element for an item that does not link anywhere. */
  as?: React.ElementType
  /** Marks the item as the current page, which is announced to assistive technology. */
  selected?: boolean
}
const BreadcrumbsItem = React.forwardRef<HTMLElement, BreadcrumbsItemProps>(function BreadcrumbsItem(
  {as: Component = 'a', className, selected, ...rest},
  ref,
) {
  return (
    <Component
      {...rest}
      ref={ref}
      aria-current={selected ? 'page' : undefined}
      className={cn(
        'inline-block text-[length:var(--text-body-size-medium)] leading-[var(--text-body-lineHeight-medium)] text-accent no-underline hover:underline group-data-[variant=spacious]:rounded-md group-data-[variant=spacious]:px-1.5 group-data-[variant=spacious]:py-1 group-data-[variant=spacious]:text-default group-data-[variant=spacious]:hover:bg-muted group-data-[variant=spacious]:hover:no-underline',
        selected && 'text-default group-data-[variant=spacious]:font-semibold',
        className,
      )}
      data-component="Breadcrumbs.Item"
    />
  )
})

BreadcrumbsRoot.displayName = 'Breadcrumbs'
BreadcrumbsItem.displayName = 'Breadcrumbs.Item'
export const Breadcrumbs = Object.assign(BreadcrumbsRoot, {Item: BreadcrumbsItem})
