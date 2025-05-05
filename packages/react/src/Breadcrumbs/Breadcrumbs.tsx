import {clsx} from 'clsx'
import type {To} from 'history'
import React from 'react'
import type {SxProp} from '../sx'
import type {ComponentProps} from '../utils/types'
import classes from './Breadcrumbs.module.css'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {toggleSxComponent} from '../internal/utils/toggleSxComponent'

const SELECTED_CLASS = 'selected'

export type BreadcrumbsProps = React.PropsWithChildren<
  {
    className?: string
  } & SxProp
>

const BreadcrumbsList = ({children}: React.PropsWithChildren) => {
  return <ol className={classes.BreadcrumbsList}>{children}</ol>
}

const BreadcrumbsBaseComponent = toggleSxComponent('nav') as React.ComponentType<BreadcrumbsProps>
function Breadcrumbs({className, children, sx: sxProp}: BreadcrumbsProps) {
  const wrappedChildren = React.Children.map(children, child => <li className={classes.ItemWrapper}>{child}</li>)
  return (
    <BreadcrumbsBaseComponent className={clsx(className, classes.BreadcrumbsBase)} aria-label="Breadcrumbs" sx={sxProp}>
      <BreadcrumbsList>{wrappedChildren}</BreadcrumbsList>
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

const BreadcrumbsItemBaseComponent = toggleSxComponent('a') as React.ComponentType<StyledBreadcrumbsItemProps>
const BreadcrumbsItem = React.forwardRef(({selected, className, ...rest}, ref) => {
  return (
    <BreadcrumbsItemBaseComponent
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
