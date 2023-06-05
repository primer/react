import React, {useContext} from 'react'
import Box from '../Box'
import {SxProp} from '../sx'
import CounterLabel from '../CounterLabel'
import {LoadingCounter} from './LoadingCounter'
import {ActionList} from '../ActionList'
import {ForwardRefComponent as PolymorphicForwardRefComponent} from '../utils/polymorphic'
import {menuItemStyles} from './styles'
import {UnderlineNavContext} from './UnderlineNavContext'
import {LinkProps} from './UnderlineNavItem'

export type MenuItemLinkProps = {
  /**
   * Primary content for the menu item link
   */
  children?: React.ReactNode
  /**
   * Counter
   */
  counter?: number | string
} & SxProp &
  LinkProps

export const MenuItemLink = React.forwardRef<HTMLAnchorElement, MenuItemLinkProps>(
  ({children, counter, ...props}, forwardedRef) => {
    const {loadingCounters} = useContext(UnderlineNavContext)

    return (
      <ActionList.LinkItem ref={forwardedRef} sx={menuItemStyles} active={false} {...props}>
        <Box as="span" sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          {children}

          {loadingCounters ? (
            <LoadingCounter />
          ) : (
            counter !== undefined && (
              <Box as="span" data-component="counter">
                <CounterLabel>{counter}</CounterLabel>
              </Box>
            )
          )}
        </Box>
      </ActionList.LinkItem>
    )
  },
) as PolymorphicForwardRefComponent<'a', MenuItemLinkProps>

MenuItemLink.displayName = 'UnderlineNav2.MenuItemLink'
