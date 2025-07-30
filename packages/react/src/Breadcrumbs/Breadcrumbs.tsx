import {clsx} from 'clsx'
import type {To} from 'history'
import React, {useEffect, useRef, type ElementRef} from 'react'
import type {SxProp} from '../sx'
import type {ComponentProps} from '../utils/types'
import classes from './Breadcrumbs.module.css'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'

const SELECTED_CLASS = 'selected'

export type BreadcrumbsProps = React.PropsWithChildren<
  {
    className?: string
    overflow?: boolean
  } & SxProp
>

function useResizeObserver(ref: React.RefObject<HTMLElement>, onResize: ResizeObserverCallback) {
  const savedCallback = useRef(onResize)

  useIsomorphicLayoutEffect(() => {
    savedCallback.current = onResize
  })

  useEffect(() => {
    const {current: element} = ref
    if (!element) {
      return
    }

    let raf: number | null = null

    const observer = new ResizeObserver((entries, observer: ResizeObserver) => {
      if (entries.length === 0) {
        return
      }

      if (raf !== null) {
        window.cancelAnimationFrame(raf)
      }

      raf = window.requestAnimationFrame(() => {
        savedCallback.current(entries, observer)
        raf = null
      })
    })

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [ref])
}

const BreadcrumbsList = ({children, ...rest}: React.ComponentPropsWithoutRef<'ol'>) => {
  const ref = useRef<ElementRef<'ol'>>(null)

  useResizeObserver(ref, () => {
    const {current: container} = ref
    if (!container) {
      return
    }

    const items = Array.from(container!.children)
    const containerRect = container!.getBoundingClientRect()
    let availableWidth = containerRect.width
    let totalItemWidth = 0
    const visible = []
    const overflow = []
    let hasOverflow = false

    for (let i = 0; i < items.length; i++) {
      const item = items[i] as HTMLElement

      if (item.style.display === 'none') {
        item.style.removeProperty('display')
      }

      const itemRect = item.getBoundingClientRect()

      if (totalItemWidth + itemRect.width <= availableWidth) {
        totalItemWidth += itemRect.width
        item.style.removeProperty('display')
        item.style.removeProperty('visibility')
      } else {
        item.style.display = 'none'
        item.style.visibility = 'hidden'
      }
    }
  })

  return (
    <ol {...rest} ref={ref} className={classes.BreadcrumbsList}>
      {children}
    </ol>
  )
}

function Breadcrumbs({className, children, overflow, sx: sxProp}: BreadcrumbsProps) {
  const wrappedChildren = React.Children.map(children, child => <li className={classes.ItemWrapper}>{child}</li>)
  return (
    <BoxWithFallback as="nav" className={clsx(className, classes.BreadcrumbsBase)} aria-label="Breadcrumbs" sx={sxProp}>
      <BreadcrumbsList data-overflow={overflow ? '' : undefined}>{wrappedChildren}</BreadcrumbsList>
    </BoxWithFallback>
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
  return (
    <BoxWithFallback
      as="a"
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
