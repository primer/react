import {ChevronDownIcon} from '@primer/octicons-react'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '@radix-ui/react-polymorphic'
import {useSSRSafeId} from '@react-aria/ssr'
import React, {isValidElement} from 'react'
import {ActionList} from '../ActionList'
import Box from '../Box'
import StyledOcticon from '../StyledOcticon'
import {useProvidedRefOrCreate} from '../hooks'

// ----------------------------------------------------------------------------
// NavList

export type NavListProps = {
  children: React.ReactNode
} & React.ComponentProps<'nav'>

const useWarningForMissingAriaCurrent = containerRef => {
  React.useEffect(
    function checkForAriaCurrentOnMount() {
      const ariaCurrentEl = containerRef.current?.querySelector('[aria-current]')

      if (!ariaCurrentEl)
        throw new Error(`
aria-current not found on NavList.Item

To create an accessible navigation, it is required to add aria-current to the current anchor element.

See https://primer.style/react/NavList#accessibilty for more info

If you are extending NavList.Item to create a navigation element, make sure you are passing aria-current at the site of usage.
See https://primer.style/react/NavList#extend for more info.
      `)
    },
    [containerRef]
  )
}

// TODO: sx prop
const Root = React.forwardRef<HTMLElement, NavListProps>(({children, ...props}, ref) => {
  const ensureRef = useProvidedRefOrCreate(ref)
  useWarningForMissingAriaCurrent(ensureRef)

  return (
    <nav ref={ensureRef} {...props}>
      <ActionList>{children}</ActionList>
    </nav>
  )
})

Root.displayName = 'NavList'

// ----------------------------------------------------------------------------
// NavList.Item

export type NavListItemProps = {
  children: React.ReactNode
  href?: string
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' | boolean
}

// TODO: sx prop
const Item = React.forwardRef<HTMLAnchorElement, NavListItemProps>(
  ({'aria-current': ariaCurrent, children, ...props}, ref) => {
    const {depth} = React.useContext(SubNavContext)

    // Get SubNav from children
    const subNav = React.Children.toArray(children).find(child => isValidElement(child) && child.type === SubNav)

    // Get children without SubNav
    const childrenWithoutSubNav = React.Children.toArray(children).filter(child =>
      isValidElement(child) ? child.type !== SubNav : true
    )

    // Render ItemWithSubNav if SubNav is present
    if (subNav && isValidElement(subNav) && depth < 1) {
      // Search SubNav children for current Item
      const currentItem = React.Children.toArray(subNav.props.children).find(child => {
        if (!isValidElement(child)) return false

        // if direct child is SubNav.Item
        if (child.type === Item) return child.props['aria-current']
        //
        // if direct child isn't SubNav.Item
        // it's either a custom NavItem or a NextJSLikeLink

        // custom NavItem requires aria-current on the direct child
        if (child.props['aria-current']) return true

        // for NextJSLikeLink, go one level deeper
        if (typeof child.props.children === 'object') {
          const wrappedItem = child.props.children
          return wrappedItem.props['aria-current']
        }

        // we don't recognise this API usage
        return false
      })

      return (
        <ItemWithSubNav subNav={subNav} subNavContainsCurrentItem={Boolean(currentItem)}>
          {childrenWithoutSubNav}
        </ItemWithSubNav>
      )
    }

    return (
      <ActionList.LinkItem
        ref={ref}
        aria-current={ariaCurrent}
        active={Boolean(ariaCurrent) && ariaCurrent !== 'false'}
        sx={{
          paddingLeft: depth > 0 ? 5 : null, // Indent sub-items
          fontSize: depth > 0 ? 0 : null, // Reduce font size of sub-items
          fontWeight: depth > 0 ? 'normal' : null // Sub-items don't get bolded
        }}
        {...props}
      >
        {children}
      </ActionList.LinkItem>
    )
  }
) as PolymorphicForwardRefComponent<'a', NavListItemProps>

Item.displayName = 'NavList.Item'

// ----------------------------------------------------------------------------
// ItemWithSubNav (internal)

type ItemWithSubNavProps = {
  children: React.ReactNode
  subNav: React.ReactNode
  subNavContainsCurrentItem: boolean
}

const ItemWithSubNavContext = React.createContext<{buttonId: string; subNavId: string}>({
  buttonId: '',
  subNavId: ''
})

// TODO: sx prop
// TODO: ref prop
// TODO: Animate open/close transition
function ItemWithSubNav({children, subNav, subNavContainsCurrentItem}: ItemWithSubNavProps) {
  const buttonId = useSSRSafeId()
  const subNavId = useSSRSafeId()
  // SubNav starts open if current item is in it
  const [isOpen, setIsOpen] = React.useState(subNavContainsCurrentItem)

  return (
    <ItemWithSubNavContext.Provider value={{buttonId, subNavId}}>
      <Box as="li" aria-labelledby={buttonId} sx={{listStyle: 'none'}}>
        <ActionList.Item
          as="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={subNavId}
          // When the subNav is closed, how should we indicated that the subNav contains the current item?
          active={!isOpen && subNavContainsCurrentItem}
          onClick={() => setIsOpen(open => !open)}
          sx={{
            fontWeight: subNavContainsCurrentItem ? 'bold' : null // Parent item is bold if any of it's sub-items are current
          }}
        >
          {children}
          {/* What happens if the user provides a TrailingVisual? */}
          <ActionList.TrailingVisual>
            <StyledOcticon
              icon={ChevronDownIcon}
              sx={{
                transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
            />
          </ActionList.TrailingVisual>
        </ActionList.Item>

        {isOpen ? subNav : null}
      </Box>
    </ItemWithSubNavContext.Provider>
  )
}

// ----------------------------------------------------------------------------
// NavList.SubNav

type NavListSubNavProps = {
  children: React.ReactNode
}

const SubNavContext = React.createContext<{depth: number}>({depth: 0})

// TODO: sx prop
// TODO: ref prop
// NOTE: SubNav must be a direct child of an Item
const SubNav = ({children}: NavListSubNavProps) => {
  const {buttonId, subNavId} = React.useContext(ItemWithSubNavContext)
  const {depth} = React.useContext(SubNavContext)

  if (!buttonId || !subNavId) {
    // eslint-disable-next-line no-console
    console.error('NavList.SubNav must be a child of a NavList.Item')
  }

  if (depth > 0) {
    // eslint-disable-next-line no-console
    console.error('NavList.SubNav only supports one level of nesting')
    return null
  }

  return (
    <SubNavContext.Provider value={{depth: depth + 1}}>
      <Box as="ul" id={subNavId} aria-labelledby={buttonId} sx={{padding: 0, margin: 0}}>
        {children}
      </Box>
    </SubNavContext.Provider>
  )
}

SubNav.displayName = 'NavList.SubNav'

// ----------------------------------------------------------------------------
// NavList.LeadingVisual

const LeadingVisual = ActionList.LeadingVisual

LeadingVisual.displayName = 'NavList.LeadingVisual'

// ----------------------------------------------------------------------------
// NavList.TrailingVisual

const TrailingVisual = ActionList.TrailingVisual

TrailingVisual.displayName = 'NavList.TrailingVisual'

// ----------------------------------------------------------------------------
// NavList.Divider

const Divider = ActionList.Divider

Divider.displayName = 'NavList.Divider'

// ----------------------------------------------------------------------------
// NavList.Group

type NavListGroupProps = React.PropsWithChildren<{
  children: React.ReactNode
  title?: string
}>

// TODO: sx prop
// TODO: ref prop
const Group = ({title, children}: NavListGroupProps) => {
  return (
    <>
      {/* Hide divider if the group is the first item in the list */}
      <ActionList.Divider sx={{'&:first-child': {display: 'none'}}} />
      <ActionList.Group title={title}>{children}</ActionList.Group>
    </>
  )
}

Group.displayName = 'NavList.Group'

// ----------------------------------------------------------------------------
// Export

export const NavList = Object.assign(Root, {
  Item,
  SubNav,
  LeadingVisual,
  TrailingVisual,
  Divider,
  Group
})
