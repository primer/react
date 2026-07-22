import {ChevronDownIcon, PlusIcon, type Icon} from '@primer/octicons-react'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import React, {isValidElement} from 'react'
import {clsx} from 'clsx'
import type {
  ActionListProps,
  ActionListTrailingActionProps,
  ActionListDividerProps,
  ActionListLeadingVisualProps,
  ActionListTrailingVisualProps,
  ActionListGroupHeadingProps,
} from '../ActionList'
import {ActionList} from '../ActionList'
import {SubItem} from '../ActionList/Item'
import {ActionListContainerContext} from '../ActionList/ActionListContainerContext'
import {useId} from '../hooks/useId'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import classes from '../ActionList/ActionList.module.css'
import navListClasses from './NavList.module.css'
import {flushSync} from 'react-dom'
import {useSlots} from '../hooks/useSlots'
import {fixedForwardRef, type PolymorphicProps} from '../utils/modern-polymorphic'
import HeadingComponent from '../Heading'
import visuallyHiddenClasses from '../_VisuallyHidden.module.css'
import type {FCWithSlotMarker} from '../utils/types/Slots'

type HeadingLevels = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

// NavList establishes a shallow hierarchy: the NavList itself is named by a
// heading (h2 or h3) and its groups render one level deeper (h3 or h4). We don't
// expose an h1 (that's the page title) and we don't go deeper than h4.
type NavListHeadingLevels = 'h2' | 'h3'

// Publishes the resolved numeric level of a NavList.Heading (e.g. 2 for an h2) so
// NavList.Group/NavList.GroupHeading can default to one level deeper. `null` when
// there is no NavList.Heading, in which case groups keep their historical h3 default.
const NavListHeadingLevelContext = React.createContext<number | null>(null)

function headingTagToLevel(as: NavListHeadingLevels): number {
  return Number.parseInt(as.slice(1), 10)
}

function levelToHeadingTag(level: number): HeadingLevels {
  // Clamp to h4 so group headings never go deeper than the supported hierarchy.
  const clamped = Math.min(Math.max(level, 1), 4)
  return `h${clamped}` as HeadingLevels
}

// ----------------------------------------------------------------------------
// NavList

export type NavListProps = {
  children: React.ReactNode
  /**
   * Style variations for the underlying `ActionList`. See `ActionList`'s `variant` prop for details.
   */
  variant?: ActionListProps['variant']
} & React.ComponentProps<'nav'>

const Root = React.forwardRef<HTMLElement, NavListProps>(
  ({children, 'aria-label': ariaLabel, 'aria-labelledby': ariaLabelledby, variant, ...props}, ref) => {
    const [slots, childrenWithoutHeading] = useSlots(children, {
      heading: Heading,
    })

    const fallbackHeadingId = useId()
    const heading = slots.heading
    const headingId = heading ? (heading.props.id ?? fallbackHeadingId) : undefined
    const headingLevel = heading ? headingTagToLevel(heading.props.as ?? 'h2') : null

    // Don't override a consumer-supplied accessible name; otherwise label the
    // <nav> landmark with the heading so it gets an accessible name automatically.
    const navLabelledby = ariaLabelledby ?? (ariaLabel ? undefined : headingId)

    return (
      <nav {...props} aria-label={ariaLabel} aria-labelledby={navLabelledby} ref={ref} data-component="NavList">
        <NavListHeadingLevelContext.Provider value={headingLevel}>
          {heading ? React.cloneElement(heading, {id: headingId}) : null}
          <ActionListContainerContext.Provider
            value={{
              container: 'NavList',
            }}
          >
            <ActionList variant={variant}>{childrenWithoutHeading}</ActionList>
          </ActionListContainerContext.Provider>
        </NavListHeadingLevelContext.Provider>
      </nav>
    )
  },
)

Root.displayName = 'NavList'

// ----------------------------------------------------------------------------
// NavList.Heading

export type NavListHeadingProps = {
  /** Semantic heading level for the NavList. Also sets the default level for child group headings, which render one level deeper. */
  as?: NavListHeadingLevels
  /** Visually hide the heading while keeping it available to assistive technology. */
  visuallyHidden?: boolean
} & React.ComponentPropsWithoutRef<'h2'>

const Heading: FCWithSlotMarker<NavListHeadingProps> = ({
  as = 'h2',
  visuallyHidden = false,
  className,
  children,
  ...props
}) => {
  return (
    <HeadingComponent
      as={as}
      variant="small"
      className={clsx(
        // Apply the visually-hidden styles directly to the heading rather than wrapping
        // it in a span (a heading isn't valid phrasing content inside a span).
        visuallyHidden ? visuallyHiddenClasses.InternalVisuallyHidden : navListClasses.Heading,
        className,
      )}
      data-component="NavList.Heading"
      {...props}
    >
      {children}
    </HeadingComponent>
  )
}

Heading.displayName = 'NavList.Heading'
Heading.__SLOT__ = Symbol('NavList.Heading')

// ----------------------------------------------------------------------------
// NavList.Item

export type NavListItemProps<As extends React.ElementType = React.ElementType> = PolymorphicProps<
  As,
  'a',
  {
    children: React.ReactNode
    defaultOpen?: boolean
    href?: string
    'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' | boolean
    inactiveText?: string
  }
>

const ItemComponent = fixedForwardRef(
  <As extends React.ElementType = 'a'>(
    {'aria-current': ariaCurrent, children, defaultOpen, as: Component, ...props}: NavListItemProps<As>,
    ref: React.ForwardedRef<unknown>,
  ) => {
    const {depth} = React.useContext(SubNavContext)

    // Extract SubNav from children; useSlots also returns `rest` with TrailingAction filtered out.
    const [slots, childrenWithoutSubNavOrTrailingAction] = useSlots(children, {
      subNav: SubNav,
      trailingAction: TrailingAction,
    })
    const subNav = slots.subNav

    if (!isValidElement(subNav) && defaultOpen)
      // eslint-disable-next-line no-console
      console.error('NavList.Item must have a NavList.SubNav to use defaultOpen.')

    // Render ItemWithSubNav if SubNav is present
    if (subNav && isValidElement(subNav)) {
      return (
        <ItemWithSubNav
          subNav={subNav}
          depth={depth}
          defaultOpen={defaultOpen}
          style={{'--subitem-depth': depth} as React.CSSProperties}
        >
          {childrenWithoutSubNavOrTrailingAction}
        </ItemWithSubNav>
      )
    }

    // Type safety for the polymorphic `as` prop is enforced at the
    // Item boundary via fixedForwardRef. Internally we widen
    // LinkItem's type so TypeScript doesn't re-check the generic
    // constraint across two polymorphic layers.
    const InternalLinkItem: React.ElementType = ActionList.LinkItem
    return (
      <InternalLinkItem
        ref={ref}
        as={Component}
        aria-current={ariaCurrent}
        active={Boolean(ariaCurrent) && ariaCurrent !== 'false'}
        style={{'--subitem-depth': depth} as React.CSSProperties}
        data-component="NavList.Item"
        {...props}
      >
        {children}
      </InternalLinkItem>
    )
  },
)

const Item = Object.assign(ItemComponent, {displayName: 'NavList.Item'})

// ----------------------------------------------------------------------------
// ItemWithSubNav (internal)

type ItemWithSubNavProps = {
  children: React.ReactNode
  subNav: React.ReactNode
  depth: number
  defaultOpen?: boolean
  style: React.CSSProperties
}

const ItemWithSubNavContext = React.createContext<{buttonId: string; subNavId: string; isOpen: boolean}>({
  buttonId: '',
  subNavId: '',
  isOpen: false,
})

function hasCurrentNavItem(node: React.ReactNode): boolean {
  if (
    !isValidElement<{
      children?: React.ReactNode
      'aria-current'?: NavListItemProps['aria-current']
    }>(node)
  ) {
    return false
  }

  const ariaCurrent = node.props['aria-current']
  if (Boolean(ariaCurrent) && ariaCurrent !== 'false') {
    return true
  }

  if (!node.props.children) {
    return false
  }

  return React.Children.toArray(node.props.children).some(hasCurrentNavItem)
}

function ItemWithSubNav({children, subNav, depth: _depth, defaultOpen, style}: ItemWithSubNavProps) {
  const buttonId = useId()
  const subNavId = useId()

  // We have to use recursion to check if the current nav item is part of the subnav before initial render
  // which is why we can't use the querySelector on the ref as it will cause the parent item to blink during first render.
  const hasCurrentItem = React.useMemo(() => hasCurrentNavItem(subNav), [subNav])
  const [isOpen, setIsOpen] = React.useState((defaultOpen || null) ?? hasCurrentItem)
  const subNavRef = React.useRef<HTMLUListElement>(null)
  const [containsCurrentItem, setContainsCurrentItem] = React.useState(hasCurrentItem)

  useIsomorphicLayoutEffect(() => {
    // The React tree check handles the initial render before refs exist. The DOM fallback handles custom link
    // components that compute aria-current internally instead of receiving it as a prop.
    // valid values: page, step, location, date, time, true and false
    const currentItem =
      hasCurrentNavItem(subNav) || Boolean(subNavRef.current?.querySelector('[aria-current]:not([aria-current=false])'))
    setContainsCurrentItem(currentItem)

    if (currentItem) {
      setIsOpen(true)
    }
  }, [subNav, buttonId])

  return (
    <ItemWithSubNavContext.Provider value={{buttonId, subNavId, isOpen}}>
      <ActionList.Item
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={subNavId}
        active={!isOpen && containsCurrentItem}
        onSelect={() => setIsOpen(open => !open)}
        style={style}
        data-component="NavList.Item"
      >
        {children}
        {/* What happens if the user provides a TrailingVisual? */}
        <ActionList.TrailingVisual>
          <ChevronDownIcon className={classes.ExpandIcon} />
        </ActionList.TrailingVisual>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <SubItem>{React.cloneElement(subNav as React.ReactElement<any>, {ref: subNavRef})}</SubItem>
      </ActionList.Item>
    </ItemWithSubNavContext.Provider>
  )
}

// ----------------------------------------------------------------------------
// NavList.SubNav

export type NavListSubNavProps = {
  children: React.ReactNode
}

const SubNavContext = React.createContext<{depth: number}>({depth: 0})

// NOTE: SubNav must be a direct child of an Item
const SubNav = React.forwardRef<HTMLUListElement, NavListSubNavProps>(({children}, forwardedRef) => {
  const {buttonId, subNavId} = React.useContext(ItemWithSubNavContext)
  const {depth} = React.useContext(SubNavContext)
  if (!buttonId || !subNavId) {
    // eslint-disable-next-line no-console
    console.error('NavList.SubNav must be a child of a NavList.Item')
  }

  if (depth > 3) {
    // TODO: write a more informative error message that directs people to rethink their IA
    // eslint-disable-next-line no-console
    console.error('NavList.SubNav only supports four levels of nesting')
    return null
  }

  return (
    <SubNavContext.Provider value={{depth: depth + 1}}>
      <ul
        className={classes.SubGroup}
        id={subNavId}
        aria-labelledby={buttonId}
        ref={forwardedRef}
        data-component="NavList.SubNav"
      >
        {children}
      </ul>
    </SubNavContext.Provider>
  )
}) as PolymorphicForwardRefComponent<'ul', NavListSubNavProps>

SubNav.displayName = 'NavList.SubNav'

// ----------------------------------------------------------------------------
// NavList.LeadingVisual

export type NavListLeadingVisualProps = ActionListLeadingVisualProps

const LeadingVisual = ActionList.LeadingVisual

LeadingVisual.displayName = 'NavList.LeadingVisual'

// ----------------------------------------------------------------------------
// NavList.TrailingVisual

export type NavListTrailingVisualProps = ActionListTrailingVisualProps

const TrailingVisual = ActionList.TrailingVisual

TrailingVisual.displayName = 'NavList.TrailingVisual'

// ----------------------------------------------------------------------------
// NavList.Divider

export type NavListDividerProps = ActionListDividerProps

const Divider = ActionList.Divider

Divider.displayName = 'NavList.Divider'

// NavList.TrailingAction

export type NavListTrailingActionProps = ActionListTrailingActionProps

const TrailingAction = ActionList.TrailingAction

TrailingAction.displayName = 'NavList.TrailingAction'

// ----------------------------------------------------------------------------
// NavList.Group

export type NavListGroupProps = React.HTMLAttributes<HTMLLIElement> & {
  children: React.ReactNode
  title?: string
  hideDivider?: boolean
}

const Group: React.FC<NavListGroupProps> = ({title, children, hideDivider, ...props}) => {
  const headingLevel = React.useContext(NavListHeadingLevelContext)
  // Default the group heading to one level below the NavList.Heading (h3 under an
  // h2, h4 under an h3), falling back to h3 when there is no NavList.Heading. To
  // use a different level, pass NavList.GroupHeading with an explicit `as` instead.
  const groupHeadingAs = headingLevel ? levelToHeadingTag(headingLevel + 1) : 'h3'
  return (
    <>
      {!hideDivider && <ActionList.Divider />}
      <ActionList.Group {...props}>
        {title ? (
          <ActionList.GroupHeading as={groupHeadingAs} data-component="ActionList.GroupHeading">
            {title}
          </ActionList.GroupHeading>
        ) : null}
        {children}
      </ActionList.Group>
    </>
  )
}
// ----------------------------------------------------------------------------
// NavList.GroupExpand

type GroupItem = {
  text: string
  trailingVisual?: Icon | string
  leadingVisual?: Icon
  trailingAction?: ActionListTrailingActionProps
  'data-expand-focus-target'?: string
} & Omit<NavListItemProps, 'children'>

export type NavListGroupExpandProps = {
  label?: string
  pages?: number
  items: GroupItem[]
  renderItem?: (item: GroupItem) => React.ReactNode
}

export const GroupExpand = React.forwardRef<HTMLButtonElement, NavListGroupExpandProps>(
  ({label = 'Show more', pages = 0, items, renderItem, ...props}, forwardedRef) => {
    const [currentPage, setCurrentPage] = React.useState(0)
    const groupId = useId()

    const itemsPerPage = items.length / pages
    const amountToShow = pages === 0 ? items.length : Math.ceil(itemsPerPage * currentPage)
    const focusTargetIndex = currentPage === 1 ? 0 : amountToShow - Math.floor(itemsPerPage)

    return (
      <>
        {currentPage > 0 ? (
          <>
            {items.map((itemArr, index) => {
              const {
                text,
                trailingVisual: TrailingVisualIcon,
                leadingVisual: LeadingVisualIcon,
                trailingAction,
                ...rest
              } = itemArr
              const {icon, label: actionLabel, ...actionProps} = trailingAction || {}
              const focusTarget = index === focusTargetIndex ? groupId : undefined

              if (index < amountToShow) {
                if (renderItem) {
                  return renderItem({
                    ...itemArr,
                    ['data-expand-focus-target']: focusTarget,
                  })
                }
                return (
                  <Item {...rest} key={index} data-expand-focus-target={focusTarget}>
                    {LeadingVisualIcon ? (
                      <LeadingVisual>
                        <LeadingVisualIcon />
                      </LeadingVisual>
                    ) : null}
                    {text}
                    {TrailingVisualIcon ? (
                      <TrailingVisual>
                        <TrailingVisualIcon />
                      </TrailingVisual>
                    ) : null}
                    {trailingAction ? <TrailingAction {...actionProps} icon={icon} label={actionLabel || ''} /> : null}
                  </Item>
                )
              }
            })}
          </>
        ) : null}

        {currentPage < pages || currentPage === 0 ? (
          <ActionList.Item
            as="button"
            aria-expanded="false"
            ref={forwardedRef}
            onSelect={() => {
              flushSync(() => {
                setCurrentPage(currentPage + 1)
              })
              const focusTarget: HTMLElement[] | null = Array.from(
                document.querySelectorAll(`[data-expand-focus-target="${groupId}"]`),
              )

              if (focusTarget.length > 0) {
                focusTarget[focusTarget.length - 1].focus()
              }
            }}
            {...props}
          >
            {label}
            <TrailingVisual>
              <PlusIcon />
            </TrailingVisual>
          </ActionList.Item>
        ) : null}
      </>
    )
  },
)

// ----------------------------------------------------------------------------
// NavList.GroupHeading

export type NavListGroupHeadingProps = ActionListGroupHeadingProps

/**
 * This is an alternative to the `title` prop on `NavList.Group`.
 * It was primarily added to allow links in group headings.
 */
const GroupHeading: React.FC<NavListGroupHeadingProps> = ({as, className, ...rest}) => {
  const headingLevel = React.useContext(NavListHeadingLevelContext)
  const resolvedAs = as ?? (headingLevel ? levelToHeadingTag(headingLevel + 1) : 'h3')
  return (
    <ActionList.GroupHeading
      as={resolvedAs}
      className={clsx(navListClasses.GroupHeading, className)}
      data-component="NavList.GroupHeading"
      headingWrapElement="li"
      {...rest}
    />
  )
}

// ----------------------------------------------------------------------------
// Export

export const NavList = Object.assign(Root, {
  Description: ActionList.Description,
  Heading,
  Item,
  SubNav,
  LeadingVisual,
  TrailingVisual,
  TrailingAction,
  Divider,
  Group,
  GroupExpand,
  GroupHeading,
})
