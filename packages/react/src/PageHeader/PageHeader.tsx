import React, {useEffect} from 'react'
import type {ResponsiveValue} from '../hooks/useResponsiveValue'
import {isResponsiveValue} from '../hooks/useResponsiveValue'
import Heading from '../Heading'
import {ArrowLeftIcon} from '@primer/octicons-react'
import type {LinkProps as BaseLinkProps} from '../Link'
import Link from '../Link'
import {getResponsiveAttributes} from '../internal/utils/getResponsiveAttributes'

import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {areAllValuesTheSame, haveRegularAndWideSameValue} from '../utils/getBreakpointDeclarations'
import {warning} from '../utils/warning'
import {useProvidedRefOrCreate} from '../hooks'
import type {AriaRole, FCWithSlotMarker} from '../utils/types'
import {clsx} from 'clsx'

import classes from './PageHeader.module.css'
import {isSlot} from '../utils/is-slot'

// Types that are shared between PageHeader children components
export type ChildrenPropTypes = {
  className?: string
  hidden?: boolean | ResponsiveValue<boolean>
}

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
}

const Root = React.forwardRef<HTMLDivElement, React.PropsWithChildren<PageHeaderProps>>(
  ({children, className, as: BaseComponent = 'div', 'aria-label': ariaLabel, role, hasBorder}, forwardedRef) => {
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
          if (React.isValidElement(child) && (child.type === ContextArea || isSlot(child, ContextArea))) {
            hasContextArea = true
          }
          if (React.isValidElement(child) && (child.type === LeadingAction || isSlot(child, LeadingAction))) {
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
      <BaseComponent
        ref={rootRef}
        className={clsx(classes.PageHeader, className)}
        data-has-border={hasBorder ? 'true' : undefined}
        aria-label={ariaLabel}
        role={role}
      >
        {children}
      </BaseComponent>
    )
  },
) as PolymorphicForwardRefComponent<'div', PageHeaderProps>

// PageHeader.ContextArea : Only visible on narrow viewports by default to provide user context of where they are at their journey. `hidden` prop available
// to manage their custom visibility but consumers should be careful if they choose to hide this on narrow viewports.
// PageHeader.ContextArea Sub Components: PageHeader.ParentLink, PageHeader.ContextBar, PageHeader.ContextAreaActions
// ---------------------------------------------------------------------
const ContextArea: FCWithSlotMarker<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  hidden = hiddenOnRegularAndWide,
}) => {
  return (
    <div className={clsx(classes.ContextArea, className)} {...getHiddenDataAttributes(hidden)}>
      {children}
    </div>
  )
}

ContextArea.__SLOT__ = Symbol('PageHeader.ContextArea')

type LinkProps = Pick<
  React.AnchorHTMLAttributes<HTMLAnchorElement> & BaseLinkProps,
  'download' | 'href' | 'hrefLang' | 'media' | 'ping' | 'rel' | 'target' | 'type' | 'referrerPolicy' | 'as'
> & {
  'aria-label'?: React.AriaAttributes['aria-label']
}
export type ParentLinkProps = React.PropsWithChildren<ChildrenPropTypes & LinkProps>

// PageHeader.ParentLink : Only visible on narrow viewports by default to let users navigate up in the hierarchy.
const ParentLink = React.forwardRef<HTMLAnchorElement, ParentLinkProps>(
  ({children, className, href, 'aria-label': ariaLabel, as = 'a', hidden = hiddenOnRegularAndWide}, ref) => {
    return (
      <>
        <Link
          ref={ref}
          as={as}
          aria-label={ariaLabel}
          muted
          className={clsx(classes.ParentLink, className)}
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
  hidden = hiddenOnRegularAndWide,
}) => {
  return (
    <div className={clsx(classes.ContextBar, className)} {...getHiddenDataAttributes(hidden)}>
      {children}
    </div>
  )
}

// ContextAreaActions
// ---------------------------------------------------------------------
const ContextAreaActions: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  hidden = hiddenOnRegularAndWide,
}) => {
  return (
    <div className={clsx(classes.ContextAreaActions, className)} {...getHiddenDataAttributes(hidden)}>
      {children}
    </div>
  )
}

export type TitleAreaProps = {
  variant?: 'subtitle' | 'medium' | 'large' | ResponsiveValue<'subtitle' | 'medium' | 'large'>
} & ChildrenPropTypes
// PageHeader.TitleArea: The main title area of the page. Visible on all viewports.
// PageHeader.TitleArea Sub Components: PageHeader.LeadingVisual, PageHeader.Title, PageTitle.TrailingVisual
// ---------------------------------------------------------------------

const TitleArea = React.forwardRef<HTMLDivElement, React.PropsWithChildren<TitleAreaProps>>(
  ({children, className, hidden = false, variant = 'medium'}, forwardedRef) => {
    const titleAreaRef = useProvidedRefOrCreate<HTMLDivElement>(forwardedRef as React.RefObject<HTMLDivElement>)
    return (
      <div
        className={clsx(classes.TitleArea, className)}
        ref={titleAreaRef}
        data-component="TitleArea"
        {...getResponsiveAttributes('size-variant', variant)}
        {...getHiddenDataAttributes(hidden)}
      >
        {children}
      </div>
    )
  },
) as PolymorphicForwardRefComponent<'div', TitleAreaProps>
TitleArea.displayName = 'TitleArea'

// PageHeader.LeadingAction and PageHeader.TrailingAction should only be visible on regular viewports.
// So they come as hidden on narrow viewports by default and their visibility can be managed by their `hidden` prop.
const LeadingAction: FCWithSlotMarker<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  hidden = hiddenOnNarrow,
}) => {
  return (
    <div
      className={clsx(classes.LeadingAction, className)}
      data-component="PH_LeadingAction"
      {...getHiddenDataAttributes(hidden)}
    >
      {children}
    </div>
  )
}

LeadingAction.__SLOT__ = Symbol('PageHeader.LeadingAction')

// This is reserved for only breadcrumbs.
const Breadcrumbs: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({children, className, hidden = false}) => {
  return (
    <div
      className={clsx(classes.Breadcrumbs, className)}
      data-component="PH_Breadcrumbs"
      {...getHiddenDataAttributes(hidden)}
    >
      {children}
    </div>
  )
}

// PageHeader.LeadingVisual and PageHeader.TrailingVisual should remain visible on narrow viewports.
const LeadingVisual: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({children, className, hidden = false}) => {
  return (
    <div
      className={clsx(classes.LeadingVisual, className)}
      data-component="PH_LeadingVisual"
      {...getHiddenDataAttributes(hidden)}
    >
      {children}
    </div>
  )
}

export type TitleProps = {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
} & ChildrenPropTypes

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
  hidden = false,
}) => {
  return (
    <div
      className={clsx(classes.TrailingVisual, className)}
      data-component="PH_TrailingVisual"
      {...getHiddenDataAttributes(hidden)}
    >
      {children}
    </div>
  )
}

const TrailingAction: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({
  children,
  className,
  hidden = hiddenOnNarrow,
}) => {
  return (
    <div
      className={clsx(classes.TrailingAction, className)}
      data-component="PH_TrailingAction"
      {...getHiddenDataAttributes(hidden)}
    >
      {children}
    </div>
  )
}

export type ActionsProps = React.PropsWithChildren<ChildrenPropTypes>

const Actions = ({children, className, hidden = false}: ActionsProps) => {
  return (
    <div className={clsx(classes.Actions, className)} data-component="PH_Actions" {...getHiddenDataAttributes(hidden)}>
      {children}
    </div>
  )
}

// PageHeader.Description: The description area of the header. Visible on all viewports
const Description: React.FC<React.PropsWithChildren<ChildrenPropTypes>> = ({children, className, hidden = false}) => {
  return (
    <div className={clsx(classes.Description, className)} {...getHiddenDataAttributes(hidden)}>
      {children}
    </div>
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
  hidden = false,
  as: BaseComponent = 'div',
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}) => {
  warning(
    BaseComponent === 'nav' && !ariaLabel && !ariaLabelledBy,
    'Use `aria-label` or `aria-labelledby` prop to provide an accessible label to the `nav` landmark for assistive technology',
  )

  return (
    <BaseComponent
      // Render `aria-label` and `aria-labelledby` only on `nav` elements
      aria-label={BaseComponent === 'nav' ? ariaLabel : undefined}
      aria-labelledby={BaseComponent === 'nav' ? ariaLabelledBy : undefined}
      className={clsx(classes.Navigation, className)}
      data-component="PH_Navigation"
      {...getHiddenDataAttributes(hidden)}
    >
      {children}
    </BaseComponent>
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
