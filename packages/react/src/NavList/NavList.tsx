import {ChevronDownIcon, PlusIcon} from '@primer/octicons-react'
import type {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import React, {isValidElement} from 'react'
import styled from 'styled-components'
import type {ActionListDividerProps, ActionListLeadingVisualProps, ActionListTrailingVisualProps} from '../ActionList'
import {ActionList} from '../ActionList'
import Box from '../Box'
import Octicon from '../Octicon'
import type {SxProp} from '../sx'
import sx, {merge} from '../sx'
import {defaultSxProp} from '../utils/defaultSxProp'
import {useId} from '../hooks/useId'
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect'

const getSubnavStyles = (depth: number) => {
  return {
    paddingLeft: depth > 0 ? depth + 2 : null, // Indent sub-items
    fontSize: depth > 0 ? 0 : null, // Reduce font size of sub-items
    fontWeight: depth > 0 ? 'normal' : null, // Sub-items don't get bolded
  }
}

// ----------------------------------------------------------------------------
// NavList

export type NavListProps = {
  children: React.ReactNode
} & SxProp &
  React.ComponentProps<'nav'>

const NavBox = styled.nav<SxProp>(sx)

const Root = React.forwardRef<HTMLElement, NavListProps>(({children, ...props}, ref) => {
  return (
    <NavBox {...props} ref={ref}>
      <ActionList>{children}</ActionList>
    </NavBox>
  )
})

Root.displayName = 'NavList'

// ----------------------------------------------------------------------------
// NavList.Item

export type NavListItemProps = {
  children: React.ReactNode
  defaultItemsVisible?: number
  defaultOpen?: boolean
  href?: string
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' | boolean
  inactiveText?: string
} & SxProp

const Item = React.forwardRef<HTMLAnchorElement, NavListItemProps>(
  (
    {'aria-current': ariaCurrent, children, defaultOpen, defaultItemsVisible, sx: sxProp = defaultSxProp, ...props},
    ref,
  ) => {
    const {depth} = React.useContext(SubNavContext)

    // Get SubNav from children
    const subNav = React.Children.toArray(children).find(child => isValidElement(child) && child.type === SubNav)

    // Get ShowMoreItemsNav from children
    const showMoreItemsNav = React.Children.toArray(children).find(
      child => isValidElement(child) && child.type === ShowMoreItemsNav,
    )

    // Get children without SubNav and without ShowMoreItemsNav
    const childrenWithoutSubNavOrShowMoreItemsNav = React.Children.toArray(children).filter(child =>
      isValidElement(child) ? child.type !== SubNav && child.type !== ShowMoreItemsNav : true,
    )

    if (!isValidElement(showMoreItemsNav) && defaultItemsVisible)
      // eslint-disable-next-line no-console
      console.error('NavList.Item must have a NavList.ShowMoreItemsNav to use defaultItemsVisible.')

    if (!isValidElement(subNav) && defaultOpen)
      // eslint-disable-next-line no-console
      console.error('NavList.Item must have a NavList.SubNav to use defaultOpen.')

    // Render ItemWithSubNav if SubNav is present
    if (subNav && isValidElement(subNav)) {
      return (
        <ItemWithSubNav subNav={subNav} depth={depth} defaultOpen={defaultOpen} sx={sxProp}>
          {childrenWithoutSubNavOrShowMoreItemsNav}
        </ItemWithSubNav>
      )
    }

    if (showMoreItemsNav && isValidElement(showMoreItemsNav)) {
      return (
        <ItemWithShowMoreItemsNav
          showMoreItemsNav={showMoreItemsNav}
          defaultItemsVisible={defaultItemsVisible}
          sx={sxProp}
        >
          {childrenWithoutSubNavOrShowMoreItemsNav}
        </ItemWithShowMoreItemsNav>
      )
    }

    return (
      <ActionList.LinkItem
        ref={ref}
        aria-current={ariaCurrent}
        active={Boolean(ariaCurrent) && ariaCurrent !== 'false'}
        sx={merge<SxProp['sx']>(getSubnavStyles(depth), sxProp)}
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
} & SxProp

const ItemWithSubNavContext = React.createContext<{buttonId: string; subNavId: string; isOpen: boolean}>({
  buttonId: '',
  subNavId: '',
  isOpen: false,
})

// TODO: ref prop
// TODO: Animate open/close transition
function ItemWithSubNav({children, subNav, depth, defaultOpen, sx: sxProp = defaultSxProp}: ItemWithSubNavProps) {
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
// ItemWithShowMoreItemsNav (internal)

type ItemWithShowMoreItemsNavProps = {
  children: React.ReactNode
  showMoreItemsNav: React.ReactNode
  defaultItemsVisible?: number
} & SxProp

const ItemWithShowMoreItemsNavContext = React.createContext<{
  buttonId: string
  showMoreItemsNavId: string
  initialItemsVisible: number
  expanded: boolean
}>({
  buttonId: '',
  showMoreItemsNavId: '',
  initialItemsVisible: 5,
  expanded: false,
})

function ItemWithShowMoreItemsNav({
  children,
  showMoreItemsNav,
  defaultItemsVisible,
  sx: sxProp = defaultSxProp,
}: ItemWithShowMoreItemsNavProps) {
  const showMoreItemsNavRef = React.useRef<HTMLDivElement>(null)
  const buttonId = useId()
  const showMoreItemsNavId = useId()

  const [initialItemsVisible] = React.useState((defaultItemsVisible || null) ?? 5)
  const [expanded, setExpanded] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    if (showMoreItemsNavRef.current) {
      const listItems = showMoreItemsNavRef.current.querySelectorAll('li')
      if (listItems.length < initialItemsVisible - 1) {
        setExpanded(true)
      }
      // Check if ShowMoreItemsNav contains current item
      // valid values: page, step, location, date, time, true and false
      const currentItem = showMoreItemsNavRef.current.querySelector('[aria-current]:not([aria-current=false])')
      // Check index of currentItem and if it's more than itemsCurrentlyVisible
      if (currentItem) {
        setExpanded(true)
      }
    }
  }, [showMoreItemsNav, buttonId])

  // const [containsCurrentItem, setContainsCurrentItem] = React.useState(false)

  return (
    <ItemWithShowMoreItemsNavContext.Provider value={{buttonId, showMoreItemsNavId, initialItemsVisible, expanded}}>
      <div ref={showMoreItemsNavRef}>{showMoreItemsNav}</div>
      {!expanded && (
        <ActionList.Item as="button" id={buttonId} onClick={() => setExpanded(true)} sx={sxProp}>
          {children}
          <ActionList.TrailingVisual>
            <Octicon icon={PlusIcon} />
          </ActionList.TrailingVisual>
        </ActionList.Item>
      )}
    </ItemWithShowMoreItemsNavContext.Provider>
  )
}

// ----------------------------------------------------------------------------
// NavList.SubNav

export type NavListSubNavProps = {
  children: React.ReactNode
} & SxProp

const SubNavContext = React.createContext<{depth: number}>({depth: 0})

// TODO: ref prop
// NOTE: SubNav must be a direct child of an Item
const SubNav = ({children, sx: sxProp = defaultSxProp}: NavListSubNavProps) => {
  const {buttonId, subNavId, isOpen} = React.useContext(ItemWithSubNavContext)
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
}

SubNav.displayName = 'NavList.SubNav'

// ----------------------------------------------------------------------------
// NavList.ShowMoreItemsNav

export type NavListShowMoreItemsNavProps = {
  children: React.ReactNode
} & SxProp

// TODO: ref prop
// NOTE: SubNav must be a direct child of an Item
const ShowMoreItemsNav = ({children, sx: sxProp = defaultSxProp}: NavListShowMoreItemsNavProps) => {
  const {buttonId, showMoreItemsNavId, expanded, initialItemsVisible} = React.useContext(
    ItemWithShowMoreItemsNavContext,
  )

  let itemsToShow = children
  if (!expanded) {
    itemsToShow = children?.slice(0, initialItemsVisible)
  }

  if (!buttonId || !showMoreItemsNavId) {
    // eslint-disable-next-line no-console
    console.error('NavList.ShowMoreItemsNav must be a child of a NavList.Item')
  }

  return (
    <Box as="ul" id={showMoreItemsNavId} sx={sxProp}>
      {itemsToShow}
    </Box>
  )
}

ShowMoreItemsNav.displayName = 'NavList.ShowMoreItemsNav'

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

// ----------------------------------------------------------------------------
// NavList.Group

export type NavListGroupProps = {
  children: React.ReactNode
  title?: string
} & SxProp

const defaultSx = {}
// TODO: ref prop
const Group: React.FC<NavListGroupProps> = ({title, children, sx: sxProp = defaultSx, ...props}) => {
  return (
    <>
      {/* Hide divider if the group is the first item in the list */}
      <ActionList.Divider sx={{'&:first-child': {display: 'none'}}} />
      <ActionList.Group {...props} sx={sxProp}>
        {/* Setting up the default value for the heading level. TODO: API update to give flexibility to NavList.Group title's heading level */}
        {title ? <ActionList.GroupHeading as="h3">{title}</ActionList.GroupHeading> : null}
        {children}
      </ActionList.Group>
    </>
  )
}

Group.displayName = 'NavList.Group'

// ----------------------------------------------------------------------------
// Export

export const NavList = Object.assign(Root, {
  Item,
  SubNav,
  ShowMoreItemsNav,
  LeadingVisual,
  TrailingVisual,
  Divider,
  Group,
})
