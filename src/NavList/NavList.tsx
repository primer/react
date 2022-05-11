import {ChevronDownIcon} from '@primer/octicons-react'
import {useSSRSafeId} from '@react-aria/ssr'
import React, {isValidElement} from 'react'
import {ActionList} from '../ActionList'
import Box from '../Box'
import StyledOcticon from '../StyledOcticon'

// ----------------------------------------------------------------------------
// NavList

export type NavListProps = {
  children: React.ReactNode
  // sx
} & React.ComponentProps<'nav'>

const Root = React.forwardRef<HTMLElement, NavListProps>(({children, ...props}, ref) => {
  return (
    <nav ref={ref} {...props}>
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
  // sx
}

const ItemContext = React.createContext<{depth: number}>({depth: 0})

const Item = React.forwardRef<HTMLAnchorElement, NavListItemProps>(
  ({href, 'aria-current': ariaCurrent, children}, ref) => {
    const {depth} = React.useContext(ItemContext)

    // TODO: Test two-level nav list
    if (depth > 1) {
      // eslint-disable-next-line no-console
      console.error('NavList only supports one level of nesting')
      return null
    }

    // Get SubNav from children
    const subNav = React.Children.toArray(children).find(child => isValidElement(child) && child.type === SubNav)

    // Get children without SubNav
    const childrenWithoutSubNav = React.Children.toArray(children).filter(child =>
      isValidElement(child) ? child.type !== SubNav : true
    )

    // Render ItemWithSubNav if SubNav is present
    if (subNav) {
      return <ItemWithSubNav subNav={subNav}>{childrenWithoutSubNav}</ItemWithSubNav>
    }

    return (
      <ActionList.LinkItem
        ref={ref}
        href={href}
        aria-current={ariaCurrent}
        sx={{
          position: 'relative',
          paddingLeft: depth === 1 ? 5 : null, // Indent sub-items
          fontSize: depth === 1 ? 0 : null, // Reduce font size of sub-items
          '&[aria-current]': {
            fontWeight: depth === 0 ? 'bold' : null, // Sub-items don't get bolded
            bg: 'actionListItem.default.selectedBg',
            '&::after': {
              position: 'absolute',
              top: 'calc(50% - 12px)',
              left: '-8px',
              width: '4px',
              height: '24px',
              content: '""',
              bg: 'accent.fg',
              borderRadius: 2
            }
          }
        }}
      >
        {children}
      </ActionList.LinkItem>
    )
  }
)

Item.displayName = 'NavList.Item'

// ----------------------------------------------------------------------------
// ItemWithSubNav (internal)

type ItemWithSubNavProps = {
  children: React.ReactNode
  subNav: React.ReactNode
  // sx
}

const ItemWithSubNavContext = React.createContext<{buttonId: string; subNavId: string}>({buttonId: '', subNavId: ''})

// TODO: Forward ref
function ItemWithSubNav({children, subNav}: ItemWithSubNavProps) {
  const buttonId = useSSRSafeId()
  const subNavId = useSSRSafeId()
  const subNavRef = React.useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = React.useState(false)
  // TODO: Check if subNav contains aria-current
  // TODO: Animation
  return (
    <ItemWithSubNavContext.Provider value={{buttonId, subNavId}}>
      <Box as="li" aria-labelledby={buttonId} sx={{listStyle: 'none'}}>
        {/* TODO: parent of aria-current should be bold, and have active styles if closed */}
        <ActionList.Item
          role="button"
          id={buttonId}
          aria-expanded={isOpen}
          aria-controls={subNavId}
          onSelect={() => setIsOpen(open => !open)}
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

        {isOpen ? <div ref={subNavRef}>{subNav}</div> : null}
      </Box>
    </ItemWithSubNavContext.Provider>
  )
}

// ----------------------------------------------------------------------------
// NavList.SubNav

type NavListSubNavProps = {
  children: React.ReactNode
  // sx
}

// SubNav must be a direct child of an Item
// TODO: Forward ref
const SubNav = ({children}: NavListSubNavProps) => {
  const {buttonId, subNavId} = React.useContext(ItemWithSubNavContext)
  const {depth} = React.useContext(ItemContext)

  if (!buttonId || !subNavId) {
    // eslint-disable-next-line no-console
    console.error('NavList.SubNav must be a child of a NavList.Item')
  }

  return (
    <ItemContext.Provider value={{depth: depth + 1}}>
      <Box as="ul" id={subNavId} aria-labelledby={buttonId} sx={{padding: 0, margin: 0}}>
        {children}
      </Box>
    </ItemContext.Provider>
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

// TODO: Dividers between groups
// TODO: Forward ref
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
