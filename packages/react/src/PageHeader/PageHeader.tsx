import React, {useEffect} from 'react'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {isResponsiveValue, useResponsiveValue} from '../hooks/useResponsiveValue'
import type {SxProp, CSSCustomProperties} from '../sx'
import Heading from '../Heading'
import {ArrowLeftIcon} from '@primer/octicons-react'
import type {LinkProps as BaseLinkProps} from '../Link'
import Link from '../Link'

import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {areAllValuesTheSame, haveRegularAndWideSameValue} from '../utils/getBreakpointDeclarations'
import {warning} from '../utils/warning'
import {useProvidedRefOrCreate} from '../hooks'
import type {AriaRole} from '../utils/types'
import {clsx} from 'clsx'

import classes from './PageHeader.module.css'
import {defaultSxProp} from '../utils/defaultSxProp'
import {BoxWithFallback} from '../internal/components/BoxWithFallback'

// Types that are shared between PageHeader children components
export type ChildrenPropTypes = {
  className?: string
  hidden?: boolean | ResponsiveValue<boolean>
} & SxProp

// Default state for the `visible` prop when a sub component is only visible on narrow viewport
const hiddenOnRegularAndWide = {
  narrow: false,
  regular: true,
  wide: true,
}

// Default state for the `visible` prop when a sub component is visible on regular and wide viewport
const hiddenOnNarrow = {
  narrow: true,
  regular: false,
  wide: false,
}

// Root
// -----------------------------------------------------------------------------
export type PageHeaderProps = {
  'aria-label'?: React.AriaAttributes['aria-label']
  as?: React.ElementType | 'header' | 'div'
  className?: string
  role?: AriaRole
  hasBorder?: boolean
} & SxProp

const Root = React.forwardRef<HTMLDivElement, React.PropsWithChildren<PageHeaderProps>>(
  ({children, className, sx = defaultSxProp, as = 'div', 'aria-label': ariaLabel, role, hasBorder}, forwardedRef) => {
    const rootRef = useProvidedRefOrCreate<HTMLDivElement>(forwardedRef as React.RefObject<HTMLDivElement>)

    const isInteractive = (element: HTMLElement) => {
      return (
        ['a', 'button'].some(selector => element.matches(selector)) ||
        (element.hasAttribute('role') && element.getAttribute('role') === 'button') ||
        (element.hasAttribute('link') && element.getAttribute('role') === 'link') ||
        element.hasAttribute('tabindex')
      )
    }

    useEffect(
      function validateInteractiveElementsInTitle() {
        if (!__DEV__) return

        let hasContextArea = false
        let hasLeadingAction = false

        if (!rootRef.current || rootRef.current.children.length <= 0) return
        const titleArea = Array.from(rootRef.current.children as HTMLCollection).find(child => {
          return child instanceof HTMLElement && child.getAttribute('data-component') === 'TitleArea'
        })

        // It is very unlikely to have a PageHeader without a TitleArea, but we still want to make sure we don't break the page if that happens.
        if (!titleArea) return

        for (const child of React.Children.toArray(children)) {
          if (React.isValidElement(child) && child.type === ContextArea) {
            hasContextArea = true
          }
          if (React.isValidElement(child) && child.type === LeadingAction) {
            hasLeadingAction = true
          }
        }
        // Check if TitleArea has any interactive children or grandchildren.
        const hasInteractiveContent = Array.from(titleArea.childNodes).some(child => {
          return (
            (child instanceof HTMLElement && isInteractive(child)) ||
            Array.from(child.childNodes).some(child => {
              return child instanceof HTMLElement && isInteractive(child)
            })
          )
        })
        // PageHeader.TitleArea is be the first element in the DOM even when it is not visually the first.
        // Motivation behind this rule to make sure context area and leading action (if they exist) are always rendered after the title (a heading tag)
        // so that screen reader users who are navigating via heading menu won't miss these actions.
        warning(
          hasInteractiveContent && (hasContextArea || hasLeadingAction),
          'When PageHeader.ContextArea or PageHeader.LeadingAction is present, we recommended not to include any interactive items in the PageHeader.TitleArea to make sure the focus order is logical.',
        )
      },
      [children, rootRef],
    )

    return (
      <BoxWithFallback
        as={as}
        ref={rootRef}
        className={clsx(classes.PageHeader, className)}
        data-has-border={hasBorder ? 'true' : undefined}
        sx={sx}
        aria-label={ariaLabel}
        role={role}
      >
        {children}
      </BoxWithFallback>
    )
  },
) as PolymorphicForwardRefComponent<'div', PageHeaderProps>

// PageHeader.ContextArea : Only visible on narrow viewports by default to provide user context of where they are at their journey. `hidden` prop available
// to manage their custom visibility but consumers should be careful if they choose to hide this on narrow viewports.
// PageHeader.ContextArea Sub Components: PageHeader.ParentLink, PageHeader.ContextBar, PageHeader.ContextAreaActions
// ---------------------------------------------------------------------
const ContextArea: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  hidden = hiddenOnRegularAndWide,
  sx: sxProp = defaultSxProp,
}) => {
  return (
    <BoxWithFallback className={clsx(classes.ContextArea, className)} sx={sxProp} {...getHiddenDataAttributes(hidden)}>
      {children}
    </BoxWithFallback>
  )
}
type LinkProps = Pick<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & BaseLinkProps,
  'download' | 'href' | 'hrefLang' | 'media' | 'ping' | 'rel' | 'target' | 'type' | 'referrerPolicy' | 'as'
> & {
  'aria-label'?: React.AriaAttributes['aria-label']
}
export type ParentLinkProps = React.PropsWithChildren<ChildrenPropTypes & LinkProps>

// PageHeader.ParentLink : Only visible on narrow viewports by default to let users navigate up in the hierarchy.
const ParentLink = React.forwardRef<HTMLAnchorElement, ParentLinkProps>(
  (
    {
      children,
      className,
      sx: sxProp = defaultSxProp,
      href,
      'aria-label': ariaLabel,
      as = 'a',
      hidden = hiddenOnRegularAndWide,
    },
    ref,
  ) => {
    return (
      <>
        <Link
          ref={ref}
          as={as}
          aria-label={ariaLabel}
          muted
          className={clsx(classes.ParentLink, className)}
          sx={sxProp}
          {...getHiddenDataAttributes(hidden)}
          href={href}
        >
          <ArrowLeftIcon />
          <div>{children}</div>
        </Link>
      </>
    )
  },
) as PolymorphicForwardRefComponent<'a', ParentLinkProps>
ParentLink.displayName = 'ParentLink'

// ContextBar
// Generic slot for any component above the title region. Use it for custom breadcrumbs and other navigation elements instead of ParentLink.
// ---------------------------------------------------------------------

const ContextBar: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  sx: sxProp = defaultSxProp,
  hidden = hiddenOnRegularAndWide,
}) => {
  return (
    <BoxWithFallback className={clsx(classes.ContextBar, className)} sx={sxProp} {...getHiddenDataAttributes(hidden)}>
      {children}
    </BoxWithFallback>
  )
}

// ContextAreaActions
// ---------------------------------------------------------------------
const ContextAreaActions: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  sx: sxProp = defaultSxProp,
  hidden = hiddenOnRegularAndWide,
}) => {
  return (
    <BoxWithFallback
      className={clsx(classes.ContextAreaActions, className)}
      {...getHiddenDataAttributes(hidden)}
      sx={sxProp}
      {...getHiddenDataAttributes(hidden)}
    >
      {children}
    </BoxWithFallback>
  )
}

type TitleAreaProps = {
  variant?: 'subtitle' | 'medium' | 'large' | ResponsiveValue<'subtitle' | 'medium' | 'large'>
} & ChildrenPropTypes
// PageHeader.TitleArea: The main title area of the page. Visible on all viewports.
// PageHeader.TitleArea Sub Components: PageHeader.LeadingVisual, PageHeader.Title, PageTitle.TrailingVisual
// ---------------------------------------------------------------------

const TitleArea = React.forwardRef<HTMLDivElement, React.PropsWithChildren<TitleAreaProps>>(
  ({children, className, sx: sxProp = defaultSxProp, hidden = false, variant = 'medium'}, forwardedRef) => {
    const titleAreaRef = useProvidedRefOrCreate<HTMLDivElement>(forwardedRef as React.RefObject<HTMLDivElement>)
    const currentVariant = useResponsiveValue(variant, 'medium')
    return (
      <BoxWithFallback
        className={clsx(classes.TitleArea, className)}
        ref={titleAreaRef}
        data-component="TitleArea"
        data-size-variant={currentVariant}
        sx={sxProp}
        {...getHiddenDataAttributes(hidden)}
      >
        {children}
      </BoxWithFallback>
    )
  },
) as PolymorphicForwardRefComponent<'div', TitleAreaProps>
TitleArea.displayName = 'TitleArea'

// PageHeader.LeadingAction and PageHeader.TrailingAction should only be visible on regular viewports.
// So they come as hidden on narrow viewports by default and their visibility can be managed by their `hidden` prop.
const LeadingAction: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  sx: sxProp = defaultSxProp,
  hidden = hiddenOnNarrow,
}) => {
  const style: CSSCustomProperties = {}
  // @ts-ignore sx has height attribute
  const {height} = sxProp
  if (height) style['--custom-height'] = height
  return (
    <BoxWithFallback
      className={clsx(classes.LeadingAction, className)}
      data-component="PH_LeadingAction"
      sx={sxProp}
      style={style}
      {...getHiddenDataAttributes(hidden)}
    >
      {children}
    </BoxWithFallback>
  )
}

// This is reserved for only breadcrumbs.
const Breadcrumbs: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  sx: sxProp = defaultSxProp,
  hidden = false,
}) => {
  return (
    <BoxWithFallback
      className={clsx(classes.Breadcrumbs, className)}
      data-component="PH_Breadcrumbs"
      sx={sxProp}
      {...getHiddenDataAttributes(hidden)}
    >
      {children}
    </BoxWithFallback>
  )
}

// PageHeader.LeadingVisual and PageHeader.TrailingVisual should remain visible on narrow viewports.
const LeadingVisual: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  sx: sxProp = defaultSxProp,
  hidden = false,
}) => {
  const style: CSSCustomProperties = {}
  // @ts-ignore sx has height attribute
  const {height} = sxProp
  if (height) style['--custom-height'] = height
  return (
    <BoxWithFallback
      className={clsx(classes.LeadingVisual, className)}
      data-component="PH_LeadingVisual"
      sx={sxProp}
      style={style}
      {...getHiddenDataAttributes(hidden)}
    >
      {children}
    </BoxWithFallback>
  )
}

export type TitleProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
} & Omit<ChildrenPropTypes, 'sx'>

const Title: React.FC<React.PropsWithChildren<TitleProps>> = ({children, className, hidden = false, as = 'h2'}) => {
  return (
    <Heading
      className={clsx(classes.Title, className)}
      data-component="PH_Title"
      data-hidden={hidden}
      as={as}
      {...getHiddenDataAttributes(hidden)}
    >
      {children}
    </Heading>
  )
}

// PageHeader.LeadingVisual and PageHeader.TrailingVisual should remain visible on narrow viewports.
const TrailingVisual: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  sx: sxProp = defaultSxProp,
  hidden = false,
}) => {
  const style: CSSCustomProperties = {}
  // @ts-ignore sx has height attribute
  const {height} = sxProp
  if (height) style['--custom-height'] = height
  return (
    <BoxWithFallback
      className={clsx(classes.TrailingVisual, className)}
      data-component="PH_TrailingVisual"
      sx={sxProp}
      style={style}
      {...getHiddenDataAttributes(hidden)}
    >
      {children}
    </BoxWithFallback>
  )
}

const TrailingAction: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  sx: sxProp = defaultSxProp,
  hidden = hiddenOnNarrow,
}) => {
  const style: CSSCustomProperties = {}
  // @ts-ignore sx has height attribute
  const {height} = sxProp
  if (height) style['--custom-height'] = height
  return (
    <BoxWithFallback
      className={clsx(classes.TrailingAction, className)}
      data-component="PH_TrailingAction"
      sx={sxProp}
      style={style}
      {...getHiddenDataAttributes(hidden)}
    >
      {children}
    </BoxWithFallback>
  )
}

const Actions: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  sx: sxProp = defaultSxProp,
  hidden = false,
}) => {
  const style: CSSCustomProperties = {}
  // @ts-ignore sx has height attribute
  const {height} = sxProp
  if (height) style['--custom-height'] = height
  return (
    <BoxWithFallback
      className={clsx(classes.Actions, className)}
      data-component="PH_Actions"
      sx={sxProp}
      style={style}
      {...getHiddenDataAttributes(hidden)}
    >
      {children}
    </BoxWithFallback>
  )
}

// PageHeader.Description: The description area of the header. Visible on all viewports
const Description: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  sx: sxProp = defaultSxProp,
  hidden = false,
}) => {
  return (
    <BoxWithFallback className={clsx(classes.Description, className)} sx={sxProp} {...getHiddenDataAttributes(hidden)}>
      {children}
    </BoxWithFallback>
  )
}

export type NavigationProps = {
  as?: 'nav' | 'div'
  'aria-label'?: React.AriaAttributes['aria-label']
  'aria-labelledby'?: React.AriaAttributes['aria-labelledby']
} & ChildrenPropTypes

// PageHeader.Navigation: The local navigation area of the header. Visible on all viewports
const Navigation: React.FC<React.PropsWithChildren<NavigationProps>> = ({
  children,
  className,
  sx: sxProp = defaultSxProp,
  hidden = false,
  as,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}) => {
  warning(
    as === 'nav' && !ariaLabel && !ariaLabelledBy,
    'Use `aria-label` or `aria-labelledby` prop to provide an accessible label to the `nav` landmark for assistive technology',
  )

  return (
    <BoxWithFallback
      as={as}
      // Render `aria-label` and `aria-labelledby` only on `nav` elements
      aria-label={as === 'nav' ? ariaLabel : undefined}
      aria-labelledby={as === 'nav' ? ariaLabelledBy : undefined}
      className={clsx(classes.Navigation, className)}
      data-component="PH_Navigation"
      sx={sxProp}
      {...getHiddenDataAttributes(hidden)}
    >
      {children}
    </BoxWithFallback>
  )
}

// Based on getBreakpointDeclarations, this function will return the
// correct data attribute for the given hidden value for CSS modules.
function getHiddenDataAttributes(isHidden: boolean | ResponsiveValue<boolean>): {
  'data-hidden-all'?: boolean
  'data-hidden-narrow'?: boolean
  'data-hidden-regular'?: boolean
  'data-hidden-wide'?: boolean
} {
  if (isResponsiveValue(isHidden)) {
    const responsiveValue = isHidden

    // Build media queries with the giving cssProperty and mapFn
    const narrowMediaQuery =
      'narrow' in responsiveValue
        ? {
            'data-hidden-narrow': responsiveValue.narrow || undefined,
          }
        : {}

    const regularMediaQuery =
      'regular' in responsiveValue
        ? {
            'data-hidden-regular': responsiveValue.regular || undefined,
          }
        : {}

    const wideMediaQuery =
      'wide' in responsiveValue
        ? {
            'data-hidden-wide': responsiveValue.wide || undefined,
          }
        : {}

    // check if all values are the same - this is not a recommended practice but we still should check for it
    if (areAllValuesTheSame(responsiveValue)) {
      // if all the values are the same, we can just use one of the value to determine the CSS property's value
      return {'data-hidden-all': responsiveValue.narrow || undefined}
      // check if regular and wide have the same value, if so we can just return the narrow and regular media queries
    } else if (haveRegularAndWideSameValue(responsiveValue)) {
      return {
        ...narrowMediaQuery,
        ...regularMediaQuery,
      }
    } else {
      return {
        ...narrowMediaQuery,
        ...regularMediaQuery,
        ...wideMediaQuery,
      }
    }
  } else {
    // If the given value is not a responsive value
    return {'data-hidden-all': isHidden || undefined}
  }
}

export const PageHeader = Object.assign(Root, {
  ContextArea,
  ParentLink,
  ContextBar,
  TitleArea,
  ContextAreaActions,
  LeadingAction,
  Breadcrumbs,
  LeadingVisual,
  Title,
  TrailingVisual,
  TrailingAction,
  Actions,
  Description,
  Navigation,
})

PageHeader.displayName = 'PageHeader'
