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
  /**
   * Is `UnderlineNav.Item` current page?
   */
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false' | boolean
  /**
   * Callback that will trigger both on click selection and keyboard selection.
   */
  onMenuItemClick?: (event: React.MouseEvent<HTMLAnchorElement> | React.KeyboardEvent<HTMLAnchorElement>) => void
} & SxProp &
  LinkProps

export const MenuItemLink = React.forwardRef<HTMLAnchorElement, MenuItemLinkProps>(
  ({children, counter, 'aria-current': ariaCurrent, ...props}, forwardedRef) => {
    const {loadingCounters} = useContext(UnderlineNavContext)

    if (Boolean(ariaCurrent) && ariaCurrent !== 'false') {
      const event = new MouseEvent('click')
      //   @ts-ignore for now
      typeof props.onMenuItemClick === 'function' && props.onMenuItemClick(event)
    }
    return (
      <ActionList.LinkItem
        ref={forwardedRef}
        sx={menuItemStyles}
        active={false}
        onClick={() => {
          const event = new MouseEvent('click')
          //   @ts-ignore for now
          typeof props.onMenuItemClick === 'function' && props.onMenuItemClick(event)
        }}
        {...props}
      >
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
