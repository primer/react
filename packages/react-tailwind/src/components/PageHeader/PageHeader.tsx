import {ArrowLeftIcon} from '@primer/octicons-react'
import React from 'react'
import {cn} from '../../internal/cn'
import {responsiveClasses} from '../../utils/responsive'
import type {AsProp, ResponsiveValue} from '../../utils/types'
import type {BroadAsProps, PolymorphicPropsWithDefaultRef} from '../../utils/types/component'

type TitleVariant = 'subtitle' | 'medium' | 'large'

const hiddenOnNarrow = {narrow: true, regular: false, wide: false}
const hiddenOnRegularAndWide = {narrow: false, regular: true, wide: true}

function hiddenClasses(
  hidden: ResponsiveValue<boolean> | undefined,
  visibleClass = 'block',
  defaultHidden: ResponsiveValue<boolean> = false,
) {
  return responsiveClasses(hidden, {true: 'hidden', false: visibleClass}, defaultHidden)
}

export interface PageHeaderProps extends React.HTMLAttributes<HTMLElement>, AsProp {
  /** Draws a border below the header, separating it from the content. */
  hasBorder?: boolean
}
const Root = React.forwardRef<HTMLElement, PageHeaderProps>(function PageHeader(
  {as: Component = 'div', className, hasBorder, ...rest},
  ref,
) {
  return (
    <Component
      {...rest}
      ref={ref}
      className={cn(
        "primer:grid primer:grid-cols-[auto_auto_auto_auto_1fr] primer:grid-rows-[auto_auto_auto_auto] primer:text-title-medium primer:font-semibold primer:[grid-template-areas:'context_context_context_context_context'_'leading_breadcrumbs_title_trailing_actions'_'description_description_description_description_description'_'navigation_navigation_navigation_navigation_navigation']",
        hasBorder && 'primer:border-b primer:border-default primer:pb-2',
        className,
      )}
      data-component="PageHeader"
    />
  )
})

export interface PageHeaderPartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'hidden'> {
  /** Hides the part. Accepts a responsive object to hide it only at some viewports. */
  hidden?: ResponsiveValue<boolean>
}
const ContextArea = React.forwardRef<HTMLDivElement, PageHeaderPartProps>(function ContextArea(
  {className, hidden, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        'primer:[grid-area:context] primer:flex primer:items-center primer:gap-2 primer:pb-2 primer:text-sm primer:font-normal',
        hiddenClasses(hidden, 'flex', hiddenOnRegularAndWide),
        className,
      )}
      data-component="PageHeader.ContextArea"
    />
  )
})
interface ParentLinkOwnProps extends AsProp {
  /** Hides the parent link. Accepts a responsive object to hide it only at some viewports. */
  hidden?: ResponsiveValue<boolean>
}

export type ParentLinkProps<As extends React.ElementType = never> = PolymorphicPropsWithDefaultRef<
  As,
  ParentLinkOwnProps,
  'a',
  HTMLElement
>

const ParentLinkRoot = React.forwardRef<
  HTMLElement,
  ParentLinkOwnProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'hidden'>
>(function ParentLink({as: Component = 'a', className, hidden, ...rest}, ref) {
  return (
    <Component
      {...rest}
      ref={ref}
      className={cn(
        'primer:flex primer:items-center primer:gap-2 primer:text-sm primer:text-muted primer:no-underline',
        hiddenClasses(hidden, 'flex', hiddenOnRegularAndWide),
        className,
      )}
      data-component="PageHeader.ParentLink"
    >
      <ArrowLeftIcon aria-hidden="true" />
      {rest.children}
    </Component>
  )
})

const ParentLink = ParentLinkRoot as {
  <As extends React.ElementType>(props: ParentLinkProps<As> & {as: As}): React.ReactElement | null
  (props: ParentLinkProps<'a'>): React.ReactElement | null
  <As extends React.ElementType>(props: BroadAsProps<As, ParentLinkProps>): React.ReactElement | null
  displayName?: string
}

const ContextBar = React.forwardRef<HTMLDivElement, PageHeaderPartProps>(function ContextBar(
  {className, hidden, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn('primer:flex', hiddenClasses(hidden, 'flex', hiddenOnRegularAndWide), className)}
      data-component="PageHeader.ContextBar"
    />
  )
})
const ContextAreaActions = React.forwardRef<HTMLDivElement, PageHeaderPartProps>(function ContextAreaActions(
  {className, hidden, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        'primer:ml-auto primer:flex primer:items-center primer:gap-2',
        hiddenClasses(hidden, 'flex', hiddenOnRegularAndWide),
        className,
      )}
      data-component="PageHeader.ContextAreaActions"
    />
  )
})
export interface TitleAreaProps extends PageHeaderPartProps {
  /** Size of the title area. Accepts a responsive object to vary it per viewport. */
  variant?: ResponsiveValue<TitleVariant>
}
const TitleArea = React.forwardRef<HTMLDivElement, TitleAreaProps>(function TitleArea(
  {className, hidden, variant = 'medium', ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        'primer:[grid-area:title] primer:flex primer:items-start primer:gap-2',
        responsiveClasses(
          variant,
          {
            subtitle: 'text-title-medium font-normal',
            medium: 'text-title-medium font-semibold',
            large: 'text-title-large font-normal',
          },
          'medium',
        ),
        hiddenClasses(hidden, 'flex'),
        className,
      )}
      data-component="PageHeader.TitleArea"
      data-variant={typeof variant === 'string' ? variant : undefined}
    />
  )
})
const LeadingAction = React.forwardRef<HTMLDivElement, PageHeaderPartProps>(function LeadingAction(
  {className, hidden, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        'primer:[grid-area:leading] primer:flex primer:h-[1lh] primer:items-center primer:pr-2',
        hiddenClasses(hidden, 'flex', hiddenOnNarrow),
        className,
      )}
      data-component="PageHeader.LeadingAction"
    />
  )
})
const Breadcrumbs = React.forwardRef<HTMLDivElement, PageHeaderPartProps>(function Breadcrumbs(
  {className, hidden, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        'primer:[grid-area:breadcrumbs] primer:flex primer:items-center primer:pr-2 primer:text-sm primer:font-normal',
        hiddenClasses(hidden, 'flex'),
        className,
      )}
      data-component="PageHeader.Breadcrumbs"
    />
  )
})
const LeadingVisual = React.forwardRef<HTMLDivElement, PageHeaderPartProps>(function LeadingVisual(
  {className, hidden, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn('primer:flex primer:h-[1lh] primer:items-center', hiddenClasses(hidden, 'flex'), className)}
      data-component="PageHeader.LeadingVisual"
    />
  )
})
export interface TitleProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'hidden'> {
  /** Heading element to render, so the title fits the surrounding document outline. */
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  /** Hides the title. Accepts a responsive object to hide it only at some viewports. */
  hidden?: ResponsiveValue<boolean>
}
const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(function Title(
  {as: Component = 'h2', className, hidden, ...rest},
  ref,
) {
  return (
    <Component
      {...rest}
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(
        'primer:m-0 primer:[font-size:inherit] primer:[font-weight:inherit] primer:[line-height:inherit]',
        hiddenClasses(hidden),
        className,
      )}
      data-component="PageHeader.Title"
    />
  )
})
const TrailingVisual = React.forwardRef<HTMLDivElement, PageHeaderPartProps>(function TrailingVisual(
  {className, hidden, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn('primer:flex primer:h-[1lh] primer:items-center', hiddenClasses(hidden, 'flex'), className)}
      data-component="PageHeader.TrailingVisual"
    />
  )
})
const TrailingAction = React.forwardRef<HTMLDivElement, PageHeaderPartProps>(function TrailingAction(
  {className, hidden, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        'primer:[grid-area:trailing] primer:flex primer:h-[1lh] primer:items-center primer:pl-2',
        hiddenClasses(hidden, 'flex', hiddenOnNarrow),
        className,
      )}
      data-component="PageHeader.TrailingAction"
    />
  )
})
const Actions = React.forwardRef<HTMLDivElement, PageHeaderPartProps>(function Actions(
  {className, hidden, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        'primer:[grid-area:actions] primer:flex primer:h-[1lh] primer:min-w-max primer:items-center primer:justify-end primer:gap-2 primer:pl-2',
        hiddenClasses(hidden, 'flex'),
        className,
      )}
      data-component="PageHeader.Actions"
    />
  )
})
const Description = React.forwardRef<HTMLDivElement, PageHeaderPartProps>(function Description(
  {className, hidden, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn(
        'primer:[grid-area:description] primer:flex primer:items-center primer:gap-2 primer:pt-2 primer:text-sm primer:font-normal',
        hiddenClasses(hidden, 'flex'),
        className,
      )}
      data-component="PageHeader.Description"
    />
  )
})
export interface NavigationProps extends PageHeaderPartProps {
  /** Element to render. Use `nav` only when the navigation has an accessible name. */
  as?: 'nav' | 'div'
}
const Navigation = React.forwardRef<HTMLElement, NavigationProps>(function Navigation(
  {as: Component = 'div', className, hidden, ...rest},
  ref,
) {
  return (
    <Component
      {...rest}
      ref={ref as React.Ref<HTMLDivElement>}
      className={cn(
        'primer:[grid-area:navigation] primer:block primer:pt-2 primer:text-sm primer:font-normal',
        hiddenClasses(hidden),
        className,
      )}
      data-component="PageHeader.Navigation"
    />
  )
})

export const PageHeader = Object.assign(Root, {
  ContextArea,
  ParentLink,
  ContextBar,
  ContextAreaActions,
  TitleArea,
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
