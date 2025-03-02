import {ChevronDownIcon, PlusIcon, type Icon} from '@primer/octicons-react'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import React, {isValidElement} from 'react'
import styled from 'styled-components'
import type {
  ActionListTrailingActionProps,
  ActionListDividerProps,
  ActionListLeadingVisualProps,
  ActionListTrailingVisualProps,
  ActionListGroupHeadingProps,
} from '../ActionList'
import {ActionList} from '../ActionList'
import {SubItem} from '../ActionList/Item'
import {ActionListContainerContext} from '../ActionList/ActionListContainerContext'
import Box from '../Box'
import Octicon from '../Octicon'
import type {SxProp} from '../sx'
import sx, {merge} from '../sx'
import {defaultSxProp} from '../utils/defaultSxProp'
import {useId} from '../hooks/useId'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'
import {useFeatureFlag} from '../FeatureFlags'
import classes from '../ActionList/ActionList.module.css'
import {toggleStyledComponent} from '../internal/utils/toggleStyledComponent'
import {flushSync} from 'react-dom'

const getSubnavStyles = (depth: number) => {
  return {
    paddingLeft: depth > 0 ? depth + 2 : null, // Indent sub-items
    fontSize: depth > 0 ? 0 : 1, // Reduce font size of sub-items
    fontWeight: depth > 0 ? 'normal' : null, // Sub-items don't get bolded
  }
}

// ----------------------------------------------------------------------------
// NavList

export type NavListProps = {
  children: React.ReactNode
} & SxProp &
  React.ComponentProps<'nav'>

const NavBox = toggleStyledComponent('primer_react_css_modules_ga', 'nav', styled.nav<SxProp>(sx))

const Root = React.forwardRef<HTMLElement, NavListProps>(({children, ...props}, ref) => {
  return (
    <NavBox {...props} ref={ref}>
      <ActionListContainerContext.Provider
        value={{
          container: 'NavList',
        }}
      >
        <ActionList>{children}</ActionList>
      </ActionListContainerContext.Provider>
    </NavBox>
  )
})

Root.displayName = 'NavList'

// ----------------------------------------------------------------------------
// NavList.Item

export type NavListItemProps = {
  children: React.ReactNode
  defaultOpen?: boolean
  href?: string
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' | boolean
  inactiveText?: string
} & SxProp

const Item = React.forwardRef<HTMLAnchorElement, NavListItemProps>(
  ({'aria-current': ariaCurrent, children, defaultOpen, sx: sxProp = defaultSxProp, ...props}, ref) => {
    const enabled = useFeatureFlag('primer_react_css_modules_ga')
    const {depth} = React.useContext(SubNavContext)

    // Get SubNav from children
    const subNav = React.Children.toArray(children).find(child => isValidElement(child) && child.type === SubNav)

    // Get children without SubNav or TrailingAction
    const childrenWithoutSubNavOrTrailingAction = React.Children.toArray(children).filter(child =>
      isValidElement(child) ? child.type !== SubNav && child.type !== TrailingAction : true,
    )

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
          sx={sxProp}
          style={{'--subitem-depth': depth} as React.CSSProperties}
        >
          {childrenWithoutSubNavOrTrailingAction}
        </ItemWithSubNav>
      )
    }

    return (
      <ActionList.LinkItem
        ref={ref}
        aria-current={ariaCurrent}
        active={Boolean(ariaCurrent) && ariaCurrent !== 'false'}
        sx={enabled ? undefined : merge<SxProp['sx']>(getSubnavStyles(depth), sxProp)}
        style={{'--subitem-depth': depth} as React.CSSProperties}
        {...props}
      >
        {children}
      </ActionList.LinkItem>
    )
  },
) as PolymorphicForwardRefComponent<'a', NavListItemProps>

Item.displayName = 'NavList.Item'

// ----------------------------------------------------------------------------
// ItemWithSubNav (internal)

type ItemWithSubNavProps = {
  children: React.ReactNode
  subNav: React.ReactNode
  depth: number
  defaultOpen?: boolean
  style: React.CSSProperties
} & SxProp

const ItemWithSubNavContext = React.createContext<{buttonId: string; subNavId: string; isOpen: boolean}>({
  buttonId: '',
  subNavId: '',
  isOpen: false,
})

function ItemWithSubNav({
  children,
  subNav,
  depth,
  defaultOpen,
  style = {},
  sx: sxProp = defaultSxProp,
}: ItemWithSubNavProps) {
  const buttonId = useId()
  const subNavId = useId()
  const [isOpen, setIsOpen] = React.useState((defaultOpen || null) ?? false)
  const subNavRef = React.useRef<HTMLDivElement>(null)
  const [containsCurrentItem, setContainsCurrentItem] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    if (subNavRef.current) {
      // Check if SubNav contains current item
      // valid values: page, step, location, date, time, true and false
      const currentItem = subNavRef.current.querySelector('[aria-current]:not([aria-current=false])')

      if (currentItem) {
        setContainsCurrentItem(true)
        setIsOpen(true)
      }
    }
  }, [subNav, buttonId])

  const enabled = useFeatureFlag('primer_react_css_modules_ga')
  if (enabled) {
    if (sxProp !== defaultSxProp) {
      return (
        <ItemWithSubNavContext.Provider value={{buttonId, subNavId, isOpen}}>
          <ActionList.Item
            id={buttonId}
            aria-expanded={isOpen}
            aria-controls={subNavId}
            active={!isOpen && containsCurrentItem}
            onClick={() => setIsOpen(open => !open)}
            style={style}
            sx={sxProp}
          >
            {children}
            {/* What happens if the user provides a TrailingVisual? */}
            <ActionList.TrailingVisual>
              <ChevronDownIcon className={classes.ExpandIcon} />
            </ActionList.TrailingVisual>
            <SubItem>{React.cloneElement(subNav as React.ReactElement, {ref: subNavRef})}</SubItem>
          </ActionList.Item>
        </ItemWithSubNavContext.Provider>
      )
    }
    return (
      <ItemWithSubNavContext.Provider value={{buttonId, subNavId, isOpen}}>
        <ActionList.Item
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={subNavId}
          active={!isOpen && containsCurrentItem}
          onClick={() => setIsOpen(open => !open)}
          style={style}
        >
          {children}
          {/* What happens if the user provides a TrailingVisual? */}
          <ActionList.TrailingVisual>
            <ChevronDownIcon className={classes.ExpandIcon} />
          </ActionList.TrailingVisual>
          <SubItem>{React.cloneElement(subNav as React.ReactElement, {ref: subNavRef})}</SubItem>
        </ActionList.Item>
      </ItemWithSubNavContext.Provider>
    )
  }
  return (
    <ItemWithSubNavContext.Provider value={{buttonId, subNavId, isOpen}}>
      <Box as="li" aria-labelledby={buttonId} sx={{listStyle: 'none'}}>
        <ActionList.Item
          as="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={subNavId}
          // When the subNav is closed, how should we indicated that the subNav contains the current item?
          active={!isOpen && containsCurrentItem}
          onClick={() => setIsOpen(open => !open)}
          sx={merge<SxProp['sx']>(
            {
              ...getSubnavStyles(depth),
              fontWeight: containsCurrentItem ? 'bold' : null, // Parent item is bold if any of it's sub-items are current
            },
            sxProp,
          )}
        >
          {children}
          {/* What happens if the user provides a TrailingVisual? */}
          <ActionList.TrailingVisual>
            <Octicon
              icon={ChevronDownIcon}
              sx={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            />
          </ActionList.TrailingVisual>
        </ActionList.Item>

        <div ref={subNavRef}>{subNav}</div>
      </Box>
    </ItemWithSubNavContext.Provider>
  )
}

// ----------------------------------------------------------------------------
// NavList.SubNav

export type NavListSubNavProps = {
  children: React.ReactNode
} & SxProp

const SubNavContext = React.createContext<{depth: number}>({depth: 0})

// NOTE: SubNav must be a direct child of an Item
const SubNav = React.forwardRef(({children, sx: sxProp = defaultSxProp}: NavListSubNavProps, forwardedRef) => {
  const {buttonId, subNavId, isOpen} = React.useContext(ItemWithSubNavContext)
  const {depth} = React.useContext(SubNavContext)
  const enabled = useFeatureFlag('primer_react_css_modules_ga')
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

  if (enabled) {
    if (sxProp !== defaultSxProp) {
      return (
        <SubNavContext.Provider value={{depth: depth + 1}}>
          <Box
            as="ul"
            id={subNavId}
            aria-labelledby={buttonId}
            className={classes.SubGroup}
            ref={forwardedRef}
            sx={sxProp}
          >
            {children}
          </Box>
        </SubNavContext.Provider>
      )
    }
    return (
      <SubNavContext.Provider value={{depth: depth + 1}}>
        <ul className={classes.SubGroup} id={subNavId} aria-labelledby={buttonId} ref={forwardedRef}>
          {children}
        </ul>
      </SubNavContext.Provider>
    )
  }

  return (
    <SubNavContext.Provider value={{depth: depth + 1}}>
      <Box
        as="ul"
        id={subNavId}
        aria-labelledby={buttonId}
        sx={merge<SxProp['sx']>(
          {
            padding: 0,
            margin: 0,
            display: isOpen ? 'block' : 'none',
          },
          sxProp,
        )}
      >
        {children}
      </Box>
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

export type NavListGroupProps = {
  children: React.ReactNode
  title?: string
} & SxProp

const defaultSx = {}
const Group: React.FC<NavListGroupProps> = ({title, children, sx: sxProp = defaultSx, ...props}) => {
  const enabled = useFeatureFlag('primer_react_css_modules_ga')

  if (enabled) {
    if (sxProp !== defaultSx) {
      return (
        <Box sx={sxProp} as="li" data-component="ActionList.Group">
          {title ? <ActionList.GroupHeading>{title}</ActionList.GroupHeading> : null}
          {children}
        </Box>
      )
    }
    return (
      <>
        <ActionList.Divider />
        <ActionList.Group {...props}>
          {/* Setting up the default value for the heading level. TODO: API update to give flexibility to NavList.Group title's heading level */}
          {title ? (
            <ActionList.GroupHeading as="h3" data-component="ActionList.GroupHeading">
              {title}
            </ActionList.GroupHeading>
          ) : null}
          {children}
        </ActionList.Group>
      </>
    )
  }
  return (
    <>
      {/* Hide divider if the group is the first item in the list */}
      <ActionList.Divider sx={{'&:first-child': {display: 'none'}}} />
      <ActionList.Group
        {...props}
        // If somebody tries to pass the `title` prop AND a `NavList.GroupHeading` as a child, hide the `ActionList.GroupHeading`
        sx={merge<SxProp['sx']>(sxProp, {
          ':has([data-component="GroupHeadingWrap"] + ul > [data-component="GroupHeadingWrap"])': {
            '& > [data-component="GroupHeadingWrap"]': {display: 'none'},
          },
        })}
      >
        {/* Setting up the default value for the heading level. TODO: API update to give flexibility to NavList.Group title's heading level */}
        {title ? (
          <ActionList.GroupHeading as="h3" data-component="ActionList.GroupHeading">
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

    const teamEnabled = useFeatureFlag('primer_react_css_modules_team')
    const staffEnabled = useFeatureFlag('primer_react_css_modules_staff')

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
        {(currentPage < pages || currentPage === 0) && !teamEnabled && !staffEnabled ? (
          <Box as="li" sx={{listStyle: 'none'}}>
            <ActionList.Item
              as="button"
              aria-expanded="false"
              ref={forwardedRef}
              onClick={() => {
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
          </Box>
        ) : null}
        {(currentPage < pages || currentPage === 0) && (teamEnabled || staffEnabled) ? (
          <ActionList.Item
            as="button"
            aria-expanded="false"
            ref={forwardedRef}
            onClick={() => {
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
const GroupHeading: React.FC<NavListGroupHeadingProps> = ({as = 'h3', sx: sxProp = defaultSxProp, ...rest}) => {
  return (
    <ActionList.GroupHeading
      as={as}
      sx={merge<SxProp['sx']>(
        {
          '> a {': {
            color: 'var(--fgColor-default)',
            textDecoration: 'inherit',
            ':hover': {textDecoration: 'underline'},
          },
        },
        sxProp,
      )}
      data-component="NavList.GroupHeading"
      headingWrapElement="li"
      {...rest}
    />
  )
}

// ----------------------------------------------------------------------------
// Export

export const NavList = Object.assign(Root, {
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
