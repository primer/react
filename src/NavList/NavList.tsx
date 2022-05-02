import React from 'react'
import {ActionList} from '../ActionList'

// ----------------------------------------------------------------------------
// NavList

export type NavListProps = {
  'aria-label'?: string
}

const Root = React.forwardRef<HTMLElement, NavListProps>(({children}, ref) => {
  return (
    <nav ref={ref}>
      <ActionList>{children}</ActionList>
    </nav>
  )
})

Root.displayName = 'NavList'

// ----------------------------------------------------------------------------
// NavList.Item

export type NavListItemProps = {
  href?: string
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' | boolean
}

const Item = React.forwardRef<HTMLAnchorElement, NavListItemProps>(
  ({href, 'aria-current': ariaCurrent, children}, ref) => {
    return (
      <ActionList.LinkItem ref={ref} href={href} aria-current={ariaCurrent}>
        {children}
      </ActionList.LinkItem>
    )
  }
)

// ----------------------------------------------------------------------------
// Export

export const NavList = Object.assign(Root, {
  Item
})
