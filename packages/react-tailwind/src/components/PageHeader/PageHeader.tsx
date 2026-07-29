import {ArrowLeftIcon} from '@primer/octicons-react'
import React from 'react'
import {cn} from '../../internal/cn'
import {responsiveClasses} from '../../utils/responsive'
import type {AsProp, ResponsiveValue} from '../../utils/types'

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
        'grid grid-cols-[auto_auto_auto_auto_1fr] grid-rows-[auto_auto_auto_auto] text-title-medium font-semibold [grid-template-areas:"context_context_context_context_context"_"leading_breadcrumbs_title_trailing_actions"_"description_description_description_description_description"_"navigation_navigation_navigation_navigation_navigation"]',
        hasBorder && 'border-b border-default pb-2',
        className,
      )}
      data-component="PageHeader"
    />
  )
})

export interface PageHeaderPartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'hidden'> {
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
        '[grid-area:context] flex items-center gap-2 pb-2 text-sm font-normal',
        hiddenClasses(hidden, 'flex', hiddenOnRegularAndWide),
        className,
      )}
      data-component="PageHeader.ContextArea"
    />
  )
})
export interface ParentLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'hidden'>, AsProp {
  hidden?: ResponsiveValue<boolean>
}
const ParentLink = React.forwardRef<HTMLElement, ParentLinkProps>(function ParentLink(
  {as: Component = 'a', className, hidden, ...rest},
  ref,
) {
  return (
    <Component
      {...rest}
      ref={ref}
      className={cn(
        'flex items-center gap-2 text-sm text-muted no-underline',
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
const ContextBar = React.forwardRef<HTMLDivElement, PageHeaderPartProps>(function ContextBar(
  {className, hidden, ...rest},
  ref,
) {
  return (
    <div
      {...rest}
      ref={ref}
      className={cn('flex', hiddenClasses(hidden, 'flex', hiddenOnRegularAndWide), className)}
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
        'ml-auto flex items-center gap-2',
        hiddenClasses(hidden, 'flex', hiddenOnRegularAndWide),
        className,
      )}
      data-component="PageHeader.ContextAreaActions"
    />
  )
})
export interface TitleAreaProps extends PageHeaderPartProps {
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
        '[grid-area:title] flex items-start gap-2',
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
        '[grid-area:leading] flex min-h-8 items-center pr-2',
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
        '[grid-area:breadcrumbs] flex items-center pr-2 text-sm font-normal',
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
      className={cn('flex items-center', hiddenClasses(hidden, 'flex'), className)}
      data-component="PageHeader.LeadingVisual"
    />
  )
})
export interface TitleProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'hidden'> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
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
        'm-0 [font-size:inherit] [font-weight:inherit] [line-height:inherit]',
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
      className={cn('flex items-center', hiddenClasses(hidden, 'flex'), className)}
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
        '[grid-area:trailing] flex min-h-8 items-center pl-2',
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
        '[grid-area:actions] flex min-h-8 min-w-max items-center justify-end gap-2 pl-2',
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
        '[grid-area:description] flex items-center gap-2 pt-2 text-sm text-muted',
        hiddenClasses(hidden, 'flex'),
        className,
      )}
      data-component="PageHeader.Description"
    />
  )
})
export interface NavigationProps extends PageHeaderPartProps {
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
      className={cn('[grid-area:navigation] block pt-2 text-sm', hiddenClasses(hidden), className)}
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
