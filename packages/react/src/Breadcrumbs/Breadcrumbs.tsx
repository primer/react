import {clsx} from 'clsx'
import type {To} from 'history'
import React, {useEffect} from 'react'
import type {SxProp} from '../sx'
import type {ComponentProps} from '../utils/types'
import classes from './Breadcrumbs.module.css'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {KebabHorizontalIcon} from '@primer/octicons-react'
import {DynamicList, DynamicListItem, DynamicListTrigger} from '../DynamicList'
import {IconButton} from '../Button'
import {useAnchoredPosition} from '../hooks'
import type {DynamicListElement} from '@primer/dynamic-list-element'

const SELECTED_CLASS = 'selected'

export type BreadcrumbsProps = React.PropsWithChildren<
  {
    className?: string
    hideRoot?: boolean
  } & SxProp
>

function Breadcrumbs({className, children, hideRoot, sx: sxProp}: BreadcrumbsProps) {
  const wrappedChildren = React.Children.map(children, child => (
    <DynamicListItem className={classes.DynamicListItem} role="listitem">
      {child}
    </DynamicListItem>
  ))

  const [popover, setPopover] = React.useState<HTMLElement | null>(null)
  const dynamicListRef = React.useRef<DynamicListElement>(null)
  const anchorRef = React.useRef<HTMLDivElement>(null)
  const floatingRef = React.useRef<HTMLElement | null>(null)
  const {position} = useAnchoredPosition(
    {
      anchorElementRef: anchorRef,
      floatingElementRef: floatingRef,
      side: 'outside-bottom',
      align: 'start',
    },
    [popover],
  )

  useEffect(() => {
    const {current: dynamicList} = dynamicListRef
    if (!dynamicList) {
      return
    }
    const popover = dynamicList.getPopover()
    floatingRef.current = popover
    setPopover(popover)
  }, [])

  useEffect(() => {
    const {current: dynamicList} = dynamicListRef
    if (!dynamicList) {
      return
    }
    const popover = dynamicList.getPopover()
    if (position) {
      popover.style.position = 'absolute'
      popover.style.top = `${position.top}px`
      popover.style.left = `${position.left}px`
    }
  }, [position])

  return (
    <BoxWithFallback as="nav" className={clsx(className)} aria-label="Breadcrumbs" sx={sxProp}>
      <DynamicList
        ref={dynamicListRef}
        className={clsx(classes.DynamicList, classes.BreadcrumbsList)}
        hideRoot={hideRoot}
        role="list"
      >
        <DynamicListTrigger className={classes.DynamicListTrigger} role="listitem" ref={anchorRef}>
          <IconButton icon={KebabHorizontalIcon} aria-label="Open parent pages" variant="invisible" size="small" />
        </DynamicListTrigger>
        {wrappedChildren}
      </DynamicList>
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
      className={clsx(className, classes.Item, 'item', {
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
