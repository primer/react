import React from 'react'
import {ActionList} from '../ActionList'

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

const Item = React.forwardRef<HTMLAnchorElement, NavListItemProps>(
  ({href, 'aria-current': ariaCurrent, children}, ref) => {
    return (
      <ActionList.LinkItem
        ref={ref}
        href={href}
        aria-current={ariaCurrent}
        sx={{
          position: 'relative',
          '&[aria-current]': {
            fontWeight: 'bold',
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
  LeadingVisual,
  TrailingVisual,
  Divider,
  Group
})
