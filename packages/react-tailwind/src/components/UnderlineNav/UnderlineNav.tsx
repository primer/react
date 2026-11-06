'use client'

import React from 'react'
import {cn} from '../../internal/cn'
import {OverflowObserverProvider} from '../../internal/OverflowObserverProvider'
import {
  type OverflowItem,
  type RegisterOverflowItem,
  useIsClipped,
  useOverflowRegistry,
  useRegisterOverflowItem,
} from '../../internal/overflow'
import {mergeRefs} from '../../internal/refs'
import {
  UnderlineCounter,
  UnderlineItemContent,
  underlineItemClassName,
  underlineListClassName,
  underlineRootClassName,
} from '../../internal/UnderlineItemContent'
import {ActionMenu} from '../ActionMenu'
import {VisuallyHidden} from '../VisuallyHidden'

type HideIconsBreakpoint = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | null

interface UnderlineNavContextValue {
  hideIconsBreakpoint: HideIconsBreakpoint
  loadingCounters: boolean
}

const UnderlineNavContext = React.createContext<UnderlineNavContextValue>({
  hideIconsBreakpoint: 'medium',
  loadingCounters: false,
})

/** An overflowing item's props, kept flat so unchanged props register as the same entry. */
// Overflow menu items omit the bar's leading icon and roving tab stop, as in Primer React.
type OverflowEntry = Omit<UnderlineNavItemProps, 'as' | 'className' | 'leadingVisual' | 'tabIndex'> & {
  as: React.ElementType
}

const UnderlineNavRegistryContext = React.createContext<RegisterOverflowItem<OverflowEntry> | null>(null)

const iconVisibilityClasses: Record<Exclude<HideIconsBreakpoint, null>, string> = {
  xsmall: '@max-[320px]/underline-nav:hidden',
  small: '@max-[544px]/underline-nav:hidden',
  medium: '@max-[768px]/underline-nav:hidden',
  large: '@max-[1012px]/underline-nav:hidden',
  xlarge: '@max-[1280px]/underline-nav:hidden',
  xxlarge: '@max-[1400px]/underline-nav:hidden',
}

function isCurrent(ariaCurrent: React.AriaAttributes['aria-current']) {
  return Boolean(ariaCurrent) && ariaCurrent !== 'false'
}

/** Native anchors default to `href="#"`; custom components only receive an `href` they were given. */
function getHrefProps(Component: React.ElementType, href: string | undefined) {
  if (Component === 'a') return {href: href ?? '#'}
  return href === undefined ? {} : {href}
}

function selectItem(
  event: React.MouseEvent<HTMLElement>,
  onClick: React.MouseEventHandler<HTMLAnchorElement> | undefined,
  onSelect: UnderlineNavItemProps['onSelect'],
) {
  onClick?.(event as React.MouseEvent<HTMLAnchorElement>)
  if (!event.defaultPrevented) onSelect?.(event)
}

function renderOverflowItem([id, {entry}]: [string, OverflowItem<OverflowEntry>], loadingCounters: boolean) {
  const {as: Component, 'aria-current': ariaCurrent, children, counter, href, onClick, onSelect, ...props} = entry
  return (
    <ActionMenu.Item
      key={id}
      data-current={isCurrent(ariaCurrent) || undefined}
      className="relative data-[current]:font-semibold data-[current]:after:absolute data-[current]:after:inset-y-0.5 data-[current]:after:left-0 data-[current]:after:w-0.5 data-[current]:after:bg-[var(--underlineNav-borderColor-active,#fd8c73)] data-[current]:after:content-[''] forced-colors:data-[current]:after:bg-[LinkText]"
      render={<Component {...props} {...getHrefProps(Component, href)} aria-current={ariaCurrent} />}
      onClick={event => selectItem(event, onClick, onSelect)}
    >
      {children}
      {counter === undefined ? null : (
        <ActionMenu.TrailingVisual>
          <UnderlineCounter counter={counter} loading={loadingCounters} />
        </ActionMenu.TrailingVisual>
      )}
    </ActionMenu.Item>
  )
}

export interface UnderlineNavProps
  extends Omit<React.ComponentPropsWithoutRef<'nav'>, 'data-component' | 'data-variant'> {
  /** Element to render. */
  as?: React.ElementType
  /**
   * Container width below which item icons are hidden to save space. To keep icons visible in a narrow container,
   * use a smaller breakpoint such as `xsmall`, or set to `null` to always show icons.
   * @default 'medium'
   */
  hideIconsBreakpoint?: HideIconsBreakpoint
  /** Shows placeholders in place of item counters while their values load. */
  loadingCounters?: boolean
  /** Whether the bar is inset from its container or sits flush against it. */
  variant?: 'inset' | 'flush'
}

const Root = React.forwardRef<HTMLElement, UnderlineNavProps>(function UnderlineNav(
  {
    as: Component = 'nav',
    'aria-label': ariaLabel,
    children,
    className,
    hideIconsBreakpoint = 'medium',
    loadingCounters = false,
    variant = 'inset',
    ...props
  },
  ref,
) {
  const [nav, setNav] = React.useState<HTMLElement | null>(null)
  const [overflowItems, register] = useOverflowRegistry<OverflowEntry>()
  const hasOverflow = overflowItems.length > 0
  const isCurrentOverflowing = overflowItems.some(([, {entry}]) => isCurrent(entry['aria-current']))
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  // Close the menu when nothing overflows any more, so it cannot reopen empty.
  if (isMenuOpen && !hasOverflow) setIsMenuOpen(false)

  return (
    <UnderlineNavContext.Provider value={{hideIconsBreakpoint, loadingCounters}}>
      {ariaLabel ? <h2 className="sr-only">{`${ariaLabel} navigation`}</h2> : null}
      <Component
        {...props}
        ref={mergeRefs(ref, setNav)}
        aria-label={ariaLabel}
        data-component="UnderlineNav"
        data-has-overflow={hasOverflow || undefined}
        data-hide-icons-breakpoint={hideIconsBreakpoint ?? undefined}
        data-variant={variant}
        className={cn(
          underlineRootClassName,
          'box-border max-h-12 overflow-hidden border-0 pb-0 [--underline-nav-more-display:none] data-[has-overflow]:[--underline-nav-more-display:flex]',
          variant === 'inset' ? 'px-4' : '',
          className,
        )}
      >
        {/* Matches Primer React: Safari drops list semantics from `list-style: none` lists without an explicit role. */}
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <ul
          role="list"
          className={cn(underlineListClassName, 'min-w-0 grow flex-wrap overflow-hidden [contain:layout]')}
        >
          {/* An empty first item lets even the first real item wrap onto the clipped second line. */}
          <li role="presentation" aria-hidden="true" className="-me-2 h-10" />
          <OverflowObserverProvider root={nav}>
            <UnderlineNavRegistryContext.Provider value={register}>{children}</UnderlineNavRegistryContext.Provider>
          </OverflowObserverProvider>
        </ul>
        <div
          data-component="UnderlineNav.MoreButtonContainer"
          className="items-center [display:var(--underline-nav-more-display)]"
        >
          <div aria-hidden="true" className="mx-1 inline-block h-6 w-0 border-l border-muted" />
          <ActionMenu open={isMenuOpen} onOpenChange={open => setIsMenuOpen(open)}>
            <ActionMenu.Button
              variant="invisible"
              aria-label={isCurrentOverflowing ? 'More items, including current item' : undefined}
              data-current={isCurrentOverflowing || undefined}
              className="relative m-0 font-normal data-[current]:font-semibold data-[current]:after:pointer-events-none data-[current]:after:absolute data-[current]:after:inset-x-0 data-[current]:after:bottom-0 data-[current]:after:-mb-[9px] data-[current]:after:h-0.5 data-[current]:after:bg-[var(--underlineNav-borderColor-active,#fd8c73)] data-[current]:after:content-[''] forced-colors:data-[current]:after:bg-[LinkText]"
            >
              <span>
                More<VisuallyHidden> items</VisuallyHidden>
              </span>
            </ActionMenu.Button>
            <ActionMenu.Content>
              {overflowItems.map(item => renderOverflowItem(item, loadingCounters))}
            </ActionMenu.Content>
          </ActionMenu>
        </div>
      </Component>
    </UnderlineNavContext.Provider>
  )
})

export interface UnderlineNavItemProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'data-component' | 'onSelect'> {
  /**
   * Element to render, such as a router link component. Native anchors default to `href="#"`; custom components
   * receive no default `href`, so they can supply their own navigation target.
   */
  as?: React.ElementType
  /** Number shown after the label. */
  counter?: number | string
  /** Icon shown before the label. */
  leadingVisual?: React.ReactNode
  /** Called when the item is activated, from the bar or from the "More" menu. */
  onSelect?: (event: React.MouseEvent<HTMLElement>) => void
}
const Item = React.forwardRef<HTMLElement, UnderlineNavItemProps>(function UnderlineNavItem(
  {
    as: Component = 'a',
    className,
    children,
    counter,
    href,
    leadingVisual,
    onClick,
    onSelect,
    tabIndex,
    'aria-current': ariaCurrent,
    ...props
  },
  ref,
) {
  const {hideIconsBreakpoint, loadingCounters} = React.useContext(UnderlineNavContext)
  const register = React.useContext(UnderlineNavRegistryContext)
  const [item, setItem] = React.useState<HTMLLIElement | null>(null)
  const isOverflowing = useIsClipped(item)
  useRegisterOverflowItem(
    register,
    item,
    isOverflowing
      ? {
          ...props,
          as: Component,
          'aria-current': ariaCurrent,
          children,
          counter,
          href,
          onClick,
          onSelect,
        }
      : null,
  )

  return (
    <li
      ref={setItem}
      aria-hidden={isOverflowing || undefined}
      data-component="UnderlineNav.Item"
      className="flex flex-col items-center overflow-hidden"
    >
      <Component
        {...props}
        {...getHrefProps(Component, href)}
        ref={ref}
        aria-current={ariaCurrent}
        data-current={isCurrent(ariaCurrent) || undefined}
        tabIndex={isOverflowing ? -1 : tabIndex}
        className={cn(underlineItemClassName, className)}
        onClick={(event: React.MouseEvent<HTMLAnchorElement>) => selectItem(event, onClick, onSelect)}
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

export const UnderlineNav = Object.assign(Root, {Item})
Root.displayName = 'UnderlineNav'
Item.displayName = 'UnderlineNav.Item'
