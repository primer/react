import {clsx} from 'clsx'
import React, {useEffect, useRef, useState, useCallback} from 'react'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import type {SxProp} from '../sx'
import type {ComponentProps} from '../utils/types'
import classes from './Breadcrumbs.module.css'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {toggleSxComponent} from '../internal/utils/toggleSxComponent'
import {ActionMenu, ActionList} from '../'
import {IconButton} from '../Button'
import {KebabHorizontalIcon} from '@primer/octicons-react'

interface BreadcrumbItem {
  label: string
  href?: string
  onClick?: () => void
}

export type BreadcrumbsProps = {
  className?: string
  items?: BreadcrumbItem[]
  children?: React.ReactNode
  responsive?: boolean
} & SxProp

const BreadcrumbsList = ({children}: React.PropsWithChildren) => {
  return <ol className={classes.BreadcrumbsList}>{children}</ol>
}

const BreadcrumbsItemBaseComponent = toggleSxComponent('a') as React.ComponentType<StyledBreadcrumbsItemProps>
type StyledBreadcrumbsItemProps = {
  to?: string
  selected?: boolean
  className?: string
} & SxProp &
  React.HTMLAttributes<HTMLAnchorElement> &
  React.ComponentPropsWithRef<'a'>

const BreadcrumbsItem = React.forwardRef<HTMLAnchorElement, StyledBreadcrumbsItemProps>(
  ({selected, className, ...rest}, ref) => {
    return (
      <BreadcrumbsItemBaseComponent
        className={clsx(className, classes.Item, {
          [classes.ItemSelected]: selected,
        })}
        aria-current={selected ? 'page' : undefined}
        ref={ref}
        {...rest}
      />
    )
  },
) as PolymorphicForwardRefComponent<'a', StyledBreadcrumbsItemProps>

BreadcrumbsItem.displayName = 'Breadcrumbs.Item'

export type BreadcrumbsItemProps = ComponentProps<typeof BreadcrumbsItem>

const BreadcrumbsBaseComponent = toggleSxComponent('nav') as React.ComponentType<BreadcrumbsProps>

function Breadcrumbs({className, sx: sxProp, items = [], children, responsive = false}: BreadcrumbsProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const overflowRef = useRef<HTMLLIElement>(null)
  const [visibleCount, setVisibleCount] = useState(items.length)

  // Initialize refs only once for stability
  useEffect(() => {
    itemRefs.current = new Array(items.length).fill(null)
  }, [items.length])

  const updateVisibleItems = useCallback(() => {
    const container = containerRef.current
    if (!container) return

    const containerWidth = container.offsetWidth
    const overflowWidth = overflowRef.current?.offsetWidth ?? 0
    let totalWidth = 0
    let count = items.length

    for (let i = items.length - 1; i >= 0; i--) {
      const item = itemRefs.current[i]
      if (!item) continue
      totalWidth += item.offsetWidth

      const requiredWidth = totalWidth + overflowWidth

      if (requiredWidth > containerWidth) {
        count = i
        break
      }
    }
    setVisibleCount(prev => (prev !== count ? count : prev))
  }, [items])

  useIsomorphicLayoutEffect(() => {
    if (responsive) {
      updateVisibleItems()
    }
  }, [items, responsive, updateVisibleItems])

  useEffect(() => {
    if (!responsive) return
    const resizeObserver = new ResizeObserver(() => {
      updateVisibleItems()
    })
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    updateVisibleItems() // Ensure it's triggered on mount after first paint
    return () => resizeObserver.disconnect()
  }, [responsive, updateVisibleItems])

  if (!responsive) {
    return (
      <BreadcrumbsBaseComponent
        className={clsx(className, classes.BreadcrumbsBase)}
        aria-label="Breadcrumbs"
        sx={sxProp}
      >
        <div className={classes.BreadcrumbsContainer}>
          <BreadcrumbsList>{children}</BreadcrumbsList>
        </div>
      </BreadcrumbsBaseComponent>
    )
  }

  const hiddenItems = items.slice(0, items.length - visibleCount)
  const visibleItems = items.slice(items.length - visibleCount)

  return (
    <BreadcrumbsBaseComponent className={clsx(className, classes.BreadcrumbsBase)} aria-label="Breadcrumbs" sx={sxProp}>
      <div className={classes.BreadcrumbsContainer} ref={containerRef}>
        <BreadcrumbsList>
          <li
            ref={overflowRef}
            className={clsx(
              classes.ItemWrapper,
              classes.OverflowMenu,
              hiddenItems.length === 0 && classes.OverflowHidden,
            )}
          >
            <ActionMenu>
              <ActionMenu.Anchor>
                <IconButton variant="invisible" aria-label="More breadcrumb items" icon={KebabHorizontalIcon} />
              </ActionMenu.Anchor>
              <ActionMenu.Overlay>
                <ActionList>
                  {hiddenItems.map((item, i) => (
                    <ActionList.Item as="a" href={item.href} key={i}>
                      {item.label}
                    </ActionList.Item>
                  ))}
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </li>
          {visibleItems.map((item, i) => (
            <li
              key={i + hiddenItems.length}
              className={classes.ItemWrapper}
              ref={el => {
                const index = i + hiddenItems.length
                if (itemRefs.current[index] !== el) {
                  itemRefs.current[index] = el
                }
              }}
            >
              <BreadcrumbsItem href={item.href}>{item.label}</BreadcrumbsItem>
            </li>
          ))}
        </BreadcrumbsList>
      </div>
    </BreadcrumbsBaseComponent>
  )
}

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
