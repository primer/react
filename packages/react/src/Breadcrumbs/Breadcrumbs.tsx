import {clsx} from 'clsx'
import type {To} from 'history'
import React, {useCallback, useRef, useState} from 'react'
import type {SxProp} from '../sx'
import type {ComponentProps} from '../utils/types'
import classes from './Breadcrumbs.module.css'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {toggleSxComponent} from '../internal/utils/toggleSxComponent'
import {ActionMenu, ActionList} from '../'
import {useResizeObserver} from '../hooks/useResizeObserver'

const SELECTED_CLASS = 'selected'
const MIN_VISIBLE_ITEMS = 1

export type BreadcrumbsProps = React.PropsWithChildren<
  {
    className?: string
  } & SxProp
>

const BreadcrumbsList = ({children}: React.PropsWithChildren) => {
  return <ol className={classes.BreadcrumbsList}>{children}</ol>
}

function Breadcrumbs({className, children, sx: sxProp}: BreadcrumbsProps) {
  const containerRef = useRef<HTMLElement>(null)
  const [visibleItems, setVisibleItems] = useState(React.Children.count(children))

  const updateOverflow = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const items = Array.from(container.querySelectorAll(`.${classes.ItemWrapper}`))
    let totalWidth = 0
    let visibleCount = 0

    // Calculate visible items starting from the first item, excluding the last item
    for (let i = 0; i < items.length - 1; i++) {
      totalWidth += items[i].getBoundingClientRect().width
      if (totalWidth + items[items.length - 1].getBoundingClientRect().width > container.offsetWidth) break
      visibleCount++
    }

    // Ensure the last item is always visible outside the menu
    visibleCount = Math.min(visibleCount + 1, items.length)

    setVisibleItems(Math.max(MIN_VISIBLE_ITEMS, visibleCount))
  }, [])

  useResizeObserver(updateOverflow, containerRef)

  const wrappedChildren = React.Children.toArray(children).map((child, index) => (
    <li className={classes.ItemWrapper} key={index} style={{display: index < visibleItems ? 'block' : 'none'}}>
      {child}
    </li>
  ))

  const overflowItems = React.Children.toArray(children).slice(visibleItems)

  // const wrappedChildren = React.Children.map(children, child => <li className={classes.ItemWrapper}>{child}</li>)
  const BreadcrumbsBaseComponent = toggleSxComponent('nav') as React.ComponentType<BreadcrumbsProps>

  return (
    <BreadcrumbsBaseComponent
      ref={containerRef}
      className={clsx(className, classes.BreadcrumbsBase)}
      aria-label="Breadcrumbs"
      sx={sxProp}
    >
      <BreadcrumbsList>
        {overflowItems.length > 0 && (
          <li className={classes.ItemWrapper}>
            <ActionMenu>
              <ActionMenu.Button>...</ActionMenu.Button>
              <ActionMenu.Overlay>
                <ActionList>
                  {overflowItems.map((item, index) => (
                    <ActionList.Item key={index}>{item}</ActionList.Item>
                  ))}
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </li>
        )}
        {wrappedChildren}
      </BreadcrumbsList>
    </BreadcrumbsBaseComponent>
  )
}

type StyledBreadcrumbsItemProps = {
  to?: To
  selected?: boolean
  className?: string
} & SxProp &
  React.HTMLAttributes<HTMLAnchorElement> &
  React.ComponentPropsWithRef<'a'>

const BreadcrumbsItem = React.forwardRef(({selected, className, ...rest}, ref) => {
  const BaseComponent = toggleSxComponent('a') as React.ComponentType<StyledBreadcrumbsItemProps>
  return (
    <BaseComponent
      className={clsx(className, classes.Item, {
        [SELECTED_CLASS]: selected,
        [classes.ItemSelected]: selected,
      })}
      aria-current={selected ? 'page' : undefined}
      ref={ref}
      {...rest}
    />
  )
}) as PolymorphicForwardRefComponent<'a', StyledBreadcrumbsItemProps>

Breadcrumbs.displayName = 'Breadcrumbs'

BreadcrumbsItem.displayName = 'Breadcrumbs.Item'

export type BreadcrumbsItemProps = ComponentProps<typeof BreadcrumbsItem>
export default Object.assign(Breadcrumbs, {Item: BreadcrumbsItem})

/**
 * @deprecated Use the `Breadcrumbs` component instead (i.e. `<Breadcrumb>` → `<Breadcrumbs>`)
 */
export const Breadcrumb = Object.assign(Breadcrumbs, {Item: BreadcrumbsItem})

/**
 * @deprecated Use the `BreadcrumbsProps` type instead
 */
export type BreadcrumbProps = BreadcrumbsProps

/**
 * @deprecated Use the `BreadcrumbsItemProps` type instead
 */
export type BreadcrumbItemProps = ComponentProps<typeof BreadcrumbsItem>
