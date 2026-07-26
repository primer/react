'use client'

import React from 'react'
import {cn} from '../../internal/cn'
import {
  UnderlineItemContent,
  underlineItemClassName,
  underlineListClassName,
  underlineRootClassName,
} from '../../internal/UnderlineItemContent'

type HideIconsBreakpoint = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | null

interface UnderlineNavContextValue {
  hideIconsBreakpoint: HideIconsBreakpoint
  loadingCounters: boolean
}

const UnderlineNavContext = React.createContext<UnderlineNavContextValue>({
  hideIconsBreakpoint: 'xxlarge',
  loadingCounters: false,
})

const iconVisibilityClasses: Record<Exclude<HideIconsBreakpoint, null>, string> = {
  xsmall: '@max-[320px]/underline-nav:hidden',
  small: '@max-[544px]/underline-nav:hidden',
  medium: '@max-[768px]/underline-nav:hidden',
  large: '@max-[1012px]/underline-nav:hidden',
  xlarge: '@max-[1280px]/underline-nav:hidden',
  xxlarge: '@max-[1400px]/underline-nav:hidden',
}

export interface UnderlineNavProps
  extends Omit<React.ComponentPropsWithoutRef<'nav'>, 'data-component' | 'data-variant'> {
  as?: React.ElementType
  hideIconsBreakpoint?: HideIconsBreakpoint
  loadingCounters?: boolean
  variant?: 'inset' | 'flush'
}

const Root = React.forwardRef<HTMLElement, UnderlineNavProps>(function UnderlineNav(
  {
    as: Component = 'nav',
    className,
    hideIconsBreakpoint = 'xxlarge',
    loadingCounters = false,
    variant = 'inset',
    ...props
  },
  ref,
) {
  return (
    <UnderlineNavContext.Provider value={{hideIconsBreakpoint, loadingCounters}}>
      <Component
        {...props}
        ref={ref}
        data-component="UnderlineNav"
        data-hide-icons-breakpoint={hideIconsBreakpoint ?? undefined}
        data-variant={variant}
        className={cn(underlineRootClassName, variant === 'inset' ? 'px-4' : '', className)}
      />
    </UnderlineNavContext.Provider>
  )
})

export type UnderlineNavListProps = Omit<React.ComponentPropsWithoutRef<'ul'>, 'data-component'>
const List = React.forwardRef<HTMLUListElement, UnderlineNavListProps>(function UnderlineNavList(
  {className, ...props},
  ref,
) {
  return (
    <ul {...props} ref={ref} data-component="UnderlineNav.List" className={cn(underlineListClassName, className)} />
  )
})

export interface UnderlineNavItemProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'data-component' | 'onSelect'> {
  as?: React.ElementType
  counter?: number | string
  leadingVisual?: React.ReactNode
  onSelect?: (event: React.MouseEvent<HTMLElement>) => void
}
const Item = React.forwardRef<HTMLElement, UnderlineNavItemProps>(function UnderlineNavItem(
  {
    as: Component = 'a',
    className,
    children,
    counter,
    href = '#',
    leadingVisual,
    onClick,
    onSelect,
    'aria-current': ariaCurrent,
    ...props
  },
  ref,
) {
  const {hideIconsBreakpoint, loadingCounters} = React.useContext(UnderlineNavContext)
  const current = ariaCurrent && ariaCurrent !== 'false'

  return (
    <li data-component="UnderlineNav.Item" className="flex flex-col items-center overflow-hidden">
      <Component
        {...props}
        href={href}
        ref={ref}
        aria-current={ariaCurrent}
        data-current={current || undefined}
        className={cn(underlineItemClassName, className)}
        onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
          onClick?.(event)
          if (!event.defaultPrevented) onSelect?.(event)
        }}
      >
        <UnderlineItemContent
          counter={counter}
          leadingVisual={leadingVisual}
          leadingVisualClassName={hideIconsBreakpoint ? iconVisibilityClasses[hideIconsBreakpoint] : undefined}
          loadingCounters={loadingCounters}
          marker="UnderlineNav.Item"
        >
          {children}
        </UnderlineItemContent>
      </Component>
    </li>
  )
})

export const UnderlineNav = Object.assign(Root, {List, Item})
Root.displayName = 'UnderlineNav'
List.displayName = 'UnderlineNav.List'
Item.displayName = 'UnderlineNav.Item'
