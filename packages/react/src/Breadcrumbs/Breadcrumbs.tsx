import {clsx} from 'clsx'
import type {To} from 'history'
import React, {useCallback, type ForwardedRef} from 'react'
import classes from './Breadcrumbs.module.css'
import {useFeatureFlag} from '../FeatureFlags'
import {useBreadcrumbsResponsive} from './useBreadcrumbsResponsive'
import {BreadcrumbsOverflowMenu} from './BreadcrumbsOverflowMenu'

export type BreadcrumbsProps = React.PropsWithChildren<{
  /**
   * Optional class name for the breadcrumbs container.
   */
  className?: string
  /**
   * Controls the overflow behavior of the breadcrumbs.
   * By default all overflowing crumbs will "wrap" in the given space taking up extra height.
   * In the "menu" option we'll see the overflowing crumbs as part of a menu like dropdown instead of the root breadcrumb.
   * In "menu-with-root" we see that instead of the root, the menu button will take the place of the next breadcrumb.
   */
  overflow?: 'wrap' | 'menu' | 'menu-with-root'
  /**
   * Controls the visual variant of the breadcrumbs.
   * By default, the breadcrumbs will have a normal appearance.
   * In the "spacious" option, the breadcrumbs will have increased padding and a more relaxed layout.
   */
  variant?: 'normal' | 'spacious'
  /**
   * Allows passing of CSS custom properties to the breadcrumbs container.
   */
  style?: React.CSSProperties
  /**
   * Controls whether the component automatically handles responsive overflow behavior.
   * When true (default), the component will automatically collapse items into an overflow menu
   * based on available width. When false, children are rendered as-is, allowing manual control
   * using the `useBreadcrumbsResponsive` hook for SSR-friendly conditional rendering.
   * @default true
   */
  responsive?: boolean
}>

const BreadcrumbsList = ({children}: React.PropsWithChildren) => {
  return <ol className={classes.BreadcrumbsList}>{children}</ol>
}

function Breadcrumbs({
  className,
  children,
  style,
  overflow = 'wrap',
  variant = 'normal',
  responsive = true,
}: BreadcrumbsProps) {
  const overflowMenuEnabled = useFeatureFlag('primer_react_breadcrumbs_overflow_menu')

  // Use the responsive hook for automatic overflow handling
  const {visibleItems, menuItems, showRoot, rootItem, containerRef, _setMenuButtonWidth} = useBreadcrumbsResponsive({
    children,
    overflow,
  }) as ReturnType<typeof useBreadcrumbsResponsive> & {
    _setMenuButtonWidth: React.Dispatch<React.SetStateAction<number>>
  }

  const measureMenuButton = useCallback(
    (element: HTMLDetailsElement | null) => {
      if (element) {
        const iconButtonElement = element.querySelector('button[data-component="IconButton"]')
        if (iconButtonElement) {
          const measuredWidth = (iconButtonElement as HTMLElement).offsetWidth
          _setMenuButtonWidth(measuredWidth)
        }
      }
    },
    [_setMenuButtonWidth],
  )

  // Non-responsive mode: render children as-is
  if (!responsive) {
    const childArray = React.Children.toArray(children)
    const wrappedChildren =
      overflow === 'menu' || overflow === 'menu-with-root'
        ? childArray.map((child, index) => (
            <li className={classes.BreadcrumbsItem} key={index}>
              {child}
              {index < childArray.length - 1 && <ItemSeparator />}
            </li>
          ))
        : React.Children.map(children, child => <li className={classes.ItemWrapper}>{child}</li>)
    return (
      <nav
        className={clsx(className, classes.BreadcrumbsBase)}
        aria-label="Breadcrumbs"
        style={style}
        data-overflow={overflow}
        data-variant={variant}
      >
        <BreadcrumbsList>{wrappedChildren}</BreadcrumbsList>
      </nav>
    )
  }

  // Responsive mode with feature flag disabled: render wrapped children
  if (!overflowMenuEnabled) {
    const wrappedChildren = React.Children.map(children, child => <li className={classes.ItemWrapper}>{child}</li>)
    return (
      <nav
        className={clsx(className, classes.BreadcrumbsBase)}
        aria-label="Breadcrumbs"
        style={style}
        data-variant={variant}
      >
        <BreadcrumbsList>{wrappedChildren}</BreadcrumbsList>
      </nav>
    )
  }

  // Responsive mode with feature flag enabled: use computed overflow
  const finalChildren = (() => {
    if (overflow === 'wrap' || menuItems.length === 0) {
      return React.Children.map(children, child => <li className={classes.ItemWrapper}>{child}</li>)
    }

    const menuElement = (
      <li className={classes.BreadcrumbsItem} key="breadcrumbs-menu">
        <BreadcrumbsOverflowMenu
          ref={measureMenuButton}
          items={menuItems}
          aria-label={`${menuItems.length} more breadcrumb items`}
        />
        <ItemSeparator />
      </li>
    )

    const visibleElements = visibleItems.map((child, index) => (
      <li className={classes.BreadcrumbsItem} key={`visible + ${index}`}>
        {child}
        <ItemSeparator />
      </li>
    ))

    const rootElement = (
      <li className={classes.BreadcrumbsItem} key={`rootElement`}>
        {rootItem}
        <ItemSeparator />
      </li>
    )

    if (!showRoot) {
      // Show: [overflow menu, leaf breadcrumb]
      return [menuElement, ...visibleElements]
    } else {
      // Show: [root breadcrumb, overflow menu, leaf breadcrumb]
      return [rootElement, menuElement, ...visibleElements]
    }
  })()

  return (
    <nav
      className={clsx(className, classes.BreadcrumbsBase)}
      aria-label="Breadcrumbs"
      style={style}
      ref={containerRef as React.RefObject<HTMLElement>}
      data-overflow={overflow}
      data-responsive="true"
      data-variant={variant}
    >
      <BreadcrumbsList>{finalChildren}</BreadcrumbsList>
    </nav>
  )
}

const ItemSeparator = () => {
  return (
    <span className={classes.ItemSeparator}>
      <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M10.956 1.27994L6.06418 14.7201L5 14.7201L9.89181 1.27994L10.956 1.27994Z" fill="currentcolor" />
      </svg>
    </span>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DistributiveOmit<T, TOmitted extends PropertyKey> = T extends any ? Omit<T, TOmitted> : never

type StyledBreadcrumbsItemProps<As extends React.ElementType> = {
  as?: As
  to?: To
  selected?: boolean
  className?: string
  style?: React.CSSProperties
} & DistributiveOmit<React.ComponentPropsWithRef<React.ElementType extends As ? 'a' : As>, 'as'>

function BreadcrumbsItemComponent<As extends React.ElementType>(
  props: StyledBreadcrumbsItemProps<As>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: ForwardedRef<any>,
) {
  const {as: Component = 'a', selected, className, ...rest} = props
  return (
    <Component
      className={clsx(className, classes.Item, selected && 'selected')}
      aria-current={selected ? 'page' : undefined}
      ref={ref}
      {...rest}
    />
  )
}

BreadcrumbsItemComponent.displayName = 'Breadcrumbs.Item'

const BreadcrumbsItem = React.forwardRef(BreadcrumbsItemComponent)

Breadcrumbs.displayName = 'Breadcrumbs'

export type BreadcrumbsItemProps<As extends React.ElementType = 'a'> = StyledBreadcrumbsItemProps<As>
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
export type BreadcrumbItemProps<As extends React.ElementType = 'a'> = BreadcrumbsItemProps<As>
