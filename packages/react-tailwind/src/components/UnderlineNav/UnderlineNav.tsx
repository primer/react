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
import type {BroadAsProps, PolymorphicPropsWithDefaultRef} from '../../utils/types/component'
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
  xsmall: 'primer:@max-[320px]/underline-nav:hidden',
  small: 'primer:@max-[544px]/underline-nav:hidden',
  medium: 'primer:@max-[768px]/underline-nav:hidden',
  large: 'primer:@max-[1012px]/underline-nav:hidden',
  xlarge: 'primer:@max-[1280px]/underline-nav:hidden',
  xxlarge: 'primer:@max-[1400px]/underline-nav:hidden',
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
      className="primer:relative primer:data-[current]:font-semibold primer:data-[current]:after:absolute primer:data-[current]:after:inset-y-0.5 primer:data-[current]:after:left-0 primer:data-[current]:after:w-0.5 primer:data-[current]:after:bg-[var(--underlineNav-borderColor-active,#fd8c73)] primer:data-[current]:after:content-[''] primer:forced-colors:data-[current]:after:bg-[LinkText]"
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
      {ariaLabel ? <h2 className="primer:sr-only">{`${ariaLabel} navigation`}</h2> : null}
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
          'primer:box-border primer:max-h-12 primer:overflow-hidden primer:border-0 primer:pb-0 primer:[--underline-nav-more-display:none] primer:data-[has-overflow]:[--underline-nav-more-display:flex]',
          variant === 'inset' ? 'primer:px-4' : '',
          className,
        )}
      >
        {/* Matches Primer React: Safari drops list semantics from `list-style: none` lists without an explicit role. */}
        {/* eslint-disable-next-line jsx-a11y/no-redundant-roles */}
        <ul
          role="list"
          className={cn(
            underlineListClassName,
            'primer:min-w-0 primer:grow primer:flex-wrap primer:overflow-hidden primer:[contain:layout]',
          )}
        >
          {/* An empty first item lets even the first real item wrap onto the clipped second line. */}
          <li role="presentation" aria-hidden="true" className="primer:-me-2 primer:h-10" />
          <OverflowObserverProvider root={nav}>
            <UnderlineNavRegistryContext.Provider value={register}>{children}</UnderlineNavRegistryContext.Provider>
          </OverflowObserverProvider>
        </ul>
        <div
          data-component="UnderlineNav.MoreButtonContainer"
          className="primer:items-center primer:[display:var(--underline-nav-more-display)]"
        >
          <div
            aria-hidden="true"
            className="primer:mx-1 primer:inline-block primer:h-6 primer:w-0 primer:border-l primer:border-muted"
          />
          <ActionMenu open={isMenuOpen} onOpenChange={open => setIsMenuOpen(open)}>
            <ActionMenu.Button
              variant="invisible"
              aria-label={isCurrentOverflowing ? 'More items, including current item' : undefined}
              data-current={isCurrentOverflowing || undefined}
              className="primer:relative primer:m-0 primer:font-normal primer:data-[current]:font-semibold primer:data-[current]:after:pointer-events-none primer:data-[current]:after:absolute primer:data-[current]:after:inset-x-0 primer:data-[current]:after:bottom-0 primer:data-[current]:after:-mb-[9px] primer:data-[current]:after:h-0.5 primer:data-[current]:after:bg-[var(--underlineNav-borderColor-active,#fd8c73)] primer:data-[current]:after:content-[''] primer:forced-colors:data-[current]:after:bg-[LinkText]"
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

interface UnderlineNavItemOwnProps {
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

export type UnderlineNavItemProps<As extends React.ElementType = never> = PolymorphicPropsWithDefaultRef<
  As,
  UnderlineNavItemOwnProps,
  'a',
  HTMLElement
>

const ItemRoot = React.forwardRef<
  HTMLElement,
  UnderlineNavItemOwnProps & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'data-component' | 'onSelect'>
>(function UnderlineNavItem(
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
      className="primer:flex primer:flex-col primer:items-center primer:overflow-hidden"
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

Root.displayName = 'UnderlineNav'
ItemRoot.displayName = 'UnderlineNav.Item'
const Item = ItemRoot as {
  <As extends React.ElementType>(props: UnderlineNavItemProps<As> & {as: As}): React.ReactElement | null
  (props: UnderlineNavItemProps<'a'>): React.ReactElement | null
  <As extends React.ElementType>(props: BroadAsProps<As, UnderlineNavItemProps>): React.ReactElement | null
  displayName?: string
}
export const UnderlineNav = Object.assign(Root, {Item})
