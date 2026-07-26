'use client'

import {KebabHorizontalIcon} from '@primer/octicons-react'
import React from 'react'
import {cn} from '../../internal/cn'
import {ActionMenu} from '../ActionMenu'

export interface BreadcrumbsProps extends React.ComponentPropsWithoutRef<'nav'> {
  overflow?: 'wrap' | 'menu' | 'menu-with-root'
  variant?: 'normal' | 'spacious'
}

function useOverflowCount(
  ref: React.RefObject<HTMLElement | null>,
  count: number,
  enabled: boolean,
  keepRoot: boolean,
) {
  const [overflowCount, setOverflowCount] = React.useState(0)
  React.useEffect(() => {
    if (!enabled || !ref.current || typeof window === 'undefined') return
    const container = ref.current
    const update = () => {
      const items = Array.from(container.querySelectorAll('[data-breadcrumb-measurement] > li')) as HTMLElement[]
      if (items.length < 2 || container.clientWidth === 0) return

      // Include space for the overflow trigger before deciding which authored
      // items to move. Measuring a hidden duplicate keeps the calculation
      // stable as visible items are replaced by the menu.
      const menuWidth = 44
      let width = items.reduce((total, item) => total + item.offsetWidth, 0)
      let hidden = 0
      const firstRemovable = keepRoot ? 1 : 0
      const lastRemovable = items.length - 2
      const minimumVisibleItems = keepRoot ? 4 : container.clientWidth < 544 ? 1 : 4
      for (
        let index = firstRemovable;
        index <= lastRemovable &&
        (items.length - hidden > minimumVisibleItems || width + menuWidth > container.clientWidth);
        index += 1
      ) {
        width -= items[index].offsetWidth
        hidden += 1
      }

      // `menu-with-root` renders the root outside of the menu. Its collapsed
      // slice still includes that root so the existing display calculation can
      // preserve authored order.
      const next = keepRoot && hidden > 0 ? hidden + 1 : hidden
      setOverflowCount(previous => (previous === next ? previous : next))
    }
    update()
    if (typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(update)
    observer.observe(container)
    return () => observer.disconnect()
  }, [count, enabled, keepRoot, ref])
  return enabled ? overflowCount : 0
}

function Separator({compact = false}: {compact?: boolean}) {
  if (compact) {
    return (
      <span
        aria-hidden="true"
        className="mx-[0.5em] inline-block h-[0.8em] translate-y-[0.0625em] rotate-[15deg] border-r-[0.1em] border-muted align-middle"
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
  const childrenArray = React.Children.toArray(children).filter(React.isValidElement)
  const keepRoot = overflow === 'menu-with-root' && childrenArray.length > 0
  const overflowCount = useOverflowCount(localRef, childrenArray.length, overflow !== 'wrap', keepRoot)
  const collapsed = overflowCount > 0 ? childrenArray.slice(0, overflowCount) : []
  const visible = overflowCount > 0 ? childrenArray.slice(overflowCount) : childrenArray
  const menuItems = keepRoot ? collapsed.slice(1) : collapsed
  const displayItems = keepRoot && overflowCount > 0 ? [childrenArray[0], ...visible] : visible
  const renderedItems = displayItems.map((item, index) => (
    <li
      key={index}
      className={cn(
        'min-w-0 list-none',
        overflow === 'wrap'
          ? 'inline-block text-[length:var(--text-body-size-medium)]'
          : 'inline-grid shrink-0 auto-cols-max grid-flow-col items-center whitespace-nowrap',
      )}
    >
      {item}
      {index < displayItems.length - 1 ? <Separator compact={overflow === 'wrap'} /> : null}
    </li>
  ))
  const preserveRootOrder = keepRoot && menuItems.length > 0
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
            <li key={index} className="flex min-w-0 items-center">
              {item}
              {index < childrenArray.length - 1 ? <Separator /> : null}
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
  as?: React.ElementType
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
;('use client')
