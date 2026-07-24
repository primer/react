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
      const menuWidth = 48
      let width = items.reduce((total, item) => total + item.offsetWidth, 0)
      let hidden = 0
      const firstRemovable = keepRoot ? 1 : 0
      const lastRemovable = items.length - 2
      for (
        let index = firstRemovable;
        index <= lastRemovable && width + menuWidth > container.clientWidth;
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

function Separator() {
  return (
    <span aria-hidden="true" className="mx-2 text-muted">
      /
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
      className={cn('min-w-0', variant === 'spacious' && 'py-2', className)}
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
      <ol className="m-0 flex list-none flex-wrap items-center p-0">
        {menuItems.length ? (
          <li className="flex items-center">
            <ActionMenu>
              <ActionMenu.Trigger aria-label={`${menuItems.length} more breadcrumb items`} className="size-8 px-0">
                <KebabHorizontalIcon aria-hidden="true" />
              </ActionMenu.Trigger>
              <ActionMenu.Content portal={false}>
                {menuItems.map((item, index) => (
                  <ActionMenu.Item key={index}>{item}</ActionMenu.Item>
                ))}
              </ActionMenu.Content>
            </ActionMenu>
            <Separator />
          </li>
        ) : null}
        {displayItems.map((item, index) => (
          <li key={index} className="flex min-w-0 items-center">
            {item}
            {index < displayItems.length - 1 ? <Separator /> : null}
          </li>
        ))}
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
        'truncate text-sm text-accent no-underline hover:underline',
        selected && 'font-medium text-default',
        className,
      )}
      data-component="Breadcrumbs.Item"
    />
  )
})

BreadcrumbsRoot.displayName = 'Breadcrumbs'
BreadcrumbsItem.displayName = 'Breadcrumbs.Item'
export const Breadcrumbs = Object.assign(BreadcrumbsRoot, {Item: BreadcrumbsItem})
